"""
API routes: exposes the ingestion/screening/risk/maneuver/alert pipeline
to the Next.js frontend.

Response shape note: hand-serializes SQLAlchemy objects into dicts rather
than using Pydantic response models, to keep this file self-contained while
the schema is still actively changing. Worth migrating to Pydantic schemas
once the data shape stabilizes and the frontend is actually consuming this.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.db import SessionLocal
from app.models.models import SpaceObject, ConjunctionEvent, RiskAssessment, Maneuver, Alert
from app.propagation.propagator import propagate_object

router = APIRouter()


# ---------- serialization helpers ----------

def serialize_object(obj: SpaceObject) -> dict:
    return {
        "id": obj.id,
        "norad_cat_id": obj.norad_cat_id,
        "object_name": obj.object_name,
        "object_id": obj.object_id,
        "type": obj.type,
        "is_own_asset": obj.is_own_asset,
        "source_file": obj.source_file,
    }


def serialize_conjunction(event: ConjunctionEvent) -> dict:
    latest_assessment = (
        max(event.risk_assessments, key=lambda ra: ra.computed_at)
        if event.risk_assessments else None
    )
    return {
        "id": event.id,
        "object_a": serialize_object(event.object_a),
        "object_b": serialize_object(event.object_b),
        "tca": event.tca.isoformat(),
        "miss_distance_km": event.miss_distance_km,
        "relative_velocity_kmps": event.relative_velocity_kmps,
        "status": event.status,
        "risk_tier": latest_assessment.risk_tier if latest_assessment else None,
        "pc": latest_assessment.pc if latest_assessment else None,
        "risk_method": latest_assessment.method if latest_assessment else None,
    }


def serialize_maneuver(m: Maneuver) -> dict:
    return {
        "id": m.id,
        "conjunction_event_id": m.conjunction_event_id,
        "asset": serialize_object(m.asset),
        "delta_v_mps": m.delta_v_mps,
        "predicted_new_miss_distance_km": m.predicted_new_miss_distance_km,
        "fuel_cost_kg": m.fuel_cost_kg,
        "status": m.status,
        "proposed_at": m.proposed_at.isoformat(),
        "decided_by": m.decided_by,
        "decided_at": m.decided_at.isoformat() if m.decided_at else None,
        "notes": m.notes,
    }


def serialize_alert(a: Alert) -> dict:
    return {
        "id": a.id,
        "conjunction_event_id": a.conjunction_event_id,
        "severity": a.severity,
        "message": a.message,
        "channels_sent": a.channels_sent,
        "created_at": a.created_at.isoformat(),
        "acknowledged_by": a.acknowledged_by,
        "acknowledged_at": a.acknowledged_at.isoformat() if a.acknowledged_at else None,
    }


# ---------- objects ----------

@router.get("/objects")
def list_objects(
    type: str | None = Query(None, description="Filter by satellite|station|debris"),
    limit: int = Query(100, le=1000),
    offset: int = 0,
):
    session = SessionLocal()
    try:
        query = session.query(SpaceObject)
        if type:
            query = query.filter_by(type=type)
        objects = query.offset(offset).limit(limit).all()
        total = query.count()
        return {"total": total, "objects": [serialize_object(o) for o in objects]}
    finally:
        session.close()


@router.get("/objects/positions")
def get_object_positions(
    type: str | None = Query(None, description="Filter by satellite|station|debris"),
    limit: int = Query(300, le=2000),
    at: str | None = Query(None, description="ISO timestamp, defaults to now (UTC)"),
):
    """
    Real SGP4-propagated positions for the 3D globe, replacing the previous
    placeholder (array index + random offset) positions. Returns raw
    position in km, Earth-centered inertial (TEME) frame — the frontend
    scales this to render units and picks its own axis mapping.

    Objects with propagation errors (e.g. decayed orbits, bad elements) are
    silently skipped and counted in `skipped` rather than failing the whole
    request — with a 300-2000 object sample, a handful of bad elements is
    expected and shouldn't break the visualization.
    """
    session = SessionLocal()
    try:
        when = datetime.fromisoformat(at) if at else datetime.now(timezone.utc)
        if when.tzinfo is None:
            when = when.replace(tzinfo=timezone.utc)

        query = session.query(SpaceObject)
        if type:
            query = query.filter_by(type=type)
        objects = query.limit(limit).all()

        positions = []
        skipped = 0
        for obj in objects:
            try:
                result = propagate_object(obj, when)
            except ValueError:
                skipped += 1
                continue
            if result["error"] != 0:
                skipped += 1
                continue
            x, y, z = result["position_km"]
            positions.append({
                "id": obj.id,
                "object_name": obj.object_name,
                "type": obj.type,
                "position_km": [x, y, z],
            })

        return {
            "total": len(positions),
            "skipped": skipped,
            "at": when.isoformat(),
            "positions": positions,
        }
    finally:
        session.close()


@router.get("/objects/{object_id}")
def get_object(object_id: str):
    session = SessionLocal()
    try:
        obj = session.query(SpaceObject).filter_by(id=object_id).first()
        if not obj:
            raise HTTPException(404, "Object not found")
        return serialize_object(obj)
    finally:
        session.close()


# ---------- conjunctions ----------

@router.get("/conjunctions")
def list_conjunctions(
    status: str = Query("active"),
    risk_tier: str | None = Query(None, description="Filter by critical|high|watch|low"),
    limit: int = Query(100, le=1000),
):
    session = SessionLocal()
    try:
        query = session.query(ConjunctionEvent).filter_by(status=status)
        events = query.limit(limit).all()

        serialized = [serialize_conjunction(e) for e in events]
        if risk_tier:
            serialized = [e for e in serialized if e["risk_tier"] == risk_tier]

        return {"total": len(serialized), "conjunctions": serialized}
    finally:
        session.close()


@router.get("/conjunctions/{event_id}")
def get_conjunction(event_id: str):
    session = SessionLocal()
    try:
        event = session.query(ConjunctionEvent).filter_by(id=event_id).first()
        if not event:
            raise HTTPException(404, "Conjunction event not found")
        return serialize_conjunction(event)
    finally:
        session.close()


# ---------- maneuvers ----------

class ManeuverDecision(BaseModel):
    decided_by: str
    notes: str | None = None


@router.get("/maneuvers")
def list_maneuvers(status: str | None = Query(None)):
    session = SessionLocal()
    try:
        query = session.query(Maneuver)
        if status:
            query = query.filter_by(status=status)
        maneuvers = query.all()
        return {"total": len(maneuvers), "maneuvers": [serialize_maneuver(m) for m in maneuvers]}
    finally:
        session.close()


@router.post("/maneuvers/{maneuver_id}/approve")
def approve_maneuver_endpoint(maneuver_id: str, decision: ManeuverDecision):
    session = SessionLocal()
    try:
        maneuver = session.query(Maneuver).filter_by(id=maneuver_id).first()
        if not maneuver:
            raise HTTPException(404, "Maneuver not found")
        maneuver.status = "approved"
        maneuver.decided_by = decision.decided_by
        maneuver.decided_at = datetime.now(timezone.utc)
        maneuver.notes = decision.notes
        session.commit()
        return serialize_maneuver(maneuver)
    finally:
        session.close()


@router.post("/maneuvers/{maneuver_id}/reject")
def reject_maneuver_endpoint(maneuver_id: str, decision: ManeuverDecision):
    session = SessionLocal()
    try:
        maneuver = session.query(Maneuver).filter_by(id=maneuver_id).first()
        if not maneuver:
            raise HTTPException(404, "Maneuver not found")
        maneuver.status = "rejected"
        maneuver.decided_by = decision.decided_by
        maneuver.decided_at = datetime.now(timezone.utc)
        maneuver.notes = decision.notes
        session.commit()
        return serialize_maneuver(maneuver)
    finally:
        session.close()


# ---------- alerts ----------

class AlertAcknowledgement(BaseModel):
    acknowledged_by: str


@router.get("/alerts")
def list_alerts(unacknowledged_only: bool = Query(False)):
    session = SessionLocal()
    try:
        query = session.query(Alert)
        if unacknowledged_only:
            query = query.filter_by(acknowledged_at=None)
        alerts = query.order_by(Alert.created_at.desc()).all()
        return {"total": len(alerts), "alerts": [serialize_alert(a) for a in alerts]}
    finally:
        session.close()


@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert_endpoint(alert_id: str, ack: AlertAcknowledgement):
    session = SessionLocal()
    try:
        alert = session.query(Alert).filter_by(id=alert_id).first()
        if not alert:
            raise HTTPException(404, "Alert not found")
        alert.acknowledged_by = ack.acknowledged_by
        alert.acknowledged_at = datetime.now(timezone.utc)
        session.commit()
        return serialize_alert(alert)
    finally:
        session.close()


# ---------- dashboard summary ----------

@router.get("/stats/summary")
def stats_summary():
    """Powers the Command Overview KPI strip: object counts, active risk, pending actions."""
    session = SessionLocal()
    try:
        total_objects = session.query(SpaceObject).count()
        satellites = session.query(SpaceObject).filter_by(type="satellite").count()
        stations = session.query(SpaceObject).filter_by(type="station").count()
        debris = session.query(SpaceObject).filter_by(type="debris").count()

        active_conjunctions = session.query(ConjunctionEvent).filter_by(status="active").count()
        pending_maneuvers = session.query(Maneuver).filter_by(status="proposed").count()
        unacknowledged_alerts = session.query(Alert).filter_by(acknowledged_at=None).count()

        return {
            "total_objects": total_objects,
            "satellites": satellites,
            "stations": stations,
            "debris": debris,
            "active_conjunctions": active_conjunctions,
            "pending_maneuvers": pending_maneuvers,
            "unacknowledged_alerts": unacknowledged_alerts,
        }
    finally:
        session.close()
"""
Conjunction screening: finds pairs of objects that come within a dangerous
distance of each other, and persists them as ConjunctionEvent rows.

Two-stage filter, since ~17,700 objects means ~157M possible pairs:
  Stage 1 (coarse): only compare objects whose orbital altitude bands,
                     inclination, AND RAAN (orbital plane) are all close
                     enough to plausibly overlap. Altitude and inclination
                     alone are weak filters at megaconstellation density —
                     Starlink/OneWeb use just a handful of discrete
                     inclination shells shared by thousands of satellites,
                     so RAAN (which specific plane within the shell) is
                     what actually separates candidates into a manageable set.
  Stage 2 (fine):   actually propagate candidate pairs at fine time steps
                     near their potential crossing point, find true min distance

Known simplification: a tight RAAN filter can occasionally miss real close
approaches near the poles, where orbital planes at different RAAN values
geometrically converge even though they're "far apart" by simple degree
difference. This is a standard first-pass simplification real SSA tools
also make; not a substitute for a full geometric plane-crossing calculation.

Docked station modules and currently-docked visiting spacecraft (Progress,
Cygnus, Crew Dragon, Soyuz, etc.) share the station's orbital elements while
attached, so they're skipped as a group — not an independent risk between
each other. Membership in this group is checked two ways since the source
data is inconsistent: some ISS modules (UNITY, ZVEZDA, DESTINY) are only
tagged type='satellite', while others (ZARYA, NAUKA) and visiting craft are
tagged type='station'.

DANGER_DISTANCE_KM is intentionally tight (5km, not 25km) because at
megaconstellation density, a looser threshold produces hundreds of routine,
low-risk hits — "conjunction alert fatigue," a known real-world SSA problem.
This is a coarse pre-filter only; actual risk triage happens in
risk/probability.py, which computes Pc from these events.

Run directly: python -m app.screening.conjunction [limit]
"""

import logging
from datetime import datetime, timedelta, timezone

from app.db import SessionLocal, init_db
from app.models.models import SpaceObject, ConjunctionEvent, new_uuid
from app.propagation.propagator import propagate_object

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

EARTH_RADIUS_KM = 6378.137
MU_EARTH = 398600.4418  # km^3/s^2, standard gravitational parameter

# Screening thresholds
ALTITUDE_BAND_TOLERANCE_KM = 50     # stage 1: how close two orbits' altitude bands must be to bother checking
INCLINATION_TOLERANCE_DEG = 5.0      # stage 1: orbital planes must be within this angle to bother checking
RAAN_TOLERANCE_DEG = 3.0             # stage 1: orbital planes must share nearly the same RAAN to bother checking
DANGER_DISTANCE_KM = 5                # stage 2: flag as a conjunction if closer than this
COARSE_TIME_STEP_SECONDS = 60         # stage 2: initial scan resolution
FINE_TIME_STEP_SECONDS = 1            # stage 2: refine around the closest coarse point
SCREEN_WINDOW_HOURS = 24              # how far into the future to check


def semi_major_axis_km(mean_motion_revs_per_day: float) -> float:
    """Kepler's third law: mean motion (revs/day) -> semi-major axis (km)."""
    n_rad_per_sec = mean_motion_revs_per_day * 2 * 3.141592653589793 / 86400.0
    a = (MU_EARTH / (n_rad_per_sec ** 2)) ** (1 / 3)
    return a


def approx_altitude_km(space_object: SpaceObject) -> float | None:
    """Rough altitude estimate from an object's latest orbital element (for coarse filtering only)."""
    if not space_object.elements:
        return None
    latest = max(space_object.elements, key=lambda e: e.epoch)
    a = semi_major_axis_km(latest.mean_motion)
    return a - EARTH_RADIUS_KM


def latest_inclination_deg(space_object: SpaceObject) -> float | None:
    """Latest orbital plane inclination, in degrees (for coarse filtering only)."""
    if not space_object.elements:
        return None
    latest = max(space_object.elements, key=lambda e: e.epoch)
    return latest.inclination


def latest_raan_deg(space_object: SpaceObject) -> float | None:
    """Latest right ascension of ascending node, in degrees (for coarse filtering only)."""
    if not space_object.elements:
        return None
    latest = max(space_object.elements, key=lambda e: e.epoch)
    return latest.ra_of_asc_node


def circular_diff_deg(a: float, b: float) -> float:
    """Smallest angular difference between two degree values, handling the 0/360 wraparound."""
    diff = abs(a - b) % 360
    return min(diff, 360 - diff)


def is_docked_complex_member(obj: SpaceObject) -> bool:
    """
    True if this object is a docked station module or currently-docked
    visiting spacecraft. Checked two ways since the source data is
    inconsistent: some ISS modules (UNITY, ZVEZDA, DESTINY) are only
    tagged type='satellite', while others (ZARYA, NAUKA) and visiting
    craft (Soyuz, Progress, Dragon, Cygnus) are tagged type='station'.
    """
    if obj.type == "station":
        return True
    name = obj.object_name.upper()
    return name.startswith("ISS (") or name.startswith("CSS (")


def same_station_complex(obj_a: SpaceObject, obj_b: SpaceObject) -> bool:
    """
    True if both objects are part of the same docked structure — sharing
    orbital elements while attached, not an independent collision risk
    between each other.
    """
    return is_docked_complex_member(obj_a) and is_docked_complex_member(obj_b)


def coarse_filter(objects: list[SpaceObject]) -> list[tuple[SpaceObject, SpaceObject]]:
    """
    Stage 1: pair up only objects with overlapping altitude bands, similar
    inclination, AND similar RAAN (orbital plane).
    """
    with_data = [
        (obj, approx_altitude_km(obj), latest_inclination_deg(obj), latest_raan_deg(obj))
        for obj in objects
    ]
    with_data = [
        (obj, alt, incl, raan) for obj, alt, incl, raan in with_data
        if alt is not None and incl is not None and raan is not None
    ]
    with_data.sort(key=lambda quad: quad[1])  # sort by altitude, so nearby ones are adjacent

    candidates = []
    n = len(with_data)
    for i in range(n):
        obj_a, alt_a, incl_a, raan_a = with_data[i]
        for j in range(i + 1, n):
            obj_b, alt_b, incl_b, raan_b = with_data[j]
            if alt_b - alt_a > ALTITUDE_BAND_TOLERANCE_KM:
                break  # sorted by altitude, so nothing further can be in range either
            if abs(incl_a - incl_b) > INCLINATION_TOLERANCE_DEG:
                continue
            if circular_diff_deg(raan_a, raan_b) > RAAN_TOLERANCE_DEG:
                continue
            if same_station_complex(obj_a, obj_b):
                continue
            candidates.append((obj_a, obj_b))
    return candidates


def distance_km(pos_a: tuple, pos_b: tuple) -> float:
    return sum((a - b) ** 2 for a, b in zip(pos_a, pos_b)) ** 0.5


def find_closest_approach(obj_a: SpaceObject, obj_b: SpaceObject, start: datetime, hours: int):
    """Stage 2: propagate both objects, scan for minimum distance in the time window."""
    best = {"distance_km": float("inf"), "time": None, "relative_velocity_kmps": None}

    t = start
    end = start + timedelta(hours=hours)
    step = timedelta(seconds=COARSE_TIME_STEP_SECONDS)

    while t <= end:
        try:
            state_a = propagate_object(obj_a, t)
            state_b = propagate_object(obj_b, t)
        except ValueError:
            return None  # missing elements, skip this pair

        if state_a["error"] != 0 or state_b["error"] != 0:
            t += step
            continue

        d = distance_km(state_a["position_km"], state_b["position_km"])
        if d < best["distance_km"]:
            best["distance_km"] = d
            best["time"] = t
            rel_v = tuple(va - vb for va, vb in zip(state_a["velocity_kmps"], state_b["velocity_kmps"]))
            best["relative_velocity_kmps"] = sum(v ** 2 for v in rel_v) ** 0.5

        t += step

    # Refine around the best coarse point with finer resolution, if we found a candidate
    if best["time"] is not None and best["distance_km"] < DANGER_DISTANCE_KM * 3:
        refine_start = best["time"] - timedelta(seconds=COARSE_TIME_STEP_SECONDS)
        refine_end = best["time"] + timedelta(seconds=COARSE_TIME_STEP_SECONDS)
        t = refine_start
        fine_step = timedelta(seconds=FINE_TIME_STEP_SECONDS)
        while t <= refine_end:
            state_a = propagate_object(obj_a, t)
            state_b = propagate_object(obj_b, t)
            if state_a["error"] == 0 and state_b["error"] == 0:
                d = distance_km(state_a["position_km"], state_b["position_km"])
                if d < best["distance_km"]:
                    best["distance_km"] = d
                    best["time"] = t
                    rel_v = tuple(va - vb for va, vb in zip(state_a["velocity_kmps"], state_b["velocity_kmps"]))
                    best["relative_velocity_kmps"] = sum(v ** 2 for v in rel_v) ** 0.5
            t += fine_step

    return best


def screen_all(hours: int = SCREEN_WINDOW_HOURS, limit: int | None = None):
    """
    Full screening run: coarse filter, fine-check every candidate pair,
    and persist genuine conjunctions to the database.

    limit: if set, only screens the first N objects (by DB order) — useful
           for a quick test before running against the full catalog.
    """
    init_db()  # ensures all tables exist, no-op if already present
    session = SessionLocal()
    query = session.query(SpaceObject)
    if limit:
        query = query.limit(limit)
    objects = query.all()
    logger.info(f"Loaded {len(objects)} objects" + (f" (limited to {limit})" if limit else ""))

    candidates = coarse_filter(objects)
    logger.info(f"Coarse filter found {len(candidates)} candidate pairs to check closely")

    now = datetime.now(timezone.utc)
    found_count = 0

    try:
        for obj_a, obj_b in candidates:
            result = find_closest_approach(obj_a, obj_b, now, hours)
            if result and result["distance_km"] < DANGER_DISTANCE_KM:
                event = ConjunctionEvent(
                    id=new_uuid(),
                    object_a_id=obj_a.id,
                    object_b_id=obj_b.id,
                    tca=result["time"],
                    miss_distance_km=round(result["distance_km"], 3),
                    relative_velocity_kmps=round(result["relative_velocity_kmps"], 3),
                    status="active",
                )
                session.add(event)
                found_count += 1
                logger.info(
                    f"CONJUNCTION: {obj_a.object_name} <-> {obj_b.object_name} | "
                    f"miss distance {result['distance_km']:.2f} km at {result['time']}"
                )

        session.commit()
    except Exception:
        session.rollback()
        logger.exception("Screening failed, rolled back this batch.")
        raise
    finally:
        session.close()

    logger.info(f"Screening complete. {found_count} conjunction(s) found and saved.")
    return found_count


if __name__ == "__main__":
    import sys
    limit_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 200
    screen_all(limit=limit_arg)
export type ObjectType = "satellite" | "station" | "debris";
export type RiskTier = "critical" | "high" | "watch" | "low";
export type AlertSeverity = "critical" | "high" | "watch";
export type ManeuverStatus = "proposed" | "under_review" | "approved" | "executed" | "verified" | "rejected";
export type ConjunctionStatus = "active" | "resolved" | "expired";

export interface SpaceObject {
  id: string;
  norad_cat_id: number;
  object_name: string;
  object_id: string | null;
  type: ObjectType;
  source_file: string;
  is_own_asset: boolean;
}

export interface ObjectPosition {
  id: string;
  object_name: string;
  type: ObjectType;
  position_km: [number, number, number];
}

export interface ConjunctionEvent {
  id: string;
  object_a: SpaceObject;
  object_b: SpaceObject;
  tca: string;
  miss_distance_km: number;
  relative_velocity_kmps: number | null;
  status: ConjunctionStatus;
  risk_tier: RiskTier | null;
  pc: number | null;
  risk_method: string | null;
}

export interface Maneuver {
  id: string;
  conjunction_event_id: string;
  asset: SpaceObject;
  delta_v_mps: number;
  predicted_new_miss_distance_km: number;
  fuel_cost_kg: number | null;
  status: ManeuverStatus;
  proposed_at: string;
  decided_by: string | null;
  decided_at: string | null;
  notes: string | null;
}

export interface Alert {
  id: string;
  conjunction_event_id: string;
  severity: AlertSeverity;
  message: string;
  channels_sent: string | null;
  created_at: string;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
}

export interface StatsSummary {
  total_objects: number;
  satellites: number;
  stations: number;
  debris: number;
  active_conjunctions: number;
  pending_maneuvers: number;
  unacknowledged_alerts: number;
}

export interface SimulationResultItem {
  object_name: string;
  object_type: string;
  miss_distance_km: number;
  tca: string;
  relative_velocity_kmps: number;
  pc: number;
  risk_tier: RiskTier;
}

export interface NewObjectSimulationResult {
  simulated_object: string;
  candidates_checked: number;
  conjunctions_found: number;
  results: SimulationResultItem[];
}

export interface ManeuverSimulationResult {
  asset: string;
  threat: string;
  current_miss_distance_km: number;
  current_pc: number;
  current_risk_tier: RiskTier;
  applied_delta_v_mps: number;
  predicted_new_miss_distance_km: number;
  predicted_new_pc: number;
  predicted_new_risk_tier: RiskTier;
}

export interface ResponseTimeMetrics {
  alert_acknowledgement: {
    count: number;
    avg_seconds: number | null;
    median_seconds: number | null;
  };
  maneuver_decision: {
    count: number;
    avg_seconds: number | null;
    median_seconds: number | null;
  };
}
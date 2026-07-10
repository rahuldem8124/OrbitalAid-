import { fetchManeuvers } from "@/lib/api";
import GlassPanel from "@/components/ui/GlassPanel";
import ManeuverActions from "./ManeuverActions";

export const dynamic = "force-dynamic";

export default async function ManeuversPage() {
  const { maneuvers } = await fetchManeuvers();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Maneuver & Preventive Actions</h1>

      <div className="grid gap-4">
        {maneuvers.map((m) => (
          <GlassPanel key={m.id} className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{m.asset.object_name}</p>
              <div className="flex gap-6 mt-1 text-xs text-white/50">
                <span>Δv: <span className="text-cyan-400 font-mono">{m.delta_v_mps.toFixed(3)} m/s</span></span>
                <span>New miss distance: <span className="text-cyan-400 font-mono">{m.predicted_new_miss_distance_km} km</span></span>
                <span>Status: <span className="text-white/70 uppercase">{m.status}</span></span>
              </div>
            </div>
            {m.status === "proposed" && <ManeuverActions maneuverId={m.id} />}
          </GlassPanel>
        ))}
        {maneuvers.length === 0 && (
          <GlassPanel>
            <p className="text-white/40 text-center py-8">No maneuvers proposed.</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
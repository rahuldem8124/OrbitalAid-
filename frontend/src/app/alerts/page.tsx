import { fetchAlerts } from "@/lib/api";
import GlassPanel from "@/components/ui/GlassPanel";
import AlertActions from "./AlertActions";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const { alerts } = await fetchAlerts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Alerts & Notifications</h1>

      <div className="grid gap-3">
        {alerts.map((a) => (
          <GlassPanel key={a.id} className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs uppercase font-bold mb-1">{a.severity}</p>
              <p className="text-white text-sm">{a.message}</p>
              <p className="text-white/40 text-xs mt-1">{new Date(a.created_at).toLocaleString()}</p>
            </div>
            {!a.acknowledged_at && <AlertActions alertId={a.id} />}
          </GlassPanel>
        ))}
        {alerts.length === 0 && (
          <GlassPanel>
            <p className="text-white/40 text-center py-8">No alerts.</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
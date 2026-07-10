import {
  fetchStats,
  fetchConjunctions,
  fetchAlerts,
  fetchManeuvers,
  fetchObjectPositions,
} from "@/lib/api";
import KPIStrip from "@/components/dashboard/KPIStrip";
import Globe from "@/components/dashboard/Globe";
import RiskList from "@/components/dashboard/RiskList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

// Always fetch fresh data on each request rather than caching at build
// time — this dashboard is only useful if the numbers are current.
export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const [stats, conjunctionsRes, alertsRes, maneuversRes, positionsRes] =
      await Promise.all([
        fetchStats(),
        fetchConjunctions("active"),
        fetchAlerts(),
        fetchManeuvers(),
        // Real SGP4-propagated positions for 300 objects, not all 17,724 —
        // rendering every tracked object as a mesh would be too heavy for now.
        fetchObjectPositions(undefined, 300),
      ]);

    return (
      <div className="flex flex-col gap-6">
        <KPIStrip stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="lg:col-span-2 h-full">
            <Globe positions={positionsRes.positions} />
          </div>
          <div className="h-full">
            <RiskList conjunctions={conjunctionsRes.conjunctions} />
          </div>
        </div>

        <div className="h-[400px]">
          <ActivityFeed alerts={alertsRes.alerts} maneuvers={maneuversRes.maneuvers} />
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">
            Could not reach the OrbitalAid backend.
          </p>
          <p className="text-white/50 text-sm">
            Make sure it&apos;s running at{" "}
            <code className="text-cyan-400">http://localhost:8000</code>{" "}
            (<code className="text-cyan-400">py -m uvicorn app.main:app --reload --port 8000</code>)
            and refresh this page.
          </p>
        </div>
      </div>
    );
  }
}
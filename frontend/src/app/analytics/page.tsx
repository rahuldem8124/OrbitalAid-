import {
  fetchRiskDistribution,
  fetchAltitudeDistribution,
  fetchResponseTimes,
} from "@/lib/api";
import GlassPanel from "@/components/ui/GlassPanel";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  try {
    const [riskDist, altitudeDist, responseTimes] = await Promise.all([
      fetchRiskDistribution(),
      fetchAltitudeDistribution(),
      fetchResponseTimes(),
    ]);

    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-white text-2xl font-semibold">Analytics & Reporting</h1>

        <GlassPanel>
          <p className="text-amber-400/80 text-xs leading-relaxed">
            Showing current snapshot metrics. Trend-over-time analytics (e.g. debris growth) require scheduled
            recurring screening runs, not yet configured for this deployment.
          </p>
        </GlassPanel>

        <AnalyticsCharts
          riskDistribution={riskDist}
          altitudeDistribution={altitudeDist}
          responseTimes={responseTimes}
        />
      </div>
    );
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-white text-2xl font-semibold">Analytics & Reporting</h1>
        <GlassPanel className="flex items-center justify-center py-12">
          <p className="text-red-400 text-sm">
            Could not load analytics — make sure the backend is running.
          </p>
        </GlassPanel>
      </div>
    );
  }
}

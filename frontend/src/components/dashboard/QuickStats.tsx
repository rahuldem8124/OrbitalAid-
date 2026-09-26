"use client";

import { ConjunctionAnalytics } from "@/lib/types";

interface Props {
  analytics: ConjunctionAnalytics;
}

export default function QuickStats({ analytics }: Props) {
  const byRisk = analytics.by_risk_tier || {};
  const critical = byRisk.critical || 0;
  const high = byRisk.high || 0;
  const watch = byRisk.watch || 0;
  const low = byRisk.low || 0;

  return (
    <div className="bg-[#111827] border border-[#1e293b] rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#1e293b]">
        <h2 className="text-[#2dd4bf] font-mono text-sm tracking-widest font-semibold">QUICK STATS SUMMARY</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-[#94a3b8] text-xs font-medium mb-3 uppercase tracking-wider">Conjunction Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                <span className="text-sm text-[#e2e8f0]">Critical</span>
              </div>
              <span className="text-sm font-mono text-[#e2e8f0]">{critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f97316]"></div>
                <span className="text-sm text-[#e2e8f0]">High</span>
              </div>
              <span className="text-sm font-mono text-[#e2e8f0]">{high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#eab308]"></div>
                <span className="text-sm text-[#e2e8f0]">Watch</span>
              </div>
              <span className="text-sm font-mono text-[#e2e8f0]">{watch}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                <span className="text-sm text-[#e2e8f0]">Low</span>
              </div>
              <span className="text-sm font-mono text-[#e2e8f0]">{low}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-[#94a3b8] text-xs font-medium mb-3 uppercase tracking-wider">Maneuver Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#e2e8f0]">Required</span>
              <span className="text-sm font-mono text-[#e2e8f0]">{analytics.maneuver_required || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#e2e8f0]">Pending</span>
              <span className="text-sm font-mono text-[#e2e8f0]">{analytics.maneuver_pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#e2e8f0]">Approved</span>
              <span className="text-sm font-mono text-[#22c55e]">{analytics.maneuver_approved || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#e2e8f0]">Mitigated</span>
              <span className="text-sm font-mono text-[#2dd4bf]">{analytics.conjunctions_mitigated || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

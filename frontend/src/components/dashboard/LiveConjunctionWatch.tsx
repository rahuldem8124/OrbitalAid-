"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConjunctionWithDetails } from "@/lib/types";
import RiskBadge from "@/components/shared/RiskBadge";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
  conjunctions: ConjunctionWithDetails[];
}

function Countdown({ tca }: { tca: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(tca).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("TCA PASSED");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`T-${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [tca]);

  return <span className="font-mono text-xs">{timeLeft}</span>;
}

export default function LiveConjunctionWatch({ conjunctions }: Props) {
  if (!conjunctions || conjunctions.length === 0) {
    return (
      <div className="bg-[#111827] border border-[#1e293b] rounded-xl flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-[#1e293b]">
          <h2 className="text-[#2dd4bf] font-mono text-sm tracking-widest font-semibold">LIVE CONJUNCTION WATCH</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState title="No Active Conjunctions" description="No high-risk conjunctions detected." />
        </div>
      </div>
    );
  }

  // Sort by critical first, then by closest TCA
  const sorted = [...conjunctions].sort((a, b) => {
    const riskWeight = { critical: 4, high: 3, watch: 2, low: 1 };
    const aRisk = a.risk_tier ? riskWeight[a.risk_tier] : 0;
    const bRisk = b.risk_tier ? riskWeight[b.risk_tier] : 0;
    if (aRisk !== bRisk) return bRisk - aRisk;
    return new Date(a.tca).getTime() - new Date(b.tca).getTime();
  }).slice(0, 8);

  return (
    <div className="bg-[#111827] border border-[#1e293b] rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
        <h2 className="text-[#2dd4bf] font-mono text-sm tracking-widest font-semibold">LIVE CONJUNCTION WATCH</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-[#1e293b]">
          {sorted.map(conj => (
            <Link href={`/conjunctions`} key={conj.id} className="block p-4 hover:bg-[#1a2332] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 text-sm text-[#e2e8f0] font-medium">
                  <span className="truncate max-w-[100px]" title={conj.object_a_name || conj.object_a?.object_name}>
                    {conj.object_a_name || conj.object_a?.object_name}
                  </span>
                  <span className="text-[#64748b]">vs</span>
                  <span className="truncate max-w-[100px]" title={conj.object_b_name || conj.object_b?.object_name}>
                    {conj.object_b_name || conj.object_b?.object_name}
                  </span>
                </div>
                <RiskBadge tier={conj.risk_tier} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#64748b] block mb-1">Miss Distance</span>
                  <span className="font-mono text-[#e2e8f0]">
                    {conj.miss_distance_km ? conj.miss_distance_km.toFixed(3) : '---'} km
                  </span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-1">TCA Countdown</span>
                  <span className="text-[#eab308]">
                    <Countdown tca={conj.tca} />
                  </span>
                </div>
              </div>
              {conj.preventive_action && (
                <div className="mt-3 pt-3 border-t border-[#1e293b] border-dashed text-xs text-[#94a3b8] flex justify-between">
                  <span>Action:</span>
                  <span className="font-medium text-[#e2e8f0]">{conj.preventive_action}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

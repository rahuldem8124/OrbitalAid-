"use client";

import { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

export default function MetricCard({ label, value, subValue, icon, trend, variant = 'default' }: MetricCardProps) {
  let borderGlow = "border-[#1e293b]";
  let iconColor = "text-[#94a3b8]";

  if (variant === 'critical') {
    borderGlow = "border-[#ef4444]/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
    iconColor = "text-[#ef4444]";
  } else if (variant === 'warning') {
    borderGlow = "border-[#eab308]/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]";
    iconColor = "text-[#eab308]";
  } else if (variant === 'success') {
    borderGlow = "border-[#22c55e]/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
    iconColor = "text-[#22c55e]";
  }

  return (
    <div className={`bg-[#111827] border ${borderGlow} rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group`}>
      <div className="flex justify-between items-start">
        <span className="text-[#94a3b8] text-sm font-medium">{label}</span>
        {icon && <div className={`${iconColor} opacity-80 group-hover:opacity-100 transition-opacity`}>{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[#e2e8f0] font-mono-data tracking-tight">{value}</span>
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-[#ef4444]' : trend === 'down' ? 'text-[#22c55e]' : 'text-[#94a3b8]'}`}>
            {trend === 'up' ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : trend === 'down' ? <ArrowDownIcon className="w-3 h-3 mr-1" /> : <MinusIcon className="w-3 h-3 mr-1" />}
          </span>
        )}
      </div>
      
      {subValue && (
        <span className="text-xs text-[#64748b]">{subValue}</span>
      )}
    </div>
  );
}

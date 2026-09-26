"use client";

import { RiskTier } from "@/lib/types";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface RiskBadgeProps {
  tier: RiskTier | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskBadge({ tier, size = 'md' }: RiskBadgeProps) {
  if (!tier) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-gray-600 bg-gray-800/50 px-2.5 py-0.5 text-xs font-medium text-gray-400 ${size === 'lg' ? 'text-sm py-1 px-3' : size === 'sm' ? 'text-[10px] py-0 px-2' : ''}`}>
        UNASSESSED
      </span>
    );
  }

  const config = {
    critical: {
      icon: XCircle,
      color: "text-[#ef4444]",
      bgColor: "bg-[#ef4444]/10",
      borderColor: "border-[#ef4444]/30",
      label: "CRITICAL",
    },
    high: {
      icon: AlertTriangle,
      color: "text-[#f97316]",
      bgColor: "bg-[#f97316]/10",
      borderColor: "border-[#f97316]/30",
      label: "HIGH",
    },
    watch: {
      icon: AlertCircle,
      color: "text-[#eab308]",
      bgColor: "bg-[#eab308]/10",
      borderColor: "border-[#eab308]/30",
      label: "WATCH",
    },
    low: {
      icon: CheckCircle,
      color: "text-[#22c55e]",
      bgColor: "bg-[#22c55e]/10",
      borderColor: "border-[#22c55e]/30",
      label: "LOW",
    },
  }[tier];

  const Icon = config.icon;
  const sizeClasses = size === 'lg' ? 'text-sm py-1 px-3' : size === 'sm' ? 'text-[10px] py-0 px-2' : 'text-xs py-0.5 px-2.5';
  const iconSize = size === 'lg' ? 'w-4 h-4' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono ${config.bgColor} ${config.borderColor} ${config.color} ${sizeClasses}`}>
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}

"use client";

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
}

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  
  let colorClass = "text-gray-400 bg-gray-800 border-gray-700";
  
  if (["active", "approved", "resolved", "executed"].includes(normalizedStatus)) {
    colorClass = "text-[#2dd4bf] bg-[#2dd4bf]/10 border-[#2dd4bf]/30";
  } else if (["pending", "proposed", "under_review"].includes(normalizedStatus)) {
    colorClass = "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/30";
  } else if (["rejected", "expired"].includes(normalizedStatus)) {
    colorClass = "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30";
  } else if (["verified"].includes(normalizedStatus)) {
    colorClass = "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/30";
  }

  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-mono uppercase tracking-wider";
  
  if (variant === 'outline') {
    return (
      <span className={`${baseClass} border ${colorClass.replace(/bg-\[[^\]]+\]\/10/g, 'bg-transparent')} ${colorClass.match(/text-\[[^\]]+\]/)?.[0] || 'text-gray-400'}`}>
        {status}
      </span>
    );
  }

  return (
    <span className={`${baseClass} border ${colorClass}`}>
      {status}
    </span>
  );
}

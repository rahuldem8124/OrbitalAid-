"use client";

interface SystemHealthIndicatorProps {
  status: 'online' | 'offline' | 'degraded';
  label?: string;
}

export default function SystemHealthIndicator({ status, label }: SystemHealthIndicatorProps) {
  const config = {
    online: { color: "bg-[#22c55e]", shadow: "shadow-[0_0_8px_rgba(34,197,94,0.5)]" },
    degraded: { color: "bg-[#eab308]", shadow: "shadow-[0_0_8px_rgba(234,179,8,0.5)]" },
    offline: { color: "bg-[#ef4444]", shadow: "shadow-[0_0_8px_rgba(239,68,68,0.5)]" },
  }[status];

  return (
    <div className="flex items-center gap-2" title={`System Status: ${status}`}>
      <div className="relative flex items-center justify-center">
        <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.shadow} z-10`}></div>
        {status === 'online' && (
          <div className="absolute w-4 h-4 rounded-full bg-[#22c55e]/30 animate-ping"></div>
        )}
      </div>
      {label && <span className="text-xs font-medium text-[#94a3b8]">{label}</span>}
    </div>
  );
}

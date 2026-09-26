"use client";

import { Clock } from "lucide-react";

interface TimelineEvent {
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return <div className="text-sm text-[#64748b] text-center py-4">No events recorded.</div>;
  }

  return (
    <div className="relative border-l-2 border-[#1e293b] ml-3 py-2 space-y-6">
      {events.map((event, idx) => (
        <div key={idx} className="relative pl-6 group">
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#2dd4bf] ring-4 ring-[#111827] group-hover:scale-125 transition-transform" />
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#e2e8f0]">{event.action}</span>
              <span className="text-xs text-[#64748b]">by</span>
              <span className="text-xs font-medium text-[#94a3b8]">{event.actor}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-[#64748b] font-mono-data">
              <Clock className="w-3 h-3" />
              {new Date(event.timestamp).toLocaleString()}
            </div>
            
            {event.details && (
              <div className="mt-2 text-sm text-[#94a3b8] bg-[#1a2332] p-3 rounded-lg border border-[#1e293b]">
                {event.details}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

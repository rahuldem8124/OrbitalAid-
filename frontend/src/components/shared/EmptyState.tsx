"use client";

import { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#1e293b] rounded-xl bg-[#111827]/50">
      <div className="w-12 h-12 bg-[#1a2332] rounded-full flex items-center justify-center mb-4 text-[#64748b]">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-medium text-[#e2e8f0] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#94a3b8] max-w-md mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-[#ef4444]/20 rounded-xl bg-[#ef4444]/5">
      <AlertOctagon className="w-10 h-10 text-[#ef4444] mb-3 opacity-80" />
      <h3 className="text-[#ef4444] font-medium mb-1">{title}</h3>
      <p className="text-sm text-[#ef4444]/70 mb-4 max-w-md">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#1e293b]/80 border border-[#1e293b] text-[#e2e8f0] text-sm rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}

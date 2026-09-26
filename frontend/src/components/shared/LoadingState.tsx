"use client";

interface LoadingStateProps {
  variant?: 'table' | 'cards' | 'detail' | 'chart';
  rows?: number;
}

export default function LoadingState({ variant = 'cards', rows = 3 }: LoadingStateProps) {
  if (variant === 'table') {
    return (
      <div className="w-full border border-[#1e293b] rounded-xl overflow-hidden bg-[#111827]">
        <div className="h-12 bg-[#1a2332] border-b border-[#1e293b]"></div>
        <div className="divide-y divide-[#1e293b]">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex px-4 py-4 gap-4">
              <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse delay-75"></div>
              <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse delay-150"></div>
              <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse delay-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/5 rounded w-1/2 animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-white/5 rounded animate-pulse"></div>
          <div className="h-24 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Default to cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-32 bg-[#111827] border border-[#1e293b] rounded-xl p-5 animate-pulse">
          <div className="h-4 bg-white/5 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-white/5 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-white/5 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

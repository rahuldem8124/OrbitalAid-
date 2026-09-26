"use client";

import { X } from "lucide-react";

interface FilterBarProps {
  filters: Array<{
    key: string;
    label: string;
    type: 'select' | 'date' | 'search';
    options?: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
  }>;
  onReset?: () => void;
}

export default function FilterBar({ filters, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-[#111827] border border-[#1e293b] rounded-xl">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label className="text-xs text-[#94a3b8] font-medium">{filter.label}</label>
          {filter.type === 'select' && filter.options ? (
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="bg-[#1a2332] border border-[#1e293b] text-sm text-[#e2e8f0] rounded-md px-2 py-1 focus:outline-none focus:border-[#2dd4bf]/50"
            >
              <option value="">All</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : filter.type === 'date' ? (
            <input
              type="date"
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="bg-[#1a2332] border border-[#1e293b] text-sm text-[#e2e8f0] rounded-md px-2 py-1 focus:outline-none focus:border-[#2dd4bf]/50"
            />
          ) : (
            <input
              type="text"
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              placeholder={`Search ${filter.label}...`}
              className="bg-[#1a2332] border border-[#1e293b] text-sm text-[#e2e8f0] rounded-md px-2 py-1 focus:outline-none focus:border-[#2dd4bf]/50 placeholder:text-[#64748b]"
            />
          )}
        </div>
      ))}
      {onReset && filters.some(f => f.value !== "") && (
        <button
          onClick={onReset}
          className="ml-auto flex items-center gap-1 text-xs text-[#64748b] hover:text-[#e2e8f0] transition-colors"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      )}
    </div>
  );
}

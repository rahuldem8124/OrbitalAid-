"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

interface DataTableProps<T> {
  columns: Array<{ key: string; label: string; sortable?: boolean; render?: (item: T) => ReactNode; width?: string }>;
  data: T[];
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (item: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  total,
  page,
  perPage,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
  onRowClick,
  loading = false,
  emptyMessage = "No results found.",
  rowKey,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / perPage);

  const handleSort = (key: string) => {
    if (!onSort) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'desc');
    }
  };

  return (
    <div className="w-full flex flex-col border border-[#1e293b] rounded-xl overflow-hidden bg-[#111827]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a2332] border-b border-[#1e293b]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-[#e2e8f0]' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="flex-shrink-0">
                        {sortBy === col.key ? (
                          sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {loading ? (
              Array.from({ length: perPage }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  {columns.map((col, j) => (
                    <td key={`skel-${i}-${j}`} className="px-4 py-4">
                      <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[#64748b]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={rowKey(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`group bg-[#111827] hover:bg-[#1e293b] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={`${rowKey(item)}-${col.key}`} className="px-4 py-3 text-sm text-[#e2e8f0]">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e293b] bg-[#1a2332]">
        <div className="text-sm text-[#94a3b8]">
          Showing {Math.min((page - 1) * perPage + 1, total)} to {Math.min(page * perPage, total)} of {total} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="p-1 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-[#e2e8f0] font-medium px-2">
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="p-1 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

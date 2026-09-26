"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SearchResults } from "@/lib/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  results?: SearchResults;
  loading?: boolean;
}

export default function SearchBar({ onSearch, results, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length >= 2) {
        onSearch(query);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search objects, events..."
          className="w-64 bg-[#1a2332] border border-[#1e293b] rounded-lg pl-9 pr-8 py-1.5 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#2dd4bf]/50 focus:ring-1 focus:ring-[#2dd4bf]/20 transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2dd4bf] animate-spin" />
        )}
      </div>

      {isOpen && results && !loading && (
        <div className="absolute top-full mt-2 w-80 bg-[#111827] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto py-2">
            
            {results.objects?.length > 0 && (
              <div className="px-3 py-1.5">
                <div className="text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">Objects</div>
                {results.objects.slice(0, 3).map(obj => (
                  <div key={obj.id} className="px-2 py-1.5 hover:bg-[#1e293b] rounded-lg cursor-pointer transition-colors text-sm text-[#e2e8f0]">
                    {obj.object_name}
                  </div>
                ))}
              </div>
            )}

            {results.conjunctions?.length > 0 && (
              <div className="px-3 py-1.5">
                <div className="text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">Events</div>
                {results.conjunctions.slice(0, 3).map(evt => (
                  <div key={evt.id} className="px-2 py-1.5 hover:bg-[#1e293b] rounded-lg cursor-pointer transition-colors text-sm text-[#e2e8f0]">
                    TCA: {new Date(evt.tca).toLocaleString()}
                  </div>
                ))}
              </div>
            )}

            {results.objects?.length === 0 && results.conjunctions?.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-[#64748b]">
                No results found for "{query}"
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}

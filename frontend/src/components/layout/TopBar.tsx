"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SearchBar from "../shared/SearchBar";
import SystemHealthIndicator from "../shared/SystemHealthIndicator";

export default function TopBar() {
  const [timeStr, setTimeStr] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Client-side only rendering of time to avoid hydration mismatch
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/") return "Mission Control";
    const segment = pathname.split("/")[1];
    if (!segment) return "";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
  };

  const handleSearch = (q: string) => {
    console.log("Searching for:", q);
    // Real implementation would connect to the API and pass results to SearchBar
  };

  return (
    <div className="h-16 bg-[#111827]/95 backdrop-blur-sm border-b border-[#1e293b] flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-[#e2e8f0] font-semibold text-lg">{getPageTitle()}</h1>
      </div>

      <div className="flex-1 flex justify-center max-w-xl mx-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <SystemHealthIndicator status="online" label="System Nominal" />
        </div>
        
        <div className="h-6 w-px bg-[#1e293b]"></div>
        
        <div className="text-[#94a3b8] text-sm font-mono-data tracking-tight w-48 text-right">
          {timeStr}
        </div>
        
        <button className="relative p-2 text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a2332] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-[#111827]"></span>
        </button>
      </div>
    </div>
  );
}
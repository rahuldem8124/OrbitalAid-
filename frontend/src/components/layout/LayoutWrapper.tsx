"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Initial check
    const saved = localStorage.getItem("orbitaid_sidebar_collapsed");
    if (saved) {
      setSidebarCollapsed(JSON.parse(saved));
    }

    // Listen for custom toggle event from Sidebar
    const handleToggle = (e: CustomEvent<boolean>) => {
      setSidebarCollapsed(e.detail);
    };

    window.addEventListener('sidebarToggle', handleToggle as EventListener);
    return () => window.removeEventListener('sidebarToggle', handleToggle as EventListener);
  }, []);

  return (
    <>
      <Sidebar />
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}
      >
        <TopBar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

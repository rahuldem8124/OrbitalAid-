"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Crosshair,
  Bell,
  Satellite,
  CircleDot,
  Database,
  BarChart3,
  FlaskConical,
  Navigation,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const sections = [
  {
    title: "OVERVIEW",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Mission Control" },
      { href: "/conjunctions", icon: Crosshair, label: "Conjunctions" },
      { href: "/alerts", icon: Bell, label: "Alerts" },
    ]
  },
  {
    title: "SURVEILLANCE",
    items: [
      { href: "/fleet?type=satellite", icon: Satellite, label: "Satellites" },
      { href: "/fleet?type=debris", icon: CircleDot, label: "Debris" },
      { href: "/fleet", icon: Database, label: "Fleet Registry" },
    ]
  },
  {
    title: "ANALYSIS",
    items: [
      { href: "/analytics", icon: BarChart3, label: "Risk Analytics" },
      { href: "/simulation", icon: FlaskConical, label: "Simulation" },
    ]
  },
  {
    title: "OPERATIONS",
    items: [
      { href: "/maneuvers", icon: Navigation, label: "Maneuvers" },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/settings", icon: Settings, label: "Settings" },
      { href: "/system-health", icon: Activity, label: "System Health" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("orbitaid_sidebar_collapsed");
    if (saved) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const val = !collapsed;
    setCollapsed(val);
    localStorage.setItem("orbitaid_sidebar_collapsed", JSON.stringify(val));
    // Dispatch custom event so layout can adjust if needed
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: val }));
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#0a0e17] border-r border-[#1e293b] flex flex-col z-50 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e293b] shrink-0">
        {!collapsed && (
          <span className="text-xl font-bold text-[#e2e8f0] tracking-tight flex items-center gap-2">
            <Activity className="text-[#2dd4bf] w-5 h-5" />
            OrbitAid
          </span>
        )}
        {collapsed && (
          <Activity className="text-[#2dd4bf] w-6 h-6 mx-auto" />
        )}
        <button 
          onClick={toggleCollapse} 
          className={`p-1.5 rounded-lg text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1e293b] transition-colors ${collapsed ? 'absolute -right-3 bg-[#111827] border border-[#1e293b]' : ''}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-[10px] font-bold text-[#64748b] tracking-wider uppercase">
                {section.title}
              </div>
            )}
            <div className="flex flex-col gap-1 px-3">
              {section.items.map((item) => {
                // Determine active state - handle query params if necessary for basic matching
                const itemBase = item.href.split('?')[0];
                const isActive = pathname === itemBase || (pathname.startsWith(itemBase) && itemBase !== '/');
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-[#2dd4bf]/10 text-[#2dd4bf] font-medium"
                        : "text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a2332]"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#2dd4bf]' : 'group-hover:text-[#e2e8f0]'}`} />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
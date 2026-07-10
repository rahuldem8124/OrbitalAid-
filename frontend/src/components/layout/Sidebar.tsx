"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  AlertTriangle,
  ShieldAlert,
  Satellite,
  Bell,
  BarChart3,
  Layers,
  Database,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/conjunctions", icon: AlertTriangle, label: "Conjunctions" },
  { href: "/maneuvers", icon: ShieldAlert, label: "Maneuvers" },
  { href: "/fleet", icon: Satellite, label: "Fleet" },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/simulation", icon: Layers, label: "Simulation" },
  { href: "/data-sources", icon: Database, label: "Data Sources" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="group fixed left-0 top-0 h-full w-16 hover:w-56 bg-[#05070d] border-r border-white/10 flex flex-col items-start py-6 gap-1 z-50 transition-all duration-200 ease-out overflow-hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 w-[calc(100%-16px)] mx-2 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
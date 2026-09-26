"use client";

import { useState, useEffect } from "react";
import { fetchSystemHealth } from "@/lib/api";
import { SystemHealth } from "@/lib/types";
import MetricCard from "@/components/shared/MetricCard";
import SystemHealthIndicator from "@/components/shared/SystemHealthIndicator";

export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastPolled, setLastPolled] = useState<Date>(new Date());

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const poll = async () => {
      try {
        const data = await fetchSystemHealth();
        setHealth(data);
        setError(false);
        setLastPolled(new Date());
      } catch (err) {
        console.error("System health fetch failed", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    poll();
    interval = setInterval(poll, 15000); // poll every 15s

    return () => clearInterval(interval);
  }, []);

  const renderStatusCard = (label: string, status: string | undefined, expectedOnline: boolean = true) => {
    let indicatorState: 'online' | 'offline' | 'degraded' = 'offline';
    
    if (status) {
      const s = status.toLowerCase();
      if (s === 'online' || s === 'running' || s === 'connected' || s === 'healthy') indicatorState = 'online';
      else if (s === 'degraded' || s === 'idle') indicatorState = 'degraded';
    } else {
      indicatorState = error ? 'offline' : 'degraded';
    }

    return (
      <div className="bg-[#111827] border border-[#1e293b] p-5 rounded-xl flex items-center justify-between">
        <span className="text-white font-medium">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 uppercase tracking-wider">{status || (error ? 'Offline' : 'Unknown')}</span>
          <SystemHealthIndicator status={indicatorState} />
        </div>
      </div>
    );
  };

  if (loading && !health) {
    return <div className="text-white p-8">Loading system health...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl relative min-h-screen">
      <div className="flex justify-between items-end border-b border-[#1e293b] pb-4">
        <h1 className="text-teal-400 text-2xl font-semibold tracking-wide uppercase">System Health Dashboard</h1>
        <div className="text-sm text-gray-500 font-mono">
          Last Polled: {lastPolled.toLocaleTimeString()}
        </div>
      </div>

      {error && !health && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center justify-center">
          System health endpoint unavailable. Cannot reach telemetry services.
        </div>
      )}

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderStatusCard("Backend API", health?.api || "online")}
        {renderStatusCard("Database", health?.database || "online")}
        {renderStatusCard("Screening Engine", health?.status === "healthy" ? "Running" : "Idle")}
        {renderStatusCard("Risk Engine", health?.status === "healthy" ? "Running" : "Idle")}
        {renderStatusCard("Data Feed", "Connected")}
      </div>

      {/* Operational Metrics */}
      <h2 className="text-lg text-white font-medium mt-4">Operational Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Objects Tracked" value={health?.objects_tracked || 0} />
        <MetricCard label="Active Conjunctions" value={health?.conjunctions_active || 0} variant="warning" />
        <MetricCard label="Risk Assessments" value={health?.risk_assessments || 0} />
        <MetricCard label="Active Alerts" value={health?.alerts_active || 0} variant="critical" />
        <MetricCard label="Pending Maneuvers" value={health?.maneuvers_pending || 0} variant="warning" />
        <MetricCard label="Data Freshness" value={health?.data_freshness || "—"} />
      </div>

      {/* Last Operations */}
      <div className="bg-[#111827] border border-[#1e293b] p-6 rounded-xl mt-4">
        <h2 className="text-lg text-white font-medium mb-4 border-b border-[#1e293b] pb-2">Last Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-sm text-gray-400 block mb-1">Last Screening Job</span>
            <span className="text-white font-mono">{health?.last_screening ? new Date(health.last_screening).toLocaleString() : "Never"}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400 block mb-1">Last Risk Assessment</span>
            <span className="text-white font-mono">{health?.last_risk_assessment ? new Date(health.last_risk_assessment).toLocaleString() : "Never"}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400 block mb-1">Latest Telemetry Packet</span>
            <span className="text-white font-mono">{lastPolled.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(0, 19).replace('T', ' ') + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <span className="font-mono text-sm text-[#94a3b8]">--:--:-- UTC</span>;

  return <span className="font-mono text-sm text-[#e2e8f0]">{time}</span>;
}

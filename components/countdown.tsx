"use client";

import { useEffect, useState } from "react";

export function Countdown({ date, compact = false }: { date: string; compact?: boolean }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(date).getTime() - Date.now()));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [date]);
  const total = Math.floor((left ?? 0) / 1000);
  const values = [Math.floor(total / 3600), Math.floor(total % 3600 / 60), total % 60];
  return <div className={compact ? "countdown compact-count" : "countdown"}>
    {values.map((v, i) => <span key={i}><b>{String(v).padStart(2, "0")}</b>{!compact && <small>{["HRS", "MIN", "SEG"][i]}</small>}</span>)}
  </div>;
}

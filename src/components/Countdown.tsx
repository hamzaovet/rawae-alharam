"use client";
import { useEffect, useState } from "react";

export function Countdown({ expiresAt }: { expiresAt: string }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const box = (n: number, label: string) => (
    <div className="flex flex-col items-center bg-black/30 rounded-lg px-3 py-2 min-w-[52px]">
      <span className="text-2xl font-bold text-white">{mounted ? String(n).padStart(2, "0") : "--"}</span>
      <span className="text-xs text-white/70">{label}</span>
    </div>
  );
  return (
    <div className="flex gap-2 items-center">
      {box(time.d, "يوم")}
      <span className="text-white font-bold text-xl">:</span>
      {box(time.h, "ساعة")}
      <span className="text-white font-bold text-xl">:</span>
      {box(time.m, "دقيقة")}
      <span className="text-white font-bold text-xl">:</span>
      {box(time.s, "ثانية")}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { ScriptPage } from "@/data/script-core";

const SCRIPT_TIME_MAP: Array<{ pattern: RegExp; hour: number; label: string }> = [
  { pattern: /\bDAWN\b/i, hour: 5.5, label: "Dawn" },
  { pattern: /\bEARLY\s+MORNING\b/i, hour: 6.5, label: "Early Morning" },
  { pattern: /\bMORNING\b/i, hour: 8, label: "Morning" },
  { pattern: /\bLATE\s+MORNING\b/i, hour: 10.5, label: "Late Morning" },
  { pattern: /\bDAY\b/i, hour: 13, label: "Day" },
  { pattern: /\bAFTERNOON\b/i, hour: 15, label: "Afternoon" },
  { pattern: /\bLATE\s+AFTERNOON\b/i, hour: 17, label: "Late Afternoon" },
  { pattern: /\bDUSK\b/i, hour: 19, label: "Dusk" },
  { pattern: /\bSUNSET\b/i, hour: 18.5, label: "Sunset" },
  { pattern: /\bEVENING\b/i, hour: 19.5, label: "Evening" },
  { pattern: /\bNIGHT\b/i, hour: 22, label: "Night" },
  { pattern: /\bLATE\s+NIGHT\b/i, hour: 23.5, label: "Late Night" },
];

function getScriptTimeFromScene(sceneText: string): { hour: number; label: string } | null {
  for (const { pattern, hour, label } of SCRIPT_TIME_MAP) {
    if (pattern.test(sceneText)) return { hour, label };
  }
  return null;
}

export function getScriptHourForPage(pages: ScriptPage[], pageIndex: number): { hour: number; label: string } | null {
  for (let i = pageIndex; i >= 0; i--) {
    const page = pages[i];
    for (const el of page.elements) {
      if (el.type === "scene") {
        const time = getScriptTimeFromScene(el.text);
        if (time) return time;
        if (/\b(CONTINUOUS|MOMENTS\s+LATER)\b/i.test(el.text)) break;
        return null;
      }
    }
  }
  return null;
}

function getLunarPhase(date: Date): number {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z");
  const lunarCycle = 29.530588853;
  const days = (date.getTime() - knownNewMoon.getTime()) / 86_400_000;
  return (((days % lunarCycle) + lunarCycle) % lunarCycle) / lunarCycle;
}

function getMoonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.22) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

function getNightness(hour: number): number {
  if (hour >= 20 || hour < 5) return 1;
  if (hour >= 5 && hour < 8) return 1 - (hour - 5) / 3;
  if (hour >= 17 && hour < 20) return (hour - 17) / 3;
  return 0;
}

function MoonSVG({ phase, size = 44, glow }: { phase: number; size?: number; glow: number }) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const topX = cx, topY = cy - r;
  const botX = cx, botY = cy + r;

  const moonColor = `rgba(255,245,190,${0.2 + glow * 0.75})`;
  const glowColor = `rgba(255,235,130,${glow * 0.5})`;
  const ringColor = `rgba(255,245,190,${0.1 + glow * 0.2})`;

  if (phase < 0.03 || phase > 0.97) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={ringColor} strokeWidth="1" />
      </svg>
    );
  }

  const waxing = phase <= 0.5;
  const t = waxing ? phase * 2 : (phase - 0.5) * 2;
  const terminatorRx = waxing
    ? r * Math.cos(t * Math.PI)
    : -r * Math.cos(t * Math.PI);
  const absRx = Math.abs(terminatorRx);

  let d: string;
  if (waxing) {
    if (absRx < 0.5) {
      d = `M ${topX} ${topY} A ${r} ${r} 0 0 1 ${botX} ${botY} L ${topX} ${topY}`;
    } else {
      const sweep = terminatorRx > 0 ? 0 : 1;
      d = `M ${topX} ${topY} A ${r} ${r} 0 0 1 ${botX} ${botY} A ${absRx} ${r} 0 0 ${sweep} ${topX} ${topY}`;
    }
  } else {
    if (absRx < 0.5) {
      d = `M ${topX} ${topY} A ${r} ${r} 0 0 0 ${botX} ${botY} L ${topX} ${topY}`;
    } else {
      const sweep = terminatorRx > 0 ? 1 : 0;
      d = `M ${topX} ${topY} A ${r} ${r} 0 0 0 ${botX} ${botY} A ${absRx} ${r} 0 0 ${sweep} ${topX} ${topY}`;
    }
  }

  const filterId = `mg-${Math.round(phase * 100)}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3 + glow * 4} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {glow > 0.1 && <path d={d} fill={glowColor} filter={`url(#${filterId})`} />}
      <path d={d} fill={moonColor} />
    </svg>
  );
}

interface MoonWidgetProps {
  scriptHour?: number | null;
  scriptTimeLabel?: string | null;
}

export function MoonWidget({ scriptHour, scriptTimeLabel }: MoonWidgetProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;

  const phase = getLunarPhase(now);
  const hour = scriptHour ?? (now.getHours() + now.getMinutes() / 60);
  const glow = getNightness(hour);
  const isNight = glow > 0.5;
  const phaseName = getMoonPhaseName(phase);
  const timeStr = scriptTimeLabel ?? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="mt-auto flex flex-col items-center gap-2 pb-2 pt-6"
      style={{ transition: "opacity 1s ease" }}
    >
      <div className="mb-1 h-px w-full bg-white/8" />
      <div
        style={{
          filter: isNight ? `drop-shadow(0 0 ${6 + glow * 8}px rgba(255,235,130,${glow * 0.6}))` : "none",
          transition: "filter 2s ease",
        }}
      >
        <MoonSVG phase={phase} size={44} glow={glow} />
      </div>
      <p
        className="text-center text-[9px] uppercase tracking-[0.25em]"
        style={{
          fontFamily: "var(--font-cinematic)",
          color: `rgba(255,245,190,${0.2 + glow * 0.55})`,
          transition: "color 2s ease",
        }}
      >
        {phaseName}
      </p>
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: isNight
              ? `rgba(180,200,255,${0.4 + glow * 0.5})`
              : `rgba(255,220,80,${0.6})`,
            boxShadow: isNight
              ? `0 0 ${4 + glow * 6}px rgba(180,200,255,${glow * 0.7})`
              : "0 0 6px rgba(255,200,60,0.6)",
            transition: "all 2s ease",
          }}
        />
        <p
          className="text-[9px] tabular-nums"
          style={{
            fontFamily: "var(--font-screenplay)",
            color: `rgba(255,255,255,${0.18 + glow * 0.3})`,
          }}
        >
          {timeStr}
        </p>
      </div>
    </div>
  );
}

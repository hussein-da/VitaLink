"use client";

import { Zap, BatteryLow } from "lucide-react";

interface BatteryRingProps {
  prozent: number;
  groesse?: number;
  strokeWidth?: number;
}

export default function BatteryRing({ prozent, groesse = 36, strokeWidth = 3 }: BatteryRingProps) {
  const radius = groesse / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (prozent / 100) * circumference;

  const color =
    prozent > 50
      ? "var(--c-status-ok)"
      : prozent >= 20
        ? "var(--c-status-warn)"
        : "#E53E3E";

  return (
    <div className="relative flex-shrink-0" style={{ width: groesse, height: groesse }}>
      <svg width={groesse} height={groesse} aria-hidden>
        <circle
          cx={groesse / 2}
          cy={groesse / 2}
          r={radius}
          fill="none"
          stroke="var(--c-surface-3)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={groesse / 2}
          cy={groesse / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {prozent < 20 ? (
          <BatteryLow aria-hidden size={10} style={{ color }} />
        ) : (
          <Zap aria-hidden size={10} style={{ color }} />
        )}
      </span>
    </div>
  );
}

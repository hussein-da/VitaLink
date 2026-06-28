"use client";

import { getAktuellerInsight } from "@/lib/insightMoment";

export default function InsightMoment() {
  const insight = getAktuellerInsight();
  const Icon = insight.icon;

  return (
    <div
      className="flex flex-1 flex-col justify-between rounded-[14px] p-3"
      style={{
        minHeight: 90,
        background: insight.iconBg,
        animation: "fade-in 400ms ease-out 200ms both",
      }}
    >
      {/* Icon-Container */}
      <span
        className="flex h-8 w-8 items-center justify-center rounded-[10px]"
        style={{ background: insight.iconBg }}
      >
        <Icon aria-hidden size={17} style={{ color: insight.iconFarbe }} />
      </span>

      {/* Insight-Text */}
      <p
        className="mt-2 text-[12px] leading-[1.4] text-ink"
        style={{ whiteSpace: "pre-line" }}
      >
        {insight.text}
      </p>
    </div>
  );
}

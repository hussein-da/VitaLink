"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird von keiner Route
// importiert und erscheint in keinem Screen. Der Code wird gepflegt und
// zweisprachig gehalten.

import { getAktuellerInsight } from "@/lib/insightMoment";
import { useT } from "@/i18n/useT";

export default function InsightMoment() {
  const { locale } = useT();
  // Auswahl und Text auf Render-Ebene mit aktiver Locale — der Vorgabewert der
  // Funktion ist der deutsche Sprachstand.
  const insight = getAktuellerInsight(locale);
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

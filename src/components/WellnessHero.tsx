"use client";

import { useState } from "react";
import { Moon, Heart, Activity, TrendingUp, Info } from "lucide-react";
import { wellnessScore } from "@/lib/wellnessScore";
import { wearableSummary } from "@/data/wearable";
import InsightMoment from "@/components/InsightMoment";

const schlafText = wearableSummary.schlafStd.toLocaleString("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const MINI = [
  { icon: Moon, color: "text-cat-lifestyle", value: `${schlafText}h`, label: "Schlaf" },
  { icon: Heart, color: "text-cat-cardio", value: String(wearableSummary.ruhepuls), label: "BPM" },
  { icon: Activity, color: "text-cat-lifestyle", value: "87%", label: "Glukose" },
] as const;

// Score-Faktoren (synthetisch) für die "Warum 87?"-Aufschlüsselung (Block 2).
const FAKTOREN: { name: string; punkte: number; max: number }[] = [
  { name: "Aktivität (12.584 Schritte)", punkte: 20, max: 20 },
  { name: "Herzgesundheit (60 BPM stabil)", punkte: 20, max: 20 },
  { name: "Schlaf (Score 67/100)", punkte: 17, max: 20 },
  { name: "Blutdruck (leicht steigend)", punkte: 16, max: 20 },
  { name: "Laborwerte (weitgehend gut)", punkte: 14, max: 20 },
];

export default function WellnessHero() {
  const { gesamt, label, farbe } = wellnessScore;
  const statusColor = `rgb(var(${farbe}))`;
  const [warumOffen, setWarumOffen] = useState(false);

  return (
    <section
      aria-label="Dein Status heute"
      className="rounded-[28px] bg-surface px-5 py-[22px] shadow-lg"
    >
      <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
        Dein Status heute
      </p>

      <div className="flex items-stretch gap-3">
        <div className="flex flex-1 flex-col">
          <p className="font-display text-[72px] font-bold leading-none text-ink">{gesamt}</p>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{ width: `${gesamt}%`, backgroundColor: statusColor }}
            />
          </div>

          <p className="mt-2 text-[12px] text-muted">von 100</p>
          <p className="mt-1 text-[14px] font-semibold" style={{ color: statusColor }}>
            {label}
          </p>
        </div>

        <div aria-hidden className="my-1 w-px bg-border" />

        <InsightMoment />
      </div>

      {/* Block 2A — Trend-Indikator */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <TrendingUp aria-hidden size={13} className="text-status-ok" />
        <span className="text-[12px] font-semibold text-status-ok">+4 Punkte seit gestern</span>
      </div>

      {/* Block 2B — "Warum 87?" */}
      <div className="mt-2.5 flex justify-center">
        <button
          type="button"
          onClick={() => setWarumOffen(true)}
          className="tap inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5"
        >
          <Info aria-hidden size={13} className="text-muted" />
          <span className="text-[12px] font-semibold text-muted">Warum {gesamt}?</span>
        </button>
      </div>

      {/* Drei Mini-Indikatoren */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {MINI.map(({ icon: Icon, color, value, label: l }) => (
          <div
            key={l}
            className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-2 py-2.5"
          >
            <Icon aria-hidden size={14} className={color} />
            <span className="text-[15px] font-semibold text-ink">{value}</span>
            <span className="text-[11px] text-muted">{l}</span>
          </div>
        ))}
      </div>

      {/* Score-Aufschlüsselung (Bottom-Sheet) */}
      {warumOffen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setWarumOffen(false)} aria-hidden />
          <div
            role="dialog"
            aria-label="Wie sich dein Score zusammensetzt"
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame rounded-t-[28px] bg-surface px-5 pb-safe pt-3"
            style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
          >
            <div className="mx-auto mb-4 h-[2px] w-9 rounded-full bg-border-strong" />
            <p className="text-[17px] font-semibold text-ink">Wie sich dein Score zusammensetzt</p>
            <div className="mt-4 space-y-3">
              {FAKTOREN.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="w-[150px] shrink-0 text-[13px] text-ink">{f.name}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                    <span
                      className="block h-full rounded-full bg-cat-lifestyle"
                      style={{ width: `${(f.punkte / f.max) * 100}%` }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[13px] font-semibold text-muted">
                    +{f.punkte}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-muted">
              Der Score fasst deine Gesundheitsdaten aus ePA und Wearable zusammen.
            </p>
            <div className="h-5" />
          </div>
        </>
      )}
    </section>
  );
}

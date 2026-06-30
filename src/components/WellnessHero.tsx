"use client";

import { useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { wellnessScore } from "@/lib/wellnessScore";

// Score-Faktoren (synthetisch) für die "Warum 87?"-Aufschlüsselung.
const FAKTOREN: { name: string; punkte: number; max: number }[] = [
  { name: "Aktivität (12.584 Schritte)", punkte: 20, max: 20 },
  { name: "Herzgesundheit (60 BPM stabil)", punkte: 20, max: 20 },
  { name: "Schlaf (Score 67/100)", punkte: 17, max: 20 },
  { name: "Blutdruck (leicht steigend)", punkte: 16, max: 20 },
  { name: "Laborwerte (weitgehend gut)", punkte: 14, max: 20 },
];

/** Dekorative Wellness-Szene (inline SVG, dark-mode-fest, keine externen Assets). */
function ScoreSzene() {
  return (
    <svg
      width={92}
      height={92}
      viewBox="0 0 92 92"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <clipPath id="szene-clip">
          <rect x="0" y="0" width="92" height="92" rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#szene-clip)">
        <rect width="92" height="92" fill="rgb(var(--c-cat-lifestyle-light))" />
        <circle cx="66" cy="26" r="11" fill="rgb(var(--c-status-warn) / 0.85)" />
        <path d="M0 70 L26 40 L46 64 L64 44 L92 74 L92 92 L0 92 Z" fill="rgb(var(--c-cat-lifestyle) / 0.85)" />
        <path d="M0 80 L20 60 L40 78 L60 58 L92 84 L92 92 L0 92 Z" fill="rgb(var(--c-cat-lifestyle))" />
      </g>
    </svg>
  );
}

export default function WellnessHero() {
  const { gesamt, label, farbe } = wellnessScore;
  const statusColor = `rgb(var(${farbe}))`;
  const [warumOffen, setWarumOffen] = useState(false);
  const [heroOk, setHeroOk] = useState(true);

  return (
    <section
      aria-label="Dein Gesundheits-Score"
      className="rounded-[28px] bg-surface px-5 py-[22px] shadow-lg"
    >
      <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
        Dein Gesundheits-Score
      </p>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[64px] font-bold leading-none text-ink">
            {gesamt}
            <span className="ml-1 align-baseline text-[18px] font-normal text-muted">/100</span>
          </p>
          <p className="mt-1.5 text-[15px] font-semibold" style={{ color: statusColor }}>
            {label}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full" style={{ width: `${gesamt}%`, backgroundColor: statusColor }} />
          </div>
          <p className="mt-2 text-[12px] font-semibold text-status-ok">↑ +4 Punkte seit gestern</p>
        </div>
        {heroOk ? (
          <Image
            src="/illustrations/hero-wellness.png"
            alt=""
            width={120}
            height={120}
            priority
            onError={() => setHeroOk(false)}
            className="h-[120px] w-[120px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <ScoreSzene />
        )}
      </div>

      {/* „Warum 87?" — Chip + kurze Inline-Erklärung */}
      <div className="mt-3.5 flex items-center gap-2.5 rounded-2xl bg-surface-2 p-2.5">
        <button
          type="button"
          onClick={() => setWarumOffen(true)}
          className="tap inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-sm"
        >
          <Info aria-hidden size={13} className="text-muted" />
          <span className="text-[12px] font-semibold text-muted">Warum {gesamt}?</span>
        </button>
        <p className="text-[12px] leading-snug text-ink">
          Schlaf und Schritte sind stark. Gestern war dein Blutzucker optimal.
        </p>
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
                    <span className="block h-full rounded-full bg-cat-lifestyle" style={{ width: `${(f.punkte / f.max) * 100}%` }} />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[13px] font-semibold text-muted">+{f.punkte}</span>
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

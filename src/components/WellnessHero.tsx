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

/**
 * Vollflächen-Hero: EIN Hintergrundbild bedeckt die gesamte Karte (kein
 * Kasten-im-Kasten). Scrim von links macht die linke Seite lesbar; der Text
 * liegt direkt in Weiß auf dem Bild. Fällt das Bild aus, bleibt ein weicher
 * Marken-Gradient (cat-lifestyle) — nicht das runde Bild.
 */
export default function WellnessHero() {
  const { gesamt, label } = wellnessScore;
  const [warumOffen, setWarumOffen] = useState(false);
  const [heroOk, setHeroOk] = useState(true);

  return (
    <section
      aria-label="Dein Gesundheits-Score"
      className="relative h-[172px] overflow-hidden rounded-2xl shadow-lg"
    >
      {/* Marken-Gradient als Basis + Fallback (kein Weiß-Flash, kein rundes Bild). */}
      <div className="absolute inset-0 bg-gradient-to-br from-cat-lifestyle to-cat-lifestyle-dark" />

      {/* Vollflächen-Bild, leicht abgedunkelt + entsättigt für Lesbarkeit. */}
      {heroOk && (
        <Image
          src="/illustrations/hero-bg.png"
          alt=""
          fill
          priority
          sizes="(max-width: 500px) 100vw, 430px"
          onError={() => setHeroOk(false)}
          className="object-cover"
          style={{ filter: "brightness(0.9) saturate(0.85)" }}
        />
      )}

      {/* Scrim von links für Kontrast (funktioniert in Light & Dark). */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {/* Text direkt auf dem Bild, linksbündig, Weiß. */}
      <div
        className="relative flex h-full flex-col justify-center px-5"
        style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/85">
          Gesundheits-Score
        </p>
        <p className="mt-0.5 font-display text-[46px] font-bold leading-none text-white">
          {gesamt}
          <span className="ml-1 align-baseline text-[16px] font-normal text-white/75">/100</span>
        </p>
        <div className="mt-1.5 flex items-center gap-2.5">
          <span className="text-[15px] font-semibold text-white">{label}</span>
          <span className="text-[12px] font-semibold text-white/90">↑ +4 seit gestern</span>
        </div>
        <div className="mt-2 h-1.5 w-[58%] max-w-[210px] overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${gesamt}%` }} />
        </div>
        <button
          type="button"
          onClick={() => setWarumOffen(true)}
          className="tap mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md"
        >
          <Info aria-hidden size={13} className="text-white" />
          <span className="text-[12px] font-semibold text-white">Warum {gesamt}?</span>
        </button>
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

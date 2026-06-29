"use client";

import { Ban, Dumbbell, Footprints, Heart, TrendingUp } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { wearableSummary, wochenTraining } from "@/data/wearable";

const avgMinProEinheit =
  wochenTraining.einheiten.length > 0
    ? Math.round(
        wochenTraining.einheiten.reduce((s, e) => s + e.dauer, 0) /
          wochenTraining.einheiten.length,
      )
    : 0;

export default function WochenrueckblickCard() {
  const { isSourceEnabled } = useSettings();
  const aktiv = isSourceEnabled("wearable-aktivitaet");

  return (
    <section
      aria-label="Wochenrückblick Aktivität"
      className="overflow-hidden rounded-3xl bg-surface shadow-lg"
    >
      {/* Header-Band */}
      <div className="flex h-20 items-center justify-between bg-cat-lifestyle-light px-5">
        <span className="flex items-center gap-2">
          <TrendingUp aria-hidden size={20} className="text-cat-lifestyle" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-cat-lifestyle">
            Diese Woche
          </span>
        </span>
        <span className="text-[12px] text-muted">17.–23. Juni</span>
      </div>

      {aktiv ? (
        <div className="grid grid-cols-3" title={`Ø ${avgMinProEinheit} Min pro Einheit`}>
          {/* SPALTE 1 — Schritte */}
          <div className="flex flex-col items-center gap-1 px-2 py-3.5 text-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cat-lifestyle-light">
              <Footprints aria-hidden size={14} className="text-cat-lifestyle" />
            </span>
            <span className="text-[22px] font-bold leading-none text-cat-lifestyle">
              {wearableSummary.schritte.toLocaleString("de-DE")}
            </span>
            <span className="text-[11px] text-muted">Schritte/Tag</span>
          </div>
          {/* SPALTE 2 — Trainings */}
          <div className="flex flex-col items-center gap-1 border-l border-border px-2 py-3.5 text-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cat-lifestyle-light">
              <Dumbbell aria-hidden size={14} className="text-cat-lifestyle" />
            </span>
            <span className="text-[22px] font-bold leading-none text-cat-lifestyle">
              {wochenTraining.einheiten.length}
            </span>
            <span className="text-[11px] text-muted">Trainings</span>
          </div>
          {/* SPALTE 3 — Ruhepuls */}
          <div className="flex flex-col items-center gap-1 border-l border-border px-2 py-3.5 text-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cat-cardio-light">
              <Heart aria-hidden size={14} className="text-cat-cardio" />
            </span>
            <span className="text-[22px] font-bold leading-none text-cat-cardio">
              {wearableSummary.ruhepuls}
            </span>
            <span className="text-[11px] text-muted">BPM Ruhe</span>
          </div>
        </div>
      ) : (
        <div className="m-4 flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-sm text-ink">
          <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
          <span>
            Nutzt abgeschaltete Quelle: <span className="font-medium">Aktivität (Wearable)</span>. In
            den Einstellungen wieder einschalten.
          </span>
        </div>
      )}
    </section>
  );
}

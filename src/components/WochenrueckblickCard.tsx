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
        <div className="px-5 py-4">
          {/* ZEILE A — Schritte */}
          <div className="flex items-center gap-2.5">
            <Footprints aria-hidden size={16} className="shrink-0 text-cat-lifestyle" />
            <div>
              <p className="leading-none">
                <span className="text-[22px] font-bold text-cat-lifestyle">
                  {wearableSummary.schritte.toLocaleString("de-DE")}
                </span>
                <span className="ml-1 text-[14px] text-muted">Schritte/Tag</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted">Ø der letzten 7 Tage</p>
            </div>
          </div>

          {/* ZEILE B — Training */}
          <div className="mt-[10px] flex items-center gap-2.5 border-t border-border pt-[10px]">
            <Dumbbell aria-hidden size={16} className="shrink-0 text-cat-lifestyle" />
            <div>
              <p className="leading-none">
                <span className="text-[22px] font-bold text-cat-lifestyle">
                  {wochenTraining.einheiten.length}
                </span>
                <span className="ml-1 text-[14px] text-muted">Einheiten</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted">Ø {avgMinProEinheit} Min pro Einheit</p>
            </div>
          </div>

          {/* ZEILE C — Ruhepuls */}
          <div className="mt-[10px] flex items-center gap-2.5 border-t border-border pt-[10px]">
            <Heart aria-hidden size={16} className="shrink-0 text-cat-cardio" />
            <div>
              <p className="text-[18px] font-bold leading-none text-cat-cardio">
                {wearableSummary.ruhepuls} BPM
              </p>
              <p className="mt-0.5 text-[11px] text-muted">Ruhepuls stabil — sehr gut</p>
            </div>
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

"use client";

import { Ban, TrendingUp, Footprints, Dumbbell } from "lucide-react";
import ProvenanceChip from "@/components/ProvenanceChip";
import { useSettings } from "@/context/SettingsContext";
import { wochenSchritte, wochenTraining } from "@/data/wearable";
import type { Provenance } from "@/lib/types";

/** "1 Std 36 Min" – kompakt aus Gesamtminuten. */
function formatDauer(minuten: number): string {
  const h = Math.floor(minuten / 60);
  const m = minuten % 60;
  if (h === 0) return `${m} Min`;
  if (m === 0) return `${h} Std`;
  return `${h} Std ${m} Min`;
}

const schrittProvenance: Provenance = {
  art: "wearable",
  label: "Schritte",
  sourceKey: "wearable-aktivitaet",
  period: "letzte 7 Tage",
  sensor: "Beschleunigungssensor",
};

const trainingProvenance: Provenance = {
  art: "wearable",
  label: "Trainingsdaten",
  sourceKey: "wearable-aktivitaet",
  period: "letzte 7 Tage",
  sensor: "Trainingserkennung (Wearable, Beispielwert)",
};

const avgSchritte = Math.round(
  wochenSchritte.tage.reduce((s, t) => s + t.value, 0) / wochenSchritte.tage.length,
);
const anzahlTrainings = wochenTraining.einheiten.length;
const avgTrainingMin = Math.round(
  wochenTraining.einheiten.reduce((s, e) => s + e.dauer, 0) / wochenTraining.einheiten.length,
);

/**
 * FR-I / DF17: Wochenrückblick Aktivität – datenfokussierte, kompakte Zeilen
 * (keine Fließtext-Blöcke). Hängt an wearable-aktivitaet (DF11): bei
 * abgeschalteter Quelle erscheint ein klarer Leer-Zustand ohne Ersatzwerte.
 */
export default function WochenrueckblickCard() {
  const { isSourceEnabled } = useSettings();
  const aktiv = isSourceEnabled("wearable-aktivitaet");

  return (
    <section
      aria-label="Wochenrückblick Aktivität"
      className="rounded-[20px] bg-surface p-5 shadow-card"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
          <TrendingUp aria-hidden size={20} className="text-primary" />
        </span>
        <h2 className="text-[15px] font-semibold text-ink">Diese Woche</h2>
        <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          7 Tage
        </span>
      </div>

      {aktiv ? (
        <div className="mt-4 space-y-4">
          {/* Schritte */}
          <div>
            <div className="flex items-baseline gap-2">
              <Footprints aria-hidden size={18} className="translate-y-0.5 text-primary" />
              <span className="font-display text-[28px] font-bold leading-none text-ink">
                {avgSchritte.toLocaleString("de-DE")}
              </span>
              <span className="text-sm text-muted">Schritte / Tag</span>
            </div>
            <div className="mt-2">
              <ProvenanceChip provenance={schrittProvenance} />
            </div>
          </div>

          {/* Training */}
          <div>
            <div className="flex items-baseline gap-2">
              <Dumbbell aria-hidden size={18} className="translate-y-0.5 text-primary" />
              <span className="font-display text-[28px] font-bold leading-none text-ink">
                {anzahlTrainings}×
              </span>
              <span className="text-sm text-muted">Training · Ø {formatDauer(avgTrainingMin)}</span>
            </div>
            <div className="mt-2">
              <ProvenanceChip provenance={trainingProvenance} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2/60 p-3 text-sm text-ink">
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

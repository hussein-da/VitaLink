"use client";

import { Ban } from "lucide-react";
import ProvenanceChip from "@/components/ProvenanceChip";
import { useSettings } from "@/context/SettingsContext";
import { wochenSchritte, wochenTraining } from "@/data/wearable";
import type { Provenance } from "@/lib/types";

/** "1 Stunde und 36 Minuten" – formatiert aus Gesamtminuten. */
function formatDauer(minuten: number): string {
  const h = Math.floor(minuten / 60);
  const m = minuten % 60;
  if (h === 0) return `${m} Minuten`;
  if (m === 0) return `${h} Stunde${h !== 1 ? "n" : ""}`;
  return `${h} Stunde${h !== 1 ? "n" : ""} und ${m} Minuten`;
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

// Berechnungen einmalig zur Modullade-Zeit — Daten sind statisch.
const avgSchritte = Math.round(
  wochenSchritte.tage.reduce((s, t) => s + t.value, 0) / wochenSchritte.tage.length,
);
const anzahlTrainings = wochenTraining.einheiten.length;
const avgTrainingMin = Math.round(
  wochenTraining.einheiten.reduce((s, e) => s + e.dauer, 0) / wochenTraining.einheiten.length,
);

/**
 * FR-I / DF17: Wochenrückblick Aktivität.
 * Zeigt 7-Tage-Schnitt Schritte + Trainingseinheiten.
 * Hängt an wearable-aktivitaet (DF11): bei abgeschalteter Quelle
 * erscheint der "Quelle abgeschaltet"-Zustand ohne Ersatzwerte.
 */
export default function WochenrueckblickCard() {
  const { isSourceEnabled } = useSettings();
  const aktiv = isSourceEnabled("wearable-aktivitaet");

  return (
    <section
      aria-label="Wochenrückblick Aktivität"
      className="rounded-2xl border border-border bg-surface p-5 shadow-md"
    >
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Wochenrückblick</h2>

      {aktiv ? (
        <div className="space-y-5">
          {/* Aussage 1 – Schrittzahl */}
          <div className="space-y-2">
            <p className="leading-relaxed text-ink">
              Sehr gut, du bist in den letzten 7 Tagen im Schnitt rund{" "}
              <span className="font-semibold text-primary">
                {avgSchritte.toLocaleString("de-DE")} Schritte
              </span>{" "}
              pro Tag gelaufen.
            </p>
            <ProvenanceChip provenance={schrittProvenance} />
          </div>

          {/* Aussage 2 – Trainingseinheiten */}
          <div className="space-y-2">
            <p className="leading-relaxed text-ink">
              Du warst in den letzten 7 Tagen{" "}
              <span className="font-semibold text-primary">{anzahlTrainings}-mal</span> im
              Fitnessstudio und hast dort im Schnitt{" "}
              <span className="font-semibold text-primary">{formatDauer(avgTrainingMin)}</span>{" "}
              verbracht.
            </p>
            <ProvenanceChip provenance={trainingProvenance} />
          </div>
        </div>
      ) : (
        /* DF11: Quelle abgeschaltet – kein Ersatzwert, klare Erklärung */
        <div className="flex items-start gap-2 rounded-xl border border-dashed border-border bg-surface-2/60 p-3 text-sm text-ink">
          <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
          <span>
            Nutzt abgeschaltete Quelle:{" "}
            <span className="font-medium">Aktivität (Wearable)</span>. In den Einstellungen wieder
            einschalten, um den Wochenrückblick zu sehen.
          </span>
        </div>
      )}
    </section>
  );
}

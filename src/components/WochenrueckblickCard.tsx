"use client";

import { Ban, TrendingUp, CheckCircle2, Watch } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { wochenSchritte, wochenTraining } from "@/data/wearable";

/** "1 Std. 43 Min." – kompakt aus Gesamtminuten. */
function formatDauer(minuten: number): string {
  const h = Math.floor(minuten / 60);
  const m = minuten % 60;
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h} Std. ${m} Min.`;
}

const avgSchritte = Math.round(
  wochenSchritte.tage.reduce((s, t) => s + t.value, 0) / wochenSchritte.tage.length,
);
const anzahlTrainings = wochenTraining.einheiten.length;
const avgTrainingMin = Math.round(
  wochenTraining.einheiten.reduce((s, e) => s + e.dauer, 0) / wochenTraining.einheiten.length,
);

/** Kleiner Herkunfts-Chip "Wearable · 7 Tage". */
function HerkunftsChip() {
  return (
    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
      <Watch aria-hidden size={11} />
      Wearable · 7 Tage
    </span>
  );
}

/**
 * Wochenrückblick (§Zone E, FR-I / DF17): farbiger Kategorie-Header und zwei
 * datenfokussierte Check-Zeilen mit Herkunfts-Chip. Hängt an wearable-aktivitaet
 * (DF11): bei abgeschalteter Quelle erscheint ein klarer Leer-Zustand.
 */
export default function WochenrueckblickCard() {
  const { isSourceEnabled } = useSettings();
  const aktiv = isSourceEnabled("wearable-aktivitaet");

  return (
    <section
      aria-label="Wochenrückblick Aktivität"
      className="overflow-hidden rounded-[20px] bg-surface shadow-card"
    >
      <div className="flex h-14 items-center gap-3 bg-cat-lifestyle-light px-4">
        <TrendingUp aria-hidden size={22} className="text-cat-lifestyle" />
        <h2 className="font-display text-[17px] font-semibold text-ink">Diese Woche</h2>
      </div>

      {aktiv ? (
        <div className="flex flex-col gap-3.5 px-4 pb-4 pt-3.5">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 aria-hidden size={16} className="mt-0.5 shrink-0 text-cat-lifestyle" />
            <div>
              <p className="text-[14px] leading-[1.5] text-ink">
                Sehr gut — du bist diese Woche im Schnitt{" "}
                <span className="font-semibold">{avgSchritte.toLocaleString("de-DE")} Schritte</span>{" "}
                pro Tag gegangen.
              </p>
              <HerkunftsChip />
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 aria-hidden size={16} className="mt-0.5 shrink-0 text-cat-lifestyle" />
            <div>
              <p className="text-[14px] leading-[1.5] text-ink">
                Du hattest{" "}
                <span className="font-semibold">{anzahlTrainings} Trainingseinheiten</span> mit einer
                Durchschnittsdauer von{" "}
                <span className="font-semibold">{formatDauer(avgTrainingMin)}</span>
              </p>
              <HerkunftsChip />
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

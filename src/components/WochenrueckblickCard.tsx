"use client";

import Link from "next/link";
import { Ban, ChevronRight, Dumbbell, Footprints, Heart, TrendingUp } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useT } from "@/i18n/useT";

export type Zeitraum = "heute" | "woche" | "monat";

// Synthetische Kennzahlen je Zeitraum — reine ZAHLEN, damit sie locale-richtig
// formatiert werden koennen (de 88.088 / en 88,088). Schritte und Trainings sind
// ZEITRAUM-SUMMEN (Woche ≈ 7×, Monat ≈ 30× des Tagesschnitts von 12.584; die
// Wochensumme 88.088 ist deckungsgleich mit wochenSchritte in wearable.ts).
// Der Ruhepuls bleibt ein Durchschnittswert.
const WERTE: Record<Zeitraum, { schritte: number; trainings: number; puls: number }> = {
  heute: { schritte: 13240, trainings: 1, puls: 59 },
  woche: { schritte: 88088, trainings: 4, puls: 60 },
  monat: { schritte: 377520, trainings: 17, puls: 61 },
};

/** Sprachneutraler Zeitraum-Schluessel → Woerterbuch-Schluessel. */
const TEXT_KEY: Record<Zeitraum, "today" | "week" | "month"> = {
  heute: "today",
  woche: "week",
  monat: "month",
};

export default function WochenrueckblickCard({ zeitraum = "woche" }: { zeitraum?: Zeitraum }) {
  const { isSourceEnabled } = useSettings();
  const { t, fmt } = useT();
  // VITA-09: pro Messwert gaten — Schritte/Training an Aktivität, Ruhepuls an Puls.
  const aktivAkt = isSourceEnabled("wearable-aktivitaet");
  const aktivPuls = isSourceEnabled("wearable-puls");
  const aktiv = aktivAkt || aktivPuls;
  const wr = t.widgets.weeklyReview;
  const werte = WERTE[zeitraum];
  // Die Beschriftungen wandern bewusst in die Render-Ebene (Sprachwechsel).
  // Die Schritte-Beschriftung macht die Bezugsgröße eindeutig (Tageswert bei
  // „Heute", Summe bei Woche/Monat).
  const d = wr.periods[TEXT_KEY[zeitraum]];

  const inhalt = (
    <>
      {/* Kompakter Header (inline, ohne separates Band) */}
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="flex items-center gap-1.5">
          <TrendingUp aria-hidden size={16} className="text-cat-lifestyle" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-cat-lifestyle">
            {d.label}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-[12px] text-muted">{d.range}</span>
          {aktiv && <ChevronRight aria-hidden size={15} className="text-cat-lifestyle" />}
        </span>
      </div>

      {aktiv ? (
        <div className="grid grid-cols-3 pb-1.5 pt-1">
          {/* Schritte (wearable-aktivitaet) */}
          <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center">
            {aktivAkt ? (
              <span className="text-[22px] font-bold leading-none text-cat-lifestyle">
                {fmt.number(werte.schritte)}
              </span>
            ) : (
              <Ban aria-hidden size={18} className="text-muted" />
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] text-muted">
              <Footprints aria-hidden size={11} />{" "}
              {aktivAkt ? fmt.plural(werte.schritte, d.stepsLabel) : wr.sourceOff}
            </span>
          </div>
          {/* Trainings (wearable-aktivitaet) */}
          <div className="flex flex-col items-center gap-0.5 border-l border-cat-lifestyle/15 px-2 py-2.5 text-center">
            {aktivAkt ? (
              <span className="text-[22px] font-bold leading-none text-cat-lifestyle">
                {fmt.number(werte.trainings)}
              </span>
            ) : (
              <Ban aria-hidden size={18} className="text-muted" />
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] text-muted">
              <Dumbbell aria-hidden size={11} />{" "}
              {aktivAkt ? fmt.plural(werte.trainings, wr.workouts) : wr.sourceOff}
            </span>
          </div>
          {/* Ruhepuls (wearable-puls) */}
          <div className="flex flex-col items-center gap-0.5 border-l border-cat-lifestyle/15 px-2 py-2.5 text-center">
            {aktivPuls ? (
              <span className="text-[22px] font-bold leading-none text-cat-cardio">
                {fmt.number(werte.puls)}
              </span>
            ) : (
              <Ban aria-hidden size={18} className="text-muted" />
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] text-muted">
              <Heart aria-hidden size={11} /> {aktivPuls ? wr.restingPulse : wr.sourceOff}
            </span>
          </div>
        </div>
      ) : (
        <div className="m-3 flex items-start gap-2 rounded-xl bg-surface p-3 text-sm text-ink">
          <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
          <span>
            {/* Vollstaendiger Satz aus EINEM Woerterbuch-Eintrag; der Platzhalter
                markiert nur, wo der hervorgehobene Quellenname steht. */}
            {wr.sourceOffNotice.split("{quelle}")[0]}
            <span className="font-medium">{wr.sourceActivityWearable}</span>
            {wr.sourceOffNotice.split("{quelle}")[1]}
          </span>
        </div>
      )}
    </>
  );

  // Mit Daten: gesamte Karte antippbar → Sensordaten-Unterseite (Home). Der
  // ?from=vitalink-Parameter bringt den Zurück-Button auf /werte hierher zurück.
  if (aktiv) {
    return (
      <Link
        href="/werte?from=vitalink"
        aria-label={wr.allSensorDataAria(d.label)}
        className="block overflow-hidden rounded-2xl bg-cat-lifestyle-light shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.99]"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <section
      aria-label={wr.reviewAria(d.label)}
      className="overflow-hidden rounded-2xl bg-cat-lifestyle-light shadow-card"
    >
      {inhalt}
    </section>
  );
}

"use client";

import Link from "next/link";
import { Ban, ChevronRight, Dumbbell, Footprints, Heart, TrendingUp } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export type Zeitraum = "heute" | "woche" | "monat";

// Synthetische Kennzahlen je Zeitraum. Schritte und Trainings sind ZEITRAUM-
// SUMMEN (Woche ≈ 7×, Monat ≈ 30× des Tagesschnitts von 12.584; die Wochensumme
// 88.088 ist deckungsgleich mit wochenSchritte in wearable.ts). Der Ruhepuls
// bleibt ein Durchschnittswert. Die Schritte-Beschriftung macht die Bezugsgröße
// eindeutig (Tageswert bei „Heute", Summe bei Woche/Monat).
const DATEN: Record<
  Zeitraum,
  { label: string; range: string; schritte: string; schritteLabel: string; trainings: string; puls: string }
> = {
  heute: { label: "Heute", range: "29. Juni", schritte: "13.240", schritteLabel: "Schritte", trainings: "1", puls: "59" },
  woche: { label: "Diese Woche", range: "17.–23. Juni", schritte: "88.088", schritteLabel: "Schritte/Woche", trainings: "4", puls: "60" },
  monat: { label: "Dieser Monat", range: "Juni 2026", schritte: "377.520", schritteLabel: "Schritte/Monat", trainings: "17", puls: "61" },
};

export default function WochenrueckblickCard({ zeitraum = "woche" }: { zeitraum?: Zeitraum }) {
  const { isSourceEnabled } = useSettings();
  // VITA-09: pro Messwert gaten — Schritte/Training an Aktivität, Ruhepuls an Puls.
  const aktivAkt = isSourceEnabled("wearable-aktivitaet");
  const aktivPuls = isSourceEnabled("wearable-puls");
  const aktiv = aktivAkt || aktivPuls;
  const d = DATEN[zeitraum];

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
              <span className="text-[22px] font-bold leading-none text-cat-lifestyle">{d.schritte}</span>
            ) : (
              <Ban aria-hidden size={18} className="text-muted" />
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] text-muted">
              <Footprints aria-hidden size={11} /> {aktivAkt ? d.schritteLabel : "Quelle aus"}
            </span>
          </div>
          {/* Trainings (wearable-aktivitaet) */}
          <div className="flex flex-col items-center gap-0.5 border-l border-cat-lifestyle/15 px-2 py-2.5 text-center">
            {aktivAkt ? (
              <span className="text-[22px] font-bold leading-none text-cat-lifestyle">{d.trainings}</span>
            ) : (
              <Ban aria-hidden size={18} className="text-muted" />
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] text-muted">
              <Dumbbell aria-hidden size={11} /> {aktivAkt ? "Trainings" : "Quelle aus"}
            </span>
          </div>
          {/* Ruhepuls (wearable-puls) */}
          <div className="flex flex-col items-center gap-0.5 border-l border-cat-lifestyle/15 px-2 py-2.5 text-center">
            {aktivPuls ? (
              <span className="text-[22px] font-bold leading-none text-cat-cardio">{d.puls}</span>
            ) : (
              <Ban aria-hidden size={18} className="text-muted" />
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] text-muted">
              <Heart aria-hidden size={11} /> {aktivPuls ? "Ruhepuls" : "Quelle aus"}
            </span>
          </div>
        </div>
      ) : (
        <div className="m-3 flex items-start gap-2 rounded-xl bg-surface p-3 text-sm text-ink">
          <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
          <span>
            Nutzt abgeschaltete Quelle: <span className="font-medium">Aktivität (Wearable)</span>. In
            den Einstellungen wieder einschalten.
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
        aria-label={`${d.label}: alle Sensordaten ansehen`}
        className="block overflow-hidden rounded-2xl bg-cat-lifestyle-light shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.99]"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <section
      aria-label={`Rückblick ${d.label}`}
      className="overflow-hidden rounded-2xl bg-cat-lifestyle-light shadow-card"
    >
      {inhalt}
    </section>
  );
}

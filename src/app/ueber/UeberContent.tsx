"use client";

// F9: /ueber muss Server-Component bleiben, weil sie `metadata` exportiert.
// Der Text wandert deshalb in diese schlanke Client-Unterkomponente - dasselbe
// Muster wie bei /hinweis/[id] (page.tsx + HinweisDetail.tsx).

import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import { GraduationCap, FlaskConical, User, MapPin, Calendar, Info } from "lucide-react";
import { useT } from "@/i18n/useT";

export default function UeberContent({ buildTime }: { buildTime: string | null }) {
  const { t, fmt } = useT();
  const a = t.about;

  // R3/F4: Der Zeitstempel wurde bisher auf Modulebene mit toLocaleString("de-DE")
  // gebildet und konnte auf einen Sprachwechsel nicht reagieren.
  const buildStamp = buildTime
    ? fmt.date(buildTime, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Werte, die Eigennamen sind, bleiben unuebersetzt (E6): Studiengangskuerzel,
  // Betreuungsperson, Hochschulname mit Standort.
  const INFO_ROWS: { icon: ReactNode; label: string; value: string }[] = [
    { icon: <GraduationCap aria-hidden size={17} className="text-ink-2" />, label: a.rowProgramme, value: "Master MTI, HRW" },
    { icon: <FlaskConical aria-hidden size={17} className="text-ink-2" />, label: a.rowMethod, value: a.valueMethod },
    { icon: <User aria-hidden size={17} className="text-ink-2" />, label: a.rowSupervision, value: "Ann-Kathrin Kubullek, M.A." },
    { icon: <MapPin aria-hidden size={17} className="text-ink-2" />, label: a.rowUniversity, value: "Hochschule Ruhr West, Bottrop" },
    { icon: <Calendar aria-hidden size={17} className="text-ink-2" />, label: a.rowPeriod, value: a.valuePeriod },
  ];

  return (
    <div className="pb-6">
      <AppHeader title={a.headerTitle} back={{ href: "/einstellungen", label: a.backLabel }} />

      <div className="px-4 py-4">
        {/* Wordmark */}
        <div className="flex flex-col items-center py-8 text-center">
          <p className="font-display text-[40px] font-bold leading-none text-ink">VitaLink</p>
          <p className="mt-1.5 text-[14px] text-ink-2">{a.tagline}</p>
          <p className="mt-1 text-[13px] text-ink-2">{a.version}</p>
        </div>

        {/* Info-Karte „Über das Projekt" */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          {INFO_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`flex min-h-[48px] items-center gap-3 ${
                i < INFO_ROWS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-2">
                {row.icon}
              </span>
              <span className="text-[14px] font-medium text-ink-2">{row.label}</span>
              <span className="ml-auto text-right text-[15px] font-semibold text-ink">{row.value}</span>
            </div>
          ))}
        </section>

        {/* Disclaimer-Box — die einzige der gesamten App (Block 4, Stelle 1) */}
        <section className="mt-5 rounded-2xl bg-surface-2 p-[18px]">
          <div className="flex items-center gap-3">
            <Info aria-hidden size={18} className="shrink-0 text-ink-2" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-2">
              {a.disclaimerLabel}
            </span>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink">{a.disclaimerBody}</p>
        </section>

        {buildStamp && (
          <p className="py-5 text-center text-[11px] text-muted">{a.buildStamp(buildStamp)}</p>
        )}
      </div>
    </div>
  );
}

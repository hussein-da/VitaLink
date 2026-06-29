"use client";

import Link from "next/link";
import { FileText, Check, RotateCcw, CalendarPlus } from "lucide-react";
import { terminStatusMeta, countdownLabel, type Termin } from "@/data/termine";
import { herkunftLabel } from "@/lib/dataSources";

/**
 * Termin-Listenzeile der /termine-Übersicht. Linker Bereich (Status-Icon,
 * Titel + Chip, Meta + Countdown, ePA-Tag) ist tap-through (Link). Rechts zwei
 * leichte Aktionen: „In Kalender" (simuliert) und „als erledigt markieren"
 * (nur lokal). ≥44px Tap-Fläche, Status-Farben aus terminStatusMeta.
 */
export default function TerminRow({
  termin,
  erledigt,
  onToggleErledigt,
  onCalendar,
}: {
  termin: Termin;
  erledigt: boolean;
  onToggleErledigt: () => void;
  onCalendar: () => void;
}) {
  const meta = terminStatusMeta[termin.status];
  const Icon = meta.Icon;
  const countdown = countdownLabel(termin);
  const metaText = [termin.zuletztLabel, countdown ?? termin.naechstesLabel]
    .filter(Boolean)
    .join(" · ");

  const inhalt = (
    <>
      <Icon aria-hidden size={16} className={`mt-0.5 shrink-0 ${meta.iconClass}`} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-semibold leading-snug text-ink">{termin.titel}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.chipClass}`}>
            {meta.chipLabel}
          </span>
        </span>
        {metaText && <span className="mt-0.5 block text-[12px] text-muted">{metaText}</span>}
        {termin.quelle === "epa" && (
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-muted">
            <FileText aria-hidden size={11} /> {herkunftLabel("epa").de}
          </span>
        )}
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-1 border-b border-border px-4 last:border-b-0">
      {termin.link ? (
        <Link href={termin.link} className="tap flex min-h-[44px] flex-1 items-start gap-2.5 py-3">
          {inhalt}
        </Link>
      ) : (
        <div className="flex min-h-[44px] flex-1 items-start gap-2.5 py-3">{inhalt}</div>
      )}
      <div className="flex shrink-0 items-center gap-0.5 self-center">
        <button
          type="button"
          onClick={onCalendar}
          aria-label={`„${termin.titel}" in den Kalender übernehmen`}
          className="tap flex items-center justify-center rounded-lg text-muted hover:text-cat-prevention"
        >
          <CalendarPlus aria-hidden size={18} />
        </button>
        <button
          type="button"
          onClick={onToggleErledigt}
          aria-pressed={erledigt}
          aria-label={
            erledigt
              ? `„${termin.titel}" wieder als offen markieren`
              : `„${termin.titel}" als erledigt markieren`
          }
          className={`tap flex items-center justify-center rounded-lg hover:text-cat-prevention ${
            erledigt ? "text-status-ok" : "text-muted"
          }`}
        >
          {erledigt ? <RotateCcw aria-hidden size={18} /> : <Check aria-hidden size={18} />}
        </button>
      </div>
    </div>
  );
}

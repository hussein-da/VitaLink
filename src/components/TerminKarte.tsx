"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, CalendarPlus, Pencil } from "lucide-react";
import {
  dringlichkeitMeta,
  TERMIN_ICONS,
  type Termin,
  type TerminAktion,
} from "@/data/termine";

/**
 * Termin-Karte der /termine-Übersicht — bewusst ruhig & kompakt:
 * Icon + Titel + Fälligkeit + Status-Chip, EINE Erklärzeile, max. eine
 * sekundäre Aktion. Keine doppelten „Warum?"-/Erklärtexte, keine Chip-Flut.
 */
export default function TerminKarte({
  termin,
  onAktion,
}: {
  termin: Termin;
  onAktion: (aktion: TerminAktion, termin: Termin) => void;
}) {
  const meta = dringlichkeitMeta[termin.dringlichkeit];
  const Icon = TERMIN_ICONS[termin.icon] ?? CalendarDays;
  const ChipIcon = meta.Icon;
  const erledigt = termin.dringlichkeit === "erledigt";
  const hatDetail = termin.aktionen.includes("details");
  const planbar = termin.aktionen.includes("termin-planen");
  const korrigierbar = termin.aktionen.includes("korrigieren");

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-surface p-3.5 shadow-card ${
        erledigt ? "opacity-65" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${meta.bgClass}`}>
          <Icon aria-hidden size={20} className={meta.iconClass} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold leading-snug text-ink">{termin.titel}</h3>
              <p className="mt-0.5 text-[12px] text-muted">{termin.faelligkeit}</p>
            </div>
            <span
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.chipClass}`}
            >
              <ChipIcon aria-hidden size={11} />
              {meta.label}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-[13px] leading-[1.5] text-muted">{termin.erklaerung}</p>

          {(hatDetail || planbar || korrigierbar) && (
            <div className="mt-3 flex items-center gap-2">
              {hatDetail && (
                <Link
                  href={termin.route}
                  className="tap inline-flex items-center gap-1 rounded-[10px] bg-surface-2 px-3.5 py-1.5 text-[13px] font-semibold text-ink"
                >
                  Details
                  <ChevronRight aria-hidden size={13} className="text-muted" />
                </Link>
              )}
              {planbar && (
                <button
                  type="button"
                  onClick={() => onAktion("termin-planen", termin)}
                  className="tap inline-flex items-center gap-1.5 rounded-[10px] bg-cat-lifestyle px-3.5 py-1.5 text-[13px] font-semibold text-cat-lifestyle-on"
                >
                  <CalendarPlus aria-hidden size={13} />
                  Termin planen
                </button>
              )}
              {!planbar && korrigierbar && (
                <button
                  type="button"
                  onClick={() => onAktion("korrigieren", termin)}
                  className="tap inline-flex items-center gap-1 text-[13px] text-muted"
                >
                  <Pencil aria-hidden size={12} />
                  Korrigieren
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

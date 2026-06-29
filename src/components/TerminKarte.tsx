"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, CalendarPlus, Clock, Pencil, XCircle } from "lucide-react";
import {
  dringlichkeitMeta,
  TERMIN_ICONS,
  DATENBASIS_META,
  type Termin,
  type TerminAktion,
} from "@/data/termine";

/**
 * Termin-Karte der /termine-Übersicht (Badge 2.1, Block 8/9).
 * Aufbau: Icon + Titel + Fälligkeit + Status-Chip, "Warum siehst du das?",
 * Datenbasis-Chips, max. 2 Aktionen. Status immer Icon + Text + Farbe.
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

  return (
    <article
      className={`overflow-hidden rounded-[18px] bg-surface p-4 shadow-card ${
        erledigt ? "opacity-65" : ""
      }`}
    >
      {/* Oben: Icon + Titel/Fälligkeit + Status-Chip */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bgClass}`}
          >
            <Icon aria-hidden size={20} className={meta.iconClass} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold leading-snug text-ink">{termin.titel}</h3>
            <p className="mt-0.5 text-[12px] text-muted">{termin.faelligkeit}</p>
          </div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.chipClass}`}
        >
          <ChipIcon aria-hidden size={11} />
          {meta.label}
        </span>
      </div>

      {/* Mitte: Warum siehst du das? */}
      <div className="mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
          Warum siehst du das?
        </p>
        <p className="mt-1 text-[13px] leading-[1.5] text-muted">{termin.warumSehIchDas}</p>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-ink">{termin.erklaerung}</p>
      </div>

      {/* Kombinierte Reise-Karte: fehlende Impfungen als Sub-Zeilen (Block 9) */}
      {termin.fehlendeImpfungen && termin.fehlendeImpfungen.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          {termin.fehlendeImpfungen.map((impf) => (
            <span key={impf} className="flex items-center gap-1.5 text-[13px] text-muted">
              <XCircle aria-hidden size={13} className="shrink-0 text-status-warn" />
              {impf}: kein Eintrag in deiner ePA
            </span>
          ))}
        </div>
      )}

      {/* Datenbasis-Chips */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {termin.datenbasis.map((q) => {
          const dm = DATENBASIS_META[q];
          const DIcon = dm.Icon;
          return (
            <span
              key={q}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-[3px] text-[10px] font-semibold text-muted"
            >
              <DIcon aria-hidden size={10} />
              {dm.label}
            </span>
          );
        })}
      </div>

      {/* Aktionen (max. 2) */}
      <div className="mt-3.5 flex items-center gap-2 border-t border-border pt-3">
        {termin.aktionen.map((aktion) => {
          if (aktion === "details") {
            const labelText = termin.id === "reise-impfung" ? "Reiseziel verwalten" : "Details ansehen";
            return (
              <Link
                key={aktion}
                href={termin.route}
                className="tap inline-flex items-center gap-1 rounded-[10px] bg-cat-lifestyle px-4 py-2 text-[13px] font-semibold text-cat-lifestyle-on"
              >
                {labelText}
                <ChevronRight aria-hidden size={13} />
              </Link>
            );
          }
          if (aktion === "termin-planen") {
            return (
              <button
                key={aktion}
                type="button"
                onClick={() => onAktion(aktion, termin)}
                className="tap inline-flex items-center gap-1.5 rounded-[10px] bg-surface-2 px-4 py-2 text-[13px] font-semibold text-ink"
              >
                <CalendarPlus aria-hidden size={13} className="text-muted" />
                Termin planen
              </button>
            );
          }
          if (aktion === "spaeter") {
            return (
              <button
                key={aktion}
                type="button"
                onClick={() => onAktion(aktion, termin)}
                className="tap inline-flex items-center gap-1 text-[13px] text-muted"
              >
                <Clock aria-hidden size={12} />
                Später
              </button>
            );
          }
          // korrigieren
          return (
            <button
              key={aktion}
              type="button"
              onClick={() => onAktion(aktion, termin)}
              className="tap inline-flex items-center gap-1 text-[13px] text-muted"
            >
              <Pencil aria-hidden size={12} />
              Eintrag korrigieren
            </button>
          );
        })}
      </div>
    </article>
  );
}

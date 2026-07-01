"use client";

import { ChevronDown } from "lucide-react";
import type { ExportKategorie } from "@/data/exportKategorien";
import ExportCheckboxRow from "@/components/ExportCheckboxRow";

/**
 * Einklappbare Kategorie-Karte (Akkordeon) im iOS-Settings-Muster. Header mit
 * Icon-Container + Gruppenname/Unterlabel ist tippbar und toggelt die Gruppe.
 * Die VitaLink-Analyse (betont) trägt einen eigenen Prävention-Rahmen.
 */
export default function ExportGruppe({
  kategorie,
  ausgewaehlt,
  offen,
  onToggleOffen,
  onToggleZeile,
}: {
  kategorie: ExportKategorie;
  ausgewaehlt: Record<string, boolean>;
  offen: boolean;
  onToggleOffen: () => void;
  onToggleZeile: (id: string) => void;
}) {
  const Icon = kategorie.icon;
  return (
    <div
      className={`overflow-hidden rounded-2xl shadow-card ${
        kategorie.betont ? "border border-cat-prevention bg-cat-prevention-light/40" : "bg-surface"
      }`}
    >
      <button
        type="button"
        onClick={onToggleOffen}
        aria-expanded={offen}
        className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${kategorie.iconBg}`}
        >
          <Icon aria-hidden size={17} className={kategorie.iconFarbe} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-tight text-ink">
            {kategorie.gruppenname}
          </span>
          {kategorie.unterlabel && (
            <span className="mt-0.5 block text-[11px] leading-tight text-muted">
              {kategorie.unterlabel}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          size={18}
          className={`shrink-0 text-muted transition-transform duration-200 ${offen ? "" : "-rotate-90"}`}
        />
      </button>

      {offen && (
        <div className="reveal">
          {kategorie.zeilen.map((z, i) => (
            <ExportCheckboxRow
              key={z.id}
              label={z.label}
              sublabel={z.sublabel}
              checked={Boolean(ausgewaehlt[z.id])}
              onToggle={() => onToggleZeile(z.id)}
              last={i === kategorie.zeilen.length - 1 && !kategorie.fussnote}
            />
          ))}
          {kategorie.fussnote && (
            <p className="px-4 pb-2 pt-2 text-[11px] leading-snug text-muted">{kategorie.fussnote}</p>
          )}
        </div>
      )}
    </div>
  );
}

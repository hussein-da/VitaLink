"use client";

import { useState } from "react";
import {
  ChevronDown,
  Info,
  FileText,
  Watch,
  Sparkles,
  Dumbbell,
  Sun,
  Moon,
  TrendingDown,
  Heart,
  Salad,
  Droplets,
  Thermometer,
  Syringe,
  Calendar,
  ClipboardCheck,
  Plane,
  Footprints,
  Wind,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { SmartTipp, SmartTippQuelle } from "@/data/smartTipps";
import type { KategorieIdentitaet } from "@/lib/kategorie";

/** Lucide-Icons, die in den Tipps referenziert werden (String → Komponente). */
const TIPP_ICONS: Record<string, LucideIcon> = {
  Dumbbell,
  Sun,
  Moon,
  TrendingDown,
  Heart,
  Salad,
  Droplets,
  Thermometer,
  Syringe,
  Calendar,
  ClipboardCheck,
  Plane,
  Footprints,
  Wind,
  Clock,
};

/** Quellen-Chip-Definition: Icon + Kurzlabel je Datenquelle. */
const QUELLEN_META: Record<SmartTippQuelle, { icon: LucideIcon; label: string }> = {
  epa: { icon: FileText, label: "ePA" },
  wearable: { icon: Watch, label: "Wearable" },
  context: { icon: Sparkles, label: "Kontext" },
};

/**
 * Smarte-Empfehlungs-Karte (Prompt 10, Block 3+4). Zeigt einen aus mehreren
 * Datenpunkten kombinierten, konkret umsetzbaren Tipp. Der linke Akzentrand
 * trägt die Kategorie-Farbe, Quellen-Chips machen die ePA-/Wearable-Kombination
 * sichtbar, und „Warum diese Empfehlung?“ klappt die Datenbegründung auf.
 */
export default function SmartTippCard({
  tipp,
  k,
}: {
  tipp: SmartTipp;
  k: KategorieIdentitaet;
}) {
  const [warumOffen, setWarumOffen] = useState(false);
  const Icon = TIPP_ICONS[tipp.icon] ?? Sparkles;

  return (
    <article
      className="rounded-2xl bg-surface p-4 shadow-sm"
      style={{ borderLeft: `3px solid rgb(var(--c-${k.base}))` }}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] ${k.soft}`}
        >
          <Icon aria-hidden size={20} className={k.text} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-[15px] font-semibold leading-snug text-ink">{tipp.titel}</h4>
          {tipp.quellen.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {tipp.quellen.map((q) => {
                const meta = QUELLEN_META[q];
                const ChipIcon = meta.icon;
                return (
                  <li
                    key={q}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-ink-2"
                  >
                    <ChipIcon aria-hidden size={11} className="text-ink-2" />
                    {meta.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-[1.6] text-ink">{tipp.text}</p>

      {tipp.warum && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setWarumOffen((o) => !o)}
            aria-expanded={warumOffen}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2"
          >
            <Info aria-hidden size={14} className="text-ink-2" />
            Warum diese Empfehlung?
            <ChevronDown
              aria-hidden
              size={14}
              className={`text-ink-2 transition-transform ${warumOffen ? "rotate-180" : ""}`}
            />
          </button>
          {warumOffen && (
            <p className="reveal mt-2 border-l-2 border-border pl-3 text-[14px] leading-[1.6] text-ink-2">
              {tipp.warum}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

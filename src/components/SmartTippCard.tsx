"use client";

import {
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
import { highlightNumbers } from "@/utils/highlight";

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
 * Smarte-Empfehlungs-Karte (Prompt 10 + 11). Verdichtet auf zwei Sätze
 * (Erkenntnis, Zahlen fett + Kategorie-Farbe) plus eine eigene, gerahmte
 * Handlungszeile mit „→"-Anker. Der linke Akzentrand und die Quellen-Chips
 * tragen die ePA-/Wearable-Kombination.
 */
export default function SmartTippCard({
  tipp,
  k,
}: {
  tipp: SmartTipp;
  k: KategorieIdentitaet;
}) {
  const Icon = TIPP_ICONS[tipp.icon] ?? Sparkles;
  const akzent = `rgb(var(--c-${k.base}))`;

  return (
    <article
      className="rounded-2xl bg-surface px-4 py-5 shadow-sm"
      style={{ borderLeft: `3px solid ${akzent}` }}
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

      <p className="mt-3 text-[14px] leading-[1.6] text-ink">
        {highlightNumbers(tipp.text, akzent)}
      </p>

      {/* Handlungsschritt: eigene, button-artig gerahmte Zeile mit „→"-Anker */}
      <div
        className={`mt-2.5 flex items-start gap-2 rounded-lg ${k.soft} px-3 py-2`}
      >
        <span aria-hidden className="text-[14px] font-bold leading-[1.5]" style={{ color: akzent }}>
          →
        </span>
        <span className="text-[14px] font-semibold leading-[1.5] text-ink">{tipp.handlung}</span>
      </div>
    </article>
  );
}

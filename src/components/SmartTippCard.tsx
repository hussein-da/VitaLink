"use client";

import {
  ArrowRight,
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
  Phone,
  X,
  RotateCcw,
  Ban,
  type LucideIcon,
} from "lucide-react";
import type { SmartTipp, SmartTippQuelle } from "@/data/smartTipps";
import type { KategorieIdentitaet } from "@/lib/kategorie";
import { highlightNumbersUndTerme } from "@/utils/highlight";
import { useSettings } from "@/context/SettingsContext";
import FeedbackControls from "@/components/FeedbackControls";

const TIPP_ICONS: Record<string, LucideIcon> = {
  Dumbbell, Sun, Moon, TrendingDown, Heart, Salad, Droplets,
  Thermometer, Syringe, Calendar, ClipboardCheck, Plane,
  Footprints, Wind, Clock, Phone,
};

const QUELLEN_META: Record<SmartTippQuelle, { icon: LucideIcon; label: string }> = {
  epa: { icon: FileText, label: "ePA" },
  wearable: { icon: Watch, label: "Wearable" },
  context: { icon: Sparkles, label: "Kontext" },
};

/**
 * Smarte-Empfehlungs-Karte. Rückmeldung je KONKRETER Empfehlung (eine Ebene
 * tiefer als die Kategorie-Karten): „×" oben rechts blendet den Tipp aus
 * (collapsed + Rückgängig), im Footer 👍 „gemerkt" / 👎 Widerspruch.
 * Gekeyt auf die Tipp-ID (tipp.id).
 */
export default function SmartTippCard({
  tipp,
  k,
}: {
  tipp: SmartTipp;
  k: KategorieIdentitaet;
}) {
  const { isDismissed, dismiss, restore } = useSettings();
  const Icon = TIPP_ICONS[tipp.icon] ?? Sparkles;
  const akzent = `rgb(var(--c-${k.base}))`;
  const quellen = tipp.quellen.filter((q) => q !== "context");

  if (isDismissed(tipp.id)) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[18px] bg-surface-2 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-[13px] text-muted">
          <Ban aria-hidden size={14} className="shrink-0" />
          <span className="truncate">„{tipp.titel}" ausgeblendet</span>
        </span>
        <button
          type="button"
          onClick={() => restore(tipp.id)}
          className="tap inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink"
        >
          <RotateCcw aria-hidden size={13} /> Rückgängig
        </button>
      </div>
    );
  }

  return (
    <article
      className="relative rounded-[18px] bg-surface px-[18px] pb-[14px] pt-[18px] shadow-card"
      style={{ borderLeft: `4px solid ${akzent}` }}
    >
      {/* Ausblenden */}
      <button
        type="button"
        onClick={() => dismiss(tipp.id)}
        aria-label={`„${tipp.titel}" ausblenden`}
        className="tap absolute right-1.5 top-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
      >
        <X aria-hidden size={16} />
      </button>

      {/* Icon + Titel */}
      <div className="flex items-center gap-2.5 pr-8">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${k.soft}`}
        >
          <Icon aria-hidden size={20} className={k.text} strokeWidth={2} />
        </span>
        <h4 className={`text-[17px] font-semibold leading-snug ${k.text}`}>{tipp.titel}</h4>
      </div>

      {/* Tipp-Text, max 2 Sätze, Zahlen fett + Farbe */}
      <p className="mt-3 text-[15px] leading-[1.55] text-ink">
        {highlightNumbersUndTerme(tipp.text, akzent)}
      </p>

      {/* Handlungs-Box */}
      <div className={`mt-3 flex items-center gap-2 rounded-[10px] ${k.soft} px-3.5 py-2.5`}>
        <ArrowRight aria-hidden size={16} className={k.text} strokeWidth={2.5} />
        <span className="text-[15px] font-semibold leading-snug text-ink">{tipp.handlung}</span>
      </div>

      {/* Footer: Datengrundlage links, Rückmeldung (👍/👎) rechts */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          {quellen.length > 0 && (
            <>
              <span className="text-[11px] text-muted">Datengrundlage:</span>
              {quellen.map((q) => {
                const meta = QUELLEN_META[q];
                const QIcon = meta.icon;
                return (
                  <span key={q} className="flex items-center gap-1">
                    <QIcon aria-hidden size={11} className="text-muted" />
                    <span className="text-[11px] font-semibold text-muted">{meta.label}</span>
                  </span>
                );
              })}
            </>
          )}
        </div>
        <FeedbackControls id={tipp.id} />
      </div>
    </article>
  );
}

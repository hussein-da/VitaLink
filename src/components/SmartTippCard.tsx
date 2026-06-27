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
  type LucideIcon,
} from "lucide-react";
import type { SmartTipp, SmartTippQuelle } from "@/data/smartTipps";
import type { KategorieIdentitaet } from "@/lib/kategorie";
import { highlightNumbers } from "@/utils/highlight";

const TIPP_ICONS: Record<string, LucideIcon> = {
  Dumbbell, Sun, Moon, TrendingDown, Heart, Salad, Droplets,
  Thermometer, Syringe, Calendar, ClipboardCheck, Plane,
  Footprints, Wind, Clock,
};

const QUELLEN_META: Record<SmartTippQuelle, { icon: LucideIcon; label: string }> = {
  epa: { icon: FileText, label: "ePA" },
  wearable: { icon: Watch, label: "Wearable" },
  context: { icon: Sparkles, label: "Kontext" },
};

/**
 * Smarte-Empfehlungs-Karte (Prompt 12, Änderung 3). Neue Anatomie:
 * Icon + Titel 17px SemiBold → Tipp-Text 15px (Zahlen fett + Kategorie-Farbe)
 * → Handlungsbox mit ArrowRight → Quellenzeile mit border-top.
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
      className="rounded-[18px] bg-surface px-[18px] pb-[14px] pt-[18px] shadow-card"
      style={{ borderLeft: `4px solid ${akzent}` }}
    >
      {/* Icon + Titel */}
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${k.soft}`}
        >
          <Icon aria-hidden size={20} className={k.text} strokeWidth={2} />
        </span>
        <h4 className="text-[17px] font-semibold leading-snug text-ink">{tipp.titel}</h4>
      </div>

      {/* Tipp-Text, max 2 Sätze, Zahlen fett + Farbe */}
      <p className="mt-3 text-[15px] leading-[1.55] text-ink">
        {highlightNumbers(tipp.text, akzent)}
      </p>

      {/* Handlungs-Box */}
      <div
        className={`mt-3 flex items-center gap-2 rounded-[10px] ${k.soft} px-3.5 py-2.5`}
      >
        <ArrowRight aria-hidden size={16} className={k.text} strokeWidth={2.5} />
        <span className="text-[15px] font-semibold leading-snug text-ink">{tipp.handlung}</span>
      </div>

      {/* Quellenzeile */}
      {tipp.quellen.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-2.5">
          <span className="text-[11px] text-muted">Datengrundlage:</span>
          {tipp.quellen
            .filter((q) => q !== "context")
            .map((q) => {
              const meta = QUELLEN_META[q];
              const QIcon = meta.icon;
              return (
                <span key={q} className="flex items-center gap-1">
                  <QIcon aria-hidden size={11} className="text-muted" />
                  <span className="text-[11px] font-semibold text-muted">{meta.label}</span>
                </span>
              );
            })}
        </div>
      )}
    </article>
  );
}

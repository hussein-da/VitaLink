import { FileText, Watch, CalendarClock, ArrowRight, type LucideIcon } from "lucide-react";

/**
 * Sichtbarkeit der Kombination (USP), Ebene 1 (§3b): zwei dezente Quellen-Chips
 * "ePA + Wearable" mit einem Plus dazwischen, rechts ein "Details →" in der
 * Kategorie-Farbe. Macht in fünf Sekunden klar: Arztdaten + Körperdaten.
 */
function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-[3px] text-[11px] font-medium text-muted">
      <Icon aria-hidden size={12} />
      {label}
    </span>
  );
}

export default function ComboChip({
  text,
  detailsLabel = "Details",
  zweiteQuelle = "Wearable",
  zweiteArt = "wearable",
}: {
  /** Kategorie-Textfarbe für "Details", z. B. "text-cat-lifestyle". */
  text: string;
  detailsLabel?: string;
  zweiteQuelle?: string;
  zweiteArt?: "wearable" | "user";
}) {
  const ZweitIcon = zweiteArt === "user" ? CalendarClock : Watch;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1.5">
        <Chip icon={FileText} label="ePA" />
        <span aria-hidden className="text-[11px] font-semibold text-muted">
          +
        </span>
        <Chip icon={ZweitIcon} label={zweiteQuelle} />
      </span>
      <span className={`flex shrink-0 items-center gap-0.5 text-xs font-semibold ${text}`}>
        {detailsLabel}
        <ArrowRight aria-hidden size={14} />
      </span>
    </div>
  );
}

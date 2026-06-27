import { FileText, Watch, CalendarClock, ArrowRight, type LucideIcon } from "lucide-react";

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-ink-2">
      <Icon aria-hidden size={12} />
      {label}
    </span>
  );
}

export default function ComboChip({
  text,
  solid,
  on,
  detailsLabel = "Details",
  zweiteQuelle = "Wearable",
  zweiteArt = "wearable",
  nurEpa = false,
}: {
  text: string;
  solid?: string;
  on?: string;
  detailsLabel?: string;
  zweiteQuelle?: string;
  zweiteArt?: "wearable" | "user";
  /** Wenn true: nur ePA-Chip, kein Kombinierungs-Plus. */
  nurEpa?: boolean;
}) {
  const ZweitIcon = zweiteArt === "user" ? CalendarClock : Watch;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1.5">
        <Chip icon={FileText} label="ePA" />
        {!nurEpa && (
          <>
            <span aria-hidden className="text-[12px] font-semibold text-ink-2">+</span>
            <Chip icon={ZweitIcon} label={zweiteQuelle} />
          </>
        )}
      </span>
      {solid && on ? (
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold ${solid} ${on}`}
        >
          {detailsLabel}
          <ArrowRight aria-hidden size={14} />
        </span>
      ) : (
        <span className={`flex shrink-0 items-center gap-0.5 text-sm font-semibold ${text}`}>
          {detailsLabel}
          <ArrowRight aria-hidden size={14} />
        </span>
      )}
    </div>
  );
}

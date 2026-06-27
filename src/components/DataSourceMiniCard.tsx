import { FileText, Watch, CalendarClock, type LucideIcon } from "lucide-react";
import type { Datenpunkt, DatenpunktStatus } from "@/lib/types";

/**
 * Mini-Karte je Datenquelle (USP, §3b Ebene 2). Zeigt konkret, welche ePA-
 * bzw. Wearable-Datenpunkte hinter einer Empfehlung stehen — nebeneinander
 * machen die beiden Karten die Kombination "Arztdaten + Körperdaten" greifbar.
 */
function wertFarbe(status?: DatenpunktStatus): string {
  switch (status) {
    case "warn":
      // accent-ink (#BF360C) statt status-warn (#E65100): AA-konform als
      // Textfarbe auf surface-2 (~5:1); Orange bleibt Icon-/Flächenfarbe.
      return "text-accent-ink";
    case "ok":
      return "text-status-ok";
    case "info":
      return "text-cat-travel";
    default:
      return "text-ink";
  }
}

export default function DataSourceMiniCard({
  art,
  label,
  punkte,
}: {
  art: "epa" | "wearable" | "user";
  label: string;
  punkte: Datenpunkt[];
}) {
  const Icon: LucideIcon = art === "epa" ? FileText : art === "user" ? CalendarClock : Watch;
  return (
    <div className="flex flex-1 flex-col gap-2.5 rounded-2xl bg-surface-2 p-3.5">
      <div className="flex items-center gap-1.5">
        <Icon aria-hidden size={14} className="text-muted" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
          {label}
        </span>
      </div>
      <dl className="flex flex-col gap-2">
        {punkte.map((p, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <dt className="text-[11px] text-muted">{p.label}</dt>
            <dd className={`text-[14px] font-semibold ${wertFarbe(p.status)}`}>{p.wert}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

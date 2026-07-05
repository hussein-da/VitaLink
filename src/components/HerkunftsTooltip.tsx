"use client";

import { Info, FileText, Watch, CalendarClock, Sparkles, type LucideIcon } from "lucide-react";
import SmartPopover from "@/components/ui/SmartPopover";
import { herkunftFuer } from "@/lib/datenherkunft";
import type { Datenherkunft } from "@/lib/types";

const TYP_META: Record<Datenherkunft["typ"], { icon: LucideIcon; titel: string }> = {
  epa: { icon: FileText, titel: "Aus deiner ePA" },
  wearable: { icon: Watch, titel: "Apple Watch Series 12" },
  nutzereingabe: { icon: CalendarClock, titel: "Deine Eingabe" },
  "vitalink-ki": { icon: Sparkles, titel: "VitaLink-KI" },
};

/** Kurze Detailzeile je Herkunft: ePA → Quelle · Datum, Wearable → Sensor · Zeitraum
 *  (der Gerätename steht bereits im Titel „Apple Watch Series 12"),
 *  VitaLink-KI → freie Beschreibung der Verknüpfung. */
function detailZeile(h: Datenherkunft): string {
  if (h.typ === "vitalink-ki") return h.beschreibung ?? "";
  const teile = h.typ === "wearable" ? [h.sensorart, h.zeitraum] : [h.quelle, h.datum];
  return teile.filter(Boolean).join(" · ");
}

/**
 * Herkunfts-Affordance (DF5/DF6). Nutzt die zentrale Datenherkunft-Struktur und
 * den bestehenden SmartPopover (kollisionsbewusst, per Tastatur bedienbar,
 * Escape/Outside-Click schließen). Zwei Auslöser-Varianten:
 *   - "text": deutliche Zeile „Datenquelle ansehen" (Kombinierungszeile, Block 3)
 *   - "icon": platzsparendes Info-Icon (je Datenpunkt, Block 4 / je Wert Block 5)
 * Kein Fließtext, keine Fachbegriffserklärung — das bleibt bei GlossarTerm.
 */
export default function HerkunftsTooltip({
  ids,
  variant = "text",
  label = "Datenquelle ansehen",
}: {
  ids: (string | undefined)[];
  variant?: "text" | "icon";
  label?: string;
}) {
  // Nach id entdoppeln, dann optisch identische Zeilen zusammenfassen
  // (z. B. mehrere Schlafsensor-Werte → eine „Von deinem Wearable"-Zeile).
  const gesehen = new Set<string>();
  const eintraege = herkunftFuer(ids).filter((h) => {
    const key = `${h.typ}|${detailZeile(h)}`;
    if (gesehen.has(key)) return false;
    gesehen.add(key);
    return true;
  });
  if (eintraege.length === 0) return null;

  const anchor =
    variant === "icon" ? (
      <button
        type="button"
        aria-label={label}
        className="tap -m-2.5 inline-flex items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
      >
        <Info aria-hidden size={14} />
      </button>
    ) : (
      <button
        type="button"
        className="tap inline-flex items-center gap-1 rounded-full text-[13px] font-semibold text-primary-bright"
      >
        <Info aria-hidden size={14} />
        {label}
      </button>
    );

  const content = (
    <div className="reveal z-[70] w-[min(82vw,300px)] rounded-2xl border border-border bg-surface p-3.5 shadow-lg">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-2">
        Datenherkunft
      </p>
      <ul className="space-y-2.5">
        {eintraege.map((h) => {
          const meta = TYP_META[h.typ];
          const Icon = meta.icon;
          const istKi = h.typ === "vitalink-ki";
          return (
            <li
              key={h.id}
              className={`flex items-start gap-2.5 ${istKi ? "border-t border-border pt-2.5" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  istKi ? "bg-primary-soft" : "bg-surface-2"
                }`}
              >
                <Icon aria-hidden size={13} className={istKi ? "text-primary" : "text-ink-2"} />
              </span>
              <span className="min-w-0 text-[13px] leading-snug">
                <span className="block font-semibold text-ink">{meta.titel}</span>
                <span className="block text-ink-2">{detailZeile(h)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <SmartPopover role="dialog" ariaLabel="Datenherkunft" anchor={anchor} content={content} className="z-[70]" />
  );
}

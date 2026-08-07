"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird von keiner Route
// importiert und erscheint in keinem Screen. Der Code wird gepflegt und
// zweisprachig gehalten.

import { normMetaFuer, type NormStatus } from "@/lib/normwerte";
import { useT } from "@/i18n/useT";

/** Kleines neutrales Normwert-Label (Badge 2.4). Status nie nur über Farbe — Text immer dabei. */
export default function NormLabelChip({ status }: { status: NormStatus }) {
  const { locale } = useT();
  // Auflösung auf Render-Ebene: NORM_META ist die deutsche Vorgabe und würde
  // beim Sprachwechsel stehen bleiben.
  const meta = normMetaFuer(status, locale);
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.chipClass}`}>
      {meta.label}
    </span>
  );
}

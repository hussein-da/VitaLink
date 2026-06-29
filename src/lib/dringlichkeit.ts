// VitaLink — Dringlichkeits-Helfer (Block 0/2/5).
// Rechnet aus einer ISO-Deadline einen kompakten Badge-Text ("13 Tage" /
// "7 Wochen") und entscheidet, ob eine Empfehlung zeitkritisch ist (< 30 Tage).
//
// Referenzdatum kommt aus der zentralen Szenario-Zeit (lib/zeit.ts), damit alle
// Badges deterministisch und app-weit konsistent sind.

import { SZENARIO_HEUTE, tageBis } from "@/lib/zeit";

// Re-Export für bestehende Importeure (eine Quelle der Wahrheit: lib/zeit.ts).
export { SZENARIO_HEUTE, tageBis };

/** Eine Empfehlung gilt als zeitkritisch, wenn ihre Deadline in < 30 Tagen liegt. */
export function istZeitkritisch(iso: string | null | undefined, ref: Date = SZENARIO_HEUTE): boolean {
  if (!iso) return false;
  const tage = tageBis(iso, ref);
  return tage >= 0 && tage < 30;
}

/**
 * Kompakter Badge-Text: bis 21 Tage in Tagen, darüber in Wochen.
 * Liefert `null`, wenn keine Deadline vorliegt.
 */
export function dringlichkeitsBadge(
  iso: string | null | undefined,
  ref: Date = SZENARIO_HEUTE,
): string | null {
  if (!iso) return null;
  const tage = tageBis(iso, ref);
  if (tage < 0) return null;
  if (tage <= 21) return `${tage} Tage`;
  return `${Math.round(tage / 7)} Wochen`;
}

// VitaLink — geteilte Szenario-Zeit (Badge 0.1).
// Eine einzige Quelle für das "Heute" des Demonstrators. Alle Datums- und
// Countdown-Berechnungen leiten hieraus ab; nichts wird hartkodiert.
// Bewusst fixes Datum (kein new Date()) — SSG-/Hydration-sicher und
// deterministisch über alle Screens (Maras Fall, SoSe 2026).

/** Szenario-„heute" (frozen) — die einzige Heute-Quelle der App. */
export const SZENARIO_HEUTE = new Date("2026-06-29T00:00:00");

/** Jahr des Szenario-Heute (für jahres-granulare Berechnungen, z. B. Impfstatus). */
export const SZENARIO_JAHR = SZENARIO_HEUTE.getFullYear();

const MS_PRO_TAG = 1000 * 60 * 60 * 24;

/**
 * Volle Tage von `ref` bis zur ISO-Deadline.
 * App-weit auf Math.ceil vereinheitlicht, damit Countdowns über alle Screens
 * identisch sind (z. B. /vitalink-Badge und /termine-Countdown).
 */
export function tageBis(iso: string, ref: Date = SZENARIO_HEUTE): number {
  const ziel = new Date(iso).getTime();
  return Math.ceil((ziel - ref.getTime()) / MS_PRO_TAG);
}

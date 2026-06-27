// VitaLink — Dringlichkeits-Helfer (Block 0/2/5).
// Rechnet aus einer ISO-Deadline einen kompakten Badge-Text ("18 Tage" /
// "7 Wochen") und entscheidet, ob eine Empfehlung zeitkritisch ist (< 30 Tage).
//
// Referenzdatum ist bewusst auf den Szenario-Tag fixiert (Maras Fall, Juni
// 2026) — so bleiben die Badges deterministisch und unabhängig davon, wann
// der Demonstrator geöffnet wird.

/** Szenario-„heute" (frozen). Wearable-Sync: 24.06.2026, 06:42 Uhr. */
export const SZENARIO_HEUTE = new Date("2026-06-24T06:42:00");

const MS_PRO_TAG = 1000 * 60 * 60 * 24;

/** Volle Tage von `ref` bis zur ISO-Deadline (aufgerundet, nie negativ in der Anzeige). */
export function tageBis(iso: string, ref: Date = SZENARIO_HEUTE): number {
  const ziel = new Date(iso).getTime();
  return Math.ceil((ziel - ref.getTime()) / MS_PRO_TAG);
}

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

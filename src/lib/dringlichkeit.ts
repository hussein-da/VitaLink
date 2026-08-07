// VitaLink — Dringlichkeits-Helfer (Block 0/2/5).
// Rechnet aus einer ISO-Deadline einen kompakten Badge-Text ("13 Tage" /
// "7 Wochen") und entscheidet, ob eine Empfehlung zeitkritisch ist (< 30 Tage).
//
// Referenzdatum kommt aus der zentralen Szenario-Zeit (lib/zeit.ts), damit alle
// Badges deterministisch und app-weit konsistent sind. Die Locale steuert nur
// die FORMATIERUNG (Sprache, Pluralform, Zahlformat) — nie den Zeitpunkt.

import { SZENARIO_HEUTE, tageBis } from "@/lib/zeit";
import type { Locale } from "@/i18n/types";
import { plural } from "@/i18n/format";

// Re-Export für bestehende Importeure (eine Quelle der Wahrheit: lib/zeit.ts).
export { SZENARIO_HEUTE, tageBis };

/** Eine Empfehlung gilt als zeitkritisch, wenn ihre Deadline in < 30 Tagen liegt. */
export function istZeitkritisch(iso: string | null | undefined, ref: Date = SZENARIO_HEUTE): boolean {
  if (!iso) return false;
  const tage = tageBis(iso, ref);
  return tage >= 0 && tage < 30;
}

/**
 * Vollständige Textbausteine je Sprache — nie aus Fragmenten zusammengesetzt,
 * damit Singular/Plural und Wortstellung pro Sprache stimmen.
 */
const BADGE_FORMEN: Record<Locale, { tage: { one: string; other: string }; wochen: { one: string; other: string } }> = {
  // Die Praeposition ist Teil der Form, nicht des Aufrufers: Im Deutschen
  // verlangt "in" den Dativ ("in 3 Tagen", nicht "in 3 Tage"). Frueher haengte
  // der Aufrufer ein "in " davor und korrigierte die Beugung nachtraeglich per
  // .replace(" Tage", " Tagen") am fertigen String - das brach im Englischen
  // ersatzlos. Die vollstaendige Form je Numerus ist die Uebersetzungseinheit.
  de: {
    tage: { one: "in {n} Tag", other: "in {n} Tagen" },
    wochen: { one: "in {n} Woche", other: "in {n} Wochen" },
  },
  en: {
    tage: { one: "in {n} day", other: "in {n} days" },
    wochen: { one: "in {n} week", other: "in {n} weeks" },
  },
};

/**
 * Kompakter Badge-Text: bis 21 Tage in Tagen, darüber in Wochen.
 * Liefert `null`, wenn keine Deadline vorliegt.
 */
export function dringlichkeitsBadge(
  iso: string | null | undefined,
  locale: Locale,
  ref: Date = SZENARIO_HEUTE,
): string | null {
  if (!iso) return null;
  const tage = tageBis(iso, ref);
  if (tage < 0) return null;
  const formen = BADGE_FORMEN[locale];
  if (tage <= 21) return plural(tage, locale, formen.tage);
  return plural(Math.round(tage / 7), locale, formen.wochen);
}

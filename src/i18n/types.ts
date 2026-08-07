// Zentrale i18n-Typen. Bewusst ohne Laufzeit-Importe, damit dieses Modul von
// jeder Schicht (Daten, lib, Komponenten) zyklenfrei genutzt werden kann.

/** Die vier waehlbaren Sprachen der Oberflaeche (Auswahl bleibt vierstellig). */
export type Language = "de" | "en" | "tr" | "ar";

/** Die zwei tatsaechlich ausgebauten Sprachstaende. */
export type Locale = "de" | "en";

/** de bleibt de; en, tr und ar rendern den englischen Sprachstand. */
export function resolveLocale(language: Language): Locale {
  return language === "de" ? "de" : "en";
}

/**
 * Lokalisierter Datenwert. Einzige Definition im Projekt.
 * Lag urspruenglich in src/data/reise.ts und wird von dort aus
 * abwaertskompatibel re-exportiert.
 */
export interface Lokalisiert {
  de: string;
  en: string;
}

/** Intl-Tags je Locale (E5: englischer Sprachstand formatiert nach en-GB). */
export const INTL_TAG: Record<Locale, string> = {
  de: "de-DE",
  en: "en-GB",
};

/**
 * Weitet die durch `as const` entstandenen Literaltypen des deutschen
 * Woerterbuchs auf `string`, damit das englische Woerterbuch dieselbe Struktur
 * mit anderen Werten erfuellen kann. Ohne diese Weitung wuerde `en: Dictionary`
 * verlangen, dass jeder englische Wert exakt der deutsche Wortlaut ist.
 * Funktionssignaturen bleiben unveraendert erhalten.
 */
export type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : { [K in keyof T]: Widen<T[K]> };

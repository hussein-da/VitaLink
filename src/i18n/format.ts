// Locale-bewusste Formatierung, React-frei.
//
// Warum eigenes Modul: Die Datenschicht (src/data, src/lib) muss Zahlen und
// Daten locale-richtig formatieren, kann aber keinen Hook aufrufen. useT baut
// seine `fmt`-Helfer auf genau diesen Funktionen auf - damit gibt es im ganzen
// Projekt EINEN Formatierungsweg und nicht zwei divergierende.
//
// Intl-Instanzen werden je Locale und Optionssatz memoisiert.

import { INTL_TAG, type Locale } from "./types";

const numberFormats = new Map<string, Intl.NumberFormat>();
const dateFormats = new Map<string, Intl.DateTimeFormat>();
const pluralRules = new Map<Locale, Intl.PluralRules>();

export function numberFormat(locale: Locale, opts?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}|${opts ? JSON.stringify(opts) : ""}`;
  let f = numberFormats.get(key);
  if (!f) {
    f = new Intl.NumberFormat(INTL_TAG[locale], opts);
    numberFormats.set(key, f);
  }
  return f;
}

export function dateFormat(locale: Locale, opts?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${opts ? JSON.stringify(opts) : ""}`;
  let f = dateFormats.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(INTL_TAG[locale], opts);
    dateFormats.set(key, f);
  }
  return f;
}

export function pluralRule(locale: Locale): Intl.PluralRules {
  let r = pluralRules.get(locale);
  if (!r) {
    r = new Intl.PluralRules(INTL_TAG[locale]);
    pluralRules.set(locale, r);
  }
  return r;
}

/** Zahl nach aktiver Locale (de-DE bzw. en-GB). */
export function zahl(n: number, locale: Locale, opts?: Intl.NumberFormatOptions): string {
  return numberFormat(locale, opts).format(n);
}

/** Datum nach aktiver Locale. Nimmt ISO-String oder Date. */
export function datum(
  isoOrDate: string | Date,
  locale: Locale,
  opts?: Intl.DateTimeFormatOptions,
): string {
  return dateFormat(locale, opts).format(
    typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate,
  );
}

/**
 * Waehlt die Pluralform ueber Intl.PluralRules und ersetzt `{n}` durch die
 * locale-formatierte Zahl. Beide Formen sind VOLLSTAENDIGE Textbausteine -
 * es wird nie aus Fragmenten zusammengesetzt, weil Satzstellung und Beugung
 * je Sprache abweichen.
 *
 *   plural(1, "de", { one: "in {n} Tag", other: "in {n} Tagen" })
 */
export function plural(
  n: number,
  locale: Locale,
  forms: { one: string; other: string },
): string {
  const form = pluralRule(locale).select(n) === "one" ? forms.one : forms.other;
  return form.replace("{n}", zahl(n, locale));
}

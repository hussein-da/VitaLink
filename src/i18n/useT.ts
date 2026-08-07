"use client";

// Der einzige Weg im Projekt, an einen uebersetzten Text zu kommen.
// Liest die Sprache aus dem bestehenden SettingsContext - es gibt bewusst
// KEINEN zweiten Context und KEINEN zweiten Provider.

import { useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";
import { de } from "./de";
import { en } from "./en";
import type { Dictionary } from "./de";
import { INTL_TAG, resolveLocale, type Language, type Locale, type Lokalisiert } from "./types";

const DICTS: Record<Locale, Dictionary> = { de, en };

// --- Memoisierte Intl-Instanzen ------------------------------------------
// Intl-Objekte sind teuer; sie werden je Locale und Optionssatz genau einmal
// gebaut und modulweit wiederverwendet (nicht bei jedem Render neu erzeugt).
const numberFormats = new Map<string, Intl.NumberFormat>();
const dateFormats = new Map<string, Intl.DateTimeFormat>();
const pluralRules = new Map<Locale, Intl.PluralRules>();

function numberFormat(locale: Locale, opts?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}|${opts ? JSON.stringify(opts) : ""}`;
  let f = numberFormats.get(key);
  if (!f) {
    f = new Intl.NumberFormat(INTL_TAG[locale], opts);
    numberFormats.set(key, f);
  }
  return f;
}

function dateFormat(locale: Locale, opts?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${opts ? JSON.stringify(opts) : ""}`;
  let f = dateFormats.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(INTL_TAG[locale], opts);
    dateFormats.set(key, f);
  }
  return f;
}

function pluralRule(locale: Locale): Intl.PluralRules {
  let r = pluralRules.get(locale);
  if (!r) {
    r = new Intl.PluralRules(INTL_TAG[locale]);
    pluralRules.set(locale, r);
  }
  return r;
}

export interface Formatter {
  /** Zahl nach aktiver Locale (de-DE bzw. en-GB). */
  number: (n: number, opts?: Intl.NumberFormatOptions) => string;
  /** Datum nach aktiver Locale. Nimmt ISO-String oder Date. */
  date: (isoOrDate: string | Date, opts?: Intl.DateTimeFormatOptions) => string;
  /**
   * Waehlt die Pluralform ueber Intl.PluralRules und ersetzt den Platzhalter
   * `{n}` durch die locale-formatierte Zahl.
   * Beide Formen sind vollstaendige Textbausteine - es wird NIE aus Fragmenten
   * zusammengesetzt, weil Satzstellung und Beugung je Sprache abweichen.
   *
   *   fmt.plural(1, { one: "in {n} day", other: "in {n} days" })  -> "in 1 day"
   */
  plural: (n: number, forms: { one: string; other: string }) => string;
}

export interface Translation {
  /** Das aufgeloeste Woerterbuch der aktiven Locale. */
  t: Dictionary;
  /** Die aktive Locale ("de" oder "en"). */
  locale: Locale;
  /**
   * Die ROHE Sprachwahl aus allen vier Optionen (de/en/tr/ar) - fuer die
   * wenigen Stellen, die alle vier unterscheiden muessen (Sprachauswahl,
   * viersprachige Onboarding-Tabellen).
   *
   * Unterliegt demselben Hydrations-Gate wie `t`: bis zur Hydration "de".
   * Wer den Wert ungegated aus dem Context liest, erzeugt genau die
   * Hydrations-Kollision, die das Gate verhindern soll.
   */
  language: Language;
  /** Loest einen lokalisierten Datenwert { de, en } auf. */
  tv: (value: Lokalisiert) => string;
  /** Locale-bewusste Formatierer. */
  fmt: Formatter;
}

export function useT(): Translation {
  const { language, hydrated } = useSettings();

  // HYDRATIONS-GATE (gezielt, nicht pauschal).
  //
  // Das statisch ausgelieferte HTML entsteht zur Build-Zeit und traegt immer den
  // deutschen Sprachstand. Wuerde der Client seinen ERSTEN Render bereits mit der
  // gespeicherten Sprache aufbauen, weicht jeder uebersetzte Textknoten vom
  // Server-HTML ab. Gemessen im Browser (Playwright, dev + prod): React meldet
  // dann "Text content did not match" und ersetzt das GESAMTE Dokument
  // ("The server HTML was replaced with client content in <#document>").
  //
  // Deshalb liefert der Hook bis zur Hydration bewusst den deutschen Stand und
  // wechselt erst im ersten Commit danach. Das ist die im Auftrag (E4) verlangte
  // gezielte Loesung an der einen verursachenden Stelle - statt
  // suppressHydrationWarning ueber ganze Teilbaeume zu streuen.
  //
  // Sichtbar aendert sich dadurch nichts zum Schlechteren: Das Server-HTML ist
  // ohnehin deutsch, der Wechsel fand also bereits statt. Er ist jetzt nur ein
  // regulaeres Update statt einer Hydrations-Kollision.
  //
  // Die ROHE Sprachwahl (inkl. tr/ar) bleibt davon unberuehrt im Context - nur
  // die Aufloesung auf das Woerterbuch ist gegated.
  const locale = hydrated ? resolveLocale(language) : "de";
  // Gleiche Gate-Regel fuer die rohe Sprachwahl (siehe Translation.language).
  const gatedLanguage: Language = hydrated ? language : "de";

  return useMemo<Translation>(() => {
    const fmt: Formatter = {
      number: (n, opts) => numberFormat(locale, opts).format(n),
      date: (isoOrDate, opts) =>
        dateFormat(locale, opts).format(
          typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate,
        ),
      plural: (n, forms) => {
        const form = pluralRule(locale).select(n) === "one" ? forms.one : forms.other;
        return form.replace("{n}", numberFormat(locale).format(n));
      },
    };

    return {
      t: DICTS[locale],
      locale,
      language: gatedLanguage,
      tv: (value: Lokalisiert) => value[locale],
      fmt,
    };
  }, [locale, gatedLanguage]);
}

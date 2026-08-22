import { Fragment, type ReactNode } from "react";
import { GlossarText } from "@/components/GlossarTerm";
import type { Locale } from "@/i18n/types";

/**
 * Hebt Zahlen mit Einheit (Messwerte) in einem Fließtext hervor: fett +
 * Kategorie-Farbe. Genutzt in den Smart-Tipp-Texten, damit die konkreten Werte
 * sofort ins Auge springen.
 *
 * Erkannt werden Zahl (inkl. Tausendertrennung / Bereich „10–11") plus Einheit
 * aus einer festen Liste klinischer und zeitlicher Einheiten. Datumsangaben
 * (15.08.) und Uhrzeiten (21:30 Uhr) bleiben bewusst unmarkiert.
 *
 * LOCALE-ABHÄNGIG (F3): Die Einheitenliste enthielt ausschließlich deutsche
 * Wörter („Schritte", „Wochen", „Stunden", „Min") und der negative Lookahead
 * war auf deutsche Umlaute zugeschnitten. Im englischen Sprachstand wäre die
 * Hervorhebung dadurch lautlos verschwunden - bei grünem Build. Liste, Muster
 * und Lookahead werden deshalb je Locale gebaut und memoisiert; ein
 * Modul-Konstanten-Regex könnte auf einen Sprachwechsel nicht reagieren.
 */
const EINHEITEN: Record<Locale, string[]> = {
  de: [
    "ng/ml",
    "mg/dl",
    "µg/l",
    "mmHg",
    "BPM",
    "Schritte",
    "Wochen",
    "Woche",
    "Monaten",
    "Monate",
    "Stunden",
    "Stunde",
    "Min",
    "ms",
    "ml",
    "kg",
    "IE",
    "h",
    "%",
  ],
  en: [
    "ng/ml",
    "mg/dl",
    "µg/l",
    "mmHg",
    "BPM",
    "steps",
    "weeks",
    "week",
    "months",
    "month",
    "hours",
    "hour",
    "min",
    "ms",
    "ml",
    "kg",
    "IU",
    "h",
    "%",
  ],
};

// Nach Länge absteigend, damit "Wochen" vor "Woche" und "steps" vor "step"
// matcht - sonst greift die kürzere Alternative zuerst.
function unitPattern(locale: Locale): string {
  return [...EINHEITEN[locale]]
    .sort((a, b) => b.length - a.length)
    .map((e) => e.replace(/\//g, "\\/"))
    .join("|");
}

// Zahl mit optionaler Tausender-/Dezimaltrennung und optionalem Bereich.
// Beide Trennzeichen sind zugelassen, weil de-DE (12.584 / 6,7) und en-GB
// (12,584 / 6.7) sie genau umgekehrt verwenden.
const NUM = "\\d[\\d.,]*(?:\\s?[–-]\\s?\\d[\\d.,]*)?";

// Der Lookahead verhindert Falschtreffer wie "12 Wochenende". Er muss die
// Buchstaben der jeweiligen Sprache kennen: \w deckt nur ASCII ab, deutsche
// Umlaute müssen ergänzt werden.
const LOOKAHEAD: Record<Locale, string> = {
  de: "(?![\\wäöüßÄÖÜ])",
  en: "(?![\\w])",
};

const regexCache = new Map<Locale, RegExp>();

function regexFuer(locale: Locale): RegExp {
  let r = regexCache.get(locale);
  if (!r) {
    // Eine Capture-Gruppe → String.split liefert Treffer an ungeraden Indizes.
    r = new RegExp(`(${NUM}\\s?(?:${unitPattern(locale)}))${LOOKAHEAD[locale]}`, "g");
    regexCache.set(locale, r);
  }
  return r;
}

export function highlightNumbers(text: string, color: string, locale: Locale): ReactNode {
  const parts = text.split(regexFuer(locale));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ fontWeight: 700, color }}>
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Wie highlightNumbers, aber im verbleibenden Text werden zusätzlich bekannte
 * Fachbegriffe als antippbare GlossarTerme markiert (Erklärtexte → Glossar).
 */
export function highlightNumbersUndTerme(
  text: string,
  color: string,
  locale: Locale,
): ReactNode {
  const parts = text.split(regexFuer(locale));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ fontWeight: 700, color }}>
        {part}
      </strong>
    ) : (
      <Fragment key={i}>
        <GlossarText>{part}</GlossarText>
      </Fragment>
    ),
  );
}

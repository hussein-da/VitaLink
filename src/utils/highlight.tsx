import { Fragment, type ReactNode } from "react";
import { GlossarText } from "@/components/GlossarTerm";

/**
 * Hebt Zahlen mit Einheit (Messwerte) in einem Fließtext hervor: fett +
 * Kategorie-Farbe. Genutzt in den Smart-Tipp-Texten, damit die konkreten Werte
 * sofort ins Auge springen (Prompt 11, Problem 2).
 *
 * Erkannt werden Zahl (inkl. Tausenderpunkt / Bereich „10–11") plus Einheit aus
 * einer festen Liste klinischer und zeitlicher Einheiten. Datumsangaben (15.08.)
 * und Uhrzeiten (21:30 Uhr) bleiben bewusst unmarkiert.
 */
const EINHEITEN = [
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
];

const unitPattern = EINHEITEN.map((e) => e.replace(/\//g, "\\/")).join("|");

// Zahl mit optionalem Tausenderpunkt/Dezimal und optionalem Bereich, dann Einheit.
const NUM = "\\d[\\d.,]*(?:\\s?[–-]\\s?\\d[\\d.,]*)?";

// Eine Capture-Gruppe → String.split liefert Treffer an ungeraden Indizes.
const REGEX = new RegExp(`(${NUM}\\s?(?:${unitPattern}))(?![\\wäöüßÄÖÜ])`, "g");

export function highlightNumbers(text: string, color: string): ReactNode {
  const parts = text.split(REGEX);
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
export function highlightNumbersUndTerme(text: string, color: string): ReactNode {
  const parts = text.split(REGEX);
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

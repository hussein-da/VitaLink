// Vereinte Glossar-Datenbasis: Abkürzungen (abkuerzungen.ts) + Fachbegriffe
// (glossar.ts, die in Erklärtexten antippbar sind). So findet jeder im Text
// verlinkte Begriff (?term=…) auch einen Eintrag auf der /glossar-Seite.
//
// ZWEISPRACHIGKEIT: Beide Quellen sind lokalisiert und werden hier je Locale
// aufgeloest — die Fachbegriffe ueber glossarFuer(), die Abkuerzungs-Metadaten
// (`ausgeschrieben`, `erklaerung`) ueber abkuerzungenFuer().

import type { Abkuerzung, AbkuerzungKategorie } from "@/data/abkuerzungen";
import { abkuerzungenFuer, abkuerzungKuerzel } from "@/data/abkuerzungen";
import { glossarFuer, glossarIds } from "@/data/glossar";
import type { Locale } from "@/i18n/types";

// Kategorie-Zuordnung für reine Fachbegriffe (Default: "allgemein").
// Schlüssel ist der locale-unabhängige Glossar-Schlüssel aus glossarIds,
// nicht der übersetzte Begriff.
const GLOSSAR_KATEGORIE: Record<string, AbkuerzungKategorie> = {
  ruhepuls: "herz",
  blutdruck: "herz",
  systolisch: "herz",
  diastolisch: "herz",
  "kardiovaskulär": "herz",
  ms: "herz",
  cholesterin: "labor",
  "ng/ml": "labor",
  gewebezucker: "labor",
  ferritin: "labor",
  "vitamin d": "labor",
  glukose: "labor",
  blutzucker: "labor",
  tiefschlaf: "schlaf",
  stiko: "allgemein",
  tetanus: "allgemein",
  "hepatitis a": "allgemein",
  "hepatitis b": "allgemein",
};

// Fachbegriffe, die nicht schon als Abkürzung existieren, ergänzen.
// Die Eintrags-`id` bleibt beim Sprachwechsel stabil (React-Keys, Deep-Links).
// Der Abgleich läuft über die locale-unabhängige Kürzel-Liste: Glossar-Schlüssel
// (kleingeschriebener deutscher Begriff) und Kürzel sind bei den Überschneidungen
// identisch (hrv, bpm, mmhg, hba1c, mg/dl).
const belegteKuerzel = new Set(abkuerzungKuerzel);

function nurGlossarFuer(locale: Locale): Abkuerzung[] {
  const eintraege = glossarFuer(locale);
  return glossarIds
    .map((id, i) => ({ id, eintrag: eintraege[i] }))
    .filter(({ id }) => !belegteKuerzel.has(id))
    .map(({ id, eintrag }) => ({
      id: `g-${id}`,
      kuerzel: eintrag.term,
      ausgeschrieben: "", // reiner Begriff, keine Abkürzung → keine Langform
      erklaerung: eintrag.kurz,
      kategorie: GLOSSAR_KATEGORIE[id] ?? "allgemein",
      vordefiniert: true,
    }));
}

/** Alle vordefinierten Glossar-Einträge einer Locale (Abkürzungen + Fachbegriffe). */
export function glossarBegriffeFuer(locale: Locale): Abkuerzung[] {
  return [...abkuerzungenFuer(locale), ...nurGlossarFuer(locale)];
}

/**
 * Deutscher Stand unter dem alten Namen — für Aufrufer, die (noch) keine
 * Locale kennen. Neue Aufrufer nutzen glossarBegriffeFuer(locale).
 */
export const glossarBegriffe: Abkuerzung[] = glossarBegriffeFuer("de");

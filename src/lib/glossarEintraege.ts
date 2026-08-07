// Vereinte Glossar-Datenbasis: Abkürzungen (abkuerzungen.ts) + Fachbegriffe
// (glossar.ts, die in Erklärtexten antippbar sind). So findet jeder im Text
// verlinkte Begriff (?term=…) auch einen Eintrag auf der /glossar-Seite.
//
// ZWEISPRACHIGKEIT: Die Fachbegriffe kommen lokalisiert aus glossar.ts und
// werden hier je Locale aufgeloest. Die Abkuerzungs-Metadaten
// (`ausgeschrieben`, `kategorie`-Labels) liegen weiterhin nur auf Deutsch in
// abkuerzungen.ts — sie zu lokalisieren wuerde eine Aenderung an jener Datei
// verlangen und ist als eigener Schritt offen.

import type { Abkuerzung, AbkuerzungKategorie } from "@/data/abkuerzungen";
import { vordefinierteAbkuerzungen, abkuerzungMap } from "@/data/abkuerzungen";
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
function nurGlossarFuer(locale: Locale): Abkuerzung[] {
  const eintraege = glossarFuer(locale);
  return glossarIds
    .map((id, i) => ({ id, eintrag: eintraege[i] }))
    .filter(({ id }) => !abkuerzungMap[id])
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
  return [...vordefinierteAbkuerzungen, ...nurGlossarFuer(locale)];
}

/**
 * Deutscher Stand unter dem alten Namen — für Aufrufer, die (noch) keine
 * Locale kennen. Neue Aufrufer nutzen glossarBegriffeFuer(locale).
 */
export const glossarBegriffe: Abkuerzung[] = glossarBegriffeFuer("de");

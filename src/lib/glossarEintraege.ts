// Vereinte Glossar-Datenbasis: Abkürzungen (abkuerzungen.ts) + Fachbegriffe
// (glossar.ts, die in Erklärtexten antippbar sind). So findet jeder im Text
// verlinkte Begriff (?term=…) auch einen Eintrag auf der /glossar-Seite.

import type { Abkuerzung, AbkuerzungKategorie } from "@/data/abkuerzungen";
import { vordefinierteAbkuerzungen, abkuerzungMap } from "@/data/abkuerzungen";
import { glossar } from "@/data/glossar";

// Kategorie-Zuordnung für reine Fachbegriffe (Default: "allgemein").
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
const nurGlossar: Abkuerzung[] = glossar
  .filter((g) => !abkuerzungMap[g.term.toLowerCase()])
  .map((g) => ({
    id: `g-${g.term.toLowerCase()}`,
    kuerzel: g.term,
    ausgeschrieben: "", // reiner Begriff, keine Abkürzung → keine Langform
    erklaerung: g.kurz,
    kategorie: GLOSSAR_KATEGORIE[g.term.toLowerCase()] ?? "allgemein",
    vordefiniert: true,
  }));

/** Alle vordefinierten Glossar-Einträge (Abkürzungen + Fachbegriffe). */
export const glossarBegriffe: Abkuerzung[] = [...vordefinierteAbkuerzungen, ...nurGlossar];

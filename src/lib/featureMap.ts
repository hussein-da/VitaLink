// ACHTUNG — VERWAIST: Dieses Modul hat aktuell keinen Importeur im Projekt.
// Es bleibt als Verifikations-Checkliste erhalten und wird zweisprachig
// gepflegt, erscheint aber in keinem Screen.
//
// Explizite Zuordnung Design-Feature (DF) -> Requirement -> Komponente -> Akzeptanzkriterium.
// Dies ist die Checkliste fuer die Verifikationsschleife (docs/BUILD_HISTORY.md, Abschnitt 10).

import type { FeatureMapEntry } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

interface FeatureMapQuelle extends Omit<FeatureMapEntry, "komponente" | "akzeptanz"> {
  komponente: Lokalisiert;
  akzeptanz: Lokalisiert;
}

// Komponenten- und Requirement-Bezeichner (FactorBars, DF1, DR1, ePA, ...) sind
// technische Namen und bleiben in beiden Sprachstaenden identisch.
const quellen: FeatureMapQuelle[] = [
  {
    df: "DF1",
    requirement: "DR1",
    komponente: {
      de: "FactorBars in XaiVariantSwitch (Variante B)",
      en: "FactorBars in XaiVariantSwitch (mode B)",
    },
    akzeptanz: {
      de: "Mind. 2 staerkste Faktoren mit relativer Gewichtung sichtbar.",
      en: "At least the 2 strongest factors are visible with their relative weighting.",
    },
  },
  {
    df: "DF2",
    requirement: "DR2",
    komponente: {
      de: "UncertaintyBadge (Hinweis-Detail)",
      en: "UncertaintyBadge (insight detail)",
    },
    akzeptanz: {
      de: "Bei unsicher:true Label 'Hinweis, keine Diagnose' + Verweis auf aerztliche Abklaerung.",
      en: "When unsicher:true, the label 'an insight, not a diagnosis' shows plus a pointer to have it checked by a doctor.",
    },
  },
  {
    df: "DF3",
    requirement: "DR3",
    komponente: { de: "ExplanationPanel", en: "ExplanationPanel" },
    akzeptanz: {
      de: "Drei Tiefen Kurz/Begruendung/Detail umschaltbar.",
      en: "Three depths (short / reasoning / detail) can be switched.",
    },
  },
  {
    df: "DF4",
    requirement: "DR4",
    komponente: {
      de: "CounterfactualSlider (Variante C)",
      en: "CounterfactualSlider (mode C)",
    },
    akzeptanz: {
      de: "Regler aendert Wirkungstext live.",
      en: "The slider changes the effect text live.",
    },
  },
  {
    df: "DF5",
    requirement: "DR5",
    komponente: { de: "ProvenanceChip (ePA)", en: "ProvenanceChip (ePA)" },
    akzeptanz: {
      de: "ePA-Wert zeigt Quelle + Datum + Einrichtung.",
      en: "An ePA value shows source, date and facility.",
    },
  },
  {
    df: "DF6",
    requirement: "DR6",
    komponente: { de: "ProvenanceChip (Wearable)", en: "ProvenanceChip (wearable)" },
    akzeptanz: {
      de: "Wearable-Wert zeigt Zeitraum + Sensorart.",
      en: "A wearable value shows the period and the sensor type.",
    },
  },
  {
    df: "DF7",
    requirement: "DR7",
    komponente: {
      de: "FontSizeToggle + Designtokens",
      en: "FontSizeToggle + design tokens",
    },
    akzeptanz: {
      de: "Schrift >=14px, Kontrast >=4.5:1, Tap >=44px, Schriftgroesse umschaltbar.",
      en: "Text >=14px, contrast >=4.5:1, tap target >=44px, font size can be switched.",
    },
  },
  {
    df: "DF8",
    requirement: "DR8",
    komponente: { de: "GlossarTerm", en: "GlossarTerm" },
    akzeptanz: {
      de: "Fachbegriff antippbar -> B1-Erklaerung.",
      en: "Technical term is tappable -> plain-language explanation.",
    },
  },
  {
    df: "DF9",
    requirement: "DR9",
    komponente: { de: "ActionCard", en: "ActionCard" },
    akzeptanz: {
      de: "Mind. 1 lokale Ruhrgebiet-Handlungsoption pro Risikoaussage.",
      en: "At least 1 local action option in the Ruhr area per risk statement.",
    },
  },
  {
    df: "DF10",
    requirement: "DR10",
    komponente: {
      de: "Designsystem + Texttonalitaet",
      en: "Design system + tone of voice",
    },
    akzeptanz: {
      de: "Kein Alarmrot, sachliche Sprache durchgaengig.",
      en: "No alarm red, factual language throughout.",
    },
  },
  {
    df: "DF11",
    requirement: "DR11",
    komponente: { de: "DataSourceToggle", en: "DataSourceToggle" },
    akzeptanz: {
      de: "Schalter pro ePA-Kategorie und pro Wearable-Stream, Wirkung app-weit.",
      en: "One toggle per ePA category and per wearable stream, effective app-wide.",
    },
  },
  {
    df: "DF12",
    requirement: "DR12",
    komponente: {
      de: "FeedbackControls / ObjectionDialog",
      en: "FeedbackControls / ObjectionDialog",
    },
    akzeptanz: {
      de: "Widerspruch mit 3 Gruenden + Freitext, gespeichert, markiert.",
      en: "Objection with 3 reasons plus free text, saved and marked.",
    },
  },
];

function aufloesen(q: FeatureMapQuelle, locale: Locale): FeatureMapEntry {
  return { ...q, komponente: q.komponente[locale], akzeptanz: q.akzeptanz[locale] };
}

/** Locale-unabhaengige DF-Kennungen (Reihenfolge wie in der Checkliste). */
export const featureDfIds: string[] = quellen.map((q) => q.df);

export function featureMapFuer(locale: Locale): FeatureMapEntry[] {
  return quellen.map((q) => aufloesen(q, locale));
}

export function featureEintragFuer(df: string, locale: Locale): FeatureMapEntry | undefined {
  const q = quellen.find((x) => x.df === df);
  return q ? aufloesen(q, locale) : undefined;
}

/**
 * @deprecated Deutscher Sprachstand als Uebergangsexport.
 * Neue Aufrufer nutzen `featureMapFuer(locale)`.
 */
export const featureMap: FeatureMapEntry[] = featureMapFuer("de");

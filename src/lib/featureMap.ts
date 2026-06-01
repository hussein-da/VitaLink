import type { FeatureMapEntry } from "@/lib/types";

// Explizite Zuordnung Design-Feature (DF) -> Requirement -> Komponente -> Akzeptanzkriterium.
// Dies ist die Checkliste fuer die Verifikationsschleife (VORSICHT_BUILD.md, Abschnitt 10).
export const featureMap: FeatureMapEntry[] = [
  {
    df: "DF1",
    requirement: "DR1",
    komponente: "FactorBars in XaiVariantSwitch (Variante B)",
    akzeptanz: "Mind. 2 staerkste Faktoren mit relativer Gewichtung sichtbar.",
  },
  {
    df: "DF2",
    requirement: "DR2",
    komponente: "UncertaintyBadge (Hinweis-Detail)",
    akzeptanz: "Bei unsicher:true Label 'Hinweis, keine Diagnose' + Verweis auf aerztliche Abklaerung.",
  },
  {
    df: "DF3",
    requirement: "DR3",
    komponente: "ExplanationPanel",
    akzeptanz: "Drei Tiefen Kurz/Begruendung/Detail umschaltbar.",
  },
  {
    df: "DF4",
    requirement: "DR4",
    komponente: "CounterfactualSlider (Variante C)",
    akzeptanz: "Regler aendert Wirkungstext live.",
  },
  {
    df: "DF5",
    requirement: "DR5",
    komponente: "ProvenanceChip (ePA)",
    akzeptanz: "ePA-Wert zeigt Quelle + Datum + Einrichtung.",
  },
  {
    df: "DF6",
    requirement: "DR6",
    komponente: "ProvenanceChip (Wearable)",
    akzeptanz: "Wearable-Wert zeigt Zeitraum + Sensorart.",
  },
  {
    df: "DF7",
    requirement: "DR7",
    komponente: "FontSizeToggle + Designtokens",
    akzeptanz: "Schrift >=14px, Kontrast >=4.5:1, Tap >=44px, Schriftgroesse umschaltbar.",
  },
  {
    df: "DF8",
    requirement: "DR8",
    komponente: "GlossarTerm",
    akzeptanz: "Fachbegriff antippbar -> B1-Erklaerung.",
  },
  {
    df: "DF9",
    requirement: "DR9",
    komponente: "ActionCard",
    akzeptanz: "Mind. 1 lokale Ruhrgebiet-Handlungsoption pro Risikoaussage.",
  },
  {
    df: "DF10",
    requirement: "DR10",
    komponente: "Designsystem + Texttonalitaet",
    akzeptanz: "Kein Alarmrot, sachliche Sprache durchgaengig.",
  },
  {
    df: "DF11",
    requirement: "DR11",
    komponente: "DataSourceToggle",
    akzeptanz: "Schalter pro ePA-Kategorie und pro Wearable-Stream, Wirkung app-weit.",
  },
  {
    df: "DF12",
    requirement: "DR12",
    komponente: "ObjectionButton",
    akzeptanz: "Widerspruch mit 3 Gruenden + Freitext, gespeichert, markiert.",
  },
];

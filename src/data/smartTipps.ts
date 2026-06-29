// Smarte Empfehlungen je Hinweis (Prompt 10 + 11).
//
// Die Inhalte sind statisch hinterlegt, aber so formuliert, als wären sie live
// aus Maras Daten berechnet worden. Jeder Tipp ist auf zwei Sätze verdichtet
// (Erkenntnis) plus eine eigene Handlungszeile (der „→"-Schritt). Werte stammen
// aus epa.ts / wearable.ts / hinweise.ts und sind synthetisch.
//
// Die Record-Schlüssel sind die echten Hinweis-IDs aus hinweise.ts:
//   lifestyle-schlaf · kardio-blutdruck · reise-impfung

export type SmartTippQuelle = "epa" | "wearable" | "context";

export interface SmartTipp {
  id: string;
  /** lucide-react Icon-Name (Mapping in SmartTippCard). */
  icon: string;
  titel: string;
  /** Erkenntnis: max. 2 Sätze, Zahlen mit Einheit. */
  text: string;
  /** Konkreter Handlungsschritt (ohne „→", wird visuell als Schritt gerahmt). */
  handlung: string;
  /** Welche Datenquellen in den Tipp eingeflossen sind (steuert die Chips). */
  quellen: SmartTippQuelle[];
}

export const smartTippsJeHinweis: Record<string, SmartTipp[]> = {
  // ───────────────────────────────────────────────────────────────────────
  // SCHLAF & ERHOLUNG
  // ───────────────────────────────────────────────────────────────────────
  "lifestyle-schlaf": [
    {
      id: "schlaf-training-timing",
      icon: "Dumbbell",
      titel: "Donnerstagtraining vorziehen",
      text: "Dein Do-Abendtraining drückt HRV auf 29 ms, Samstagmorgen sind es 47 ms — Tiefschlaf halbiert sich.",
      handlung: "Verleg das Do-Training auf 12–14 Uhr.",
      quellen: ["wearable"],
    },
    {
      id: "schlaf-vitd-mittagssonne",
      icon: "Sun",
      titel: "25 Min Mittagssonne: Schritte + Vitamin D",
      text: "Dein Vitamin D liegt bei 24 ng/ml (Ziel: 40+), werktags gehst du nur 10.800 Schritte — halb so viele wie am Wochenende. Bochumer Mittagssonne im Juni reicht nach 15 Min für spürbare Vitamin-D-Bildung.",
      handlung: "25 Min Mittagsspaziergang täglich, 11–14 Uhr.",
      quellen: ["epa", "wearable", "context"],
    },
    {
      id: "schlaf-abendritual-hrv",
      icon: "Moon",
      titel: "Abend-Routine für tiefere Nächte",
      text: "Freitag- und Sonntagabend — HRV über 43 ms — schläfst du 6 % mehr Tiefschlaf als im Wochenschnitt.",
      handlung: "Ab 21:30 Uhr: Licht dimmen, 10 Min ruhige Atmung.",
      quellen: ["wearable", "epa"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // HERZ-KREISLAUF (Blutdruck-Trend)
  // ───────────────────────────────────────────────────────────────────────
  "kardio-blutdruck": [
    {
      id: "kardio-schlaf-blutdruck",
      icon: "TrendingDown",
      titel: "Schlaf schützt deinen Blutdruck",
      text: "Nach unruhigen Nächten liegt dein Ruhepuls bei 64 BPM — etwa 7 mehr als sonst. Dein Blutdruck stieg in 6 Monaten von 118 auf 128 mmHg systolisch.",
      handlung: "Die Schlafverbesserung aus „Schlafqualität & Erholung“ direkt angehen.",
      quellen: ["wearable", "epa"],
    },
    {
      id: "kardio-ernaehrung-cholesterin-eisen",
      icon: "Salad",
      titel: "Hülsenfrüchte: Eisen und Cholesterin",
      text: "Dein LDL liegt bei 118 mg/dl, Ferritin bei 18 µg/l (niedrig-normal). Linsen, Kichererbsen und Haferflocken senken LDL und heben Ferritin.",
      handlung: "3× pro Woche eine Portion Hülsenfrüchte zum Mittagessen.",
      quellen: ["epa"],
    },
    {
      id: "kardio-hitze-hydration",
      icon: "Droplets",
      titel: "Sommer-Training und Hydration",
      text: "Du trainierst 4× pro Woche, Ø 103 Min. Bei Hitze im Juli/August erhöht Dehydration den Blutdruck messbar.",
      handlung: "Trink 500 ml extra pro Trainingseinheit — vor, nicht nur nach.",
      quellen: ["wearable", "context"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // REISEVORSORGE THAILAND
  // ───────────────────────────────────────────────────────────────────────
  "reise-impfung": [
    {
      id: "reise-impf-zeitplan",
      icon: "Syringe",
      titel: "Zeitnah einen Termin vereinbaren",
      text: "Bei Reiseimpfungen kann ein gewisser Vorlauf sinnvoll sein. Prüfe den Impfstatus deshalb frühzeitig ärztlich. Deine Abreise: 15.08.2026.",
      handlung: "Sprich frühzeitig mit deiner Hausarztpraxis über Hepatitis A und B. Für einige Impfschemata ist ausreichend Vorlauf sinnvoll — kläre, welche Option zu dir passt.",
      quellen: ["epa", "context"],
    },
    {
      id: "reise-jetlag-schlaf",
      icon: "Plane",
      titel: "Jetlag abmildern: jetzt anfangen",
      text: "Thailand liegt 5 Stunden vor uns. Dein Schlaf-Score liegt bei Ø 67/100 — Jetlag trifft Menschen mit Schlafdefizit deutlich härter.",
      handlung: "Ab 01.08.: Schlafzeit täglich 30 Min früher, damit dein Körper ankommt, bevor du fliegst.",
      quellen: ["wearable", "context"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // GLUKOSE & STOFFWECHSEL
  // ───────────────────────────────────────────────────────────────────────
  "glukose": [
    {
      id: "glukose-schlaf",
      icon: "Moon",
      titel: "Schlaf reguliert deinen Blutzucker",
      text: "Nach Nächten mit weniger als 6,5 h Schlaf steigt dein höchster Blutzuckerwert nach dem Mittagessen auf Ø 154 mg/dl — nach erholten Nächten sind es nur 134 mg/dl.",
      handlung: "Schon eine Stunde mehr Schlaf pro Nacht kann deinen Blutzucker nach dem Essen stabilisieren.",
      quellen: ["wearable"],
    },
    {
      id: "glukose-training",
      icon: "Dumbbell",
      titel: "Sport als Glukose-Puffer",
      text: "An deinen 4 Trainingstagen liegt dein Abend-Glukosewert bei Ø 96 mg/dl — an trainingsfreien Tagen bei 107 mg/dl. Das ist etwas ungünstiger, kein Alarm, aber ein klares Muster.",
      handlung: "Baue an trainingsfreien Tagen eine kurze 20-minütige Bewegungseinheit ein.",
      quellen: ["wearable"],
    },
    {
      id: "glukose-spaziergang",
      icon: "Footprints",
      titel: "15 Min nach dem Essen gehen",
      text: "Dein höchstgemessener Wert (161 mg/dl) war an einem Donnerstag ohne Mittagsbewegung. Ein kurzer Spaziergang senkt den Wert um bis zu 18 mg/dl.",
      handlung: "15 Min Spaziergang direkt nach dem Mittagessen.",
      quellen: ["wearable"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // ZAHNARZT / VORSORGE
  // ───────────────────────────────────────────────────────────────────────
  "zahnarzt": [
    {
      id: "zahnarzt-termin",
      icon: "Phone",
      titel: "Vorsorgetermin für Juli planen",
      text: "Dein letzter Besuch bei Dr. Maier war am 12.01.2026. Das Intervall von 6 Monaten endet am 12.07.2026.",
      handlung: "Plane am besten einen Termin für Juli ein. Letzter Besuch: 12.01.2026, Intervall endet am 12.07.2026.",
      quellen: ["epa"],
    },
    {
      id: "zahnarzt-kalender",
      icon: "Calendar",
      titel: "Befund unauffällig — so bleibt es",
      text: "Beim letzten Besuch war dein Befund vollständig unauffällig. Regelmäßige Reinigung alle 6 Monate erhält diesen Status.",
      handlung: "Du kannst dir eine Erinnerung setzen, damit der Termin nicht untergeht.",
      quellen: ["epa"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// INSIGHT-STATEMENT (Prompt 12, Änderung 2) — eine kraftvolle Hauptaussage
// + kurzer Kontexthalbsatz je Hinweis.
// ─────────────────────────────────────────────────────────────────────────

export interface InsightStatementDaten {
  /** Eine Satz, 18px SemiBold. Das erkannte Muster auf den Punkt gebracht. */
  haupt: string;
  /** Kurzer Kontext-Halbsatz, 12px muted. */
  kontext: string;
}

export const insightStatementJeHinweis: Record<string, InsightStatementDaten> = {
  "lifestyle-schlaf": {
    haupt: "Abendtraining und niedriger Vitamin-D-Spiegel beeinflussen deine Schlaftiefe — beide Faktoren ziehen in dieselbe Richtung.",
    kontext: "Beide Faktoren lassen sich gemeinsam adressieren.",
  },
  "kardio-blutdruck": {
    haupt: "Wenig Schlaf kann den Ruhepuls erhöhen und langfristig den Blutdruck beeinflussen.",
    kontext: "Schlaf ist hier ein wirksamer Ansatzpunkt.",
  },
  "reise-impfung": {
    haupt: "Sechs Wochen bis Thailand — genug Zeit für vollen Schutz, aber nur wenn du diese Woche handelst.",
    kontext: "Für Hepatitis B ist das Schnellschema möglich, aber nur bis Mitte Juli.",
  },
  "glukose": {
    haupt: "Wenig Schlaf erhöht deinen höchsten Blutzuckerwert nach dem Mittagessen auf 154 mg/dl — 20 mg/dl mehr als nach erholten Nächten.",
    kontext: "Dein Körper verarbeitet Zucker nach wenig Schlaf etwas weniger effizient.",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// INSIGHT-HEADER (Protected Core — im Code erhalten, nicht mehr in der UI):
// Kausal-Ketten aus Boxen + Pfeilen, kurzes Fazit.
// ─────────────────────────────────────────────────────────────────────────

export interface InsightKette {
  /** Boxen der Kette, mit „→" dazwischen gerendert. */
  boxen: string[];
}

export interface InsightHeaderDaten {
  ketten: InsightKette[];
  /** Wissenschaftliche Einordnung in einem Halbsatz (kursiv). */
  fazit: string;
}

export const insightHeaderJeHinweis: Record<string, InsightHeaderDaten> = {
  "lifestyle-schlaf": {
    ketten: [
      { boxen: ["Abendtraining", "HRV 29 ms ↓", "Tiefschlaf 10 %"] },
      { boxen: ["Vitamin D 24 ng/ml", "Schlafarchitektur ↓"] },
    ],
    fazit: "Beide Faktoren verstärken sich gegenseitig.",
  },
  "kardio-blutdruck": {
    ketten: [
      { boxen: ["Schlechter Schlaf", "Ruhepuls +7 BPM", "Blutdruck ↑"] },
      { boxen: ["LDL 118 + Cholesterin 198", "Langzeit-Risiko"] },
    ],
    fazit: "Schlaf ist dein stärkster Blutdruck-Hebel.",
  },
  "reise-impfung": {
    ketten: [
      { boxen: ["Hep A fehlt + Thailand", "Infektionsrisiko"] },
      { boxen: ["6 Wochen bis Abreise", "Impfschutz noch möglich"] },
    ],
    fazit: "Jetzt handeln reicht — aber nicht in 3 Wochen.",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// METHODE & DATENQUELLEN (aufklappbar, Prompt 11, Problem 5) — je Datenpunkt
// zwei Zeilen: Quelle + konkreter Wert mit Kontext. Max. 4 Punkte je Hinweis.
// ─────────────────────────────────────────────────────────────────────────

export interface MethodePunkt {
  titel: string;
  /** Zeile 1: woher der Wert stammt. */
  quelle: string;
  /** Zeile 2: konkreter Wert + Kontext (Schnitt, Norm, Extremwert). */
  wert: string;
}

export const methodeJeHinweis: Record<string, MethodePunkt[]> = {
  "lifestyle-schlaf": [
    {
      titel: "Tiefschlaf",
      quelle: "gemessen von deiner Garmin Fenix 7",
      wert: "Schnitt letzte 14 Nächte: 16 % · schlechteste Nacht: 10 %",
    },
    {
      titel: "HRV",
      quelle: "optischer Pulssensor deiner Garmin Fenix 7",
      wert: "Schnitt: 40 ms · nach Abendtraining: 29 ms",
    },
    {
      titel: "Vitamin D",
      quelle: "Laborwert aus deiner ePA",
      wert: "Messung 12.03.2026: 24 ng/ml · Norm: 30–60 ng/ml",
    },
    {
      titel: "Ruhepuls",
      quelle: "optischer Pulssensor, letzte 30 Tage",
      wert: "Schnitt: 60 BPM · schlechteste Nacht: 64 BPM",
    },
  ],
  "kardio-blutdruck": [
    {
      titel: "Blutdruck",
      quelle: "Praxismessung aus deiner ePA",
      wert: "6-Monats-Trend: 118 → 128 mmHg · Norm: < 130/85 mmHg",
    },
    {
      titel: "Ruhepuls",
      quelle: "optischer Pulssensor deiner Garmin Fenix 7",
      wert: "Schnitt: 57 BPM · Schlechtnacht: 64 BPM",
    },
    {
      titel: "Cholesterin",
      quelle: "Laborwert aus deiner ePA",
      wert: "Gesamt: 198 mg/dl · LDL: 118 mg/dl",
    },
    {
      titel: "Ferritin",
      quelle: "Laborwert aus deiner ePA",
      wert: "18 µg/l · Norm: 15–150 µg/l",
    },
  ],
  "reise-impfung": [
    {
      titel: "Hepatitis A",
      quelle: "Impfstatus aus deiner ePA",
      wert: "kein Eintrag · für Thailand empfohlen",
    },
    {
      titel: "Hepatitis B",
      quelle: "Impfstatus aus deiner ePA",
      wert: "kein Eintrag · Schnellschema (3 Dosen) möglich",
    },
    {
      titel: "Reiseziel",
      quelle: "aus deiner Reiseplanung",
      wert: "Thailand · Abreise 15.08.2026",
    },
    {
      titel: "Tetanus",
      quelle: "Impfstatus aus deiner ePA",
      wert: "letzte Auffrischung: 2017 · Intervall: 10 Jahre",
    },
  ],
};

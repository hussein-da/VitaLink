// VorSicht - zentrale TypeScript-Typen.
// Alle Datensaetze sind synthetisch (synthetic: true). Kein Medizinprodukt.

export type Szenario = "lifestyle" | "kardiometabolisch" | "reise";

// Granulare Datenquellen-Schluessel: pro ePA-Kategorie und pro Wearable-Stream.
// Diese Schluessel steuern die Datenkontrolle (DF11) app-weit.
export type DataSourceKey =
  | "epa-vitalwerte"
  | "epa-labor"
  | "epa-impfungen"
  | "wearable-schlaf"
  | "wearable-puls"
  | "wearable-hrv"
  | "wearable-aktivitaet";

export type ProvenanceArt = "epa" | "wearable";

// --- Stammdaten der fiktiven Person ---
export interface Profile {
  name: string;
  alter: number;
  ort: string;
  note: string;
  synthetic: true;
}

// --- ePA (FHIR-R5-nah, vereinfacht) ---
export type EpaResourceType = "Observation" | "Immunization" | "Condition";
export type EpaKategorie = "vitalwerte" | "labor" | "impfungen";

export interface EpaEntry {
  id: string;
  resourceType: EpaResourceType;
  kind: string; // menschenlesbare Art, z. B. "Blutdruck"
  value: string; // z. B. "128/82 mmHg" oder "fehlt"
  date: string | null; // ISO-Datum oder null (z. B. fehlender Impfeintrag)
  issuer: string; // ausstellende Einrichtung
  kategorie: EpaKategorie;
  sourceKey: DataSourceKey;
  fehlt?: boolean; // absichtlich fehlender Eintrag (Szenario reise)
  synthetic: true;
}

// --- Wearable-Streams ---
export interface WearablePoint {
  date: string; // ISO-Datum
  value: number;
}

export type Trend = "steigend" | "fallend" | "stabil" | "schwankend";

export interface WearableStream {
  id: string;
  metric: string; // technischer Schluessel, z. B. "schlafdauer"
  label: string; // Anzeigename, z. B. "Schlafdauer"
  unit: string; // z. B. "h"
  series: WearablePoint[];
  sensor: string; // Sensorart
  period: string; // Zeitraum, z. B. "letzte 14 Tage"
  trend: Trend;
  sourceKey: DataSourceKey;
  synthetic: true;
}

// --- Wochenrückblick (FR-I, DF17) ---
export interface TrainingsEinheit {
  date: string; // ISO-Datum
  dauer: number; // Minuten
}

export interface WochenrueckblickSchritte {
  tage: WearablePoint[];
  sourceKey: DataSourceKey;
  synthetic: true;
  beispiel: true;
}

export interface WochenrueckblickTraining {
  einheiten: TrainingsEinheit[];
  sourceKey: DataSourceKey;
  synthetic: true;
  beispiel: true;
}

// --- Glossar (B1-Erklaerungen) ---
export interface GlossarEintrag {
  term: string; // Schluessel/Anzeige, z. B. "HRV"
  kurz: string; // ein bis zwei einfache Saetze (Sprachniveau B1)
}

// --- Lokale Angebote (Ruhrgebiet, fiktiv-plausibel) ---
export interface Angebot {
  id: string;
  titel: string;
  ort: string;
  traeger: string;
  hinweis: string;
  beispiel: true; // klar als Beispiel markiert
}

// --- Hinweis-Bausteine ---
export interface Faktor {
  label: string;
  gewicht: number; // 0..1, relative Gewichtung (Variante B)
  quelleRef: string; // menschenlesbarer Quellenhinweis
  sourceKey?: DataSourceKey; // fuer DF11 (abgeschaltete Quelle erkennen)
}

export interface Kontrafaktisch {
  faktorLabel: string; // z. B. "Schlafdauer"
  einheit: string; // z. B. "h pro Nacht"
  aktuell: number;
  min: number;
  max: number;
  schritt: number;
  wirkung: (wert: number) => string; // Text, der sich mit dem Regler aendert
}

export interface Provenance {
  art: ProvenanceArt;
  label: string;
  sourceKey: DataSourceKey;
  date?: string | null; // ePA: Datum
  issuer?: string; // ePA: ausstellende Einrichtung
  period?: string; // Wearable: Zeitraum
  sensor?: string; // Wearable: Sensorart
}

export interface Aktion {
  angebotId: string; // Referenz auf angebote.ts
}

export interface Hinweis {
  id: string;
  szenario: Szenario;
  titel: string; // nicht-alarmistisch, sachlich
  kurz: string; // Variante A natuerlichsprachlich, 1 Satz
  begruendung: string; // Erklaertiefe 2
  detail: string; // Erklaertiefe 3 (Methode, Datenquellen)
  faktoren: Faktor[]; // Variante B visuell
  kontrafaktisch?: Kontrafaktisch; // Variante C (optional bei regelbasiert)
  unsicher: boolean; // true -> UncertaintyBadge
  quellen: Provenance[];
  aktionen: Aktion[];
  /** Alle Datenquellen, die dieser Hinweis nutzt (DF11-Konsistenz). */
  genutzteQuellen: DataSourceKey[];
  /** Optionaler Normwert-Kontext für Variante B (FactorBars), z. B. bei Blutdruck. */
  normwertHinweis?: string;
  synthetic: true;
}

// --- Einstellungen / Widerspruch ---
export type ObjectionReason =
  | "medizinisch-geklaert"
  | "persoenlich-anders"
  | "technischer-fehler";

export interface Objection {
  hinweisId: string;
  reason: ObjectionReason;
  freitext?: string;
  createdAt: string; // ISO-Zeitstempel
}

// --- DF -> Komponente Zuordnung (Verifikation) ---
export interface FeatureMapEntry {
  df: string;
  requirement: string;
  komponente: string;
  akzeptanz: string;
}

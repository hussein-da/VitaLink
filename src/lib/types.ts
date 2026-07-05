// VorSicht - zentrale TypeScript-Typen.
// Alle Datensaetze sind synthetisch (synthetic: true). Kein Medizinprodukt.

export type Szenario =
  | "lifestyle"
  | "kardiometabolisch"
  | "reise"
  | "stoffwechsel"
  | "vorsorge"
  | "vitalitaet";

// Granulare Datenquellen-Schluessel: pro ePA-Kategorie und pro Wearable-Stream.
// Diese Schluessel steuern die Datenkontrolle (DF11) app-weit.
export type DataSourceKey =
  | "epa-vitalwerte"
  | "epa-labor"
  | "epa-impfungen"
  | "epa-vorsorge"
  | "wearable-schlaf"
  | "wearable-puls"
  | "wearable-hrv"
  | "wearable-aktivitaet"
  | "wearable-glukose";

export type ProvenanceArt = "epa" | "wearable";

// --- Stammdaten der dargestellten Person ---
export interface Profile {
  name: string;
  vorname: string;
  alter: number;
  ort: string;
  geschlecht?: string;
  versicherung?: string;
  hausaerztin?: string;
  note: string;
  synthetic: true;
}

// --- ePA (FHIR-R5-nah, vereinfacht) ---
export type EpaResourceType = "Observation" | "Immunization" | "Condition";
export type EpaKategorie = "vitalwerte" | "labor" | "impfungen" | "vorsorge";

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

// --- Datengrundlage (Value Prop: ePA + Wearable, Detail-Mini-Karten §3b) ---
export type DatenpunktStatus = "ok" | "warn" | "info" | "neutral";

export interface Datenpunkt {
  /** Wertname, z. B. "Vitamin D". */
  label: string;
  /** Anzeigewert, z. B. "24 ng/ml". */
  wert: string;
  /** Optionaler Status: warn -> hervorgehobene Normabweichung. */
  status?: DatenpunktStatus;
  /** Verweis auf die zentrale Datenherkunft (lib/datenherkunft.ts, DF5/DF6). */
  herkunftId?: string;
}

// --- Datenherkunft (DF5/DF6): zentrale Quelle der Wahrheit je Datenpunkt ---
// Der Typ "vitalink-ki" ist die dritte, verknüpfende Herkunftsebene: Er erscheint
// nur an EMPFEHLUNGEN (nicht an reinen Rohwerten) und macht transparent, dass
// VitaLink die Rohdaten analysiert und kombiniert (USP), nicht nur anzeigt.
export interface Datenherkunft {
  id: string;
  typ: "epa" | "wearable" | "nutzereingabe" | "vitalink-ki";
  /** Konkrete Quelle, z. B. "Labor MVZ Bochum" oder "Apple Watch Series 12". */
  quelle: string;
  /** ePA: Messdatum (deutsches Format, z. B. "12.03.2026"). */
  datum?: string;
  /** Wearable: Zeitraum, z. B. "letzte 14 Tage". */
  zeitraum?: string;
  /** Wearable: Sensorart, z. B. "optischer Pulssensor". */
  sensorart?: string;
  /** Freie Beschreibung (nur "vitalink-ki"): was die KI aus den Daten macht. */
  beschreibung?: string;
}

export interface Datengrundlage {
  /** Datenpunkte aus der ePA. */
  epa: Datenpunkt[];
  /** Datenpunkte vom Wearable (oder Nutzereingabe). */
  wearable: Datenpunkt[];
  /** Abweichende Beschriftung der zweiten Quelle (z. B. "Reiseplanung"). */
  wearableLabel?: string;
  /** Icon-Hinweis fuer die zweite Quelle: "wearable" (Standard) oder "user". */
  wearableArt?: "wearable" | "user";
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
  /** Datengrundlage je Quelle für die ePA+Wearable-Mini-Karten (§3b). */
  datengrundlage?: Datengrundlage;
  /** ISO-Datum der konkreten Deadline (für Dringlichkeits-Sortierung). */
  dringlichkeit?: string | null;
  /** Ähnliche Vorsorge-Termine aus der ePA (nur bei Szenario "vorsorge"). */
  aehnlicheTermine?: VorsorgeTermin[];
  synthetic: true;
}

export interface VorsorgeTermin {
  titel: string;
  zuletzt?: string;
  naechstes?: string;
  status: "ok" | "bald" | "fehlt";
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

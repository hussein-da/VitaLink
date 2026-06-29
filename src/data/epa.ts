import type { EpaEntry } from "@/lib/types";
import { tageBis } from "@/lib/zeit";

// ePA-Einträge (FHIR-R5-nah, vereinfacht). Illustratives Studienprofil
// (Mara K.), markiert als synthetic: true.
export const epaEntries: EpaEntry[] = [
  {
    id: "epa-bp-2026-03-12",
    resourceType: "Observation",
    kind: "Blutdruck",
    value: "124/80 mmHg",
    date: "2026-03-12",
    issuer: "Hausarztpraxis Dr. Koch, Bochum",
    kategorie: "vitalwerte",
    sourceKey: "epa-vitalwerte",
    synthetic: true,
  },
  {
    id: "epa-chol-2026-03-12",
    resourceType: "Observation",
    kind: "Cholesterin gesamt",
    value: "198 mg/dl",
    date: "2026-03-12",
    issuer: "Labor MVZ Bochum",
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-vitd-2026-03-12",
    resourceType: "Observation",
    kind: "Vitamin D (25-OH)",
    value: "24 ng/ml",
    date: "2026-03-12",
    issuer: "Labor MVZ Bochum",
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-ferritin-2026-03-12",
    resourceType: "Observation",
    kind: "Ferritin",
    value: "18 µg/l",
    date: "2026-03-12",
    issuer: "Labor MVZ Bochum",
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-imm-tetanus-2017-08-20",
    resourceType: "Immunization",
    kind: "Tetanus / Diphtherie (Auffrischung)",
    value: "letzte Auffrischung 2017-08-20",
    date: "2017-08-20",
    issuer: "Hausarztpraxis Dr. Koch, Bochum",
    kategorie: "impfungen",
    sourceKey: "epa-impfungen",
    synthetic: true,
  },
  {
    // Absichtlich fehlender Eintrag für Szenario "reise".
    id: "epa-imm-hepatitisA-fehlt",
    resourceType: "Immunization",
    kind: "Hepatitis A",
    value: "kein Eintrag in der ePA",
    date: null,
    issuer: "kein Eintrag",
    kategorie: "impfungen",
    sourceKey: "epa-impfungen",
    fehlt: true,
    synthetic: true,
  },
  {
    id: "epa-imm-hepatitisB-fehlt",
    resourceType: "Immunization",
    kind: "Hepatitis B",
    value: "kein Eintrag in der ePA",
    date: null,
    issuer: "kein Eintrag",
    kategorie: "impfungen",
    sourceKey: "epa-impfungen",
    fehlt: true,
    synthetic: true,
  },
  // Nüchternblutzucker + HbA1c (für Glukose-Hinweis)
  {
    id: "epa-blutzucker-2026-03-12",
    resourceType: "Observation",
    kind: "Nüchternblutzucker",
    value: "94 mg/dl",
    date: "2026-03-12",
    issuer: "Labor MVZ Bochum",
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-hba1c-2026-03-12",
    resourceType: "Observation",
    kind: "HbA1c",
    value: "5,4 %",
    date: "2026-03-12",
    issuer: "Labor MVZ Bochum",
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  // Zahnarzt-Einträge (für Vorsorge-Hinweis)
  {
    id: "epa-zahnarzt-2026-01-12",
    resourceType: "Observation",
    kind: "Zahnarztbesuch",
    value: "PZR + Befund unauffällig",
    date: "2026-01-12",
    issuer: "Zahnarztpraxis Dr. Maier, Bochum-Innenstadt",
    kategorie: "vorsorge",
    sourceKey: "epa-vorsorge",
    synthetic: true,
  },
];

/** Blutdruck-Messreihe der letzten 6 Monate (systolisch/diastolisch, mmHg). */
export const blutdruckReihe = [
  { monat: "Okt 2025", sys: 118, dia: 76 },
  { monat: "Nov 2025", sys: 119, dia: 77 },
  { monat: "Dez 2025", sys: 122, dia: 79 },
  { monat: "Jan 2026", sys: 125, dia: 81 },
  { monat: "Feb 2026", sys: 128, dia: 83 },
  { monat: "Mär 2026", sys: 124, dia: 80 },
];

/** Geplante Reise (Nutzereingabe, im Studienprofil hinterlegt). */
const THAILAND_ABREISE = "2026-08-15";
export const geplanteReise = {
  ziel: "Thailand",
  zielCode: "TH",
  staedte: "Bangkok + Chiang Mai",
  datum: THAILAND_ABREISE,
  // Aus SZENARIO_HEUTE abgeleitet (volle Wochen bis Abreise), nicht hartkodiert.
  wochenBisAbreise: Math.floor(tageBis(THAILAND_ABREISE) / 7),
  // Fehlende Impfungen werden NICHT mehr hier getippt, sondern aus der
  // Regel-Engine abgeleitet: reise.ts → fehlendeReiseimpfungen("TH").
};

// ── Arztrelevante Stammdaten (für den Arztexport) ──────────────────────────
// Illustratives Studienprofil (Mara K.). synthetic: true.

/** Blutgruppe. */
export const blutgruppe = "A positiv (A+)";

export interface Allergie {
  stoff: string;
  detail: string;
}

/** Allergien & Unverträglichkeiten. */
export const allergien: Allergie[] = [
  { stoff: "Birken- und Gräserpollen", detail: "bekannt seit 2019" },
  { stoff: "Penicillin", detail: "Verdacht – Hautausschlag 2021, keine bestätigte Anaphylaxie" },
  { stoff: "Latex", detail: "nicht bekannt" },
];

export interface Dauermedikament {
  name: string;
  dosis: string;
  grund: string;
}

/** Dauermedikamente (vollständig). */
export const dauermedikamente: Dauermedikament[] = [
  { name: "Cholecalciferol", dosis: "1000 IE täglich", grund: "Vitamin-D-Substitution" },
  { name: "Cetirizin", dosis: "10 mg bei Bedarf", grund: "Pollensaison (April–Juni)" },
];

/** Hinweis: keine Antikoagulantien, keine Herzmedikamente. */
export const keineDauermedikation = "Keine Antikoagulantien, keine Herzmedikamente.";

export interface Familienbefund {
  verwandt: string;
  befund: string;
}

/** Familienanamnese. */
export const familienanamnese: Familienbefund[] = [
  { verwandt: "Mutter", befund: "Hypothyreose (Schilddrüsenunterfunktion)" },
  { verwandt: "Vater", befund: "Hypertonie (Bluthochdruck, seit dem 52. Lebensjahr)" },
  { verwandt: "Großvater (mütterlich)", befund: "Diabetes Typ 2 (Diagnose mit 61)" },
];
export const familienanamneseHinweis =
  "Keine Herzerkrankungen, keine Krebserkrankungen in der engeren Familie.";

// Hinweis: Die früher hier hinterlegte Parallelliste `faelligeTermine` wurde
// entfernt (kein Konsument, tote Doppelung). Anstehende Vorsorge-Termine sind
// kanonisch in src/data/termine.ts (aus hinweise/epa/reise abgeleitet).

/** Sozialanamnese. */
export const sozialanamnese = {
  beruf: "UX-Designerin, überwiegend sitzend/Bildschirm",
  raucherstatus: "Nichtraucherin (nie geraucht)",
  alkohol: "gelegentlich, < 1× pro Woche",
  sport: "4× pro Woche (Krafttraining + Ausdauer)",
  schichtarbeit: "nein",
} as const;

/** Aktuelle Beschwerden (optional angegeben). */
export const aktuelleBeschwerden = [
  "Gelegentliche Kopfschmerzen, v. a. donnerstags/freitags",
  "Leichte Erschöpfung in der Arbeitswoche",
  "Kein Schwindel, keine Brustschmerzen",
];

/** Aktuelle Medikation als Kurzliste (für Vorsorge-Export). */
export const medikamenteKurz = "Cholecalciferol 1000 IE · Cetirizin 10 mg b. B.";

/** Diagnosen (ICD-10). */
export const diagnosen = [
  { code: "D50.9", text: "Eisenmangelanämie, leichtgradig (Verlaufskontrolle 03/2026)" },
  { code: "J30.1", text: "Allergische Rhinitis durch Pollen (saisonal)" },
];


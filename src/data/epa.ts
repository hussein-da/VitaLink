import type { EpaEntry } from "@/lib/types";
import type { Locale, Lokalisiert } from "@/i18n/types";
import { tageBis } from "@/lib/zeit";

// Zweisprachige Quelldaten (de/en) + locale-parametrisierte Accessoren.
// Die oeffentlichen Typen aus @/lib/types bleiben unveraendert reine strings:
// ein Accessor loest die Quelle fuer eine Locale auf, die Komponenten sehen
// weiterhin `EpaEntry` mit `kind: string`.

/**
 * Wert, der in beiden Sprachen identisch bleibt: Eigennamen (Praxen, Labore),
 * Messwerte und Einheitenzeichen. Keine Einheitenumrechnung.
 */
const gleich = (s: string): Lokalisiert => ({ de: s, en: s });

// Eigennamen ausstellender Einrichtungen (E6: nie uebersetzt).
const PRAXIS_KOCH = gleich("Hausarztpraxis Dr. Koch, Bochum");
const LABOR_MVZ = gleich("Labor MVZ Bochum");
const PRAXIS_MAIER = gleich("Zahnarztpraxis Dr. Maier, Bochum-Innenstadt");
const KEIN_EINTRAG: Lokalisiert = { de: "kein Eintrag", en: "no entry" };

/** Quellform eines ePA-Eintrags: die drei Freitextfelder sind lokalisiert. */
interface EpaEntryQuelle extends Omit<EpaEntry, "kind" | "value" | "issuer"> {
  kind: Lokalisiert;
  value: Lokalisiert;
  issuer: Lokalisiert;
}

// ePA-Einträge (FHIR-R5-nah, vereinfacht). Illustratives Studienprofil
// (Mara K.), markiert als synthetic: true.
const epaQuellen: EpaEntryQuelle[] = [
  {
    id: "epa-bp-2026-03-12",
    resourceType: "Observation",
    kind: { de: "Blutdruck", en: "Blood pressure" },
    value: gleich("124/80 mmHg"),
    date: "2026-03-12",
    issuer: PRAXIS_KOCH,
    kategorie: "vitalwerte",
    sourceKey: "epa-vitalwerte",
    synthetic: true,
  },
  {
    id: "epa-chol-2026-03-12",
    resourceType: "Observation",
    kind: { de: "Cholesterin gesamt", en: "Total cholesterol" },
    value: gleich("198 mg/dl"),
    date: "2026-03-12",
    issuer: LABOR_MVZ,
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-vitd-2026-03-12",
    resourceType: "Observation",
    kind: gleich("Vitamin D (25-OH)"),
    value: gleich("24 ng/ml"),
    date: "2026-03-12",
    issuer: LABOR_MVZ,
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-ferritin-2026-03-12",
    resourceType: "Observation",
    kind: gleich("Ferritin"),
    value: gleich("18 µg/l"),
    date: "2026-03-12",
    issuer: LABOR_MVZ,
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-imm-tetanus-2017-08-20",
    resourceType: "Immunization",
    kind: {
      de: "Tetanus / Diphtherie (Auffrischung)",
      en: "Tetanus / diphtheria (booster)",
    },
    value: {
      de: "letzte Auffrischung 2017-08-20",
      en: "last booster 2017-08-20",
    },
    date: "2017-08-20",
    issuer: PRAXIS_KOCH,
    kategorie: "impfungen",
    sourceKey: "epa-impfungen",
    synthetic: true,
  },
  {
    // Absichtlich fehlender Eintrag für Szenario "reise".
    id: "epa-imm-hepatitisA-fehlt",
    resourceType: "Immunization",
    kind: gleich("Hepatitis A"),
    value: { de: "kein Eintrag in der ePA", en: "no entry in the ePA" },
    date: null,
    issuer: KEIN_EINTRAG,
    kategorie: "impfungen",
    sourceKey: "epa-impfungen",
    fehlt: true,
    synthetic: true,
  },
  {
    id: "epa-imm-hepatitisB-fehlt",
    resourceType: "Immunization",
    kind: gleich("Hepatitis B"),
    value: { de: "kein Eintrag in der ePA", en: "no entry in the ePA" },
    date: null,
    issuer: KEIN_EINTRAG,
    kategorie: "impfungen",
    sourceKey: "epa-impfungen",
    fehlt: true,
    synthetic: true,
  },
  // Nüchternblutzucker + HbA1c (für Glukose-Hinweis)
  {
    id: "epa-blutzucker-2026-03-12",
    resourceType: "Observation",
    kind: { de: "Nüchternblutzucker", en: "Fasting blood sugar" },
    value: gleich("94 mg/dl"),
    date: "2026-03-12",
    issuer: LABOR_MVZ,
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-hba1c-2026-03-12",
    resourceType: "Observation",
    kind: gleich("HbA1c"),
    // F14: deutsches Dezimalkomma -> englischer Dezimalpunkt.
    value: { de: "5,4 %", en: "5.4 %" },
    date: "2026-03-12",
    issuer: LABOR_MVZ,
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  // Zahnarzt-Einträge (für Vorsorge-Hinweis)
  {
    id: "epa-zahnarzt-2026-01-27",
    resourceType: "Observation",
    kind: { de: "Zahnarztbesuch", en: "Dental check-up" },
    value: {
      de: "PZR + Befund unauffällig",
      en: "professional cleaning + check-up, nothing unusual",
    },
    date: "2026-01-27",
    issuer: PRAXIS_MAIER,
    kategorie: "vorsorge",
    sourceKey: "epa-vorsorge",
    synthetic: true,
  },
];

function aufloesenEpa(q: EpaEntryQuelle, locale: Locale): EpaEntry {
  return { ...q, kind: q.kind[locale], value: q.value[locale], issuer: q.issuer[locale] };
}

/** Locale-unabhaengige ID-Liste (Validierung, statische Parameter). */
export const epaEntryIds: string[] = epaQuellen.map((q) => q.id);

/** Alle ePA-Eintraege in der gewaehlten Sprache. */
export function epaEntriesFuer(locale: Locale): EpaEntry[] {
  return epaQuellen.map((q) => aufloesenEpa(q, locale));
}

/** Ein ePA-Eintrag nach id in der gewaehlten Sprache. */
export function epaEntryFuer(id: string, locale: Locale): EpaEntry | undefined {
  const q = epaQuellen.find((x) => x.id === id);
  return q ? aufloesenEpa(q, locale) : undefined;
}

/** Blutdruck-Messreihe der letzten 6 Monate (systolisch/diastolisch, mmHg). */
export interface BlutdruckPunkt {
  monat: string;
  sys: number;
  dia: number;
}

interface BlutdruckPunktQuelle extends Omit<BlutdruckPunkt, "monat"> {
  monat: Lokalisiert;
}

const blutdruckQuellen: BlutdruckPunktQuelle[] = [
  { monat: { de: "Okt 2025", en: "Oct 2025" }, sys: 118, dia: 76 },
  { monat: { de: "Nov 2025", en: "Nov 2025" }, sys: 119, dia: 77 },
  { monat: { de: "Dez 2025", en: "Dec 2025" }, sys: 122, dia: 79 },
  { monat: { de: "Jan 2026", en: "Jan 2026" }, sys: 125, dia: 81 },
  { monat: { de: "Feb 2026", en: "Feb 2026" }, sys: 128, dia: 83 },
  { monat: { de: "Mär 2026", en: "Mar 2026" }, sys: 124, dia: 80 },
];

/**
 * Locale-unabhaengige Messwerte (nur sys/dia) - fuer Sparkline und Kacheln,
 * die keine Monatsbeschriftung brauchen.
 */
export const blutdruckReihe: { sys: number; dia: number }[] = blutdruckQuellen.map(
  ({ sys, dia }) => ({ sys, dia }),
);

/** Blutdruckreihe inkl. beschrifteter Monate in der gewaehlten Sprache. */
export function blutdruckReiheFuer(locale: Locale): BlutdruckPunkt[] {
  return blutdruckQuellen.map((p) => ({ monat: p.monat[locale], sys: p.sys, dia: p.dia }));
}

/**
 * Geplante Reise (Nutzereingabe, im Studienprofil hinterlegt).
 * Enthaelt nur Eigennamen, Laendercode, ISO-Datum und Zahlen - nichts zu
 * uebersetzen, daher bewusst kein Accessor.
 */
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

const blutgruppeQuelle: Lokalisiert = { de: "A positiv (A+)", en: "A positive (A+)" };

/** Blutgruppe in der gewaehlten Sprache. */
export function blutgruppeFuer(locale: Locale): string {
  return blutgruppeQuelle[locale];
}

export interface Allergie {
  stoff: string;
  detail: string;
}

interface AllergieQuelle {
  stoff: Lokalisiert;
  detail: Lokalisiert;
}

/** Allergien & Unverträglichkeiten. */
const allergienQuellen: AllergieQuelle[] = [
  {
    stoff: { de: "Birken- und Gräserpollen", en: "Birch and grass pollen" },
    detail: { de: "bekannt seit 2019", en: "known since 2019" },
  },
  {
    stoff: gleich("Penicillin"),
    detail: {
      de: "Verdacht – Hautausschlag 2021, keine bestätigte Anaphylaxie",
      en: "suspected - skin rash in 2021, no confirmed anaphylaxis",
    },
  },
  {
    stoff: gleich("Latex"),
    detail: { de: "nicht bekannt", en: "not known" },
  },
];

export function allergienFuer(locale: Locale): Allergie[] {
  return allergienQuellen.map((a) => ({ stoff: a.stoff[locale], detail: a.detail[locale] }));
}

export interface Dauermedikament {
  name: string;
  dosis: string;
  grund: string;
}

interface DauermedikamentQuelle {
  name: Lokalisiert;
  dosis: Lokalisiert;
  grund: Lokalisiert;
}

/** Dauermedikamente (vollständig). */
const dauermedikamentQuellen: DauermedikamentQuelle[] = [
  {
    name: gleich("Cholecalciferol"),
    dosis: { de: "1000 IE täglich", en: "1000 IU daily" },
    grund: { de: "Vitamin-D-Substitution", en: "vitamin D supplement" },
  },
  {
    name: { de: "Cetirizin", en: "Cetirizine" },
    dosis: { de: "10 mg bei Bedarf", en: "10 mg as needed" },
    grund: { de: "Pollensaison (April–Juni)", en: "pollen season (April-June)" },
  },
];

export function dauermedikamenteFuer(locale: Locale): Dauermedikament[] {
  return dauermedikamentQuellen.map((m) => ({
    name: m.name[locale],
    dosis: m.dosis[locale],
    grund: m.grund[locale],
  }));
}

/** Hinweis: keine Antikoagulantien, keine Herzmedikamente. */
const keineDauermedikationQuelle: Lokalisiert = {
  de: "Keine Antikoagulantien, keine Herzmedikamente.",
  en: "No anticoagulants, no heart medication.",
};

export function keineDauermedikationFuer(locale: Locale): string {
  return keineDauermedikationQuelle[locale];
}

export interface Familienbefund {
  verwandt: string;
  befund: string;
}

interface FamilienbefundQuelle {
  verwandt: Lokalisiert;
  befund: Lokalisiert;
}

/** Familienanamnese. */
const familienanamneseQuellen: FamilienbefundQuelle[] = [
  {
    verwandt: { de: "Mutter", en: "Mother" },
    befund: {
      de: "Hypothyreose (Schilddrüsenunterfunktion)",
      en: "Hypothyroidism (underactive thyroid)",
    },
  },
  {
    verwandt: { de: "Vater", en: "Father" },
    befund: {
      de: "Hypertonie (Bluthochdruck, seit dem 52. Lebensjahr)",
      en: "Hypertension (high blood pressure, since the age of 52)",
    },
  },
  {
    verwandt: { de: "Großvater (mütterlich)", en: "Grandfather (mother's side)" },
    befund: {
      de: "Diabetes Typ 2 (Diagnose mit 61)",
      en: "Type 2 diabetes (diagnosed at 61)",
    },
  },
];

export function familienanamneseFuer(locale: Locale): Familienbefund[] {
  return familienanamneseQuellen.map((f) => ({
    verwandt: f.verwandt[locale],
    befund: f.befund[locale],
  }));
}

const familienanamneseHinweisQuelle: Lokalisiert = {
  de: "Keine Herzerkrankungen, keine Krebserkrankungen in der engeren Familie.",
  en: "No heart disease and no cancer in the close family.",
};

export function familienanamneseHinweisFuer(locale: Locale): string {
  return familienanamneseHinweisQuelle[locale];
}

// Hinweis: Die früher hier hinterlegte Parallelliste `faelligeTermine` wurde
// entfernt (kein Konsument, tote Doppelung). Anstehende Vorsorge-Termine sind
// kanonisch in src/data/termine.ts (aus hinweise/epa/reise abgeleitet).

export interface Sozialanamnese {
  beruf: string;
  raucherstatus: string;
  alkohol: string;
  sport: string;
  schichtarbeit: string;
}

/** Sozialanamnese. */
const sozialanamneseQuelle: Record<keyof Sozialanamnese, Lokalisiert> = {
  beruf: {
    de: "UX-Designerin, überwiegend sitzend/Bildschirm",
    en: "UX designer, mostly seated at a screen",
  },
  raucherstatus: {
    de: "Nichtraucherin (nie geraucht)",
    en: "Non-smoker (never smoked)",
  },
  alkohol: { de: "gelegentlich, < 1× pro Woche", en: "occasionally, < 1× per week" },
  sport: {
    de: "4× pro Woche (Krafttraining + Ausdauer)",
    en: "4× per week (strength training + endurance)",
  },
  schichtarbeit: { de: "nein", en: "no" },
};

export function sozialanamneseFuer(locale: Locale): Sozialanamnese {
  return {
    beruf: sozialanamneseQuelle.beruf[locale],
    raucherstatus: sozialanamneseQuelle.raucherstatus[locale],
    alkohol: sozialanamneseQuelle.alkohol[locale],
    sport: sozialanamneseQuelle.sport[locale],
    schichtarbeit: sozialanamneseQuelle.schichtarbeit[locale],
  };
}

/** Aktuelle Beschwerden (optional angegeben). */
const aktuelleBeschwerdenQuellen: Lokalisiert[] = [
  {
    de: "Gelegentliche Kopfschmerzen, v. a. donnerstags/freitags",
    en: "Occasional headaches, mostly on Thursdays and Fridays",
  },
  {
    de: "Leichte Erschöpfung in der Arbeitswoche",
    en: "Mild tiredness during the working week",
  },
  { de: "Kein Schwindel, keine Brustschmerzen", en: "No dizziness, no chest pain" },
];

export function aktuelleBeschwerdenFuer(locale: Locale): string[] {
  return aktuelleBeschwerdenQuellen.map((b) => b[locale]);
}

/** Aktuelle Medikation als Kurzliste (für Vorsorge-Export). */
const medikamenteKurzQuelle: Lokalisiert = {
  de: "Cholecalciferol 1000 IE · Cetirizin 10 mg b. B.",
  en: "Cholecalciferol 1000 IU · Cetirizine 10 mg as needed",
};

export function medikamenteKurzFuer(locale: Locale): string {
  return medikamenteKurzQuelle[locale];
}

export interface Diagnose {
  code: string;
  text: string;
}

interface DiagnoseQuelle extends Omit<Diagnose, "text"> {
  text: Lokalisiert;
}

/** Diagnosen (ICD-10). */
const diagnoseQuellen: DiagnoseQuelle[] = [
  {
    code: "D50.9",
    text: {
      de: "Eisenmangelanämie, leichtgradig (Verlaufskontrolle 03/2026)",
      en: "Iron deficiency anaemia, mild (follow-up 03/2026)",
    },
  },
  {
    code: "J30.1",
    text: {
      de: "Allergische Rhinitis durch Pollen (saisonal)",
      en: "Allergic rhinitis caused by pollen (seasonal)",
    },
  },
];

/** Locale-unabhaengige ICD-10-Codes. */
export const diagnoseCodes: string[] = diagnoseQuellen.map((d) => d.code);

export function diagnosenFuer(locale: Locale): Diagnose[] {
  return diagnoseQuellen.map((d) => ({ code: d.code, text: d.text[locale] }));
}

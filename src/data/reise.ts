// Synthetische Datenbasis der Reise-Subseite (/reise).
// ALLE Werte sind Beispieldaten (synthetic/beispiel) und KEINE medizinische
// Beratung. Die Reiseziel→Impfung-Zuordnungen sind ausdrücklich beispielhaft
// und nicht medizinisch korrekt. VitaLink ist kein Medizinprodukt.

export interface Lokalisiert {
  de: string;
  en: string;
}

// --- C) Synthetischer Aufenthaltsort ---------------------------------------
export const synthetischerAufenthaltsort = {
  landCode: "DE",
  land: { de: "Deutschland", en: "Germany" } as Lokalisiert,
  synthetic: true as const,
  beispiel: true as const,
};

// --- 3b) Impf-Informationen (B1-Sprache, nicht-alarmistisch) ---------------
export interface ImpfInfo {
  id: string;
  name: Lokalisiert;
  erklaerung: Lokalisiert;
  /** Malaria-Prophylaxe ist ein Medikament, keine Impfung. */
  istMedikament?: boolean;
  beispiel: true;
}

export const impfInfos: ImpfInfo[] = [
  {
    id: "hepatitis-a",
    name: { de: "Hepatitis A", en: "Hepatitis A" },
    erklaerung: {
      de: "Hepatitis A ist eine Leberentzündung, die durch verunreinigtes Wasser oder Lebensmittel übertragen werden kann. Die Impfung schützt zuverlässig und wird für viele Reiseziele empfohlen. Sie besteht meist aus zwei Dosen im Abstand von 6 bis 12 Monaten.",
      en: "Hepatitis A is a liver inflammation that can be transmitted through contaminated water or food. The vaccine provides reliable protection and is recommended for many travel destinations. It usually consists of two doses given 6 to 12 months apart.",
    },
    beispiel: true,
  },
  {
    id: "hepatitis-b",
    name: { de: "Hepatitis B", en: "Hepatitis B" },
    erklaerung: {
      de: "Hepatitis B ist eine Leberentzündung, die über Blut und Körperflüssigkeiten übertragen werden kann. Die Impfung bietet einen langfristigen Schutz und wird für viele Reisen empfohlen. Sie wird meist in mehreren Dosen über einige Monate gegeben.",
      en: "Hepatitis B is a liver inflammation that can be transmitted through blood and bodily fluids. The vaccine offers long-term protection and is recommended for many trips. It is usually given in several doses over a few months.",
    },
    beispiel: true,
  },
  {
    id: "tetanus",
    name: { de: "Tetanus / Diphtherie", en: "Tetanus / Diphtheria" },
    erklaerung: {
      de: "Tetanus (Wundstarrkrampf) und Diphtherie sind Infektionen, gegen die meist gemeinsam geimpft wird. Der Schutz hält rund zehn Jahre, danach wird eine Auffrischung empfohlen. Diese Impfung gehört zu den Standardimpfungen, nicht nur auf Reisen.",
      en: "Tetanus and diphtheria are infections that are usually vaccinated against together. Protection lasts around ten years, after which a booster is recommended. This vaccine is one of the standard vaccinations, not only for travel.",
    },
    beispiel: true,
  },
  {
    id: "typhus",
    name: { de: "Typhus", en: "Typhoid" },
    erklaerung: {
      de: "Typhus ist eine Darminfektion, die über verunreinigtes Wasser oder Essen übertragen wird. Eine Impfung kann bei Reisen in bestimmte Regionen sinnvoll sein. Sie ist als Spritze oder als Schluckimpfung möglich.",
      en: "Typhoid is an intestinal infection transmitted through contaminated water or food. A vaccination can be useful for trips to certain regions. It is available as an injection or as an oral vaccine.",
    },
    beispiel: true,
  },
  {
    id: "malaria",
    name: { de: "Malaria-Prophylaxe", en: "Malaria prophylaxis" },
    erklaerung: {
      de: "Malaria ist eine Erkrankung, die durch Mückenstiche übertragen wird. Dagegen gibt es keine klassische Impfung, sondern vorbeugende Medikamente (Malaria-Prophylaxe). Ob und welche Tabletten sinnvoll sind, hängt vom Reiseziel ab und wird ärztlich besprochen.",
      en: "Malaria is a disease transmitted through mosquito bites. There is no classic vaccine for it, but rather preventive medication (malaria prophylaxis). Whether and which tablets make sense depends on the destination and is discussed with a doctor.",
    },
    istMedikament: true,
    beispiel: true,
  },
  {
    id: "gelbfieber",
    name: { de: "Gelbfieber", en: "Yellow fever" },
    erklaerung: {
      de: "Gelbfieber ist eine Viruserkrankung, die durch Mücken übertragen wird. Für manche Länder ist die Impfung sogar Voraussetzung für die Einreise. Sie wird in besonderen Impfstellen gegeben und schützt langfristig.",
      en: "Yellow fever is a viral disease transmitted by mosquitoes. For some countries the vaccination is even required for entry. It is given at special vaccination centres and provides long-term protection.",
    },
    beispiel: true,
  },
  {
    id: "meningokokken",
    name: { de: "Meningokokken", en: "Meningococcal" },
    erklaerung: {
      de: "Meningokokken sind Bakterien, die eine Hirnhautentzündung auslösen können. Eine Impfung wird für bestimmte Reiseziele und Situationen empfohlen. Sie schützt vor mehreren Typen dieser Bakterien.",
      en: "Meningococci are bacteria that can cause meningitis. A vaccination is recommended for certain destinations and situations. It protects against several types of these bacteria.",
    },
    beispiel: true,
  },
  {
    id: "tollwut",
    name: { de: "Tollwut", en: "Rabies" },
    erklaerung: {
      de: "Tollwut wird durch den Biss oder Kratzer infizierter Tiere übertragen. Eine Impfung vor der Reise kann bei längeren Aufenthalten oder Kontakt zu Tieren sinnvoll sein. Sie verschafft im Ernstfall wertvolle Zeit.",
      en: "Rabies is transmitted through bites or scratches from infected animals. A vaccination before travel can be useful for longer stays or contact with animals. It buys valuable time in an emergency.",
    },
    beispiel: true,
  },
];

export const impfInfoMap: Record<string, ImpfInfo> = Object.fromEntries(
  impfInfos.map((i) => [i.id, i]),
);

// --- 3c) Reiseimpfungs-Regeln je Land (Beispiel, nicht medizinisch korrekt) -
export const reiseRegeln: Record<string, string[]> = {
  TH: ["hepatitis-a", "hepatitis-b", "typhus", "tetanus", "tollwut"],
  IN: ["hepatitis-a", "hepatitis-b", "typhus", "tetanus", "malaria", "tollwut"],
  BR: ["hepatitis-a", "hepatitis-b", "gelbfieber", "malaria", "tetanus"],
  KE: ["hepatitis-a", "hepatitis-b", "gelbfieber", "malaria", "typhus", "tetanus", "meningokokken"],
  US: ["tetanus"],
  FR: ["tetanus"],
  DE: ["tetanus"],
  JP: ["hepatitis-a", "tetanus"],
  AU: ["tetanus"],
  MA: ["hepatitis-a", "typhus", "tetanus"],
};

/** Basis-Impfliste für Länder ohne explizite Beispielzuordnung. */
export const fallbackImpfungen: string[] = ["tetanus"];

export interface LandImpfungen {
  impfIds: string[];
  /** true, wenn auf die Basis-Impfliste zurückgegriffen wurde. */
  fallback: boolean;
}

export function impfungenFuerLand(code: string): LandImpfungen {
  const regel = reiseRegeln[code];
  if (regel) return { impfIds: regel, fallback: false };
  return { impfIds: fallbackImpfungen, fallback: true };
}

// --- 3d) Status-Logik -------------------------------------------------------
export type ImpfStatus = "vorhanden" | "bald_faellig" | "kein_eintrag";

interface EpaImpfEintrag {
  impfId: string;
  /** Datum der letzten Impfung (ISO) oder null bei fehlendem Eintrag. */
  letzteImpfung: string | null;
  /** Empfohlenes Auffrischungsintervall in Jahren (entfällt bei Grundschutz). */
  intervallJahre?: number;
  /** Absichtlich fehlender Eintrag (Konsistenz mit epa.ts: Hepatitis A). */
  fehlt?: boolean;
}

/**
 * Synthetischer ePA-Impfstatus – konsistent mit src/data/epa.ts:
 *   Tetanus letzte Auffrischung 2017-08-20, Intervall ~10 Jahre → fällig 2027.
 *   Hepatitis A: kein Eintrag.
 */
export const epaImpfstatus: EpaImpfEintrag[] = [
  // Tetanus 2017, Intervall 11 Jahre → fällig 2028 → vorhanden (> 1 Jahr bis Auffrischung).
  { impfId: "tetanus", letzteImpfung: "2017-08-20", intervallJahre: 11 },
  { impfId: "hepatitis-a", letzteImpfung: null, fehlt: true },
  // Typhus 2023, synthetischer Eintrag. Intervall 5 Jahre → fällig 2028 → vorhanden.
  { impfId: "typhus", letzteImpfung: "2023-05-15", intervallJahre: 5 },
];

const epaImpfstatusMap: Record<string, EpaImpfEintrag> = Object.fromEntries(
  epaImpfstatus.map((e) => [e.impfId, e]),
);

/**
 * Aktuelles Jahr für die synthetischen Berechnungen.
 * Bewusst auf Jahresgranularität (Projektzeitraum SoSe 2026), damit die
 * Tetanus-Auffrischung (fällig 2027) konsistent als "bald_faellig" gilt.
 */
export const AKTUELLES_JAHR = 2026;

/**
 * Berechnet den Impfstatus einer Impfung gegen den synthetischen ePA-Stand.
 * - "vorhanden":    eingetragen und (falls Intervall) noch klar im Zeitrahmen
 * - "bald_faellig": Auffrischung im aktuellen oder nächsten Jahr fällig
 * - "kein_eintrag": kein Eintrag vorhanden oder bereits abgelaufen
 */
export function berechneImpfstatus(impfId: string, jahr: number = AKTUELLES_JAHR): ImpfStatus {
  const eintrag = epaImpfstatusMap[impfId];
  if (!eintrag || eintrag.fehlt || !eintrag.letzteImpfung) return "kein_eintrag";

  if (!eintrag.intervallJahre) return "vorhanden";

  const letztesJahr = new Date(eintrag.letzteImpfung).getFullYear();
  const faelligJahr = letztesJahr + eintrag.intervallJahre;

  if (faelligJahr < jahr) return "kein_eintrag"; // abgelaufen
  if (faelligJahr - jahr <= 1) return "bald_faellig"; // jetzt oder im nächsten Jahr
  return "vorhanden";
}

/** ActionCard-Angebote (DF9) für fehlende Reiseimpfungen. */
export const reiseAngebotIds = ["hausarzt-ansprechen", "reisemed-ruhr"] as const;

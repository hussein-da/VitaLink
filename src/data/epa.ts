import type { EpaEntry } from "@/lib/types";

// ePA-Einträge (FHIR-R5-nah, vereinfacht). Illustratives Studienprofil
// (Mara Bergmann), markiert als synthetic: true.
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
export const geplanteReise = {
  ziel: "Thailand",
  zielCode: "TH",
  staedte: "Bangkok + Chiang Mai",
  datum: "2026-08-15",
  wochenBisAbreise: 6,
  fehlendeImpfungen: ["Hepatitis A", "Hepatitis B"],
} as const;

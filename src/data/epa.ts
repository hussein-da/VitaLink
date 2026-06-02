import type { EpaEntry } from "@/lib/types";

// Synthetische ePA-Einträge (FHIR-R5-nah, vereinfacht). Alles fiktiv.
export const epaEntries: EpaEntry[] = [
  {
    id: "epa-bp-2026-03-14",
    resourceType: "Observation",
    kind: "Blutdruck",
    value: "128/82 mmHg",
    date: "2026-03-14",
    issuer: "Hausarztpraxis Essen-Rüttenscheid",
    kategorie: "vitalwerte",
    sourceKey: "epa-vitalwerte",
    synthetic: true,
  },
  {
    id: "epa-chol-2026-02-02",
    resourceType: "Observation",
    kind: "Cholesterin gesamt",
    value: "195 mg/dl",
    date: "2026-02-02",
    issuer: "Labor MVZ Essen",
    kategorie: "labor",
    sourceKey: "epa-labor",
    synthetic: true,
  },
  {
    id: "epa-imm-tetanus-2017-08-20",
    resourceType: "Immunization",
    kind: "Tetanus (Auffrischung)",
    value: "letzte Auffrischung 2017-08-20",
    date: "2017-08-20",
    issuer: "Hausarztpraxis Essen-Rüttenscheid",
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
  // Bewusst KEINE Condition: Zielgruppe Gen-Z, Prävention, keine chronische Erkrankung.
];

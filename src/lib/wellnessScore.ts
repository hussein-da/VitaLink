// VitaLink — Wellness-Score (Block 3).
// Deterministisch aus Maras Profil abgeleitet. Das Ergebnis ist hartkodiert
// (kein Live-Algorithmus): die Faktoren dokumentieren die Herleitung, der
// Gesamtwert ist als kuratiertes Ergebnis hinterlegt. Alle Werte synthetisch.

export type WellnessLabel = "Sehr gut" | "Gut" | "Mittel" | "Niedrig";

export interface WellnessFaktor {
  /** Anzeigename, z. B. "Schlaf". */
  name: string;
  /** Beitrag zum Score (positiv = stützt den Wert). */
  wert: number;
  /** Datenherkunft des Faktors. */
  quelle: "epa" | "wearable";
}

export interface WellnessScore {
  /** Gesamtwert 0–100. */
  gesamt: number;
  /** Sprachliches Etikett zum Wertebereich. */
  label: WellnessLabel;
  /** Statusfarbe als CSS-Variable (Token aus globals.css). */
  farbe: string;
  /** Beiträge der Einzelfaktoren (Herleitung, ePA + Wearable). */
  faktoren: WellnessFaktor[];
}

/** Etikett je Wertebereich (Block 3). */
export function wellnessLabel(score: number): WellnessLabel {
  if (score >= 90) return "Sehr gut";
  if (score >= 80) return "Gut";
  if (score >= 60) return "Mittel";
  return "Niedrig";
}

/** Statusfarbe (CSS-Variable) je Wertebereich. */
function wellnessFarbe(score: number): string {
  if (score >= 80) return "--c-status-ok";
  if (score >= 60) return "--c-status-warn";
  return "--c-status-warn";
}

// Maras Faktoren (Herleitung des Gesamtwerts 87, Block 3).
const FAKTOREN: WellnessFaktor[] = [
  { name: "Schlaf", wert: 13.4, quelle: "wearable" },
  { name: "HRV", wert: 10, quelle: "wearable" },
  { name: "Ruhepuls", wert: 14, quelle: "wearable" },
  { name: "Aktivität", wert: 18, quelle: "wearable" },
  { name: "Blutdruck", wert: 11, quelle: "epa" },
  { name: "Laborwerte", wert: 12, quelle: "epa" },
];

// Kuratiertes Ergebnis (Block 1: 100 − 5 Schlaf − 4 Vitamin D − 4 Blutdruck = 87).
const GESAMT = 87;

/** Maras Wellness-Score (deterministisch, hartkodiertes Ergebnis). */
export const wellnessScore: WellnessScore = {
  gesamt: GESAMT,
  label: wellnessLabel(GESAMT),
  farbe: wellnessFarbe(GESAMT),
  faktoren: FAKTOREN,
};

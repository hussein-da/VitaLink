// VitaLink — Wellness-Score (Block 3).
// Deterministisch aus Maras Profil abgeleitet. Das Ergebnis ist hartkodiert
// (kein Live-Algorithmus): die Faktoren dokumentieren die Herleitung, der
// Gesamtwert ist als kuratiertes Ergebnis hinterlegt. Alle Werte synthetisch.
//
// Zweisprachigkeit: `WellnessLabel` ist seit der i18n-Migration ein
// SPRACHNEUTRALER Schluessel (vorher deutscher Anzeigetext). Die Anzeige-
// Zuordnung gehoert ins Woerterbuch (src/i18n/de.ts / en.ts), nicht hierher —
// so bleibt die Score-Logik frei von Oberflaechentexten.

import type { Lokalisiert, Locale } from "@/i18n/types";

/** Sprachneutraler Schluessel des Wertebereichs. Anzeige kommt aus dem Woerterbuch. */
export type WellnessLabel = "very-good" | "good" | "moderate" | "low";

/** Locale-unabhaengige Liste aller Label-Schluessel (Validierung/Woerterbuch-Abgleich). */
export const wellnessLabelKeys: WellnessLabel[] = ["very-good", "good", "moderate", "low"];

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
  /** Sprachneutraler Schlüssel zum Wertebereich. */
  label: WellnessLabel;
  /** Statusfarbe als CSS-Variable (Token aus globals.css). */
  farbe: string;
  /** Beiträge der Einzelfaktoren (Herleitung, ePA + Wearable). */
  faktoren: WellnessFaktor[];
}

/** Lokalisierte Quellform eines Faktors. */
interface WellnessFaktorQuelle extends Omit<WellnessFaktor, "name"> {
  name: Lokalisiert;
}

/** Etikett-Schlüssel je Wertebereich (Block 3). */
export function wellnessLabel(score: number): WellnessLabel {
  if (score >= 90) return "very-good";
  if (score >= 80) return "good";
  if (score >= 60) return "moderate";
  return "low";
}

/** Statusfarbe (CSS-Variable) je Wertebereich. */
function wellnessFarbe(score: number): string {
  if (score >= 80) return "--c-status-ok";
  if (score >= 60) return "--c-status-warn";
  return "--c-status-warn";
}

// Maras Faktoren (Herleitung des Gesamtwerts 87, Block 3).
const FAKTOREN_QUELLE: WellnessFaktorQuelle[] = [
  { name: { de: "Schlaf", en: "Sleep" }, wert: 13.4, quelle: "wearable" },
  { name: { de: "HRV", en: "HRV" }, wert: 10, quelle: "wearable" },
  { name: { de: "Ruhepuls", en: "Resting heart rate" }, wert: 14, quelle: "wearable" },
  { name: { de: "Aktivität", en: "Activity" }, wert: 18, quelle: "wearable" },
  { name: { de: "Blutdruck", en: "Blood pressure" }, wert: 11, quelle: "epa" },
  { name: { de: "Laborwerte", en: "Lab results" }, wert: 12, quelle: "epa" },
];

// Kuratiertes Ergebnis (Block 1: 100 − 5 Schlaf − 4 Vitamin D − 4 Blutdruck = 87).
const GESAMT = 87;

function aufloesenFaktor(q: WellnessFaktorQuelle, locale: Locale): WellnessFaktor {
  return { ...q, name: q.name[locale] };
}

/** Maras Wellness-Score in der gewünschten Sprache (deterministisch, hartkodiert). */
export function wellnessScoreFuer(locale: Locale): WellnessScore {
  return {
    gesamt: GESAMT,
    label: wellnessLabel(GESAMT),
    farbe: wellnessFarbe(GESAMT),
    faktoren: FAKTOREN_QUELLE.map((q) => aufloesenFaktor(q, locale)),
  };
}

/**
 * Deutsche Auflösung als Vorgabe. `gesamt`, `label` und `farbe` sind ohnehin
 * sprachneutral — nur die Faktor-Namen hängen an der Locale. Für lokalisierte
 * Faktor-Namen `wellnessScoreFuer(locale)` nutzen.
 */
export const wellnessScore: WellnessScore = wellnessScoreFuer("de");

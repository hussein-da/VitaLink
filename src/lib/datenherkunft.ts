import type { Datenherkunft } from "@/lib/types";

/**
 * Zentrale Quelle der Wahrheit für die Datenherkunft (DF5/DF6). Jeder in der App
 * gezeigte Datenpunkt verweist per `herkunftId` hierher — so bleiben Quelle,
 * Datum, Zeitraum und Sensorart an EINER Stelle gepflegt und konsistent mit
 * epa.ts / wearable.ts / profile.ts. Werte sind synthetisch (Studienprofil Mara K.).
 */

// Konstante Quellen-Bezeichnungen (nicht doppelt tippen).
const LABOR = "Labor MVZ Bochum";
const HAUSARZT = "Hausarztpraxis Dr. Koch, Bochum";
const ZAHNARZT = "Zahnarztpraxis Dr. Maier, Bochum-Innenstadt";
const GARMIN = "Garmin Fenix 7";
const APPLE = "Apple Watch Series 12";
const LABORDATUM = "12.03.2026";

const eintraege: Datenherkunft[] = [
  // ── ePA · Laborwerte (Labor MVZ Bochum, 12.03.2026) ──
  { id: "vitamin-d", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "ferritin", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "cholesterin", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "hba1c", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "nuechternblutzucker", typ: "epa", quelle: LABOR, datum: LABORDATUM },

  // ── ePA · Vitalwerte / Vorsorge / Impfungen ──
  { id: "blutdruck", typ: "epa", quelle: HAUSARZT, datum: LABORDATUM, zeitraum: "6-Monats-Messreihe" },
  { id: "gewicht", typ: "epa", quelle: HAUSARZT, datum: LABORDATUM },
  { id: "bmi", typ: "epa", quelle: "Berechnet aus Gewicht & Körpergröße (ePA)", datum: LABORDATUM },
  { id: "vitamin-d-praeparat", typ: "epa", quelle: "ePA-Medikationsplan", datum: "seit 15.01.2026" },
  { id: "zahnarzt", typ: "epa", quelle: ZAHNARZT, datum: "27.01.2026" },
  { id: "tetanus", typ: "epa", quelle: HAUSARZT, datum: "20.08.2017" },
  { id: "hepatitis-a", typ: "epa", quelle: "ePA-Impfstatus — kein Eintrag" },
  { id: "hepatitis-b", typ: "epa", quelle: "ePA-Impfstatus — kein Eintrag" },

  // ── Wearable · Garmin Fenix 7 ──
  { id: "schlafdauer", typ: "wearable", quelle: GARMIN, sensorart: "Schlafsensor", zeitraum: "letzte 14 Tage" },
  { id: "tiefschlaf", typ: "wearable", quelle: GARMIN, sensorart: "Schlafsensor", zeitraum: "letzte 14 Tage" },
  { id: "schlafscore", typ: "wearable", quelle: GARMIN, sensorart: "Schlafsensor", zeitraum: "letzte 14 Tage" },
  { id: "hrv", typ: "wearable", quelle: GARMIN, sensorart: "optischer Pulssensor", zeitraum: "letzte 14 Tage" },
  { id: "ruhepuls", typ: "wearable", quelle: GARMIN, sensorart: "optischer Pulssensor", zeitraum: "letzte 30 Tage" },
  { id: "hf-zonen", typ: "wearable", quelle: GARMIN, sensorart: "optischer Pulssensor", zeitraum: "letzte 30 Tage" },
  { id: "spo2", typ: "wearable", quelle: GARMIN, sensorart: "optischer Pulssensor", zeitraum: "Wochenschnitt" },
  { id: "atemfrequenz", typ: "wearable", quelle: GARMIN, sensorart: "optischer Pulssensor", zeitraum: "letzte 7 Tage" },
  { id: "stress", typ: "wearable", quelle: GARMIN, sensorart: "optischer Pulssensor (HRV)", zeitraum: "letzte 7 Tage" },
  { id: "vo2max", typ: "wearable", quelle: GARMIN, sensorart: "Laufanalyse", zeitraum: "3-Monats-Trend" },
  { id: "hauttemperatur", typ: "wearable", quelle: GARMIN, sensorart: "Hauttemperatursensor", zeitraum: "letzte 14 Nächte" },
  { id: "schritte", typ: "wearable", quelle: GARMIN, sensorart: "Beschleunigungssensor", zeitraum: "letzte 14 Tage" },
  { id: "aktive-minuten", typ: "wearable", quelle: GARMIN, sensorart: "Beschleunigungssensor", zeitraum: "letzte 14 Tage" },
  { id: "trainings", typ: "wearable", quelle: GARMIN, sensorart: "Beschleunigungssensor", zeitraum: "letzte 7 Tage" },
  { id: "kalorien", typ: "wearable", quelle: GARMIN, sensorart: "Beschleunigungssensor", zeitraum: "Tagesmittel" },

  // ── Wearable · Apple Watch Series 12 (Glukose-Trendindikator) ──
  { id: "glukose", typ: "wearable", quelle: APPLE, sensorart: "optischer Glukosesensor", zeitraum: "letzte 14 Tage" },

  // ── Nutzereingabe ──
  { id: "reiseziel", typ: "nutzereingabe", quelle: "Deine Reiseplanung", datum: "Abreise 15.08.2026" },
];

/** Schnellzugriff nach id. */
export const datenherkunft: Record<string, Datenherkunft> = Object.fromEntries(
  eintraege.map((e) => [e.id, e]),
);

/** Auflösen einer id-Liste → gültige Datenherkunft-Einträge (ungültige werden verworfen). */
export function herkunftFuer(ids: (string | undefined)[]): Datenherkunft[] {
  const seen = new Set<string>();
  const out: Datenherkunft[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    const h = datenherkunft[id];
    if (h) {
      seen.add(id);
      out.push(h);
    }
  }
  return out;
}

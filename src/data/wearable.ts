import type { WearableStream } from "@/lib/types";

// Synthetische Wearable-Streams. Zeitraum: letzte 14 Tage (2026-05-18 bis 2026-05-31).
// Alle Werte fiktiv und frei erfunden.

const tage = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
  "2026-05-23",
  "2026-05-24",
  "2026-05-25",
  "2026-05-26",
  "2026-05-27",
  "2026-05-28",
  "2026-05-29",
  "2026-05-30",
  "2026-05-31",
];

function reihe(werte: number[]) {
  return werte.map((value, i) => ({ date: tage[i], value }));
}

export const wearableStreams: WearableStream[] = [
  {
    id: "wb-schlaf",
    metric: "schlafdauer",
    label: "Schlafdauer",
    unit: "h",
    // klar fallender 14-Tage-Trend, Band 5.4-6.6 h
    series: reihe([6.6, 6.4, 6.5, 6.2, 6.3, 6.0, 5.9, 6.1, 5.8, 5.7, 5.9, 5.6, 5.5, 5.4]),
    sensor: "Schlafsensor (Smartwatch)",
    period: "letzte 14 Tage",
    trend: "fallend",
    sourceKey: "wearable-schlaf",
    synthetic: true,
  },
  {
    id: "wb-ruhepuls",
    metric: "ruhepuls",
    label: "Ruhepuls",
    unit: "bpm",
    // leicht steigend
    series: reihe([57, 58, 57, 59, 58, 60, 59, 61, 60, 62, 61, 63, 62, 64]),
    sensor: "optischer Pulssensor",
    period: "letzte 14 Tage",
    trend: "steigend",
    sourceKey: "wearable-puls",
    synthetic: true,
  },
  {
    id: "wb-hrv",
    metric: "hrv",
    label: "HRV",
    unit: "ms",
    // leicht fallend
    series: reihe([62, 60, 61, 58, 59, 56, 57, 54, 55, 52, 53, 50, 49, 48]),
    sensor: "optischer Pulssensor",
    period: "letzte 14 Tage",
    trend: "fallend",
    sourceKey: "wearable-hrv",
    synthetic: true,
  },
  {
    id: "wb-aktivitaet",
    metric: "schritte",
    label: "Aktivität (Schritte)",
    unit: "Schritte",
    // schwankend, leicht unter persönlichem Schnitt (~8500)
    series: reihe([7200, 9100, 6400, 8300, 5600, 7800, 6900, 8800, 6100, 7400, 5900, 8200, 6700, 7000]),
    sensor: "Beschleunigungssensor",
    period: "letzte 14 Tage",
    trend: "schwankend",
    sourceKey: "wearable-aktivitaet",
    synthetic: true,
  },
];

// Persönlicher Schnitt (fiktiv) als Vergleichswert für die Aktivität.
export const persoenlicherSchnittSchritte = 8500;

import type {
  WearableStream,
  WochenrueckblickSchritte,
  WochenrueckblickTraining,
} from "@/lib/types";

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

// ---------------------------------------------------------------------------
// WOCHENRÜCKBLICK (FR-I, DF17) — synthetische 7-Tage-Schnappschüsse
// Zeitraum: 2026-05-25 bis 2026-05-31 (letzte 7 Tage des 14-Tage-Fensters)
// ---------------------------------------------------------------------------

// Schrittzahl pro Tag — 7 Werte.
// Summe: 11200+13400+12800+14100+11900+12500+12188 = 88088
// Mittelwert: 88088 / 7 = 12584,0 Schritte/Tag (exakt).
export const wochenSchritte: WochenrueckblickSchritte = {
  tage: [
    { date: "2026-05-25", value: 11200 },
    { date: "2026-05-26", value: 13400 },
    { date: "2026-05-27", value: 12800 },
    { date: "2026-05-28", value: 14100 },
    { date: "2026-05-29", value: 11900 },
    { date: "2026-05-30", value: 12500 },
    { date: "2026-05-31", value: 12188 },
  ],
  sourceKey: "wearable-aktivitaet",
  synthetic: true,
  beispiel: true,
};

// Trainingseinheiten letzte 7 Tage — 3 erkannte Einheiten.
// Dauern: [90, 102, 96] min → Summe 288 / 3 = 96 min = 1 h 36 min Schnitt.
export const wochenTraining: WochenrueckblickTraining = {
  einheiten: [
    { date: "2026-05-26", dauer: 90 },
    { date: "2026-05-28", dauer: 102 },
    { date: "2026-05-30", dauer: 96 },
  ],
  sourceKey: "wearable-aktivitaet",
  synthetic: true,
  beispiel: true,
};

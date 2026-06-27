import type {
  WearableStream,
  WochenrueckblickSchritte,
  WochenrueckblickTraining,
} from "@/lib/types";

// Wearable-Streams aus Garmin Fenix 7 (Smartwatch) + Samsung Galaxy S24 (Schritte/GPS).
// Zeitfenster der 14-Tage-Streams: 2026-06-10 bis 2026-06-23.
// Illustratives Profil der Nutzerstudie (synthetic: true).

export const wearableGeraet = "Garmin Fenix 7 + Samsung Galaxy S24";
export const letzteSync = "heute, 06:42 Uhr";

const tage14 = [
  "2026-06-10",
  "2026-06-11",
  "2026-06-12",
  "2026-06-13",
  "2026-06-14",
  "2026-06-15",
  "2026-06-16",
  "2026-06-17",
  "2026-06-18",
  "2026-06-19",
  "2026-06-20",
  "2026-06-21",
  "2026-06-22",
  "2026-06-23",
];

function reihe(werte: number[]) {
  return werte.map((value, i) => ({ date: tage14[i], value }));
}

// ── Rohdaten (14 Tage, sofern nicht anders angegeben) ──────────────────────

/** Schlafdauer (Std.) je Nacht, 14 Nächte. */
export const schlafStunden = [7.1, 6.3, 7.8, 5.9, 7.2, 6.8, 7.4, 6.1, 7.3, 6.7, 5.8, 7.0, 6.9, 7.5];
/** Schlaf-Score (0–100) je Nacht. */
export const schlafScore = [74, 61, 82, 48, 78, 68, 80, 55, 76, 65, 44, 71, 73, 83];
/** Tiefschlaf-Anteil (%) je Nacht. */
export const tiefschlafProzent = [18, 14, 22, 11, 20, 16, 21, 13, 19, 15, 10, 17, 18, 22];

/** Ruhepuls (BPM, Tagesmittel), letzte 30 Tage. */
export const ruhepuls30 = [
  58, 59, 57, 61, 62, 60, 58, 59, 63, 64, 61, 59, 58, 60, 62, 61, 59, 57, 60, 62, 61, 60, 58, 59,
  61, 63, 62, 60, 59, 58,
];

/** HRV (RMSSD in ms, Morgenmessung), 14 Tage. */
export const hrv14 = [42, 38, 48, 31, 45, 40, 47, 35, 44, 39, 29, 41, 43, 50];

/** Schritte je Tag, 14 Tage. */
export const schritte14 = [
  11200, 13400, 8900, 14100, 12800, 9200, 15300, 10800, 13200, 11900, 7800, 12500, 14200, 16100,
];

/** Aktive Minuten (HF > 100 BPM) je Tag, 14 Tage. */
export const aktiveMinuten14 = [45, 62, 28, 78, 55, 31, 88, 42, 67, 51, 24, 58, 71, 95];

/** Stress-Score (0–100, aus HRV-Variabilität), letzte 7 Tage. */
export const stress7 = [38, 45, 32, 52, 41, 29, 35];

/** Blutsauerstoff (SpO2, %) Wochenschnitt. */
export const spo2Schnitt = 97;
/** Atemfrequenz im Schlaf (Atemzüge/min). */
export const atemfrequenz = 15.2;

// ── Streams (für Detail-FactorBars, Provenance, DF11) ──────────────────────

export const wearableStreams: WearableStream[] = [
  {
    id: "wb-schlaf",
    metric: "schlafdauer",
    label: "Schlafdauer",
    unit: "h",
    series: reihe(schlafStunden),
    sensor: "Schlafsensor (Smartwatch)",
    period: "letzte 14 Tage",
    trend: "schwankend",
    sourceKey: "wearable-schlaf",
    synthetic: true,
  },
  {
    id: "wb-ruhepuls",
    metric: "ruhepuls",
    label: "Ruhepuls",
    unit: "bpm",
    series: reihe(ruhepuls30.slice(-14)),
    sensor: "optischer Pulssensor",
    period: "letzte 30 Tage",
    trend: "stabil",
    sourceKey: "wearable-puls",
    synthetic: true,
  },
  {
    id: "wb-hrv",
    metric: "hrv",
    label: "HRV",
    unit: "ms",
    series: reihe(hrv14),
    sensor: "optischer Pulssensor",
    period: "letzte 14 Tage",
    trend: "schwankend",
    sourceKey: "wearable-hrv",
    synthetic: true,
  },
  {
    id: "wb-aktivitaet",
    metric: "schritte",
    label: "Aktivität (Schritte)",
    unit: "Schritte",
    series: reihe(schritte14),
    sensor: "Beschleunigungssensor",
    period: "letzte 14 Tage",
    trend: "steigend",
    sourceKey: "wearable-aktivitaet",
    synthetic: true,
  },
];

// Persönlicher Schnitt als Vergleichswert für die Aktivität (WHO-Ziel 10.000).
export const persoenlicherSchnittSchritte = 10000;

// ── Glukose-Daten (Apple Watch Series 12, optischer Trendindikator) ─────────
// Kalibriert gegen ePA-Nüchternblutzucker (94 mg/dl, 12.03.2026).
// Gerät: Apple Watch Series 12, Messmodus: Trendindikator (nicht-invasiv).
// Alle Werte synthetisch (synthetic: true).

/** Nüchternwerte morgens (7:00 Uhr), letzte 14 Tage [mg/dl]. */
export const glukoseNuechtern14 = [88, 91, 86, 94, 89, 92, 87, 93, 90, 95, 88, 91, 89, 92];

/** Postprandiale Peaks nach Mittagessen (~13:00 Uhr), letzte 14 Tage [mg/dl]. */
export const glukosePostprandial14 = [138, 142, 129, 156, 141, 148, 133, 152, 139, 161, 136, 144, 137, 149];

/** Abendwerte (19:00 Uhr), letzte 14 Tage [mg/dl]. */
export const glukoseAbend14 = [98, 101, 94, 108, 99, 103, 96, 106, 100, 112, 97, 102, 98, 104];

export const glukoseSummary = {
  /** Ø Nüchternwert 14 Tage [mg/dl]. */
  nuechternSchnitt: 90,
  /** Ø Postprandialer Peak [mg/dl]. */
  postprandialSchnitt: 143,
  /** Höchster Peak (Donnerstag ohne Mittagsbewegung). */
  postprandialMax: 161,
  /** Ø Peak nach Schlechtnacht (< 6,5h Schlaf). */
  peakNachSchlechtnacht: 154,
  /** Ø Peak nach Gutnacht (> 7h Schlaf). */
  peakNachGutnacht: 134,
  /** Differenz Schlaf-Effekt [mg/dl]. */
  schlafEffektDiff: 20,
  /** Glukose-Variabilität CV [%]. */
  cv: 18,
  /** CV Schlechtnacht. */
  cvSchlechtnacht: 24,
  /** CV Gutnacht. */
  cvGutnacht: 14,
  /** Ø Abend-Glukose an Trainingstagen [mg/dl]. */
  abendTrainingsTag: 96,
  /** Ø Abend-Glukose an trainingsfreien Tagen [mg/dl]. */
  abendKeinTraining: 107,
  /** Training-Effekt Differenz [mg/dl]. */
  trainingsEffekt: 11,
} as const;

// ── Aufbereitete Kennzahlen (Dashboard-Headlines, Detail-Mini-Karten) ──────
// Anzeigefertige 7-Tage-Werte (kuratiert, konsistent mit Block 2 des Studienprofils).
export const wearableSummary = {
  /** Ø Schlafdauer 7 Tage (Std.). */
  schlafStd: 6.7,
  /** Ø Schlaf-Score 7 Tage. */
  schlafScore: 67,
  /** Ø Tiefschlaf-Anteil (%). */
  tiefschlaf: 16,
  /** Ø Ruhepuls 7 Tage (BPM). */
  ruhepuls: 60,
  /** Ø HRV 7 Tage (ms). */
  hrv: 40,
  /** HRV an Nächten mit < 12 % Tiefschlaf (ms). */
  hrvSchlechtnacht: 29,
  /** Ø Schritte / Tag (7 Tage). */
  schritte: 12584,
  /** Ø aktive Minuten / Tag (7 Tage). */
  aktiveMinuten: 55,
  /** Ø Stress-Score (7 Tage). */
  stress: 39,
  /** SpO2 Wochenschnitt (%). */
  spo2: 97,
} as const;

// ---------------------------------------------------------------------------
// WOCHENRÜCKBLICK (FR-I, DF17) — 7-Tage-Schnappschüsse (2026-06-17 bis 06-23)
// ---------------------------------------------------------------------------

// Schrittzahl pro Tag — Summe 88088 / 7 = 12584,0 Schritte/Tag (exakt).
export const wochenSchritte: WochenrueckblickSchritte = {
  tage: [
    { date: "2026-06-17", value: 11200 },
    { date: "2026-06-18", value: 13400 },
    { date: "2026-06-19", value: 12800 },
    { date: "2026-06-20", value: 14100 },
    { date: "2026-06-21", value: 11900 },
    { date: "2026-06-22", value: 12500 },
    { date: "2026-06-23", value: 12188 },
  ],
  sourceKey: "wearable-aktivitaet",
  synthetic: true,
  beispiel: true,
};

// Trainingseinheiten letzte 7 Tage — 4 erkannte Einheiten.
// Dauern: [90, 102, 96, 124] min → Summe 412 / 4 = 103 min = 1 Std 43 Min.
export const wochenTraining: WochenrueckblickTraining = {
  einheiten: [
    { date: "2026-06-18", dauer: 90 },
    { date: "2026-06-20", dauer: 102 },
    { date: "2026-06-22", dauer: 96 },
    { date: "2026-06-23", dauer: 124 },
  ],
  sourceKey: "wearable-aktivitaet",
  synthetic: true,
  beispiel: true,
};

import type {
  WearableStream,
  WochenrueckblickSchritte,
  WochenrueckblickTraining,
} from "@/lib/types";
import type { Locale, Lokalisiert } from "@/i18n/types";

// Wearable-Streams aus Apple Watch Series 12.
// Glukose-Daten stammen ausschließlich von der Apple Watch Series 12.
// Zeitfenster der 14-Tage-Streams: 2026-06-10 bis 2026-06-23.
// Illustratives Profil der Nutzerstudie (synthetic: true).
//
// Zweisprachigkeit: Zahlenreihen, Summen und technische Schluessel sind
// locale-unabhaengig und bleiben unveraendert exportiert. Nur Beschriftungen
// (label, sensor, period, Einordnungen) liegen als `Lokalisiert` vor und
// werden ueber `...Fuer(locale)`-Accessoren aufgeloest.

/** Wert, der in beiden Sprachen identisch bleibt (Eigenname, Einheitenzeichen). */
const gleich = (s: string): Lokalisiert => ({ de: s, en: s });

/** Geraetename ist ein Eigenname (E6) und wird nie uebersetzt. */
export const wearableGeraet = "Apple Watch Series 12";

const letzteSyncQuelle: Lokalisiert = { de: "heute, 06:42 Uhr", en: "today, 06:42" };

/** Zeitpunkt der letzten Synchronisierung in der gewaehlten Sprache. */
export function letzteSyncFuer(locale: Locale): string {
  return letzteSyncQuelle[locale];
}

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

/** Quellform eines Streams: nur die Beschriftungen sind lokalisiert. */
interface WearableStreamQuelle extends Omit<WearableStream, "label" | "unit" | "sensor" | "period"> {
  label: Lokalisiert;
  unit: Lokalisiert;
  sensor: Lokalisiert;
  period: Lokalisiert;
}

const streamQuellen: WearableStreamQuelle[] = [
  {
    id: "wb-schlaf",
    metric: "schlafdauer",
    label: { de: "Schlafdauer", en: "Sleep duration" },
    unit: gleich("h"),
    series: reihe(schlafStunden),
    sensor: {
      de: "Schlafsensor (Apple Watch Series 12)",
      en: "Sleep sensor (Apple Watch Series 12)",
    },
    period: { de: "letzte 14 Tage", en: "last 14 days" },
    trend: "schwankend",
    sourceKey: "wearable-schlaf",
    synthetic: true,
  },
  {
    id: "wb-ruhepuls",
    metric: "ruhepuls",
    label: { de: "Ruhepuls", en: "Resting heart rate" },
    unit: gleich("bpm"),
    series: reihe(ruhepuls30.slice(-14)),
    sensor: { de: "optischer Pulssensor", en: "optical heart rate sensor" },
    period: { de: "letzte 30 Tage", en: "last 30 days" },
    trend: "stabil",
    sourceKey: "wearable-puls",
    synthetic: true,
  },
  {
    id: "wb-hrv",
    metric: "hrv",
    label: gleich("HRV"),
    unit: gleich("ms"),
    series: reihe(hrv14),
    sensor: { de: "optischer Pulssensor", en: "optical heart rate sensor" },
    period: { de: "letzte 14 Tage", en: "last 14 days" },
    trend: "schwankend",
    sourceKey: "wearable-hrv",
    synthetic: true,
  },
  {
    id: "wb-aktivitaet",
    metric: "schritte",
    label: { de: "Aktivität (Schritte)", en: "Activity (steps)" },
    unit: { de: "Schritte", en: "steps" },
    series: reihe(schritte14),
    sensor: { de: "Beschleunigungssensor", en: "accelerometer" },
    period: { de: "letzte 14 Tage", en: "last 14 days" },
    trend: "steigend",
    sourceKey: "wearable-aktivitaet",
    synthetic: true,
  },
];

function aufloesenStream(q: WearableStreamQuelle, locale: Locale): WearableStream {
  return {
    ...q,
    label: q.label[locale],
    unit: q.unit[locale],
    sensor: q.sensor[locale],
    period: q.period[locale],
  };
}

/** Locale-unabhaengige Stream-IDs (Validierung, DF11-Zuordnung). */
export const wearableStreamIds: string[] = streamQuellen.map((q) => q.id);

/** Alle Wearable-Streams in der gewaehlten Sprache. */
export function wearableStreamsFuer(locale: Locale): WearableStream[] {
  return streamQuellen.map((q) => aufloesenStream(q, locale));
}

/** Ein Wearable-Stream nach id in der gewaehlten Sprache. */
export function wearableStreamFuer(id: string, locale: Locale): WearableStream | undefined {
  const q = streamQuellen.find((x) => x.id === id);
  return q ? aufloesenStream(q, locale) : undefined;
}

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

// ── Arztrelevante Wearable-Kennzahlen (für den Arztexport) ─────────────────
// Apple Watch Series 12. Illustratives Profil (synthetic).

/** Atemfrequenz Tagesmittel (Atemzüge/min), letzte 7 Tage. */
export const atemfrequenzTag7 = [16.1, 15.8, 16.4, 15.9, 16.2, 15.7, 16.0];
/** Ø Atemfrequenz (Norm 12–20). */
export const atemfrequenzSchnitt = 16.0;

/** Hauttemperatur: Baseline (°C) + relative Abweichung der letzten 14 Nächte. */
export const hauttemperaturBaseline = 36.4;
export const hauttemperatur14 = [
  -0.1, 0.0, -0.2, 0.3, -0.1, 0.0, -0.1, 0.1, -0.2, 0.0, 0.2, -0.1, 0.0, -0.1,
];

/** VO2max aus Laufanalyse (Apple Watch Series 12). */
export interface Vo2Max {
  wert: number;
  einheit: string;
  trend3Monate: string;
  einordnung: string;
  normGut: string;
}

const vo2maxQuelle = {
  wert: 38,
  einheit: gleich("ml/kg/min"),
  // F14: Dezimalkomma -> Dezimalpunkt.
  trend3Monate: { de: "stabil (+0,5)", en: "stable (+0.5)" },
  einordnung: { de: "Gut (Frauen 25–29 Jahre)", en: "Good (women aged 25-29)" },
  normGut: { de: "35–43 ml/kg/min", en: "35-43 ml/kg/min" },
};

export function vo2maxFuer(locale: Locale): Vo2Max {
  return {
    wert: vo2maxQuelle.wert,
    einheit: vo2maxQuelle.einheit[locale],
    trend3Monate: vo2maxQuelle.trend3Monate[locale],
    einordnung: vo2maxQuelle.einordnung[locale],
    normGut: vo2maxQuelle.normGut[locale],
  };
}

/** @deprecated Uebergangsalias fuer noch nicht migrierte Aufrufer: vo2maxFuer(locale). */
export const vo2max: Vo2Max = vo2maxFuer("de");

export interface HerzfrequenzZone {
  zone: number;
  bereich: string;
  label: string;
  minuten: number;
}

interface HerzfrequenzZoneQuelle extends Omit<HerzfrequenzZone, "bereich" | "label"> {
  bereich: Lokalisiert;
  label: Lokalisiert;
}

/** Herzfrequenzzonen, Trainingsminuten der letzten 30 Tage. */
const herzfrequenzZonenQuellen: HerzfrequenzZoneQuelle[] = [
  { zone: 1, bereich: gleich("< 114 BPM"), label: { de: "Erholung", en: "Recovery" }, minuten: 180 },
  {
    zone: 2,
    bereich: { de: "114–133 BPM", en: "114-133 BPM" },
    label: { de: "Grundlage", en: "Base" },
    minuten: 520,
  },
  {
    zone: 3,
    bereich: { de: "133–152 BPM", en: "133-152 BPM" },
    label: { de: "Aerob", en: "Aerobic" },
    minuten: 310,
  },
  {
    zone: 4,
    bereich: { de: "152–171 BPM", en: "152-171 BPM" },
    label: { de: "Anaerob", en: "Anaerobic" },
    minuten: 180,
  },
  { zone: 5, bereich: gleich("> 171 BPM"), label: { de: "Maximal", en: "Maximum" }, minuten: 45 },
];

export function herzfrequenzZonenFuer(locale: Locale): HerzfrequenzZone[] {
  return herzfrequenzZonenQuellen.map((z) => ({
    zone: z.zone,
    bereich: z.bereich[locale],
    label: z.label[locale],
    minuten: z.minuten,
  }));
}

/** Aktivitätsverteilung über den Tag. */
export interface AktivitaetTagesverlauf {
  aktivsteStunde: string;
  aktivsteSchritte: number;
  inaktivstePhase: string;
  inaktivsteSchritte: number;
  sitzdauerArbeitstag: number;
}

const aktivitaetTagesverlaufQuelle = {
  // F14: deutsche Uhrzeitspanne "12:00–13:00 Uhr" -> "12:00-13:00".
  aktivsteStunde: { de: "12:00–13:00 Uhr", en: "12:00-13:00" },
  aktivsteSchritte: 1240,
  inaktivstePhase: { de: "14:00–17:00 Uhr", en: "14:00-17:00" },
  inaktivsteSchritte: 180,
  sitzdauerArbeitstag: 6.2,
};

export function aktivitaetTagesverlaufFuer(locale: Locale): AktivitaetTagesverlauf {
  return {
    aktivsteStunde: aktivitaetTagesverlaufQuelle.aktivsteStunde[locale],
    aktivsteSchritte: aktivitaetTagesverlaufQuelle.aktivsteSchritte,
    inaktivstePhase: aktivitaetTagesverlaufQuelle.inaktivstePhase[locale],
    inaktivsteSchritte: aktivitaetTagesverlaufQuelle.inaktivsteSchritte,
    sitzdauerArbeitstag: aktivitaetTagesverlaufQuelle.sitzdauerArbeitstag,
  };
}

/** Stand-Up-Erinnerungen (Apple Watch Series 12): Anteil erfüllter Tage (Ziel 1×/Stunde). */
export const standUpErfuellt = 68;

/** Kalorienverbrauch (Tagesmittel) - reine Zahlen, locale-unabhaengig. */
export const kalorien = {
  gesamt: 2180,
  aktiv: 380,
  ruheumsatz: 1800,
} as const;

/** Menstruationszyklus (optional, aus Health-App-Sync). */
export interface Menstruationszyklus {
  letzterBeginn: string;
  zyklusLaengeSchnitt: number;
  spanneLetzte6: string;
  naechsterErwartet: string;
  symptome: string;
}

const menstruationszyklusQuelle = {
  letzterBeginn: "2026-06-05",
  zyklusLaengeSchnitt: 28,
  spanneLetzte6: { de: "27–29 Tage", en: "27-29 days" },
  naechsterErwartet: "2026-07-03",
  symptome: {
    de: "leichte Krämpfe Tag 1–2, kein PMS",
    en: "mild cramps on days 1-2, no PMS",
  },
};

export function menstruationszyklusFuer(locale: Locale): Menstruationszyklus {
  return {
    letzterBeginn: menstruationszyklusQuelle.letzterBeginn,
    zyklusLaengeSchnitt: menstruationszyklusQuelle.zyklusLaengeSchnitt,
    spanneLetzte6: menstruationszyklusQuelle.spanneLetzte6[locale],
    naechsterErwartet: menstruationszyklusQuelle.naechsterErwartet,
    symptome: menstruationszyklusQuelle.symptome[locale],
  };
}

/** Stressverteilung über die Woche (aus HRV, 0–100). */
export interface StressTag {
  tag: string;
  wert: number;
}

const stressWocheQuellen: { tag: Lokalisiert; wert: number }[] = [
  { tag: { de: "Mo", en: "Mon" }, wert: 45 },
  { tag: { de: "Di", en: "Tue" }, wert: 38 },
  { tag: { de: "Mi", en: "Wed" }, wert: 41 },
  { tag: { de: "Do", en: "Thu" }, wert: 52 },
  { tag: { de: "Fr", en: "Fri" }, wert: 35 },
  { tag: { de: "Sa", en: "Sat" }, wert: 28 },
  { tag: { de: "So", en: "Sun" }, wert: 29 },
];

/** Locale-unabhaengige Stresswerte in Wochenreihenfolge (Mo-So). */
export const stressWocheWerte: number[] = stressWocheQuellen.map((s) => s.wert);

export function stressWocheFuer(locale: Locale): StressTag[] {
  return stressWocheQuellen.map((s) => ({ tag: s.tag[locale], wert: s.wert }));
}

const stressSpitzeQuelle: Lokalisiert = {
  de: "Donnerstag (52) – konsistent mit der schlechtesten Schlafnacht.",
  en: "Thursday (52) - this matches the worst night of sleep.",
};

export function stressSpitzeFuer(locale: Locale): string {
  return stressSpitzeQuelle[locale];
}

// ── Geräte-Status (für Home-Sektion „Verbundene Geräte") ──────────────────

export interface GeraeteStatus {
  appleWatch: {
    modell: string;
    akkuProzent: number;
    status: string;
    letzteSync: string;
    naechsteSync: string;
    amHandgelenk: boolean;
    synthetic: true;
  };
  epa: {
    anbieter: string;
    status: string;
    letzteSync: string;
    naechsteSync: string;
    verfuegbareDaten: readonly string[];
    synthetic: true;
  };
}

const geraeteQuelle = {
  appleWatch: {
    // Eigenname (E6).
    modell: "Apple Watch Series 12",
    akkuProzent: 73,
    status: { de: "verbunden", en: "connected" },
    letzteSync: { de: "vor 2 Stunden", en: "2 hours ago" },
    naechsteSync: { de: "in 14 Stunden", en: "in 14 hours" },
    amHandgelenk: true,
  },
  epa: {
    // Eigenname (E6).
    anbieter: "AOK Rheinland/Hamburg",
    status: { de: "verbunden", en: "connected" },
    letzteSync: { de: "vor 10 Stunden", en: "10 hours ago" },
    naechsteSync: { de: "in 14 Stunden", en: "in 14 hours" },
    // Technische Schluessel, nicht uebersetzt.
    verfuegbareDaten: ["laborwerte", "vitalwerte", "impfungen"] as const,
  },
};

export function geraeteFuer(locale: Locale): GeraeteStatus {
  const { appleWatch, epa } = geraeteQuelle;
  return {
    appleWatch: {
      modell: appleWatch.modell,
      akkuProzent: appleWatch.akkuProzent,
      status: appleWatch.status[locale],
      letzteSync: appleWatch.letzteSync[locale],
      naechsteSync: appleWatch.naechsteSync[locale],
      amHandgelenk: appleWatch.amHandgelenk,
      synthetic: true,
    },
    epa: {
      anbieter: epa.anbieter,
      status: epa.status[locale],
      letzteSync: epa.letzteSync[locale],
      naechsteSync: epa.naechsteSync[locale],
      verfuegbareDaten: epa.verfuegbareDaten,
      synthetic: true,
    },
  };
}

/** @deprecated Uebergangsalias fuer noch nicht migrierte Aufrufer: geraeteFuer(locale). */
export const geraete: GeraeteStatus = geraeteFuer("de");

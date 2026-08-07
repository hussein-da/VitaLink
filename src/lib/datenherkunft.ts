import type { Datenherkunft } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

/**
 * Zentrale Quelle der Wahrheit für die Datenherkunft (DF5/DF6). Jeder in der App
 * gezeigte Datenpunkt verweist per `herkunftId` hierher — so bleiben Quelle,
 * Datum, Zeitraum und Sensorart an EINER Stelle gepflegt und konsistent mit
 * epa.ts / wearable.ts / profile.ts. Werte sind synthetisch (Studienprofil Mara K.).
 *
 * Zweisprachigkeit: `id` und `typ` sind technische Schlüssel und bleiben
 * unverändert. Praxis-, Labor- und Gerätebezeichnungen sind Eigennamen und in
 * beiden Sprachfassungen identisch. Datumsliterale sind bewusst als Text
 * hinterlegt (kuratierte Demo-Daten) und werden pro Sprache formatiert:
 * de "12.03.2026" → en "12 March 2026".
 */

/** Lokalisierte Quellform eines Herkunfts-Eintrags. */
interface DatenherkunftQuelle
  extends Omit<Datenherkunft, "quelle" | "datum" | "zeitraum" | "sensorart" | "beschreibung"> {
  quelle: Lokalisiert;
  datum?: Lokalisiert;
  zeitraum?: Lokalisiert;
  sensorart?: Lokalisiert;
  beschreibung?: Lokalisiert;
}

/** Eigenname — in beiden Sprachfassungen identisch. */
const eigenname = (s: string): Lokalisiert => ({ de: s, en: s });

// Konstante Quellen-Bezeichnungen (nicht doppelt tippen). Alles Eigennamen.
const LABOR = eigenname("Labor MVZ Bochum");
const HAUSARZT = eigenname("Hausarztpraxis Dr. Koch, Bochum");
const ZAHNARZT = eigenname("Zahnarztpraxis Dr. Maier, Bochum-Innenstadt");
const APPLE = eigenname("Apple Watch Series 12");

// Datumsliteral des Laborbefunds (F14: 12.03.2026 = 12. März 2026).
const LABORDATUM: Lokalisiert = { de: "12.03.2026", en: "12 March 2026" };

// Wiederkehrende Zeiträume.
const T7: Lokalisiert = { de: "letzte 7 Tage", en: "last 7 days" };
const T14: Lokalisiert = { de: "letzte 14 Tage", en: "last 14 days" };
const T30: Lokalisiert = { de: "letzte 30 Tage", en: "last 30 days" };

// Wiederkehrende Sensorarten.
const S_SCHLAF: Lokalisiert = { de: "Schlafsensor", en: "sleep sensor" };
const S_PULS: Lokalisiert = { de: "optischer Pulssensor", en: "optical heart rate sensor" };
const S_BESCHLEUNIGUNG: Lokalisiert = { de: "Beschleunigungssensor", en: "accelerometer" };

const quellen: DatenherkunftQuelle[] = [
  // ── ePA · Laborwerte (Labor MVZ Bochum, 12.03.2026) ──
  { id: "vitamin-d", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "ferritin", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "cholesterin", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "hba1c", typ: "epa", quelle: LABOR, datum: LABORDATUM },
  { id: "nuechternblutzucker", typ: "epa", quelle: LABOR, datum: LABORDATUM },

  // ── ePA · Vitalwerte / Vorsorge / Impfungen ──
  {
    id: "blutdruck",
    typ: "epa",
    quelle: HAUSARZT,
    datum: LABORDATUM,
    zeitraum: { de: "6-Monats-Messreihe", en: "6-month series of readings" },
  },
  { id: "gewicht", typ: "epa", quelle: HAUSARZT, datum: LABORDATUM },
  {
    id: "bmi",
    typ: "epa",
    quelle: {
      de: "Berechnet aus Gewicht & Körpergröße (ePA)",
      en: "Calculated from weight & height (ePA)",
    },
    datum: LABORDATUM,
  },
  {
    id: "vitamin-d-praeparat",
    typ: "epa",
    quelle: { de: "ePA-Medikationsplan", en: "ePA medication plan" },
    datum: { de: "seit 15.01.2026", en: "since 15 January 2026" },
  },
  {
    id: "zahnarzt",
    typ: "epa",
    quelle: ZAHNARZT,
    datum: { de: "27.01.2026", en: "27 January 2026" },
  },
  {
    id: "tetanus",
    typ: "epa",
    quelle: HAUSARZT,
    datum: { de: "20.08.2017", en: "20 August 2017" },
  },
  {
    id: "hepatitis-a",
    typ: "epa",
    quelle: { de: "ePA-Impfstatus — kein Eintrag", en: "ePA vaccination status - no entry" },
  },
  {
    id: "hepatitis-b",
    typ: "epa",
    quelle: { de: "ePA-Impfstatus — kein Eintrag", en: "ePA vaccination status - no entry" },
  },

  // ── Wearable · Apple Watch Series 12 ──
  { id: "schlafdauer", typ: "wearable", quelle: APPLE, sensorart: S_SCHLAF, zeitraum: T14 },
  { id: "tiefschlaf", typ: "wearable", quelle: APPLE, sensorart: S_SCHLAF, zeitraum: T14 },
  { id: "schlafscore", typ: "wearable", quelle: APPLE, sensorart: S_SCHLAF, zeitraum: T14 },
  { id: "hrv", typ: "wearable", quelle: APPLE, sensorart: S_PULS, zeitraum: T14 },
  { id: "ruhepuls", typ: "wearable", quelle: APPLE, sensorart: S_PULS, zeitraum: T30 },
  { id: "hf-zonen", typ: "wearable", quelle: APPLE, sensorart: S_PULS, zeitraum: T30 },
  {
    id: "spo2",
    typ: "wearable",
    quelle: APPLE,
    sensorart: S_PULS,
    zeitraum: { de: "Wochenschnitt", en: "weekly average" },
  },
  { id: "atemfrequenz", typ: "wearable", quelle: APPLE, sensorart: S_PULS, zeitraum: T7 },
  {
    id: "stress",
    typ: "wearable",
    quelle: APPLE,
    sensorart: {
      de: "optischer Pulssensor (HRV)",
      en: "optical heart rate sensor (HRV)",
    },
    zeitraum: T7,
  },
  {
    id: "vo2max",
    typ: "wearable",
    quelle: APPLE,
    sensorart: { de: "Laufanalyse", en: "running analysis" },
    zeitraum: { de: "3-Monats-Trend", en: "3-month trend" },
  },
  {
    id: "hauttemperatur",
    typ: "wearable",
    quelle: APPLE,
    sensorart: { de: "Hauttemperatursensor", en: "skin temperature sensor" },
    zeitraum: { de: "letzte 14 Nächte", en: "last 14 nights" },
  },
  { id: "schritte", typ: "wearable", quelle: APPLE, sensorart: S_BESCHLEUNIGUNG, zeitraum: T14 },
  {
    id: "aktive-minuten",
    typ: "wearable",
    quelle: APPLE,
    sensorart: S_BESCHLEUNIGUNG,
    zeitraum: T14,
  },
  { id: "trainings", typ: "wearable", quelle: APPLE, sensorart: S_BESCHLEUNIGUNG, zeitraum: T7 },
  {
    id: "kalorien",
    typ: "wearable",
    quelle: APPLE,
    sensorart: S_BESCHLEUNIGUNG,
    zeitraum: { de: "Tagesmittel", en: "daily average" },
  },

  // ── Wearable · Apple Watch Series 12 (Glukose-Trendindikator) ──
  {
    id: "glukose",
    typ: "wearable",
    quelle: APPLE,
    sensorart: { de: "optischer Glukosesensor", en: "optical glucose sensor" },
    zeitraum: T14,
  },

  // ── Nutzereingabe ──
  {
    id: "reiseziel",
    typ: "nutzereingabe",
    quelle: { de: "Deine Reiseplanung", en: "Your travel planning" },
    datum: { de: "Abreise 15.08.2026", en: "Departure 15 August 2026" },
  },

  // ── VitaLink-KI · dritte, verknüpfende Herkunftsebene (nur an Empfehlungen) ──
  {
    id: "vitalink-ki",
    typ: "vitalink-ki",
    quelle: { de: "VitaLink-KI", en: "VitaLink AI" },
    beschreibung: {
      de: "kombiniert deine ePA- und Apple-Watch-Daten zu einer personalisierten Empfehlung",
      en: "combines your ePA and Apple Watch data into a recommendation made for you",
    },
  },
];

function aufloesen(q: DatenherkunftQuelle, locale: Locale): Datenherkunft {
  const out: Datenherkunft = { id: q.id, typ: q.typ, quelle: q.quelle[locale] };
  if (q.datum) out.datum = q.datum[locale];
  if (q.zeitraum) out.zeitraum = q.zeitraum[locale];
  if (q.sensorart) out.sensorart = q.sensorart[locale];
  if (q.beschreibung) out.beschreibung = q.beschreibung[locale];
  return out;
}

/** Locale-unabhängige ID-Liste (Validierung, Verweis-Prüfung). */
export const datenherkunftIds: string[] = quellen.map((q) => q.id);

/**
 * Locale-unabhängiger Typ je Herkunfts-id. Für Aufrufer, die nur die Ebene
 * (epa / wearable / nutzereingabe / vitalink-ki) brauchen und keine Sprache.
 */
export const datenherkunftTyp: Record<string, Datenherkunft["typ"]> = Object.fromEntries(
  quellen.map((q) => [q.id, q.typ]),
);

/** Schnellzugriff nach id in der gewünschten Sprache. */
export function datenherkunftFuer(locale: Locale): Record<string, Datenherkunft> {
  return Object.fromEntries(quellen.map((q) => [q.id, aufloesen(q, locale)]));
}

/**
 * Auflösen einer id-Liste → gültige Datenherkunft-Einträge (ungültige werden
 * verworfen). `locale` ist optional, damit noch nicht migrierte Aufrufer
 * weiterhin die deutsche Fassung erhalten.
 */
export function herkunftFuer(
  ids: (string | undefined)[],
  locale: Locale = "de",
): Datenherkunft[] {
  const seen = new Set<string>();
  const out: Datenherkunft[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    const q = quellen.find((x) => x.id === id);
    if (q) {
      seen.add(id);
      out.push(aufloesen(q, locale));
    }
  }
  return out;
}

/**
 * Deutsche Auflösung als Vorgabe — für Aufrufer, die noch keine Locale reichen.
 * Neue Aufrufer nutzen `datenherkunftFuer(locale)` bzw. `datenherkunftTyp`.
 */
export const datenherkunft: Record<string, Datenherkunft> = datenherkunftFuer("de");

import type { DataSourceKey } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

export interface DataSourceInfo {
  key: DataSourceKey;
  gruppe: "ePA" | "Wearable";
  label: string;
  beschreibung: string;
}

/** Lokalisierte Quellform eines Registry-Eintrags. */
interface DataSourceQuelle extends Omit<DataSourceInfo, "label" | "beschreibung"> {
  label: Lokalisiert;
  beschreibung: Lokalisiert;
}

// Registry aller granularen Datenquellen (DF11): pro ePA-Kategorie und pro Wearable-Stream.
// `key` und `gruppe` sind technische Schlüssel und bleiben unübersetzt.
const quellen: DataSourceQuelle[] = [
  {
    key: "epa-vitalwerte",
    gruppe: "ePA",
    label: { de: "Vitalwerte (z. B. Blutdruck)", en: "Vital signs (e.g. blood pressure)" },
    beschreibung: {
      de: "Aus der elektronischen Patientenakte, z. B. Blutdruckmessungen.",
      en: "From your electronic patient record (ePA), for example blood pressure readings.",
    },
  },
  {
    key: "epa-labor",
    gruppe: "ePA",
    label: { de: "Laborwerte (z. B. Cholesterin)", en: "Lab results (e.g. cholesterol)" },
    beschreibung: {
      de: "Laborbefunde aus der elektronischen Patientenakte.",
      en: "Lab results from your ePA.",
    },
  },
  {
    key: "epa-impfungen",
    gruppe: "ePA",
    label: { de: "Impfungen", en: "Vaccinations" },
    beschreibung: {
      de: "Impfeinträge und Auffrischungen aus der elektronischen Patientenakte.",
      en: "Vaccination entries and boosters from your ePA.",
    },
  },
  {
    key: "wearable-schlaf",
    gruppe: "Wearable",
    label: { de: "Schlaf", en: "Sleep" },
    beschreibung: {
      de: "Schlafdauer vom Schlafsensor der Apple Watch Series 12.",
      en: "Sleep duration from the sleep sensor on your Apple Watch Series 12.",
    },
  },
  {
    key: "wearable-puls",
    gruppe: "Wearable",
    label: { de: "Ruhepuls", en: "Resting heart rate" },
    beschreibung: {
      de: "Ruhepuls vom optischen Pulssensor.",
      en: "Resting heart rate from the optical heart rate sensor.",
    },
  },
  {
    key: "wearable-hrv",
    gruppe: "Wearable",
    label: { de: "HRV", en: "HRV" },
    beschreibung: {
      de: "Herzfrequenzvariabilität vom optischen Pulssensor.",
      en: "Heart rate variability from the optical heart rate sensor.",
    },
  },
  {
    key: "wearable-aktivitaet",
    gruppe: "Wearable",
    label: { de: "Aktivität", en: "Activity" },
    beschreibung: {
      de: "Schritte und Bewegung vom Beschleunigungssensor.",
      en: "Steps and movement from the accelerometer.",
    },
  },
  {
    key: "wearable-glukose",
    gruppe: "Wearable",
    label: { de: "Glukose", en: "Glucose" },
    beschreibung: {
      de: "Kontinuierlicher Gewebezucker-Trendindikator der Apple Watch Series 12.",
      en: "Continuous tissue glucose trend indicator from your Apple Watch Series 12.",
    },
  },
  {
    key: "epa-vorsorge",
    gruppe: "ePA",
    label: { de: "Vorsorge", en: "Preventive care" },
    beschreibung: {
      de: "Vorsorge- und Zahnarzttermine aus der elektronischen Patientenakte.",
      en: "Preventive care and dental appointments from your ePA.",
    },
  },
];

function aufloesen(q: DataSourceQuelle, locale: Locale): DataSourceInfo {
  return { ...q, label: q.label[locale], beschreibung: q.beschreibung[locale] };
}

/**
 * Locale-UNABHÄNGIGE Struktur der Registry (Schlüssel + Gruppe).
 * Für Module ohne Sprachkontext (z. B. SettingsContext) — dort darf nie ein
 * Accessor mit Locale nötig sein.
 */
export const dataSourceRefs: { key: DataSourceKey; gruppe: "ePA" | "Wearable" }[] = quellen.map(
  (q) => ({ key: q.key, gruppe: q.gruppe }),
);

/** Alle Schlüssel in Registry-Reihenfolge (locale-unabhängig). */
export const dataSourceKeys: DataSourceKey[] = quellen.map((q) => q.key);

/** Schlüssel je Gruppe (locale-unabhängig, Single Source of Truth für SET-03). */
export const epaSourceKeys: DataSourceKey[] = quellen
  .filter((q) => q.gruppe === "ePA")
  .map((q) => q.key);
export const wearableSourceKeys: DataSourceKey[] = quellen
  .filter((q) => q.gruppe === "Wearable")
  .map((q) => q.key);

/** Registry in der gewünschten Sprache. */
export function dataSourcesFuer(locale: Locale): DataSourceInfo[] {
  return quellen.map((q) => aufloesen(q, locale));
}

/** Anzeigename einer Datenquelle in der gewünschten Sprache. */
export function dataSourceLabelFuer(key: DataSourceKey, locale: Locale): string {
  const q = quellen.find((x) => x.key === key);
  return q ? q.label[locale] : key;
}

/** Beschreibung einer Datenquelle in der gewünschten Sprache. */
export function dataSourceBeschreibungFuer(key: DataSourceKey, locale: Locale): string {
  const q = quellen.find((x) => x.key === key);
  return q ? q.beschreibung[locale] : "";
}

/**
 * Deutsche Auflösung als Vorgabe — für Aufrufer, die noch keine Locale reichen.
 * Neue Aufrufer nutzen `dataSourcesFuer(locale)`.
 */
export const dataSources: DataSourceInfo[] = dataSourcesFuer("de");

export const dataSourceMap: Record<DataSourceKey, DataSourceInfo> = Object.fromEntries(
  dataSources.map((d) => [d.key, d]),
) as Record<DataSourceKey, DataSourceInfo>;

/** Deutscher Anzeigename (Vorgabe). Neue Aufrufer nutzen `dataSourceLabelFuer`. */
export function dataSourceLabel(key: DataSourceKey): string {
  return dataSourceMap[key]?.label ?? key;
}

/**
 * Zentrale, zweisprachige Herkunfts-Beschriftung (eine Quelle der Wahrheit).
 * Wird app-weit für das „Datenherkunft"-Tag genutzt (TerminRow, Karten etc.),
 * statt die Zeichenkette an mehreren Stellen eigen zu rendern.
 */
export function herkunftLabel(quelle: "epa" | "wearable" | "reiseplanung"): Lokalisiert {
  switch (quelle) {
    case "epa":
      return { de: "Aus deiner ePA", en: "From your ePA" };
    case "reiseplanung":
      return { de: "Aus deiner Reiseplanung", en: "From your travel planning" };
    default:
      return { de: "Vom Wearable", en: "From your wearable" };
  }
}

/** Herkunfts-Beschriftung direkt in der gewünschten Sprache. */
export function herkunftLabelFuer(
  quelle: "epa" | "wearable" | "reiseplanung",
  locale: Locale,
): string {
  return herkunftLabel(quelle)[locale];
}

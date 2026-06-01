import type { DataSourceKey } from "@/lib/types";

export interface DataSourceInfo {
  key: DataSourceKey;
  gruppe: "ePA" | "Wearable";
  label: string;
  beschreibung: string;
}

// Registry aller granularen Datenquellen (DF11): pro ePA-Kategorie und pro Wearable-Stream.
export const dataSources: DataSourceInfo[] = [
  {
    key: "epa-vitalwerte",
    gruppe: "ePA",
    label: "Vitalwerte (z. B. Blutdruck)",
    beschreibung: "Aus der elektronischen Patientenakte, z. B. Blutdruckmessungen.",
  },
  {
    key: "epa-labor",
    gruppe: "ePA",
    label: "Laborwerte (z. B. Cholesterin)",
    beschreibung: "Laborbefunde aus der elektronischen Patientenakte.",
  },
  {
    key: "epa-impfungen",
    gruppe: "ePA",
    label: "Impfungen",
    beschreibung: "Impfeintraege und Auffrischungen aus der elektronischen Patientenakte.",
  },
  {
    key: "wearable-schlaf",
    gruppe: "Wearable",
    label: "Schlaf",
    beschreibung: "Schlafdauer vom Schlafsensor der Smartwatch.",
  },
  {
    key: "wearable-puls",
    gruppe: "Wearable",
    label: "Ruhepuls",
    beschreibung: "Ruhepuls vom optischen Pulssensor.",
  },
  {
    key: "wearable-hrv",
    gruppe: "Wearable",
    label: "HRV",
    beschreibung: "Herzfrequenzvariabilitaet vom optischen Pulssensor.",
  },
  {
    key: "wearable-aktivitaet",
    gruppe: "Wearable",
    label: "Aktivitaet",
    beschreibung: "Schritte und Bewegung vom Beschleunigungssensor.",
  },
];

export const dataSourceMap: Record<DataSourceKey, DataSourceInfo> = Object.fromEntries(
  dataSources.map((d) => [d.key, d]),
) as Record<DataSourceKey, DataSourceInfo>;

export function dataSourceLabel(key: DataSourceKey): string {
  return dataSourceMap[key]?.label ?? key;
}

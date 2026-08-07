// VitaLink — Normwert-Einordnung (Badge 2.4, Block 5).
// Neutrale Wort-Labels statt Zahlen-Alarm. KEIN Alarmrot, kein "Kritisch".
//
// Zweisprachigkeit: `NormStatus` ist ein technischer Schlüssel und bleibt
// unverändert. Übersetzt wird nur die Beschriftung; die CSS-Klassen sind
// davon getrennt, damit sie nie in eine Sprachfassung geraten.

import type { Lokalisiert, Locale } from "@/i18n/types";

export type NormStatus = "normal" | "niedrig" | "erhoeht";

/** Locale-unabhängige Liste aller Status-Schlüssel. */
export const normStatusKeys: NormStatus[] = ["normal", "niedrig", "erhoeht"];

/** Ordnet einen Wert gegen einen Referenzbereich ein (min/max optional). */
export function normLabel(wert: number, min?: number, max?: number): NormStatus {
  if (min != null && wert < min) return "niedrig";
  if (max != null && wert > max) return "erhoeht";
  return "normal";
}

/** Chip-Klassen je Status — rein technisch, keine Locale. */
export const NORM_CHIP_CLASS: Record<NormStatus, string> = {
  normal: "bg-status-ok-light text-status-ok",
  niedrig: "bg-status-info-light text-status-info",
  erhoeht: "bg-status-warn-light text-status-warn",
};

const NORM_LABEL: Record<NormStatus, Lokalisiert> = {
  normal: { de: "Normbereich", en: "Usual range" },
  niedrig: { de: "Etwas niedrig", en: "Slightly low" },
  erhoeht: { de: "Etwas erhöht", en: "Slightly raised" },
};

/** Beschriftung eines Status in der gewünschten Sprache. */
export function normLabelTextFuer(status: NormStatus, locale: Locale): string {
  return NORM_LABEL[status][locale];
}

/** Beschriftung + Chip-Klassen in der gewünschten Sprache. */
export function normMetaFuer(
  status: NormStatus,
  locale: Locale,
): { label: string; chipClass: string } {
  return { label: NORM_LABEL[status][locale], chipClass: NORM_CHIP_CLASS[status] };
}

/**
 * Deutsche Auflösung als Vorgabe — für Aufrufer, die noch keine Locale reichen.
 * Neue Aufrufer nutzen `normMetaFuer(status, locale)`.
 */
export const NORM_META: Record<NormStatus, { label: string; chipClass: string }> =
  Object.fromEntries(
    normStatusKeys.map((s) => [s, normMetaFuer(s, "de")]),
  ) as Record<NormStatus, { label: string; chipClass: string }>;

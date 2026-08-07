import type { ObjectionReason } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

// Die drei vordefinierten Widerspruchsgründe (DF12).
// WICHTIG: Die `value`-Schlüssel stehen in gespeicherten Nutzerdaten
// (localStorage: vitalink.settings.v1) und dürfen NIE übersetzt oder umbenannt
// werden — nur die Beschriftung ist zweisprachig.
const quellen: { value: ObjectionReason; label: Lokalisiert }[] = [
  {
    value: "medizinisch-geklaert",
    label: { de: "Ist medizinisch bereits geklärt", en: "A doctor has already looked at this" },
  },
  {
    value: "persoenlich-anders",
    label: { de: "Bewerte ich persönlich anders", en: "I see this differently" },
  },
  {
    value: "technischer-fehler",
    label: { de: "Beruht auf einem technischen Fehler", en: "This is based on a technical error" },
  },
];

/**
 * Locale-UNABHÄNGIGE Schlüsselliste. Wird u. a. im SettingsContext zur
 * Validierung gespeicherter Rückmeldungen genutzt — dort darf nie ein Accessor
 * mit Locale nötig sein.
 */
export const objectionReasonValues: ObjectionReason[] = quellen.map((q) => q.value);

/** Die drei Gründe in der gewünschten Sprache. */
export function objectionReasonsFuer(
  locale: Locale,
): { value: ObjectionReason; label: string }[] {
  return quellen.map((q) => ({ value: q.value, label: q.label[locale] }));
}

/** Beschriftung eines Grundes in der gewünschten Sprache. */
export function objectionReasonLabelFuer(reason: ObjectionReason, locale: Locale): string {
  const q = quellen.find((x) => x.value === reason);
  return q ? q.label[locale] : reason;
}

/**
 * Deutsche Auflösung als Vorgabe — für Aufrufer, die noch keine Locale reichen.
 * Neue Aufrufer nutzen `objectionReasonsFuer(locale)`.
 */
export const objectionReasons: { value: ObjectionReason; label: string }[] =
  objectionReasonsFuer("de");

export const objectionReasonLabel: Record<ObjectionReason, string> = Object.fromEntries(
  objectionReasons.map((r) => [r.value, r.label]),
) as Record<ObjectionReason, string>;

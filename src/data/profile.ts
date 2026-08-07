import type { Profile } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

// Dargestellte Person der Nutzerstudie. Illustratives Profil (synthetic: true).
//
// Zweisprachigkeit: name, vorname, ort, versicherung und hausaerztin sind
// Eigennamen und bleiben in beiden Sprachstaenden identisch. Lokalisiert ist
// nur `note` (interne Kennzeichnung, derzeit nirgends gerendert) und
// `geschlecht`, das ueber `koerpermasse` weitergereicht wird.

interface ProfileQuelle extends Omit<Profile, "note" | "geschlecht"> {
  note: Lokalisiert;
  geschlecht: Lokalisiert;
}

const quelle: ProfileQuelle = {
  name: "Mara K.",
  vorname: "Mara",
  alter: 28,
  ort: "Bochum",
  geschlecht: { de: "weiblich", en: "female" },
  versicherung: "AOK Rheinland/Hamburg",
  hausaerztin: "Dr. med. Sabine Koch, Bochum",
  note: { de: "Profil der Nutzerstudie.", en: "User study persona." },
  synthetic: true,
};

export function profileFuer(locale: Locale): Profile {
  return { ...quelle, note: quelle.note[locale], geschlecht: quelle.geschlecht[locale] };
}

/**
 * Deutscher Sprachstand. Bewusst weiterhin als Konstante exportiert: alle
 * Felder, die in der UI erscheinen (name, vorname, ort, versicherung,
 * hausaerztin), sind Eigennamen und damit locale-unabhaengig.
 * Wer `note` oder `geschlecht` sprachrichtig braucht, nimmt `profileFuer(locale)`.
 */
export const profile: Profile = profileFuer("de");

// Anzeige-Vorname für die Begrüßung (Eigenname, locale-unabhängig).
export const vorname = quelle.vorname;

// Körperdaten (synthetisch, konsistent: 66,9 kg bei 171 cm → BMI 22,9).
// BMI = 66,9 / 1,71² = 22,9. Deckungsgleich mit dem Arztexport (Gewicht & BMI).
// Zahlenwerte sind roh; die Formatierung (de-DE bzw. en-GB) passiert in der UI
// über @/i18n/format.
export const koerpermasse = {
  gewichtKg: 66.9,
  groesseCm: 171,
  bmi: 22.9,
  /** Lokalisiert ({de,en}) — über `geschlechtFuer(locale)` auflösen. */
  geschlecht: quelle.geschlecht,
} as const;

/** Geschlecht im aktiven Sprachstand (die Rohdaten sind lokalisiert). */
export function geschlechtFuer(locale: Locale): string {
  return quelle.geschlecht[locale];
}

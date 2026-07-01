import type { Profile } from "@/lib/types";

// Dargestellte Person der Nutzerstudie. Illustratives Profil (synthetic: true).
export const profile: Profile = {
  name: "Mara K.",
  vorname: "Mara",
  alter: 28,
  ort: "Bochum",
  geschlecht: "weiblich",
  versicherung: "AOK Rheinland/Hamburg",
  hausaerztin: "Dr. med. Sabine Koch, Bochum",
  note: "Profil der Nutzerstudie.",
  synthetic: true,
};

// Anzeige-Vorname für die Begrüßung.
export const vorname = profile.vorname;

// Körperdaten (synthetisch, konsistent: 66,9 kg bei 171 cm → BMI 22,9).
// BMI = 66,9 / 1,71² = 22,9. Deckungsgleich mit dem Arztexport (Gewicht & BMI).
export const koerpermasse = {
  gewichtKg: 66.9,
  groesseCm: 171,
  bmi: 22.9,
  geschlecht: profile.geschlecht ?? "weiblich",
} as const;

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

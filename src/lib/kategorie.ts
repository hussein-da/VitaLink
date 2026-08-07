import { Moon, Heart, Plane, Droplets, CalendarCheck, Sun, type LucideIcon } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

/**
 * Visuelle Identität je Hinweis-Szenario (Farbe + Icon + Label) — eine Quelle
 * der Wahrheit, damit Dashboard-Karten, Detail-Hero und XAI-Steuerelemente
 * konsistent dieselbe Kategorie-Farbe tragen.
 *
 * Zweisprachigkeit: Nur `label` ist übersetzbar. Alle Tailwind-Klassenstrings,
 * `base` und die Icons sind technische Werte und bleiben unverändert.
 */
export interface KategorieIdentitaet {
  label: string;
  icon: LucideIcon;
  text: string;
  soft: string;
  solid: string;
  on: string;
  iconBg: string;
  base:
    | "cat-lifestyle"
    | "cat-cardio"
    | "cat-travel"
    | "cat-prevention"
    | "cat-metabolism"
    | "cat-vitamind";
}

type Szenario = Hinweis["szenario"];

/** Rein visueller Teil — vollständig locale-unabhängig. */
type KategorieStil = Omit<KategorieIdentitaet, "label">;

const STIL: Record<Szenario, KategorieStil> = {
  lifestyle: {
    icon: Moon,
    text: "text-cat-lifestyle",
    soft: "bg-cat-lifestyle-light",
    solid: "bg-cat-lifestyle",
    on: "text-cat-lifestyle-on",
    iconBg: "bg-cat-lifestyle/20",
    base: "cat-lifestyle",
  },
  kardiometabolisch: {
    icon: Heart,
    text: "text-cat-cardio",
    soft: "bg-cat-cardio-light",
    solid: "bg-cat-cardio",
    on: "text-cat-cardio-on",
    iconBg: "bg-cat-cardio/20",
    base: "cat-cardio",
  },
  reise: {
    icon: Plane,
    text: "text-cat-travel",
    soft: "bg-cat-travel-light",
    solid: "bg-cat-travel",
    on: "text-cat-travel-on",
    iconBg: "bg-cat-travel/20",
    base: "cat-travel",
  },
  stoffwechsel: {
    icon: Droplets,
    text: "text-cat-metabolism",
    soft: "bg-cat-metabolism-light",
    solid: "bg-cat-metabolism",
    on: "text-cat-metabolism-on",
    iconBg: "bg-cat-metabolism/20",
    base: "cat-metabolism",
  },
  vorsorge: {
    icon: CalendarCheck,
    text: "text-cat-prevention",
    soft: "bg-cat-prevention-light",
    solid: "bg-cat-prevention",
    on: "text-cat-prevention-on",
    iconBg: "bg-cat-prevention/20",
    base: "cat-prevention",
  },
  vitalitaet: {
    icon: Sun,
    text: "text-cat-vitamind",
    soft: "bg-cat-vitamind-light",
    solid: "bg-cat-vitamind",
    on: "text-cat-vitamind-on",
    iconBg: "bg-cat-vitamind/20",
    base: "cat-vitamind",
  },
};

const LABEL: Record<Szenario, Lokalisiert> = {
  lifestyle: { de: "Lifestyle", en: "Lifestyle" },
  kardiometabolisch: { de: "Herz-Kreislauf", en: "Heart & circulation" },
  reise: { de: "Reisevorsorge", en: "Travel health" },
  stoffwechsel: { de: "Stoffwechsel", en: "Metabolism" },
  vorsorge: { de: "Vorsorge", en: "Preventive care" },
  vitalitaet: { de: "Vitalität", en: "Vitality" },
};

/** Locale-unabhängige Liste aller Szenario-Schlüssel. */
export const kategorieSzenarien = Object.keys(STIL) as Szenario[];

/** Nur der visuelle Teil — braucht keine Locale. */
export function kategorieStil(szenario: Szenario): KategorieStil {
  return STIL[szenario];
}

/** Kategorie-Beschriftung in der gewünschten Sprache. */
export function kategorieLabelFuer(szenario: Szenario, locale: Locale): string {
  return LABEL[szenario][locale];
}

/** Vollständige Kategorie-Identität in der gewünschten Sprache. */
export function kategorieFuer(szenario: Szenario, locale: Locale): KategorieIdentitaet {
  return { label: LABEL[szenario][locale], ...STIL[szenario] };
}

/**
 * Deutsche Auflösung als Vorgabe — für Aufrufer, die noch keine Locale reichen.
 * Neue Aufrufer nutzen `kategorieFuer(szenario, locale)`.
 */
export function kategorie(szenario: Szenario): KategorieIdentitaet {
  return kategorieFuer(szenario, "de");
}

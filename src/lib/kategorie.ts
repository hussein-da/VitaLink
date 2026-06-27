import { Moon, Heart, Plane, type LucideIcon } from "lucide-react";
import type { Hinweis } from "@/lib/types";

/**
 * Visuelle Identität je Hinweis-Szenario (Farbe + Icon + Label) — eine Quelle
 * der Wahrheit, damit Dashboard-Karten, Detail-Hero und XAI-Steuerelemente
 * konsistent dieselbe Kategorie-Farbe tragen. Apple-Health-Sprache:
 * Lifestyle = Teal, Herz-Kreislauf = Rosé-Magenta, Reise = Indigo-Blau.
 */
export interface KategorieIdentitaet {
  label: string;
  icon: LucideIcon;
  /** Akzentfarbe als Textklasse, z. B. "text-cat-lifestyle". */
  text: string;
  /** Soft-Hintergrund als Flächenklasse, z. B. "bg-cat-lifestyle-light". */
  soft: string;
  /** Volldeckende Akzentfläche (aktive States), z. B. "bg-cat-lifestyle". */
  solid: string;
  /** Textfarbe auf der Vollton-Fläche, z. B. "text-cat-lifestyle-on". */
  on: string;
  /** Icon-Container-Hintergrund (Kategorie-Farbe ~20 %), literal für Tailwind-JIT. */
  iconBg: string;
  /** Tinten-Tokenname für /-Opazität, z. B. bg-cat-lifestyle/20. */
  base: "cat-lifestyle" | "cat-cardio" | "cat-travel";
}

const MAP: Record<Hinweis["szenario"], KategorieIdentitaet> = {
  lifestyle: {
    label: "Lifestyle",
    icon: Moon,
    text: "text-cat-lifestyle",
    soft: "bg-cat-lifestyle-light",
    solid: "bg-cat-lifestyle",
    on: "text-cat-lifestyle-on",
    iconBg: "bg-cat-lifestyle/20",
    base: "cat-lifestyle",
  },
  kardiometabolisch: {
    label: "Herz-Kreislauf",
    icon: Heart,
    text: "text-cat-cardio",
    soft: "bg-cat-cardio-light",
    solid: "bg-cat-cardio",
    on: "text-cat-cardio-on",
    iconBg: "bg-cat-cardio/20",
    base: "cat-cardio",
  },
  reise: {
    label: "Reisevorsorge",
    icon: Plane,
    text: "text-cat-travel",
    soft: "bg-cat-travel-light",
    solid: "bg-cat-travel",
    on: "text-cat-travel-on",
    iconBg: "bg-cat-travel/20",
    base: "cat-travel",
  },
};

export function kategorie(szenario: Hinweis["szenario"]): KategorieIdentitaet {
  return MAP[szenario];
}

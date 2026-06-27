import { Moon, HeartPulse, Plane, type LucideIcon } from "lucide-react";
import type { Hinweis } from "@/lib/types";

/**
 * Visuelle Identität je Hinweis-Szenario (Farbe + Icon + Label).
 * Eine Quelle der Wahrheit, damit Dashboard-Karten, Detail-Hero und
 * XAI-Steuerelemente konsistent dieselbe Kategorie-Farbe tragen.
 * Lifestyle nutzt den bestehenden Primary-Token (Teal), Herz-Kreislauf
 * ein Mauve, Reise ein Blaugrün (Tokens siehe globals.css).
 */
export interface KategorieIdentitaet {
  label: string;
  icon: LucideIcon;
  /** Akzentfarbe als Textklasse, z. B. "text-primary". */
  text: string;
  /** Soft-Hintergrund als Flächenklasse, z. B. "bg-primary-soft". */
  soft: string;
  /** Volldeckende Akzentfläche (aktive States), z. B. "bg-primary". */
  solid: string;
  /** Tinte für getönte Sektionsflächen über /-Opazität, z. B. "primary". */
  base: "primary" | "cat-cardio" | "cat-travel";
}

const MAP: Record<Hinweis["szenario"], KategorieIdentitaet> = {
  lifestyle: {
    label: "Lifestyle",
    icon: Moon,
    text: "text-primary",
    soft: "bg-primary-soft",
    solid: "bg-primary",
    base: "primary",
  },
  kardiometabolisch: {
    label: "Herz-Kreislauf",
    icon: HeartPulse,
    text: "text-cat-cardio",
    soft: "bg-cat-cardio-soft",
    solid: "bg-cat-cardio",
    base: "cat-cardio",
  },
  reise: {
    label: "Reise & Impfung",
    icon: Plane,
    text: "text-cat-travel",
    soft: "bg-cat-travel-soft",
    solid: "bg-cat-travel",
    base: "cat-travel",
  },
};

export function kategorie(szenario: Hinweis["szenario"]): KategorieIdentitaet {
  return MAP[szenario];
}

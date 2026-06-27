import { Moon, Heart, Plane, Activity, CalendarCheck, type LucideIcon } from "lucide-react";
import type { Hinweis } from "@/lib/types";

/**
 * Visuelle Identität je Hinweis-Szenario (Farbe + Icon + Label) — eine Quelle
 * der Wahrheit, damit Dashboard-Karten, Detail-Hero und XAI-Steuerelemente
 * konsistent dieselbe Kategorie-Farbe tragen.
 */
export interface KategorieIdentitaet {
  label: string;
  icon: LucideIcon;
  text: string;
  soft: string;
  solid: string;
  on: string;
  iconBg: string;
  base: "cat-lifestyle" | "cat-cardio" | "cat-travel" | "cat-prevention";
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
  stoffwechsel: {
    label: "Stoffwechsel",
    icon: Activity,
    text: "text-cat-lifestyle",
    soft: "bg-cat-lifestyle-light",
    solid: "bg-cat-lifestyle",
    on: "text-cat-lifestyle-on",
    iconBg: "bg-cat-lifestyle/20",
    base: "cat-lifestyle",
  },
  vorsorge: {
    label: "Vorsorge",
    icon: CalendarCheck,
    text: "text-cat-prevention",
    soft: "bg-cat-prevention-light",
    solid: "bg-cat-prevention",
    on: "text-cat-prevention-on",
    iconBg: "bg-cat-prevention/20",
    base: "cat-prevention",
  },
};

export function kategorie(szenario: Hinweis["szenario"]): KategorieIdentitaet {
  return MAP[szenario];
}

import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Sun,
  Moon,
  Clock,
  CalendarCheck,
  Dumbbell,
  Wind,
  TrendingUp,
  Plane,
  Heart,
} from "lucide-react";
import { tageBis } from "@/lib/zeit";

export interface InsightMoment {
  icon: LucideIcon;
  /** CSS-Variable als String, z. B. "var(--c-cat-lifestyle)" */
  iconFarbe: string;
  iconBg: string;
  text: string;
  prioritaet: number;
}

// Synthetische Festwerte aus Maras Profil
const SCHLAF_SCORE_LETZTE_NACHT = 83;
// Thailand-Abreise (kanonisch 15.08.2026, Abschnitt 2).
const THAILAND_ABREISE = new Date(2026, 7, 15); // 15. August 2026
// Zahnarzt-Countdown aus der zentralen Szenario-Zeit (kanonischer Termin 12.07.2026).
const ZAHNARZT_TAGE = tageBis("2026-07-12");

export function getAktuellerInsight(): InsightMoment {
  const jetzt = new Date();
  const stunde = jetzt.getHours();
  const wochentag = jetzt.getDay(); // 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa
  const monat = jetzt.getMonth();   // 5 = Juni

  const tagesBisAbreise = Math.ceil(
    (THAILAND_ABREISE.getTime() - jetzt.getTime()) / (1000 * 60 * 60 * 24),
  );

  const kandidaten: InsightMoment[] = [];

  // V1 — Beste Nacht + Sonnentag (p1)
  if (
    wochentag === 0 &&
    SCHLAF_SCORE_LETZTE_NACHT >= 80 &&
    stunde >= 8 &&
    stunde < 13 &&
    monat === 5
  ) {
    kandidaten.push({
      icon: Sparkles,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: "Deine beste Nacht seit 2 Wochen.\nHeute: Sonne 11–17 Uhr —\nideal für Vitamin D und Schritte.",
      prioritaet: 1,
    });
  }

  // V9 — Reise-Countdown (p1)
  if (tagesBisAbreise >= 0 && tagesBisAbreise <= 42) {
    kandidaten.push({
      icon: Plane,
      iconFarbe: "var(--c-cat-travel)",
      iconBg: "var(--c-cat-travel-light)",
      text: "Thailand in 6 Wochen.\nHepatitis A: noch kein\nImpfschutz vorhanden.",
      prioritaet: 1,
    });
  }

  // V2 — Sonnenfenster (p2)
  if (stunde >= 9 && stunde < 11 && monat === 5) {
    kandidaten.push({
      icon: Sun,
      iconFarbe: "var(--c-status-warn)",
      iconBg: "var(--c-status-warn-light)",
      text: "Heute Mittagssonne 11–15 Uhr.\n25 Min draußen füllen dein\nVitamin D auf (aktuell 24 ng/ml).",
      prioritaet: 2,
    });
  }

  // V4 — Donnerstag-Warnung (p2)
  if (wochentag === 4 && stunde < 16) {
    kandidaten.push({
      icon: Clock,
      iconFarbe: "var(--c-status-warn)",
      iconBg: "var(--c-status-warn-light)",
      text: "Dein Donnerstag-Muster:\nTraining heute lieber vor 14 Uhr —\nsonst sinkt HRV auf 29 ms.",
      prioritaet: 2,
    });
  }

  // V6 — Trainingstag (p2)
  if (
    (wochentag === 2 || wochentag === 4 || wochentag === 6) &&
    stunde >= 10 &&
    stunde < 14
  ) {
    kandidaten.push({
      icon: Dumbbell,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: "Trainingstag heute. Dein\nRuhepuls: 60 BPM — du bist\ngut erholt. Viel Kraft.",
      prioritaet: 2,
    });
  }

  // V7 — Abend-Ritual (p2)
  if (stunde >= 21) {
    kandidaten.push({
      icon: Wind,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: "In 30 Min dimmen.\nDeine HRV-Bestzeit kommt\nnach ruhigen Abenden.",
      prioritaet: 2,
    });
  }

  // V3 — Gute Nacht (p3)
  if (SCHLAF_SCORE_LETZTE_NACHT >= 80) {
    kandidaten.push({
      icon: Moon,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: "Letzte Nacht: Score 83/100 —\ndeine beste seit 2 Wochen.\nHRV heute: 50 ms. Top.",
      prioritaet: 3,
    });
  }

  // V5 — Zahnarzt-Erinnerung (p3, immer aktiv als Demo)
  kandidaten.push({
    icon: CalendarCheck,
    iconFarbe: "var(--c-cat-prevention)",
    iconBg: "var(--c-cat-prevention-light)",
    text: `Zahnarzt in ${ZAHNARZT_TAGE} Tagen.\nNoch kein Termin?\nDr. Maier, Bochum.`,
    prioritaet: 3,
  });

  // V8 — Wochenbeginn-Motivation (p3)
  if (wochentag === 1 && stunde < 12) {
    kandidaten.push({
      icon: TrendingUp,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: "Neue Woche. Letztes Mal\n12.584 Schritte/Tag — das\nschaffst du wieder.",
      prioritaet: 3,
    });
  }

  // V10 — Default Wellbeing (p10, immer Fallback)
  kandidaten.push({
    icon: Heart,
    iconFarbe: "var(--c-cat-cardio)",
    iconBg: "var(--c-cat-cardio-light)",
    text: "Blutdruck-Trend stabil.\nHeute: guter Tag um\nfrüh ins Bett zu gehen.",
    prioritaet: 10,
  });

  kandidaten.sort((a, b) => a.prioritaet - b.prioritaet);
  return kandidaten[0];
}

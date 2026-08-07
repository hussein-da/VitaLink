// ACHTUNG — DERZEIT NICHT ERREICHBAR (verwaist):
// Dieses Modul wird ausschliesslich von src/components/InsightMoment.tsx
// genutzt, und diese Komponente ist auf keiner Route gemountet. Der Code wird
// gepflegt und zweisprachig gehalten, erscheint aber aktuell in keinem Screen.
//
// F11 (Zeilenumbrueche): Jeder Insight-Text enthaelt zwei harte \n und ist auf
// drei etwa gleich lange Zeilen bei 390 px Rahmenbreite ausgelegt. Die
// englischen Fassungen haben EIGENE Umbruchpositionen — sie folgen der
// englischen Wortlaenge, nicht der deutschen.

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
import type { Lokalisiert, Locale } from "@/i18n/types";
import { plural } from "@/i18n/format";

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
// Zahnarzt-Countdown aus der zentralen Szenario-Zeit (kanonischer Termin 28.07.2026).
const ZAHNARZT_TAGE = tageBis("2026-07-28");

/**
 * Waehlt den passenden Insight-Moment fuer den aktuellen Zeitpunkt.
 * Die Locale ist optional, weil der einzige (nicht gemountete) Aufrufer sie
 * noch nicht uebergibt; ohne Angabe gilt der deutsche Sprachstand.
 */
export function getAktuellerInsight(locale: Locale = "de"): InsightMoment {
  /** Loest einen lokalisierten Text fuer die aktive Locale auf. */
  const t = (l: Lokalisiert): string => l[locale];

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
      text: t({
        de: "Deine beste Nacht seit 2 Wochen.\nHeute: Sonne 11–17 Uhr —\nideal für Vitamin D und Schritte.",
        en: "Your best night in 2 weeks.\nSun today from 11:00 to 17:00.\nGreat for vitamin D and steps.",
      }),
      prioritaet: 1,
    });
  }

  // V9 — Reise-Countdown (p1)
  if (tagesBisAbreise >= 0 && tagesBisAbreise <= 42) {
    kandidaten.push({
      icon: Plane,
      iconFarbe: "var(--c-cat-travel)",
      iconBg: "var(--c-cat-travel-light)",
      text: t({
        de: "Thailand in 6 Wochen.\nHepatitis A: noch kein\nImpfschutz vorhanden.",
        en: "Thailand in 6 weeks.\nHepatitis A: you have no\nvaccine protection yet.",
      }),
      prioritaet: 1,
    });
  }

  // V2 — Sonnenfenster (p2)
  if (stunde >= 9 && stunde < 11 && monat === 5) {
    kandidaten.push({
      icon: Sun,
      iconFarbe: "var(--c-status-warn)",
      iconBg: "var(--c-status-warn-light)",
      text: t({
        de: "Heute Mittagssonne 11–15 Uhr.\n25 Min draußen füllen dein\nVitamin D auf (aktuell 24 ng/ml).",
        en: "Midday sun today, 11:00 to 15:00.\n25 minutes outside tops up your\nvitamin D (currently 24 ng/ml).",
      }),
      prioritaet: 2,
    });
  }

  // V4 — Donnerstag-Warnung (p2)
  if (wochentag === 4 && stunde < 16) {
    kandidaten.push({
      icon: Clock,
      iconFarbe: "var(--c-status-warn)",
      iconBg: "var(--c-status-warn-light)",
      text: t({
        de: "Dein Donnerstag-Muster:\nTraining heute lieber vor 14 Uhr —\nsonst sinkt HRV auf 29 ms.",
        en: "Your Thursday pattern: it's\nbetter to train before 14:00.\nOtherwise HRV drops to 29 ms.",
      }),
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
      text: t({
        de: "Trainingstag heute. Dein\nRuhepuls: 60 BPM — du bist\ngut erholt. Viel Kraft.",
        en: "Training day today. Your\nresting heart rate: 60 BPM.\nYou're well rested. Enjoy it.",
      }),
      prioritaet: 2,
    });
  }

  // V7 — Abend-Ritual (p2)
  if (stunde >= 21) {
    kandidaten.push({
      icon: Wind,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: t({
        de: "In 30 Min dimmen.\nDeine HRV-Bestzeit kommt\nnach ruhigen Abenden.",
        en: "Dim the lights in 30 min.\nYour best HRV comes\nafter calm evenings.",
      }),
      prioritaet: 2,
    });
  }

  // V3 — Gute Nacht (p3)
  if (SCHLAF_SCORE_LETZTE_NACHT >= 80) {
    kandidaten.push({
      icon: Moon,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: t({
        de: "Letzte Nacht: Score 83/100 —\ndeine beste seit 2 Wochen.\nHRV heute: 50 ms. Top.",
        en: "Last night: score 83/100.\nYour best in 2 weeks.\nHRV today: 50 ms. Great.",
      }),
      prioritaet: 3,
    });
  }

  // V5 — Zahnarzt-Erinnerung (p3, immer aktiv als Demo)
  // Erste Zeile ueber plural(), damit Zahl und Beugung locale-richtig sind.
  const zahnarztZeile = plural(
    ZAHNARZT_TAGE,
    locale,
    locale === "de"
      ? { one: "Zahnarzt in {n} Tag.", other: "Zahnarzt in {n} Tagen." }
      : { one: "Dentist in {n} day.", other: "Dentist in {n} days." },
  );
  kandidaten.push({
    icon: CalendarCheck,
    iconFarbe: "var(--c-cat-prevention)",
    iconBg: "var(--c-cat-prevention-light)",
    text:
      zahnarztZeile +
      t({
        de: "\nNoch kein Termin?\nDr. Maier, Bochum.",
        en: "\nNo appointment yet?\nDr. Maier, Bochum.",
      }),
    prioritaet: 3,
  });

  // V8 — Wochenbeginn-Motivation (p3)
  if (wochentag === 1 && stunde < 12) {
    kandidaten.push({
      icon: TrendingUp,
      iconFarbe: "var(--c-cat-lifestyle)",
      iconBg: "var(--c-cat-lifestyle-light)",
      text: t({
        de: "Neue Woche. Letztes Mal\n12.584 Schritte/Tag — das\nschaffst du wieder.",
        en: "New week. Last time:\n12,584 steps a day.\nYou can do that again.",
      }),
      prioritaet: 3,
    });
  }

  // V10 — Default Wellbeing (p10, immer Fallback)
  kandidaten.push({
    icon: Heart,
    iconFarbe: "var(--c-cat-cardio)",
    iconBg: "var(--c-cat-cardio-light)",
    text: t({
      de: "Blutdruck-Trend stabil.\nHeute: guter Tag um\nfrüh ins Bett zu gehen.",
      en: "Blood pressure trend steady.\nA good day today to\nget to bed early.",
    }),
    prioritaet: 10,
  });

  kandidaten.sort((a, b) => a.prioritaet - b.prioritaet);
  return kandidaten[0];
}

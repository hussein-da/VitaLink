import {
  User,
  FlaskConical,
  HeartPulse,
  Watch,
  Moon,
  Footprints,
  Activity,
  Wind,
  CalendarCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Lokalisiert, Locale } from "@/i18n/types";

/**
 * Datenmodell der Arztexport-Seite (/export). Jede Kategorie ist eine
 * iOS-Grouped-List-Karte; jede Zeile eine wählbare Datengruppe mit konkretem
 * Sublabel aus den Studiendaten (epa.ts / wearable.ts). Werte illustrativ.
 *
 * defaultAn  → Vorauswahl für Hausarzt / Anderer.
 * kardioRelevant → Vorauswahl für Kardiologe (Herz-/Kreislauf-Fokus).
 *
 * i18n: Die öffentlichen Typen bleiben reine strings. Lokalisiert sind nur die
 * Quelldaten unten (`quellen`); ein Accessor löst sie für eine Locale auf.
 */
export interface ExportZeile {
  id: string;
  label: string;
  sublabel?: string;
  defaultAn: boolean;
  kardioRelevant: boolean;
}

export interface ExportKategorie {
  id: string;
  gruppenname: string;
  icon: LucideIcon;
  /** Icon-Textfarbe, z. B. "text-cat-cardio". */
  iconFarbe: string;
  /** Icon-Container-Hintergrund, z. B. "bg-cat-cardio-light". */
  iconBg: string;
  unterlabel?: string;
  /** Hervorgehobene Kategorie (VitaLink-Analyse) mit eigenem Rahmen. */
  betont?: boolean;
  /** Optionaler Fußnotentext unter der Karte. */
  fussnote?: string;
  zeilen: ExportZeile[];
}

/* ── Lokalisierte Quelldaten ──────────────────────────────────────────── */

interface ExportZeileQuelle extends Omit<ExportZeile, "label" | "sublabel"> {
  label: Lokalisiert;
  sublabel?: Lokalisiert;
}

interface ExportKategorieQuelle
  extends Omit<ExportKategorie, "gruppenname" | "unterlabel" | "fussnote" | "zeilen"> {
  gruppenname: Lokalisiert;
  unterlabel?: Lokalisiert;
  fussnote?: Lokalisiert;
  zeilen: ExportZeileQuelle[];
}

const quellen: ExportKategorieQuelle[] = [
  {
    id: "persoenliches",
    gruppenname: { de: "Persönliches", en: "Personal details" },
    icon: User,
    iconFarbe: "text-muted",
    iconBg: "bg-surface-2",
    zeilen: [
      {
        id: "pers-stammdaten",
        label: { de: "Stammdaten", en: "Basic details" },
        sublabel: {
          de: "Name, Geburtsdatum, Versicherung",
          en: "Name, date of birth, health insurance",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "pers-blutgruppe",
        label: { de: "Blutgruppe", en: "Blood group" },
        sublabel: { de: "A positiv (A+)", en: "A positive (A+)" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "pers-allergien",
        label: { de: "Allergien & Unverträglichkeiten", en: "Allergies and intolerances" },
        sublabel: {
          de: "Pollen · Penicillin (Verdacht)",
          en: "Pollen · penicillin (suspected)",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "pers-familie",
        label: { de: "Familienanamnese", en: "Family history" },
        sublabel: {
          de: "Hypothyreose, Hypertonie, Diabetes Typ 2",
          en: "Underactive thyroid, high blood pressure, type 2 diabetes",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "pers-sozial",
        label: { de: "Sozialanamnese", en: "Lifestyle history" },
        sublabel: { de: "Beruf, Raucherstatus, Sport", en: "Job, smoking status, exercise" },
        defaultAn: false,
        kardioRelevant: false,
      },
      {
        id: "pers-beschwerden",
        label: { de: "Aktuelle Beschwerden", en: "Current symptoms" },
        sublabel: {
          de: "Kopfschmerzen, Erschöpfung (Arbeitswoche)",
          en: "Headaches, tiredness (during the working week)",
        },
        defaultAn: true,
        kardioRelevant: false,
      },
    ],
  },
  {
    id: "labor",
    gruppenname: { de: "Labordaten (ePA)", en: "Lab results (ePA)" },
    icon: FlaskConical,
    iconFarbe: "text-cat-cardio",
    iconBg: "bg-cat-cardio-light",
    unterlabel: { de: "Messung: 12.03.2026", en: "Measured: 12 March 2026" },
    zeilen: [
      {
        id: "labor-blutbild",
        label: { de: "Blutbild", en: "Blood count" },
        sublabel: {
          de: "Hämoglobin 12,1 g/dl · Ferritin 18 µg/l",
          en: "Haemoglobin 12.1 g/dl · ferritin 18 µg/l",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "labor-cholesterin",
        label: { de: "Cholesterin-Panel", en: "Cholesterol panel" },
        sublabel: {
          de: "Gesamt 198 · LDL 118 · HDL 52 mg/dl",
          en: "Total 198 · LDL 118 · HDL 52 mg/dl",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "labor-blutzucker",
        label: { de: "Blutzucker & HbA1c", en: "Blood sugar and HbA1c" },
        sublabel: { de: "94 mg/dl · 5,4 %", en: "94 mg/dl · 5.4 %" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "labor-schilddruese",
        label: { de: "Schilddrüse & Entzündung", en: "Thyroid and inflammation" },
        sublabel: {
          de: "TSH 1,8 mU/l · CRP 0,4 mg/l",
          en: "TSH 1.8 mU/l · CRP 0.4 mg/l",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "labor-vitamind",
        label: { de: "Vitamin D & Mikronährstoffe", en: "Vitamin D and micronutrients" },
        sublabel: { de: "Vitamin D 24 ng/ml", en: "Vitamin D 24 ng/ml" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "labor-niere",
        label: { de: "Niere & Leber", en: "Kidney and liver" },
        sublabel: {
          de: "Kreatinin 0,78 · GFR 94 · GPT 18",
          en: "Creatinine 0.78 · GFR 94 · ALT 18",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
    ],
  },
  {
    id: "vitalwerte",
    gruppenname: { de: "Vitalwerte (ePA)", en: "Vital signs (ePA)" },
    icon: HeartPulse,
    iconFarbe: "text-cat-cardio",
    iconBg: "bg-cat-cardio-light",
    zeilen: [
      {
        id: "vital-bd-verlauf",
        label: { de: "Blutdruck-Verlauf", en: "Blood pressure over time" },
        sublabel: {
          de: "6 Monate, 118 → 128 mmHg systolisch",
          en: "6 months, 118 → 128 mmHg systolic",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "vital-gewicht",
        label: { de: "Gewicht & BMI", en: "Weight and BMI" },
        sublabel: { de: "66,9 kg · BMI 22,9 · stabil", en: "66.9 kg · BMI 22.9 · steady" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "vital-bd-roh",
        label: { de: "Einzelne Blutdruckmessungen", en: "Single blood pressure readings" },
        sublabel: { de: "Rohdaten, 6 Messungen", en: "Raw data, 6 readings" },
        defaultAn: false,
        kardioRelevant: true,
      },
    ],
  },
  {
    id: "herzgesundheit",
    gruppenname: { de: "Herzgesundheit (Wearable)", en: "Heart health (wearable)" },
    icon: Watch,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: {
      de: "Apple Watch Series 12, letzte 30 Tage",
      en: "Apple Watch Series 12, last 30 days",
    },
    zeilen: [
      {
        id: "herz-ruhepuls",
        label: { de: "Ruhepuls", en: "Resting heart rate" },
        sublabel: { de: "Ø 60 BPM, Trend stabil", en: "Ø 60 BPM, steady trend" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "herz-hrv",
        label: { de: "HRV (RMSSD)", en: "HRV (RMSSD)" },
        sublabel: { de: "Ø 40 ms, 7-Tage-Verlauf", en: "Ø 40 ms, over 7 days" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "herz-zonen",
        label: { de: "Herzfrequenzzonen", en: "Heart rate zones" },
        sublabel: { de: "30 Tage Training", en: "30 days of training" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "herz-vo2max",
        label: { de: "VO₂max", en: "VO₂max" },
        sublabel: { de: "38 ml/kg/min, „Gut“", en: '38 ml/kg/min, "good"' },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "herz-roh",
        label: { de: "Ruhepuls-Rohdaten", en: "Resting heart rate raw data" },
        sublabel: { de: "30 Einzelwerte", en: "30 single readings" },
        defaultAn: false,
        kardioRelevant: true,
      },
    ],
  },
  {
    id: "schlaf",
    gruppenname: { de: "Schlaf & Erholung", en: "Sleep and recovery" },
    icon: Moon,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: {
      de: "Apple Watch Series 12, letzte 14 Nächte",
      en: "Apple Watch Series 12, last 14 nights",
    },
    zeilen: [
      {
        id: "schlaf-uebersicht",
        label: { de: "Schlafqualität-Übersicht", en: "Sleep quality overview" },
        sublabel: { de: "Ø Score 67/100", en: "Ø score 67/100" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "schlaf-dauer",
        label: { de: "Schlafdauer-Durchschnitt", en: "Average sleep duration" },
        sublabel: { de: "Ø 6,9 h", en: "Ø 6.9 h" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "schlaf-tief",
        label: { de: "Tiefschlaf-Anteil", en: "Deep sleep share" },
        sublabel: {
          de: "Ø 16 % · Arbeitswoche 10–13 %",
          en: "Ø 16 % · working week 10-13 %",
        },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "schlaf-rem",
        label: { de: "REM-Anteil", en: "REM share" },
        sublabel: { de: "Ø 21 %", en: "Ø 21 %" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "schlaf-roh",
        label: { de: "Nacht-für-Nacht-Rohdaten", en: "Night-by-night raw data" },
        sublabel: { de: "14 Einträge", en: "14 entries" },
        defaultAn: false,
        kardioRelevant: false,
      },
      {
        id: "schlaf-korrelation",
        label: { de: "Schlaf-HRV-Korrelation", en: "Sleep and HRV link" },
        sublabel: { de: "Zusammenfassung", en: "Summary" },
        defaultAn: true,
        kardioRelevant: false,
      },
    ],
  },
  {
    id: "aktivitaet",
    gruppenname: { de: "Aktivität", en: "Activity" },
    icon: Footprints,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: {
      de: "Apple Watch Series 12, letzte 14 Tage",
      en: "Apple Watch Series 12, last 14 days",
    },
    zeilen: [
      {
        id: "akt-schritte",
        label: { de: "Schrittzahl", en: "Step count" },
        sublabel: { de: "Ø 12.584/Tag, 7-Tage-Schnitt", en: "Ø 12,584/day, 7-day average" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "akt-aktivmin",
        label: { de: "Aktive Minuten", en: "Active minutes" },
        sublabel: { de: "Ø 55 Min/Tag", en: "Ø 55 min/day" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "akt-training",
        label: { de: "Trainingseinheiten", en: "Workouts" },
        sublabel: { de: "4×/Woche, Ø 103 Min", en: "4×/week, Ø 103 min" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "akt-kalorien",
        label: { de: "Kalorienverbrauch", en: "Calories burned" },
        sublabel: { de: "Ø 2.180 kcal/Tag", en: "Ø 2,180 kcal/day" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "akt-verteilung",
        label: { de: "Stündliche Aktivitätsverteilung", en: "Activity by hour" },
        sublabel: { de: "Tagesprofil", en: "Daily profile" },
        defaultAn: false,
        kardioRelevant: false,
      },
      {
        id: "akt-sitzzeit",
        label: { de: "Sitzzeit", en: "Sitting time" },
        sublabel: { de: "Ø 6,2 h/Tag an Arbeitstagen", en: "Ø 6.2 h/day on working days" },
        defaultAn: false,
        kardioRelevant: false,
      },
    ],
  },
  {
    id: "stoffwechsel",
    gruppenname: {
      de: "Stoffwechsel (Apple Watch Series 12)",
      en: "Metabolism (Apple Watch Series 12)",
    },
    icon: Activity,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: {
      de: "Apple Watch Series 12, letzte 14 Tage",
      en: "Apple Watch Series 12, last 14 days",
    },
    zeilen: [
      {
        id: "stw-nuechtern",
        label: { de: "Nüchternglukose-Trend", en: "Fasting glucose trend" },
        sublabel: { de: "Ø 90 mg/dl morgens", en: "Ø 90 mg/dl in the morning" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "stw-peak",
        label: { de: "Postprandialer Peak-Durchschnitt", en: "Average peak after meals" },
        sublabel: { de: "Ø 143 mg/dl", en: "Ø 143 mg/dl" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "stw-cv",
        label: { de: "Glukose-Variabilität", en: "Glucose variability" },
        sublabel: { de: "CV 18 %", en: "CV 18 %" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "stw-korrelation",
        label: { de: "Schlaf-Glukose-Korrelation", en: "Sleep and glucose link" },
        sublabel: { de: "20 mg/dl Unterschied", en: "20 mg/dl difference" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "stw-roh",
        label: { de: "Tagesverlauf-Rohdaten", en: "Daily curve raw data" },
        sublabel: { de: "14 Tage", en: "14 days" },
        defaultAn: false,
        kardioRelevant: false,
      },
    ],
  },
  {
    id: "weitere",
    gruppenname: { de: "Weitere Wearable-Daten", en: "More wearable data" },
    icon: Wind,
    iconFarbe: "text-muted",
    iconBg: "bg-surface-2",
    zeilen: [
      {
        id: "weit-spo2",
        label: { de: "SpO₂ Blutsauerstoff", en: "SpO₂ blood oxygen" },
        sublabel: { de: "Ø 97 %, letzte Nacht", en: "Ø 97 %, last night" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "weit-atem",
        label: { de: "Atemfrequenz", en: "Breathing rate" },
        sublabel: { de: "Ø 16,0/min im Schlaf", en: "Ø 16.0/min during sleep" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "weit-hauttemp",
        label: { de: "Hauttemperatur-Verlauf", en: "Skin temperature over time" },
        sublabel: { de: "14 Nächte, unauffällig", en: "14 nights, nothing unusual" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "weit-stress",
        label: { de: "Stress-Score", en: "Stress score" },
        sublabel: {
          de: "Ø 39/100 · Donnerstags-Spitze 52",
          en: "Ø 39/100 · Thursday high 52",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "weit-zyklus",
        label: { de: "Menstruationszyklus", en: "Menstrual cycle" },
        sublabel: { de: "Ø 28 Tage, optional", en: "Ø 28 days, optional" },
        defaultAn: false,
        kardioRelevant: false,
      },
    ],
  },
  {
    id: "vorsorge",
    gruppenname: { de: "Vorsorge (ePA)", en: "Preventive care (ePA)" },
    icon: CalendarCheck,
    iconFarbe: "text-cat-prevention",
    iconBg: "bg-cat-prevention-light",
    zeilen: [
      {
        id: "vor-impfstatus",
        label: { de: "Impfstatus", en: "Vaccination status" },
        sublabel: {
          de: "Tetanus 2017 · COVID 2022 · Hep A fehlt",
          en: "Tetanus 2017 · COVID 2022 · hepatitis A missing",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "vor-untersuchungen",
        label: { de: "Letzte Vorsorgeuntersuchungen", en: "Recent preventive check-ups" },
        sublabel: { de: "Übersicht", en: "Overview" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "vor-termine",
        label: { de: "Fällige Termine", en: "Appointments due" },
        sublabel: {
          de: "Zahnarzt Juli · Gynäkologie Juli",
          en: "Dentist in July · gynaecology in July",
        },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "vor-diagnosen",
        label: { de: "Diagnosen", en: "Diagnoses" },
        sublabel: {
          de: "Eisenmangel-Blutarmut · Allergischer Schnupfen",
          en: "Iron deficiency anaemia · hay fever",
        },
        defaultAn: false,
        kardioRelevant: false,
      },
      {
        id: "vor-medikamente",
        label: { de: "Medikamente aktuell", en: "Current medication" },
        sublabel: { de: "Vitamin D · Allergiemittel", en: "Vitamin D · allergy medicine" },
        defaultAn: false,
        kardioRelevant: false,
      },
    ],
  },
  {
    id: "vitalink",
    gruppenname: { de: "VitaLink-Analyse", en: "VitaLink analysis" },
    icon: Sparkles,
    iconFarbe: "text-cat-prevention",
    iconBg: "bg-cat-prevention-light",
    unterlabel: {
      de: "KI-gestützte Auswertung deiner Daten",
      en: "AI-supported analysis of your data",
    },
    betont: true,
    fussnote: {
      de: "VitaLink-Empfehlungen sind keine ärztliche Diagnose und dienen als Gesprächsgrundlage.",
      en: "VitaLink recommendations are not a medical diagnosis. They are there to help you talk with your doctor.",
    },
    zeilen: [
      {
        id: "vl-schlaf",
        label: {
          de: "Schlaf & Erholung: smarte Empfehlungen",
          en: "Sleep and recovery: smart recommendations",
        },
        sublabel: { de: "3 Tipps", en: "3 tips" },
        defaultAn: true,
        kardioRelevant: false,
      },
      {
        id: "vl-herz",
        label: {
          de: "Herz-Kreislauf: smarte Empfehlungen",
          en: "Heart and circulation: smart recommendations",
        },
        sublabel: { de: "3 Tipps", en: "3 tips" },
        defaultAn: true,
        kardioRelevant: true,
      },
      {
        id: "vl-reise",
        label: {
          de: "Reisevorsorge Thailand: smarte Empfehlungen",
          en: "Travel health for Thailand: smart recommendations",
        },
        defaultAn: false,
        kardioRelevant: false,
      },
      {
        id: "vl-glukose",
        label: {
          de: "Blutzucker: smarte Empfehlungen",
          en: "Blood sugar: smart recommendations",
        },
        defaultAn: false,
        kardioRelevant: false,
      },
      {
        id: "vl-zahnarzt",
        label: { de: "Zahnarzttermin: Erinnerung", en: "Dentist appointment: reminder" },
        defaultAn: false,
        kardioRelevant: false,
      },
    ],
  },
];

/* ── Aufloesung ───────────────────────────────────────────────────────── */

function zeileAufloesen(q: ExportZeileQuelle, locale: Locale): ExportZeile {
  return {
    ...q,
    label: q.label[locale],
    sublabel: q.sublabel?.[locale],
  };
}

function kategorieAufloesen(q: ExportKategorieQuelle, locale: Locale): ExportKategorie {
  return {
    ...q,
    gruppenname: q.gruppenname[locale],
    unterlabel: q.unterlabel?.[locale],
    fussnote: q.fussnote?.[locale],
    zeilen: q.zeilen.map((z) => zeileAufloesen(z, locale)),
  };
}

/** Alle Kategorien in der gewaehlten Sprache. */
export function exportKategorienFuer(locale: Locale): ExportKategorie[] {
  return quellen.map((q) => kategorieAufloesen(q, locale));
}

/**
 * Deutscher Sprachstand als Modul-Konstante.
 * Abwaertskompatibel fuer Aufrufer, die (noch) keine Locale kennen.
 */
export const exportKategorien: ExportKategorie[] = exportKategorienFuer("de");

/* ── Locale-unabhaengige IDs und Vorauswahl ───────────────────────────── */

/** Alle Zeilen-IDs in Anzeigereihenfolge (Auswahl-Persistenz, "Alles auswaehlen"). */
export const exportZeilenIds: string[] = quellen.flatMap((k) => k.zeilen.map((z) => z.id));

/** Alle Kategorie-IDs in Anzeigereihenfolge (Auf-/Zuklapp-Status). */
export const exportKategorieIds: string[] = quellen.map((k) => k.id);

/** IDs der VitaLink-Analyse-Zeilen (für die Zusammenfassung "mit VitaLink-Analyse"). */
export const vitalinkZeilenIds = new Set(
  quellen.find((k) => k.id === "vitalink")?.zeilen.map((z) => z.id) ?? [],
);

export type Empfaenger = "hausarzt" | "kardiologe" | "anderer";

/** Vorauswahl je Empfänger: hausarzt/anderer → defaultAn, kardiologe → kardioRelevant. */
export function defaultAuswahl(empfaenger: Empfaenger): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const kat of quellen) {
    for (const z of kat.zeilen) {
      out[z.id] = empfaenger === "kardiologe" ? z.kardioRelevant : z.defaultAn;
    }
  }
  return out;
}

/** Alle Gruppen initial geschlossen. */
export function defaultGruppenOffen(): Record<string, boolean> {
  return Object.fromEntries(exportKategorieIds.map((id) => [id, false]));
}

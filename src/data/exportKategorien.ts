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

/**
 * Datenmodell der Arztexport-Seite (/export). Jede Kategorie ist eine
 * iOS-Grouped-List-Karte; jede Zeile eine wählbare Datengruppe mit konkretem
 * Sublabel aus den Studiendaten (epa.ts / wearable.ts). Werte illustrativ.
 *
 * defaultAn  → Vorauswahl für Hausarzt / Anderer.
 * kardioRelevant → Vorauswahl für Kardiologe (Herz-/Kreislauf-Fokus).
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

export const exportKategorien: ExportKategorie[] = [
  {
    id: "persoenliches",
    gruppenname: "Persönliches",
    icon: User,
    iconFarbe: "text-muted",
    iconBg: "bg-surface-2",
    zeilen: [
      { id: "pers-stammdaten", label: "Stammdaten", sublabel: "Name, Geburtsdatum, Versicherung", defaultAn: true, kardioRelevant: false },
      { id: "pers-blutgruppe", label: "Blutgruppe", sublabel: "A positiv (A+)", defaultAn: true, kardioRelevant: false },
      { id: "pers-allergien", label: "Allergien & Unverträglichkeiten", sublabel: "Pollen · Penicillin (Verdacht)", defaultAn: true, kardioRelevant: false },
      { id: "pers-familie", label: "Familienanamnese", sublabel: "Hypothyreose, Hypertonie, Diabetes Typ 2", defaultAn: true, kardioRelevant: false },
      { id: "pers-sozial", label: "Sozialanamnese", sublabel: "Beruf, Raucherstatus, Sport", defaultAn: false, kardioRelevant: false },
      { id: "pers-beschwerden", label: "Aktuelle Beschwerden", sublabel: "Kopfschmerzen, Erschöpfung (Arbeitswoche)", defaultAn: true, kardioRelevant: false },
    ],
  },
  {
    id: "labor",
    gruppenname: "Labordaten (ePA)",
    icon: FlaskConical,
    iconFarbe: "text-cat-cardio",
    iconBg: "bg-cat-cardio-light",
    unterlabel: "Messung: 12.03.2026",
    zeilen: [
      { id: "labor-blutbild", label: "Blutbild", sublabel: "Hämoglobin 12,1 g/dl · Ferritin 18 µg/l", defaultAn: true, kardioRelevant: true },
      { id: "labor-cholesterin", label: "Cholesterin-Panel", sublabel: "Gesamt 198 · LDL 118 · HDL 52 mg/dl", defaultAn: true, kardioRelevant: true },
      { id: "labor-blutzucker", label: "Blutzucker & HbA1c", sublabel: "94 mg/dl · 5,4 %", defaultAn: true, kardioRelevant: true },
      { id: "labor-schilddruese", label: "Schilddrüse & Entzündung", sublabel: "TSH 1,8 mU/l · CRP 0,4 mg/l", defaultAn: true, kardioRelevant: true },
      { id: "labor-vitamind", label: "Vitamin D & Mikronährstoffe", sublabel: "Vitamin D 24 ng/ml", defaultAn: true, kardioRelevant: true },
      { id: "labor-niere", label: "Niere & Leber", sublabel: "Kreatinin 0,78 · GFR 94 · GPT 18", defaultAn: true, kardioRelevant: true },
    ],
  },
  {
    id: "vitalwerte",
    gruppenname: "Vitalwerte (ePA)",
    icon: HeartPulse,
    iconFarbe: "text-cat-cardio",
    iconBg: "bg-cat-cardio-light",
    zeilen: [
      { id: "vital-bd-verlauf", label: "Blutdruck-Verlauf", sublabel: "6 Monate, 118 → 128 mmHg systolisch", defaultAn: true, kardioRelevant: true },
      { id: "vital-gewicht", label: "Gewicht & BMI", sublabel: "66,9 kg · BMI 22,9 · stabil", defaultAn: true, kardioRelevant: true },
      { id: "vital-bd-roh", label: "Einzelne Blutdruckmessungen", sublabel: "Rohdaten, 6 Messungen", defaultAn: false, kardioRelevant: true },
    ],
  },
  {
    id: "herzgesundheit",
    gruppenname: "Herzgesundheit (Wearable)",
    icon: Watch,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: "Garmin Fenix 7, letzte 30 Tage",
    zeilen: [
      { id: "herz-ruhepuls", label: "Ruhepuls", sublabel: "Ø 60 BPM, Trend stabil", defaultAn: true, kardioRelevant: true },
      { id: "herz-hrv", label: "HRV (RMSSD)", sublabel: "Ø 40 ms, 7-Tage-Verlauf", defaultAn: true, kardioRelevant: true },
      { id: "herz-zonen", label: "Herzfrequenzzonen", sublabel: "30 Tage Training", defaultAn: true, kardioRelevant: true },
      { id: "herz-vo2max", label: "VO₂max", sublabel: "38 ml/kg/min, „Gut“", defaultAn: true, kardioRelevant: true },
      { id: "herz-roh", label: "Ruhepuls-Rohdaten", sublabel: "30 Einzelwerte", defaultAn: false, kardioRelevant: true },
    ],
  },
  {
    id: "schlaf",
    gruppenname: "Schlaf & Erholung",
    icon: Moon,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: "Garmin Fenix 7, letzte 14 Nächte",
    zeilen: [
      { id: "schlaf-uebersicht", label: "Schlafqualität-Übersicht", sublabel: "Ø Score 67/100", defaultAn: true, kardioRelevant: true },
      { id: "schlaf-dauer", label: "Schlafdauer-Durchschnitt", sublabel: "Ø 6,9 h", defaultAn: true, kardioRelevant: false },
      { id: "schlaf-tief", label: "Tiefschlaf-Anteil", sublabel: "Ø 16 % · Arbeitswoche 10–13 %", defaultAn: true, kardioRelevant: false },
      { id: "schlaf-rem", label: "REM-Anteil", sublabel: "Ø 21 %", defaultAn: true, kardioRelevant: false },
      { id: "schlaf-roh", label: "Nacht-für-Nacht-Rohdaten", sublabel: "14 Einträge", defaultAn: false, kardioRelevant: false },
      { id: "schlaf-korrelation", label: "Schlaf-HRV-Korrelation", sublabel: "Zusammenfassung", defaultAn: true, kardioRelevant: false },
    ],
  },
  {
    id: "aktivitaet",
    gruppenname: "Aktivität",
    icon: Footprints,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: "Garmin Fenix 7, letzte 14 Tage",
    zeilen: [
      { id: "akt-schritte", label: "Schrittzahl", sublabel: "Ø 12.584/Tag, 7-Tage-Schnitt", defaultAn: true, kardioRelevant: true },
      { id: "akt-aktivmin", label: "Aktive Minuten", sublabel: "Ø 55 Min/Tag", defaultAn: true, kardioRelevant: false },
      { id: "akt-training", label: "Trainingseinheiten", sublabel: "4×/Woche, Ø 103 Min", defaultAn: true, kardioRelevant: false },
      { id: "akt-kalorien", label: "Kalorienverbrauch", sublabel: "Ø 2.180 kcal/Tag", defaultAn: true, kardioRelevant: false },
      { id: "akt-verteilung", label: "Stündliche Aktivitätsverteilung", sublabel: "Tagesprofil", defaultAn: false, kardioRelevant: false },
      { id: "akt-sitzzeit", label: "Sitzzeit", sublabel: "Ø 6,2 h/Tag an Arbeitstagen", defaultAn: false, kardioRelevant: false },
    ],
  },
  {
    id: "stoffwechsel",
    gruppenname: "Stoffwechsel (Apple Watch)",
    icon: Activity,
    iconFarbe: "text-cat-lifestyle",
    iconBg: "bg-cat-lifestyle-light",
    unterlabel: "Apple Watch Series 12, letzte 14 Tage",
    zeilen: [
      { id: "stw-nuechtern", label: "Nüchternglukose-Trend", sublabel: "Ø 90 mg/dl morgens", defaultAn: true, kardioRelevant: true },
      { id: "stw-peak", label: "Postprandialer Peak-Durchschnitt", sublabel: "Ø 143 mg/dl", defaultAn: true, kardioRelevant: true },
      { id: "stw-cv", label: "Glukose-Variabilität", sublabel: "CV 18 %", defaultAn: true, kardioRelevant: false },
      { id: "stw-korrelation", label: "Schlaf-Glukose-Korrelation", sublabel: "20 mg/dl Unterschied", defaultAn: true, kardioRelevant: false },
      { id: "stw-roh", label: "Tagesverlauf-Rohdaten", sublabel: "14 Tage", defaultAn: false, kardioRelevant: false },
    ],
  },
  {
    id: "weitere",
    gruppenname: "Weitere Wearable-Daten",
    icon: Wind,
    iconFarbe: "text-muted",
    iconBg: "bg-surface-2",
    zeilen: [
      { id: "weit-spo2", label: "SpO₂ Blutsauerstoff", sublabel: "Ø 97 %, letzte Nacht", defaultAn: true, kardioRelevant: false },
      { id: "weit-atem", label: "Atemfrequenz", sublabel: "Ø 16,0/min im Schlaf", defaultAn: true, kardioRelevant: false },
      { id: "weit-hauttemp", label: "Hauttemperatur-Verlauf", sublabel: "14 Nächte, unauffällig", defaultAn: true, kardioRelevant: false },
      { id: "weit-stress", label: "Stress-Score", sublabel: "Ø 39/100 · Donnerstags-Spitze 52", defaultAn: true, kardioRelevant: false },
      { id: "weit-zyklus", label: "Menstruationszyklus", sublabel: "Ø 28 Tage, optional", defaultAn: false, kardioRelevant: false },
    ],
  },
  {
    id: "vorsorge",
    gruppenname: "Vorsorge (ePA)",
    icon: CalendarCheck,
    iconFarbe: "text-cat-prevention",
    iconBg: "bg-cat-prevention-light",
    zeilen: [
      { id: "vor-impfstatus", label: "Impfstatus", sublabel: "Tetanus 2017 · COVID 2022 · Hep A fehlt", defaultAn: true, kardioRelevant: true },
      { id: "vor-untersuchungen", label: "Letzte Vorsorgeuntersuchungen", sublabel: "Übersicht", defaultAn: true, kardioRelevant: false },
      { id: "vor-termine", label: "Fällige Termine", sublabel: "Zahnarzt Juli · Gynäkologie Juli", defaultAn: true, kardioRelevant: true },
      { id: "vor-diagnosen", label: "Diagnosen", sublabel: "D50.9 · J30.1", defaultAn: false, kardioRelevant: false },
      { id: "vor-medikamente", label: "Medikamente aktuell", sublabel: "Cholecalciferol · Cetirizin", defaultAn: false, kardioRelevant: false },
    ],
  },
  {
    id: "vitalink",
    gruppenname: "VitaLink-Analyse",
    icon: Sparkles,
    iconFarbe: "text-cat-prevention",
    iconBg: "bg-cat-prevention-light",
    unterlabel: "KI-gestützte Auswertung deiner Daten",
    betont: true,
    fussnote:
      "VitaLink-Empfehlungen sind keine ärztliche Diagnose und dienen als Gesprächsgrundlage.",
    zeilen: [
      { id: "vl-schlaf", label: "Schlaf & Erholung: smarte Empfehlungen", sublabel: "3 Tipps", defaultAn: true, kardioRelevant: false },
      { id: "vl-herz", label: "Herz-Kreislauf: smarte Empfehlungen", sublabel: "3 Tipps", defaultAn: true, kardioRelevant: true },
      { id: "vl-reise", label: "Reisevorsorge Thailand: smarte Empfehlungen", defaultAn: false, kardioRelevant: false },
      { id: "vl-glukose", label: "Blutzucker: smarte Empfehlungen", defaultAn: false, kardioRelevant: false },
      { id: "vl-zahnarzt", label: "Zahnarzttermin: Erinnerung", defaultAn: false, kardioRelevant: false },
    ],
  },
];

/** IDs der VitaLink-Analyse-Zeilen (für die Zusammenfassung "mit VitaLink-Analyse"). */
export const vitalinkZeilenIds = new Set(
  exportKategorien.find((k) => k.id === "vitalink")?.zeilen.map((z) => z.id) ?? [],
);

export type Empfaenger = "hausarzt" | "kardiologe" | "anderer";

/** Vorauswahl je Empfänger: hausarzt/anderer → defaultAn, kardiologe → kardioRelevant. */
export function defaultAuswahl(empfaenger: Empfaenger): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const kat of exportKategorien) {
    for (const z of kat.zeilen) {
      out[z.id] = empfaenger === "kardiologe" ? z.kardioRelevant : z.defaultAn;
    }
  }
  return out;
}

/** Alle Gruppen initial geschlossen. */
export function defaultGruppenOffen(): Record<string, boolean> {
  return Object.fromEntries(exportKategorien.map((k) => [k.id, false]));
}

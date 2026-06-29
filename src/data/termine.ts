// VitaLink — Vorsorge & Termine (Badge 2.1, Neubau).
// Abgeleitete Aufgaben-/Terminsicht (Ebene 2 der IA). Werte synthetisch
// (synthetic), alle Datumsangaben/Countdowns leiten aus lib/zeit.ts ab.
// Kanonische Quelle der erklärten Inhalte bleibt hinweise.ts (Ebene 1).

import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Clock,
  CalendarDays,
  CheckCircle,
  Smile,
  Plane,
  HeartPulse,
  Sun,
  FlaskConical,
  Eye,
  Syringe,
  FileText,
  Watch,
  Map as MapIcon,
  Pencil,
} from "lucide-react";
import { fehlendeReiseimpfungen } from "@/data/reise";

export type TerminDringlichkeit = "jetzt" | "bald" | "spaeter" | "erledigt";
export type TerminDatenquelle = "epa" | "wearable" | "reiseplanung" | "manuell";
export type TerminAktion = "details" | "termin-planen" | "spaeter" | "korrigieren";

export interface Termin {
  id: string;
  /** lucide-Icon-Name (siehe ICONS). */
  icon: string;
  titel: string;
  dringlichkeit: TerminDringlichkeit;
  /** Anzeigetext der Fälligkeit, z. B. "bis 12.07.2026". */
  faelligkeit: string;
  /** 1–12 für Monatsnavigation, 0 = unbestimmt. */
  monat: number;
  jahr: number;
  erklaerung: string;
  warumSehIchDas: string;
  datenbasis: TerminDatenquelle[];
  /** Tap-Through-Ziel (Detailseite oder /termine/placeholder). */
  route: string;
  aktionen: TerminAktion[];
  /** Nur kombinierte Reise-Karte (Block 9): fehlende Impfungen als Sub-Zeilen. */
  fehlendeImpfungen?: string[];
}

export const termine: Termin[] = [
  {
    id: "zahnarzt",
    icon: "Smile",
    titel: "Zahnärztliche Kontrolle",
    dringlichkeit: "jetzt",
    faelligkeit: "bis 12.07.2026",
    monat: 7,
    jahr: 2026,
    erklaerung:
      "Dein letzter Besuch war am 12.01.2026. Das 6-Monats-Intervall endet am 12.07.2026.",
    warumSehIchDas: "Letzter Besuch 12.01.2026. Das 6-Monats-Intervall endet am 12.07.2026.",
    datenbasis: ["epa"],
    route: "/hinweis/zahnarzt",
    aktionen: ["details", "termin-planen"],
  },
  {
    id: "reise-impfung",
    icon: "Plane",
    titel: "Thailand-Reise: Impfschutz prüfen",
    dringlichkeit: "jetzt",
    faelligkeit: "vor Abreise 15.08.2026",
    monat: 8,
    jahr: 2026,
    erklaerung:
      "Deine Reise startet am 15.08.2026. Laut ePA fehlen aktuell Einträge für Hepatitis A und Hepatitis B. Bei Reiseimpfungen kann ein gewisser Vorlauf sinnvoll sein — prüfe den Impfstatus zeitnah ärztlich.",
    warumSehIchDas: "ePA-Impfstatus: kein Eintrag für Hepatitis A und Hepatitis B.",
    datenbasis: ["epa", "reiseplanung"],
    route: "/reise?from=reise-impfung",
    aktionen: ["details", "spaeter"],
    fehlendeImpfungen: fehlendeReiseimpfungen("TH"),
  },
  {
    id: "gynaekologie",
    icon: "HeartPulse",
    titel: "Gynäkologische Vorsorge",
    dringlichkeit: "jetzt",
    faelligkeit: "Juli 2026",
    monat: 7,
    jahr: 2026,
    erklaerung:
      "Letzter Vorsorgetermin 24.07.2025. Ein jährliches Intervall wird empfohlen.",
    warumSehIchDas: "Letzter Vorsorgetermin 24.07.2025. Nächster sinnvoll: Juli 2026.",
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "hautkrebs",
    icon: "Sun",
    titel: "Hautkrebs-Screening",
    dringlichkeit: "bald",
    faelligkeit: "2026",
    monat: 9,
    jahr: 2026,
    erklaerung:
      "Kein Screening-Eintrag in deiner ePA gefunden. Eine Erstuntersuchung ist empfehlenswert.",
    warumSehIchDas: "Kein Screening-Eintrag in deiner ePA gefunden.",
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "blutbild",
    icon: "FlaskConical",
    titel: "Nächstes Blutbild",
    dringlichkeit: "bald",
    faelligkeit: "September 2026",
    monat: 9,
    jahr: 2026,
    erklaerung:
      "Letzter Eintrag 12.03.2026. Eine Folgeuntersuchung in ca. 6 Monaten ist sinnvoll, insbesondere zur Kontrolle von Vitamin D und Ferritin.",
    warumSehIchDas: "Letzter Eintrag 12.03.2026. Nächste Kontrolle geplant: September 2026.",
    datenbasis: ["epa", "wearable"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "augenarzt",
    icon: "Eye",
    titel: "Augenarzt-Kontrolle",
    dringlichkeit: "spaeter",
    faelligkeit: "2026",
    monat: 11,
    jahr: 2026,
    erklaerung: "Letzter Eintrag 2024. Eine Kontrolle 2026 ist vorgesehen.",
    warumSehIchDas: "Letzter Eintrag 2024. Kontrolle vorgesehen: 2026.",
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "tetanus",
    icon: "Syringe",
    titel: "Tetanus / Diphtherie-Auffrischung",
    dringlichkeit: "erledigt",
    faelligkeit: "nächste fällig: 2027",
    monat: 0,
    jahr: 2027,
    erklaerung: "Letzte Auffrischung 2017. Nächste Auffrischung erst 2027 fällig.",
    warumSehIchDas: "Letzte Auffrischung 2017. Nächste fällig: 2027.",
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["details", "korrigieren"],
  },
];

// ── Status-System (Block 3) — immer Icon + Text + Farbe, nie Farbe allein ──
export interface DringlichkeitMeta {
  Icon: LucideIcon;
  /** Chip-Hintergrund + Text. */
  chipClass: string;
  /** Icon-Container-Hintergrund. */
  bgClass: string;
  /** Icon-Farbe. */
  iconClass: string;
  /** Chip-Label. */
  label: string;
  /** Section-Label (uppercase). */
  sectionLabel: string;
  /** Section-Label-Farbe. */
  sectionClass: string;
}

export const dringlichkeitMeta: Record<TerminDringlichkeit, DringlichkeitMeta> = {
  jetzt: {
    Icon: AlertCircle,
    chipClass: "bg-status-warn-light text-status-warn",
    bgClass: "bg-status-warn-light",
    iconClass: "text-status-warn",
    label: "Jetzt wichtig",
    sectionLabel: "JETZT WICHTIG",
    sectionClass: "text-status-warn",
  },
  bald: {
    Icon: Clock,
    chipClass: "bg-status-amber-light text-status-amber",
    bgClass: "bg-status-amber-light",
    iconClass: "text-status-amber",
    label: "Bald planen",
    sectionLabel: "BALD PLANEN",
    sectionClass: "text-status-amber",
  },
  spaeter: {
    Icon: CalendarDays,
    chipClass: "bg-status-info-light text-status-info",
    bgClass: "bg-status-info-light",
    iconClass: "text-status-info",
    label: "Später im Blick",
    sectionLabel: "SPÄTER IM BLICK",
    sectionClass: "text-status-info",
  },
  erledigt: {
    Icon: CheckCircle,
    chipClass: "bg-status-ok-light text-status-ok",
    bgClass: "bg-status-ok-light",
    iconClass: "text-status-ok",
    label: "Erledigt",
    sectionLabel: "ERLEDIGT",
    sectionClass: "text-status-ok",
  },
};

/** Reihenfolge der Sektionen auf /termine. */
export const DRINGLICHKEIT_REIHENFOLGE: TerminDringlichkeit[] = [
  "jetzt",
  "bald",
  "spaeter",
  "erledigt",
];

// ── Termin-Icons (lucide) ──────────────────────────────────────────────────
export const TERMIN_ICONS: Record<string, LucideIcon> = {
  Smile,
  Plane,
  HeartPulse,
  Sun,
  FlaskConical,
  Eye,
  Syringe,
};

// ── Datenbasis-Chips (Block 8) ─────────────────────────────────────────────
export const DATENBASIS_META: Record<TerminDatenquelle, { Icon: LucideIcon; label: string }> = {
  epa: { Icon: FileText, label: "ePA" },
  wearable: { Icon: Watch, label: "Wearable" },
  reiseplanung: { Icon: MapIcon, label: "Reiseplanung" },
  manuell: { Icon: Pencil, label: "Manuell" },
};

/** Nächster anstehender (nicht erledigter) Termin — für die Home-Übersicht. */
export const naechsterTermin: Termin | undefined = termine.find(
  (t) => t.dringlichkeit !== "erledigt",
);

// VitaLink — Vorsorge & Termine (Badge 2.1, Neubau).
// Abgeleitete Aufgaben-/Terminsicht (Ebene 2 der IA). Werte synthetisch
// (synthetic), alle Datumsangaben/Countdowns leiten aus lib/zeit.ts ab.
// Kanonische Quelle der erklärten Inhalte bleibt hinweise.ts (Ebene 1).
//
// i18n: Die Quelldaten sind zweisprachig (Lokalisiert), die öffentlichen Typen
// (Termin, DringlichkeitMeta) bleiben reine strings. Auflösung über die
// `…Fuer(locale)`-Accessoren am Dateiende.

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
import type { Locale, Lokalisiert } from "@/i18n/types";

export type TerminDringlichkeit = "jetzt" | "bald" | "spaeter" | "erledigt";
export type TerminDatenquelle = "epa" | "wearable" | "reiseplanung" | "manuell";
export type TerminAktion = "details" | "termin-planen" | "spaeter" | "korrigieren";

export interface Termin {
  id: string;
  /** lucide-Icon-Name (siehe ICONS). */
  icon: string;
  titel: string;
  dringlichkeit: TerminDringlichkeit;
  /** Anzeigetext der Fälligkeit, z. B. "bis 28.07.2026". */
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

/**
 * Zweisprachige Quellform eines Termins. Statt einer fertigen Impfliste steht
 * hier nur der Ländercode — die Namen kommen locale-abhängig aus reise.ts.
 */
interface TerminQuelle
  extends Omit<Termin, "titel" | "faelligkeit" | "erklaerung" | "warumSehIchDas" | "fehlendeImpfungen"> {
  titel: Lokalisiert;
  faelligkeit: Lokalisiert;
  erklaerung: Lokalisiert;
  warumSehIchDas: Lokalisiert;
  /** ISO-Ländercode für die Reise-Karte (Block 9), z. B. "TH". */
  fehlendeImpfungenLand?: string;
}

const terminQuellen: TerminQuelle[] = [
  {
    id: "zahnarzt",
    icon: "Smile",
    titel: { de: "Zahnärztliche Kontrolle", en: "Dental check-up" },
    dringlichkeit: "jetzt",
    faelligkeit: { de: "bis 28.07.2026", en: "by 28 July 2026" },
    monat: 7,
    jahr: 2026,
    erklaerung: {
      de: "Dein letzter Besuch war am 27.01.2026. Das 6-Monats-Intervall endet am 28.07.2026.",
      en: "Your last visit was on 27 January 2026. The 6-month interval ends on 28 July 2026.",
    },
    warumSehIchDas: {
      de: "Letzter Besuch 27.01.2026. Das 6-Monats-Intervall endet am 28.07.2026.",
      en: "Last visit 27 January 2026. The 6-month interval ends on 28 July 2026.",
    },
    datenbasis: ["epa"],
    route: "/hinweis/zahnarzt",
    aktionen: ["details", "termin-planen"],
  },
  {
    id: "reise-impfung",
    icon: "Plane",
    titel: {
      de: "Thailand-Reise: Impfschutz prüfen",
      en: "Thailand trip: check your vaccinations",
    },
    dringlichkeit: "jetzt",
    faelligkeit: { de: "vor Abreise 15.08.2026", en: "before departure on 15 August 2026" },
    monat: 8,
    jahr: 2026,
    erklaerung: {
      de: "Deine Reise startet am 15.08.2026. Laut ePA fehlen aktuell Einträge für Hepatitis A und Hepatitis B. Bei Reiseimpfungen kann ein gewisser Vorlauf sinnvoll sein — prüfe den Impfstatus zeitnah ärztlich.",
      en: "Your trip starts on 15 August 2026. Your ePA (Germany's electronic patient record) currently has no entries for hepatitis A and hepatitis B. Travel vaccinations often need some lead time, so you may want to have your vaccination status checked by a doctor soon.",
    },
    warumSehIchDas: {
      de: "ePA-Impfstatus: kein Eintrag für Hepatitis A und Hepatitis B.",
      en: "ePA vaccination status: no entry for hepatitis A and hepatitis B.",
    },
    datenbasis: ["epa", "reiseplanung"],
    route: "/reise?from=reise-impfung",
    aktionen: ["details", "spaeter"],
    fehlendeImpfungenLand: "TH",
  },
  {
    id: "gynaekologie",
    icon: "HeartPulse",
    titel: { de: "Gynäkologische Vorsorge", en: "Gynaecological preventive care" },
    dringlichkeit: "jetzt",
    faelligkeit: { de: "Juli 2026", en: "July 2026" },
    monat: 7,
    jahr: 2026,
    erklaerung: {
      de: "Letzter Vorsorgetermin 12.08.2025. Ein jährliches Intervall wird empfohlen.",
      en: "Your last preventive care appointment was on 12 August 2025. A yearly interval is recommended.",
    },
    warumSehIchDas: {
      de: "Letzter Vorsorgetermin 12.08.2025. Nächster sinnvoll: Juli 2026.",
      en: "Last preventive care appointment 12 August 2025. Next one makes sense in July 2026.",
    },
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "hautkrebs",
    icon: "Sun",
    titel: { de: "Hautkrebs-Screening", en: "Skin cancer screening" },
    dringlichkeit: "bald",
    faelligkeit: { de: "2026", en: "2026" },
    monat: 9,
    jahr: 2026,
    erklaerung: {
      de: "Kein Screening-Eintrag in deiner ePA gefunden. Eine Erstuntersuchung ist empfehlenswert.",
      en: "We found no screening entry in your ePA. A first check-up is worth considering.",
    },
    warumSehIchDas: {
      de: "Kein Screening-Eintrag in deiner ePA gefunden.",
      en: "We found no screening entry in your ePA.",
    },
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "blutbild",
    icon: "FlaskConical",
    titel: { de: "Nächstes Blutbild", en: "Next blood count" },
    dringlichkeit: "bald",
    faelligkeit: { de: "September 2026", en: "September 2026" },
    monat: 9,
    jahr: 2026,
    erklaerung: {
      de: "Letzter Eintrag 12.03.2026. Eine Folgeuntersuchung in ca. 6 Monaten ist sinnvoll, insbesondere zur Kontrolle von Vitamin D und Ferritin.",
      en: "Last entry 12 March 2026. A follow-up in about 6 months makes sense, above all to check vitamin D and ferritin.",
    },
    warumSehIchDas: {
      de: "Letzter Eintrag 12.03.2026. Nächste Kontrolle geplant: September 2026.",
      en: "Last entry 12 March 2026. Next check planned for September 2026.",
    },
    datenbasis: ["epa", "wearable"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "augenarzt",
    icon: "Eye",
    titel: { de: "Augenarzt-Kontrolle", en: "Eye check-up" },
    dringlichkeit: "spaeter",
    faelligkeit: { de: "2026", en: "2026" },
    monat: 11,
    jahr: 2026,
    erklaerung: {
      de: "Letzter Eintrag 2024. Eine Kontrolle 2026 ist vorgesehen.",
      en: "Last entry 2024. A check-up is planned for 2026.",
    },
    warumSehIchDas: {
      de: "Letzter Eintrag 2024. Kontrolle vorgesehen: 2026.",
      en: "Last entry 2024. Check-up planned for 2026.",
    },
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["termin-planen", "spaeter"],
  },
  {
    id: "tetanus",
    icon: "Syringe",
    titel: { de: "Tetanus / Diphtherie-Auffrischung", en: "Tetanus / diphtheria booster" },
    dringlichkeit: "erledigt",
    faelligkeit: { de: "nächste fällig: 2027", en: "next due: 2027" },
    monat: 0,
    jahr: 2027,
    erklaerung: {
      de: "Letzte Auffrischung 2017. Nächste Auffrischung erst 2027 fällig.",
      en: "Last booster 2017. The next booster is not due until 2027.",
    },
    warumSehIchDas: {
      de: "Letzte Auffrischung 2017. Nächste fällig: 2027.",
      en: "Last booster 2017. Next due: 2027.",
    },
    datenbasis: ["epa"],
    route: "/termine/placeholder",
    aktionen: ["details", "korrigieren"],
  },
];

function aufloesen(q: TerminQuelle, locale: Locale): Termin {
  const { fehlendeImpfungenLand, ...rest } = q;
  const termin: Termin = {
    ...rest,
    titel: q.titel[locale],
    faelligkeit: q.faelligkeit[locale],
    erklaerung: q.erklaerung[locale],
    warumSehIchDas: q.warumSehIchDas[locale],
  };
  if (fehlendeImpfungenLand) {
    termin.fehlendeImpfungen = fehlendeReiseimpfungen(fehlendeImpfungenLand, locale);
  }
  return termin;
}

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

/**
 * Sprachneutraler Teil des Status-Systems: Icon + Tailwind-Klassen.
 * Bewusst getrennt von den Labels — CSS-Klassen werden nie übersetzt.
 */
export const DRINGLICHKEIT_STIL: Record<
  TerminDringlichkeit,
  Pick<DringlichkeitMeta, "Icon" | "chipClass" | "bgClass" | "iconClass" | "sectionClass">
> = {
  jetzt: {
    Icon: AlertCircle,
    chipClass: "bg-status-warn-light text-status-warn",
    bgClass: "bg-status-warn-light",
    iconClass: "text-status-warn",
    sectionClass: "text-status-warn",
  },
  bald: {
    Icon: Clock,
    chipClass: "bg-status-amber-light text-status-amber",
    bgClass: "bg-status-amber-light",
    iconClass: "text-status-amber",
    sectionClass: "text-status-amber",
  },
  spaeter: {
    Icon: CalendarDays,
    chipClass: "bg-status-info-light text-status-info",
    bgClass: "bg-status-info-light",
    iconClass: "text-status-info",
    sectionClass: "text-status-info",
  },
  erledigt: {
    Icon: CheckCircle,
    chipClass: "bg-status-ok-light text-status-ok",
    bgClass: "bg-status-ok-light",
    iconClass: "text-status-ok",
    sectionClass: "text-status-ok",
  },
};

/** Übersetzbarer Teil des Status-Systems. */
const dringlichkeitLabels: Record<
  TerminDringlichkeit,
  { label: Lokalisiert; sectionLabel: Lokalisiert }
> = {
  jetzt: {
    label: { de: "Jetzt wichtig", en: "Important now" },
    sectionLabel: { de: "JETZT WICHTIG", en: "IMPORTANT NOW" },
  },
  bald: {
    label: { de: "Bald planen", en: "Plan soon" },
    sectionLabel: { de: "BALD PLANEN", en: "PLAN SOON" },
  },
  spaeter: {
    label: { de: "Später im Blick", en: "Keep an eye on later" },
    sectionLabel: { de: "SPÄTER IM BLICK", en: "KEEP AN EYE ON LATER" },
  },
  erledigt: {
    label: { de: "Erledigt", en: "Done" },
    sectionLabel: { de: "ERLEDIGT", en: "DONE" },
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
/** Sprachneutraler Teil: nur die Icons. */
export const DATENBASIS_ICONS: Record<TerminDatenquelle, LucideIcon> = {
  epa: FileText,
  wearable: Watch,
  reiseplanung: MapIcon,
  manuell: Pencil,
};

const datenbasisLabels: Record<TerminDatenquelle, Lokalisiert> = {
  epa: { de: "ePA", en: "ePA" },
  wearable: { de: "Wearable", en: "Wearable" },
  reiseplanung: { de: "Reiseplanung", en: "Travel planning" },
  manuell: { de: "Manuell", en: "Manual" },
};

// ── Accessoren ─────────────────────────────────────────────────────────────

/** Locale-unabhängige ID-Liste (für Validierung/Routen-Prüfung). */
export const terminIds: string[] = terminQuellen.map((q) => q.id);

const terminCache = new Map<Locale, Termin[]>();

/** Alle Termine in der gewünschten Sprache (Reihenfolge wie in der Quelle). */
export function termineFuer(locale: Locale): Termin[] {
  let liste = terminCache.get(locale);
  if (!liste) {
    liste = terminQuellen.map((q) => aufloesen(q, locale));
    terminCache.set(locale, liste);
  }
  return liste;
}

/** Ein Termin nach id, in der gewünschten Sprache. */
export function terminFuer(id: string, locale: Locale): Termin | undefined {
  return termineFuer(locale).find((t) => t.id === id);
}

/** Nächster anstehender (nicht erledigter) Termin — für die Home-Übersicht. */
export function naechsterTerminFuer(locale: Locale): Termin | undefined {
  return termineFuer(locale).find((t) => t.dringlichkeit !== "erledigt");
}

const metaCache = new Map<Locale, Record<TerminDringlichkeit, DringlichkeitMeta>>();

/** Status-Meta (Icon + Klassen + übersetzte Labels) für eine Sprache. */
export function dringlichkeitMetaFuer(
  locale: Locale,
): Record<TerminDringlichkeit, DringlichkeitMeta> {
  let meta = metaCache.get(locale);
  if (!meta) {
    meta = {} as Record<TerminDringlichkeit, DringlichkeitMeta>;
    for (const d of DRINGLICHKEIT_REIHENFOLGE) {
      meta[d] = {
        ...DRINGLICHKEIT_STIL[d],
        label: dringlichkeitLabels[d].label[locale],
        sectionLabel: dringlichkeitLabels[d].sectionLabel[locale],
      };
    }
    metaCache.set(locale, meta);
  }
  return meta;
}

/** Datenbasis-Chips (Icon + übersetztes Label) für eine Sprache. */
export function datenbasisMetaFuer(
  locale: Locale,
): Record<TerminDatenquelle, { Icon: LucideIcon; label: string }> {
  return {
    epa: { Icon: DATENBASIS_ICONS.epa, label: datenbasisLabels.epa[locale] },
    wearable: { Icon: DATENBASIS_ICONS.wearable, label: datenbasisLabels.wearable[locale] },
    reiseplanung: {
      Icon: DATENBASIS_ICONS.reiseplanung,
      label: datenbasisLabels.reiseplanung[locale],
    },
    manuell: { Icon: DATENBASIS_ICONS.manuell, label: datenbasisLabels.manuell[locale] },
  };
}

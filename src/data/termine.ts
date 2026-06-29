import { CheckCircle, Clock, AlertCircle, type LucideIcon } from "lucide-react";
import type { DataSourceKey, VorsorgeTermin } from "@/lib/types";
import { hinweisMap } from "@/data/hinweise";
import { epaEntries, geplanteReise } from "@/data/epa";
import { berechneImpfstatus, fehlendeReiseimpfungen, type ImpfStatus } from "@/data/reise";
import { SZENARIO_HEUTE } from "@/lib/zeit";

/**
 * Single Source of Truth für die Vorsorge-&-Termine-Übersicht (/termine).
 * Das `termine`-Array wird aus den BESTEHENDEN Daten abgeleitet (hinweise.ts,
 * epa.ts, reise.ts) — Werte werden importiert, nicht neu getippt, damit nichts
 * gegenüber den Detailseiten driften kann. Alles illustrativ (synthetic).
 */

// Synthetisches „Jetzt" des Prototyps — eine Quelle der Wahrheit (lib/zeit.ts).
// KEIN new Date(): die Demodaten sind auf SoSe 2026 eingefroren; ein fixes
// Datum hält Countdowns reproduzierbar, SSG-sicher und ohne Hydration-Drift.
export const HEUTE = SZENARIO_HEUTE;

export type TerminStatus = "erledigt" | "ok" | "bald" | "faellig" | "fehlt" | "ueberfaellig";
export type TerminQuelle = "epa" | "reise" | "regel";
export type TerminGruppe = "diese-woche" | "dieser-monat" | "spaeter" | "erledigt";

export interface Termin {
  id: string;
  titel: string;
  kategorieLabel: string;
  status: TerminStatus;
  /** Exaktes ISO-Datum, treibt den Countdown. */
  datumISO?: string | null;
  /** Menschliches Label, wenn kein exaktes Datum ("September 2026", "ab sofort"). */
  naechstesLabel?: string;
  /** "zuletzt 12.01.2026". */
  zuletztLabel?: string;
  quelle: TerminQuelle;
  sourceKey?: DataSourceKey;
  /** Tap-Through-Ziel (Detailseite/Aktion). */
  link?: string;
  /** Optionaler Gruppen-Override (z. B. Tetanus → "später", ohne fingiertes Datum). */
  gruppe?: TerminGruppe;
}

const MS_TAG = 86_400_000;

/** Tage von HEUTE bis zu einem ISO-Datum (negativ = Vergangenheit). App-weit Math.ceil. */
export function tageBis(iso: string): number {
  return Math.ceil((new Date(`${iso}T00:00:00`).getTime() - HEUTE.getTime()) / MS_TAG);
}

function formatDE(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ausVorsorgeStatus(s: VorsorgeTermin["status"]): TerminStatus {
  return s === "ok" ? "ok" : s === "bald" ? "bald" : "fehlt";
}

function ausImpfStatus(s: ImpfStatus): TerminStatus {
  return s === "vorhanden" ? "erledigt" : s === "bald_faellig" ? "bald" : "fehlt";
}

// ── Ableitung des Termin-Arrays aus bestehenden Daten ──────────────────────
const liste: Termin[] = [];

const zahnarzt = hinweisMap["zahnarzt"];
const zahnEpa = epaEntries.find((e) => e.kategorie === "vorsorge");

if (zahnarzt) {
  // 1) Zahnarzt-Haupttermin (Recall-Regel + ePA)
  liste.push({
    id: "zahnarzt",
    titel: "Zahnärztliche Kontrolle",
    kategorieLabel: "Zahnvorsorge",
    status: "bald",
    datumISO: zahnarzt.dringlichkeit ?? "2026-07-12",
    zuletztLabel: zahnEpa?.date ? `zuletzt ${formatDE(zahnEpa.date)}` : undefined,
    quelle: "epa",
    sourceKey: "epa-vorsorge",
    link: "/hinweis/zahnarzt",
  });

  // 2) "Ähnliche Termine" aus der ePA (Blutbild, Gynäkologie, Hautkrebs, Augenarzt)
  for (const t of zahnarzt.aehnlicheTermine ?? []) {
    liste.push({
      id: `aehnlich-${slug(t.titel)}`,
      titel: t.titel,
      kategorieLabel: "Vorsorge",
      status: ausVorsorgeStatus(t.status),
      naechstesLabel: t.naechstes,
      zuletztLabel: t.zuletzt ? `zuletzt ${t.zuletzt}` : undefined,
      quelle: "epa",
      sourceKey: "epa-vorsorge",
      link: "/hinweis/zahnarzt",
    });
  }
}

// 3) Tetanus-Auffrischung (Impfstatus-Logik aus reise.ts)
liste.push({
  id: "impf-tetanus",
  titel: "Tetanus / Diphtherie-Auffrischung",
  kategorieLabel: "Impfung",
  status: ausImpfStatus(berechneImpfstatus("tetanus")),
  naechstesLabel: "Auffrischung fällig 2027",
  zuletztLabel: "zuletzt 2017",
  quelle: "epa",
  sourceKey: "epa-impfungen",
  link: "/hinweis/reise-impfung",
  gruppe: "spaeter", // 2027 → ehrlich „später", kein fingiertes Tagesdatum
});

// 4) Fehlende Reiseimpfungen (Thailand) — aus der Regel-Engine abgeleitet
for (const impf of fehlendeReiseimpfungen(geplanteReise.zielCode)) {
  liste.push({
    id: `impf-${slug(impf)}`,
    titel: `${impf}-Impfung`,
    kategorieLabel: "Reiseimpfung",
    status: "fehlt",
    naechstesLabel: `vor Thailand-Reise · ${formatDE(geplanteReise.datum)}`,
    quelle: "reise",
    sourceKey: "epa-impfungen",
    link: "/hinweis/reise-impfung",
  });
}

export const termine: Termin[] = liste;
export const offeneTermineCount = termine.filter((t) => t.status !== "erledigt").length;

// ── Gruppierung & Sortierung ───────────────────────────────────────────────
export function gruppeFuer(t: Termin): TerminGruppe {
  if (t.gruppe) return t.gruppe;
  if (t.status === "erledigt") return "erledigt";
  if (t.status === "fehlt" || t.status === "faellig" || t.status === "ueberfaellig") {
    return "diese-woche";
  }
  if (t.datumISO) {
    const d = tageBis(t.datumISO);
    if (d <= 7) return "diese-woche";
    if (d <= 31) return "dieser-monat";
    return "spaeter";
  }
  return t.status === "bald" ? "dieser-monat" : "spaeter";
}

const GRUPPEN_RANG: Record<TerminGruppe, number> = {
  "diese-woche": 0,
  "dieser-monat": 1,
  spaeter: 2,
  erledigt: 3,
};

export const GRUPPEN_REIHENFOLGE: TerminGruppe[] = [
  "diese-woche",
  "dieser-monat",
  "spaeter",
  "erledigt",
];

export const GRUPPEN_LABEL: Record<TerminGruppe, string> = {
  "diese-woche": "Diese Woche",
  "dieser-monat": "Diesen Monat",
  spaeter: "Später",
  erledigt: "Erledigt / Aktuell",
};

function vergleich(a: Termin, b: Termin): number {
  const ga = GRUPPEN_RANG[gruppeFuer(a)];
  const gb = GRUPPEN_RANG[gruppeFuer(b)];
  if (ga !== gb) return ga - gb;
  const da = a.datumISO ? tageBis(a.datumISO) : 99999;
  const db = b.datumISO ? tageBis(b.datumISO) : 99999;
  return da - db;
}

/** Sortiert eine Termin-Liste und gruppiert sie (leere Gruppen entfallen). */
export function gruppiere(list: Termin[]): { gruppe: TerminGruppe; label: string; items: Termin[] }[] {
  const sortiert = [...list].sort(vergleich);
  return GRUPPEN_REIHENFOLGE.map((g) => ({
    gruppe: g,
    label: GRUPPEN_LABEL[g],
    items: sortiert.filter((t) => gruppeFuer(t) === g),
  })).filter((x) => x.items.length > 0);
}

/** Countdown-Text aus datumISO + HEUTE; null wenn kein exaktes Datum. */
export function countdownLabel(t: Termin): string | null {
  if (!t.datumISO) return null;
  const d = tageBis(t.datumISO);
  if (d < 0) return `seit ${Math.abs(d)} Tagen offen`;
  if (d === 0) return "heute";
  if (d === 1) return "morgen";
  if (d <= 21) return `in ${d} Tagen`;
  if (d <= 70) return `in ${Math.round(d / 7)} Wochen`;
  return new Date(`${t.datumISO}T00:00:00`).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

// ── Status-Darstellung (Icon, Farben, Chip) — eine Tabelle, von TerminRow genutzt ──
export const terminStatusMeta: Record<
  TerminStatus,
  { Icon: LucideIcon; iconClass: string; chipClass: string; chipLabel: string }
> = {
  erledigt: { Icon: CheckCircle, iconClass: "text-status-ok", chipClass: "bg-status-ok-light text-status-ok", chipLabel: "Erledigt" },
  ok: { Icon: CheckCircle, iconClass: "text-status-ok", chipClass: "bg-status-ok-light text-status-ok", chipLabel: "Geplant" },
  bald: { Icon: Clock, iconClass: "text-accent-ink", chipClass: "bg-status-warn-light text-accent-ink", chipLabel: "Bald fällig" },
  faellig: { Icon: Clock, iconClass: "text-accent-ink", chipClass: "bg-status-warn-light text-accent-ink", chipLabel: "Diese Woche" },
  fehlt: { Icon: AlertCircle, iconClass: "text-accent-ink", chipClass: "bg-status-warn-light text-accent-ink", chipLabel: "Fehlt" },
  ueberfaellig: { Icon: AlertCircle, iconClass: "text-accent-ink", chipClass: "bg-status-warn-light text-accent-ink", chipLabel: "Überfällig" },
};

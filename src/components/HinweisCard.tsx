"use client";

import Link from "next/link";
import { ChevronRight, Star, MessageSquareX, Ban, Activity, HeartPulse, Plane } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { dataSourceLabel } from "@/lib/dataSources";

const szenarioLabel: Record<Hinweis["szenario"], string> = {
  lifestyle: "Lifestyle",
  kardiometabolisch: "Herz-Kreislauf",
  reise: "Reise & Impfung",
};

const szenarioIcon: Record<Hinweis["szenario"], typeof Activity> = {
  lifestyle: Activity,
  kardiometabolisch: HeartPulse,
  reise: Plane,
};

/**
 * Karte auf dem Dashboard (§2b). Kategorie-Icon links, Titel in Fraunces (18px),
 * zweizeilige Kurzfassung, "Details"-Affordance unten rechts, dezenter Status-Chip
 * oben rechts. Die ganze Karte ist antippbar.
 * Bei abgeschalteter Datenquelle (DF11) wird der Hinweis als "nicht genutzt"
 * markiert statt Inhalte zu faken. Widerspruch (DF12) wird angezeigt.
 */
export default function HinweisCard({ hinweis }: { hinweis: Hinweis }) {
  const { isSourceEnabled, getObjection } = useSettings();
  const istHauptpfad = hinweis.szenario === "lifestyle";

  const abgeschaltet = hinweis.genutzteQuellen.filter((k) => !isSourceEnabled(k));
  const beeinträchtigt = abgeschaltet.length > 0;
  const widerspruch = getObjection(hinweis.id);
  const Icon = szenarioIcon[hinweis.szenario];

  // Dezenter Status-Chip (nur wenn es einen Status gibt).
  const status = beeinträchtigt
    ? { label: "Quelle aus", cls: "bg-surface-2 text-muted" }
    : hinweis.unsicher
      ? { label: "unsicher", cls: "bg-accent-soft text-accent-ink" }
      : null;

  return (
    <Link
      href={`/hinweis/${hinweis.id}`}
      className={`group block rounded-2xl border bg-surface p-5 shadow-card transition-shadow hover:shadow-card-lg ${
        istHauptpfad ? "border-primary/30 ring-1 ring-primary/15" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Kategorie-Icon-Container (§2b) */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon aria-hidden size={20} />
        </span>

        <div className="min-w-0 flex-1">
          {/* Meta-Zeile: Kategorie + Hauptpfad links, Status-Chip rechts */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-muted">{szenarioLabel[hinweis.szenario]}</span>
            {istHauptpfad && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Star aria-hidden size={11} /> Hauptpfad
              </span>
            )}
            {status && (
              <span
                className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${status.cls}`}
              >
                {status.label}
              </span>
            )}
          </div>

          {/* Titel – Fraunces 18px */}
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {hinweis.titel}
          </h3>

          {/* Inhalt: Kurzfassung oder Quellen-Hinweis */}
          {beeinträchtigt ? (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-dashed border-border bg-surface-2/60 p-3 text-sm text-ink">
              <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
              <span>
                Nutzt abgeschaltete Quelle:{" "}
                <span className="font-medium">
                  {abgeschaltet.map((k) => dataSourceLabel(k)).join(", ")}
                </span>
                . In den Einstellungen wieder einschalten.
              </span>
            </div>
          ) : (
            <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">
              {hinweis.kurz}
            </p>
          )}

          {/* Widerspruch-Badge (DF12) */}
          {widerspruch && (
            <p className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-ink">
              <MessageSquareX aria-hidden size={13} /> widersprochen
            </p>
          )}

          {/* Details-Affordance unten rechts (§2b) */}
          <div className="mt-3 flex items-center justify-end text-sm font-semibold text-primary">
            Details
            <ChevronRight
              aria-hidden
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

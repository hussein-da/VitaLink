"use client";

import Link from "next/link";
import { ArrowRight, Star, MessageSquareX, Ban } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { dataSourceLabel } from "@/lib/dataSources";

const szenarioLabel: Record<Hinweis["szenario"], string> = {
  lifestyle: "Lifestyle",
  kardiometabolisch: "Herz-Kreislauf",
  reise: "Reise & Impfung",
};

/**
 * Karte auf dem Dashboard. Sachlicher Titel, eine Zeile Kurzfassung, ruhiger
 * Statusindikator (KEIN Alarmrot), klarer "Ansehen"-Button.
 * Bei abgeschalteter Datenquelle (DF11) wird der Hinweis als "nicht genutzt"
 * markiert, statt Inhalte zu faken. Widerspruch (DF12) wird angezeigt.
 */
export default function HinweisCard({ hinweis }: { hinweis: Hinweis }) {
  const { isSourceEnabled, getObjection } = useSettings();
  const istHauptpfad = hinweis.szenario === "lifestyle";

  const abgeschaltet = hinweis.genutzteQuellen.filter((k) => !isSourceEnabled(k));
  const beeintraechtigt = abgeschaltet.length > 0;
  const widerspruch = getObjection(hinweis.id);

  return (
    <article
      className={`rounded-2xl border bg-surface p-4 shadow-sm ${
        istHauptpfad ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-sm font-medium text-muted">
          {szenarioLabel[hinweis.szenario]}
        </span>
        {istHauptpfad && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-sm font-medium text-primary">
            <Star aria-hidden size={14} /> Hauptpfad
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted">
          <span
            aria-hidden
            className={`h-2.5 w-2.5 rounded-full ${
              beeintraechtigt ? "bg-muted" : hinweis.unsicher ? "bg-accent" : "bg-primary"
            }`}
          />
          {beeintraechtigt ? "Quelle aus" : hinweis.unsicher ? "unsicher" : "Hinweis"}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold leading-snug text-ink">{hinweis.titel}</h3>

      {beeintraechtigt ? (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-dashed border-border bg-surface-2/60 p-3 text-sm text-ink">
          <Ban aria-hidden size={18} className="mt-0.5 shrink-0 text-muted" />
          <span>
            Nutzt abgeschaltete Quelle:{" "}
            <span className="font-medium">
              {abgeschaltet.map((k) => dataSourceLabel(k)).join(", ")}
            </span>
            . In den Einstellungen wieder einschalten, um den Hinweis zu sehen.
          </span>
        </div>
      ) : (
        <p className="mt-1.5 line-clamp-2 text-muted">{hinweis.kurz}</p>
      )}

      {widerspruch && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-sm font-medium text-accent-ink">
          <MessageSquareX aria-hidden size={14} /> widersprochen
        </p>
      )}

      <div className="mt-3">
        <Link
          href={`/hinweis/${hinweis.id}`}
          className="tap inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-ink"
        >
          Ansehen
          <ArrowRight aria-hidden size={18} />
        </Link>
      </div>
    </article>
  );
}

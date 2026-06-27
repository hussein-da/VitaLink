"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareX, Ban } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { dataSourceLabel } from "@/lib/dataSources";
import { kategorie } from "@/lib/kategorie";

/**
 * Dashboard-Karte mit klarer Kategorie-Identität: farbiger Header-Streifen
 * (Kategorie-Soft) mit schwebendem Icon-Container + Kategorie-Label, darunter
 * weißer Body mit Titel, Kurzfassung und "Details ansehen". Die ganze Karte
 * ist antippbar.
 * DF11 (abgeschaltete Quelle) und DF12 (Widerspruch) bleiben funktional.
 */
export default function HinweisCard({ hinweis }: { hinweis: Hinweis }) {
  const { isSourceEnabled, getObjection } = useSettings();
  const k = kategorie(hinweis.szenario);
  const Icon = k.icon;

  const abgeschaltet = hinweis.genutzteQuellen.filter((key) => !isSourceEnabled(key));
  const beeinträchtigt = abgeschaltet.length > 0;
  const widerspruch = getObjection(hinweis.id);

  const status = beeinträchtigt
    ? { label: "Quelle aus", cls: "bg-surface/80 text-muted" }
    : hinweis.unsicher
      ? { label: "unsicher", cls: "bg-surface/80 text-accent-ink" }
      : null;

  return (
    <Link
      href={`/hinweis/${hinweis.id}`}
      className="group block overflow-hidden rounded-[20px] bg-surface shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-card-lg motion-safe:active:scale-[0.99]"
    >
      {/* Farbiger Kategorie-Header-Streifen */}
      <div className={`flex h-16 items-center gap-3 px-4 ${k.soft}`}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface shadow-sm">
          <Icon aria-hidden size={24} className={k.text} />
        </span>
        <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${k.text}`}>
          {k.label}
        </span>
        {status && (
          <span
            className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.cls}`}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">{hinweis.titel}</h3>

        {beeinträchtigt ? (
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-surface-2/60 p-3 text-sm text-ink">
            <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
            <span>
              Nutzt abgeschaltete Quelle:{" "}
              <span className="font-medium">
                {abgeschaltet.map((key) => dataSourceLabel(key)).join(", ")}
              </span>
              .
            </span>
          </div>
        ) : (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{hinweis.kurz}</p>
        )}

        {widerspruch && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent-ink">
            <MessageSquareX aria-hidden size={12} /> widersprochen
          </p>
        )}

        <div className={`mt-3 flex items-center justify-end gap-1 text-xs font-semibold ${k.text}`}>
          Details ansehen
          <ArrowRight
            aria-hidden
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

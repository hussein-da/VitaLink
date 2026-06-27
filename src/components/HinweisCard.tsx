"use client";

import Link from "next/link";
import { MessageSquareX, Ban } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { dataSourceLabel } from "@/lib/dataSources";
import { kategorie } from "@/lib/kategorie";
import ComboChip from "@/components/ComboChip";

/**
 * Dashboard-Hinweis-Karte (§Zone D). Farbiger Kategorie-Header (80px) mit
 * Icon-Container und Label/Titel, darunter weißer Body mit Kurzfassung,
 * Trennlinie und der ePA-+-Wearable-Kombizeile (USP, §3b Ebene 1).
 * DF11 (abgeschaltete Quelle) und DF12 (Widerspruch) bleiben funktional.
 */
export default function HinweisCard({ hinweis }: { hinweis: Hinweis }) {
  const { isSourceEnabled, getObjection } = useSettings();
  const k = kategorie(hinweis.szenario);
  const Icon = k.icon;
  const istReise = hinweis.szenario === "reise";

  const abgeschaltet = hinweis.genutzteQuellen.filter((key) => !isSourceEnabled(key));
  const beeinträchtigt = abgeschaltet.length > 0;
  const widerspruch = getObjection(hinweis.id);

  return (
    <Link
      href={`/hinweis/${hinweis.id}`}
      className="block overflow-hidden rounded-[20px] bg-surface shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.98]"
    >
      {/* Kategorie-Header-Streifen (80px) */}
      <div className={`flex h-20 items-center gap-3.5 px-4 ${k.soft}`}>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${k.iconBg}`}
        >
          <Icon aria-hidden size={26} className={k.text} strokeWidth={2} />
        </span>
        <span className="min-w-0">
          <span
            className={`block text-[11px] font-semibold uppercase tracking-[0.06em] ${k.text}`}
          >
            {k.label}
          </span>
          <span className="mt-0.5 block truncate font-display text-[18px] font-semibold leading-snug text-ink">
            {hinweis.titel}
          </span>
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-3.5">
        {beeinträchtigt ? (
          <div className="mb-3 flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-sm text-ink">
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
          <p className="mb-3 line-clamp-2 text-[14px] leading-[1.5] text-muted">{hinweis.kurz}</p>
        )}

        {widerspruch && (
          <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-status-warn-light px-2.5 py-0.5 text-[11px] font-medium text-accent-ink">
            <MessageSquareX aria-hidden size={12} /> widersprochen
          </p>
        )}

        <div className="border-t border-border pt-2.5">
          <ComboChip
            text={k.text}
            zweiteQuelle={istReise ? "Reiseplanung" : "Wearable"}
            zweiteArt={istReise ? "user" : "wearable"}
          />
        </div>
      </div>
    </Link>
  );
}

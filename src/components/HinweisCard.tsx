"use client";

import Link from "next/link";
import { MessageSquareX, Ban, X, RotateCcw, ThumbsUp } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { kategorie } from "@/lib/kategorie";
import { dringlichkeitsBadge } from "@/lib/dringlichkeit";
import FeedbackControls from "@/components/FeedbackControls";

/**
 * Kompakte, soft-getönte Kategorie-Karte. Antippbarer Hauptbereich (→ Detail),
 * „×" oben rechts blendet die Empfehlung aus, im Footer 👍/👎 je Empfehlung
 * (Like = „gemerkt", Dislike = Widerspruchs-Dialog). Ausgeblendete Karten
 * werden als schmale Zeile mit „Rückgängig" dargestellt.
 */
export default function HinweisCard({ hinweis }: { hinweis: Hinweis }) {
  const { isSourceEnabled, getObjection, isLiked, isDismissed, dismiss, restore } = useSettings();
  const k = kategorie(hinweis.szenario);
  const Icon = k.icon;

  const abgeschaltet = hinweis.genutzteQuellen.filter((key) => !isSourceEnabled(key));
  const beeinträchtigt = abgeschaltet.length > 0;
  const widerspruch = getObjection(hinweis.id);
  const liked = isLiked(hinweis.id);
  const frist = dringlichkeitsBadge(hinweis.dringlichkeit);
  const fristText = frist ? `in ${frist.replace(" Tage", " Tagen")}` : null;

  if (isDismissed(hinweis.id)) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[20px] bg-surface-2 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-[13px] text-muted">
          <Ban aria-hidden size={14} className="shrink-0" />
          <span className="truncate">„{hinweis.titel}" ausgeblendet</span>
        </span>
        <button
          type="button"
          onClick={() => restore(hinweis.id)}
          className="tap inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink"
        >
          <RotateCcw aria-hidden size={13} /> Rückgängig
        </button>
      </div>
    );
  }

  return (
    <div className={`relative rounded-[20px] ${k.soft} p-3.5 shadow-card`}>
      <button
        type="button"
        onClick={() => dismiss(hinweis.id)}
        aria-label={`„${hinweis.titel}" ausblenden`}
        className="tap absolute right-1.5 top-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface/60"
      >
        <X aria-hidden size={16} />
      </button>

      <Link
        href={`/hinweis/${hinweis.id}`}
        className="block transition-transform duration-200 ease-out motion-safe:active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5 pr-8">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${k.solid}`}>
            <Icon aria-hidden size={24} className={k.on} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <span className={`block text-[11px] font-semibold uppercase tracking-[0.06em] ${k.text}`}>
              {k.label}
            </span>
            <p className="truncate text-[17px] font-semibold leading-snug text-ink">{hinweis.titel}</p>
            {beeinträchtigt ? (
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                <Ban aria-hidden size={12} /> Quelle abgeschaltet
              </p>
            ) : (
              <p className="mt-0.5 line-clamp-1 text-[13px] text-muted">{hinweis.kurz}</p>
            )}
          </div>
        </div>
      </Link>

      {/* Footer: Meta links, Like/Dislike rechts */}
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
        <span className="flex min-w-0 items-center gap-2">
          {fristText && (
            <span className="whitespace-nowrap rounded-full bg-status-warn-light px-2.5 py-[3px] text-[11px] font-semibold text-status-warn">
              {fristText}
            </span>
          )}
          {widerspruch ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
              <MessageSquareX aria-hidden size={12} /> widersprochen
            </span>
          ) : liked ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-ok">
              <ThumbsUp aria-hidden size={12} fill="currentColor" /> gemerkt
            </span>
          ) : null}
        </span>
        <FeedbackControls hinweisId={hinweis.id} variant="card" />
      </div>
    </div>
  );
}

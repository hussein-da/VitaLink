"use client";

import Link from "next/link";
import { Ban, ChevronRight } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { useT } from "@/i18n/useT";
import { kategorieFuer } from "@/lib/kategorie";
import { dringlichkeitsBadge } from "@/lib/dringlichkeit";

/**
 * Kompakte, soft-getönte Kategorie-Karte. Reine Navigation → Detailseite.
 * Die Rückmeldung (👍/👎/×) liegt bewusst NICHT mehr hier (Kategorie-Ebene),
 * sondern eine Ebene tiefer an den konkreten Empfehlungen (SmartTippCard).
 */
export default function HinweisCard({ hinweis }: { hinweis: Hinweis }) {
  const { isSourceEnabled } = useSettings();
  const { locale } = useT();
  const k = kategorieFuer(hinweis.szenario, locale);
  const Icon = k.icon;

  const abgeschaltet = hinweis.genutzteQuellen.filter((key) => !isSourceEnabled(key));
  const beeinträchtigt = abgeschaltet.length > 0;
  // F5: Hier stand
  //   `in ${frist.replace(" Tage", " Tagen")}`
  // - String-Chirurgie am bereits erzeugten deutschen Text, um Nominativ in
  // Dativ zu zwingen. Im Englischen haette der replace() nie gegriffen und der
  // Text waere unveraendert geblieben; ausserdem behandelte die Quelle den Fall
  // n === 1 nie ("1 Tage"). Beides erledigt jetzt dringlichkeitsBadge() ueber
  // Intl.PluralRules mit vollstaendigen Satzformen je Locale.
  const fristText = dringlichkeitsBadge(hinweis.dringlichkeit, locale);

  return (
    <Link
      href={`/hinweis/${hinweis.id}`}
      className={`block rounded-2xl ${k.soft} p-3.5 shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.98]`}
    >
      <div className="flex items-center gap-3.5">
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

        <span className="flex shrink-0 flex-col items-end gap-1.5">
          {fristText && (
            <span className="whitespace-nowrap rounded-full bg-status-warn-light px-2.5 py-[3px] text-[11px] font-semibold text-status-warn">
              {fristText}
            </span>
          )}
          <ChevronRight aria-hidden size={18} className={k.text} />
        </span>
      </div>
    </Link>
  );
}

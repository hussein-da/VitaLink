"use client";

import { Zap } from "lucide-react";
import type { KategorieIdentitaet } from "@/lib/kategorie";
import { useT } from "@/i18n/useT";

export interface InsightStatementDaten {
  haupt: string;
  kontext: string;
}

/**
 * Kraftvolle Einzelaussage über das erkannte Muster (Prompt 12, Änderung 2).
 * Ersetzt die Kausal-Ketten-Darstellung: eine Satz 18px SemiBold, ein kurzer
 * Kontexthalbsatz darunter.
 */
export default function InsightStatement({
  daten,
  k,
}: {
  daten: InsightStatementDaten;
  k: KategorieIdentitaet;
}) {
  const { t } = useT();
  const akzent = `rgb(var(--c-${k.base}))`;

  return (
    <div
      className={`mb-5 rounded-2xl ${k.soft} px-5 py-[18px]`}
      style={{ borderLeft: `4px solid ${akzent}` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Zap aria-hidden size={16} className={k.text} strokeWidth={2.5} />
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.07em]"
          style={{ color: "rgb(var(--c-muted))" }}
        >
          {t.insightDetail.patternLabel}
        </span>
      </div>
      <p className="text-[18px] font-semibold leading-[1.4] text-ink">{daten.haupt}</p>
      <p className="mt-1.5 text-[12px] text-muted">{daten.kontext}</p>
    </div>
  );
}

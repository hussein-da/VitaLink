"use client";

import { Info } from "lucide-react";
import { useT } from "@/i18n/useT";

/**
 * DF2: Bei unsicheren Hinweisen sichtbares, ruhiges Label (kein Alarmrot).
 * Macht klar: Hinweis, keine Diagnose - und verweist auf ärztliche Abklärung.
 */
export default function UncertaintyBadge() {
  const { t } = useT();
  return (
    <div
      role="note"
      aria-label={t.insightDetail.uncertaintyAriaLabel}
      className="flex items-start gap-2 rounded-xl border border-accent/40 bg-accent-soft px-3 py-2.5"
    >
      <Info aria-hidden size={20} className="mt-0.5 shrink-0 text-accent-ink" />
      <p className="text-sm text-accent-ink">
        <span className="font-semibold">{t.insightDetail.uncertaintyLead}</span>{" "}
        {t.insightDetail.uncertaintyBody}
      </p>
    </div>
  );
}

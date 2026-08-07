"use client";

import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { VorsorgeTermin } from "@/lib/types";
import { useT } from "@/i18n/useT";

/**
 * Vorsorge-Termin-Zeile (Status-Icon + Titel + Daten). Geteilt zwischen der
 * Hinweis-Detailseite ("Ähnliche Termine") und der /termine-Übersicht, damit
 * beide Stellen exakt gleich aussehen. ok → grün, sonst Orange (kein Alarmrot).
 */
export default function VorsorgeTerminZeile({ t }: { t: VorsorgeTermin }) {
  // Der Prop heisst bereits `t` (Termin) - das Woerterbuch bekommt daher `txt`.
  const { t: txt } = useT();
  const Icon = t.status === "ok" ? CheckCircle : t.status === "bald" ? Clock : AlertCircle;
  const iconClass = t.status === "ok" ? "text-status-ok" : "text-accent-ink";
  return (
    <div className="flex min-h-[44px] items-start gap-2.5 border-b border-border py-3 last:border-b-0">
      <Icon aria-hidden size={16} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <div>
        <p className="text-[14px] font-semibold text-ink">{t.titel}</p>
        <p className="text-[12px] text-muted">
          {t.zuletzt && txt.insightDetail.appointmentLast(t.zuletzt)}
          {t.zuletzt && t.naechstes && " · "}
          {t.naechstes && txt.insightDetail.appointmentNext(t.naechstes)}
        </p>
      </div>
    </div>
  );
}

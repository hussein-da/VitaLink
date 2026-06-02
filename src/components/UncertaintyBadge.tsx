import { Info } from "lucide-react";

/**
 * DF2: Bei unsicheren Hinweisen sichtbares, ruhiges Label (kein Alarmrot).
 * Macht klar: Hinweis, keine Diagnose - und verweist auf ärztliche Abklärung.
 */
export default function UncertaintyBadge() {
  return (
    <div
      role="note"
      aria-label="Unsicherheits-Hinweis"
      className="flex items-start gap-2 rounded-xl border border-accent/40 bg-accent-soft px-3 py-2.5"
    >
      <Info aria-hidden size={20} className="mt-0.5 shrink-0 text-accent-ink" />
      <p className="text-sm text-accent-ink">
        <span className="font-semibold">Hinweis, keine Diagnose.</span> Die Modellkonfidenz ist hier
        niedrig. Bitte den Wert bei Fragen oder anhaltenden Beschwerden ärztlich abklären lassen.
      </p>
    </div>
  );
}

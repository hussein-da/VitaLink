"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { objectionReasonLabel } from "@/lib/objections";
import ObjectionDialog from "@/components/ObjectionDialog";

/**
 * Rückmeldung je Empfehlung: 👍 „gemerkt" (Like) und 👎 „passt nicht"
 * (öffnet den DF12-Widerspruchs-Dialog). Beide schließen sich gegenseitig aus.
 * - variant "card":   kompakte Icon-Buttons (Footer der Empfehlungskarte)
 * - variant "detail": große Buttons + Status-Box (Detailseite)
 */
export default function FeedbackControls({
  hinweisId,
  variant = "card",
}: {
  hinweisId: string;
  variant?: "card" | "detail";
}) {
  const { isLiked, toggleLike, getObjection, removeObjection } = useSettings();
  const liked = isLiked(hinweisId);
  const objection = getObjection(hinweisId);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (variant === "card") {
    return (
      <>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleLike(hinweisId)}
            aria-pressed={liked}
            aria-label={liked ? "Gemerkt aufheben" : "Empfehlung merken"}
            className={`tap flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              liked ? "bg-status-ok-light text-status-ok" : "bg-surface/70 text-muted"
            }`}
          >
            <ThumbsUp aria-hidden size={16} {...(liked ? { fill: "currentColor" } : {})} />
          </button>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            aria-pressed={Boolean(objection)}
            aria-label={objection ? "Widerspruch ändern" : "Passt nicht zu mir"}
            className={`tap flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              objection ? "bg-accent-soft text-accent-ink" : "bg-surface/70 text-muted"
            }`}
          >
            <ThumbsDown aria-hidden size={16} {...(objection ? { fill: "currentColor" } : {})} />
          </button>
        </div>
        <ObjectionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} hinweisId={hinweisId} />
      </>
    );
  }

  // ── Detail-Variante ──
  return (
    <div>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => toggleLike(hinweisId)}
          aria-pressed={liked}
          className={`tap flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium transition-colors ${
            liked
              ? "border-status-ok/40 bg-status-ok-light text-status-ok"
              : "border-border bg-surface text-ink hover:border-primary"
          }`}
        >
          <ThumbsUp aria-hidden size={18} {...(liked ? { fill: "currentColor" } : {})} />
          {liked ? "Gemerkt" : "Merken"}
        </button>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          aria-pressed={Boolean(objection)}
          className={`tap flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium transition-colors ${
            objection
              ? "border-accent/40 bg-accent-soft text-accent-ink"
              : "border-border bg-surface text-ink hover:border-primary"
          }`}
        >
          <ThumbsDown aria-hidden size={18} {...(objection ? { fill: "currentColor" } : {})} />
          {objection ? "Widersprochen" : "Passt nicht"}
        </button>
      </div>

      {objection && (
        <div className="mt-3 rounded-xl border border-accent/40 bg-accent-soft p-4">
          <p className="text-sm text-accent-ink">
            Grund: {objectionReasonLabel[objection.reason]}
            {objection.freitext ? ` – „${objection.freitext}"` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="tap rounded-lg border border-border bg-surface px-4 text-base font-medium text-ink"
            >
              Ändern
            </button>
            <button
              type="button"
              onClick={() => removeObjection(hinweisId)}
              className="tap rounded-lg border border-border bg-surface px-4 text-base font-medium text-ink"
            >
              Widerspruch zurücknehmen
            </button>
          </div>
        </div>
      )}

      {liked && !objection && (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-status-ok">
          <Check aria-hidden size={15} /> Du hast dir diese Empfehlung gemerkt.
        </p>
      )}

      <ObjectionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} hinweisId={hinweisId} />
    </div>
  );
}

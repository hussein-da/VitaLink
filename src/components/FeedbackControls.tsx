"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import ObjectionDialog from "@/components/ObjectionDialog";

/**
 * Rückmeldung je konkreter Empfehlung: 👍 „gemerkt" (Like) und 👎 „passt nicht"
 * (öffnet den DF12-Widerspruchs-Dialog). Beide schließen sich gegenseitig aus.
 * `id` ist die ID der bewerteten Empfehlung (SmartTipp-ID).
 */
export default function FeedbackControls({ id }: { id: string }) {
  const { isLiked, toggleLike, getObjection } = useSettings();
  const liked = isLiked(id);
  const objection = getObjection(id);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => toggleLike(id)}
          aria-pressed={liked}
          aria-label={liked ? "Gemerkt aufheben" : "Empfehlung merken"}
          className={`tap flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            liked ? "bg-status-ok-light text-status-ok" : "bg-surface-2 text-muted"
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
            objection ? "bg-accent-soft text-accent-ink" : "bg-surface-2 text-muted"
          }`}
        >
          <ThumbsDown aria-hidden size={16} {...(objection ? { fill: "currentColor" } : {})} />
        </button>
      </div>
      <ObjectionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} id={id} />
    </>
  );
}

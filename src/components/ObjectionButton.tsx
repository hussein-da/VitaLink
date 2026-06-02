"use client";

import { useState } from "react";
import { ThumbsDown, Check } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { useSettings } from "@/context/SettingsContext";
import { objectionReasons, objectionReasonLabel } from "@/lib/objections";
import type { ObjectionReason } from "@/lib/types";

/**
 * DF12: "Diese Empfehlung passt nicht zu mir". Öffnet einen Dialog mit drei
 * vordefinierten Gründen plus optionalem Freitext. Auswahl wird im
 * SettingsContext (+localStorage) gespeichert; der Hinweis wird als
 * "widersprochen" markiert. Bereits gespeicherter Widerspruch ist hier löschbar.
 */
export default function ObjectionButton({ hinweisId }: { hinweisId: string }) {
  const { getObjection, addObjection, removeObjection } = useSettings();
  const bestehend = getObjection(hinweisId);

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ObjectionReason | null>(null);
  const [freitext, setFreitext] = useState("");

  function öffnen() {
    setReason(bestehend?.reason ?? null);
    setFreitext(bestehend?.freitext ?? "");
    setOpen(true);
  }

  function speichern() {
    if (!reason) return;
    addObjection(hinweisId, reason, freitext);
    setOpen(false);
  }

  return (
    <div>
      {bestehend ? (
        <div className="rounded-xl border border-accent/40 bg-accent-soft p-4">
          <p className="flex items-center gap-2 font-semibold text-accent-ink">
            <Check aria-hidden size={18} /> Du hast dieser Empfehlung widersprochen
          </p>
          <p className="mt-1 text-sm text-accent-ink">
            Grund: {objectionReasonLabel[bestehend.reason]}
            {bestehend.freitext ? ` - "${bestehend.freitext}"` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={öffnen}
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
      ) : (
        <button
          type="button"
          onClick={öffnen}
          className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 font-medium text-ink hover:border-primary"
        >
          <ThumbsDown aria-hidden size={18} className="text-muted" />
          Diese Empfehlung passt nicht zu mir
        </button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Empfehlung passt nicht zu mir">
        <fieldset>
          <legend className="mb-2 text-sm text-muted">
            Warum passt dieser Hinweis nicht zu dir? Deine Angabe bleibt nur auf diesem Gerät.
          </legend>
          <div className="space-y-1">
            {objectionReasons.map((r) => (
              <label
                key={r.value}
                className="tap flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
              >
                <input
                  type="radio"
                  name="objection-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="h-5 w-5 accent-primary"
                />
                <span className="text-ink">{r.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block">
          <span className="text-sm text-muted">Optionaler Freitext</span>
          <textarea
            value={freitext}
            onChange={(e) => setFreitext(e.target.value)}
            rows={3}
            placeholder="Optional: in eigenen Worten ..."
            className="mt-1 w-full rounded-lg border border-border bg-surface p-2 text-base text-ink outline-none focus-visible:border-primary"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="tap rounded-lg border border-border bg-surface px-4 font-medium text-ink"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={speichern}
            disabled={!reason}
            className="tap rounded-lg bg-primary px-5 font-semibold text-primary-ink disabled:opacity-50"
          >
            Speichern
          </button>
        </div>
      </Dialog>
    </div>
  );
}

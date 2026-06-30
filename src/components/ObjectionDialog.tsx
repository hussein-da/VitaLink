"use client";

import { useEffect, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { useSettings } from "@/context/SettingsContext";
import { objectionReasons } from "@/lib/objections";
import type { ObjectionReason } from "@/lib/types";

/**
 * Wiederverwendbarer DF12-Dialog ("Diese Empfehlung passt nicht zu mir"):
 * drei vordefinierte Gründe + optionaler Freitext. Wird sowohl von den
 * Empfehlungskarten (👎) als auch von der Detailseite genutzt. Auswahl landet
 * im SettingsContext (+localStorage).
 */
export default function ObjectionDialog({
  open,
  onClose,
  hinweisId,
}: {
  open: boolean;
  onClose: () => void;
  hinweisId: string;
}) {
  const { getObjection, addObjection } = useSettings();
  const [reason, setReason] = useState<ObjectionReason | null>(null);
  const [freitext, setFreitext] = useState("");

  // Beim Öffnen mit dem ggf. bestehenden Widerspruch vorbelegen.
  useEffect(() => {
    if (!open) return;
    const bestehend = getObjection(hinweisId);
    setReason(bestehend?.reason ?? null);
    setFreitext(bestehend?.freitext ?? "");
  }, [open, hinweisId, getObjection]);

  function speichern() {
    if (!reason) return;
    addObjection(hinweisId, reason, freitext);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Rückmeldung geben">
      <fieldset>
        <legend className="mb-2 text-[15px] text-ink-2">
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
        <span className="text-[14px] font-medium text-ink-2">Optionaler Freitext</span>
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
          onClick={onClose}
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
  );
}

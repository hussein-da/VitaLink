"use client";

import { useState } from "react";
import { abkuerzungKuerzel } from "@/data/abkuerzungen";
import { useNutzerAbkuerzungen, type NutzerAbkuerzung } from "@/lib/abkuerzung";
import { useT } from "@/i18n/useT";

/**
 * Zweites Bottom-Sheet (über dem Glossar): eigene Abkürzung hinzufügen
 * (Badge 2.3, Block 7). Live-Validierung, Zeichenzähler, Duplikat-Check.
 */
export default function AddAbkuerzungSheet({
  vorbelegung,
  bestehendeKuerzel,
  onClose,
  onAdded,
}: {
  vorbelegung?: string;
  bestehendeKuerzel: string[];
  onClose: () => void;
  onAdded: (e: NutzerAbkuerzung) => void;
}) {
  const { hinzufuegen } = useNutzerAbkuerzungen();
  const { t, fmt } = useT();
  const [kuerzel, setKuerzel] = useState((vorbelegung ?? "").toUpperCase().slice(0, 12));
  const [ausgeschrieben, setAusgeschrieben] = useState("");
  const [erklaerung, setErklaerung] = useState("");

  // Die Duplikat-Prüfung ist locale-unabhängig: geprüft wird gegen die Kürzel,
  // und die sind in beiden Sprachständen dieselben (HRV, HbA1c, mmHg …).
  const vorhanden = new Set([
    ...abkuerzungKuerzel,
    ...bestehendeKuerzel.map((k) => k.toLowerCase()),
  ]);
  const kuerzelTrim = kuerzel.trim();
  const dublette = kuerzelTrim.length > 0 && vorhanden.has(kuerzelTrim.toLowerCase());

  // R3: die Fehlertexte entstehen im Render, damit ein Sprachwechsel sie erreicht.
  let fehler: string | null = null;
  if (kuerzelTrim.length === 0) fehler = t.profileArea.addAbbrErrorShortMissing;
  else if (ausgeschrieben.trim().length === 0) fehler = t.profileArea.addAbbrErrorLongMissing;
  else if (dublette) fehler = t.profileArea.addAbbrErrorDuplicate(kuerzelTrim);

  const valide = fehler === null;

  const speichern = () => {
    if (!valide) return;
    hinzufuegen({ kuerzel: kuerzelTrim, ausgeschrieben: ausgeschrieben.trim(), erklaerung: erklaerung.trim() });
    onAdded({
      id: `u-${Date.now()}`,
      kuerzel: kuerzelTrim,
      ausgeschrieben: ausgeschrieben.trim(),
      erklaerung: erklaerung.trim(),
      kategorie: "nutzerdefiniert",
      vordefiniert: false,
      erstellt: "2026-06-29",
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label={t.profileArea.addAbbrTitle}
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-[61] mx-auto max-w-frame overflow-y-auto rounded-t-[28px] bg-surface px-4 pb-safe pt-3"
        style={{ maxHeight: "85vh", boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
      >
        <div className="mx-auto mb-4 h-[2px] w-9 rounded-full bg-border-strong" />
        <p className="text-[17px] font-semibold text-ink">{t.profileArea.addAbbrTitle}</p>
        <p className="mb-5 mt-1 text-[13px] text-muted">{t.profileArea.addAbbrIntro}</p>

        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
          {t.profileArea.addAbbrShortLabel}
        </label>
        <div className="relative mb-3">
          <input
            value={kuerzel}
            onChange={(e) => setKuerzel(e.target.value.toUpperCase().slice(0, 12))}
            placeholder={t.profileArea.addAbbrShortPlaceholder}
            className="tap w-full rounded-xl bg-surface-2 px-3.5 py-3 text-[16px] text-ink placeholder:text-muted focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted">
            {t.profileArea.addAbbrCharCount(fmt.number(kuerzel.length), fmt.number(12))}
          </span>
        </div>

        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
          {t.profileArea.addAbbrLongLabel}
        </label>
        <div className="relative mb-3">
          <input
            value={ausgeschrieben}
            onChange={(e) => setAusgeschrieben(e.target.value.slice(0, 80))}
            placeholder={t.profileArea.addAbbrLongPlaceholder}
            className="tap w-full rounded-xl bg-surface-2 px-3.5 py-3 text-[16px] text-ink placeholder:text-muted focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted">
            {t.profileArea.addAbbrCharCount(fmt.number(ausgeschrieben.length), fmt.number(80))}
          </span>
        </div>

        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
          {t.profileArea.addAbbrExplanationLabel}
        </label>
        <textarea
          value={erklaerung}
          onChange={(e) => setErklaerung(e.target.value.slice(0, 200))}
          placeholder={t.profileArea.addAbbrExplanationPlaceholder}
          className="min-h-[80px] w-full rounded-xl bg-surface-2 px-3.5 py-3 text-[15px] text-ink placeholder:text-muted focus:outline-none"
        />

        {fehler && kuerzelTrim.length > 0 && (
          <p className="mt-2 text-[12px] text-status-warn">{fehler}</p>
        )}

        <div className="mt-5 flex flex-col gap-2.5 pb-4">
          <button
            type="button"
            disabled={!valide}
            onClick={speichern}
            className={`tap w-full rounded-xl bg-cat-travel px-4 py-3.5 text-[15px] font-semibold text-cat-travel-on ${
              valide ? "" : "pointer-events-none opacity-40"
            }`}
          >
            {t.profileArea.addAbbrSubmit}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="tap w-full rounded-xl bg-surface-2 px-4 py-3.5 text-[15px] font-semibold text-ink"
          >
            {t.profileArea.addAbbrCancel}
          </button>
        </div>
      </div>
    </>
  );
}

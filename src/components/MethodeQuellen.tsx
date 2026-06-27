"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MethodePunkt } from "@/data/smartTipps";

/**
 * „Methode und Datenquellen" (Prompt 11, Problem 5): standardmäßig eingeklappt.
 * Aufgeklappt steht je Datenpunkt eine nützliche Kurzinfo in zwei Zeilen –
 * Quelle (woher) und konkreter Wert mit Kontext –, statt technischer Metadaten.
 */
export default function MethodeQuellen({ punkte }: { punkte: MethodePunkt[] }) {
  const [offen, setOffen] = useState(false);

  if (punkte.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-surface-2">
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        className="tap flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-[14px] font-semibold text-ink">Methode und Datenquellen</span>
        <ChevronDown
          aria-hidden
          size={20}
          className={`shrink-0 text-ink-2 transition-transform ${offen ? "rotate-180" : ""}`}
        />
      </button>

      {offen && (
        <ul className="reveal space-y-3.5 px-4 pb-4">
          {punkte.slice(0, 4).map((p) => (
            <li key={p.titel}>
              <p className="text-[14px] text-ink-2">
                <span className="font-semibold text-ink">{p.titel}:</span> {p.quelle}
              </p>
              <p className="text-[14px] text-ink">{p.wert}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GlossarText } from "@/components/GlossarTerm";

type Tiefe = "kurz" | "begruendung" | "detail";

/**
 * DF3: drei Erklaertiefen als Accordion - Kurz / Begruendung / Detail.
 * Standardmaessig ist "Kurz" geoeffnet. Fachbegriffe im Text sind antippbar (DF8).
 */
export default function ExplanationPanel({
  kurz,
  begruendung,
  detail,
}: {
  kurz: string;
  begruendung: string;
  detail: string;
}) {
  const [offen, setOffen] = useState<Record<Tiefe, boolean>>({
    kurz: true,
    begruendung: false,
    detail: false,
  });

  const sektionen: { key: Tiefe; titel: string; text: string }[] = [
    { key: "kurz", titel: "Kurz", text: kurz },
    { key: "begruendung", titel: "Begruendung", text: begruendung },
    { key: "detail", titel: "Detail (Methode & Datenquellen)", text: detail },
  ];

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {sektionen.map((s) => {
        const istOffen = offen[s.key];
        const panelId = `expl-${s.key}`;
        return (
          <div key={s.key}>
            <h3>
              <button
                type="button"
                aria-expanded={istOffen}
                aria-controls={panelId}
                onClick={() => setOffen((o) => ({ ...o, [s.key]: !o[s.key] }))}
                className="tap flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="font-semibold text-ink">{s.titel}</span>
                <ChevronDown
                  aria-hidden
                  size={20}
                  className={`shrink-0 text-muted transition-transform ${
                    istOffen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            {istOffen && (
              <div id={panelId} className="reveal px-4 pb-4 leading-relaxed text-ink">
                <GlossarText>{s.text}</GlossarText>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

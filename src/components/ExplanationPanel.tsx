"use client";

import { useState } from "react";
import { GlossarText } from "@/components/GlossarTerm";

type Tiefe = "kurz" | "begruendung" | "detail";

/**
 * DF3: drei Erklärtiefen als Step-Indicator (§3c) – Kurz / Begründung / Detail.
 * Genau eine Tiefe ist sichtbar, die aktive Stufe ist in --c-primary-soft
 * hervorgehoben. Standardmäßig ist "Kurz" aktiv. Fachbegriffe im Text sind
 * antippbar (DF8). Die Texte selbst bleiben inhaltlich unverändert.
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
  const [aktiv, setAktiv] = useState<Tiefe>("kurz");

  const sektionen: { key: Tiefe; titel: string; caption?: string; text: string }[] = [
    { key: "kurz", titel: "Kurz", text: kurz },
    { key: "begruendung", titel: "Begründung", text: begruendung },
    {
      key: "detail",
      titel: "Detail",
      caption: "Methode & Datenquellen",
      text: detail,
    },
  ];

  const aktuell = sektionen.find((s) => s.key === aktiv)!;

  return (
    <div>
      {/* Stufen-Anzeige: drei verbundene Schritte */}
      <div
        role="group"
        aria-label="Erklärtiefe wählen"
        className="flex gap-1 rounded-xl bg-surface-2 p-1"
      >
        {sektionen.map((s, i) => {
          const istAktiv = s.key === aktiv;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={istAktiv}
              onClick={() => setAktiv(s.key)}
              className={`tap flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                istAktiv
                  ? "bg-primary-soft text-primary ring-1 ring-primary/25"
                  : "text-muted hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  istAktiv ? "bg-primary text-primary-ink" : "bg-surface text-muted"
                }`}
              >
                {i + 1}
              </span>
              {s.titel}
            </button>
          );
        })}
      </div>

      {/* Aktiver Erklärtext – luftig gesetzt (§3d: 16px, line-height 1.65) */}
      <div className="reveal mt-4">
        {aktuell.caption && (
          <p className="section-label mb-2">{aktuell.caption}</p>
        )}
        <div className="text-[16px] leading-[1.65] text-ink">
          <GlossarText>{aktuell.text}</GlossarText>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Hinweis } from "@/lib/types";
import { kategorie } from "@/lib/kategorie";
import { GlossarText } from "@/components/GlossarTerm";

type Tiefe = "kurz" | "begruendung" | "detail";

/**
 * DF3: drei Erklärtiefen als Step-Indicator – Kurz / Begründung / Detail.
 * Genau eine Tiefe ist sichtbar (kein Accordion), der aktive Schritt trägt die
 * Kategorie-Farbe. Standard ist "Kurz". Fachbegriffe (DF8) bleiben antippbar,
 * die Texte selbst inhaltlich unverändert.
 */
export default function ExplanationPanel({
  szenario,
  kurz,
  begruendung,
  detail,
}: {
  szenario: Hinweis["szenario"];
  kurz: string;
  begruendung: string;
  detail: string;
}) {
  const [aktiv, setAktiv] = useState<Tiefe>("kurz");
  const k = kategorie(szenario);

  const sektionen: { key: Tiefe; titel: string; caption?: string; text: string }[] = [
    { key: "kurz", titel: "Kurz", text: kurz },
    { key: "begruendung", titel: "Begründung", text: begruendung },
    { key: "detail", titel: "Detail", caption: "Methode & Datenquellen", text: detail },
  ];

  const aktuell = sektionen.find((s) => s.key === aktiv)!;

  return (
    <div>
      <div role="group" aria-label="Erklärtiefe wählen" className="flex gap-1 rounded-xl bg-surface-2 p-1">
        {sektionen.map((s, i) => {
          const istAktiv = s.key === aktiv;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={istAktiv}
              onClick={() => setAktiv(s.key)}
              className={`tap flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                istAktiv ? `${k.soft} ${k.text}` : "text-muted hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold ${
                  istAktiv ? k.text : "text-muted"
                }`}
              >
                {i + 1}
              </span>
              {s.titel}
            </button>
          );
        })}
      </div>

      <div className="reveal mt-4">
        {aktuell.caption && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            {aktuell.caption}
          </p>
        )}
        <div className="text-[16px] leading-[1.65] text-ink">
          <GlossarText>{aktuell.text}</GlossarText>
        </div>
      </div>
    </div>
  );
}

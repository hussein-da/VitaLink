"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { kategorie } from "@/lib/kategorie";
import { GlossarText } from "@/components/GlossarTerm";

/**
 * DF3: drei Erklärtiefen (PROTECTED CORE / RQ1-Stimulus). Inhaltlich unverändert –
 * neu präsentiert als aufeinanderfolgende Sektionen statt Tabs: „Kurzfassung“
 * ist immer offen, „Begründung“ und „Detailansicht“ sind standardmäßig
 * eingeklappt und per Tipp aufklappbar. Alle Texte bleiben in voller Länge
 * erhalten; Fachbegriffe (DF8) bleiben antippbar. Das Aufklappen folgt dem
 * App-weiten Reveal-Muster und respektiert prefers-reduced-motion.
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
  const k = kategorie(szenario);
  const [begruendungOffen, setBegruendungOffen] = useState(false);
  const [detailOffen, setDetailOffen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Kurzfassung – immer sichtbar */}
      <div className="rounded-2xl bg-surface-2 p-4">
        <p className={`mb-2 text-[12px] font-bold uppercase tracking-[0.06em] ${k.text}`}>
          Kurzfassung
        </p>
        <div className="text-[16px] leading-[1.65] text-ink">
          <GlossarText>{kurz}</GlossarText>
        </div>
      </div>

      {/* Begründung – standardmäßig eingeklappt */}
      <Akkordeon
        label="Begründung"
        offen={begruendungOffen}
        onToggle={() => setBegruendungOffen((o) => !o)}
        akzent={k.text}
      >
        <GlossarText>{begruendung}</GlossarText>
      </Akkordeon>

      {/* Detailansicht – standardmäßig eingeklappt */}
      <Akkordeon
        label="Detailansicht"
        caption="Methode & Datenquellen"
        offen={detailOffen}
        onToggle={() => setDetailOffen((o) => !o)}
        akzent={k.text}
      >
        <GlossarText>{detail}</GlossarText>
      </Akkordeon>
    </div>
  );
}

function Akkordeon({
  label,
  caption,
  offen,
  onToggle,
  akzent,
  children,
}: {
  label: string;
  caption?: string;
  offen: boolean;
  onToggle: () => void;
  akzent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={offen}
        className="tap flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex flex-col">
          <span className={`text-[12px] font-bold uppercase tracking-[0.06em] ${offen ? akzent : "text-ink-2"}`}>
            {label}
          </span>
          {caption && !offen && (
            <span className="mt-0.5 text-[13px] text-ink-2">{caption}</span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          size={20}
          className={`shrink-0 text-ink-2 transition-transform ${offen ? "rotate-180" : ""}`}
        />
      </button>
      {offen && (
        <div className="reveal px-4 pb-4">
          {caption && (
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-2">
              {caption}
            </p>
          )}
          <div className="text-[16px] leading-[1.65] text-ink">{children}</div>
        </div>
      )}
    </div>
  );
}

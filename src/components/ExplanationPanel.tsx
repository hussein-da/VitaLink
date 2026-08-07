"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird von keiner Route
// importiert und erscheint in keinem Screen. Der Code wird gepflegt und
// zweisprachig gehalten.

import { useState } from "react";
import type { Hinweis } from "@/lib/types";
import { useT } from "@/i18n/useT";
import { kategorieFuer } from "@/lib/kategorie";
import { GlossarText } from "@/components/GlossarTerm";

/**
 * DF3: drei Erklärtiefen (PROTECTED CORE / RQ1-Stimulus). Inhaltlich unverändert –
 * neu präsentiert als fließender Textblock (Prompt 11, Problem 5): Die
 * Kurzfassung ist immer sichtbar, „Begründung" und „Detailansicht" hängen als
 * dezente Inline-Toggles am Text und klappen direkt darunter auf. Alle Texte
 * bleiben in voller Länge; Fachbegriffe (DF8) bleiben antippbar. Das Aufklappen
 * folgt dem App-weiten Reveal-Muster und respektiert prefers-reduced-motion.
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
  const { t, locale } = useT();
  const k = kategorieFuer(szenario, locale);
  const akzent = `rgb(var(--c-${k.base}))`;
  const [begruendungOffen, setBegruendungOffen] = useState(false);
  const [detailOffen, setDetailOffen] = useState(false);

  return (
    <div className="text-[16px] leading-[1.65] text-ink">
      {/* Kurzfassung – immer sichtbar */}
      <p>
        <GlossarText>{kurz}</GlossarText>
      </p>

      {/* Begründung – Toggle, Inhalt klappt direkt darunter auf */}
      <Toggle
        offen={begruendungOffen}
        onToggle={() => setBegruendungOffen((o) => !o)}
        labelZu={t.orphaned.explanationPanel.openReasoning}
        labelAuf={t.orphaned.explanationPanel.collapse}
        akzent={akzent}
      />
      {begruendungOffen && (
        <p className="reveal mt-2">
          <GlossarText>{begruendung}</GlossarText>
        </p>
      )}

      {/* Detailansicht – Toggle, Inhalt klappt direkt darunter auf */}
      <Toggle
        offen={detailOffen}
        onToggle={() => setDetailOffen((o) => !o)}
        labelZu={t.orphaned.explanationPanel.openDetail}
        labelAuf={t.orphaned.explanationPanel.collapse}
        akzent={akzent}
      />
      {detailOffen && (
        <p className="reveal mt-2">
          <GlossarText>{detail}</GlossarText>
        </p>
      )}
    </div>
  );
}

function Toggle({
  offen,
  onToggle,
  labelZu,
  labelAuf,
  akzent,
}: {
  offen: boolean;
  onToggle: () => void;
  /** Beschriftung im zugeklappten Zustand (bereits uebersetzt). */
  labelZu: string;
  /** Beschriftung im aufgeklappten Zustand (bereits uebersetzt). */
  labelAuf: string;
  akzent: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={offen}
      className="tap mt-2 flex items-center gap-1 text-[13px] font-medium text-muted"
    >
      <span aria-hidden className="text-[15px] font-bold leading-none" style={{ color: akzent }}>
        {offen ? "–" : "+"}
      </span>
      {offen ? labelAuf : labelZu}
    </button>
  );
}

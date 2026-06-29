"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import type { GlossarEintrag } from "@/lib/types";
import { glossarMap, glossarTerms } from "@/data/glossar";
import SmartPopover from "@/components/ui/SmartPopover";

function useIstTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  return touch;
}

/** Vorlesen-Button (Web Speech API), nur wenn verfügbar (Badge 2.4, Block 4). */
function VorlesenButton({ text }: { text: string }) {
  const [aktiv, setAktiv] = useState(false);
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const toggle = () => {
    if (aktiv) {
      window.speechSynthesis.cancel();
      setAktiv(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.9;
    u.onend = () => setAktiv(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setAktiv(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="tap mt-3.5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-surface-2 px-4 py-3 text-[14px] font-semibold"
    >
      {aktiv ? (
        <>
          <VolumeX aria-hidden size={16} className="text-cat-lifestyle" />
          <span className="text-cat-lifestyle">Stopp</span>
        </>
      ) : (
        <>
          <Volume2 aria-hidden size={16} className="text-muted" />
          <span className="text-muted">Vorlesen</span>
        </>
      )}
    </button>
  );
}

/**
 * Einzelner Fachbegriff (DF8): gestrichelt unterstrichen, antippbar.
 * Touch-Gerät → Bottom-Sheet (mit Vorlesen); sonst Popover/Tooltip (Badge 2.4).
 */
export function GlossarTerm({ term, eintrag }: { term: string; eintrag: GlossarEintrag }) {
  const istTouch = useIstTouch();
  const [offen, setOffen] = useState(false);

  if (istTouch) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOffen(true)}
          className="cursor-help font-medium text-primary underline decoration-dashed decoration-1 underline-offset-2"
        >
          {term}
        </button>
        {offen && (
          <>
            <div className="fixed inset-0 z-[60] bg-black/30" onClick={() => setOffen(false)} aria-hidden />
            <div
              role="dialog"
              aria-label={eintrag.term}
              aria-modal="true"
              className="fixed bottom-0 left-0 right-0 z-[61] mx-auto max-h-[60vh] max-w-frame overflow-y-auto rounded-t-[28px] bg-surface px-5 pb-safe pt-3"
              style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
            >
              <div className="mx-auto mb-3 h-[2px] w-9 rounded-full bg-border-strong" />
              <div className="flex items-start justify-between gap-3">
                <span className="text-[20px] font-bold text-cat-travel">{eintrag.term}</span>
                <button type="button" onClick={() => setOffen(false)} aria-label="Schließen" className="tap text-muted">
                  <X aria-hidden size={20} />
                </button>
              </div>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-ink">{eintrag.kurz}</p>
              <VorlesenButton text={`${eintrag.term}. ${eintrag.kurz}`} />
              <div className="h-4" />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <SmartPopover
      anchor={
        <button
          type="button"
          className="cursor-help font-medium text-primary underline decoration-dashed decoration-1 underline-offset-2"
        >
          {term}
        </button>
      }
      content={
        <>
          <span className="mb-0.5 block font-semibold text-primary">{eintrag.term}</span>
          {eintrag.kurz}
        </>
      }
      role="tooltip"
      className="reveal z-30 w-64 max-w-[80vw] rounded-xl border border-border bg-surface p-3 text-sm font-normal leading-relaxed text-ink shadow-xl"
    />
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const pattern = glossarTerms.map(escapeRegExp).join("|");
const splitter = pattern ? new RegExp(`\\b(${pattern})\\b`, "gi") : null;

/**
 * Wrappt einen Text: erkennt bekannte Fachbegriffe und macht sie als
 * GlossarTerm antippbar. Lässt den restlichen Text unverändert.
 */
export function GlossarText({ children }: { children: string }): ReactNode {
  if (!splitter) return children;
  const parts = children.split(splitter);
  return (
    <>
      {parts.map((part, i) => {
        const eintrag = glossarMap[part.toLowerCase()];
        if (i % 2 === 1 && eintrag) {
          return <GlossarTerm key={i} term={part} eintrag={eintrag} />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

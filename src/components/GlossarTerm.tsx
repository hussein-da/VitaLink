"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import type { GlossarEintrag } from "@/lib/types";
import { glossarMap, glossarTerms } from "@/data/glossar";

/**
 * Einzelner Fachbegriff (DF8): gestrichelt unterstrichen, antippbar.
 * Antippen oeffnet die B1-Erklaerung als Popover.
 */
export function GlossarTerm({ term, eintrag }: { term: string; eintrag: GlossarEintrag }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="cursor-help font-medium text-primary underline decoration-dashed decoration-1 underline-offset-2"
      >
        {term}
      </button>
      {open && (
        <span
          role="tooltip"
          className="reveal absolute bottom-full left-0 z-30 mb-1 block w-64 max-w-[80vw] rounded-xl border border-border bg-surface p-3 text-sm font-normal leading-relaxed text-ink shadow-xl"
        >
          <span className="mb-0.5 block font-semibold text-primary">{eintrag.term}</span>
          {eintrag.kurz}
        </span>
      )}
    </span>
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const pattern = glossarTerms.map(escapeRegExp).join("|");
const splitter = pattern ? new RegExp(`\\b(${pattern})\\b`, "gi") : null;

/**
 * Wrappt einen Text: erkennt bekannte Fachbegriffe und macht sie als
 * GlossarTerm antippbar. Laesst den restlichen Text unveraendert.
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

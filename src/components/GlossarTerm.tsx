"use client";

import { Fragment, type ReactNode } from "react";
import type { GlossarEintrag } from "@/lib/types";
import { glossarMap, glossarTerms } from "@/data/glossar";
import SmartPopover from "@/components/ui/SmartPopover";

/**
 * Einzelner Fachbegriff (DF8): gestrichelt unterstrichen, antippbar.
 * Antippen öffnet die B1-Erklärung als Popover via SmartPopover
 * (kollisionsbewusst, FloatingPortal — kein overflow:hidden schneidet ab).
 *
 * TEST NOTE: Prüfe auf Viewports < 320 px und an allen vier Bildschirmrändern,
 * dass der Popover nicht abgeschnitten wird und der Button tippbar bleibt.
 */
export function GlossarTerm({ term, eintrag }: { term: string; eintrag: GlossarEintrag }) {
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

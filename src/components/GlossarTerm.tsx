"use client";

import { Fragment, useState, type ReactNode } from "react";
import Link from "next/link";
import { Volume2, VolumeX, X, BookText } from "lucide-react";
import type { GlossarEintrag } from "@/lib/types";
import { glossarMapFuer, glossarTermsFuer } from "@/data/glossar";
import { abkuerzungMap } from "@/data/abkuerzungen";
import { useSettings } from "@/context/SettingsContext";
import { useT } from "@/i18n/useT";
import { INTL_TAG, type Locale } from "@/i18n/types";

/** Vorlesen-Button (Web Speech API), nur wenn verfügbar (Badge 2.4, Block 4). */
function VorlesenButton({ text }: { text: string }) {
  const { t, locale } = useT();
  const [aktiv, setAktiv] = useState(false);
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const toggle = () => {
    if (aktiv) {
      window.speechSynthesis.cancel();
      setAktiv(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    // War hart auf "de-DE" gesetzt: die Vorlesefunktion haette englische Texte
    // mit deutscher Aussprache gelesen.
    u.lang = INTL_TAG[locale];
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
          <span className="text-cat-lifestyle">{t.glossary.stop}</span>
        </>
      ) : (
        <>
          <Volume2 aria-hidden size={16} className="text-muted" />
          <span className="text-muted">{t.glossary.readAloud}</span>
        </>
      )}
    </button>
  );
}

/**
 * Einzelner Fachbegriff (DF8): gestrichelt unterstrichen, antippbar. Öffnet
 * IMMER ein Bottom-Sheet (am Rand verankert → nie abgeschnitten), mit Vorlesen
 * und direktem Verweis in das Glossar (zeigt genau auf den Begriff).
 * Bei aktivem „Fachbegriffe ausschreiben"-Toggle wird die Langform angezeigt.
 */
export function GlossarTerm({ term, eintrag }: { term: string; eintrag: GlossarEintrag }) {
  const { abkuerzungenKompakt } = useSettings();
  const { t } = useT();
  const [offen, setOffen] = useState(false);

  const voll = abkuerzungMap[term.toLowerCase()]?.ausgeschrieben;
  const anzeige = abkuerzungenKompakt || !voll ? term : t.glossary.expanded(voll, term);

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="cursor-help font-medium text-primary underline decoration-dashed decoration-1 underline-offset-2"
      >
        {anzeige}
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
              <button type="button" onClick={() => setOffen(false)} aria-label={t.glossary.close} className="tap text-muted">
                <X aria-hidden size={20} />
              </button>
            </div>
            <p className="mt-2.5 text-[14px] leading-[1.6] text-ink">{eintrag.kurz}</p>
            <VorlesenButton text={`${eintrag.term}. ${eintrag.kurz}`} />
            <Link
              href={`/glossar?term=${encodeURIComponent(eintrag.term)}`}
              onClick={() => setOffen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-cat-travel"
            >
              <BookText aria-hidden size={14} />
              {t.glossary.openInGlossary}
            </Link>
            <div className="h-4" />
          </div>
        </>
      )}
    </>
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * F2: Der Erkennungs-Regex war eine MODULKONSTANTE aus der deutschen
 * Begriffsliste. Er entstand einmalig beim Import und konnte auf einen
 * Sprachwechsel prinzipiell nicht reagieren; im englischen Text hätte er
 * schlicht nicht mehr gegriffen und die Glossar-Popovers wären lautlos
 * verschwunden - bei grünem Build.
 *
 * Die englischen Fachbegriffe sind zudem teils ANDERE WÖRTER (systolisch ->
 * systolic, Wundstarrkrampf -> tetanus), nicht nur andere Erklärungen desselben
 * Wortlauts. Deshalb wird je Locale eine eigene Begriffsliste verwendet und der
 * Regex pro Locale memoisiert gebaut.
 *
 * Die Sortierung "längster Begriff zuerst" liefert glossarTermsFuer() je Locale
 * mit; sie ist die Kollisionsstrategie, damit ein kurzer Begriff nicht
 * innerhalb eines längeren matcht.
 */
const splitterCache = new Map<Locale, RegExp | null>();

function splitterFuer(locale: Locale): RegExp | null {
  if (splitterCache.has(locale)) return splitterCache.get(locale) ?? null;
  const terms = glossarTermsFuer(locale);
  const pattern = terms.map(escapeRegExp).join("|");
  // \b ist in JavaScript ASCII-basiert. Für deutsche Begriffe mit Umlaut greift
  // die Wortgrenze am Wortanfang daher nicht zuverlässig; die Alternation ist
  // nach Länge sortiert, was Fehltreffer in der Praxis abfängt.
  const rx = pattern ? new RegExp(`\\b(${pattern})\\b`, "gi") : null;
  splitterCache.set(locale, rx);
  return rx;
}

/**
 * Wrappt einen Text: erkennt bekannte Fachbegriffe und macht sie als
 * GlossarTerm antippbar. Lässt den restlichen Text unverändert.
 */
export function GlossarText({ children }: { children: string }): ReactNode {
  const { locale } = useT();
  const splitter = splitterFuer(locale);
  if (!splitter) return children;
  const map = glossarMapFuer(locale);
  const parts = children.split(splitter);
  return (
    <>
      {parts.map((part, i) => {
        const eintrag = map[part.toLowerCase()];
        if (i % 2 === 1 && eintrag) {
          return <GlossarTerm key={i} term={part} eintrag={eintrag} />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

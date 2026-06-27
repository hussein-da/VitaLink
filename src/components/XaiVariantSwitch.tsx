"use client";

import { useRef, useState } from "react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { kategorie } from "@/lib/kategorie";
import { GlossarText } from "@/components/GlossarTerm";
import FactorBars from "@/components/FactorBars";
import CounterfactualSlider from "@/components/CounterfactualSlider";

type Variant = "A" | "B" | "C";

const tabs: { id: Variant; label: string }[] = [
  { id: "A", label: "In Worten" },
  { id: "B", label: "Visuell" },
  { id: "C", label: "Was wäre, wenn" },
];

/**
 * RQ1: Umschalter zwischen den drei XAI-Erklärvarianten (A natürlichsprachlich,
 * B visuell, C kontrafaktisch). PROTECTED CORE – inhaltlich unverändert, neu als
 * dezente Text-Tabs (kein Box-Hintergrund, kein Rahmen): aktiv = Kategorie-Farbe
 * SemiBold mit 2px-Linie darunter, inaktiv = Regular --c-muted. Standard ist A.
 */
export default function XaiVariantSwitch({ hinweis }: { hinweis: Hinweis }) {
  const [variant, setVariant] = useState<Variant>("A");
  const { disabledSources } = useSettings();
  const k = kategorie(hinweis.szenario);
  const akzent = `rgb(var(--c-${k.base}))`;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(next: number) {
    setVariant(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    focusTab(next);
  }

  return (
    <section aria-label="Erklärvariante">
      <div role="tablist" aria-label="Erklärvariante" className="flex flex-wrap items-center gap-x-5">
        {tabs.map((t, i) => {
          const aktiv = variant === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`xai-tab-${t.id}`}
              aria-selected={aktiv}
              aria-controls={`xai-panel-${t.id}`}
              tabIndex={aktiv ? 0 : -1}
              onClick={() => setVariant(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`tap inline-flex items-center justify-center text-[15px] transition-colors ${
                aktiv ? `${k.text} font-semibold` : "font-normal text-muted hover:text-ink"
              }`}
            >
              <span
                className="pb-1"
                style={{ borderBottom: `2px solid ${aktiv ? akzent : "transparent"}` }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`xai-panel-${t.id}`}
          aria-labelledby={`xai-tab-${t.id}`}
          hidden={variant !== t.id}
          className={`mt-4 ${variant === t.id ? "reveal" : ""}`}
        >
          {t.id === "A" && (
            <p className="text-[16px] leading-[1.65] text-ink">
              <GlossarText>{hinweis.kurz}</GlossarText>
            </p>
          )}
          {t.id === "B" && (
            <>
              <FactorBars faktoren={hinweis.faktoren} disabledKeys={disabledSources} />
              {hinweis.normwertHinweis && (
                <p className="mt-3 text-[14px] text-ink-2">
                  <span className="font-medium text-ink">Referenz: </span>
                  {hinweis.normwertHinweis}
                </p>
              )}
            </>
          )}
          {t.id === "C" &&
            (hinweis.kontrafaktisch ? (
              <CounterfactualSlider data={hinweis.kontrafaktisch} />
            ) : (
              <p className="text-ink">
                Für diesen regelbasierten Hinweis ist eine kontrafaktische Betrachtung nicht
                sinnvoll.
              </p>
            ))}
        </div>
      ))}
    </section>
  );
}

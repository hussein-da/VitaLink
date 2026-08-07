"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird von keiner Route
// importiert und erscheint in keinem Screen. Die A/B/C-Variantenumschaltung ist
// nicht verkabelt. Der Code wird gepflegt und zweisprachig gehalten.

import { useRef, useState } from "react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { useT } from "@/i18n/useT";
import { kategorieFuer } from "@/lib/kategorie";
import { GlossarText } from "@/components/GlossarTerm";
import FactorBars from "@/components/FactorBars";
import CounterfactualSlider from "@/components/CounterfactualSlider";

type Variant = "A" | "B" | "C";

/**
 * RQ1: Umschalter zwischen den drei XAI-Erklärvarianten (A natürlichsprachlich,
 * B visuell, C kontrafaktisch). PROTECTED CORE – inhaltlich unverändert, neu als
 * dezente Text-Tabs (kein Box-Hintergrund, kein Rahmen): aktiv = Kategorie-Farbe
 * SemiBold mit 2px-Linie darunter, inaktiv = Regular --c-muted. Standard ist A.
 */
export default function XaiVariantSwitch({ hinweis }: { hinweis: Hinweis }) {
  const [variant, setVariant] = useState<Variant>("A");
  const { disabledSources } = useSettings();
  const { t, locale } = useT();
  // Die Tab-Beschriftungen stehen bewusst auf Render-Ebene: als Modulkonstante
  // wuerden sie einmal beim Import ausgewertet und blieben beim Sprachwechsel
  // stehen.
  const tabs: { id: Variant; label: string }[] = [
    { id: "A", label: t.orphaned.xaiSwitch.tabWords },
    { id: "B", label: t.orphaned.xaiSwitch.tabVisual },
    { id: "C", label: t.orphaned.xaiSwitch.tabWhatIf },
  ];
  const k = kategorieFuer(hinweis.szenario, locale);
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
    <section aria-label={t.orphaned.xaiSwitch.sectionAria}>
      <div
        role="tablist"
        aria-label={t.orphaned.xaiSwitch.tablistAria}
        className="flex flex-wrap items-center gap-x-5"
      >
        {tabs.map((tab, i) => {
          const aktiv = variant === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`xai-tab-${tab.id}`}
              aria-selected={aktiv}
              aria-controls={`xai-panel-${tab.id}`}
              tabIndex={aktiv ? 0 : -1}
              onClick={() => setVariant(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`tap inline-flex items-center justify-center text-[15px] transition-colors ${
                aktiv ? `${k.text} font-semibold` : "font-normal text-muted hover:text-ink"
              }`}
            >
              <span
                className="pb-1"
                style={{ borderBottom: `2px solid ${aktiv ? akzent : "transparent"}` }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`xai-panel-${tab.id}`}
          aria-labelledby={`xai-tab-${tab.id}`}
          hidden={variant !== tab.id}
          className={`mt-4 ${variant === tab.id ? "reveal" : ""}`}
        >
          {tab.id === "A" && (
            <p className="text-[16px] leading-[1.65] text-ink">
              <GlossarText>{hinweis.kurz}</GlossarText>
            </p>
          )}
          {tab.id === "B" && (
            <>
              <FactorBars faktoren={hinweis.faktoren} disabledKeys={disabledSources} />
              {hinweis.normwertHinweis && (
                <p className="mt-3 text-[14px] text-ink-2">
                  <span className="font-medium text-ink">{t.orphaned.xaiSwitch.referenceLabel}</span>{" "}
                  {hinweis.normwertHinweis}
                </p>
              )}
            </>
          )}
          {tab.id === "C" &&
            (hinweis.kontrafaktisch ? (
              <CounterfactualSlider data={hinweis.kontrafaktisch} />
            ) : (
              <p className="text-ink">{t.orphaned.xaiSwitch.noCounterfactual}</p>
            ))}
        </div>
      ))}
    </section>
  );
}

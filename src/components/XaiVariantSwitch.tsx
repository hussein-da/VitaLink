"use client";

import { useRef, useState } from "react";
import { MessageSquareText, BarChart3, SlidersHorizontal } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { GlossarText } from "@/components/GlossarTerm";
import FactorBars from "@/components/FactorBars";
import CounterfactualSlider from "@/components/CounterfactualSlider";

type Variant = "A" | "B" | "C";

const tabs: { id: Variant; label: string; icon: typeof MessageSquareText }[] = [
  { id: "A", label: "In Worten", icon: MessageSquareText },
  { id: "B", label: "Visuell", icon: BarChart3 },
  { id: "C", label: "Was waere, wenn", icon: SlidersHorizontal },
];

/**
 * RQ1: Umschalter zwischen den drei XAI-Erklaervarianten.
 *  A natuerlichsprachlich, B visuell (FactorBars), C kontrafaktisch (Slider).
 * Standard ist A.
 */
export default function XaiVariantSwitch({ hinweis }: { hinweis: Hinweis }) {
  const [variant, setVariant] = useState<Variant>("A");
  const { disabledSources } = useSettings();
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
    <section aria-label="Erklaervariante" className="rounded-2xl border border-border bg-surface p-4">
      <div role="tablist" aria-label="Erklaervariante" className="flex gap-1 rounded-xl bg-surface-2 p-1">
        {tabs.map((t, i) => {
          const aktiv = variant === t.id;
          const Icon = t.icon;
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
              className={`tap flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-sm font-medium ${
                aktiv ? "bg-surface text-primary shadow-sm" : "text-muted"
              }`}
            >
              <Icon aria-hidden size={18} />
              <span className="text-center leading-tight">{t.label}</span>
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
            <p className="text-lg leading-relaxed text-ink">
              <GlossarText>{hinweis.kurz}</GlossarText>
            </p>
          )}
          {t.id === "B" && (
            <FactorBars faktoren={hinweis.faktoren} disabledKeys={disabledSources} />
          )}
          {t.id === "C" &&
            (hinweis.kontrafaktisch ? (
              <CounterfactualSlider data={hinweis.kontrafaktisch} />
            ) : (
              <p className="text-ink">
                Fuer diesen regelbasierten Hinweis ist eine kontrafaktische Betrachtung nicht
                sinnvoll.
              </p>
            ))}
        </div>
      ))}
    </section>
  );
}

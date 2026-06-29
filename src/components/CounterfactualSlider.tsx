"use client";

import { useState } from "react";
import type { Kontrafaktisch } from "@/lib/types";

function de(n: number): string {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

/**
 * DF4 / Variante C (kontrafaktisch): "Was wäre, wenn"-Regler. Beim Ziehen
 * ändert sich der Wirkungstext live. Akzentfarbe folgt der Kategorie (B8).
 */
export default function CounterfactualSlider({
  data,
  akzent = "rgb(var(--c-primary))",
  akzentSoft = "rgb(var(--c-primary-soft))",
  akzentBorder = "rgb(var(--c-primary) / 0.3)",
}: {
  data: Kontrafaktisch;
  akzent?: string;
  akzentSoft?: string;
  akzentBorder?: string;
}) {
  const [wert, setWert] = useState<number>(data.aktuell);

  return (
    <div className="space-y-4">
      <p className="text-[15px] text-ink">
        Verschiebe den Regler und sieh, wie sich der Hinweis verändern würde. Die zugrunde
        liegenden Daten bleiben unverändert — das ist ein Gedankenexperiment.
      </p>

      <div className="rounded-xl border border-border bg-surface-2/50 p-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <label htmlFor="cf-slider" className="font-medium text-ink">
            {data.faktorLabel}
          </label>
          <span
            className="font-display text-2xl font-semibold tabular-nums"
            style={{ color: akzent }}
          >
            {de(wert)} <span className="text-base font-normal text-ink-2">{data.einheit}</span>
          </span>
        </div>

        <input
          id="cf-slider"
          type="range"
          min={data.min}
          max={data.max}
          step={data.schritt}
          value={wert}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setWert(Number.isFinite(v) ? v : data.aktuell);
          }}
          aria-valuetext={`${de(wert)} ${data.einheit}`}
          className="h-11 w-full cursor-pointer"
          style={{ accentColor: akzent }}
        />

        <div className="flex justify-between text-[13px] font-medium text-ink-2">
          <span>
            {de(data.min)} {data.einheit}
          </span>
          <span>
            {de(data.max)} {data.einheit}
          </span>
        </div>
      </div>

      <div
        className="reveal rounded-xl border p-4 text-ink"
        style={{ borderColor: akzentBorder, backgroundColor: akzentSoft }}
        aria-live="polite"
      >
        {data.wirkung(wert)}
      </div>
    </div>
  );
}

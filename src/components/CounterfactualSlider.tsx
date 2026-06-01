"use client";

import { useState } from "react";
import type { Kontrafaktisch } from "@/lib/types";

function de(n: number): string {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

/**
 * DF4 / Variante C (kontrafaktisch): "Was waere, wenn"-Regler. Beim Ziehen
 * aendert sich der Wirkungstext live.
 */
export default function CounterfactualSlider({ data }: { data: Kontrafaktisch }) {
  const [wert, setWert] = useState<number>(data.aktuell);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Verschiebe den Regler und sieh, wie sich der Hinweis veraendern wuerde. Die zugrunde
        liegenden Daten bleiben unveraendert - das ist ein Gedankenexperiment.
      </p>

      <div className="rounded-xl border border-border bg-surface-2/50 p-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <label htmlFor="cf-slider" className="font-medium text-ink">
            {data.faktorLabel}
          </label>
          <span className="font-display text-2xl font-semibold tabular-nums text-primary">
            {de(wert)} <span className="text-base font-normal text-muted">{data.einheit}</span>
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
          className="h-11 w-full cursor-pointer accent-primary"
        />

        <div className="flex justify-between text-sm text-muted">
          <span>
            {de(data.min)} {data.einheit}
          </span>
          <span>
            {de(data.max)} {data.einheit}
          </span>
        </div>
      </div>

      <div
        className="reveal rounded-xl border border-primary/30 bg-primary-soft p-4 text-ink"
        aria-live="polite"
      >
        {data.wirkung(wert)}
      </div>
    </div>
  );
}

"use client";

import { useSettings } from "@/context/SettingsContext";

/**
 * DF7: groessere Schrift global. Skaliert die Basis-Schriftgroesse (16px -> ~19px)
 * ueber die CSS-Variable --font-scale, die alle rem-Groessen mitzieht.
 */
export default function FontSizeToggle() {
  const { fontScale, setFontScale } = useSettings();

  return (
    <div
      role="group"
      aria-label="Schriftgroesse"
      className="inline-flex rounded-xl border border-border bg-surface p-1"
    >
      <button
        type="button"
        onClick={() => setFontScale("normal")}
        aria-pressed={fontScale === "normal"}
        className={`tap inline-flex items-center justify-center rounded-lg px-4 py-2 text-base ${
          fontScale === "normal" ? "bg-primary text-primary-ink" : "text-ink"
        }`}
      >
        Standard
      </button>
      <button
        type="button"
        onClick={() => setFontScale("lg")}
        aria-pressed={fontScale === "lg"}
        className={`tap inline-flex items-center justify-center rounded-lg px-4 py-2 text-lg ${
          fontScale === "lg" ? "bg-primary text-primary-ink" : "text-ink"
        }`}
      >
        Gross
      </button>
    </div>
  );
}

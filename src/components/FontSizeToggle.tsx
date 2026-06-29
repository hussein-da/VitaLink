"use client";

import { useSettings } from "@/context/SettingsContext";

/**
 * DF7: größere Schrift global. Skaliert die Basis-Schriftgröße (16px -> ~19px)
 * über die CSS-Variable --font-scale, die alle rem-Größen mitzieht.
 */
export default function FontSizeToggle() {
  const { fontScale, setFontScale } = useSettings();

  return (
    <div
      role="group"
      aria-label="Schriftgröße"
      className="flex w-full gap-1 rounded-xl bg-surface-2 p-1"
    >
      <button
        type="button"
        onClick={() => setFontScale("normal")}
        aria-pressed={fontScale === "normal"}
        className={`tap flex flex-1 items-center justify-center rounded-[11px] px-4 py-2 text-sm font-medium transition-colors ${
          fontScale === "normal" ? "bg-cat-lifestyle text-cat-lifestyle-on shadow-sm" : "text-muted"
        }`}
      >
        Standard
      </button>
      <button
        type="button"
        onClick={() => setFontScale("lg")}
        aria-pressed={fontScale === "lg"}
        className={`tap flex flex-1 items-center justify-center rounded-[11px] px-4 py-2 text-sm font-medium transition-colors ${
          fontScale === "lg" ? "bg-cat-lifestyle text-cat-lifestyle-on shadow-sm" : "text-muted"
        }`}
      >
        Groß
      </button>
    </div>
  );
}

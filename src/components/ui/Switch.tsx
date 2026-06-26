"use client";

import { useId } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Zugängliche Beschriftung (Pflicht). */
  label: string;
  /** Optional sichtbar verknüpftes Label-Element per id. */
  labelledBy?: string;
  describedBy?: string;
  disabled?: boolean;
}

/**
 * Barrierefreier Schalter (role="switch"). Tap-Fläche >=44px, Tastatur-bedienbar,
 * sichtbarer Fokus über die globale :focus-visible-Regel.
 */
export default function Switch({
  checked,
  onChange,
  label,
  labelledBy,
  describedBy,
  disabled,
}: SwitchProps) {
  const fallbackId = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      id={fallbackId}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="tap inline-flex shrink-0 items-center justify-center rounded-full p-2 disabled:opacity-50"
    >
      <span
        aria-hidden
        className={`relative h-[31px] w-[51px] rounded-full border transition-colors duration-200 ${
          checked ? "border-primary bg-primary" : "border-border bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-[1px] h-[27px] w-[27px] rounded-full bg-surface shadow transition-all duration-200 ${
            checked ? "left-[21px]" : "left-[1px]"
          }`}
        />
      </span>
    </button>
  );
}

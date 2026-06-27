"use client";

import type { LucideIcon } from "lucide-react";

/**
 * Empfänger-Auswahl-Kachel (Stufe 1 des Arztexports). Aktiv = Prävention-Rahmen
 * + getönter Hintergrund; die Auswahl steuert die Default-Datenauswahl.
 */
export default function EmpfaengerKachel({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center rounded-2xl border-2 px-2.5 py-3.5 text-center transition-colors duration-200 ${
        active
          ? "border-cat-prevention bg-cat-prevention-light"
          : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors ${
          active ? "bg-cat-prevention/20" : "bg-surface-2"
        }`}
      >
        <Icon aria-hidden size={18} className={active ? "text-cat-prevention" : "text-muted"} />
      </span>
      <span className="mt-2 text-[13px] font-semibold text-ink">{label}</span>
    </button>
  );
}

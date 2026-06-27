import type { ReactNode } from "react";

/**
 * Metrik-Kachel (Apple-Health-Sprache, §Zone C): zentrierte Spalte mit kleinem
 * Kategorie-Icon, dominanter Display-Zahl (Fraunces) und 2-Wort-Label.
 * Kein Fließtext, keine Erklärung — die Zahl spricht für sich (R3).
 */
export default function MetricTile({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  /** Anzeigewert, z. B. "6,7" oder "12.584". */
  value: string;
  /** 2-Wort-Label, z. B. "Std. Schlaf". */
  label: string;
}) {
  // Lange Zahlen (>= 5 Zeichen, z. B. "12.584") etwas kleiner setzen.
  const groß = value.replace(/[.,]/g, "").length >= 5;
  return (
    <div className="flex min-h-[104px] flex-col items-center justify-center gap-1.5 rounded-[18px] bg-surface px-2.5 py-4 shadow-card">
      <span aria-hidden className="mb-0.5">
        {icon}
      </span>
      <p
        className={`font-display font-bold leading-none text-ink ${
          groß ? "text-[32px]" : "text-[44px]"
        }`}
      >
        {value}
      </p>
      <p className="text-center text-[11px] font-medium text-muted">{label}</p>
    </div>
  );
}

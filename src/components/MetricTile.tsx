import type { ReactNode } from "react";

/**
 * Kompakte Metrik-Kachel fürs Dashboard (Whoop/Oura-Anmutung):
 * farbiger Icon-Container, große Zahl als Star, kleine Unit + Micro-Label.
 * Kein Fließtext.
 */
export default function MetricTile({
  icon,
  iconBg,
  value,
  unit,
  label,
}: {
  icon: ReactNode;
  /** Soft-Hintergrund des Icon-Containers, z. B. "bg-primary-soft". */
  iconBg: string;
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-card">
      <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </span>
      <p className="font-display text-[26px] font-bold leading-none text-ink">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-muted">{unit}</span>}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
    </div>
  );
}

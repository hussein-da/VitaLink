import type { ReactNode } from "react";

/**
 * Karte für weitere VitaLink-Datenquellen (§Zone F). Zeigt, wie die Plattform
 * über ePA + Wearable hinaus skaliert — z. B. CGM-Sensoren, Klinik-EKG-Befunde
 * oder Zyklusdaten. Vollwertig gestaltet (kein Locked-/Disabled-Stil): farbiger
 * Header-Streifen, klarer Titel, eine ehrliche Beschreibung der Integration.
 */
export default function FeatureCard({
  icon,
  soft,
  title,
  text,
  badge,
}: {
  icon: ReactNode;
  /** Header-Soft-Hintergrund, z. B. "bg-cat-future-light". */
  soft: string;
  title: string;
  text: string;
  /** Kurzer Status-Tag, z. B. "Erweiterung". */
  badge?: string;
}) {
  return (
    <div className="relative w-[240px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-surface shadow-card">
      <div className={`flex h-14 items-center gap-3 px-4 ${soft}`}>
        <span aria-hidden>{icon}</span>
        <span className="truncate font-display text-[16px] font-semibold leading-tight text-ink">
          {title}
        </span>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-[13px] leading-[1.5] text-muted">{text}</p>
      </div>
      {badge && (
        <span className="absolute right-3 top-3 rounded-full bg-cat-future-light px-2.5 py-[3px] text-[11px] font-semibold text-cat-future">
          {badge}
        </span>
      )}
    </div>
  );
}

"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird nur von
// XaiVariantSwitch importiert, das selbst auf keiner Route gemountet ist. Sie
// erscheint in keinem Screen, wird aber gepflegt und zweisprachig gehalten.

import type { DataSourceKey, Faktor } from "@/lib/types";
import { useT } from "@/i18n/useT";

/**
 * DF1 / Variante B (visuell): Einflussfaktoren als horizontale Balken mit
 * relativer Gewichtung. Mindestens die zwei stärksten Faktoren sind sichtbar.
 * Faktoren aus abgeschalteten Quellen werden ruhig gekennzeichnet (DF11).
 */
export default function FactorBars({
  faktoren,
  disabledKeys = [],
}: {
  faktoren: Faktor[];
  disabledKeys?: DataSourceKey[];
}) {
  const { t, fmt } = useT();
  const sortiert = [...faktoren].sort((a, b) => b.gewicht - a.gewicht);

  return (
    <div className="space-y-3">
      <p className="text-[15px] text-ink">{t.orphaned.factorBars.intro}</p>
      <ul className="space-y-3">
        {sortiert.map((f) => {
          const pct = Math.round(f.gewicht * 100);
          const aus = f.sourceKey ? disabledKeys.includes(f.sourceKey) : false;
          // Vollstaendige Satzform statt zusammengesetzter Fragmente (F8):
          // Zahl plus Substantiv laeuft ueber fmt.plural.
          const gewichtung = fmt.plural(pct, t.orphaned.factorBars.weightAria);
          return (
            <li key={f.label}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-medium text-ink">{f.label}</span>
                <span className="text-[14px] tabular-nums font-semibold text-ink-2">
                  {t.orphaned.factorBars.percentValue(fmt.number(pct))}
                </span>
              </div>
              <div
                className="h-3 w-full overflow-hidden rounded-full bg-surface-2"
                role="img"
                aria-label={
                  aus
                    ? t.orphaned.factorBars.barAriaSourceOff(f.label, gewichtung)
                    : t.orphaned.factorBars.barAria(f.label, gewichtung)
                }
              >
                <div
                  className={`h-full rounded-full ${aus ? "bg-muted/50" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[13px] text-ink-2">
                {aus ? t.orphaned.factorBars.sourceOffNote(f.quelleRef) : f.quelleRef}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

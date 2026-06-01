import type { DataSourceKey, Faktor } from "@/lib/types";

/**
 * DF1 / Variante B (visuell): Einflussfaktoren als horizontale Balken mit
 * relativer Gewichtung. Mindestens die zwei staerksten Faktoren sind sichtbar.
 * Faktoren aus abgeschalteten Quellen werden ruhig gekennzeichnet (DF11).
 */
export default function FactorBars({
  faktoren,
  disabledKeys = [],
}: {
  faktoren: Faktor[];
  disabledKeys?: DataSourceKey[];
}) {
  const sortiert = [...faktoren].sort((a, b) => b.gewicht - a.gewicht);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        So stark fliessen die einzelnen Faktoren in diesen Hinweis ein (relative Gewichtung):
      </p>
      <ul className="space-y-3">
        {sortiert.map((f) => {
          const pct = Math.round(f.gewicht * 100);
          const aus = f.sourceKey ? disabledKeys.includes(f.sourceKey) : false;
          return (
            <li key={f.label}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-medium text-ink">{f.label}</span>
                <span className="text-sm tabular-nums text-muted">{pct} %</span>
              </div>
              <div
                className="h-3 w-full overflow-hidden rounded-full bg-surface-2"
                role="img"
                aria-label={`${f.label}: ${pct} Prozent Gewichtung${aus ? ", Quelle abgeschaltet" : ""}`}
              >
                <div
                  className={`h-full rounded-full ${aus ? "bg-muted/50" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-muted">
                {f.quelleRef}
                {aus ? " - Quelle abgeschaltet" : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

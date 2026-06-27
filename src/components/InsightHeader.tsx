import { Fragment } from "react";
import { Link2 } from "lucide-react";
import type { InsightHeaderDaten } from "@/data/smartTipps";
import type { KategorieIdentitaet } from "@/lib/kategorie";

/**
 * Insight-Header (Prompt 11, Problem 3): macht die Verbindung zwischen den
 * Datenpunkten sofort sichtbar. Auf der Kategorie-Light-Fläche stehen ein bis
 * zwei Kausal-Ketten aus kleinen Boxen mit Pfeilen dazwischen, darunter eine
 * kursive wissenschaftliche Einordnung.
 */
export default function InsightHeader({
  daten,
  k,
}: {
  daten: InsightHeaderDaten;
  k: KategorieIdentitaet;
}) {
  const akzent = `rgb(var(--c-${k.base}))`;

  return (
    <div className={`mb-4 rounded-2xl ${k.soft} p-4`}>
      <div className="flex items-center gap-2">
        <Link2 aria-hidden size={16} className={k.text} />
        <span className="text-[14px] font-semibold text-ink">So hängt das zusammen</span>
      </div>

      <div className="mt-3 space-y-2.5">
        {daten.ketten.map((kette, ki) => (
          <div key={ki} className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
            {kette.boxen.map((box, bi) => (
              <Fragment key={bi}>
                {bi > 0 && (
                  <span aria-hidden className="text-[14px] font-bold" style={{ color: akzent }}>
                    →
                  </span>
                )}
                <span className="rounded-lg bg-surface px-2.5 py-1.5 text-[12px] font-semibold text-ink">
                  {box}
                </span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-2.5 text-[12px] italic text-muted">{daten.fazit}</p>
    </div>
  );
}

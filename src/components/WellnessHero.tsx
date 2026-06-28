import { Moon, Heart, Activity } from "lucide-react";
import { wellnessScore } from "@/lib/wellnessScore";
import { wearableSummary } from "@/data/wearable";
import InsightMoment from "@/components/InsightMoment";

const schlafText = wearableSummary.schlafStd.toLocaleString("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const MINI = [
  { icon: Moon, color: "text-cat-lifestyle", value: `${schlafText}h`, label: "Schlaf" },
  { icon: Heart, color: "text-cat-cardio", value: String(wearableSummary.ruhepuls), label: "BPM" },
  { icon: Activity, color: "text-cat-lifestyle", value: "87%", label: "Glukose" },
] as const;

export default function WellnessHero() {
  const { gesamt, label, farbe } = wellnessScore;
  const statusColor = `rgb(var(${farbe}))`;

  return (
    <section
      aria-label="Dein Status heute"
      className="rounded-[28px] bg-surface px-5 py-[22px] shadow-lg"
    >
      <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
        Dein Status heute
      </p>

      {/* Zweispaltig: Score links | Insight rechts */}
      <div className="flex items-stretch gap-3">
        {/* Linke Spalte: Score */}
        <div className="flex flex-1 flex-col">
          <p className="font-display text-[72px] font-bold leading-none text-ink">{gesamt}</p>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{ width: `${gesamt}%`, backgroundColor: statusColor }}
            />
          </div>

          <p className="mt-2 text-[12px] text-muted">von 100</p>
          <p className="mt-1 text-[14px] font-semibold" style={{ color: statusColor }}>
            {label}
          </p>
        </div>

        {/* Vertikale Trennlinie */}
        <div aria-hidden className="my-1 w-px bg-border" />

        {/* Rechte Spalte: Insight-Moment */}
        <InsightMoment />
      </div>

      {/* Drei Mini-Indikatoren */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {MINI.map(({ icon: Icon, color, value, label: l }) => (
          <div
            key={l}
            className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-2 py-2.5"
          >
            <Icon aria-hidden size={14} className={color} />
            <span className="text-[15px] font-semibold text-ink">{value}</span>
            <span className="text-[11px] text-muted">{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

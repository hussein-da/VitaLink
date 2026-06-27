import { Moon, Heart, Activity } from "lucide-react";
import { wellnessScore } from "@/lib/wellnessScore";
import { wearableSummary } from "@/data/wearable";

/**
 * Wellness-Hero (Block 1/6) — das visuelle Zentrum von Home.
 * Großzahl-Score über Score-Bar und Status-Label, darunter Sync-Zeile und
 * drei Mini-Indikatoren. Kommuniziert in Sekundenbruchteilen: alles in Ordnung.
 */
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
      className="rounded-[28px] bg-surface px-6 py-7 shadow-lg"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
        Dein Status heute
      </p>

      {/* Score-Stack: Großzahl → Score-Bar → „von 100" → Status-Label */}
      <div className="mt-3 flex flex-col items-center">
        <p className="font-display text-[80px] font-bold leading-none text-ink">{gesamt}</p>

        <div className="mx-auto mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full"
            style={{ width: `${gesamt}%`, backgroundColor: statusColor }}
          />
        </div>

        <p className="mt-2 text-[14px] text-muted">von 100</p>
        <p className="mt-1 text-[16px] font-semibold" style={{ color: statusColor }}>
          {label}
        </p>
      </div>

      <div className="mt-4 h-px bg-border" />
      <p className="mt-3 text-center text-[11px] text-muted">
        Zuletzt aktualisiert: heute, 06:42 Uhr · ePA + Wearable
      </p>

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

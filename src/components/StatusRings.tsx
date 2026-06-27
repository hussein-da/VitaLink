/**
 * Hero-Status-Ring (Dashboard-Zentrum, Apple-Activity-Rings-Anmutung).
 * Zwei konzentrische SVG-Ringe: außen Aktivität (Primary), innen Erholung
 * (Cat-Cardio). In der Mitte eine große Zahl + Micro-Label. Reine
 * Präsentation, Farben aus CSS-Variablen.
 */
const SIZE = 180;
const CENTER = SIZE / 2;

const OUTER_R = 80;
const INNER_R = 62;
const OUTER_C = 2 * Math.PI * OUTER_R;
const INNER_C = 2 * Math.PI * INNER_R;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export default function StatusRings({
  activity,
  recovery,
  centerValue,
  centerLabel,
  activityLabel = "Aktivität",
  recoveryLabel = "Erholung",
}: {
  activity: number;
  recovery: number;
  centerValue: string | number;
  centerLabel: string;
  activityLabel?: string;
  recoveryLabel?: string;
}) {
  const a = clamp01(activity);
  const r = clamp01(recovery);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          role="img"
          aria-label={`${activityLabel} ${Math.round(a * 100)} Prozent, ${recoveryLabel} ${Math.round(
            r * 100,
          )} Prozent`}
        >
          {/* Tracks */}
          <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="none" stroke="rgb(var(--c-surface-2))" strokeWidth={12} />
          <circle cx={CENTER} cy={CENTER} r={INNER_R} fill="none" stroke="rgb(var(--c-surface-2))" strokeWidth={10} />
          {/* Aktivität (außen) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_R}
            fill="none"
            stroke="rgb(var(--c-primary))"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={OUTER_C}
            strokeDashoffset={OUTER_C * (1 - a)}
          />
          {/* Erholung (innen) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_R}
            fill="none"
            stroke="rgb(var(--c-cat-cardio))"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={INNER_C}
            strokeDashoffset={INNER_C * (1 - r)}
          />
        </svg>
        {/* Mitte */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[40px] font-bold leading-none text-ink">
            {centerValue}
          </span>
          <span className="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-2">
            {centerLabel}
          </span>
        </div>
      </div>

      {/* Legenden */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-primary" />
          {activityLabel}
        </span>
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-cat-cardio" />
          {recoveryLabel}
        </span>
      </div>
    </div>
  );
}

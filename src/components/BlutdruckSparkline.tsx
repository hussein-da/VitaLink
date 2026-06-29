import { blutdruckReihe } from "@/data/epa";

/**
 * Mini-Sparkline (Badge 2.4, Block 8) für den systolischen Blutdruck-Verlauf.
 * Inline-SVG, keine Achsen/Labels — nur die Kurve. Dark-mode-fest (Token-Farbe).
 */
export default function BlutdruckSparkline({
  breite = 60,
  hoehe = 20,
}: {
  breite?: number;
  hoehe?: number;
}) {
  const werte = blutdruckReihe.map((b) => b.sys);
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const spanne = Math.max(1, max - min);
  const pad = 2;
  const punkte = werte.map((v, i) => {
    const x = pad + (i / (werte.length - 1)) * (breite - 2 * pad);
    const y = hoehe - pad - ((v - min) / spanne) * (hoehe - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`} aria-hidden className="shrink-0">
      <polyline
        points={punkte.join(" ")}
        fill="none"
        stroke="var(--c-cat-cardio)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

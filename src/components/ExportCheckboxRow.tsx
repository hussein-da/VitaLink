"use client";

/**
 * Wählbare Datenzeile für den Arztexport. Die GESAMTE Zeile ist tippbar
 * (nicht nur die Checkbox). Checkbox 24×24, border-radius 7px, in
 * --c-cat-prevention wenn aktiv, mit eigenem Häkchen-Pfad (kein Icon-Font).
 */
export default function ExportCheckboxRow({
  label,
  sublabel,
  checked,
  onToggle,
  last = false,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex min-h-[50px] w-full items-center gap-3.5 px-4 py-2 text-left ${
        last ? "" : "border-b border-border"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 transition-colors duration-150 ${
          checked
            ? "border-cat-prevention bg-cat-prevention text-cat-prevention-on"
            : "border-muted-2 bg-surface text-transparent"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-snug text-ink">{label}</span>
        {sublabel && <span className="mt-0.5 block text-[12px] leading-snug text-muted">{sublabel}</span>}
      </span>
    </button>
  );
}

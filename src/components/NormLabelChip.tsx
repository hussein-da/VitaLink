import { NORM_META, type NormStatus } from "@/lib/normwerte";

/** Kleines neutrales Normwert-Label (Badge 2.4). Status nie nur über Farbe — Text immer dabei. */
export default function NormLabelChip({ status }: { status: NormStatus }) {
  const meta = NORM_META[status];
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.chipClass}`}>
      {meta.label}
    </span>
  );
}

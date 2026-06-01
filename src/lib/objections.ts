import type { ObjectionReason } from "@/lib/types";

// Die drei vordefinierten Widerspruchsgruende (DF12).
export const objectionReasons: { value: ObjectionReason; label: string }[] = [
  { value: "medizinisch-geklaert", label: "Ist medizinisch bereits geklaert" },
  { value: "persoenlich-anders", label: "Bewerte ich persoenlich anders" },
  { value: "technischer-fehler", label: "Beruht auf einem technischen Fehler" },
];

export const objectionReasonLabel: Record<ObjectionReason, string> = Object.fromEntries(
  objectionReasons.map((r) => [r.value, r.label]),
) as Record<ObjectionReason, string>;

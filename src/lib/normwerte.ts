// VitaLink — Normwert-Einordnung (Badge 2.4, Block 5).
// Neutrale Wort-Labels statt Zahlen-Alarm. KEIN Alarmrot, kein "Kritisch".

export type NormStatus = "normal" | "niedrig" | "erhoeht";

/** Ordnet einen Wert gegen einen Referenzbereich ein (min/max optional). */
export function normLabel(wert: number, min?: number, max?: number): NormStatus {
  if (min != null && wert < min) return "niedrig";
  if (max != null && wert > max) return "erhoeht";
  return "normal";
}

export const NORM_META: Record<NormStatus, { label: string; chipClass: string }> = {
  normal: { label: "Normbereich", chipClass: "bg-status-ok-light text-status-ok" },
  niedrig: { label: "Etwas niedrig", chipClass: "bg-status-info-light text-status-info" },
  erhoeht: { label: "Etwas erhöht", chipClass: "bg-status-warn-light text-status-warn" },
};

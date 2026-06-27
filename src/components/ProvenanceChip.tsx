"use client";

import { useState } from "react";
import { Database, Watch, ChevronDown } from "lucide-react";
import type { Provenance } from "@/lib/types";
import { dataSourceLabel } from "@/lib/dataSources";

function formatDatum(iso: string | null | undefined): string {
  if (!iso) return "kein Datum";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

/**
 * Herkunfts-Chip (DF5 ePA / DF6 Wearable). Antippbar -> klappt Details auf.
 * ePA zeigt Quelle + Datum + Einrichtung, Wearable zeigt Zeitraum + Sensorart.
 * Bei abgeschalteter Quelle (DF11) wird der Chip redigiert: nur der generische
 * Quellenname plus Hinweis "abgeschaltet" - der konkrete Wert bleibt ausgeblendet
 * (kein Anzeigen von Daten, die laut Einstellungen nicht genutzt werden dürfen).
 */
export default function ProvenanceChip({
  provenance,
  disabled = false,
}: {
  provenance: Provenance;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const istEpa = provenance.art === "epa";
  const Icon = istEpa ? Database : Watch;

  // Abgeschaltete Quelle: Wert unterdrücken, nur generischen Namen zeigen.
  if (disabled) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-2/40">
        <div className="flex w-full items-center gap-2 px-3 py-2">
          <Icon aria-hidden size={18} className="text-muted" />
          <span className="flex-1 text-sm">
            <span className="font-medium text-ink">{dataSourceLabel(provenance.sourceKey)}</span>{" "}
            <span className="text-muted">
              {istEpa ? "ePA" : "Wearable"} - Quelle abgeschaltet
            </span>
          </span>
        </div>
        <p className="border-t border-border px-3 py-2 text-sm text-muted">
          Wird aktuell nicht genutzt, Wert ausgeblendet. In den Einstellungen wieder einschalten.
        </p>
      </div>
    );
  }

  const meta = istEpa ? formatDatum(provenance.date) : provenance.period;

  return (
    <div className="rounded-xl bg-surface-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="tap flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <Icon aria-hidden size={18} className="text-primary" />
        <span className="flex-1 text-sm">
          <span className="font-medium text-ink">{provenance.label}</span>{" "}
          <span className="text-muted">
            {istEpa ? "ePA" : "Wearable"}
            {meta ? ` - ${meta}` : ""}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          size={18}
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <dl className="reveal border-t border-border px-3 py-2 text-sm">
          <div className="flex justify-between gap-3 py-0.5">
            <dt className="text-muted">Art</dt>
            <dd className="text-right text-ink">{istEpa ? "ePA-Eintrag" : "Wearable-Stream"}</dd>
          </div>
          {istEpa ? (
            <>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-muted">Einrichtung</dt>
                <dd className="text-right text-ink">{provenance.issuer ?? "unbekannt"}</dd>
              </div>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-muted">Datum</dt>
                <dd className="text-right text-ink">{formatDatum(provenance.date)}</dd>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-muted">Sensorart</dt>
                <dd className="text-right text-ink">{provenance.sensor ?? "unbekannt"}</dd>
              </div>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-muted">Zeitraum</dt>
                <dd className="text-right text-ink">{provenance.period ?? "unbekannt"}</dd>
              </div>
            </>
          )}
        </dl>
      )}
    </div>
  );
}

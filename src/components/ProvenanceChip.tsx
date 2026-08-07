"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird von keiner Route
// importiert und erscheint in keinem Screen. Der Code wird gepflegt und
// zweisprachig gehalten.

import { useState } from "react";
import { Database, Watch, ChevronDown } from "lucide-react";
import type { Provenance } from "@/lib/types";
import { dataSourceLabelFuer } from "@/lib/dataSources";
import { useT } from "@/i18n/useT";

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
  const { t, locale, fmt } = useT();
  const istEpa = provenance.art === "epa";
  const Icon = istEpa ? Database : Watch;
  const artLabel = istEpa ? t.orphaned.provenance.kindEpa : t.orphaned.provenance.kindWearable;

  // Datumsformat auf Render-Ebene, nicht als Modulkonstante: Der deutsche Stand
  // bleibt bei 12.03.2026, der englische zieht auf en-GB-Langform (F14).
  const datumsOptionen: Intl.DateTimeFormatOptions =
    locale === "de"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" };

  function formatDatum(iso: string | null | undefined): string {
    if (!iso) return t.orphaned.provenance.noDate;
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    // Bewusst als LOKALES Datum bauen: `new Date("2026-03-12")` waere UTC und
    // koennte in westlichen Zeitzonen einen Tag zurueckspringen.
    return fmt.date(new Date(Number(y), Number(m) - 1, Number(d)), datumsOptionen);
  }

  // Abgeschaltete Quelle: Wert unterdrücken, nur generischen Namen zeigen.
  if (disabled) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-2/40">
        <div className="flex w-full items-center gap-2 px-3 py-2">
          <Icon aria-hidden size={18} className="text-ink-2" />
          <span className="flex-1 text-[15px]">
            <span className="font-medium text-ink">
              {dataSourceLabelFuer(provenance.sourceKey, locale)}
            </span>{" "}
            <span className="text-ink-2">{t.orphaned.provenance.sourceOff(artLabel)}</span>
          </span>
        </div>
        <p className="border-t border-border px-3 py-2 text-[14px] text-ink-2">
          {t.orphaned.provenance.sourceOffNote}
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
        <span className="flex-1 text-[15px]">
          <span className="font-medium text-ink">{provenance.label}</span>{" "}
          <span className="text-ink-2">
            {meta ? t.orphaned.provenance.kindWithMeta(artLabel, meta) : artLabel}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          size={18}
          className={`shrink-0 text-ink-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <dl className="reveal border-t border-border px-3 py-2 text-[14px]">
          <div className="flex justify-between gap-3 py-0.5">
            <dt className="text-ink-2">{t.orphaned.provenance.typeLabel}</dt>
            <dd className="text-right font-medium text-ink">
              {istEpa ? t.orphaned.provenance.typeEpaEntry : t.orphaned.provenance.typeWearableStream}
            </dd>
          </div>
          {istEpa ? (
            <>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-ink-2">{t.orphaned.provenance.issuerLabel}</dt>
                <dd className="text-right font-medium text-ink">
                  {provenance.issuer ?? t.orphaned.provenance.unknown}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-ink-2">{t.orphaned.provenance.dateLabel}</dt>
                <dd className="text-right font-medium text-ink">{formatDatum(provenance.date)}</dd>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-ink-2">{t.orphaned.provenance.sensorLabel}</dt>
                <dd className="text-right font-medium text-ink">
                  {provenance.sensor ?? t.orphaned.provenance.unknown}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-0.5">
                <dt className="text-ink-2">{t.orphaned.provenance.periodLabel}</dt>
                <dd className="text-right font-medium text-ink">
                  {provenance.period ?? t.orphaned.provenance.unknown}
                </dd>
              </div>
            </>
          )}
        </dl>
      )}
    </div>
  );
}

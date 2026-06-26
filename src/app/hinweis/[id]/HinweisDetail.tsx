"use client";

import Link from "next/link";
import { Ban, FileSearch } from "lucide-react";
import { hinweisMap } from "@/data/hinweise";
import { angebotMap } from "@/data/angebote";
import { dataSourceLabel } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import AppHeader from "@/components/AppHeader";
import UncertaintyBadge from "@/components/UncertaintyBadge";
import XaiVariantSwitch from "@/components/XaiVariantSwitch";
import ExplanationPanel from "@/components/ExplanationPanel";
import ProvenanceChip from "@/components/ProvenanceChip";
import ActionCard from "@/components/ActionCard";
import ObjectionButton from "@/components/ObjectionButton";

export default function HinweisDetail({ id }: { id: string }) {
  const { isSourceEnabled } = useSettings();
  const hinweis = hinweisMap[id];

  if (!hinweis) {
    return (
      <div>
        <AppHeader title="Hinweis nicht gefunden" back={{ href: "/dashboard", label: "Zu den Hinweisen" }} />
        <div className="px-4 py-6">
          <p className="text-ink">Diesen Hinweis gibt es nicht (mehr).</p>
          <Link href="/dashboard" className="mt-3 inline-block font-medium text-primary underline">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  const abgeschaltet = hinweis.genutzteQuellen.filter((k) => !isSourceEnabled(k));
  const beeinträchtigt = abgeschaltet.length > 0;
  const aktionen = hinweis.aktionen
    .map((a) => angebotMap[a.angebotId])
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div>
      <AppHeader title="Vorsorge-Hinweis" back={{ href: "/dashboard", label: "Zu den Hinweisen" }} />

      <div className="space-y-6 px-4 py-6">
        {/* 1. Titel + ggf. Unsicherheits-Badge */}
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold leading-snug text-ink">
            {hinweis.titel}
          </h2>
          {hinweis.unsicher && <UncertaintyBadge />}
        </div>

        {/* DF11: Hinweis nutzt aktuell abgeschaltete Quellen */}
        {beeinträchtigt && (
          <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-surface-2/70 p-4">
            <Ban aria-hidden size={20} className="mt-0.5 shrink-0 text-muted" />
            <div className="text-sm text-ink">
              <p className="font-semibold">Dieser Hinweis nutzt abgeschaltete Quellen</p>
              <p>
                Betroffen:{" "}
                <span className="font-medium">
                  {abgeschaltet.map((k) => dataSourceLabel(k)).join(", ")}
                </span>
                . Die Aussage wird daher nicht vollständig berechnet.{" "}
                <Link href="/einstellungen" className="font-medium text-primary underline">
                  In den Einstellungen wieder einschalten
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {/* 2. XAI-Varianten A / B / C (RQ1) - bei abgeschalteter Quelle ausgeblendet (DF11) */}
        {!beeinträchtigt && <XaiVariantSwitch hinweis={hinweis} />}

        {/* 3. Erklärtiefen Kurz / Begründung / Detail (DF3) */}
        {!beeinträchtigt && (
          <section>
            <h3 className="mb-3 font-display text-lg font-semibold text-ink">
              Erklärung in drei Tiefen
            </h3>
            <ExplanationPanel
              kurz={hinweis.kurz}
              begruendung={hinweis.begruendung}
              detail={hinweis.detail}
            />
          </section>
        )}

        {/* 4. Datenherkunft (DF5 ePA / DF6 Wearable) - immer sichtbar, abgeschaltete markiert */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <FileSearch aria-hidden size={20} className="text-primary" /> Datenherkunft
          </h3>
          <p className="mb-2 text-sm text-muted">
            Jeder Wert ist nachvollziehbar. Tippe einen Eintrag an für Details.
          </p>
          <div className="space-y-2">
            {hinweis.quellen.map((q, i) => (
              <ProvenanceChip
                key={`${q.sourceKey}-${i}`}
                provenance={q}
                disabled={!isSourceEnabled(q.sourceKey)}
              />
            ))}
          </div>
        </section>

        {/* 6. Lokale Handlungsoptionen (DF9) */}
        {!beeinträchtigt && aktionen.length > 0 && (
          <section>
            <h3 className="mb-3 font-display text-lg font-semibold text-ink">Was du tun kannst</h3>
            <div className="space-y-2">
              {aktionen.map((a) => (
                <ActionCard key={a.id} angebot={a} />
              ))}
            </div>
          </section>
        )}

        {/* 7. Widerspruch (DF12) */}
        {!beeinträchtigt && (
          <section>
            <ObjectionButton hinweisId={hinweis.id} />
          </section>
        )}
      </div>
    </div>
  );
}

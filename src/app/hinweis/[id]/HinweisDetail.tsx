"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Ban, Plane } from "lucide-react";
import { hinweisMap } from "@/data/hinweise";
import { angebotMap } from "@/data/angebote";
import { dataSourceLabel } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import AppHeader from "@/components/AppHeader";
import DetailHeader from "@/components/DetailHeader";
import UncertaintyBadge from "@/components/UncertaintyBadge";
import XaiVariantSwitch from "@/components/XaiVariantSwitch";
import ExplanationPanel from "@/components/ExplanationPanel";
import ProvenanceChip from "@/components/ProvenanceChip";
import ActionCard from "@/components/ActionCard";
import ObjectionButton from "@/components/ObjectionButton";

/** Sektion im weißen Content-Sheet: Micro-Label + Inhalt, oben 1px-Trennlinie. */
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-7 first:border-t-0 first:pt-0">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      {children}
    </section>
  );
}

export default function HinweisDetail({ id }: { id: string }) {
  const { isSourceEnabled, language } = useSettings();
  const reiseCtaLabel =
    language === "en" ? "Manage travel destination and vaccinations" : "Reiseziel und Impfungen verwalten";
  const hinweis = hinweisMap[id];

  if (!hinweis) {
    return (
      <div>
        <AppHeader title="Hinweis nicht gefunden" back={{ href: "/dashboard", label: "Zurück" }} />
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
    <div className="pb-6">
      <DetailHeader hinweis={hinweis} back={{ href: "/dashboard", label: "Zurück" }} />

      {/* Weißes Content-Sheet, legt sich über den abgerundeten Hero */}
      <div className="relative z-10 -mt-6 rounded-t-[28px] bg-surface px-4 pt-7">
        {beeinträchtigt && (
          <div className="mb-7 flex items-start gap-3 rounded-2xl bg-surface-2 p-4">
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

        {!beeinträchtigt && (
          <Section label="Erklärungsweise">
            <XaiVariantSwitch hinweis={hinweis} />
          </Section>
        )}

        {!beeinträchtigt && (
          <Section label="Erklärung">
            <ExplanationPanel
              szenario={hinweis.szenario}
              kurz={hinweis.kurz}
              begruendung={hinweis.begruendung}
              detail={hinweis.detail}
            />
          </Section>
        )}

        <Section label="Datengrundlage">
          {hinweis.unsicher && (
            <div className="mb-3">
              <UncertaintyBadge />
            </div>
          )}
          <p className="mb-3 text-sm text-muted">
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
        </Section>

        {hinweis.szenario === "reise" && (
          <Section label="Reiseplanung">
            <Link
              href="/reise"
              className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-ink shadow-card transition-transform motion-safe:active:scale-[0.99]"
            >
              <Plane aria-hidden size={18} />
              {reiseCtaLabel}
            </Link>
          </Section>
        )}

        {!beeinträchtigt && aktionen.length > 0 && (
          <Section label="Nächste Schritte">
            <div className="space-y-2">
              {aktionen.map((a) => (
                <ActionCard key={a.id} angebot={a} />
              ))}
            </div>
          </Section>
        )}

        {!beeinträchtigt && (
          <Section label="Rückmeldung">
            <ObjectionButton hinweisId={hinweis.id} />
          </Section>
        )}
      </div>
    </div>
  );
}

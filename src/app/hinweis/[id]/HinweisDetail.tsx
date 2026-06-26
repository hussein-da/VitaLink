"use client";

import Link from "next/link";
import { Ban, Plane, Activity, HeartPulse } from "lucide-react";
import type { Hinweis } from "@/lib/types";
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

const szenarioLabel: Record<Hinweis["szenario"], string> = {
  lifestyle: "Lifestyle",
  kardiometabolisch: "Herz-Kreislauf",
  reise: "Reise & Impfung",
};

const szenarioIcon: Record<Hinweis["szenario"], typeof Activity> = {
  lifestyle: Activity,
  kardiometabolisch: HeartPulse,
  reise: Plane,
};

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
  const Icon = szenarioIcon[hinweis.szenario];

  return (
    <div className="pb-6">
      {/* Typ-C-Detail-Header (§1b): Kategorie-Icon, Titel, Kategorie-Chip */}
      <DetailHeader
        title={hinweis.titel}
        back={{ href: "/dashboard", label: "Zu den Hinweisen" }}
        icon={<Icon aria-hidden size={24} />}
        category={szenarioLabel[hinweis.szenario]}
        chip={
          hinweis.unsicher ? (
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-ink">
              unsicher
            </span>
          ) : undefined
        }
      />

      <div className="space-y-6 px-4 py-6">
        {/* DF2: ausführliche Unsicherheitskennzeichnung (Inhalt unverändert) */}
        {hinweis.unsicher && <UncertaintyBadge />}

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

        {/* ERKLÄRUNG: XAI-Varianten A / B / C (RQ1) – bei abgeschalteter Quelle ausgeblendet */}
        {!beeinträchtigt && (
          <section>
            <p className="section-label mb-2">Erklärung</p>
            <XaiVariantSwitch hinweis={hinweis} />
          </section>
        )}

        {/* ERKLÄRUNGSTIEFE: Kurz / Begründung / Detail (DF3) */}
        {!beeinträchtigt && (
          <section>
            <p className="section-label mb-2">Erklärungstiefe</p>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <ExplanationPanel
                kurz={hinweis.kurz}
                begruendung={hinweis.begruendung}
                detail={hinweis.detail}
              />
            </div>
          </section>
        )}

        {/* DATENGRUNDLAGE: Datenherkunft (DF5 ePA / DF6 Wearable) – immer sichtbar */}
        <section>
          <p className="section-label mb-2">Datengrundlage</p>
          <p className="mb-2.5 text-sm text-muted">
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

        {/* Einstieg in die Reise-Subseite (nur Reise-Szenario) */}
        {hinweis.szenario === "reise" && (
          <Link
            href="/reise"
            className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-ink shadow-card transition-shadow hover:shadow-card-lg"
          >
            <Plane aria-hidden size={18} />
            {reiseCtaLabel}
          </Link>
        )}

        {/* NÄCHSTE SCHRITTE: lokale Handlungsoptionen (DF9) */}
        {!beeinträchtigt && aktionen.length > 0 && (
          <section>
            <p className="section-label mb-2">Nächste Schritte</p>
            <div className="space-y-2">
              {aktionen.map((a) => (
                <ActionCard key={a.id} angebot={a} />
              ))}
            </div>
          </section>
        )}

        {/* Widerspruch (DF12) */}
        {!beeinträchtigt && (
          <section>
            <ObjectionButton hinweisId={hinweis.id} />
          </section>
        )}
      </div>
    </div>
  );
}

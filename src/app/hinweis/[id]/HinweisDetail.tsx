"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Ban, Plane } from "lucide-react";
import { hinweisMap } from "@/data/hinweise";
import {
  smartTippsJeHinweis,
  insightHeaderJeHinweis,
  methodeJeHinweis,
} from "@/data/smartTipps";
import { dataSourceLabel } from "@/lib/dataSources";
import { kategorie } from "@/lib/kategorie";
import { useSettings } from "@/context/SettingsContext";
import AppHeader from "@/components/AppHeader";
import DetailHeader from "@/components/DetailHeader";
import UncertaintyBadge from "@/components/UncertaintyBadge";
import XaiVariantSwitch from "@/components/XaiVariantSwitch";
import ExplanationPanel from "@/components/ExplanationPanel";
import DataSourceMiniCard from "@/components/DataSourceMiniCard";
import SmartTippCard from "@/components/SmartTippCard";
import InsightHeader from "@/components/InsightHeader";
import MethodeQuellen from "@/components/MethodeQuellen";
import ObjectionButton from "@/components/ObjectionButton";

/** Sektion im weißen Content-Sheet: Micro-Label + Inhalt, oben 1px-Trennlinie. */
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-7 first:border-t-0 first:pt-0">
      <p className="section-label mb-3">{label}</p>
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
          <Link href="/dashboard" className="mt-3 inline-block font-medium text-cat-lifestyle underline">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  const k = kategorie(hinweis.szenario);
  const abgeschaltet = hinweis.genutzteQuellen.filter((q) => !isSourceEnabled(q));
  const beeinträchtigt = abgeschaltet.length > 0;
  const dg = hinweis.datengrundlage;
  const tipps = smartTippsJeHinweis[hinweis.id] ?? [];
  const insight = insightHeaderJeHinweis[hinweis.id];
  const methode = methodeJeHinweis[hinweis.id] ?? [];

  return (
    <div className="pb-6">
      <DetailHeader hinweis={hinweis} back={{ href: "/dashboard", label: "Zurück" }} />

      {/* Weißes Content-Sheet, legt sich über den abgerundeten Hero */}
      <div className="relative z-10 -mt-9 space-y-7 rounded-t-[32px] bg-surface px-5 pb-10 pt-7">
        {beeinträchtigt && (
          <div className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4">
            <Ban aria-hidden size={20} className="mt-0.5 shrink-0 text-muted" />
            <div className="text-sm text-ink">
              <p className="font-semibold">Dieser Hinweis nutzt abgeschaltete Quellen</p>
              <p>
                Betroffen:{" "}
                <span className="font-medium">
                  {abgeschaltet.map((q) => dataSourceLabel(q)).join(", ")}
                </span>
                . Die Aussage wird daher nicht vollständig berechnet.{" "}
                <Link href="/einstellungen" className="font-medium text-cat-lifestyle underline">
                  In den Einstellungen wieder einschalten
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {/* ── SMARTE EMPFEHLUNGEN ── das Erste, was der Nutzer sieht */}
        {!beeinträchtigt && tipps.length > 0 && (
          <Section label="Smarte Empfehlungen">
            {insight && <InsightHeader daten={insight} k={k} />}
            <div className="space-y-4">
              {tipps.map((tipp) => (
                <SmartTippCard key={tipp.id} tipp={tipp} k={k} />
              ))}
            </div>
          </Section>
        )}

        {/* ── DATENGRUNDLAGE ── zwei Mini-Karten (ePA + Wearable) */}
        <Section label="Datengrundlage">
          {hinweis.unsicher && (
            <div className="mb-4">
              <UncertaintyBadge />
            </div>
          )}
          {dg && (
            <div className="flex items-stretch gap-3">
              <DataSourceMiniCard art="epa" label="Aus deiner ePA" punkte={dg.epa} />
              <DataSourceMiniCard
                art={dg.wearableArt ?? "wearable"}
                label={dg.wearableLabel ?? "Dein Wearable"}
                punkte={dg.wearable}
              />
            </div>
          )}
        </Section>

        {/* ── ERKLÄRUNG ── Erklärvarianten (Segmented Control) + Erklärtiefen (Akkordeons) */}
        {!beeinträchtigt && (
          <Section label="Wie kommt VitaLink zu dieser Empfehlung">
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-[13px] font-semibold text-ink-2">Erklärvariante</p>
                <XaiVariantSwitch hinweis={hinweis} />
              </div>
              <div>
                <p className="mb-2 text-[13px] font-semibold text-ink-2">Erklärtiefe</p>
                <ExplanationPanel
                  szenario={hinweis.szenario}
                  kurz={hinweis.kurz}
                  begruendung={hinweis.begruendung}
                  detail={hinweis.detail}
                />
              </div>
              {methode.length > 0 && <MethodeQuellen punkte={methode} />}
            </div>
          </Section>
        )}

        {hinweis.szenario === "reise" && (
          <Section label="Reiseplanung">
            <Link
              href="/reise"
              className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-cat-travel px-4 py-3.5 font-semibold text-cat-travel-on shadow-card transition-transform motion-safe:active:scale-[0.99]"
            >
              <Plane aria-hidden size={18} />
              {reiseCtaLabel}
            </Link>
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

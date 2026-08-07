"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Ban, Plane } from "lucide-react";
import { hinweisFuer } from "@/data/hinweise";
import { smartTippsFuer, insightStatementFuer } from "@/data/smartTipps";
import VorsorgeTerminZeile from "@/components/VorsorgeTerminZeile";
import { Info } from "lucide-react";
import { dataSourceLabelFuer, herkunftLabelFuer } from "@/lib/dataSources";
import { kategorieFuer } from "@/lib/kategorie";
import type { Szenario } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
import { useT } from "@/i18n/useT";
import AppHeader from "@/components/AppHeader";
import DetailHeader from "@/components/DetailHeader";
import UncertaintyBadge from "@/components/UncertaintyBadge";
import DataSourceMiniCard from "@/components/DataSourceMiniCard";
import SmartTippCard from "@/components/SmartTippCard";
import InsightStatement from "@/components/InsightStatement";
import CounterfactualSlider from "@/components/CounterfactualSlider";
import { GlossarText } from "@/components/GlossarTerm";

/** Sektion mit 1px-Trennlinie oben, außer wenn erste Sektion. Optionaler
 *  rechtsbündiger `action`-Slot (z. B. "Alle ansehen"-Link). */
function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-7 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="section-label">{label}</p>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function HinweisDetail({ id }: { id: string }) {
  const { isSourceEnabled } = useSettings();
  // Hydrations-gegatete Locale statt roher Sprachwahl (siehe useT).
  const { t, locale } = useT();
  const hinweis = hinweisFuer(id, locale);

  if (!hinweis) {
    return (
      <div>
        <AppHeader
          title={t.insightDetail.notFoundTitle}
          back={{ href: "/vitalink", label: "VitaLink" }}
        />
        <div className="px-4 py-6">
          <p className="text-ink">{t.insightDetail.notFoundBody}</p>
          <Link href="/vitalink" className="mt-3 inline-block font-medium text-cat-lifestyle underline">
            {t.insightDetail.notFoundLink}
          </Link>
        </div>
      </div>
    );
  }

  const k = kategorieFuer(hinweis.szenario, locale);
  // Akzentfarbe der Kategorie für den kontrafaktischen Regler (B8).
  const CAT_BASE: Record<Szenario, string> = {
    lifestyle: "cat-lifestyle",
    kardiometabolisch: "cat-cardio",
    reise: "cat-travel",
    stoffwechsel: "cat-metabolism",
    vorsorge: "cat-prevention",
    vitalitaet: "cat-vitamind",
  };
  const base = CAT_BASE[hinweis.szenario];
  const akzent = `rgb(var(--c-${base}))`;
  const akzentSoft = `rgb(var(--c-${base}-light))`;
  const akzentBorder = `rgb(var(--c-${base}) / 0.3)`;
  const abgeschaltet = hinweis.genutzteQuellen.filter((q) => !isSourceEnabled(q));
  const beeinträchtigt = abgeschaltet.length > 0;
  const dg = hinweis.datengrundlage;
  const tipps = smartTippsFuer(hinweis.id, locale);
  const insight = insightStatementFuer(hinweis.id, locale);
  const nurEpaKarte = dg && dg.wearable.length === 0;

  return (
    <div className="pb-6">
      <DetailHeader
        hinweis={hinweis}
        back={{ href: "/vitalink", label: t.insightDetail.back }}
      />

      <div className="relative z-10 space-y-7 bg-surface px-5 pb-10 pt-7">
        {/* Warnung bei abgeschalteten Quellen */}
        {beeinträchtigt && (
          <div className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4">
            <Ban aria-hidden size={20} className="mt-0.5 shrink-0 text-muted" />
            <div className="text-sm text-ink">
              <p className="font-semibold">{t.insightDetail.disabledSourcesTitle}</p>
              <p>
                {t.insightDetail.disabledSourcesAffectedLabel}{" "}
                <span className="font-medium">
                  {abgeschaltet.map((q) => dataSourceLabelFuer(q, locale)).join(", ")}
                </span>
                . {t.insightDetail.disabledSourcesNote}{" "}
                <Link href="/einstellungen" className="font-medium text-cat-lifestyle underline">
                  {t.insightDetail.disabledSourcesAction}
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {/* ── SMARTE EMPFEHLUNGEN ── */}
        {!beeinträchtigt && tipps.length > 0 && (
          <Section label={t.insightDetail.sectionRecommendations}>
            {insight && <InsightStatement daten={insight} k={k} />}
            <div className="space-y-4">
              {tipps.map((tipp) => (
                <SmartTippCard key={tipp.id} tipp={tipp} k={k} hinweis={hinweis} />
              ))}
            </div>
          </Section>
        )}

        {/* ── DATENGRUNDLAGE ── */}
        <Section label={t.insightDetail.sectionDataBasis}>
          {hinweis.unsicher && (
            <div className="mb-4">
              <UncertaintyBadge />
            </div>
          )}
          {dg && (
            nurEpaKarte ? (
              <DataSourceMiniCard
                art="epa"
                label={herkunftLabelFuer("epa", locale)}
                punkte={dg.epa}
              />
            ) : (
              <div className="flex items-stretch gap-3">
                <DataSourceMiniCard
                  art="epa"
                  label={herkunftLabelFuer("epa", locale)}
                  punkte={dg.epa}
                />
                <DataSourceMiniCard
                  art={dg.wearableArt ?? "wearable"}
                  label={dg.wearableLabel ?? "Apple Watch Series 12"}
                  punkte={dg.wearable}
                />
              </div>
            )
          )}

          {/* G7: einheitlicher Diagnose-Hinweis (kein Medizinprodukt) */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface-2 p-3">
            <Info aria-hidden size={14} className="mt-0.5 shrink-0 text-muted" />
            <p className="text-[12px] leading-[1.5] text-muted">
              {t.insightDetail.disclaimerNoDiagnosis}
              {hinweis.unsicher && ` ${t.insightDetail.disclaimerUncertain}`}
            </p>
          </div>
        </Section>

        {/* ── WIE VITALINK ZU DIESER EMPFEHLUNG KOMMT ──
            Ausgeblendet bei reinen Vorsorge-/Termin-Hinweisen (z. B. Zahnarzt). */}
        {!beeinträchtigt && hinweis.szenario !== "vorsorge" && (
          <Section label={t.insightDetail.sectionHowItWorks}>
            <p className="text-[15px] leading-[1.6] text-ink">
              <GlossarText>{hinweis.kurz}</GlossarText>
            </p>
          </Section>
        )}

        {/* ── WAS WÄRE, WENN ── eigene Sektion (Protected Core erhalten) */}
        {!beeinträchtigt && hinweis.kontrafaktisch && (
          <Section label={t.insightDetail.sectionWhatIf}>
            <CounterfactualSlider
              data={hinweis.kontrafaktisch}
              akzent={akzent}
              akzentSoft={akzentSoft}
              akzentBorder={akzentBorder}
            />
          </Section>
        )}

        {/* ── ÄHNLICHE TERMINE ── nur bei Vorsorge-Hinweisen */}
        {hinweis.aehnlicheTermine && hinweis.aehnlicheTermine.length > 0 && (
          <Section
            label={t.insightDetail.sectionSimilarAppointments}
            action={
              <Link href="/termine" className="shrink-0 text-[13px] font-semibold text-cat-prevention">
                {t.insightDetail.similarAppointmentsSeeAll}
              </Link>
            }
          >
            <div>
              {hinweis.aehnlicheTermine.map((termin) => (
                <VorsorgeTerminZeile key={termin.titel} t={termin} />
              ))}
            </div>
          </Section>
        )}

        {/* ── REISEPLANUNG ── nur bei Reise-Hinweis */}
        {hinweis.szenario === "reise" && (
          <Section label={t.insightDetail.sectionTravelPlanning}>
            <Link
              href={`/reise?from=${hinweis.id}`}
              className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-cat-travel px-4 py-3.5 font-semibold text-cat-travel-on shadow-card transition-transform motion-safe:active:scale-[0.99]"
            >
              <Plane aria-hidden size={18} />
              {t.insightDetail.travelCta}
            </Link>
          </Section>
        )}

        {/*
         * Rückmeldung (👍/👎/×) liegt jetzt eine Ebene tiefer direkt an jeder
         * konkreten Empfehlung (SmartTippCard, Abschnitt „Smarte Empfehlungen"),
         * nicht mehr als pauschale Rückmeldung für den gesamten Hinweis.
         */}
      </div>
    </div>
  );
}

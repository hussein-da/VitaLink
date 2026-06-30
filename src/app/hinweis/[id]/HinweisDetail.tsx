"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Ban, Plane } from "lucide-react";
import { hinweisMap } from "@/data/hinweise";
import { smartTippsJeHinweis, insightStatementJeHinweis } from "@/data/smartTipps";
import VorsorgeTerminZeile from "@/components/VorsorgeTerminZeile";
import { Info } from "lucide-react";
import { dataSourceLabel } from "@/lib/dataSources";
import { kategorie } from "@/lib/kategorie";
import type { Szenario } from "@/lib/types";
import { useSettings } from "@/context/SettingsContext";
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
  const { isSourceEnabled, language } = useSettings();
  const reiseCtaLabel =
    language === "en"
      ? "Manage travel destination and vaccinations"
      : "Reiseziel und Impfungen verwalten";
  const hinweis = hinweisMap[id];

  if (!hinweis) {
    return (
      <div>
        <AppHeader title="Hinweis nicht gefunden" back={{ href: "/vitalink", label: "VitaLink" }} />
        <div className="px-4 py-6">
          <p className="text-ink">Diesen Hinweis gibt es nicht (mehr).</p>
          <Link href="/vitalink" className="mt-3 inline-block font-medium text-cat-lifestyle underline">
            Zurück zu deinen Analysen
          </Link>
        </div>
      </div>
    );
  }

  const k = kategorie(hinweis.szenario);
  // Akzentfarbe der Kategorie für den kontrafaktischen Regler (B8).
  const CAT_BASE: Record<Szenario, string> = {
    lifestyle: "cat-lifestyle",
    kardiometabolisch: "cat-cardio",
    reise: "cat-travel",
    stoffwechsel: "cat-lifestyle",
    vorsorge: "cat-prevention",
  };
  const base = CAT_BASE[hinweis.szenario];
  const akzent = `rgb(var(--c-${base}))`;
  const akzentSoft = `rgb(var(--c-${base}-light))`;
  const akzentBorder = `rgb(var(--c-${base}) / 0.3)`;
  const abgeschaltet = hinweis.genutzteQuellen.filter((q) => !isSourceEnabled(q));
  const beeinträchtigt = abgeschaltet.length > 0;
  const dg = hinweis.datengrundlage;
  const tipps = smartTippsJeHinweis[hinweis.id] ?? [];
  const insight = insightStatementJeHinweis[hinweis.id];
  const nurEpaKarte = dg && dg.wearable.length === 0;

  return (
    <div className="pb-6">
      <DetailHeader hinweis={hinweis} back={{ href: "/vitalink", label: "Zurück" }} />

      <div className="relative z-10 space-y-7 bg-surface px-5 pb-10 pt-7">
        {/* Warnung bei abgeschalteten Quellen */}
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

        {/* ── SMARTE EMPFEHLUNGEN ── */}
        {!beeinträchtigt && tipps.length > 0 && (
          <Section label="Smarte Empfehlungen">
            {insight && <InsightStatement daten={insight} k={k} />}
            <div className="space-y-4">
              {tipps.map((tipp) => (
                <SmartTippCard key={tipp.id} tipp={tipp} k={k} />
              ))}
            </div>
          </Section>
        )}

        {/* ── DATENGRUNDLAGE ── */}
        <Section label="Datengrundlage">
          {hinweis.unsicher && (
            <div className="mb-4">
              <UncertaintyBadge />
            </div>
          )}
          {dg && (
            nurEpaKarte ? (
              <DataSourceMiniCard art="epa" label="Aus deiner ePA" punkte={dg.epa} />
            ) : (
              <div className="flex items-stretch gap-3">
                <DataSourceMiniCard art="epa" label="Aus deiner ePA" punkte={dg.epa} />
                <DataSourceMiniCard
                  art={dg.wearableArt ?? "wearable"}
                  label={dg.wearableLabel ?? "Dein Wearable"}
                  punkte={dg.wearable}
                />
              </div>
            )
          )}

          {/* G7: einheitlicher Diagnose-Hinweis (kein Medizinprodukt) */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface-2 p-3">
            <Info aria-hidden size={14} className="mt-0.5 shrink-0 text-muted" />
            <p className="text-[12px] leading-[1.5] text-muted">
              Hinweis, keine Diagnose. Diese Empfehlung dient der Orientierung und ersetzt keine
              ärztliche Einschätzung.
              {hinweis.unsicher &&
                " Der dargestellte Trend basiert auf wenigen Messpunkten — die statistische Aussagekraft ist begrenzt."}
            </p>
          </div>
        </Section>

        {/* ── WIE VITALINK ZU DIESER EMPFEHLUNG KOMMT ──
            Ausgeblendet bei reinen Vorsorge-/Termin-Hinweisen (z. B. Zahnarzt). */}
        {!beeinträchtigt && hinweis.szenario !== "vorsorge" && (
          <Section label="Wie VitaLink zu diesen Empfehlungen kommt">
            <p className="text-[15px] leading-[1.6] text-ink">
              <GlossarText>{hinweis.kurz}</GlossarText>
            </p>
          </Section>
        )}

        {/* ── WAS WÄRE, WENN ── eigene Sektion (Protected Core erhalten) */}
        {!beeinträchtigt && hinweis.kontrafaktisch && (
          <Section label="Was wäre, wenn">
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
            label="Ähnliche Termine in deiner ePA"
            action={
              <Link href="/termine" className="shrink-0 text-[13px] font-semibold text-cat-prevention">
                Alle ansehen
              </Link>
            }
          >
            <div>
              {hinweis.aehnlicheTermine.map((t) => (
                <VorsorgeTerminZeile key={t.titel} t={t} />
              ))}
            </div>
          </Section>
        )}

        {/* ── REISEPLANUNG ── nur bei Reise-Hinweis */}
        {hinweis.szenario === "reise" && (
          <Section label="Reiseplanung">
            <Link
              href={`/reise?from=${hinweis.id}`}
              className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-cat-travel px-4 py-3.5 font-semibold text-cat-travel-on shadow-card transition-transform motion-safe:active:scale-[0.99]"
            >
              <Plane aria-hidden size={18} />
              {reiseCtaLabel}
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

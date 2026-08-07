"use client";

// F9: /werte muss Server-Component bleiben, weil die Route `searchParams` liest.
// Der gesamte sichtbare Text liegt deshalb in dieser schlanken
// Client-Unterkomponente — dasselbe Muster wie /ueber (page.tsx + UeberContent.tsx).
//
// R3/F4: SEKTIONEN war eine Modulkonstante und wertete toLocaleString("de-DE")
// bereits beim Import aus — ein Sprachwechsel hätte die Zahlen nie erreicht.
// Der Aufbau liegt jetzt in der Render-Ebene und formatiert über fmt.number.

import AppHeader from "@/components/AppHeader";
import HerkunftsTooltip from "@/components/HerkunftsTooltip";
import { GlossarText } from "@/components/GlossarTerm";
import {
  wearableSummary,
  glukoseSummary,
  atemfrequenzSchnitt,
  vo2maxFuer,
  hauttemperaturBaseline,
  wochenTraining,
  kalorien,
} from "@/data/wearable";
import { blutdruckReihe } from "@/data/epa";
import { koerpermasse } from "@/data/profile";
import { useT } from "@/i18n/useT";

interface Wert {
  label: string;
  wert: string;
  einheit?: string;
  einordnung?: string;
  herkunftId: string;
}

function WertZeile({ w, erste }: { w: Wert; erste: boolean }) {
  const { t } = useT();
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${erste ? "" : "border-t border-border"}`}>
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[14px] font-medium text-ink">
          <GlossarText>{w.label}</GlossarText>
          <HerkunftsTooltip ids={[w.herkunftId]} variant="icon" label={t.values.sourceTooltip(w.label)} />
        </span>
        {w.einordnung && <span className="mt-0.5 block text-[12px] text-muted">{w.einordnung}</span>}
      </div>
      <div className="shrink-0 whitespace-nowrap text-right">
        <span className="text-[17px] font-semibold text-ink">{w.wert}</span>
        {w.einheit && <span className="ml-1 text-[12px] text-muted">{w.einheit}</span>}
      </div>
    </div>
  );
}

export default function WerteContent({ from }: { from?: string }) {
  const { t, locale, fmt } = useT();
  const v = t.values;

  // Eine Nachkommastelle, locale-richtig (war nf1 mit hartem "de-DE").
  const nf1 = (n: number) =>
    fmt.number(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const bd = blutdruckReihe[blutdruckReihe.length - 1];
  const vo2max = vo2maxFuer(locale);

  // Alle Werte stammen aus wearable.ts / epa.ts / profile.ts — keine erfundenen
  // Zusatzwerte. Jede Zeile verweist per herkunftId auf die zentrale Datenherkunft.
  const SEKTIONEN: { label: string; werte: Wert[] }[] = [
    {
      label: v.sectionHeart,
      werte: [
        { label: v.labelRestingHeartRate, wert: fmt.number(wearableSummary.ruhepuls), einheit: "BPM", einordnung: v.contextRestingHeartRate, herkunftId: "ruhepuls" },
        { label: v.labelHrv, wert: fmt.number(wearableSummary.hrv), einheit: "ms", einordnung: v.contextHrv, herkunftId: "hrv" },
        { label: v.labelVo2max, wert: fmt.number(vo2max.wert), einheit: vo2max.einheit, einordnung: vo2max.einordnung, herkunftId: "vo2max" },
        { label: v.labelHeartRateZones, wert: v.valueHeartRateZone, einordnung: fmt.plural(30, v.contextHeartRateZones(fmt.number(520))), herkunftId: "hf-zonen" },
      ],
    },
    {
      label: v.sectionSleep,
      werte: [
        { label: v.labelSleepDuration, wert: nf1(wearableSummary.schlafStd), einheit: "h", einordnung: v.contextSleepDuration(nf1(7.5)), herkunftId: "schlafdauer" },
        { label: v.labelDeepSleep, wert: fmt.number(wearableSummary.tiefschlaf), einheit: "%", einordnung: v.contextDeepSleep, herkunftId: "tiefschlaf" },
        // "67/100" ist reine Skalennotation ohne Wortanteil — nur die Zahl wird formatiert.
        { label: v.labelSleepScore, wert: `${fmt.number(wearableSummary.schlafScore)}/100`, einordnung: v.contextSleepScore, herkunftId: "schlafscore" },
      ],
    },
    {
      label: v.sectionActivity,
      werte: [
        { label: v.labelSteps, wert: fmt.number(wearableSummary.schritte), einordnung: v.contextSteps, herkunftId: "schritte" },
        { label: v.labelActiveMinutes, wert: fmt.number(wearableSummary.aktiveMinuten), einheit: v.unitActiveMinutes, einordnung: v.contextActiveMinutes, herkunftId: "aktive-minuten" },
        { label: v.labelWorkouts, wert: fmt.number(wochenTraining.einheiten.length), einheit: v.unitWorkoutsPerWeek, einordnung: v.contextWorkouts, herkunftId: "trainings" },
        { label: v.labelCalories, wert: fmt.number(kalorien.gesamt), einheit: v.unitCalories, einordnung: v.contextCalories, herkunftId: "kalorien" },
      ],
    },
    {
      label: v.sectionMetabolism,
      werte: [
        { label: v.labelFastingGlucose, wert: fmt.number(glukoseSummary.nuechternSchnitt), einheit: "mg/dl", einordnung: v.contextFastingGlucose, herkunftId: "glukose" },
        { label: v.labelPostMealGlucose, wert: fmt.number(glukoseSummary.postprandialSchnitt), einheit: "mg/dl", einordnung: v.contextPostMealGlucose, herkunftId: "glukose" },
        { label: v.labelGlucoseVariability, wert: fmt.number(glukoseSummary.cv), einheit: "% CV", einordnung: v.contextGlucoseVariability, herkunftId: "glukose" },
      ],
    },
    {
      label: v.sectionBreathing,
      werte: [
        { label: v.labelSpo2, wert: fmt.number(wearableSummary.spo2), einheit: "%", einordnung: v.contextSpo2, herkunftId: "spo2" },
        { label: v.labelRespiratoryRate, wert: fmt.number(Math.round(atemfrequenzSchnitt)), einheit: "/min", einordnung: v.contextRespiratoryRate, herkunftId: "atemfrequenz" },
        { label: v.labelStressScore, wert: fmt.number(wearableSummary.stress), einheit: "", einordnung: v.contextStressScore, herkunftId: "stress" },
        { label: v.labelSkinTemperature, wert: nf1(hauttemperaturBaseline), einheit: "°C", einordnung: v.contextSkinTemperature, herkunftId: "hauttemperatur" },
      ],
    },
    {
      label: v.sectionEpa,
      werte: [
        { label: v.labelBloodPressure, wert: `${fmt.number(bd.sys)}/${fmt.number(bd.dia)}`, einheit: "mmHg", einordnung: v.contextBloodPressure, herkunftId: "blutdruck" },
        { label: v.labelWeight, wert: nf1(koerpermasse.gewichtKg), einheit: "kg", einordnung: v.contextWeight, herkunftId: "gewicht" },
        { label: v.labelBmi, wert: nf1(koerpermasse.bmi), einordnung: v.contextBmi, herkunftId: "bmi" },
      ],
    },
  ];

  // Zurück zum Ursprung: aus der Zeitraum-Kachel (VitaLink) zurück nach /vitalink,
  // sonst nach Home. Der Home-Tab bleibt aktiv (Zuordnung in BottomNav).
  const back =
    from === "vitalink"
      ? { href: "/vitalink", label: v.backInsights }
      : { href: "/dashboard", label: v.backHome };

  return (
    <div className="pb-10">
      <AppHeader title={v.headerTitle} eyebrow={v.headerEyebrow} back={back} />

      <div className="space-y-6 px-4 py-5">
        <p className="px-1 text-[13px] leading-[1.5] text-muted">{v.intro}</p>

        {SEKTIONEN.map((s) => (
          <section key={s.label}>
            <h2 className="section-label mb-2 px-1">{s.label}</h2>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
              {s.werte.map((w, i) => (
                <WertZeile key={w.label} w={w} erste={i === 0} />
              ))}
            </div>
          </section>
        ))}

        <div className="flex items-start gap-2.5 rounded-2xl bg-surface-2 p-3">
          <p className="text-[12px] leading-[1.5] text-muted">{v.footerNote}</p>
        </div>
      </div>
    </div>
  );
}

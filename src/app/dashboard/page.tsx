"use client";

import { Moon, Heart, Footprints, Droplet, Activity, CalendarHeart } from "lucide-react";
import HinweisCard from "@/components/HinweisCard";
import WochenrueckblickCard from "@/components/WochenrueckblickCard";
import MetricTile from "@/components/MetricTile";
import FeatureCard from "@/components/FeatureCard";
import { hinweiseSortiert } from "@/data/hinweise";
import { vorname } from "@/data/profile";
import { wearableSummary } from "@/data/wearable";

function tageszeitGruss(stunde: number): string {
  if (stunde >= 5 && stunde < 11) return "Guten Morgen";
  if (stunde >= 11 && stunde < 17) return "Guten Tag";
  if (stunde >= 17 && stunde < 22) return "Guten Abend";
  return "Hallo";
}

const schlafText = wearableSummary.schlafStd.toLocaleString("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const schritteText = wearableSummary.schritte.toLocaleString("de-DE");

const deployStamp = process.env.NEXT_PUBLIC_BUILD_TIME
  ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " Uhr"
  : null;

export default function DashboardPage() {
  const hinweisCount = hinweiseSortiert.length;
  const gruss = tageszeitGruss(new Date().getHours());

  return (
    <div className="pt-safe pb-6">
      {/* ── Zone A: Greeting ── */}
      <header className="flex items-center justify-between gap-3 px-4 pt-5">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">
            {gruss}, {vorname}
          </h1>
          {deployStamp && (
            <p className="mt-1 text-[13px] text-muted">
              Stand: {deployStamp} · {hinweisCount} Empfehlungen
            </p>
          )}
        </div>
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cat-lifestyle-light text-[17px] font-semibold text-cat-lifestyle shadow-sm"
        >
          {vorname.charAt(0)}
        </span>
      </header>

      {/* ── Zone B: Kombinierungsstatement (USP, §3b Ebene 3) ── */}
      <div className="mt-5 px-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-2">
          Analyse aus ePA + Wearable
        </p>
        <div className="mt-2 h-px bg-border" />
      </div>

      {/* ── Zone C: Metrik-Kacheln ── */}
      <section className="mt-4 grid grid-cols-3 gap-2.5 px-4" aria-label="Heutige Kennzahlen">
        <MetricTile
          icon={<Moon aria-hidden size={16} className="text-cat-lifestyle" />}
          value={schlafText}
          label="Std. Schlaf"
        />
        <MetricTile
          icon={<Heart aria-hidden size={16} className="text-cat-cardio" />}
          value={String(wearableSummary.ruhepuls)}
          label="BPM Ruhe"
        />
        <MetricTile
          icon={<Footprints aria-hidden size={16} className="text-cat-travel" />}
          value={schritteText}
          label="Schritte"
        />
      </section>

      {/* ── Zone D: Hinweis-Karten ── */}
      <section className="mt-7 px-4">
        <h2 className="section-label mb-3">Deine Empfehlungen</h2>
        <div className="space-y-3">
          {hinweiseSortiert.map((h) => (
            <HinweisCard key={h.id} hinweis={h} />
          ))}
        </div>
      </section>

      {/* ── Zone E: Wochenrückblick ── */}
      <section className="mt-7 px-4">
        <h2 className="section-label mb-3">Deine Woche</h2>
        <WochenrueckblickCard />
      </section>

      {/* ── Zone F: Weitere Datenquellen (Plattform-Erweiterungen) ── */}
      <section className="mt-7">
        <div className="px-4">
          <h2 className="section-label">Mehr aus deinen Daten</h2>
          <p className="mt-1 text-[14px] text-ink">
            VitaLink wächst über ePA und Wearable hinaus.
          </p>
        </div>
        <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          <FeatureCard
            soft="bg-cat-future-light"
            icon={<Droplet aria-hidden size={22} className="text-cat-future" />}
            title="Glukose-Monitoring"
            text="Verbinde einen CGM-Sensor und sieh deine Glukosekurven gemeinsam mit Schlaf und HRV in deiner ePA-Analyse."
          />
          <FeatureCard
            soft="bg-cat-cardio-light"
            icon={<Activity aria-hidden size={22} className="text-cat-cardio" />}
            title="Klinik-EKG in der ePA"
            text="Sobald deine Praxis EKG-Befunde digital übermittelt, erkennt VitaLink Muster im Langzeitverlauf."
          />
          <FeatureCard
            soft="bg-cat-lifestyle-light"
            icon={<CalendarHeart aria-hidden size={22} className="text-cat-lifestyle" />}
            title="Zyklus & Erholung"
            text="Verknüpfe Zyklusphasen mit Schlaf, HRV und Energielevel für hormonbewusste Vorsorge."
          />
        </div>
      </section>
    </div>
  );
}

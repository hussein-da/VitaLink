"use client";

import { Moon, Heart, Footprints, Activity } from "lucide-react";
import HinweisCard from "@/components/HinweisCard";
import WochenrueckblickCard from "@/components/WochenrueckblickCard";
import MetricTile from "@/components/MetricTile";
import StatusRings from "@/components/StatusRings";
import { hinweiseSortiert } from "@/data/hinweise";
import { vorname } from "@/data/profile";
import { wearableStreams, wochenSchritte } from "@/data/wearable";

const schlaf = wearableStreams.find((s) => s.metric === "schlafdauer")!;
const puls = wearableStreams.find((s) => s.metric === "ruhepuls")!;
const hrv = wearableStreams.find((s) => s.metric === "hrv")!;
const schritte = wearableStreams.find((s) => s.metric === "schritte")!;

const latestSchlaf = schlaf.series[schlaf.series.length - 1].value;
const latestPuls = puls.series[puls.series.length - 1].value;
const latestHrv = hrv.series[hrv.series.length - 1].value;
const latestSchritte = schritte.series[schritte.series.length - 1].value;

// Wochenmittel für die Hero-Ringe (statische, synthetische Daten).
const avgSchritteWoche =
  wochenSchritte.tage.reduce((s, t) => s + t.value, 0) / wochenSchritte.tage.length;
const last7Schlaf = schlaf.series.slice(-7);
const avgSchlafWoche = last7Schlaf.reduce((s, t) => s + t.value, 0) / last7Schlaf.length;

const SCHRITT_ZIEL = 8500;
const SCHLAF_ZIEL = 8;

export default function DashboardPage() {
  const hinweisCount = hinweiseSortiert.length;
  const heute = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="pb-6">
      {/* === A) GREETING HEADER (kein weißer Balken) === */}
      <header className="flex items-center justify-between gap-3 px-4 pb-2 pt-6">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">
            Hallo, {vorname}
          </h1>
          <p className="mt-0.5 text-xs text-muted">{heute}</p>
        </div>
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary"
        >
          {vorname.charAt(0)}
        </span>
      </header>

      <div className="space-y-7 px-4 pt-3">
        {/* === B) HERO-STATUS-RING === */}
        <section aria-label="Wochenstatus" className="flex flex-col items-center py-2">
          <StatusRings
            activity={avgSchritteWoche / SCHRITT_ZIEL}
            recovery={avgSchlafWoche / SCHLAF_ZIEL}
            centerValue={hinweisCount}
            centerLabel="Hinweise"
          />
        </section>

        {/* === C) QUICK-STATS === */}
        <section>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            Heute
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricTile
              icon={<Heart aria-hidden size={18} className="text-cat-cardio" />}
              iconBg="bg-cat-cardio-soft"
              value={String(latestPuls)}
              unit="bpm"
              label="Ruhepuls"
            />
            <MetricTile
              icon={<Footprints aria-hidden size={18} className="text-primary" />}
              iconBg="bg-primary-soft"
              value={latestSchritte.toLocaleString("de-DE")}
              label="Schritte"
            />
            <MetricTile
              icon={<Moon aria-hidden size={18} className="text-cat-travel" />}
              iconBg="bg-cat-travel-soft"
              value={latestSchlaf.toLocaleString("de-DE", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              unit="Std"
              label="Schlaf"
            />
            <MetricTile
              icon={<Activity aria-hidden size={18} className="text-primary" />}
              iconBg="bg-primary-soft"
              value={String(latestHrv)}
              unit="ms"
              label="HRV"
            />
          </div>
        </section>

        {/* === D) HINWEIS-KARTEN === */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Deine Hinweise
            </h2>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-ink">
              {hinweisCount}
            </span>
          </div>
          <div className="space-y-3">
            {hinweiseSortiert.map((h) => (
              <HinweisCard key={h.id} hinweis={h} />
            ))}
          </div>
        </section>

        {/* === E) WOCHENRÜCKBLICK === */}
        <WochenrueckblickCard />
      </div>
    </div>
  );
}

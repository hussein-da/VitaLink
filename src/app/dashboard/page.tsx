"use client";

import { Moon, Heart, Footprints, Activity } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import HinweisCard from "@/components/HinweisCard";
import WochenrueckblickCard from "@/components/WochenrueckblickCard";
import { hinweiseSortiert } from "@/data/hinweise";
import { vorname } from "@/data/profile";
import { wearableStreams } from "@/data/wearable";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Guten Morgen";
  if (h < 18) return "Guten Tag";
  return "Guten Abend";
}

const schlaf = wearableStreams.find((s) => s.metric === "schlafdauer")!;
const puls = wearableStreams.find((s) => s.metric === "ruhepuls")!;
const hrv = wearableStreams.find((s) => s.metric === "hrv")!;
const schritte = wearableStreams.find((s) => s.metric === "schritte")!;

const latestSchlaf = schlaf.series[schlaf.series.length - 1].value;
const latestPuls = puls.series[puls.series.length - 1].value;
const latestHrv = hrv.series[hrv.series.length - 1].value;
const latestSchritte = schritte.series[schritte.series.length - 1].value;

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  trend: "fallend" | "steigend" | "schwankend" | "neutral";
  trendGood: boolean;
  /** CSS classes for the icon container */
  iconBg: string;
}

function StatTile({ icon, label, value, unit, trend, trendGood, iconBg }: StatTileProps) {
  const trendArrow = trend === "fallend" ? "↓" : trend === "steigend" ? "↑" : "~";
  const trendColor = trendGood ? "text-primary" : "text-accent";

  return (
    <div className="flex-1 rounded-2xl border border-border bg-surface p-3.5 shadow-sm transition-shadow hover:shadow-md">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 font-display text-xl font-semibold leading-tight text-ink">
        {value}
        <span className="ml-1 text-sm font-normal text-muted">{unit}</span>
      </p>
      <p className={`mt-0.5 text-xs font-semibold ${trendColor}`}>
        {trendArrow} {trend}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const hinweisCount = hinweiseSortiert.length;
  const schrittePercent = Math.min(Math.round((latestSchritte / 8500) * 100), 100);

  return (
    <div className="pb-4">
      <AppHeader title={`${getGreeting()}, ${vorname}`} brand />

      <div className="space-y-6 px-4 pt-5">

        {/* === QUICK STATS ROW === */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Heute im Überblick</h2>
            <span className="text-xs text-muted">letzte 14 Tage</span>
          </div>

          <div className="flex gap-2.5">
            <StatTile
              icon={<Moon size={18} className="text-primary" />}
              label="Schlaf"
              value={latestSchlaf.toFixed(1)}
              unit="h"
              trend="fallend"
              trendGood={false}
              iconBg="bg-primary-soft"
            />
            <StatTile
              icon={<Heart size={18} className="text-accent" />}
              label="Ruhepuls"
              value={String(latestPuls)}
              unit="bpm"
              trend="steigend"
              trendGood={false}
              iconBg="bg-accent-soft"
            />
            <StatTile
              icon={<Activity size={18} className="text-primary" />}
              label="HRV"
              value={String(latestHrv)}
              unit="ms"
              trend="fallend"
              trendGood={false}
              iconBg="bg-primary-soft"
            />
          </div>

          {/* Schritte – full width */}
          <div className="mt-2.5 flex items-center gap-4 rounded-2xl border border-border bg-surface p-3.5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <Footprints size={20} className="text-accent-ink" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted">Schritte heute</p>
              <p className="font-display text-xl font-semibold leading-tight text-ink">
                {latestSchritte.toLocaleString("de-DE")}
                <span className="ml-1 text-sm font-normal text-muted">Schritte</span>
              </p>
            </div>
            {/* Mini progress bar */}
            <div className="w-24">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>Ziel 8.500</span>
                <span className="font-semibold text-primary">{schrittePercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${schrittePercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === HINWEISE SECTION === */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-ink">Deine Hinweise</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-ink">
              {hinweisCount}
            </span>
          </div>

          <div className="space-y-3">
            {hinweiseSortiert.map((h) => (
              <HinweisCard key={h.id} hinweis={h} />
            ))}
          </div>
        </section>

        {/* === WOCHENRÜCKBLICK (FR-I, DF17) === */}
        <WochenrueckblickCard />

      </div>
    </div>
  );
}

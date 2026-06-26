"use client";

import { Moon, Heart, Footprints, Activity } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import HinweisCard from "@/components/HinweisCard";
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
  color: string;
  softColor: string;
}

function StatTile({ icon, label, value, unit, trend, trendGood, color, softColor }: StatTileProps) {
  const trendArrow = trend === "fallend" ? "↓" : trend === "steigend" ? "↑" : "~";
  const trendColor = trendGood ? "text-primary" : "text-accent";

  return (
    <div className={`flex-1 rounded-2xl p-3.5 ${softColor}`}>
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 font-display text-xl font-semibold text-ink leading-tight">
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

  return (
    <div className="pb-4">
      <AppHeader title={`${getGreeting()}, ${vorname}`} brand />

      <div className="px-4 pt-5 space-y-6">

        {/* === QUICK STATS ROW === */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Heute im Überblick</h2>
            <span className="text-xs text-muted">letzte 14 Tage</span>
          </div>
          <div className="flex gap-2.5">
            <StatTile
              icon={<Moon size={18} className="text-indigo-700" />}
              label="Schlaf"
              value={latestSchlaf.toFixed(1)}
              unit="h"
              trend="fallend"
              trendGood={false}
              color="bg-indigo-100"
              softColor="bg-white border border-border shadow-sm"
            />
            <StatTile
              icon={<Heart size={18} className="text-red-600" />}
              label="Ruhepuls"
              value={String(latestPuls)}
              unit="bpm"
              trend="steigend"
              trendGood={false}
              color="bg-red-100"
              softColor="bg-white border border-border shadow-sm"
            />
            <StatTile
              icon={<Activity size={18} className="text-emerald-700" />}
              label="HRV"
              value={String(latestHrv)}
              unit="ms"
              trend="fallend"
              trendGood={false}
              color="bg-emerald-100"
              softColor="bg-white border border-border shadow-sm"
            />
          </div>

          {/* Schritte – full width */}
          <div className="mt-2.5 flex items-center gap-4 rounded-2xl border border-border bg-white p-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <Footprints size={20} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted">Schritte heute</p>
              <p className="font-display text-xl font-semibold text-ink leading-tight">
                {latestSchritte.toLocaleString("de-DE")}
                <span className="ml-1 text-sm font-normal text-muted">Schritte</span>
              </p>
            </div>
            {/* mini progress bar */}
            <div className="w-24">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>Ziel 8.500</span>
                <span className="font-semibold text-orange-600">
                  {Math.round((latestSchritte / 8500) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-orange-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{ width: `${Math.min((latestSchritte / 8500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === HINWEISE SECTION === */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
              Deine Hinweise
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-ink">
                {hinweisCount}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {hinweiseSortiert.map((h) => (
              <HinweisCard key={h.id} hinweis={h} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

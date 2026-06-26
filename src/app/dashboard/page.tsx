"use client";

import { Moon, Heart, Footprints, Activity, ShieldCheck, CheckCircle2, Info } from "lucide-react";
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
    <div className="flex-1 rounded-2xl border border-border bg-surface p-3.5 shadow-card">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 font-display text-2xl font-semibold leading-tight text-ink">
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
  const aufmerksamkeit = hinweiseSortiert.filter((h) => h.unsicher).length;
  const heute = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const schrittePercent = Math.min(Math.round((latestSchritte / 8500) * 100), 100);

  const alleGut = aufmerksamkeit === 0;
  const heroTitel = alleGut
    ? "Alles im grünen Bereich"
    : `${aufmerksamkeit} ${aufmerksamkeit === 1 ? "Hinweis braucht" : "Hinweise brauchen"} deine Aufmerksamkeit`;

  return (
    <div className="pb-6">
      {/* === HOME-HEADER (Typ A, §1b) === */}
      <header className="px-4 pb-1 pt-6">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <ShieldCheck aria-hidden size={14} /> VitaLink
        </span>
        <h1 className="mt-1.5 font-display text-[28px] font-semibold leading-tight text-ink">
          {getGreeting()}, {vorname}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {heute} · {hinweisCount} {hinweisCount === 1 ? "Hinweis" : "Hinweise"} für dich
        </p>
      </header>

      <div className="space-y-6 px-4 pt-4">
        {/* === HERO-STATUSKARTE (§2a) – Statusindikator, nicht antippbar === */}
        <section
          aria-label="Gesundheitsstatus"
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card"
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              alleGut ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent-ink"
            }`}
          >
            {alleGut ? (
              <CheckCircle2 aria-hidden size={26} />
            ) : (
              <Info aria-hidden size={26} />
            )}
          </span>
          <div className="min-w-0">
            <p className="font-display text-[22px] font-semibold leading-snug text-ink">
              {heroTitel}
            </p>
            <p className="mt-0.5 text-xs text-muted">Zuletzt aktualisiert: heute</p>
          </div>
        </section>

        {/* === QUICK STATS (§2, beibehalten & angeglichen) === */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-label">Heute im Überblick</h2>
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
          <div className="mt-2.5 flex items-center gap-4 rounded-2xl border border-border bg-surface p-3.5 shadow-card">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <Footprints size={20} className="text-accent-ink" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted">Schritte heute</p>
              <p className="font-display text-2xl font-semibold leading-tight text-ink">
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
            <h2 className="section-label">Deine Hinweise</h2>
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

        {/* === WOCHENRÜCKBLICK (FR-I, DF17) === */}
        <WochenrueckblickCard />
      </div>
    </div>
  );
}

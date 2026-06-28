"use client";

import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  Sparkles,
  Footprints,
  TrendingUp,
  Droplets,
  Wind,
} from "lucide-react";
import WellnessHero from "@/components/WellnessHero";
import GeraeteSektion from "@/components/GeraeteSektion";
import { vorname } from "@/data/profile";
import { wearableSummary, glukoseSummary } from "@/data/wearable";
import { hinweise } from "@/data/hinweise";
import { istZeitkritisch } from "@/lib/dringlichkeit";

function tageszeitGruss(stunde: number): string {
  if (stunde >= 5 && stunde < 12) return "Guten Morgen";
  if (stunde >= 12 && stunde < 18) return "Guten Tag";
  if (stunde >= 18 && stunde < 22) return "Guten Abend";
  return "Gute Nacht";
}

const QUICK = [
  { icon: Footprints, color: "text-cat-travel", value: wearableSummary.schritte.toLocaleString("de-DE"), label: "Schritte" },
  { icon: TrendingUp, color: "text-cat-lifestyle", value: `${wearableSummary.hrv} ms`, label: "HRV" },
  { icon: Droplets, color: "text-cat-lifestyle", value: String(glukoseSummary.nuechternSchnitt), label: "Glukose" },
  { icon: Wind, color: "text-muted", value: `${wearableSummary.spo2}%`, label: "SpO2" },
] as const;

export default function HomePage() {
  const jetzt = new Date();
  const gruss = tageszeitGruss(jetzt.getHours());
  const datum = jetzt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const zeitkritisch = hinweise.some((h) => istZeitkritisch(h.dringlichkeit));

  return (
    <div className="pt-safe pb-6">
      {/* ── Zone 1: Greeting ── */}
      <header className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold leading-tight text-ink">
            {gruss}, {vorname}
          </h1>
          <p className="mt-0.5 text-[13px] capitalize text-muted">{datum}</p>
        </div>
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cat-lifestyle-light text-[17px] font-semibold text-cat-lifestyle"
        >
          {vorname.charAt(0)}
        </span>
      </header>

      {/* ── Zone 2: Wellness-Hero ── */}
      <div className="mt-7 px-5">
        <WellnessHero />
      </div>

      {/* ── Zone 3: Dringlichkeits-Hinweis ── */}
      {zeitkritisch && (
        <div className="mt-4 px-5">
          <Link
            href="/vitalink?filter=termine"
            className="flex items-center gap-3 rounded-[20px] border-l-4 border-status-warn bg-surface px-[18px] py-4 shadow-sm transition-transform duration-200 ease-out motion-safe:active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-status-warn-light">
              <Calendar aria-hidden size={20} className="text-status-warn" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-[15px] font-semibold text-ink">2 Termine im Juli</span>
              <span className="text-[13px] text-muted">Zahnarzt · Gynäkologie</span>
            </span>
            <ChevronRight aria-hidden size={16} className="shrink-0 text-muted" />
          </Link>
        </div>
      )}

      {/* ── Zone 4: CTA → VitaLink ── */}
      <div className="mt-4 px-5">
        <Link
          href="/vitalink"
          className="flex items-center justify-between gap-3 rounded-[20px] bg-cat-prevention-light px-5 py-[18px] shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.98]"
        >
          <span className="flex min-w-0 items-start gap-3">
            <Sparkles aria-hidden size={18} className="mt-0.5 shrink-0 text-cat-prevention" />
            <span className="min-w-0">
              <span className="block text-[16px] font-semibold text-ink">
                5 Empfehlungen für dich
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-muted">
                Schlaf · Herz · Reise · Glukose · Zahnarzt
              </span>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-cat-prevention px-4 py-2 text-[13px] font-semibold text-cat-prevention-on">
            Alle ansehen
          </span>
        </Link>
      </div>

      {/* ── Zone 5: Verbundene Geräte ── */}
      <GeraeteSektion />

      {/* ── Zone 6: Schnell-Metrik-Zeile ── */}
      <section
        aria-label="Schnelle Kennzahlen"
        className="no-scrollbar mb-2 mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1"
      >
        {QUICK.map(({ icon: Icon, color, value, label }) => (
          <div
            key={label}
            className="flex min-w-[100px] flex-1 flex-col items-center gap-1.5 rounded-2xl bg-surface px-3 py-3.5 text-center shadow-sm"
          >
            <Icon aria-hidden size={16} className={color} />
            <span className="text-[17px] font-semibold text-ink">{value}</span>
            <span className="text-[11px] text-muted">{label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

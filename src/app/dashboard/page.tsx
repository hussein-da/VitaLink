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
  Wifi,
  Shield,
  RefreshCw,
  Clock,
} from "lucide-react";
import WellnessHero from "@/components/WellnessHero";
import BatteryRing from "@/components/BatteryRing";
import AppleWatchIllustration from "@/components/AppleWatchIllustration";
import EpaIllustration from "@/components/EpaIllustration";
import { vorname } from "@/data/profile";
import { wearableSummary, glukoseSummary, geraete } from "@/data/wearable";
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

const EPA_DOTS: { label: string }[] = [
  { label: "Laborwerte" },
  { label: "Vitalwerte" },
  { label: "Impfungen" },
];

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

      {/* ── Zone 3: Dringlichkeits-Hinweis (nur bei Deadline < 30 Tage) ── */}
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
      <section aria-label="Verbundene Geräte" className="mt-4 px-5">
        <h2
          className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted"
        >
          Verbundene Geräte
        </h2>

        <div className="flex flex-col gap-[10px]">
          {/* Apple Watch Card */}
          <div className="flex items-center gap-4 rounded-[20px] bg-surface px-[18px] py-4 shadow-card">
            <AppleWatchIllustration />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {/* Row 1: Name + Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-semibold text-ink">
                  {geraete.appleWatch.modell}
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-ok-light px-[10px] py-[3px]">
                  <Wifi aria-hidden size={10} className="text-status-ok" />
                  <span className="text-[11px] font-semibold text-status-ok">Verbunden</span>
                </span>
              </div>

              {/* Row 2: Position */}
              <p className="text-[12px] text-muted">
                {geraete.appleWatch.amHandgelenk ? "Am Handgelenk erkannt" : "Nicht erkannt"}
              </p>

              {/* Row 3: Last sync */}
              <span className="flex items-center gap-1.5">
                <RefreshCw aria-hidden size={11} className="text-muted" />
                <span className="text-[12px] text-muted">
                  Synchronisiert {geraete.appleWatch.letzteSync}
                </span>
              </span>

              {/* Akku-Anzeige */}
              <div className="mt-[10px] flex items-center gap-2.5">
                <BatteryRing prozent={geraete.appleWatch.akkuProzent} />
                <div>
                  <p className="text-[14px] font-semibold text-ink">
                    {geraete.appleWatch.akkuProzent} %
                  </p>
                  <p className="text-[11px] text-muted">Akku</p>
                </div>
                <span className="mx-1 text-[11px] text-muted">·</span>
                <p className="text-[12px] text-muted">
                  Nächste Sync: {geraete.appleWatch.naechsteSync}
                </p>
              </div>
            </div>
          </div>

          {/* EPA Card */}
          <div className="flex items-center gap-4 rounded-[20px] bg-surface px-[18px] py-4 shadow-card">
            <EpaIllustration />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {/* Row 1: Name + Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-semibold text-ink">
                  Elektronische Patientenakte
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-ok-light px-[10px] py-[3px]">
                  <Shield aria-hidden size={10} className="text-status-ok" />
                  <span className="text-[11px] font-semibold text-status-ok">Verbunden</span>
                </span>
              </div>

              {/* Row 2: Provider */}
              <p className="text-[12px] text-muted">{geraete.epa.anbieter}</p>

              {/* Row 3: Last sync */}
              <span className="flex items-center gap-1.5">
                <RefreshCw aria-hidden size={11} className="text-muted" />
                <span className="text-[12px] text-muted">
                  Letzte Sync: {geraete.epa.letzteSync}
                </span>
              </span>

              {/* Row 4: Next sync */}
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden size={11} className="text-muted" />
                <span className="text-[12px] text-muted">
                  Nächste Sync: {geraete.epa.naechsteSync}
                </span>
              </span>

              {/* Status-Dots: Datenvollständigkeit */}
              <div className="mt-[10px] flex items-center gap-3">
                {EPA_DOTS.map(({ label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span
                      className="block h-2 w-2 rounded-full bg-status-ok"
                      aria-hidden
                    />
                    <span className="text-[11px] text-muted">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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

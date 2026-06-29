import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Footprints,
  Moon,
  Heart,
  Activity,
  Syringe,
  XCircle,
  Smile,
  ShieldCheck,
} from "lucide-react";
import WellnessHero from "@/components/WellnessHero";
import GeraeteSektion from "@/components/GeraeteSektion";
import NotificationGlocke from "@/components/NotificationGlocke";
import HeaderAvatar from "@/components/HeaderAvatar";
import { vorname } from "@/data/profile";
import { wearableSummary, glukoseSummary } from "@/data/wearable";
import { hinweiseSortiert } from "@/data/hinweise";
import { geplanteReise } from "@/data/epa";
import { fehlendeReiseimpfungen } from "@/data/reise";
import { tageBis } from "@/lib/zeit";
import type { Szenario } from "@/lib/types";

function tageszeitGruss(stunde: number): string {
  if (stunde >= 5 && stunde < 12) return "Guten Morgen";
  if (stunde >= 12 && stunde < 18) return "Guten Tag";
  if (stunde >= 18 && stunde < 22) return "Guten Abend";
  return "Gute Nacht";
}

const SZENARIO_KURZ: Record<Szenario, string> = {
  lifestyle: "Schlaf",
  kardiometabolisch: "Herz",
  reise: "Reise",
  stoffwechsel: "Glukose",
  vorsorge: "Zahnarzt",
};

const GRID = [
  {
    icon: Footprints,
    farbe: "text-cat-travel",
    bg: "bg-cat-travel-light",
    wert: wearableSummary.schritte.toLocaleString("de-DE"),
    label: "Schritte",
    badge: "+18 %",
    sub: "letzte Woche: 10.100",
  },
  {
    icon: Moon,
    farbe: "text-cat-lifestyle",
    bg: "bg-cat-lifestyle-light",
    wert: `${wearableSummary.schlafStd.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`,
    label: "Schlaf",
    badge: "89 % Ziel",
    sub: "Ziel: 7,5 h",
  },
  {
    icon: Heart,
    farbe: "text-cat-cardio",
    bg: "bg-cat-cardio-light",
    wert: String(wearableSummary.ruhepuls),
    label: "BPM",
    badge: "Normal",
    sub: "letzte Woche: 62",
  },
  {
    icon: Activity,
    farbe: "text-cat-lifestyle",
    bg: "bg-cat-lifestyle-light",
    wert: String(glukoseSummary.nuechternSchnitt),
    label: "mg/dl",
    badge: "Optimal",
    sub: "Vorwert: 95 mg/dl",
  },
] as const;

export default function HomePage() {
  const jetzt = new Date();
  const gruss = tageszeitGruss(jetzt.getHours());
  const datum = jetzt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const empfehlungLabels = hinweiseSortiert.map((h) => SZENARIO_KURZ[h.szenario]).join(" · ");

  const reiseTage = tageBis(geplanteReise.datum);
  const reiseWochen = Math.floor(reiseTage / 7);
  const reiseFehlend = fehlendeReiseimpfungen(geplanteReise.zielCode);
  const zahnarztTage = tageBis("2026-07-12");

  return (
    <div className="pt-safe pb-6">
      {/* ── Zone 1: Greeting + Glocke ── */}
      <header className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold leading-tight text-ink">
            {gruss}, {vorname}
          </h1>
          <p className="mt-0.5 text-[13px] capitalize text-muted">{datum}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <NotificationGlocke />
          <HeaderAvatar />
        </div>
      </header>

      {/* ── Zone 2: Wellness-Hero ── */}
      <div className="mt-7 px-5">
        <WellnessHero />
      </div>

      {/* ── Zone 3: Kern-Empfehlung zuerst — CTA → VitaLink ── */}
      <div className="mt-4 px-5">
        <Link
          href="/vitalink"
          className="flex items-center justify-between gap-3 rounded-[20px] bg-cat-prevention-light px-5 py-[18px] shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.98]"
        >
          <span className="flex min-w-0 items-start gap-3">
            <Sparkles aria-hidden size={18} className="mt-0.5 shrink-0 text-cat-prevention" />
            <span className="min-w-0">
              <span className="block text-[16px] font-semibold text-ink">
                {hinweiseSortiert.length} Empfehlungen für dich
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-muted">{empfehlungLabels}</span>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-cat-prevention px-4 py-2 text-[13px] font-semibold text-cat-prevention-on">
            Alle ansehen
          </span>
        </Link>
      </div>

      {/* ── Zone 4: Reise-Vorsorge-Highlight (nur wenn Reise < 60 Tage) ── */}
      {reiseTage >= 0 && reiseTage <= 60 && (
        <div className="mt-4 px-5">
          <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
            <div className="flex items-center gap-3 bg-cat-travel-light px-4 py-3.5">
              <span className="rounded-full bg-status-warn-light px-2.5 py-[3px] text-[11px] font-semibold text-status-warn">
                Reise-Vorsorge
              </span>
              <span className="flex-1 text-[17px] font-semibold text-ink">
                Thailand in {reiseWochen} Wochen 🇹🇭
              </span>
              <svg width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden className="shrink-0">
                <circle cx="20" cy="20" r="18" stroke="rgb(var(--c-cat-travel))" strokeWidth="1.5" />
                <ellipse cx="20" cy="20" rx="18" ry="7" stroke="rgb(var(--c-cat-travel))" strokeWidth="1" opacity="0.5" />
                <line x1="20" y1="2" x2="20" y2="38" stroke="rgb(var(--c-cat-travel))" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
            <div className="px-4 pb-3.5 pt-3">
              <p className="mb-2 text-[13px] text-muted">Hepatitis A und B fehlen in deiner ePA.</p>
              <div className="flex flex-col gap-1.5">
                {reiseFehlend.map((impf) => (
                  <span key={impf} className="flex items-center gap-1.5 text-[12px] text-muted">
                    <XCircle aria-hidden size={12} className="shrink-0 text-status-warn" />
                    {impf}: kein Eintrag
                  </span>
                ))}
              </div>
              <Link
                href="/reise?from=reise-impfung"
                className="tap mt-3 inline-flex items-center gap-1.5 rounded-full bg-cat-travel-light px-3.5 py-2 text-[13px] font-semibold text-cat-travel"
              >
                <Syringe aria-hidden size={13} />
                Impf-Status prüfen
                <ChevronRight aria-hidden size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Zone 5: Nächster-Termin-Karte ── */}
      <div className="mt-4 px-5">
        <Link
          href="/hinweis/zahnarzt"
          className="flex items-center gap-3.5 rounded-[20px] bg-surface p-4 shadow-card transition-transform duration-200 ease-out motion-safe:active:scale-[0.98]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cat-prevention-light">
            <Smile aria-hidden size={24} className="text-cat-prevention" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Nächster Termin
            </span>
            <span className="text-[16px] font-semibold text-ink">12. Juli · Zahnarzt</span>
            <span className="text-[12px] text-muted">Praxis Dr. Maier, Bochum</span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-2">
            <span className="rounded-full bg-status-warn-light px-2.5 py-[3px] text-[11px] font-semibold text-status-warn">
              in {zahnarztTage} Tagen
            </span>
            <ChevronRight aria-hidden size={16} className="text-muted" />
          </span>
        </Link>
      </div>

      {/* ── Zone 6: Verbundene Geräte ── */}
      <GeraeteSektion />

      {/* ── Zone 7: Datengrid „Aktuelle Werte" ── */}
      <section aria-label="Aktuelle Werte" className="mt-4 px-5">
        <div className="mb-[10px] flex items-center justify-between px-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
            Aktuelle Werte
          </h2>
          <Link href="/vitalink" className="flex items-center gap-0.5 text-[12px] font-semibold text-cat-lifestyle">
            Alle ansehen <ChevronRight aria-hidden size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-4 overflow-hidden rounded-2xl bg-surface shadow-card">
          {GRID.map(({ icon: Icon, farbe, bg, wert, label, badge, sub }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 px-1 py-3.5 text-center ${
                i < GRID.length - 1 ? "border-r border-border" : ""
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${bg}`}>
                <Icon aria-hidden size={16} className={farbe} />
              </span>
              <span className={`text-[18px] font-bold leading-none ${farbe}`}>{wert}</span>
              <span className="text-[11px] text-muted">{label}</span>
              <span className="rounded-full bg-status-ok-light px-1.5 py-0.5 text-[10px] font-semibold text-status-ok">
                {badge}
              </span>
              <span className="text-[10px] leading-tight text-muted">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Zone 8: Datenschutz-Banner ── */}
      <div className="mt-4 px-5">
        <Link
          href="/einstellungen"
          className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-sm"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-status-ok-light">
            <ShieldCheck aria-hidden size={18} className="text-status-ok" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="text-[13px] font-semibold text-ink">Deine Daten. Deine Entscheidung.</span>
            <span className="text-[11px] text-muted">DSGVO-konform · lokal gespeichert</span>
          </span>
          <ChevronRight aria-hidden size={14} className="shrink-0 text-muted" />
        </Link>
      </div>
    </div>
  );
}

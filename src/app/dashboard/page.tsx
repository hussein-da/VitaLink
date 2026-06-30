import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Syringe, XCircle } from "lucide-react";
import WellnessHero from "@/components/WellnessHero";
import NotificationGlocke from "@/components/NotificationGlocke";
import HeaderAvatar from "@/components/HeaderAvatar";
import { vorname } from "@/data/profile";
import { wearableSummary, glukoseSummary, atemfrequenzSchnitt } from "@/data/wearable";
import { geplanteReise, blutdruckReihe } from "@/data/epa";
import { fehlendeReiseimpfungen } from "@/data/reise";
import { tageBis } from "@/lib/zeit";

function tageszeitGruss(stunde: number): string {
  if (stunde >= 5 && stunde < 12) return "Guten Morgen";
  if (stunde >= 12 && stunde < 18) return "Guten Tag";
  if (stunde >= 18 && stunde < 22) return "Guten Abend";
  return "Gute Nacht";
}

// Aktuellster Blutdruck aus der 6-Monats-Reihe (ePA, synthetisch).
const bd = blutdruckReihe[blutdruckReihe.length - 1];

const GRID = [
  { img: "/emoji/schritte.png", farbe: "text-cat-travel", wert: wearableSummary.schritte.toLocaleString("de-DE"), label: "Schritte", badge: "+18 %", sub: "Vorwoche: 10.100" },
  { img: "/emoji/schlaf.png", farbe: "text-cat-lifestyle", wert: `${wearableSummary.schlafStd.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`, label: "Schlaf", badge: "89 % Ziel", sub: "Ziel: 7,5 h" },
  { img: "/emoji/puls.png", farbe: "text-cat-cardio", wert: String(wearableSummary.ruhepuls), label: "Puls", badge: "Normal", sub: "Vorwoche: 62" },
  { img: "/emoji/blutdruck.png", farbe: "text-cat-cardio", wert: `${bd.sys}/${bd.dia}`, label: "Blutdruck", badge: "Normal", sub: "Norm <130/85" },
  { img: "/emoji/blutzucker.png", farbe: "text-cat-metabolism", wert: String(glukoseSummary.nuechternSchnitt), label: "Blutzucker", badge: "Optimal", sub: "Vorwert: 95" },
  { img: "/emoji/atemfrequenz.png", farbe: "text-cat-lifestyle", wert: String(Math.round(atemfrequenzSchnitt)), label: "Atemfrequenz", badge: "Normal", sub: "Norm 12–20" },
] as const;

const WEGBESCHREIBUNG = "https://www.google.com/maps/search/?api=1&query=Zahnarztpraxis+Dr.+Maier+Bochum";

export default function HomePage() {
  const jetzt = new Date();
  const gruss = tageszeitGruss(jetzt.getHours());
  const datum = jetzt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  const reiseTage = tageBis(geplanteReise.datum);
  const reiseWochen = Math.floor(reiseTage / 7);
  const reiseFehlend = fehlendeReiseimpfungen(geplanteReise.zielCode);
  const zahnarztTage = tageBis("2026-07-12");

  return (
    <div className="pt-safe pb-6">
      {/* ── Header ── */}
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

      {/* ── Score-Karte ── */}
      <div className="mt-5 px-4">
        <WellnessHero />
      </div>

      {/* ── Vital-Meilensteine / Reise ── */}
      {reiseTage >= 0 && reiseTage <= 60 && (
        <div className="mt-3 px-4">
          <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
            <div className="relative bg-cat-travel-light px-4 pb-3 pt-3.5">
              <div className="flex items-center justify-between gap-2 pr-16">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                  <Star aria-hidden size={14} className="text-status-warn" fill="currentColor" />
                  Deine Vital-Meilensteine
                </span>
                <span className="shrink-0 rounded-full bg-surface/70 px-2.5 py-[3px] text-[11px] font-semibold text-cat-travel">
                  In {reiseWochen} Wochen
                </span>
              </div>
              <p className="mt-1.5 max-w-[70%] text-[18px] font-semibold leading-tight text-ink">
                Thailand in {reiseWochen} Wochen 🇹🇭
              </p>
              <span className="absolute right-3 top-3 h-16 w-16">
                <Image src="/illustrations/globus.png" alt="" width={64} height={64} className="h-16 w-16" />
                <Image
                  src="/illustrations/flugzeug.png"
                  alt=""
                  width={30}
                  height={30}
                  className="absolute -right-1.5 -top-1.5 h-[30px] w-[30px] -rotate-12"
                />
              </span>
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

      {/* ── Aktuelle Werte + Nächster Termin (eine Karte) ── */}
      <section aria-label="Aktuelle Werte" className="mt-3 px-4">
        <div className="mb-[10px] flex items-center justify-between px-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
            Aktuelle Werte
          </h2>
          <Link href="/vitalink" className="flex items-center gap-0.5 text-[12px] font-semibold text-cat-lifestyle">
            Alle ansehen <ChevronRight aria-hidden size={12} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
          {/* Metrik-Grid (2 Reihen × 3) */}
          <div className="grid grid-cols-3">
            {GRID.map(({ img, farbe, wert, label, badge, sub }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-1 px-1 py-3.5 text-center ${
                  i % 3 !== 2 ? "border-r border-border" : ""
                } ${i >= 3 ? "border-t border-border" : ""}`}
              >
                <Image src={img} alt="" width={34} height={34} className="h-[34px] w-[34px]" />
                <span className={`text-[18px] font-bold leading-none ${farbe}`}>{wert}</span>
                <span className="text-[11px] text-muted">{label}</span>
                <span className="rounded-full bg-status-ok-light px-1.5 py-0.5 text-[10px] font-semibold text-status-ok">
                  {badge}
                </span>
                <span className="text-[10px] leading-tight text-muted">{sub}</span>
              </div>
            ))}
          </div>

          {/* Nächster Termin */}
          <div className="flex items-center gap-3 border-t border-border px-4 py-3.5">
            <Link href="/hinweis/zahnarzt" className="flex min-w-0 flex-1 items-center gap-3">
              <Image src="/illustrations/termin.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0" />
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Nächster Termin
                </span>
                <span className="block text-[15px] font-semibold text-ink">12. Juli · Zahnarzt</span>
                <span className="block truncate text-[12px] text-muted">Praxis Dr. Maier, Bochum</span>
              </span>
            </Link>
            <span className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="rounded-full bg-status-warn-light px-2.5 py-[3px] text-[11px] font-semibold text-status-warn">
                in {zahnarztTage} Tagen
              </span>
              <a
                href={WEGBESCHREIBUNG}
                target="_blank"
                rel="noopener noreferrer"
                className="tap inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-[3px] text-[11px] font-semibold text-muted"
              >
                <Image src="/emoji/pin.png" alt="" width={14} height={14} className="h-[14px] w-[14px]" />
                Wegbeschreibung
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* ── Datenschutz-Banner ── */}
      <div className="mt-3 px-4">
        <Link href="/einstellungen" className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-sm">
          <Image src="/illustrations/schild.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
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

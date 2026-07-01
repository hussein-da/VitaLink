import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Syringe } from "lucide-react";
import WellnessHero from "@/components/WellnessHero";
import RuhrgebietPanel from "@/components/RuhrgebietPanel";
import NotificationGlocke from "@/components/NotificationGlocke";
import HeaderAvatar from "@/components/HeaderAvatar";
import { vorname, koerpermasse } from "@/data/profile";
import { wearableSummary, glukoseSummary, atemfrequenzSchnitt } from "@/data/wearable";
import { geplanteReise, blutdruckReihe } from "@/data/epa";
import { fehlendeReiseimpfungen } from "@/data/reise";
import { hinweiseSortiert } from "@/data/hinweise";
import { kategorie } from "@/lib/kategorie";
import { tageBis } from "@/lib/zeit";

function tageszeitGruss(stunde: number): string {
  if (stunde >= 5 && stunde < 12) return "Guten Morgen";
  if (stunde >= 12 && stunde < 18) return "Guten Tag";
  if (stunde >= 18 && stunde < 22) return "Guten Abend";
  return "Gute Nacht";
}

const nf1 = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

// Aktuellster Blutdruck aus der 6-Monats-Reihe (ePA, synthetisch).
const bd = blutdruckReihe[blutdruckReihe.length - 1];

// Aktuelle Werte — Beschriftung + Zahl bewusst beide schwarz (nicht bunt),
// die 3D-Icons tragen die Farbe. Horizontal swipebar.
const GRID: { img: string; wert: string; label: string; badge?: string; sub?: string }[] = [
  { img: "/emoji/schritte.png", wert: wearableSummary.schritte.toLocaleString("de-DE"), label: "Schritte", badge: "+18 %", sub: "Vorwoche: 10.100" },
  { img: "/emoji/schlaf.png", wert: `${wearableSummary.schlafStd.toLocaleString("de-DE", nf1)} h`, label: "Schlaf", badge: "89 % Ziel", sub: "Ziel: 7,5 h" },
  { img: "/emoji/puls.png", wert: String(wearableSummary.ruhepuls), label: "Puls", badge: "Normal", sub: "Vorwoche: 62" },
  { img: "/emoji/blutdruck.png", wert: `${bd.sys}/${bd.dia}`, label: "Blutdruck", badge: "Normal", sub: "Norm <130/85" },
  { img: "/emoji/blutzucker.png", wert: String(glukoseSummary.nuechternSchnitt), label: "Blutzucker", badge: "Optimal", sub: "Vorwert: 95" },
  { img: "/emoji/atemfrequenz.png", wert: String(Math.round(atemfrequenzSchnitt)), label: "Atemfrequenz", badge: "Normal", sub: "Norm 12–20" },
  { img: "/emoji/gewicht.png", wert: `${koerpermasse.gewichtKg.toLocaleString("de-DE", nf1)} kg`, label: "Gewicht", badge: "Stabil", sub: "im Zielbereich" },
  { img: "/emoji/groesse.png", wert: `${koerpermasse.groesseCm} cm`, label: "Körpergröße", sub: "gemessen" },
  { img: "/emoji/bmi.png", wert: koerpermasse.bmi.toLocaleString("de-DE", nf1), label: "BMI", badge: "Normal", sub: "18,5–24,9" },
];

const WEGBESCHREIBUNG = "https://www.google.com/maps/search/?api=1&query=Zahnarztpraxis+Dr.+Maier+Bochum";

export default function HomePage() {
  const jetzt = new Date();
  const gruss = tageszeitGruss(jetzt.getHours());
  const datum = jetzt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  const reiseTage = tageBis(geplanteReise.datum);
  const reiseWochen = Math.floor(reiseTage / 7);
  const reiseFehlend = fehlendeReiseimpfungen(geplanteReise.zielCode);
  const fehlendKurz = reiseFehlend.map((i) => i.replace("Hepatitis ", "Hep. ")).join(" + ");
  const zahnarztTage = tageBis("2026-07-28");

  // Wichtigste Empfehlung des Tages (kanonische Reihenfolge).
  const topHinweis = hinweiseSortiert[0];
  const kTop = kategorie(topHinweis.szenario);
  const TopIcon = kTop.icon;

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
      <div className="mt-4 px-4">
        <WellnessHero />
      </div>

      {/* ── Reise (schlank, eine Zeile) ── */}
      {reiseTage >= 0 && reiseTage <= 60 && (
        <div className="mt-3 px-4">
          <Link
            href="/reise?from=reise-impfung"
            className="flex items-center gap-3 rounded-2xl bg-cat-travel-light px-3.5 py-3 shadow-card transition-transform motion-safe:active:scale-[0.99]"
          >
            <span className="relative h-12 w-12 shrink-0">
              <Image src="/illustrations/globus.png" alt="" width={48} height={48} className="h-12 w-12" />
              <Image
                src="/illustrations/flugzeug.png"
                alt=""
                width={22}
                height={22}
                className="absolute -right-1 -top-1 h-[22px] w-[22px] -rotate-12"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[15px] font-semibold leading-tight text-ink">
                <Star aria-hidden size={13} className="shrink-0 text-status-warn" fill="currentColor" />
                Thailand in {reiseWochen} Wochen 🇹🇭
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-muted">{fehlendKurz} fehlen in deiner ePA</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-cat-travel px-3 py-1.5 text-[12px] font-semibold text-cat-travel-on">
              <Syringe aria-hidden size={12} />
              Prüfen
            </span>
          </Link>
        </div>
      )}

      {/* ── Aktuelle Werte (horizontal swipebar) ── */}
      <section aria-label="Aktuelle Werte" className="mt-4">
        <div className="mb-2.5 flex items-center justify-between px-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">Aktuelle Werte</h2>
          <Link href="/vitalink" className="flex items-center gap-0.5 text-[12px] font-semibold text-cat-lifestyle">
            Alle ansehen <ChevronRight aria-hidden size={12} />
          </Link>
        </div>
        <div className="relative">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1">
            {GRID.map(({ img, wert, label, badge, sub }) => (
              <div
                key={label}
                className="flex w-[100px] shrink-0 snap-start flex-col items-center gap-1 rounded-2xl bg-surface p-3 text-center shadow-card"
              >
                <Image src={img} alt="" width={34} height={34} className="h-[34px] w-[34px]" />
                <span className="text-[17px] font-bold leading-none text-ink">{wert}</span>
                <span className="text-[11px] font-semibold text-ink">{label}</span>
                {badge && (
                  <span className="rounded-full bg-status-ok-light px-1.5 py-0.5 text-[10px] font-semibold text-status-ok">
                    {badge}
                  </span>
                )}
                {sub && <span className="text-[10px] leading-tight text-muted">{sub}</span>}
              </div>
            ))}
          </div>
          {/* Fade rechts als Hinweis auf mehr Werte */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg to-transparent" />
        </div>
      </section>

      {/* ── Für dich heute (wichtigste Empfehlung) ── */}
      <section aria-label="Für dich heute" className="mt-3 px-4">
        <Link
          href={`/hinweis/${topHinweis.id}`}
          className={`flex items-center gap-3 rounded-2xl ${kTop.soft} p-3.5 shadow-card transition-transform motion-safe:active:scale-[0.99]`}
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${kTop.solid}`}>
            <TopIcon aria-hidden size={22} className={kTop.on} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-[11px] font-semibold uppercase tracking-[0.06em] ${kTop.text}`}>
              Für dich heute
            </span>
            <span className="block truncate text-[15px] font-semibold text-ink">{topHinweis.titel}</span>
            <span className="block truncate text-[12px] text-muted">{topHinweis.kurz}</span>
          </span>
          <ChevronRight aria-hidden size={18} className={`shrink-0 ${kTop.text}`} />
        </Link>
      </section>

      {/* ── Nächster Termin ── */}
      <div className="mt-3 px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-card">
          <Link href="/hinweis/zahnarzt" className="flex min-w-0 flex-1 items-center gap-3">
            <Image src="/illustrations/termin.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0" />
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">Nächster Termin</span>
              <span className="block text-[15px] font-semibold text-ink">28. Juli · Zahnarzt</span>
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

      {/* ── Aktuelles im Ruhrgebiet ── */}
      <RuhrgebietPanel />

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

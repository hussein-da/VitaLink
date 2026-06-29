"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, SlidersHorizontal, FileText, Watch, Ban } from "lucide-react";
import HinweisCard from "@/components/HinweisCard";
import WochenrueckblickCard from "@/components/WochenrueckblickCard";
import { hinweiseSortiert } from "@/data/hinweise";
import { istZeitkritisch } from "@/lib/dringlichkeit";
import { SZENARIO_HEUTE } from "@/lib/zeit";

const STAND_DATUM = SZENARIO_HEUTE.toLocaleDateString("de-DE", { day: "numeric", month: "long" });

function SectionLabel({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "warn" }) {
  return (
    <h2
      className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.07em] ${
        tone === "warn" ? "text-status-warn" : "text-muted"
      }`}
    >
      {children}
    </h2>
  );
}

/** „Das sagt VitaLink" — eine kuratierte Meta-Erkenntnis aus 14 Tagen. */
function VitalinkInsight() {
  return (
    <section className="mb-8 mt-7 px-4">
      <SectionLabel>Das sagt VitaLink</SectionLabel>
      <div className="rounded-[20px] bg-surface p-5 shadow-card">
        <Sparkles aria-hidden size={18} className="mb-3 text-cat-prevention" />
        <p className="text-[17px] font-semibold leading-[1.45] text-ink">
          Dein Donnerstag ist dein schwächster Tag — schlechtester Schlaf, höchster Stress, höchster
          Glukosepeak. Eine Trainingsverschiebung würde vier Messwerte gleichzeitig verbessern.
        </p>
        <p className="mt-2 text-[13px] text-muted">Basiert auf 14-Tage-Analyse · ePA + Wearable</p>

        <div className="my-3.5 h-px bg-border" />

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[12px] text-muted">
            <FileText aria-hidden size={11} /> ePA
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[12px] text-muted">
            <Watch aria-hidden size={11} /> Wearable
          </span>
        </div>
      </div>
    </section>
  );
}

/** Ruhiger Leer-/Degraded-Zustand (VITA-07), kein Alarmrot. */
function LeerZustand({ text }: { text: string }) {
  return (
    <div className="mt-5 px-4">
      <div className="flex items-start gap-3 rounded-[20px] bg-surface-2 p-4">
        <Ban aria-hidden size={20} className="mt-0.5 shrink-0 text-muted" />
        <p className="text-[14px] leading-[1.5] text-ink">
          {text}{" "}
          <Link href="/einstellungen" className="font-semibold text-cat-lifestyle underline">
            In den Einstellungen aktivieren
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function VitalinkContent() {
  const router = useRouter();
  const filter = useSearchParams().get("filter");
  const nurTermine = filter === "termine";

  const zeitkritische = hinweiseSortiert.filter((h) => istZeitkritisch(h.dringlichkeit));
  // Reise-Hinweise werden in "Deine Analysen" immer ans Ende sortiert.
  const uebrige = hinweiseSortiert
    .filter((h) => !istZeitkritisch(h.dringlichkeit))
    .sort((a, b) => (a.szenario === "reise" ? 1 : b.szenario === "reise" ? -1 : 0));
  // Termin-Filter (von Home): nur Empfehlungen mit konkreter Deadline.
  const termine = hinweiseSortiert.filter((h) => h.dringlichkeit != null);

  return (
    <div className="pt-safe pb-4">
      {/* ── Header ── */}
      <header className="relative px-5 pt-5">
        <h1 className="text-[26px] font-semibold leading-tight text-ink">Deine Analysen</h1>
        <p className="mt-0.5 text-[13px] text-muted">
          Stand {STAND_DATUM} · {nurTermine ? termine.length : hinweiseSortiert.length}{" "}
          {nurTermine ? "Termine" : "Analysen"}
        </p>
        <button
          type="button"
          aria-label={nurTermine ? "Alle Analysen anzeigen" : "Nur zeitkritische Termine anzeigen"}
          aria-pressed={nurTermine}
          onClick={() => router.replace(nurTermine ? "/vitalink" : "/vitalink?filter=termine")}
          className={`tap absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-colors ${
            nurTermine ? "bg-cat-prevention text-cat-prevention-on" : "bg-surface text-muted"
          }`}
        >
          <SlidersHorizontal aria-hidden size={16} />
        </button>
      </header>

      {/* ── Wochenrückblick-Header-Karte ── */}
      <div className="mt-5 px-4">
        <WochenrueckblickCard />
      </div>

      {nurTermine ? (
        /* ── Gefilterte Ansicht: nur zeitkritische Termine ── */
        <section className="mt-5 px-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <SectionLabel tone="warn">Zeitkritische Termine</SectionLabel>
            <Link href="/vitalink" className="-mt-3 shrink-0 text-[13px] font-semibold text-cat-prevention">
              Alle anzeigen
            </Link>
          </div>
          {termine.length === 0 ? (
            <LeerZustand text="Keine zeitkritischen Termine. Aktiviere Datenquellen für mehr Hinweise." />
          ) : (
            <div className="space-y-3">
              {termine.map((h) => (
                <HinweisCard key={h.id} hinweis={h} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ── Meta-Insight (Kernaussage zuerst, nicht am Seitenende, VITA-04) ── */}
          <VitalinkInsight />

          {/* ── Zeitkritisch (Deadline < 30 Tage) ── */}
          {zeitkritische.length > 0 && (
            <section className="mt-5 px-4">
              <SectionLabel tone="warn">Anstehend</SectionLabel>
              <div className="space-y-3">
                {zeitkritische.map((h) => (
                  <HinweisCard key={h.id} hinweis={h} />
                ))}
              </div>
            </section>
          )}

          {/* ── Alle weiteren Analysen ── */}
          {zeitkritische.length === 0 && uebrige.length === 0 ? (
            <LeerZustand text="Keine Analysen verfügbar. Aktiviere Datenquellen, um Hinweise zu erhalten." />
          ) : (
            <section className="mt-5 px-4">
              <SectionLabel>Deine Analysen</SectionLabel>
              <div className="space-y-3">
                {uebrige.map((h) => (
                  <HinweisCard key={h.id} hinweis={h} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default function VitalinkPage() {
  return (
    <Suspense fallback={<div className="pt-safe px-5 pt-5 text-[15px] text-muted">Lädt …</div>}>
      <VitalinkContent />
    </Suspense>
  );
}

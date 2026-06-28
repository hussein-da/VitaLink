"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, SlidersHorizontal, FileText, Watch } from "lucide-react";
import HinweisCard from "@/components/HinweisCard";
import WochenrueckblickCard from "@/components/WochenrueckblickCard";
import { hinweiseSortiert } from "@/data/hinweise";
import { istZeitkritisch } from "@/lib/dringlichkeit";

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

function VitalinkContent() {
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
        <h1 className="text-[26px] font-semibold leading-tight text-ink">Deine Empfehlungen</h1>
        <p className="mt-0.5 text-[13px] text-muted">
          Aktualisiert heute · {hinweiseSortiert.length} Analysen
        </p>
        <button
          type="button"
          aria-label="Empfehlungen filtern"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-muted shadow-sm"
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
          <div className="space-y-3">
            {termine.map((h) => (
              <HinweisCard key={h.id} hinweis={h} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* ── Zeitkritisch (Deadline < 30 Tage) ── */}
          {zeitkritische.length > 0 && (
            <section className="mt-5 px-4">
              <SectionLabel tone="warn">Zeitkritisch</SectionLabel>
              <div className="space-y-3">
                {zeitkritische.map((h) => (
                  <HinweisCard key={h.id} hinweis={h} />
                ))}
              </div>
            </section>
          )}

          {/* ── Alle weiteren Analysen ── */}
          <section className="mt-5 px-4">
            <SectionLabel>Deine Analysen</SectionLabel>
            <div className="space-y-3">
              {uebrige.map((h) => (
                <HinweisCard key={h.id} hinweis={h} />
              ))}
            </div>
          </section>

          {/* ── Meta-Insight ── */}
          <VitalinkInsight />
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

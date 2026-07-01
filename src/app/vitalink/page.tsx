"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, FileText, Watch, Ban } from "lucide-react";
import HinweisCard from "@/components/HinweisCard";
import WochenrueckblickCard, { type Zeitraum } from "@/components/WochenrueckblickCard";
import { hinweiseSortiert } from "@/data/hinweise";
import { istZeitkritisch } from "@/lib/dringlichkeit";
import { SZENARIO_HEUTE } from "@/lib/zeit";

const STAND_DATUM = SZENARIO_HEUTE.toLocaleDateString("de-DE", { day: "numeric", month: "long" });

const ZEITRAEUME: { id: Zeitraum; label: string }[] = [
  { id: "heute", label: "Heute" },
  { id: "woche", label: "Woche" },
  { id: "monat", label: "Monat" },
];

function SectionLabel({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "warn" }) {
  return (
    <h2
      className={`mb-2.5 text-[11px] font-semibold uppercase tracking-[0.07em] ${
        tone === "warn" ? "text-status-warn" : "text-muted"
      }`}
    >
      {children}
    </h2>
  );
}

/** „Das sagt VitaLink" — kuratierte Meta-Erkenntnis. */
function VitalinkInsight() {
  return (
    <section className="mt-6 px-4">
      <div className="rounded-2xl bg-cat-prevention-light p-4">
        <div className="flex items-start gap-3">
          <Sparkles aria-hidden size={18} className="mt-0.5 shrink-0 text-cat-prevention" />
          <div>
            <p className="text-[15px] font-semibold leading-[1.45] text-ink">
              Dein Donnerstag ist dein schwächster Tag — eine Trainingsverschiebung würde mehrere
              Werte gleichzeitig verbessern.
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
              <span>14-Tage-Analyse</span>
              <span className="inline-flex items-center gap-1">
                <FileText aria-hidden size={11} /> ePA
              </span>
              <span className="inline-flex items-center gap-1">
                <Watch aria-hidden size={11} /> Wearable
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeerZustand({ text }: { text: string }) {
  return (
    <div className="mt-5 px-4">
      <div className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4">
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

export default function VitalinkPage() {
  const [zeitraum, setZeitraum] = useState<Zeitraum>("woche");

  const zeitkritische = hinweiseSortiert.filter((h) => istZeitkritisch(h.dringlichkeit));
  const uebrige = hinweiseSortiert
    .filter((h) => !istZeitkritisch(h.dringlichkeit))
    .sort((a, b) => (a.szenario === "reise" ? 1 : b.szenario === "reise" ? -1 : 0));

  return (
    <div className="pt-safe pb-4">
      {/* Header */}
      <header className="px-5 pt-5">
        <h1 className="text-[26px] font-semibold leading-tight text-ink">Deine Analysen</h1>
        <p className="mt-0.5 text-[13px] text-muted">
          Stand {STAND_DATUM} · {hinweiseSortiert.length} Analysen
        </p>
      </header>

      {/* Zeitraum-Switcher (Heute / Woche / Monat) */}
      <div className="mt-4 px-4">
        <div role="group" aria-label="Zeitraum" className="flex gap-1 rounded-full bg-surface-2 p-1">
          {ZEITRAEUME.map((z) => {
            const aktiv = zeitraum === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setZeitraum(z.id)}
                aria-pressed={aktiv}
                className={`tap flex-1 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  aktiv ? "bg-surface text-ink shadow-sm" : "text-muted"
                }`}
              >
                {z.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rückblick-Karte (folgt dem Zeitraum) */}
      <div className="mt-3 px-4">
        <WochenrueckblickCard zeitraum={zeitraum} />
      </div>

      {/* Meta-Insight (Kernaussage prominent) */}
      <VitalinkInsight />

      {/* Anstehend */}
      {zeitkritische.length > 0 && (
        <section className="mt-6 px-4">
          <SectionLabel tone="warn">Anstehend</SectionLabel>
          <div className="space-y-2.5">
            {zeitkritische.map((h) => (
              <HinweisCard key={h.id} hinweis={h} />
            ))}
          </div>
        </section>
      )}

      {/* Deine Analysen */}
      {zeitkritische.length === 0 && uebrige.length === 0 ? (
        <LeerZustand text="Keine Analysen verfügbar. Aktiviere Datenquellen, um Hinweise zu erhalten." />
      ) : (
        <section className="mt-6 px-4">
          <SectionLabel>Deine Analysen</SectionLabel>
          <div className="space-y-2.5">
            {uebrige.map((h) => (
              <HinweisCard key={h.id} hinweis={h} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

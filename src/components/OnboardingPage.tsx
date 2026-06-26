"use client";

import { useId } from "react";
import { ShieldCheck, ArrowRight, Zap, ScanSearch, Lightbulb, Database, Watch } from "lucide-react";
import Switch from "@/components/ui/Switch";
import { useSettings } from "@/context/SettingsContext";

interface Props {
  onStart: () => void;
}

const HOW_STEPS = [
  {
    icon: <Zap size={18} />,
    title: "Verbinden",
    desc: "Wearable und ePA werden sicher mit deinem Profil verknüpft.",
  },
  {
    icon: <ScanSearch size={18} />,
    title: "Analysieren",
    desc: "Deine Daten werden lokal ausgewertet – nichts verlässt dein Gerät.",
  },
  {
    icon: <Lightbulb size={18} />,
    title: "Empfehlen",
    desc: "Du erhältst nachvollziehbare Vorsorge-Hinweise mit klarer Begründung.",
  },
];

export default function OnboardingPage({ onStart }: Props) {
  const { isGroupEnabled, setGroupEnabled } = useSettings();
  const epaId = useId();
  const wearableId = useId();

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Animierter Hero-Header */}
      <div className="relative overflow-hidden bg-primary px-6 pb-12 pt-10 animate-screen-in">
        {/* Dekorative Kreise im Hintergrund */}
        <span className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
        <span className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <ShieldCheck size={22} className="text-white" strokeWidth={1.8} />
          </span>
          <span className="font-display text-3xl font-semibold text-white tracking-tight">
            VitaLink
          </span>
        </div>

        <h2 className="mt-5 font-display text-[1.65rem] font-semibold leading-tight text-white">
          Erklärbare Vorsorge.
          <br />
          Für dich.
        </h2>
        <p className="mt-2 text-base leading-relaxed text-white/65">
          Transparente Gesundheitshinweise aus deinen eigenen Daten – nachvollziehbar und quellenbelegt.
        </p>
      </div>

      <div className="flex flex-col gap-5 px-4 py-6">
        {/* Was ist VitaLink */}
        <section
          className="rounded-2xl border border-border bg-surface p-4 animate-screen-in"
          style={{ animationDelay: "80ms" }}
        >
          <h3 className="font-display text-lg font-semibold text-ink">Was ist VitaLink?</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            VitaLink ist ein Forschungs-Demonstrator im Rahmen einer HCI-Masterarbeit an der
            Hochschule Ruhr West. Er zeigt, wie erklärbare KI Vorsorge-Empfehlungen transparent und
            verständlich machen kann – auf Basis synthetischer Daten. Kein Medizinprodukt.
          </p>
        </section>

        {/* Wie es funktioniert */}
        <section
          className="animate-screen-in"
          style={{ animationDelay: "160ms" }}
        >
          <h3 className="font-display text-lg font-semibold text-ink mb-3">So funktioniert es</h3>
          <div className="space-y-2.5">
            {HOW_STEPS.map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 animate-screen-in"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  {icon}
                </span>
                <div>
                  <p className="font-semibold text-sm text-ink">{title}</p>
                  <p className="text-sm text-muted leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Datenkontrolle */}
        <section
          className="rounded-2xl border border-border bg-surface p-4 animate-screen-in"
          style={{ animationDelay: "460ms" }}
        >
          <h3 className="font-display text-lg font-semibold text-ink">Deine Datenkontrolle</h3>
          <p className="mt-1 text-sm text-muted">
            Wähle vorab, welche Datenquellen einbezogen werden sollen.
          </p>

          <div className="mt-3 divide-y divide-border">
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-start gap-3">
                <Database aria-hidden size={20} className="mt-0.5 text-primary" />
                <div>
                  <p id={epaId} className="font-medium text-sm text-ink">ePA-Daten</p>
                  <p className="text-xs text-muted">Elektronische Patientenakte</p>
                </div>
              </div>
              <Switch
                checked={isGroupEnabled("ePA")}
                onChange={(v) => setGroupEnabled("ePA", v)}
                label="ePA-Daten"
                labelledBy={epaId}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-start gap-3">
                <Watch aria-hidden size={20} className="mt-0.5 text-primary" />
                <div>
                  <p id={wearableId} className="font-medium text-sm text-ink">Wearable-Daten</p>
                  <p className="text-xs text-muted">Smartwatch & Sensoren</p>
                </div>
              </div>
              <Switch
                checked={isGroupEnabled("Wearable")}
                onChange={(v) => setGroupEnabled("Wearable", v)}
                label="Wearable-Daten"
                labelledBy={wearableId}
              />
            </div>
          </div>
        </section>

        <button
          onClick={onStart}
          className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-lg font-semibold text-primary-ink animate-screen-in"
          style={{ animationDelay: "540ms" }}
        >
          Starten
          <ArrowRight aria-hidden size={20} />
        </button>

        <p className="pb-4 text-center text-xs text-muted animate-screen-in" style={{ animationDelay: "600ms" }}>
          Forschungs-Demonstrator · Kein Medizinprodukt · Synthetische Daten
        </p>
      </div>
    </div>
  );
}

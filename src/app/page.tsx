"use client";

import Link from "next/link";
import { useId, useState, useCallback } from "react";
import { ArrowRight, Database, Watch } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Switch from "@/components/ui/Switch";
import SplashScreen from "@/components/SplashScreen";
import LanguageSelect from "@/components/LanguageSelect";
import { useSettings } from "@/context/SettingsContext";
import type { Language } from "@/context/SettingsContext";

type Screen = "splash" | "language" | "onboarding";

export default function StartFlow() {
  const { isGroupEnabled, setGroupEnabled, hydrated, languageChosen, setLanguage, setAppReady } = useSettings();
  const [screen, setScreen] = useState<Screen>("splash");

  const epaLabelId = useId();
  const wearableLabelId = useId();

  const goToOnboarding = useCallback(() => {
    setScreen("onboarding");
    setAppReady();
  }, [setAppReady]);

  const handleSplashComplete = useCallback(() => {
    if (hydrated && languageChosen) {
      goToOnboarding();
    } else {
      setScreen("language");
    }
  }, [hydrated, languageChosen, goToOnboarding]);

  const handleLanguageSelect = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      goToOnboarding();
    },
    [setLanguage, goToOnboarding],
  );

  if (screen === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (screen === "language") {
    return <LanguageSelect onSelect={handleLanguageSelect} />;
  }

  const epaAn = isGroupEnabled("ePA");
  const wearableAn = isGroupEnabled("Wearable");

  return (
    <div className="animate-screen-in">
      <AppHeader title="VitaLink" brand />

      <div className="space-y-6 px-4 py-5">
        <p className="text-lg leading-relaxed text-ink">
          VorSicht zeigt dir{" "}
          <span className="font-semibold">erklärbare Vorsorge-Hinweise</span> – transparent
          begründet, quellenbelegt und jederzeit von dir steuerbar.
        </p>

        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="font-display text-xl font-semibold text-ink">Deine Daten, deine Wahl</h2>
          <p className="mt-1 text-sm text-muted">
            Du entscheidest, welche Datenquellen ausgewertet werden. Abschalten ist jederzeit
            erlaubt und folgenlos – du kannst es später feiner einstellen.
          </p>

          <div className="mt-3 divide-y divide-border">
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-start gap-3">
                <Database aria-hidden size={20} className="mt-0.5 text-primary" />
                <div>
                  <p id={epaLabelId} className="font-medium text-ink">
                    ePA-Daten verwenden
                  </p>
                  <p className="text-sm text-muted">Einträge aus der elektronischen Patientenakte.</p>
                </div>
              </div>
              <Switch
                checked={epaAn}
                onChange={(v) => setGroupEnabled("ePA", v)}
                label="ePA-Daten verwenden"
                labelledBy={epaLabelId}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-start gap-3">
                <Watch aria-hidden size={20} className="mt-0.5 text-primary" />
                <div>
                  <p id={wearableLabelId} className="font-medium text-ink">
                    Wearable-Daten verwenden
                  </p>
                  <p className="text-sm text-muted">Streams von Smartwatch und Sensoren.</p>
                </div>
              </div>
              <Switch
                checked={wearableAn}
                onChange={(v) => setGroupEnabled("Wearable", v)}
                label="Wearable-Daten verwenden"
                labelledBy={wearableLabelId}
              />
            </div>
          </div>
        </section>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-lg font-semibold text-primary-ink"
          >
            Starten
            <ArrowRight aria-hidden size={20} />
          </Link>
          <Link
            href="/ueber"
            className="tap flex w-full items-center justify-center rounded-xl border border-border bg-surface px-5 font-medium text-primary"
          >
            Mehr über dieses Projekt
          </Link>
        </div>
      </div>
    </div>
  );
}

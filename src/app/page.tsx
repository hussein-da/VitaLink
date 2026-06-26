"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LanguageSelect from "@/components/LanguageSelect";
import OnboardingPage from "@/components/OnboardingPage";
import ConnectScreen from "@/components/ConnectScreen";
import EpaWizard from "@/components/EpaWizard";
import SyncingScreen from "@/components/SyncingScreen";
import { useSettings } from "@/context/SettingsContext";
import type { Language } from "@/context/SettingsContext";

type Screen = "language" | "onboarding" | "connect" | "epa-wizard" | "syncing";

export default function StartFlow() {
  const { setLanguage } = useSettings();
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("language");
  const [wearableConnected, setWearableConnected] = useState(false);

  const handleLanguageSelect = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      setScreen("onboarding");
    },
    [setLanguage],
  );

  const handleStart = useCallback(() => setScreen("connect"), []);

  const handleWearableConnect = useCallback(() => setWearableConnected(true), []);

  const handleStartEpa = useCallback(() => setScreen("epa-wizard"), []);

  const handleEpaComplete = useCallback(() => setScreen("syncing"), []);

  const handleSyncComplete = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  switch (screen) {
    case "language":
      return <LanguageSelect onSelect={handleLanguageSelect} />;
    case "onboarding":
      return <OnboardingPage onStart={handleStart} />;
    case "connect":
      return (
        <ConnectScreen
          wearableConnected={wearableConnected}
          onWearableConnect={handleWearableConnect}
          onStartEpa={handleStartEpa}
        />
      );
    case "epa-wizard":
      return <EpaWizard wearableConnected={wearableConnected} onComplete={handleEpaComplete} />;
    case "syncing":
      return <SyncingScreen onComplete={handleSyncComplete} />;
  }
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/LoginPage";
import AnimatedIntro from "@/components/AnimatedIntro";
import ConnectScreen from "@/components/ConnectScreen";
import EpaWizard from "@/components/EpaWizard";
import SyncingScreen from "@/components/SyncingScreen";
import { useSettings } from "@/context/SettingsContext";
import type { Language } from "@/context/SettingsContext";

type Screen = "login" | "intro" | "connect" | "epa-wizard" | "syncing";

export default function StartFlow() {
  const { setLanguage } = useSettings();
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("login");
  const [wearableConnected, setWearableConnected] = useState(false);

  const handleLogin = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      setScreen("intro");
    },
    [setLanguage],
  );

  const handleIntroComplete = useCallback(() => setScreen("connect"), []);
  const handleWearableConnect = useCallback(() => setWearableConnected(true), []);
  const handleStartEpa = useCallback(() => setScreen("epa-wizard"), []);
  const handleEpaComplete = useCallback(() => setScreen("syncing"), []);
  const handleSyncComplete = useCallback(() => router.push("/dashboard"), [router]);

  switch (screen) {
    case "login":
      return <LoginPage onLogin={handleLogin} />;
    case "intro":
      return <AnimatedIntro onComplete={handleIntroComplete} />;
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

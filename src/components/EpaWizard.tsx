"use client";

import { useEffect, useState } from "react";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";

type Phase = "intro" | "tap" | "pin" | "success";

interface Props {
  wearableConnected: boolean;
  onComplete: () => void;
}

export default function EpaWizard({ wearableConnected, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [pin, setPin] = useState("");
  const [tapDone, setTapDone] = useState(false);

  // Karten-Tap: nach 3 s automatisch erkannt
  useEffect(() => {
    if (phase !== "tap") return;
    const t1 = setTimeout(() => setTapDone(true), 2800);
    const t2 = setTimeout(() => setPhase("pin"), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const handleDigit = (key: number | "⌫") => {
    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => setPhase("success"), 500);
    }
  };

  return (
    <div className="flex flex-1 flex-col animate-screen-in">
      <div className="border-b border-border bg-bg/90 px-4 py-4 backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-ink">ePA Verknüpfungsassistent</h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {/* --- INTRO --- */}
        {phase === "intro" && (
          <div className="w-full text-center animate-screen-in">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-soft">
              <CreditCard size={38} className="text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink">ePA verbinden</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Halte nach Aufforderung deine Gesundheitskarte ans Handy, um deine elektronische
              Patientenakte sicher zu verknüpfen.
            </p>
            <button
              onClick={() => setPhase("tap")}
              className="tap mt-8 w-full rounded-xl bg-primary py-3.5 text-lg font-semibold text-primary-ink"
            >
              Verknüpfen starten
            </button>
          </div>
        )}

        {/* --- KARTE HALTEN (NFC) --- */}
        {phase === "tap" && (
          <div className="w-full text-center animate-screen-in">
            {/* NFC Puls-Animation */}
            <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-primary/35 animate-nfc-ring"
                  style={{ animationDelay: `${i * 580}ms` }}
                />
              ))}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Smartphone
                  size={48}
                  className="text-primary"
                  strokeWidth={1.4}
                />
                <CreditCard
                  size={34}
                  className={`text-primary transition-all duration-700 ${
                    tapDone ? "translate-y-0 opacity-100 scale-100" : "translate-y-3 opacity-50 scale-90"
                  }`}
                  strokeWidth={1.4}
                />
              </div>
            </div>

            <h2 className="font-display text-xl font-semibold text-ink">
              {tapDone ? "Karte erkannt ✓" : "Gesundheitskarte ans Handy halten"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {tapDone
                ? "NFC-Verbindung hergestellt – einen Moment …"
                : "Bitte die Karte auf der Rückseite des Handys berühren"}
            </p>
          </div>
        )}

        {/* --- PIN-EINGABE --- */}
        {phase === "pin" && (
          <div className="w-full animate-screen-in">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-3xl">
                🔐
              </div>
              <h2 className="font-display text-xl font-semibold text-ink">ePA-PIN eingeben</h2>
              <p className="mt-1 text-sm text-muted">Demo: beliebige 4-stellige Zahl</p>
            </div>

            {/* PIN-Anzeige */}
            <div className="mb-6 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-150 ${
                    pin.length > i
                      ? "border-primary bg-primary text-primary-ink scale-105"
                      : "border-border bg-surface text-transparent"
                  }`}
                >
                  {pin.length > i ? "•" : "·"}
                </div>
              ))}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2.5">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"] as const).map((key, i) => (
                <button
                  key={i}
                  onClick={() => key !== null && handleDigit(key)}
                  className={`tap flex h-14 items-center justify-center rounded-xl text-xl font-semibold transition-colors ${
                    key === null
                      ? "invisible"
                      : key === "⌫"
                        ? "bg-surface-2 text-ink hover:bg-border"
                        : "border border-border bg-surface text-ink hover:bg-primary-soft"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- ERFOLGSMELDUNG --- */}
        {phase === "success" && (
          <div className="w-full text-center animate-screen-in">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary animate-bounce-in">
              <CheckCircle2 size={48} className="text-white" strokeWidth={1.8} />
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink">
              Synchronisierung erfolgreich!
            </h2>
            <p className="mt-2 text-sm text-muted">Alle Datenquellen sind verbunden.</p>

            <div className="mt-6 space-y-2.5">
              {[
                wearableConnected && {
                  icon: "⌚",
                  label: "Apple Watch Series 11",
                  sub: "Wearable-Daten verbunden",
                },
                { icon: "🏥", label: "Elektronische Patientenakte", sub: "ePA erfolgreich verknüpft" },
              ]
                .filter(Boolean)
                .map((item) => {
                  const { icon, label, sub } = item as {
                    icon: string;
                    label: string;
                    sub: string;
                  };
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary-soft/50 p-3 text-left animate-screen-in"
                    >
                      <span className="text-xl leading-none">{icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink">{label}</p>
                        <p className="text-xs font-medium text-primary">{sub}</p>
                      </div>
                      <CheckCircle2 size={16} className="shrink-0 text-primary" />
                    </div>
                  );
                })}
            </div>

            <button
              onClick={onComplete}
              className="tap mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-lg font-semibold text-primary-ink"
            >
              Meine Empfehlungen ansehen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

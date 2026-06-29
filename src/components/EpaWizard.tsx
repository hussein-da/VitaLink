"use client";

import { useEffect, useState } from "react";
import { Smartphone, CheckCircle2 } from "lucide-react";

type Phase = "intro" | "tap" | "pin" | "success";

interface Props {
  wearableConnected: boolean;
  onComplete: () => void;
}

export default function EpaWizard({ wearableConnected, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [pin, setPin] = useState("");
  const [tapDone, setTapDone] = useState(false);
  const [cardImgOk, setCardImgOk] = useState(true);

  useEffect(() => {
    if (phase !== "tap") return;
    const t1 = setTimeout(() => setTapDone(true), 2800);
    const t2 = setTimeout(() => setPhase("pin"), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  const handleDigit = (key: number | "⌫") => {
    if (key === "⌫") { setPin((p) => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) setTimeout(() => setPhase("success"), 500);
  };

  return (
    <div className="flex flex-1 flex-col animate-screen-in">
      <div className="border-b border-border bg-bg/90 px-4 py-4 backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-ink">ePA Verknüpfungsassistent</h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">

        {/* INTRO */}
        {phase === "intro" && (
          <div className="w-full text-center animate-screen-in">
            <div className="mx-auto mb-6 w-56 overflow-hidden rounded-2xl shadow-xl">
              {cardImgOk ? (
                <img
                  src="/gesundheitskarte.svg"
                  alt="Gesundheitskarte"
                  className="w-full object-cover"
                  onError={() => setCardImgOk(false)}
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl bg-primary-soft text-5xl">
                  🪪
                </div>
              )}
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

        {/* NFC TAP */}
        {phase === "tap" && (
          <div className="w-full text-center animate-screen-in">
            {/* NFC-Animations-Container */}
            <div className="relative mx-auto mb-8 flex h-64 w-64 flex-col items-center justify-center">
              {/* Pulsierende NFC-Ringe (um das Handy) */}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute rounded-full border-2 border-primary/30 animate-nfc-ring"
                  style={{
                    inset: `${i * 14}px`,
                    animationDelay: `${i * 550}ms`,
                  }}
                />
              ))}

              {/* Handy oben */}
              <div className="relative z-10 mb-2">
                <Smartphone
                  size={52}
                  className={`transition-colors duration-500 ${tapDone ? "text-primary" : "text-ink"}`}
                  strokeWidth={1.3}
                />
              </div>

              {/* Gesundheitskarte – nähert sich von unten */}
              <div
                className={`relative z-10 w-36 overflow-hidden rounded-xl shadow-lg transition-all duration-700 ${
                  tapDone
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-5 scale-90 opacity-50"
                }`}
              >
                {cardImgOk ? (
                  <img
                    src="/gesundheitskarte.svg"
                    alt="Gesundheitskarte"
                    className="w-full object-cover"
                    onError={() => setCardImgOk(false)}
                  />
                ) : (
                  <div className="flex h-20 items-center justify-center rounded-xl bg-primary-soft text-3xl">
                    🪪
                  </div>
                )}
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

        {/* PIN */}
        {phase === "pin" && (
          <div className="w-full animate-screen-in">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-3xl">
                🔐
              </div>
              <h2 className="font-display text-xl font-semibold text-ink">ePA-PIN eingeben</h2>
              <p className="mt-1 text-sm text-muted">Demo: beliebige 4-stellige Zahl</p>
            </div>

            <div className="mb-6 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-150 ${
                    pin.length > i
                      ? "scale-105 border-primary bg-primary text-primary-ink"
                      : "border-border bg-surface text-transparent"
                  }`}
                >
                  {pin.length > i ? "•" : "·"}
                </div>
              ))}
            </div>

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

        {/* ERFOLG */}
        {phase === "success" && (
          <div className="w-full text-center animate-screen-in">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary animate-bounce-in">
              <CheckCircle2 size={48} className="text-white" strokeWidth={1.8} />
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink">ePA verbunden</h2>
            <p className="mt-2 text-sm text-muted">
              Verbindung hergestellt — deine Daten werden gleich synchronisiert.
            </p>

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
                  const { icon, label, sub } = item as { icon: string; label: string; sub: string };
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
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

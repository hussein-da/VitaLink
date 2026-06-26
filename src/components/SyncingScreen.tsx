"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  { icon: "⌚", label: "Wearable-Daten werden geladen …", doneLabel: "Wearable-Daten", delay: 600 },
  { icon: "🏥", label: "ePA-Einträge werden synchronisiert …", doneLabel: "ePA-Einträge", delay: 1600 },
  { icon: "🔮", label: "Empfehlungen werden berechnet …", doneLabel: "Empfehlungen", delay: 2800 },
];

export default function SyncingScreen({ onComplete }: Props) {
  const [done, setDone] = useState(0);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach(({ delay }, i) => {
      timers.push(setTimeout(() => setActive(i), delay));
      timers.push(setTimeout(() => setDone(i + 1), delay + 900));
    });

    const last = STEPS[STEPS.length - 1].delay + 1500;
    timers.push(setTimeout(() => onComplete(), last));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 bg-primary px-8 animate-screen-in">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
          🔮
        </div>
        <h2 className="font-display text-2xl font-semibold text-white">
          Daten werden verarbeitet
        </h2>
        <p className="mt-1 text-sm text-white/60">Einen Moment bitte …</p>
      </div>

      <div className="w-full space-y-3">
        {STEPS.map(({ icon, label, doneLabel }, i) => {
          const isDone = i < done;
          const isActive = i === active && !isDone;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl p-3.5 transition-all duration-500 ${
                isDone
                  ? "bg-white/15"
                  : isActive
                    ? "bg-white/10"
                    : "opacity-25"
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span
                className={`flex-1 text-sm font-medium transition-colors duration-300 ${
                  isDone ? "text-white" : isActive ? "text-white/80" : "text-white/40"
                }`}
              >
                {isDone ? doneLabel : label}
              </span>

              {isDone && (
                <CheckCircle2
                  size={16}
                  className="shrink-0 text-white animate-bounce-in"
                />
              )}
              {isActive && (
                <span className="flex gap-1">
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      className="h-1.5 w-1.5 rounded-full bg-white/60 animate-heart-pulse"
                      style={{ animationDelay: `${j * 200}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

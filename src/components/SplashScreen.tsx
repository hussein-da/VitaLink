"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Heart } from "lucide-react";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2000);
    const t2 = setTimeout(() => onComplete(), 2450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-8 bg-primary px-8 ${
        exiting ? "animate-splash-out" : "animate-splash-in"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white/15">
          <ShieldCheck size={56} className="text-white" strokeWidth={1.5} />
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
            <Heart size={16} className="animate-heart-pulse text-primary" fill="currentColor" />
          </span>
        </div>

        <div className="text-center">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-white">
            VitaLink
          </h1>
          <p className="mt-2 text-base text-white/65">
            Deine Gesundheit.&ensp;Klar erklärt.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-white/40"
            style={{
              animation: "heart-pulse 1200ms ease-in-out infinite",
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

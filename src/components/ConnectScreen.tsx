"use client";

import { useState } from "react";
import { Watch, Stethoscope, CheckCircle2, Loader2, Wifi } from "lucide-react";
import { useT } from "@/i18n/useT";

type WearableStatus = "idle" | "connecting" | "connected";

interface Props {
  wearableConnected: boolean;
  onWearableConnect: () => void;
  onStartEpa: () => void;
}

export default function ConnectScreen({ wearableConnected, onWearableConnect, onStartEpa }: Props) {
  const { t } = useT();
  const c = t.onboarding.connect;
  const [wearableStatus, setWearableStatus] = useState<WearableStatus>(
    wearableConnected ? "connected" : "idle",
  );

  const handleConnect = () => {
    setWearableStatus("connecting");
    setTimeout(() => {
      setWearableStatus("connected");
      onWearableConnect();
    }, 1800);
  };

  return (
    <div className="flex flex-1 flex-col animate-screen-in">
      {/* Header */}
      <div className="border-b border-border bg-bg/90 px-4 py-4 backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-ink">{c.title}</h1>
        <p className="mt-0.5 text-[15px] text-ink">
          {c.subtitle}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        {/* Wearable-Sektion */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Watch size={17} className="text-primary" />
            <h2 className="font-semibold text-ink">{c.wearableHeading}</h2>
          </div>

          {wearableStatus === "idle" && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-bg/50 p-3 animate-screen-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">⌚</span>
                <div>
                  <p className="text-sm font-semibold text-ink">Apple Watch Series 12</p>
                  <p className="flex items-center gap-1 text-[13px] text-ink-2">
                    <Wifi size={10} />
                    {c.wearableDetected}
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnect}
                className="tap rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-ink"
              >
                {t.common.connect}
              </button>
            </div>
          )}

          {wearableStatus === "connecting" && (
            <div className="rounded-xl border border-border bg-bg/50 p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">⌚</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">Apple Watch Series 12</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full animate-progress-fill rounded-full bg-primary" />
                  </div>
                </div>
                <Loader2 size={16} className="animate-spin text-primary" />
              </div>
            </div>
          )}

          {wearableStatus === "connected" && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary-soft p-3 animate-screen-in">
              <span className="text-2xl leading-none">⌚</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">Apple Watch Series 12</p>
                <p className="text-xs font-medium text-primary">{c.wearableConnected}</p>
              </div>
              <CheckCircle2 size={18} className="text-primary" />
            </div>
          )}
        </section>

        {/* ePA-Sektion */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope size={17} className="text-primary" />
            <h2 className="font-semibold text-ink">{c.epaHeading}</h2>
          </div>
          <p className="mb-3 text-[15px] text-ink">
            {c.epaBody}
          </p>
          {/* AUTH-01: gleiche Verbinden-Affordance wie beim Wearable (solider Button). */}
          <button
            onClick={onStartEpa}
            className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-ink"
          >
            <Stethoscope aria-hidden size={18} />
            {t.common.connect}
          </button>
          <p className="mt-2 text-center text-[13px] text-ink-2">{c.epaSecure}</p>
        </section>

        <p className="text-center text-[13px] text-ink-2">
          {c.disconnectHint}
        </p>
      </div>
    </div>
  );
}

"use client";

import { Ban, TrendingUp, CheckCircle2, Watch } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { wochenSchritte, wochenTraining, wearableSummary } from "@/data/wearable";

const avgSchritte = Math.round(
  wochenSchritte.tage.reduce((s, t) => s + t.value, 0) / wochenSchritte.tage.length,
);
const anzahlTrainings = wochenTraining.einheiten.length;

/** Kleiner Herkunfts-Marker „Wearable" am Zeilenende. */
function WearableTag() {
  return (
    <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[11px] text-muted">
      <Watch aria-hidden size={11} />
      Wearable
    </span>
  );
}

/**
 * Wochenrückblick-Header-Karte (Block 2, FR-I / DF17): repräsentative, luftige
 * Karte am Kopf des VitaLink-Hubs. Farbiger 80px-Header mit Datums-Range,
 * darunter zwei datenfokussierte Check-Zeilen mit Wearable-Marker.
 * Hängt an `wearable-aktivitaet` (DF11): bei abgeschalteter Quelle Leer-Zustand.
 */
export default function WochenrueckblickCard() {
  const { isSourceEnabled } = useSettings();
  const aktiv = isSourceEnabled("wearable-aktivitaet");

  return (
    <section
      aria-label="Wochenrückblick Aktivität"
      className="overflow-hidden rounded-3xl bg-surface shadow-lg"
    >
      <div className="flex h-20 items-center justify-between bg-cat-lifestyle-light px-5">
        <span className="flex items-center gap-2">
          <TrendingUp aria-hidden size={20} className="text-cat-lifestyle" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-cat-lifestyle">
            Diese Woche
          </span>
        </span>
        <span className="text-[12px] text-muted">17.–23. Juni</span>
      </div>

      {aktiv ? (
        <div className="flex flex-col gap-2.5 px-5 py-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 aria-hidden size={16} className="mt-0.5 shrink-0 text-cat-lifestyle" />
            <p className="flex-1 text-[15px] leading-snug text-ink">
              Ø {avgSchritte.toLocaleString("de-DE")} Schritte/Tag · {anzahlTrainings}{" "}
              Trainingseinheiten
            </p>
            <WearableTag />
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 aria-hidden size={16} className="mt-0.5 shrink-0 text-cat-lifestyle" />
            <p className="flex-1 text-[15px] leading-snug text-ink">
              Ruhepuls stabil bei Ø {wearableSummary.ruhepuls} BPM — sehr gut
            </p>
            <WearableTag />
          </div>
        </div>
      ) : (
        <div className="m-4 flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-sm text-ink">
          <Ban aria-hidden size={16} className="mt-0.5 shrink-0 text-muted" />
          <span>
            Nutzt abgeschaltete Quelle: <span className="font-medium">Aktivität (Wearable)</span>. In
            den Einstellungen wieder einschalten.
          </span>
        </div>
      )}
    </section>
  );
}

import { MapPin } from "lucide-react";
import type { Angebot } from "@/lib/types";

/**
 * DF9: lokale Ruhrgebiet-Handlungsoption, sachlich und nicht-alarmistisch (DF10).
 * Klar als Beispiel markiert (fiktiv-plausibel).
 */
export default function ActionCard({ angebot }: { angebot: Angebot }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface">
          <MapPin aria-hidden size={18} className="text-primary" />
        </span>
        <div className="flex-1">
          <h4 className="font-semibold text-ink">{angebot.titel}</h4>
          <p className="text-[14px] text-ink-2">
            {angebot.ort} · {angebot.traeger}
          </p>
          <p className="mt-1 text-sm text-ink">{angebot.hinweis}</p>
        </div>
      </div>
    </div>
  );
}

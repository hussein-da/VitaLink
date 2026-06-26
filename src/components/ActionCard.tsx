import { MapPin } from "lucide-react";
import type { Angebot } from "@/lib/types";

/**
 * DF9: lokale Ruhrgebiet-Handlungsoption, sachlich und nicht-alarmistisch (DF10).
 * Klar als Beispiel markiert (fiktiv-plausibel).
 */
export default function ActionCard({ angebot }: { angebot: Angebot }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft">
          <MapPin aria-hidden size={18} className="text-primary" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-ink">{angebot.titel}</h4>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-sm text-muted">Beispiel</span>
          </div>
          <p className="text-sm text-muted">
            {angebot.ort} - {angebot.traeger}
          </p>
          <p className="mt-1 text-sm text-ink">{angebot.hinweis}</p>
        </div>
      </div>
    </div>
  );
}

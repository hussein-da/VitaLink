"use client";

import { FileText, CheckCircle2 } from "lucide-react";

/**
 * Toast-Benachrichtigung für den simulierten PDF-Export. Erscheint oben
 * zentriert über dem Geräterahmen, role="status" für Screenreader. Die
 * Anzeige-Logik (zweiphasig + Auto-Hide nach 4 s) liegt in /export/page.tsx.
 */
export default function ExportToast({
  message,
  fertig = false,
}: {
  message: string | null;
  fertig?: boolean;
}) {
  if (!message) return null;
  const Icon = fertig ? CheckCircle2 : FileText;
  return (
    <div
      role="status"
      aria-live="polite"
      className="reveal pointer-events-none fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2"
      style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
    >
      <div className="flex items-center gap-3 rounded-[14px] bg-surface px-[18px] py-3.5 shadow-lg">
        <Icon
          aria-hidden
          size={20}
          className={fertig ? "shrink-0 text-cat-prevention" : "shrink-0 text-muted"}
        />
        <p className="text-[14px] leading-snug text-ink">{message}</p>
      </div>
    </div>
  );
}

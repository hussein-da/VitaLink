"use client";

import { FileText, CheckCircle2 } from "lucide-react";

export default function ExportToast({
  message,
  fertig = false,
}: {
  message: string | null;
  fertig?: boolean;
}) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 top-[calc(env(safe-area-inset-top)+1rem)] sm:top-10"
    >
      <div
        key={message}
        className={[
          "animate-toast-drop flex items-center gap-3 rounded-[14px] bg-surface px-[18px] py-4 shadow-lg",
          fertig ? "ring-1 ring-cat-prevention/30" : "",
        ].join(" ").trim()}
      >
        <span className={fertig ? "animate-bounce-in shrink-0" : "shrink-0"}>
          {fertig ? (
            <CheckCircle2 aria-hidden size={22} className="text-cat-prevention" />
          ) : (
            <FileText aria-hidden size={22} className="text-muted" />
          )}
        </span>
        <p className="text-[14px] leading-snug text-ink">{message}</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Schlichter, barrierefreier Modal-Dialog: Escape schließt, Backdrop-Klick
 * schließt, Fokus wandert in den Dialog. Per Portal an document.body gehängt,
 * damit der Geräterahmen (overflow-hidden) ihn nicht abschneidet.
 */
export default function Dialog({ open, onClose, title, children }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  // onClose über Ref halten, damit Re-Renders (z. B. Tippen im Textfeld) den
  // Escape/Scroll-Lock-Effekt NICHT neu starten.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  // Fokus NUR einmal beim Öffnen setzen — sonst klaut der Effekt bei jedem
  // Tastendruck den Fokus vom Eingabefeld zurück auf den Dialog.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  // Escape schließt + Scroll-Lock; hängt nur an `open` (onClose via Ref).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="reveal w-full max-w-[420px] rounded-2xl border border-border bg-surface p-5 shadow-2xl outline-none"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dialog schließen"
            className="tap -mr-2 -mt-2 flex items-center justify-center rounded-lg text-muted hover:text-ink"
          >
            <X aria-hidden size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Typ C – Detail-Header (§1b): grosser, farbig getoenter Kopfbereich, der den
 * Hinweis-Typ kommuniziert. Oben links ein kleiner Zurueck-Button, darunter das
 * Kategorie-Icon (40px), der Titel in Fraunces (24px) und ein dezenter
 * Kategorie-Chip. Macht sofort klar: "Ich bin im Detail eines Hinweises."
 */
export default function DetailHeader({
  title,
  back,
  icon,
  category,
  chip,
}: {
  title: string;
  back: { href: string; label: string };
  icon: ReactNode;
  category: string;
  /** Optionaler zusaetzlicher Chip rechts (z. B. Unsicherheit). */
  chip?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-gradient-to-b from-primary-soft/60 to-surface px-4 pb-5 pt-3">
      <Link
        href={back.href}
        className="tap -ml-1 inline-flex items-center gap-0.5 rounded-lg pr-2 text-sm font-medium text-primary"
      >
        <ChevronLeft aria-hidden size={20} />
        {back.label}
      </Link>

      <div className="mt-3 flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary shadow-card">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface/70 px-2.5 py-0.5 text-xs font-medium text-muted">
              {category}
            </span>
            {chip}
          </div>
          <h1 className="font-display text-2xl font-semibold leading-snug text-ink">{title}</h1>
        </div>
      </div>
    </header>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Typ B – Section-Header (§1b): fester, schlanker Kopf fuer Unterseiten.
 * Links Zurueck-Button (ChevronLeft + Label), mittig der Seitentitel
 * (Source Sans 3 SemiBold, 17px), rechts optional ein Action-Button.
 * Optionaler `eyebrow` zeigt einen dezenten Pfad ueber dem Titel (§1c).
 */
export default function AppHeader({
  title,
  back,
  eyebrow,
  right,
}: {
  title: string;
  back?: { href: string; label: string };
  eyebrow?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 px-2 backdrop-blur">
      <div className="relative flex min-h-[52px] items-center justify-center px-1 py-2">
        {back && (
          <Link
            href={back.href}
            className="tap absolute left-0 inline-flex items-center gap-0.5 rounded-lg pl-1 pr-2 text-sm font-medium text-primary"
          >
            <ChevronLeft aria-hidden size={20} />
            <span>{back.label}</span>
          </Link>
        )}
        <div className="flex max-w-[60%] flex-col items-center text-center">
          {eyebrow && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-ink-2">
              {eyebrow}
            </span>
          )}
          <h1 className="truncate text-[17px] font-semibold leading-tight text-ink">{title}</h1>
        </div>
        {right && <div className="absolute right-0 flex items-center">{right}</div>}
      </div>
    </header>
  );
}

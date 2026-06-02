import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Schlanke obere Leiste pro Screen. Optional mit Zurück-Link und Wortmarke.
 */
export default function AppHeader({
  title,
  back,
  brand = false,
  right,
}: {
  title: string;
  back?: { href: string; label: string };
  brand?: boolean;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur">
      {back && (
        <Link
          href={back.href}
          className="tap -ml-2 mb-1 inline-flex items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary"
        >
          <ChevronLeft aria-hidden size={18} />
          {back.label}
        </Link>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {brand && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-ink">
              <ShieldCheck aria-hidden size={18} />
            </span>
          )}
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  );
}

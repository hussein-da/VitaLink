import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { kategorie } from "@/lib/kategorie";

export default function DetailHeader({
  hinweis,
  back,
}: {
  hinweis: Hinweis;
  back: { href: string; label: string };
}) {
  const k = kategorie(hinweis.szenario);
  const Icon = k.icon;

  return (
    <header className={`relative min-h-[220px] overflow-hidden ${k.soft}`}>
      {/* Zurück-Button — oben links */}
      <Link
        href={back.href}
        className={`tap absolute left-4 z-10 inline-flex items-center gap-0.5 rounded-full bg-surface/70 py-2 pl-2.5 pr-3.5 text-[15px] font-semibold backdrop-blur ${k.text}`}
        style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <ChevronLeft aria-hidden size={20} />
        {back.label}
      </Link>

      {/* G2: Kategorie-Pille entfernt — Kategorie geht aus Icon, Farbe und Titel hervor. */}

      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-5 pb-7 pt-16 text-center">
        <span
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-[20px] ${k.iconBg}`}
        >
          <Icon aria-hidden size={36} className={k.text} strokeWidth={2} />
        </span>
        <h1 className="max-w-[18rem] break-words font-display text-2xl font-semibold leading-snug text-ink">
          {hinweis.titel}
        </h1>
        {hinweis.unsicher && (
          <span className="rounded-full bg-status-warn-light px-3.5 py-1.5 text-[11px] font-semibold text-accent-ink">
            unsicher
          </span>
        )}
      </div>
    </header>
  );
}

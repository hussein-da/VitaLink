import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { kategorie } from "@/lib/kategorie";

/**
 * Detail-Hero (§Screen 2): 240px hohe Kategorie-Soft-Fläche, unten stark
 * abgerundet (36px). Oben links ein Pill-Zurück-Button, mittig der
 * Icon-Container (72px), Titel (Fraunces 24px) und Kategorie- bzw.
 * Unsicherheits-Chip. Der weiße Content-Sheet legt sich darüber.
 */
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
    <header className={`relative h-[240px] overflow-hidden rounded-b-[36px] ${k.soft}`}>
      <Link
        href={back.href}
        className={`tap absolute left-4 top-4 z-10 inline-flex items-center gap-0.5 rounded-full bg-surface/70 py-2 pl-2.5 pr-3.5 text-[15px] font-semibold backdrop-blur ${k.text}`}
        style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <ChevronLeft aria-hidden size={20} />
        {back.label}
      </Link>

      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 pt-10 text-center">
        <span
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-[20px] ${k.iconBg}`}
        >
          <Icon aria-hidden size={36} className={k.text} strokeWidth={2} />
        </span>
        <h1 className="line-clamp-2 max-w-[18rem] font-display text-2xl font-semibold leading-snug text-ink">
          {hinweis.titel}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className={`rounded-full ${k.iconBg} px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] ${k.text}`}
          >
            {k.label}
          </span>
          {hinweis.unsicher && (
            <span className="rounded-full bg-status-warn-light px-3.5 py-1.5 text-[11px] font-semibold text-accent-ink">
              unsicher
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

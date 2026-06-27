import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Hinweis } from "@/lib/types";
import { kategorie } from "@/lib/kategorie";

/**
 * Typ-C-Detail-Hero: ruhige Kategorie-Soft-Fläche (kein Bild), zentriertes
 * Kategorie-Icon (56px), Titel (Fraunces 24px), Kategorie- + ggf.
 * Unsicherheits-Chip. Unten abgerundet (28px); der weiße Content-Sheet
 * der Detailseite legt sich darüber.
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
    <header className={`rounded-b-[28px] px-5 pb-12 pt-3 ${k.soft}`}>
      <Link
        href={back.href}
        className={`tap -ml-1 inline-flex items-center gap-0.5 rounded-lg pr-2 text-sm font-semibold ${k.text}`}
      >
        <ChevronLeft aria-hidden size={20} />
        {back.label}
      </Link>

      <div className="mt-2 flex flex-col items-center text-center">
        <Icon aria-hidden size={56} className={k.text} strokeWidth={1.75} />
        <h1 className="mt-3 line-clamp-2 font-display text-2xl font-semibold leading-snug text-ink">
          {hinweis.titel}
        </h1>
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
          <span
            className={`rounded-full bg-surface/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${k.text}`}
          >
            {k.label}
          </span>
          {hinweis.unsicher && (
            <span className="rounded-full bg-surface/70 px-3 py-1 text-[11px] font-semibold text-accent-ink">
              unsicher
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, CalendarCheck, Settings, type LucideIcon } from "lucide-react";

/**
 * Bottom-Navigation (auf allen Screens nach dem Onboarding sichtbar, Block 0).
 * Vier Tabs: Home | VitaLink | Termine | Einstellungen. Jeder Tab trägt im
 * aktiven Zustand seine eigene Akzentfarbe samt getöntem Pill (44×28px) und
 * SemiBold-Label. Inaktive Tabs zeigen nur das Icon in --c-muted.
 * Höhe 64px + sichere Unterzone.
 */
type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Getönter Pill-Hintergrund im aktiven Zustand. */
  pill: string;
  /** Icon-/Label-Farbe im aktiven Zustand. */
  accent: string;
  /** Icon im aktiven Zustand füllen (VitaLink-Sparkles). */
  fillActive?: boolean;
};

const TABS: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, pill: "bg-cat-lifestyle-light", accent: "text-cat-lifestyle" },
  { href: "/vitalink", label: "VitaLink", icon: Sparkles, pill: "bg-cat-prevention-light", accent: "text-cat-prevention", fillActive: true },
  { href: "/termine", label: "Termine", icon: CalendarCheck, pill: "bg-cat-travel-light", accent: "text-cat-travel" },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings, pill: "bg-surface-2", accent: "text-ink" },
];

export default function Disclaimer() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <footer className="pb-safe shrink-0 border-t border-border bg-surface/95 backdrop-blur">
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto flex h-16 max-w-frame items-stretch justify-around px-2"
      >
        {TABS.map(({ href, label, icon: Icon, pill, accent, fillActive }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className="group flex flex-1 flex-col items-center justify-center gap-[3px] pt-1"
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  active ? `${pill} ${accent}` : "text-muted group-hover:text-ink"
                }`}
              >
                <Icon
                  aria-hidden
                  size={22}
                  strokeWidth={active ? 2.4 : 2}
                  {...(active && fillActive ? { fill: "currentColor" } : {})}
                />
              </span>
              {active && (
                <span className={`whitespace-nowrap text-[11px] font-semibold leading-none ${accent}`}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

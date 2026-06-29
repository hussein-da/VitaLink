"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, CalendarCheck, Settings, type LucideIcon } from "lucide-react";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  pill: string;
  accent: string;
  fillActive?: boolean;
};

const TABS: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, pill: "bg-cat-lifestyle-light", accent: "text-cat-lifestyle" },
  { href: "/vitalink", label: "VitaLink", icon: Sparkles, pill: "bg-cat-prevention-light", accent: "text-cat-prevention", fillActive: true },
  { href: "/termine", label: "Termine", icon: CalendarCheck, pill: "bg-cat-travel-light", accent: "text-cat-travel" },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings, pill: "bg-surface-2", accent: "text-ink" },
];

/**
 * Persistente Bottom-Navigation (4 Haupt-Tabs) plus dezenter Medizin-Disclaimer.
 * Früher fälschlich „Disclaimer" benannt (NAV-03) — Name und Inhalt passen jetzt
 * zusammen; der eigentliche Disclaimer-Text liegt in MedicalDisclaimer.
 */
export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <footer className="pb-safe shrink-0 border-t border-border bg-surface/95 backdrop-blur">
      <MedicalDisclaimer />
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto flex h-[72px] max-w-frame items-stretch justify-around px-2"
      >
        {TABS.map(({ href, label, icon: Icon, pill, accent, fillActive }) => {
          let active = pathname === href || pathname.startsWith(`${href}/`);
          if (href === "/vitalink" && (pathname.startsWith("/hinweis/") || pathname === "/reise" || pathname.startsWith("/reise/"))) active = true;
          if (href === "/einstellungen" && (pathname === "/export" || pathname === "/ueber")) active = true;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="group flex flex-1 flex-col items-center justify-center gap-[3px] py-2"
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  active ? `${pill} ${accent}` : "text-muted"
                }`}
              >
                <Icon
                  aria-hidden
                  size={22}
                  strokeWidth={active ? 2.4 : 2}
                  {...(active && fillActive ? { fill: "currentColor" } : {})}
                />
              </span>
              <span
                className={`whitespace-nowrap text-[11px] leading-none ${
                  active ? `font-semibold ${accent}` : "font-normal text-muted"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

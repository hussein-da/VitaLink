"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, CalendarCheck, User, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/useT";
import type { Dictionary } from "@/i18n/de";

type Tab = {
  href: string;
  /** Beschriftung wird aus dem Woerterbuch gelesen, nicht hier hinterlegt. */
  label: (nav: Dictionary["nav"]) => string;
  icon: LucideIcon;
  pill: string;
  accent: string;
  fillActive?: boolean;
};

const TABS: Tab[] = [
  { href: "/dashboard", label: (n) => n.home, icon: Home, pill: "bg-cat-lifestyle-light", accent: "text-cat-lifestyle" },
  { href: "/vitalink", label: (n) => n.insights, icon: Sparkles, pill: "bg-cat-prevention-light", accent: "text-cat-prevention", fillActive: true },
  { href: "/termine", label: (n) => n.appointments, icon: CalendarCheck, pill: "bg-cat-travel-light", accent: "text-cat-travel" },
  { href: "/profil", label: (n) => n.profile, icon: User, pill: "bg-surface-2", accent: "text-ink" },
];

/**
 * Persistente Bottom-Navigation (4 Haupt-Tabs) plus dezenter Medizin-Disclaimer.
 * Früher fälschlich „Disclaimer" benannt (NAV-03) — Name und Inhalt passen jetzt
 * zusammen; der eigentliche Disclaimer-Text liegt in MedicalDisclaimer.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  if (pathname === "/") return null;

  return (
    <footer className="pb-safe shrink-0 border-t border-border bg-surface/95 backdrop-blur">
      <nav
        aria-label={t.nav.ariaLabel}
        className="mx-auto flex h-[72px] max-w-frame items-stretch justify-around px-2"
      >
        {TABS.map(({ href, label: labelOf, icon: Icon, pill, accent, fillActive }) => {
          const label = labelOf(t.nav);
          let active = pathname === href || pathname.startsWith(`${href}/`);
          if (href === "/dashboard" && pathname === "/werte") active = true;
          if (href === "/vitalink" && (pathname.startsWith("/hinweis/") || pathname === "/reise" || pathname.startsWith("/reise/"))) active = true;
          if (
            href === "/profil" &&
            (pathname === "/einstellungen" ||
              pathname === "/export" ||
              pathname === "/ueber" ||
              pathname === "/glossar" ||
              pathname === "/rueckmeldungen")
          )
            active = true;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="group flex flex-1 flex-col items-center justify-center gap-[3px] py-2"
            >
              <span
                className={`flex h-9 w-16 items-center justify-center rounded-2xl transition-colors ${
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

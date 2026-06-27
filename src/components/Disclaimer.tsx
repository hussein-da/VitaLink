"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, CalendarCheck, FileText } from "lucide-react";

/**
 * Bottom-Navigation (auf allen Screens nach dem Onboarding sichtbar).
 * Aktiver Tab: Icon auf getöntem Pill, Label in Kategorie-Farbe. Inaktiv:
 * Icon + Label in --c-muted. Der Export-Tab trägt die Prävention-Farbe
 * (Violett), die übrigen die App-Navigationsfarbe (Teal). Höhe 64px +
 * sichere Unterzone (§Bottom Navigation).
 */
const TABS = [
  { href: "/dashboard", label: "Home", icon: Home, pill: "bg-cat-lifestyle-light text-cat-lifestyle", text: "text-cat-lifestyle" },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings, pill: "bg-cat-lifestyle-light text-cat-lifestyle", text: "text-cat-lifestyle" },
  { href: "/termine", label: "Termine", icon: CalendarCheck, pill: "bg-cat-prevention-light text-cat-prevention", text: "text-cat-prevention" },
  { href: "/export", label: "Export", icon: FileText, pill: "bg-cat-prevention-light text-cat-prevention", text: "text-cat-prevention" },
] as const;

export default function Disclaimer() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <footer className="pb-safe border-t border-border bg-surface/95 backdrop-blur">
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto flex h-16 max-w-frame items-stretch justify-around px-2"
      >
        {TABS.map(({ href, label, icon: Icon, pill, text }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="group flex flex-1 flex-col items-center justify-center gap-[3px] pt-1"
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                  active ? pill : "text-muted group-hover:text-ink"
                }`}
              >
                <Icon aria-hidden size={active ? 24 : 22} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span
                className={`whitespace-nowrap text-[11px] leading-none transition-colors ${
                  active ? `font-semibold ${text}` : "font-medium text-muted"
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

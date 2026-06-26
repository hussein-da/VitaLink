"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Info } from "lucide-react";

/**
 * Bottom-Navigation (auf allen Screens nach dem Onboarding sichtbar).
 * Aktiver Tab: Icon + Label in --c-primary mit Pill in --c-primary-soft.
 * Inaktiv: Icon + dezentes Label in --c-muted. Hoehe >=64px, sichere
 * Unterzone fuer Home-Indicator-Geraete (§1a).
 */
const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
  { href: "/ueber", label: "Über", icon: Info },
] as const;

export default function Disclaimer() {
  const pathname = usePathname();

  // Footer erst nach dem Onboarding-Flow sichtbar (nicht auf der Startseite "/")
  if (pathname === "/") return null;

  return (
    <footer className="pb-safe border-t border-border bg-surface/95 backdrop-blur">
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto flex min-h-[64px] max-w-frame items-stretch justify-around px-2 py-2"
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="tap group flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1"
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                  active ? "bg-primary-soft text-primary" : "text-muted group-hover:text-primary"
                }`}
              >
                <Icon aria-hidden size={20} />
              </span>
              <span
                className={`text-[11px] font-medium leading-none transition-colors ${
                  active ? "text-primary" : "text-muted group-hover:text-primary"
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

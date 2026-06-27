"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Info } from "lucide-react";

/**
 * Bottom-Navigation (auf allen Screens nach dem Onboarding sichtbar).
 * Aktiver Tab: Icon in --c-primary auf Pill (40×28) in --c-primary-soft,
 * Label in --c-primary. Inaktiv: Icon + Label in --c-muted. Höhe 64px +
 * sichere Unterzone (§Bottom Navigation).
 */
const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
  { href: "/ueber", label: "Über", icon: Info },
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
        {TABS.map(({ href, label, icon: Icon }) => {
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
                  active
                    ? "bg-cat-lifestyle-light text-cat-lifestyle"
                    : "text-muted group-hover:text-ink"
                }`}
              >
                <Icon aria-hidden size={active ? 24 : 22} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span
                className={`text-[11px] leading-none transition-colors ${
                  active ? "font-semibold text-cat-lifestyle" : "font-medium text-muted"
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

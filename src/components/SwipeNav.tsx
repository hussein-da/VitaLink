"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

// Reihenfolge der vier Haupt-Tabs (Badge 2.11). Kein Umlauf.
const TABS = ["/dashboard", "/vitalink", "/termine", "/profil"];

/** Findet einen horizontal scrollbaren Vorfahren (Monatsnav, Filter, Chips). */
function hatHorizontalenScroller(el: EventTarget | null): boolean {
  let node = el instanceof Element ? el : null;
  while (node && node !== document.body) {
    if (node instanceof HTMLElement) {
      const style = getComputedStyle(node);
      if (
        (style.overflowX === "auto" || style.overflowX === "scroll") &&
        node.scrollWidth > node.clientWidth + 4
      ) {
        return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

/**
 * Horizontales Wischen zwischen den vier Haupt-Tabs (Badge 2.11). Nur dominant
 * horizontale Gesten (>=50px, Winkel < ~30°). Auf Detail-Unterseiten inaktiv;
 * Gesten auf inneren horizontalen Scrollern lösen keinen Tab-Wechsel aus.
 */
export default function SwipeNav({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const start = useRef<{ x: number; y: number } | null>(null);
  const blockiert = useRef(false);

  useEffect(() => {
    const idx = TABS.indexOf(pathname);
    if (idx === -1) return; // nur auf den vier Haupt-Tabs

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
      blockiert.current = hatHorizontalenScroller(e.target);
    };
    const onEnd = (e: TouchEvent) => {
      const s = start.current;
      start.current = null;
      if (!s || blockiert.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      if (Math.abs(dx) < 50) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.58) return; // < ~30° = dominant horizontal
      if (dx < 0 && idx < TABS.length - 1) router.push(TABS[idx + 1]);
      else if (dx > 0 && idx > 0) router.push(TABS[idx - 1]);
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [pathname, router]);

  return <>{children}</>;
}

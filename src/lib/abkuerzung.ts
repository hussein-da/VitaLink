// VitaLink — Abkürzungs-Helfer (Badge 2.3).
// zeige() entscheidet zentral, ob ein Begriff kompakt (Kürzel) oder
// ausgeschrieben dargestellt wird. useNutzerAbkuerzungen() verwaltet
// nutzerdefinierte Einträge im localStorage.

import { useCallback, useEffect, useState } from "react";

/** Kompakt → nur Kürzel; sonst „Ausgeschrieben (Kürzel)". */
export function zeige(kuerzel: string, ausgeschrieben: string, kompakt: boolean): string {
  return kompakt ? kuerzel : `${ausgeschrieben} (${kuerzel})`;
}

export interface NutzerAbkuerzung {
  id: string;
  kuerzel: string;
  ausgeschrieben: string;
  erklaerung: string;
  kategorie: "nutzerdefiniert";
  vordefiniert: false;
  erstellt: string;
}

const STORE = "vitalink.abkuerzungen.v1";

function gueltig(e: unknown): e is NutzerAbkuerzung {
  if (!e || typeof e !== "object") return false;
  const o = e as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.kuerzel === "string" && typeof o.ausgeschrieben === "string";
}

export function useNutzerAbkuerzungen() {
  const [eintraege, setEintraege] = useState<NutzerAbkuerzung[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setEintraege(parsed.filter(gueltig));
      }
    } catch {
      // ignorieren
    }
  }, []);

  const persist = useCallback((list: NutzerAbkuerzung[]) => {
    setEintraege(list);
    try {
      window.localStorage.setItem(STORE, JSON.stringify(list));
    } catch {
      // ignorieren
    }
  }, []);

  const hinzufuegen = useCallback(
    (e: { kuerzel: string; ausgeschrieben: string; erklaerung: string }) => {
      const eintrag: NutzerAbkuerzung = {
        id: `u-${eintraege.length}-${e.kuerzel.toLowerCase()}`,
        kuerzel: e.kuerzel.trim().slice(0, 12),
        ausgeschrieben: e.ausgeschrieben.trim().slice(0, 80),
        erklaerung: e.erklaerung.trim().slice(0, 200),
        kategorie: "nutzerdefiniert",
        vordefiniert: false,
        erstellt: "2026-06-29",
      };
      persist([...eintraege, eintrag]);
    },
    [eintraege, persist],
  );

  const entfernen = useCallback(
    (id: string) => persist(eintraege.filter((x) => x.id !== id)),
    [eintraege, persist],
  );

  return { eintraege, hinzufuegen, entfernen };
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExportToast from "@/components/ExportToast";
import TerminKarte from "@/components/TerminKarte";
import {
  termine,
  dringlichkeitMeta,
  DRINGLICHKEIT_REIHENFOLGE,
  type Termin,
  type TerminDringlichkeit,
  type TerminAktion,
} from "@/data/termine";

type Filter = "alle" | TerminDringlichkeit;

const FILTER: { id: Filter; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "jetzt", label: "Jetzt wichtig" },
  { id: "bald", label: "Bald planen" },
  { id: "spaeter", label: "Später im Blick" },
  { id: "erledigt", label: "Erledigt" },
];

const MONATE_KURZ = [
  "",
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

// Termine in fester Sektions-Reihenfolge (für Monats-Scroll-Anker).
const TERMINE_GEORDNET: Termin[] = DRINGLICHKEIT_REIHENFOLGE.flatMap((d) =>
  termine.filter((t) => t.dringlichkeit === d),
);

export default function TerminePage() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [toast, setToast] = useState<{ msg: string; fertig: boolean } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const zeigeToast = useCallback(
    (msg: string) => {
      clearTimers();
      setToast({ msg, fertig: true });
      timers.current.push(setTimeout(() => setToast(null), 4000));
    },
    [clearTimers],
  );

  const onAktion = useCallback(
    (aktion: TerminAktion, termin: Termin) => {
      if (aktion === "termin-planen") {
        zeigeToast(`„${termin.titel}" würde in einem echten System in deinen Kalender übernommen.`);
      } else if (aktion === "spaeter") {
        zeigeToast("In der Demo merken wir uns diese Auswahl nicht dauerhaft.");
      } else if (aktion === "korrigieren") {
        zeigeToast("Eintrag korrigieren ist in dieser Demo nicht aktiv.");
      }
    },
    [zeigeToast],
  );

  // Zähler (Block 6) — dynamisch aus den Daten.
  const counts = useMemo(() => {
    const z = (d: TerminDringlichkeit) => termine.filter((t) => t.dringlichkeit === d).length;
    return { jetzt: z("jetzt"), bald: z("bald"), erledigt: z("erledigt") };
  }, []);

  // Monatsnavigation (Block 4) — nur Monate mit nicht-erledigten Einträgen.
  const monate = useMemo(() => {
    const map = new Map<string, { monat: number; jahr: number; anzahl: number }>();
    for (const t of termine) {
      if (t.dringlichkeit === "erledigt" || t.monat < 1) continue;
      const key = `${t.jahr}-${t.monat}`;
      const cur = map.get(key);
      if (cur) cur.anzahl += 1;
      else map.set(key, { monat: t.monat, jahr: t.jahr, anzahl: 1 });
    }
    return [...map.values()].sort((a, b) => a.jahr - b.jahr || a.monat - b.monat);
  }, []);

  const [aktiverMonat, setAktiverMonat] = useState<string | null>(
    monate.length > 0 ? `${monate[0].jahr}-${monate[0].monat}` : null,
  );

  const springeZuMonat = useCallback((monat: number, jahr: number) => {
    setAktiverMonat(`${jahr}-${monat}`);
    const ziel = TERMINE_GEORDNET.find((t) => t.monat === monat && t.jahr === jahr);
    if (ziel) cardRefs.current[ziel.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const sichtbareSektionen = DRINGLICHKEIT_REIHENFOLGE.filter(
    (d) => filter === "alle" || filter === d,
  );

  return (
    <>
      <ExportToast message={toast?.msg ?? null} fertig={toast?.fertig} />

      <div className="pt-safe pb-10">
        {/* Header (Typ A) + dynamischer Zähler (Block 6/7) */}
        <header className="px-4 pt-5">
          <h1 className="text-[24px] font-semibold leading-tight text-ink">Vorsorge & Termine</h1>
          <p className="mt-0.5 text-[13px] text-muted">Deine nächsten Gesundheitsschritte</p>
          <p className="mt-2 text-[13px] text-muted">
            {counts.jetzt > 0 && (
              <>
                <span className="font-semibold text-status-warn">{counts.jetzt} jetzt wichtig</span>
                {" · "}
              </>
            )}
            {counts.bald} bald fällig · {counts.erledigt} erledigt
          </p>
        </header>

        {/* Monatsnavigation (Block 4) */}
        {monate.length > 0 && (
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {monate.map(({ monat, jahr, anzahl }) => {
              const key = `${jahr}-${monat}`;
              const aktiv = aktiverMonat === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => springeZuMonat(monat, jahr)}
                  className={`tap flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    aktiv ? "bg-cat-lifestyle text-white" : "bg-surface-2 text-ink"
                  }`}
                >
                  {MONATE_KURZ[monat]} {jahr}
                  <span
                    className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                      aktiv ? "bg-white/25 text-white" : "bg-surface-3 text-muted"
                    }`}
                  >
                    {anzahl}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Filter-Leiste (Block 5) */}
        <div
          role="group"
          aria-label="Termine filtern"
          className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {FILTER.map((f) => {
            const aktiv = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={aktiv}
                className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  aktiv ? "bg-cat-lifestyle text-white" : "bg-surface-2 text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Sektionen (Block 7) */}
        <div className="mt-5 space-y-6 px-4">
          {sichtbareSektionen.map((d) => {
            const items = termine.filter((t) => t.dringlichkeit === d);
            if (items.length === 0) return null;
            const meta = dringlichkeitMeta[d];
            return (
              <section key={d}>
                <h2
                  className={`mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.07em] ${meta.sectionClass}`}
                >
                  {meta.sectionLabel}
                </h2>
                <div className="space-y-2.5">
                  {items.map((t) => (
                    <div
                      key={t.id}
                      ref={(el) => {
                        cardRefs.current[t.id] = el;
                      }}
                      style={{ scrollMarginTop: "16px" }}
                    >
                      <TerminKarte termin={t} onAktion={onAktion} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

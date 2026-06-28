"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarCheck } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import TerminRow from "@/components/TerminRow";
import ExportToast from "@/components/ExportToast";
import {
  termine,
  gruppiere,
  offeneTermineCount,
  type Termin,
  type TerminStatus,
  type TerminGruppe,
} from "@/data/termine";

type Filter = "alle" | "offen" | "erledigt";

const FILTER: { id: Filter; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "offen", label: "Offen" },
  { id: "erledigt", label: "Erledigt" },
];

export default function TerminePage() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [erledigt, setErledigt] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; fertig: boolean } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const toggleErledigt = useCallback((id: string) => {
    setErledigt((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const kalender = useCallback(
    (t: Termin) => {
      clearTimers();
      setToast({
        msg: `„${t.titel}" würde in einem echten System in deinen Kalender übernommen.`,
        fertig: true,
      });
      timers.current.push(setTimeout(() => setToast(null), 4000));
    },
    [clearTimers],
  );

  // Lokale „erledigt"-Markierung überschreibt Status + Gruppe (nicht persistiert).
  const effektiv = useMemo<Termin[]>(
    () =>
      termine.map((t) =>
        erledigt.includes(t.id)
          ? { ...t, status: "erledigt" as TerminStatus, gruppe: "erledigt" as TerminGruppe }
          : t,
      ),
    [erledigt],
  );

  const gefiltert = useMemo(
    () =>
      effektiv.filter((t) =>
        filter === "alle" ? true : filter === "erledigt" ? t.status === "erledigt" : t.status !== "erledigt",
      ),
    [effektiv, filter],
  );

  const gruppen = useMemo(() => gruppiere(gefiltert), [gefiltert]);

  return (
    <>
      <ExportToast message={toast?.msg ?? null} fertig={toast?.fertig} />

      <div className="pb-10">
        <AppHeader title="Vorsorge & Termine" eyebrow="Vorsorge" />

        <div className="space-y-6 px-4 py-5">
          {/* Intro-Band (violett) */}
          <div className="rounded-[20px] bg-cat-prevention-light p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-cat-prevention/20">
                <CalendarCheck aria-hidden size={24} className="text-cat-prevention" />
              </span>
              <div className="min-w-0">
                <p className="text-[17px] font-semibold text-ink">Deine Vorsorge auf einen Blick</p>
                <p className="text-[13px] text-muted">{offeneTermineCount} offene Termine</p>
              </div>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink">
              VitaLink bündelt deine Vorsorge-Termine und Impfungen aus der ePA und sortiert sie nach
              Dringlichkeit.
            </p>
          </div>

          {/* Filter-Chips */}
          <div role="group" aria-label="Termine filtern" className="flex gap-1 rounded-xl bg-surface-2 p-1">
            {FILTER.map((f) => {
              const aktiv = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={aktiv}
                  className={`tap flex-1 rounded-[11px] px-2 py-2 text-sm font-medium transition-colors ${
                    aktiv ? "bg-cat-prevention text-cat-prevention-on shadow-sm" : "text-muted hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Dringlichkeits-Gruppen */}
          {gruppen.length === 0 ? (
            <p className="px-1 py-6 text-center text-sm text-muted">Keine Termine in dieser Ansicht.</p>
          ) : (
            gruppen.map((g) => (
              <section key={g.gruppe}>
                <h2 className="section-label mb-2 px-1">{g.label}</h2>
                <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
                  {g.items.map((t) => (
                    <TerminRow
                      key={t.id}
                      termin={t}
                      erledigt={erledigt.includes(t.id)}
                      onToggleErledigt={() => toggleErledigt(t.id)}
                      onCalendar={() => kalender(t)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </>
  );
}

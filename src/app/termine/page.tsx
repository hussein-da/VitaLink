"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExportToast from "@/components/ExportToast";
import { useT } from "@/i18n/useT";
import TerminKarte from "@/components/TerminKarte";
import GynaekologieKontaktSheet from "@/components/GynaekologieKontaktSheet";
import {
  termineFuer,
  dringlichkeitMetaFuer,
  DRINGLICHKEIT_REIHENFOLGE,
  type Termin,
  type TerminDringlichkeit,
  type TerminAktion,
} from "@/data/termine";

type Filter = "alle" | TerminDringlichkeit;

export default function TerminePage() {
  const { t, locale, fmt } = useT();
  const [filter, setFilter] = useState<Filter>("alle");
  const [toast, setToast] = useState<{ msg: string; fertig: boolean } | null>(null);
  const [kontaktOffen, setKontaktOffen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
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
        // Nur die Gynäkologie-Kachel: Praxis-Kontakt aus der ePA anzeigen
        // (letzter Vorsorgebesuch) statt der Kalender-Demo-Bestätigung.
        if (termin.id === "gynaekologie") {
          setKontaktOffen(true);
          return;
        }
        zeigeToast(t.appointments.toastPlannedInCalendar(termin.titel));
      } else if (aktion === "korrigieren") {
        zeigeToast(t.appointments.toastCorrectionInactive);
      }
    },
    [zeigeToast, t],
  );

  const termine = useMemo(() => termineFuer(locale), [locale]);
  const meta = useMemo(() => dringlichkeitMetaFuer(locale), [locale]);

  const counts = useMemo(() => {
    const z = (d: TerminDringlichkeit) =>
      termine.filter((termin: Termin) => termin.dringlichkeit === d).length;
    return { jetzt: z("jetzt"), bald: z("bald"), erledigt: z("erledigt") };
  }, [termine]);

  // Uebersetzte Labels gehoeren in die Render-Ebene, damit der Sprachwechsel
  // greift (eine Modulkonstante wuerde einmal beim Import ausgewertet).
  const filterOptionen: { id: Filter; label: string }[] = useMemo(
    () => [
      { id: "alle", label: t.appointments.filterAll },
      { id: "jetzt", label: t.appointments.filterNow },
      { id: "bald", label: t.appointments.filterSoon },
      { id: "spaeter", label: t.appointments.filterLater },
      { id: "erledigt", label: t.appointments.filterDone },
    ],
    [t],
  );

  const sichtbareSektionen = DRINGLICHKEIT_REIHENFOLGE.filter(
    (d) => filter === "alle" || filter === d,
  );

  return (
    <>
      <ExportToast message={toast?.msg ?? null} fertig={toast?.fertig} />

      {kontaktOffen && <GynaekologieKontaktSheet onClose={() => setKontaktOffen(false)} />}

      <div className="pt-safe pb-10">
        {/* Header + kompakter Zähler */}
        <header className="px-4 pt-5">
          <h1 className="text-[24px] font-semibold leading-tight text-ink">
            {t.appointments.title}
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            <span className="font-semibold text-status-warn">
              {fmt.plural(counts.jetzt, t.appointments.countImportantNow)}
            </span>
            {" · "}
            {fmt.plural(counts.bald, t.appointments.countSoon)}
            {" · "}
            {fmt.plural(counts.erledigt, t.appointments.countDone)}
          </p>
        </header>

        {/* Status-Filter */}
        <div
          role="group"
          aria-label={t.appointments.filterAriaLabel}
          className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {filterOptionen.map((f) => {
            const aktiv = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={aktiv}
                className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  aktiv ? "bg-cat-prevention text-cat-prevention-on" : "bg-surface-2 text-muted"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Sektionen */}
        <div className="mt-5 space-y-6 px-4">
          {sichtbareSektionen.map((d) => {
            const items = termine.filter((termin: Termin) => termin.dringlichkeit === d);
            if (items.length === 0) return null;
            const sektionMeta = meta[d];
            return (
              <section key={d}>
                <h2
                  className={`mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.07em] ${sektionMeta.sectionClass}`}
                >
                  {sektionMeta.sectionLabel}
                </h2>
                <div className="space-y-2.5">
                  {items.map((termin) => (
                    <TerminKarte key={termin.id} termin={termin} onAktion={onAktion} />
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

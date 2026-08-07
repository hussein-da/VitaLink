"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stethoscope, Heart, User, Download, Calendar, FileText } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import EmpfaengerKachel from "@/components/EmpfaengerKachel";
import ExportGruppe from "@/components/ExportGruppe";
import ExportToast from "@/components/ExportToast";
import { useT } from "@/i18n/useT";
import {
  exportKategorienFuer,
  exportZeilenIds,
  defaultAuswahl,
  defaultGruppenOffen,
  vitalinkZeilenIds,
  type Empfaenger,
} from "@/data/exportKategorien";

/** Nur die locale-unabhaengigen Teile bleiben Modulkonstanten (Icons, IDs). */
const EMPFAENGER_ICONS: Record<Empfaenger, typeof Stethoscope> = {
  hausarzt: Stethoscope,
  kardiologe: Heart,
  anderer: User,
};
const EMPFAENGER_KEYS: Empfaenger[] = ["hausarzt", "kardiologe", "anderer"];

type ToastStufe = "vorbereitung" | "fertig";

export default function ExportPage() {
  const { t, locale, fmt } = useT();

  const [empfaenger, setEmpfaenger] = useState<Empfaenger>("hausarzt");
  const [ausgewaehlt, setAusgewaehlt] = useState<Record<string, boolean>>(() =>
    defaultAuswahl("hausarzt"),
  );
  const [gruppenOffen, setGruppenOffen] = useState<Record<string, boolean>>(() =>
    defaultGruppenOffen(),
  );
  // Der Toast haelt eine Stufe, keinen fertigen Text: der Text wird beim Render
  // aus dem Woerterbuch geholt und folgt so einem Sprachwechsel.
  const [toastStufe, setToastStufe] = useState<ToastStufe | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((tm) => clearTimeout(tm));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const kategorien = useMemo(() => exportKategorienFuer(locale), [locale]);

  // Auswahl laeuft ausschliesslich ueber die locale-unabhaengigen Zeilen-IDs.
  const alleAn = exportZeilenIds.every((id) => ausgewaehlt[id]);

  const waehleEmpfaenger = useCallback((e: Empfaenger) => {
    setEmpfaenger(e);
    setAusgewaehlt(defaultAuswahl(e));
  }, []);

  const toggleZeile = useCallback((id: string) => {
    setAusgewaehlt((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleGruppe = useCallback((id: string) => {
    setGruppenOffen((prev) => {
      const isOpen = prev[id];
      const allClosed = Object.fromEntries(Object.keys(prev).map((k) => [k, false]));
      return { ...allClosed, [id]: !isOpen };
    });
  }, []);

  const toggleAlle = useCallback(() => {
    const next = !alleAn;
    setAusgewaehlt(Object.fromEntries(exportZeilenIds.map((id) => [id, next])));
  }, [alleAn]);

  const reset = useCallback(() => {
    setEmpfaenger("hausarzt");
    setAusgewaehlt(defaultAuswahl("hausarzt"));
    setGruppenOffen(defaultGruppenOffen());
  }, []);

  const onExport = useCallback(() => {
    clearTimers();
    setToastStufe("vorbereitung");
    timers.current.push(setTimeout(() => setToastStufe("fertig"), 1500));
    timers.current.push(setTimeout(() => setToastStufe(null), 5500));
  }, [clearTimers]);

  // Dynamische Zusammenfassung
  const anzahlDatenpunkte = useMemo(
    () => Object.values(ausgewaehlt).filter(Boolean).length,
    [ausgewaehlt],
  );
  const anzahlKategorien = useMemo(
    () => kategorien.filter((k) => k.zeilen.some((z) => ausgewaehlt[z.id])).length,
    [ausgewaehlt, kategorien],
  );
  const mitVitalink = useMemo(
    () => [...vitalinkZeilenIds].some((id) => ausgewaehlt[id]),
    [ausgewaehlt],
  );
  const datenpunkteText = fmt.plural(anzahlDatenpunkte, t.exportReport.summaryDataPoints);
  const kategorienText = fmt.plural(anzahlKategorien, t.exportReport.summaryCategories);
  const summary = mitVitalink
    ? t.exportReport.summaryLineWithVitalink(datenpunkteText, kategorienText)
    : t.exportReport.summaryLine(datenpunkteText, kategorienText);

  const datum = fmt.date(new Date(), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const EmpIcon = EMPFAENGER_ICONS[empfaenger];
  const toastNachricht =
    toastStufe === "vorbereitung"
      ? t.exportReport.toastPreparing
      : toastStufe === "fertig"
        ? t.exportReport.toastDone
        : null;

  return (
    <>
      <ExportToast message={toastNachricht} fertig={toastStufe === "fertig"} />

      <div className="pb-10">
        <AppHeader
          title={t.exportReport.title}
          back={{ href: "/einstellungen", label: t.exportReport.backToSettings }}
        />

        {/* Intro */}
        <div className="px-4 pt-5">
          <h2 className="text-[22px] font-semibold leading-tight text-ink">
            {t.exportReport.introTitle}
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            {t.exportReport.introText}
          </p>
        </div>

        {/* Stufe 1: Empfänger */}
        <section className="mt-6 px-4">
          <h3 className="section-label mb-3">{t.exportReport.recipientSection}</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {EMPFAENGER_KEYS.map((key) => (
              <EmpfaengerKachel
                key={key}
                icon={EMPFAENGER_ICONS[key]}
                label={t.exportReport.recipients[key].label}
                active={empfaenger === key}
                onClick={() => waehleEmpfaenger(key)}
              />
            ))}
          </div>
        </section>

        {/* Stufe 2: Datenauswahl */}
        <section className="mt-7 px-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="section-label">{t.exportReport.contentSection}</h3>
            <button
              type="button"
              onClick={toggleAlle}
              className="tap -my-2 text-[14px] font-semibold text-cat-prevention"
            >
              {alleAn ? t.exportReport.clearSelection : t.exportReport.selectAll}
            </button>
          </div>
          <div className="space-y-4">
            {kategorien.map((k) => (
              <ExportGruppe
                key={k.id}
                kategorie={k}
                ausgewaehlt={ausgewaehlt}
                offen={Boolean(gruppenOffen[k.id])}
                onToggleOffen={() => toggleGruppe(k.id)}
                onToggleZeile={toggleZeile}
              />
            ))}
          </div>
        </section>

        {/* Stufe 3: Vorschau + Export */}
        <section className="mt-7 px-4">
          <h3 className="section-label mb-3">{t.exportReport.summarySection}</h3>
          <div className="rounded-2xl bg-surface p-5 shadow-card">
            <p className="text-[17px] font-semibold text-ink">{t.exportReport.reportTitle}</p>
            <p className="mt-1 text-[14px] text-muted">{summary}</p>

            <div className="my-3.5 h-px bg-border" />

            <div className="space-y-2 text-[14px] text-muted">
              <p className="flex items-center gap-1.5">
                <EmpIcon aria-hidden size={14} className="shrink-0" />{" "}
                {t.exportReport.recipients[empfaenger].forAppointment}
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar aria-hidden size={14} className="shrink-0" /> {t.exportReport.dataRange}
              </p>
              <p className="flex items-center gap-1.5">
                <FileText aria-hidden size={14} className="shrink-0" />{" "}
                {t.exportReport.createdToday(datum)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExport}
            className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cat-prevention px-4 py-4 text-[17px] font-semibold text-cat-prevention-on shadow-card transition-transform motion-safe:active:scale-[0.99]"
          >
            <Download aria-hidden size={20} />
            {t.exportReport.createPdf}
          </button>

          <button
            type="button"
            onClick={reset}
            className="tap mt-3 w-full text-center text-[14px] text-muted"
          >
            {t.exportReport.resetSelection}
          </button>
        </section>
      </div>
    </>
  );
}

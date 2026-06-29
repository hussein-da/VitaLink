"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stethoscope, Heart, User, Download, Calendar, FileText } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import EmpfaengerKachel from "@/components/EmpfaengerKachel";
import ExportGruppe from "@/components/ExportGruppe";
import ExportToast from "@/components/ExportToast";
import {
  exportKategorien,
  defaultAuswahl,
  defaultGruppenOffen,
  vitalinkZeilenIds,
  type Empfaenger,
} from "@/data/exportKategorien";

const EMPFAENGER_META: Record<Empfaenger, { label: string; termin: string; icon: typeof Stethoscope }> = {
  hausarzt: { label: "Hausarzt", termin: "Hausarzttermin", icon: Stethoscope },
  kardiologe: { label: "Kardiologe", termin: "Kardiologietermin", icon: Heart },
  anderer: { label: "Anderer", termin: "Arzttermin", icon: User },
};

const TOAST_PREP = "PDF wird vorbereitet …";
const TOAST_FERTIG =
  "PDF wurde erstellt. In einem echten System würde die Datei jetzt heruntergeladen.";

export default function ExportPage() {
  const [empfaenger, setEmpfaenger] = useState<Empfaenger>("hausarzt");
  const [ausgewaehlt, setAusgewaehlt] = useState<Record<string, boolean>>(() =>
    defaultAuswahl("hausarzt"),
  );
  const [gruppenOffen, setGruppenOffen] = useState<Record<string, boolean>>(() =>
    defaultGruppenOffen(),
  );
  const [toast, setToast] = useState<{ msg: string; fertig: boolean } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const alleIds = useMemo(
    () => exportKategorien.flatMap((k) => k.zeilen.map((z) => z.id)),
    [],
  );
  const alleAn = alleIds.every((id) => ausgewaehlt[id]);

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
    setAusgewaehlt(Object.fromEntries(alleIds.map((id) => [id, next])));
  }, [alleAn, alleIds]);

  const reset = useCallback(() => {
    setEmpfaenger("hausarzt");
    setAusgewaehlt(defaultAuswahl("hausarzt"));
    setGruppenOffen(defaultGruppenOffen());
  }, []);

  const onExport = useCallback(() => {
    clearTimers();
    setToast({ msg: TOAST_PREP, fertig: false });
    timers.current.push(setTimeout(() => setToast({ msg: TOAST_FERTIG, fertig: true }), 1500));
    timers.current.push(setTimeout(() => setToast(null), 5500));
  }, [clearTimers]);

  // Dynamische Zusammenfassung
  const anzahlDatenpunkte = useMemo(
    () => Object.values(ausgewaehlt).filter(Boolean).length,
    [ausgewaehlt],
  );
  const anzahlKategorien = useMemo(
    () => exportKategorien.filter((k) => k.zeilen.some((z) => ausgewaehlt[z.id])).length,
    [ausgewaehlt],
  );
  const mitVitalink = useMemo(
    () => [...vitalinkZeilenIds].some((id) => ausgewaehlt[id]),
    [ausgewaehlt],
  );
  const summary = `${anzahlDatenpunkte} Datenpunkte · ${anzahlKategorien} Kategorien${
    mitVitalink ? " · mit VitaLink-Analyse" : ""
  }`;

  const datum = new Date().toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const meta = EMPFAENGER_META[empfaenger];
  const EmpIcon = meta.icon;

  return (
    <>
      <ExportToast message={toast?.msg ?? null} fertig={toast?.fertig} />

      <div className="pb-10">
        <AppHeader title="Arztbericht" back={{ href: "/einstellungen", label: "Einstellungen" }} />

        {/* Intro */}
        <div className="px-4 pt-5">
          <h2 className="text-[22px] font-semibold leading-tight text-ink">
            Deine Daten für den Arzt
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            Wähle aus, was dein Arzt sehen soll. VitaLink bereitet daraus einen übersichtlichen
            Bericht vor.
          </p>
        </div>

        {/* Stufe 1: Empfänger */}
        <section className="mt-6 px-4">
          <h3 className="section-label mb-3">Für welchen Termin</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(EMPFAENGER_META) as Empfaenger[]).map((key) => {
              const m = EMPFAENGER_META[key];
              return (
                <EmpfaengerKachel
                  key={key}
                  icon={m.icon}
                  label={m.label}
                  active={empfaenger === key}
                  onClick={() => waehleEmpfaenger(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Stufe 2: Datenauswahl */}
        <section className="mt-7 px-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="section-label">Inhalte auswählen</h3>
            <button
              type="button"
              onClick={toggleAlle}
              className="tap -my-2 text-[14px] font-semibold text-cat-prevention"
            >
              {alleAn ? "Auswahl aufheben" : "Alles auswählen"}
            </button>
          </div>
          <div className="space-y-4">
            {exportKategorien.map((k) => (
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
          <h3 className="section-label mb-3">Zusammenfassung</h3>
          <div className="rounded-[20px] bg-surface p-5 shadow-card">
            <p className="text-[17px] font-semibold text-ink">Dein Arztbericht</p>
            <p className="mt-1 text-[14px] text-muted">{summary}</p>

            <div className="my-3.5 h-px bg-border" />

            <div className="space-y-2 text-[14px] text-muted">
              <p className="flex items-center gap-1.5">
                <EmpIcon aria-hidden size={14} className="shrink-0" /> Für {meta.termin}
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar aria-hidden size={14} className="shrink-0" /> Daten: letzte 14–30 Tage
              </p>
              <p className="flex items-center gap-1.5">
                <FileText aria-hidden size={14} className="shrink-0" /> Erstellt: heute, {datum}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExport}
            className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cat-prevention px-4 py-4 text-[17px] font-semibold text-cat-prevention-on shadow-card transition-transform motion-safe:active:scale-[0.99]"
          >
            <Download aria-hidden size={20} />
            PDF erstellen
          </button>

          <button
            type="button"
            onClick={reset}
            className="tap mt-3 w-full text-center text-[14px] text-muted"
          >
            Auswahl zurücksetzen
          </button>
        </section>
      </div>
    </>
  );
}

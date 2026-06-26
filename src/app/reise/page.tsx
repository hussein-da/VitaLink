"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Globe, Info, MapPin, X } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import SmartPopover from "@/components/ui/SmartPopover";
import ActionCard from "@/components/ActionCard";
import { angebotMap } from "@/data/angebote";
import { laender } from "@/data/laender";
import {
  berechneImpfstatus,
  impfInfoMap,
  impfungenFuerLand,
  reiseAngebotIds,
  synthetischerAufenthaltsort,
  type ImpfStatus,
  type Lokalisiert,
} from "@/data/reise";

type Lang = "de" | "en";

// Bedientexte der Subseite (lokales Übersetzungsobjekt – es gibt noch kein
// zentrales i18n-System in der App). Inhaltstexte (Impfungen, Länder) kommen
// aus den lokalisierten Datenobjekten über t().
const UI = {
  back: { de: "Zurück", en: "Back" },
  backAria: { de: "Zurück zur vorherigen Ansicht", en: "Back to previous view" },
  title: { de: "Reiseimpfungen", en: "Travel Vaccinations" },
  subtitle: {
    de: "Wähle dein Reiseziel und sieh, welche Impfungen empfohlen werden.",
    en: "Choose your travel destination and see which vaccinations are recommended.",
  },
  disclaimer: {
    de: "Alle Impfempfehlungen auf dieser Seite sind synthetische Beispieldaten und stellen keine medizinische Beratung dar. VitaLink ist kein Medizinprodukt. Bitte wende dich für persönliche Impfempfehlungen an deine Hausarztpraxis oder eine reisemedizinische Beratungsstelle.",
    en: "All vaccination recommendations on this page are synthetic example data and do not constitute medical advice. VitaLink is not a medical device. Please consult your GP or a travel medicine clinic for personal vaccination advice.",
  },
  standortLabel: {
    de: "Dein aktueller Aufenthaltsort (Beispielwert): ",
    en: "Your current location (example value): ",
  },
  standortHint: {
    de: "In einem realen System würde dieser Wert mit deiner Einwilligung aus einer Gerätequelle stammen.",
    en: "In a real system, this value would come from a device source with your consent.",
  },
  standortFehlend: {
    de: "Für deinen aktuellen Aufenthaltsort fehlen in deiner ePA diese Impfungen: ",
    en: "The following vaccinations are missing from your ePA for your current location: ",
  },
  zielLabel: { de: "Reiseziel wählen", en: "Choose destination" },
  zielPlaceholder: { de: "Land auswählen…", en: "Select country…" },
  emptyState: {
    de: "Wähle ein Reiseziel, um die empfohlenen Impfungen zu sehen.",
    en: "Choose a destination to see recommended vaccinations.",
  },
  listeTitel: { de: "Empfohlene Impfungen", en: "Recommended vaccinations" },
  fallbackHint: {
    de: "Für dieses Land ist keine detaillierte Beispielzuordnung hinterlegt. Angezeigt wird eine Basis-Impfliste.",
    en: "No detailed example assignment is available for this country. A basic vaccination list is shown.",
  },
  listeHint: {
    de: "Diese Zuordnungen sind Beispieldaten und nicht für Reiseentscheidungen geeignet.",
    en: "These assignments are example data and are not suitable for travel decisions.",
  },
  infoAria: { de: "Erklärung anzeigen", en: "Show explanation" },
  statusVorhanden: { de: "Vorhanden", en: "Up to date" },
  statusBald: { de: "Auffrischung empfohlen", en: "Booster recommended" },
  statusKein: { de: "Kein Eintrag – Tippe für Infos", en: "No record – tap for info" },
  handlungPrefix: { de: "Wo bekommst du ", en: "Where can you get " },
  schliessen: { de: "Schließen", en: "Close" },
} satisfies Record<string, Lokalisiert>;

function statusChip(status: ImpfStatus, lang: Lang): { label: string; cls: string } {
  if (status === "vorhanden") {
    return { label: UI.statusVorhanden[lang], cls: "bg-primary-soft text-primary" };
  }
  if (status === "bald_faellig") {
    return { label: UI.statusBald[lang], cls: "bg-accent-soft text-accent-ink" };
  }
  return { label: UI.statusKein[lang], cls: "bg-surface-2 text-muted" };
}

export default function ReisePage() {
  const { language } = useSettings();
  const lang: Lang = language === "en" ? "en" : "de";
  const router = useRouter();
  const t = useCallback((v: Lokalisiert) => v[lang], [lang]);

  // Temporäre Sitzungsauswahl – bewusst nur lokaler State (kein localStorage).
  const [zielCode, setZielCode] = useState<string>("");
  const [offeneHandlung, setOffeneHandlung] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const handlungRef = useRef<HTMLDivElement | null>(null);
  const schliessenRef = useRef<HTMLButtonElement | null>(null);

  const sortierteLaender = useMemo(
    () => [...laender].sort((a, b) => a[lang].localeCompare(b[lang], lang)),
    [lang],
  );

  const standort = synthetischerAufenthaltsort;
  // Fehlende Impfungen am aktuellen Aufenthaltsort (gleiche Status-Logik).
  const standortFehlend = useMemo(
    () =>
      impfungenFuerLand(standort.landCode).impfIds.filter(
        (id) => berechneImpfstatus(id) === "kein_eintrag",
      ),
    [standort.landCode],
  );

  const ziel = zielCode ? impfungenFuerLand(zielCode) : null;

  const schliesseHandlung = useCallback(() => {
    setOffeneHandlung(null);
    // Fokus zurück auf die auslösende Zeile.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const oeffneHandlung = useCallback((impfId: string, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setOffeneHandlung(impfId);
  }, []);

  // Fokus beim Öffnen in die Handlungskarte setzen (auf den Schließen-Button).
  useEffect(() => {
    if (offeneHandlung) {
      requestAnimationFrame(() => schliessenRef.current?.focus());
    }
  }, [offeneHandlung]);

  // Escape schließt; Klick außerhalb von Karte und Auslöser schließt ebenfalls.
  useEffect(() => {
    if (!offeneHandlung) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") schliesseHandlung();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        handlungRef.current &&
        !handlungRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        schliesseHandlung();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [offeneHandlung, schliesseHandlung]);

  return (
    <div className="pb-8">
      {/* A) Sticky-Header: Zurück + Seitentitel (h1, Fraunces) */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={UI.backAria[lang]}
          className="tap -ml-2 mb-1 inline-flex items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary"
        >
          <ChevronLeft aria-hidden size={18} />
          {UI.back[lang]}
        </button>
        <h1 className="font-display text-2xl font-semibold leading-tight text-ink">
          {UI.title[lang]}
        </h1>
      </header>

      <div className="space-y-6 px-4 py-6">
        {/* A) Untertitel */}
        <p className="text-muted">{UI.subtitle[lang]}</p>

        {/* B) Kein-Medizinprodukt-Hinweis (immer sichtbar, nicht einklappbar, kein Alarmrot) */}
        <section className="flex items-start gap-3 rounded-2xl border border-border bg-surface-2 p-4">
          <Info aria-hidden size={20} className="mt-0.5 shrink-0 text-muted" />
          <p className="text-sm text-ink">{UI.disclaimer[lang]}</p>
        </section>

        {/* C) Synthetischer Aufenthaltsort */}
        <section className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <MapPin aria-hidden size={20} className="mt-0.5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm text-ink">
              {UI.standortLabel[lang]}
              <span className="font-semibold">{t(standort.land)}</span>
            </p>
            <p className="mt-1 text-xs text-muted">{UI.standortHint[lang]}</p>
            {standortFehlend.length > 0 && (
              <p className="mt-2 text-sm text-ink">
                {UI.standortFehlend[lang]}
                <span className="font-medium">
                  {standortFehlend.map((id) => t(impfInfoMap[id].name)).join(", ")}
                </span>
              </p>
            )}
          </div>
        </section>

        {/* D) Zielland-Auswahl (native select für maximale Tastatur-Kompatibilität) */}
        <section>
          <label
            htmlFor="reiseziel"
            className="mb-2 block font-display text-lg font-semibold text-ink"
          >
            {UI.zielLabel[lang]}
          </label>
          <select
            id="reiseziel"
            value={zielCode}
            onChange={(e) => {
              setZielCode(e.target.value);
              setOffeneHandlung(null);
            }}
            className="tap w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink shadow-sm"
          >
            <option value="" disabled>
              {UI.zielPlaceholder[lang]}
            </option>
            {sortierteLaender.map((l) => (
              <option key={l.code} value={l.code}>
                {l[lang]}
              </option>
            ))}
          </select>
        </section>

        {/* E) Impfliste – aktualisiert sich sofort, mit aria-live für Screenreader */}
        <section>
          <div aria-live="polite">
            {!ziel ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-2/40 px-4 py-10 text-center">
                <Globe aria-hidden size={36} className="text-muted" />
                <p className="max-w-xs text-sm text-muted">{UI.emptyState[lang]}</p>
              </div>
            ) : (
              <>
                <h2 className="mb-3 font-display text-lg font-semibold text-ink">
                  {UI.listeTitel[lang]}
                </h2>

                {ziel.fallback && (
                  <p className="mb-3 rounded-xl border border-border bg-surface-2/60 p-3 text-sm text-muted">
                    {UI.fallbackHint[lang]}
                  </p>
                )}

                <ul className="space-y-2">
                  {ziel.impfIds.map((id) => {
                    const info = impfInfoMap[id];
                    if (!info) return null;
                    const status = berechneImpfstatus(id);
                    const chip = statusChip(status, lang);
                    const klickbar = status === "kein_eintrag";
                    const offen = offeneHandlung === id;

                    const nameUndChip = (
                      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium text-ink">{t(info.name)}</span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${chip.cls}`}
                        >
                          {chip.label}
                        </span>
                      </span>
                    );

                    return (
                      <li
                        key={id}
                        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                      >
                        <div className="flex items-stretch">
                          {klickbar ? (
                            <button
                              type="button"
                              onClick={(e) => oeffneHandlung(id, e.currentTarget)}
                              aria-expanded={offen}
                              className="tap flex flex-1 items-center gap-3 px-4 py-3 text-left"
                            >
                              {nameUndChip}
                              <ChevronRight
                                aria-hidden
                                size={18}
                                className="shrink-0 text-muted"
                              />
                            </button>
                          ) : (
                            <div className="tap flex flex-1 items-center gap-3 px-4 py-3">
                              {nameUndChip}
                            </div>
                          )}

                          {/* Info-Tooltip über die zentrale SmartPopover-Komponente */}
                          <SmartPopover
                            anchor={
                              <button
                                type="button"
                                aria-label={`${UI.infoAria[lang]}: ${t(info.name)}`}
                                className="tap flex w-12 shrink-0 items-center justify-center border-l border-border text-muted hover:text-primary"
                              >
                                <Info aria-hidden size={18} />
                              </button>
                            }
                            content={
                              <>
                                <span className="mb-0.5 block font-semibold text-primary">
                                  {t(info.name)}
                                </span>
                                {t(info.erklaerung)}
                              </>
                            }
                            role="tooltip"
                            className="reveal z-30 w-64 max-w-[80vw] rounded-xl border border-border bg-surface p-3 text-sm font-normal leading-relaxed text-ink shadow-xl"
                          />
                        </div>

                        {/* F) Handlungskarte (DF9) für fehlende Impfung */}
                        {offen && (
                          <div
                            ref={handlungRef}
                            className="reveal border-t border-border bg-surface-2/40 p-4"
                          >
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <h3 className="font-display text-base font-semibold text-ink">
                                {UI.handlungPrefix[lang]}
                                {t(info.name)}?
                              </h3>
                              <button
                                ref={schliessenRef}
                                type="button"
                                onClick={schliesseHandlung}
                                aria-label={UI.schliessen[lang]}
                                className="tap -mr-2 -mt-2 flex items-center justify-center rounded-lg text-muted hover:text-ink"
                              >
                                <X aria-hidden size={20} />
                              </button>
                            </div>
                            <div className="space-y-2">
                              {reiseAngebotIds.map((aid) => {
                                const angebot = angebotMap[aid];
                                return angebot ? (
                                  <ActionCard key={aid} angebot={angebot} />
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-3 text-xs text-muted">{UI.listeHint[lang]}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

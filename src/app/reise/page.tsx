"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Globe, Info, MapPin, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useT } from "@/i18n/useT";
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
  back: { de: "VitaLink", en: "VitaLink" },
  backAria: { de: "Zurück zur VitaLink-Seite", en: "Back to VitaLink" },
  title: { de: "Reiseimpfungen", en: "Travel Vaccinations" },
  subtitle: {
    de: "Wähle dein Reiseziel und sieh, welche Impfungen empfohlen werden.",
    en: "Choose your travel destination and see which vaccinations are recommended.",
  },
  werkzeugHinweis: {
    de: "Zum Ausprobieren: Hier kannst du beliebige Reiseziele durchspielen. Verbindlich geplante Reisen erscheinen separat unter Termine.",
    en: "For exploring: try out any destination here. Confirmed trips appear separately under Appointments.",
  },
  warumImpfungen: { de: "Warum diese Impfungen?", en: "Why these vaccinations?" },
  standortLabel: {
    de: "Dein aktueller Aufenthaltsort: ",
    en: "Your current location: ",
  },
  standortHint: {
    de: "Dieser Wert stammt mit deiner Einwilligung aus einer Gerätequelle.",
    en: "This value comes from a device source with your consent.",
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
  infoAria: { de: "Erklärung anzeigen", en: "Show explanation" },
  statusVorhanden: { de: "Vorhanden", en: "Up to date" },
  statusBald: { de: "Auffrischung empfohlen", en: "Booster recommended" },
  statusKein: { de: "Kein Eintrag – Tippe für Infos", en: "No record – tap for info" },
  handlungPrefix: { de: "Wo bekommst du ", en: "Where can you get " },
  schliessen: { de: "Schließen", en: "Close" },
} satisfies Record<string, Lokalisiert>;

function statusChip(status: ImpfStatus, lang: Lang): { label: string; cls: string } {
  if (status === "vorhanden") {
    return { label: UI.statusVorhanden[lang], cls: "bg-status-ok-light text-status-ok" };
  }
  if (status === "bald_faellig") {
    return { label: UI.statusBald[lang], cls: "bg-accent-soft text-accent-ink" };
  }
  return { label: UI.statusKein[lang], cls: "bg-surface-2 text-ink-2" };
}

function ReiseContent() {
  // Lang ist strukturgleich mit Locale; die Aufloesung (inkl. tr/ar -> en) und
  // das Hydrations-Gate liegen jetzt zentral in useT statt lokal in dieser Datei.
  const { locale: lang } = useT();
  const t = useCallback((v: Lokalisiert) => v[lang], [lang]);

  // Kontextsensitives Zurück: kommt der Nutzer aus einem Hinweis (?from=…),
  // führt Zurück dorthin; sonst zur VitaLink-Übersicht (REISE-03).
  const fromId = useSearchParams().get("from");
  const backHref = fromId ? `/hinweis/${fromId}` : "/vitalink";
  const backLabel = fromId ? (lang === "en" ? "Back" : "Zurück") : UI.back[lang];

  // Sitzungsauswahl – vorbelegt mit dem geplanten Reiseziel (Thailand).
  const [zielCode, setZielCode] = useState<string>("TH");
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
      {/* A) Einheitlicher Section-Header (COMP-01/REISE-01): wiederverwendete
          AppHeader-Komponente statt eigener Header-Kopie. */}
      <AppHeader
        back={{ href: backHref, label: backLabel }}
        eyebrow={lang === "en" ? "Travel notice" : "Reisehinweis"}
        title={UI.title[lang]}
      />

      <div className="space-y-6 px-4 py-6">
        {/* A) Untertitel + Werkzeug-Hinweis (REISE-07) */}
        <div className="space-y-2">
          <p className="text-[15px] text-ink">{UI.subtitle[lang]}</p>
          <p className="text-[13px] text-ink-2">{UI.werkzeugHinweis[lang]}</p>
        </div>

        {/* D) Zielland-Auswahl zuerst (REISE-04) — native select für Tastatur-Kompatibilität */}
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
            className="tap w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink shadow-card"
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
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-2/40 px-4 py-12 text-center">
                <Globe aria-hidden size={44} className="text-cat-travel" />
                <p className="max-w-xs text-[15px] text-ink-2">{UI.emptyState[lang]}</p>
              </div>
            ) : (
              <>
                <h2 className="mb-3 font-display text-lg font-semibold text-ink">
                  {UI.listeTitel[lang]}
                </h2>

                {ziel.fallback && (
                  <p className="mb-3 rounded-xl border border-border bg-surface-2/60 p-3 text-[14px] text-ink-2">
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
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${chip.cls}`}
                        >
                          {chip.label}
                        </span>
                      </span>
                    );

                    return (
                      <li
                        key={id}
                        className="overflow-hidden rounded-2xl bg-surface shadow-card"
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
                            className="reveal z-30 w-64 max-w-[80vw] rounded-xl border border-border bg-surface p-3 text-[14px] font-normal leading-relaxed text-ink shadow-xl"
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

                {/* IA-07: Brücke zurück zum erklärenden Reise-Hinweis (geplante Reise) */}
                {zielCode === "TH" && (
                  <Link
                    href="/hinweis/reise-impfung"
                    className="tap mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-cat-travel underline"
                  >
                    {UI.warumImpfungen[lang]}
                  </Link>
                )}
              </>
            )}
          </div>
        </section>

        {/* C) Aktueller Aufenthaltsort — nach der Zielwahl/Impfliste (REISE-04) */}
        <section className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cat-travel-soft">
            <MapPin aria-hidden size={20} className="text-cat-travel" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] text-ink">
              {UI.standortLabel[lang]}
              <span className="font-semibold">{t(standort.land)}</span>
            </p>
            <p className="mt-1 text-[13px] text-ink-2">{UI.standortHint[lang]}</p>
            {standortFehlend.length > 0 && (
              <p className="mt-2 text-[15px] text-ink">
                {UI.standortFehlend[lang]}
                <span className="font-medium">
                  {standortFehlend.map((id) => t(impfInfoMap[id].name)).join(", ")}
                </span>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ReisePage() {
  return (
    <Suspense fallback={<div className="pt-safe px-5 pt-5 text-[15px] text-muted">Lädt …</div>}>
      <ReiseContent />
    </Suspense>
  );
}

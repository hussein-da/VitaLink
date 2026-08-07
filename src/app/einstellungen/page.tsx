"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Type,
  Globe,
  Monitor,
  Sun,
  Moon,
  Heart,
  Activity,
  Footprints,
  HeartPulse,
  FlaskConical,
  Syringe,
  CalendarCheck,
  Droplets,
  Info,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  ShieldOff,
  BookOpen,
  BookText,
  ChevronRight,
} from "lucide-react";
import type { Theme } from "@/context/SettingsContext";
import { useT } from "@/i18n/useT";
import type { DataSourceKey } from "@/lib/types";
import AppHeader from "@/components/AppHeader";
import FontSizeToggle from "@/components/FontSizeToggle";
import DataSourceToggle from "@/components/DataSourceToggle";
import SettingsRow from "@/components/SettingsRow";
import Switch from "@/components/ui/Switch";
import { dataSourcesFuer, dataSourceLabelFuer } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import { useNutzerAbkuerzungen } from "@/lib/abkuerzung";
import { glossarBegriffe } from "@/lib/glossarEintraege";

import type { Language } from "@/context/SettingsContext";

// Vier Sprachen wählbar; DE/EN vollständig, TR/AR teilweise.
const SPRACH_WERT: Record<string, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
};
const SPRACHEN: Language[] = ["de", "en", "tr", "ar"];

// Sprachen, die nur teilweise lokalisiert sind. Der Hinweistext dazu wird
// erst in der Render-Ebene aus dem Wörterbuch gelesen (reagiert auf Wechsel).
const SPRACH_TEILWEISE: Language[] = ["tr", "ar"];

// Reihenfolge und Icons der Anzeigemodus-Optionen. Die Beschriftungen sind
// bewusst NICHT hier, sondern werden im Render aus dem Wörterbuch geholt.
const THEME_OPTIONS: { value: Theme; icon: ReactNode }[] = [
  { value: "light", icon: <Sun aria-hidden size={16} /> },
  { value: "dark", icon: <Moon aria-hidden size={16} /> },
  { value: "system", icon: <Monitor aria-hidden size={16} /> },
];

const SOURCE_ICON: Record<DataSourceKey, ReactNode> = {
  "epa-vitalwerte": <HeartPulse aria-hidden size={17} className="text-cat-cardio" />,
  "epa-labor": <FlaskConical aria-hidden size={17} className="text-cat-cardio" />,
  "epa-impfungen": <Syringe aria-hidden size={17} className="text-cat-cardio" />,
  "epa-vorsorge": <CalendarCheck aria-hidden size={17} className="text-cat-cardio" />,
  "wearable-schlaf": <Moon aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-puls": <Heart aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-hrv": <Activity aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-aktivitaet": <Footprints aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-glukose": <Droplets aria-hidden size={17} className="text-cat-lifestyle" />,
};

function GroupHeader({ children }: { children: ReactNode }) {
  return <h2 className="section-label mb-2 px-1">{children}</h2>;
}

function Group({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-2xl bg-surface shadow-card">{children}</div>;
}

function Divider() {
  return <div aria-hidden className="ml-[60px] h-px bg-border" />;
}

export default function EinstellungenPage() {
  const {
    theme,
    setTheme,
    hydrated,
    disabledSources,
    setSourceEnabled,
    abkuerzungenKompakt,
    setAbkuerzungenKompakt,
    setLanguage,
  } = useSettings();
  const { t, locale, fmt, language: gatedLanguage } = useT();
  const { eintraege } = useNutzerAbkuerzungen();
  const [sprachBlattOffen, setSprachBlattOffen] = useState(false);
  // Nur der Schlüssel wird gemerkt; die Beschriftung wird beim Rendern in der
  // aktiven Sprache aufgelöst, damit auch das offene Sheet umschaltet.
  const [pendingDisable, setPendingDisable] = useState<DataSourceKey | null>(null);

  const quellen = dataSourcesFuer(locale);
  const epaSources = quellen.filter((d) => d.gruppe === "ePA");
  const wearableSources = quellen.filter((d) => d.gruppe === "Wearable");
  const deaktiviert = quellen.filter((d) => disabledSources.includes(d.key));

  return (
    <>
      <div className="pb-6">
        <AppHeader
          title={t.settings.title}
          back={{ href: "/profil", label: t.settings.backToProfile }}
        />

        <div className="space-y-7 px-4 py-5">
          {/* ── BLOCK A: DARSTELLUNG & BEDIENUNG ── */}
          <section>
            <GroupHeader>{t.settings.blockAppearanceTitle}</GroupHeader>
            <Group>
              <SettingsRow
                icon={<Globe aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label={t.settings.languageLabel}
                right={
                  <span className="text-[14px] text-muted">
                    {SPRACH_WERT[gatedLanguage] ?? SPRACH_WERT.de}
                  </span>
                }
                onClick={() => setSprachBlattOffen(true)}
              />
              <Divider />
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-cat-lifestyle-light">
                    <Sun aria-hidden size={17} className="text-cat-lifestyle" />
                  </span>
                  <span className="text-[15px] font-semibold text-ink">
                    {t.settings.appearanceTitle}
                  </span>
                </div>
                <div
                  role="group"
                  aria-label={t.settings.appearanceGroupAria}
                  className="flex gap-1 rounded-xl bg-surface-2 p-1"
                >
                  {THEME_OPTIONS.map(({ value, icon }) => {
                    const active = theme === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-pressed={active}
                        className={`tap flex flex-1 items-center justify-center gap-1.5 rounded-[11px] px-2 py-2 text-sm font-medium transition-colors ${
                          active ? "bg-cat-lifestyle text-cat-lifestyle-on shadow-sm" : "text-muted"
                        }`}
                      >
                        {icon}
                        {t.settings.themeOption[value]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Divider />
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-surface-2">
                    <Type aria-hidden size={17} className="text-muted" />
                  </span>
                  <span className="text-[15px] font-semibold text-ink">
                    {t.settings.textSizeTitle}
                  </span>
                </div>
                <FontSizeToggle />
              </div>
              <Divider />
              {/* Fachbegriffe ausschreiben (Glossar-Toggle, Badge 2.3) */}
              <div className="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-cat-travel-light">
                  <BookOpen aria-hidden size={17} className="text-cat-travel" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-ink">
                    {t.settings.spellOutTermsTitle}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">{t.settings.spellOutTermsExample}</p>
                </div>
                <Switch
                  checked={!abkuerzungenKompakt}
                  onChange={(v) => setAbkuerzungenKompakt(!v)}
                  label={t.settings.spellOutTermsSwitchAria}
                />
              </div>
            </Group>
          </section>

          {/* ── BLOCK B: EXPORT & BERICHTE ── */}
          <section>
            <GroupHeader>{t.settings.blockExportTitle}</GroupHeader>
            <div className="rounded-2xl bg-surface p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-cat-prevention-light">
                  <FileText aria-hidden size={18} className="text-cat-prevention" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{t.settings.reportTitle}</p>
                  <p className="mt-1 text-[13px] leading-[1.5] text-muted">{t.settings.reportText}</p>
                </div>
              </div>
              <Link
                href="/export"
                className="tap mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-cat-prevention px-4 py-3 text-[15px] font-semibold text-cat-prevention-on"
              >
                <Download aria-hidden size={16} />
                {t.settings.reportCta}
              </Link>
            </div>
          </section>

          {/* ── BLOCK C: DATEN & FREIGABEN ── */}
          <section>
            <GroupHeader>{t.settings.blockDataTitle}</GroupHeader>
            <p className="mb-2.5 px-1 text-[13px] leading-[1.5] text-muted">
              {t.settings.dataIntro}
            </p>

            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-2">
              {t.settings.dataGroupEpa}
            </p>
            <Group>
              {epaSources.map((d, i) => (
                <div key={d.key}>
                  {i > 0 && <Divider />}
                  <DataSourceToggle
                    sourceKey={d.key}
                    label={d.label}
                    beschreibung={d.beschreibung}
                    icon={SOURCE_ICON[d.key]}
                    iconBg="bg-cat-cardio-light"
                    onRequestDisable={(key) => setPendingDisable(key)}
                  />
                </div>
              ))}
            </Group>

            <p className="mb-2 mt-4 px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-2">
              {t.settings.dataGroupWearable}
            </p>
            <Group>
              {wearableSources.map((d, i) => (
                <div key={d.key}>
                  {i > 0 && <Divider />}
                  <DataSourceToggle
                    sourceKey={d.key}
                    label={d.label}
                    beschreibung={d.beschreibung}
                    icon={SOURCE_ICON[d.key]}
                    iconBg="bg-cat-lifestyle-light"
                    onRequestDisable={(key) => setPendingDisable(key)}
                  />
                </div>
              ))}
            </Group>
          </section>

          {/* ── BLOCK D: DEINE DATENSCHUTZ-ENTSCHEIDUNGEN (reaktiv) ── */}
          <section>
            <GroupHeader>{t.settings.blockDecisionsTitle}</GroupHeader>
            <p className="mb-2.5 px-1 text-[13px] leading-[1.5] text-muted">
              {t.settings.decisionsIntro}
            </p>
            <Group>
              {!hydrated ? (
                <p className="px-4 py-4 text-[14px] text-ink-2">{t.settings.loading}</p>
              ) : deaktiviert.length === 0 ? (
                <div className="flex items-start gap-3 px-4 py-4">
                  <CheckCircle aria-hidden size={16} className="mt-0.5 shrink-0 text-status-ok" />
                  <div>
                    <p className="text-[14px] text-ink">{t.settings.allSourcesEnabled}</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {t.settings.allSourcesEnabledHint}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {deaktiviert.map((d, i) => (
                    <div key={d.key}>
                      {i > 0 && <Divider />}
                      <div className="flex items-start gap-3 px-4 py-3">
                        <XCircle aria-hidden size={16} className="mt-0.5 shrink-0 text-status-warn" />
                        <div>
                          <p className="text-[14px] font-semibold text-ink">{d.label}</p>
                          <p className="mt-0.5 text-[12px] text-muted">
                            {t.settings.disabledSourceHint}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 pb-3 pt-1">
                    <button
                      type="button"
                      onClick={() => deaktiviert.forEach((d) => setSourceEnabled(d.key, true))}
                      className="tap text-[14px] font-semibold text-cat-lifestyle"
                    >
                      {t.settings.reenableAll}
                    </button>
                  </div>
                </>
              )}
            </Group>
          </section>

          {/* ── BLOCK E: INFORMATIONEN & HILFE ── */}
          <section>
            <GroupHeader>{t.settings.blockInfoTitle}</GroupHeader>
            <Group>
              <SettingsRow
                icon={<Info aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label={t.settings.aboutRow}
                href="/ueber"
              />
            </Group>
          </section>

          {/* ── BLOCK F: ABKÜRZUNGSVERZEICHNIS ── */}
          <section>
            <GroupHeader>{t.settings.blockGlossaryTitle}</GroupHeader>
            <Group>
              <Link
                href="/glossar"
                className="tap flex min-h-[52px] w-full items-center gap-3 px-4 py-2.5 text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-cat-travel-light">
                  <BookText aria-hidden size={17} className="text-cat-travel" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-ink">{t.settings.glossaryRowTitle}</p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {t.settings.glossaryCountLine(
                      fmt.plural(glossarBegriffe.length + eintraege.length, t.settings.glossaryEntries),
                      fmt.plural(eintraege.length, t.settings.glossaryOwnEntries),
                    )}
                  </p>
                </div>
                <ChevronRight aria-hidden size={16} className="text-muted" />
              </Link>
            </Group>
          </section>
        </div>
      </div>


      {/* ── Sprach-Bottom-Sheet ── */}
      {sprachBlattOffen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSprachBlattOffen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label={t.settings.languageSheetAria}
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame overflow-hidden rounded-t-[28px] bg-surface pb-safe"
            style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
          >
            <div className="mx-auto mb-5 mt-3 h-[2px] w-9 rounded-full bg-border-strong" />
            <p className="mb-2 px-5 text-[16px] font-semibold text-ink">
              {t.settings.languageSheetTitle}
            </p>
            {SPRACHEN.map((code, i, arr) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLanguage(code);
                  setSprachBlattOffen(false);
                }}
                className={`flex min-h-[54px] w-full items-center gap-[14px] px-5 text-left transition-colors hover:bg-surface-2/40 ${
                  i < arr.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="flex-1">
                  <span className="block text-[16px] text-ink">{SPRACH_WERT[code]}</span>
                  {SPRACH_TEILWEISE.includes(code) && (
                    <span className="block text-[12px] text-muted">
                      {t.settings.languagePartial}
                    </span>
                  )}
                </span>
                {gatedLanguage === code && (
                  <CheckCircle aria-hidden size={20} className="text-cat-lifestyle" />
                )}
              </button>
            ))}
            <div className="h-4" />
          </div>
        </>
      )}

      {/* ── Bestätigungs-Bottom-Sheet beim Deaktivieren ── */}
      {pendingDisable && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setPendingDisable(null)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label={t.settings.disableSheetAria}
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame overflow-hidden rounded-t-[28px] bg-surface px-5 pb-safe pt-3 text-center"
            style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
          >
            <div className="mx-auto mb-5 h-[2px] w-9 rounded-full bg-border-strong" />
            <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-status-warn-light">
              <ShieldOff aria-hidden size={20} className="text-status-warn" />
            </span>
            <p className="text-[16px] font-semibold text-ink">{t.settings.disableSheetTitle}</p>
            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-[1.5] text-muted">
              {t.settings.disableSheetText(dataSourceLabelFuer(pendingDisable, locale))}
            </p>
            <div className="mt-5 flex flex-col gap-2.5 pb-4">
              <button
                type="button"
                onClick={() => {
                  setSourceEnabled(pendingDisable, false);
                  setPendingDisable(null);
                }}
                className="tap w-full rounded-xl bg-status-warn px-4 py-3.5 text-[15px] font-semibold text-white"
              >
                {t.settings.disableConfirm}
              </button>
              <button
                type="button"
                onClick={() => setPendingDisable(null)}
                className="tap w-full rounded-xl bg-surface-2 px-4 py-3.5 text-[15px] font-semibold text-ink"
              >
                {t.settings.cancel}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

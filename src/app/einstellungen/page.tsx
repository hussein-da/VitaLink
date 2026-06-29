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
import type { DataSourceKey } from "@/lib/types";
import AppHeader from "@/components/AppHeader";
import FontSizeToggle from "@/components/FontSizeToggle";
import DataSourceToggle from "@/components/DataSourceToggle";
import SettingsRow from "@/components/SettingsRow";
import Switch from "@/components/ui/Switch";
import GlossarSheet from "@/components/GlossarSheet";
import { dataSources } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import { useNutzerAbkuerzungen } from "@/lib/abkuerzung";
import { vordefinierteAbkuerzungen } from "@/data/abkuerzungen";

type Sprache = "de" | "en" | "tr" | "ar";

const SPRACH_WERT: Record<Sprache, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
};

const THEME_OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: "light", label: "Hell", icon: <Sun aria-hidden size={16} /> },
  { value: "dark", label: "Dunkel", icon: <Moon aria-hidden size={16} /> },
  { value: "system", label: "System", icon: <Monitor aria-hidden size={16} /> },
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
  return <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">{children}</div>;
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
  } = useSettings();
  const { eintraege } = useNutzerAbkuerzungen();
  const [sprache, setSprache] = useState<Sprache>("de");
  const [sprachBlattOffen, setSprachBlattOffen] = useState(false);
  const [glossarOffen, setGlossarOffen] = useState(false);
  const [pendingDisable, setPendingDisable] = useState<{ key: DataSourceKey; label: string } | null>(
    null,
  );

  const epaSources = dataSources.filter((d) => d.gruppe === "ePA");
  const wearableSources = dataSources.filter((d) => d.gruppe === "Wearable");
  const deaktiviert = dataSources.filter((d) => disabledSources.includes(d.key));

  return (
    <>
      <div className="pb-6">
        <AppHeader title="Einstellungen" back={{ href: "/profil", label: "Profil" }} />

        <div className="space-y-7 px-4 py-5">
          {/* ── BLOCK A: DARSTELLUNG & BEDIENUNG ── */}
          <section>
            <GroupHeader>Darstellung &amp; Bedienung</GroupHeader>
            <Group>
              <SettingsRow
                icon={<Globe aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label="Sprache"
                right={<span className="text-[14px] text-muted">{SPRACH_WERT[sprache]}</span>}
                onClick={() => setSprachBlattOffen(true)}
              />
              <Divider />
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-cat-lifestyle-light">
                    <Sun aria-hidden size={17} className="text-cat-lifestyle" />
                  </span>
                  <span className="text-[15px] font-semibold text-ink">Anzeigemodus</span>
                </div>
                <div role="group" aria-label="Anzeigemodus" className="flex gap-1 rounded-xl bg-surface-2 p-1">
                  {THEME_OPTIONS.map(({ value, label, icon }) => {
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
                        {label}
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
                  <span className="text-[15px] font-semibold text-ink">Schriftgröße</span>
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
                  <p className="text-[15px] font-semibold text-ink">Fachbegriffe ausschreiben</p>
                  <p className="mt-0.5 text-[12px] text-muted">HRV → Herzratenvariabilität</p>
                </div>
                <Switch
                  checked={!abkuerzungenKompakt}
                  onChange={(v) => setAbkuerzungenKompakt(!v)}
                  label="Fachbegriffe ausschreiben"
                />
              </div>
            </Group>
          </section>

          {/* ── BLOCK B: EXPORT & BERICHTE ── */}
          <section>
            <GroupHeader>Export &amp; Berichte</GroupHeader>
            <div className="rounded-2xl bg-surface p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-cat-prevention-light">
                  <FileText aria-hidden size={18} className="text-cat-prevention" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">Arztbericht erstellen</p>
                  <p className="mt-1 text-[13px] leading-[1.5] text-muted">
                    Erstelle eine verständliche Zusammenfassung deiner Gesundheitsdaten für dein
                    nächstes Arztgespräch.
                  </p>
                </div>
              </div>
              <Link
                href="/export"
                className="tap mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-cat-prevention px-4 py-3 text-[15px] font-semibold text-cat-prevention-on"
              >
                <Download aria-hidden size={16} />
                Bericht vorbereiten
              </Link>
            </div>
          </section>

          {/* ── BLOCK C: DATEN & FREIGABEN ── */}
          <section>
            <GroupHeader>Daten &amp; Freigaben</GroupHeader>
            <p className="mb-2.5 px-1 text-[13px] leading-[1.5] text-muted">
              Lege fest, welche Daten VitaLink für deine Hinweise nutzen darf. Wenn du eine Quelle
              deaktivierst, entfallen die darauf basierenden Empfehlungen. Du kannst jede Freigabe
              jederzeit ändern.
            </p>

            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-2">
              Datenschutz — ePA
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
                    onRequestDisable={(key, label) => setPendingDisable({ key, label })}
                  />
                </div>
              ))}
            </Group>

            <p className="mb-2 mt-4 px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-2">
              Datenschutz — Wearable
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
                    onRequestDisable={(key, label) => setPendingDisable({ key, label })}
                  />
                </div>
              ))}
            </Group>
          </section>

          {/* ── BLOCK D: DEINE DATENSCHUTZ-ENTSCHEIDUNGEN (reaktiv) ── */}
          <section>
            <GroupHeader>Deine Datenschutz-Entscheidungen</GroupHeader>
            <p className="mb-2.5 px-1 text-[13px] leading-[1.5] text-muted">
              Hier siehst du, welche Datenquellen du freigegeben oder deaktiviert hast. Du kannst
              deine Entscheidung jederzeit unter „Daten &amp; Freigaben" ändern.
            </p>
            <Group>
              {!hydrated ? (
                <p className="px-4 py-4 text-[14px] text-ink-2">Wird geladen …</p>
              ) : deaktiviert.length === 0 ? (
                <div className="flex items-start gap-3 px-4 py-4">
                  <CheckCircle aria-hidden size={16} className="mt-0.5 shrink-0 text-status-ok" />
                  <div>
                    <p className="text-[14px] text-ink">Alle Datenquellen sind aktuell freigegeben.</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      Du kannst Freigaben jederzeit unter „Daten &amp; Freigaben" anpassen.
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
                            Deaktiviert · Empfehlungen auf Basis dieser Quelle werden nicht angezeigt.
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
                      Alle wieder aktivieren
                    </button>
                  </div>
                </>
              )}
            </Group>
          </section>

          {/* ── BLOCK E: INFORMATIONEN & HILFE ── */}
          <section>
            <GroupHeader>Informationen &amp; Hilfe</GroupHeader>
            <Group>
              <SettingsRow
                icon={<Info aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label="Über VitaLink"
                href="/ueber"
              />
            </Group>
          </section>

          {/* ── BLOCK F: ABKÜRZUNGSVERZEICHNIS ── */}
          <section>
            <GroupHeader>Abkürzungsverzeichnis</GroupHeader>
            <Group>
              <button
                type="button"
                onClick={() => setGlossarOffen(true)}
                className="tap flex min-h-[52px] w-full items-center gap-3 px-4 py-2.5 text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-cat-travel-light">
                  <BookText aria-hidden size={17} className="text-cat-travel" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-ink">Abkürzungen nachschlagen</p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {vordefinierteAbkuerzungen.length + eintraege.length} Einträge · {eintraege.length} eigene
                  </p>
                </div>
                <ChevronRight aria-hidden size={16} className="text-muted" />
              </button>
            </Group>
          </section>
        </div>
      </div>

      {glossarOffen && <GlossarSheet onClose={() => setGlossarOffen(false)} />}

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
            aria-label="Sprache wählen"
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame overflow-hidden rounded-t-[28px] bg-surface pb-safe"
            style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
          >
            <div className="mx-auto mb-5 mt-3 h-[2px] w-9 rounded-full bg-border-strong" />
            <p className="mb-2 px-5 text-[16px] font-semibold text-ink">Sprache wählen</p>
            {(Object.keys(SPRACH_WERT) as Sprache[]).map((code, i, arr) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setSprache(code);
                  setSprachBlattOffen(false);
                }}
                className={`flex min-h-[54px] w-full items-center gap-[14px] px-5 text-left transition-colors hover:bg-surface-2/40 ${
                  i < arr.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="flex-1 text-[16px] text-ink">{SPRACH_WERT[code]}</span>
                {sprache === code && (
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
            aria-label="Datenquelle deaktivieren?"
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame overflow-hidden rounded-t-[28px] bg-surface px-5 pb-safe pt-3 text-center"
            style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
          >
            <div className="mx-auto mb-5 h-[2px] w-9 rounded-full bg-border-strong" />
            <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-status-warn-light">
              <ShieldOff aria-hidden size={20} className="text-status-warn" />
            </span>
            <p className="text-[16px] font-semibold text-ink">Datenquelle deaktivieren?</p>
            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-[1.5] text-muted">
              „{pendingDisable.label}": Die darauf basierenden Empfehlungen werden dann nicht mehr
              angezeigt.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 pb-4">
              <button
                type="button"
                onClick={() => {
                  setSourceEnabled(pendingDisable.key, false);
                  setPendingDisable(null);
                }}
                className="tap w-full rounded-xl bg-status-warn px-4 py-3.5 text-[15px] font-semibold text-white"
              >
                Trotzdem deaktivieren
              </button>
              <button
                type="button"
                onClick={() => setPendingDisable(null)}
                className="tap w-full rounded-xl bg-surface-2 px-4 py-3.5 text-[15px] font-semibold text-ink"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

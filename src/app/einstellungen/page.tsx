"use client";

import type { ReactNode } from "react";
import { Trash2, Database, Watch, Type, MessageSquareX, Globe, Monitor, Sun, Moon } from "lucide-react";
import type { Theme } from "@/context/SettingsContext";
import AppHeader from "@/components/AppHeader";
import FontSizeToggle from "@/components/FontSizeToggle";
import DataSourceToggle from "@/components/DataSourceToggle";
import { dataSources } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import { hinweisMap } from "@/data/hinweise";
import { objectionReasonLabel } from "@/lib/objections";

const THEME_OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: "light", label: "Hell", icon: <Sun aria-hidden size={16} /> },
  { value: "dark", label: "Dunkel", icon: <Moon aria-hidden size={16} /> },
  { value: "system", label: "System", icon: <Monitor aria-hidden size={16} /> },
];

export default function EinstellungenPage() {
  const { objections, removeObjection, hydrated, theme, setTheme } = useSettings();
  const epaSources = dataSources.filter((d) => d.gruppe === "ePA");
  const wearableSources = dataSources.filter((d) => d.gruppe === "Wearable");

  return (
    <div>
      <AppHeader title="Einstellungen" back={{ href: "/dashboard", label: "Zu den Hinweisen" }} />

      <div className="space-y-6 px-4 py-5">
        {/* Sprache – Platzhalter (folgt in Phase 2) */}
        <section className="rounded-2xl border border-border bg-surface p-4 opacity-50">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <Globe aria-hidden size={20} className="text-primary" /> Sprache
            </h2>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
              Demnächst
            </span>
          </div>
          <p className="mb-3 mt-1 text-sm text-muted">
            Wähle die App-Sprache: Deutsch oder Englisch.
          </p>
          <div className="flex gap-2">
            {["Deutsch", "Englisch"].map((lang) => (
              <span
                key={lang}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted cursor-default"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>

        {/* Anzeigemodus */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Monitor aria-hidden size={20} className="text-primary" /> Anzeigemodus
          </h2>
          <p className="mb-3 mt-1 text-sm text-muted">
            Hell, Dunkel oder Systemvorgabe des Geräts.
          </p>
          <div role="group" aria-label="Anzeigemodus wählen" className="flex gap-2">
            {THEME_OPTIONS.map(({ value, label, icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={active}
                  className={[
                    "tap flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-surface-2 text-muted hover:text-ink",
                  ].join(" ")}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* DF7 - Schriftgröße */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Type aria-hidden size={20} className="text-primary" /> Schriftgröße
          </h2>
          <p className="mb-3 mt-1 text-sm text-muted">
            Größere Schrift wirkt sofort auf die ganze App.
          </p>
          <FontSizeToggle />
        </section>

        {/* DF11 - Datenkontrolle ePA */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Database aria-hidden size={20} className="text-primary" /> ePA-Daten
          </h2>
          <p className="mb-2 mt-1 text-sm text-muted">
            Pro Kategorie einzeln steuerbar. Abgeschaltete Quellen werden app-weit nicht genutzt.
          </p>
          <div className="divide-y divide-border">
            {epaSources.map((d) => (
              <DataSourceToggle
                key={d.key}
                sourceKey={d.key}
                label={d.label}
                beschreibung={d.beschreibung}
              />
            ))}
          </div>
        </section>

        {/* DF11 - Datenkontrolle Wearable */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Watch aria-hidden size={20} className="text-primary" /> Wearable-Daten
          </h2>
          <p className="mb-2 mt-1 text-sm text-muted">
            Jeder Stream einzeln steuerbar.
          </p>
          <div className="divide-y divide-border">
            {wearableSources.map((d) => (
              <DataSourceToggle
                key={d.key}
                sourceKey={d.key}
                label={d.label}
                beschreibung={d.beschreibung}
              />
            ))}
          </div>
        </section>

        {/* DF12 - Widersprüche-Übersicht */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <MessageSquareX aria-hidden size={20} className="text-primary" /> Deine Widersprüche
          </h2>
          {!hydrated ? (
            <p className="mt-1 text-sm text-muted">Wird geladen ...</p>
          ) : objections.length === 0 ? (
            <p className="mt-1 text-sm text-muted">
              Du hast bisher keinem Hinweis widersprochen.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {objections.map((o) => {
                const titel = hinweisMap[o.hinweisId]?.titel ?? o.hinweisId;
                return (
                  <li
                    key={o.hinweisId}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-ink">{titel}</p>
                      <p className="text-sm text-muted">
                        Grund: {objectionReasonLabel[o.reason]}
                        {o.freitext ? ` - "${o.freitext}"` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeObjection(o.hinweisId)}
                      aria-label={`Widerspruch zu "${titel}" löschen`}
                      className="tap flex shrink-0 items-center justify-center rounded-lg border border-border text-muted hover:text-ink"
                    >
                      <Trash2 aria-hidden size={18} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

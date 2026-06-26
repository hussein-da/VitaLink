"use client";

import type { ReactNode } from "react";
import { Trash2, Type, Globe, Monitor, Sun, Moon } from "lucide-react";
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

/** Gruppenkopf im iOS-Settings-Stil (§4c). */
function GroupHeader({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
      {children}
    </h2>
  );
}

/** Abgerundete Gruppenkarte mit eingerückten Trennlinien (§4a). */
function Group({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {children}
    </div>
  );
}

export default function EinstellungenPage() {
  const { objections, removeObjection, hydrated, theme, setTheme } = useSettings();
  const epaSources = dataSources.filter((d) => d.gruppe === "ePA");
  const wearableSources = dataSources.filter((d) => d.gruppe === "Wearable");

  return (
    <div className="pb-6">
      <AppHeader title="Einstellungen" back={{ href: "/dashboard", label: "Zurück" }} />

      <div className="space-y-7 px-4 py-5">
        {/* SPRACHE – Platzhalter (folgt in Phase 2) */}
        <section>
          <GroupHeader>Sprache</GroupHeader>
          <Group>
            <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 opacity-60">
              <span className="flex items-center gap-3 text-ink">
                <Globe aria-hidden size={22} className="text-primary" />
                <span className="font-medium">App-Sprache</span>
              </span>
              <span className="flex items-center gap-2 text-sm text-muted">
                Deutsch
                <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                  Demnächst
                </span>
              </span>
            </div>
          </Group>
        </section>

        {/* DARSTELLUNG */}
        <section>
          <GroupHeader>Darstellung</GroupHeader>
          <Group>
            {/* Anzeigemodus */}
            <div className="px-4 py-3.5">
              <div className="mb-2.5 flex items-center gap-3">
                <Monitor aria-hidden size={22} className="text-primary" />
                <span className="font-medium text-ink">Anzeigemodus</span>
              </div>
              <div role="group" aria-label="Anzeigemodus wählen" className="flex gap-1 rounded-xl bg-surface-2 p-1">
                {THEME_OPTIONS.map(({ value, label, icon }) => {
                  const active = theme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      aria-pressed={active}
                      className={[
                        "tap flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                        active ? "bg-primary text-primary-ink shadow-sm" : "text-muted hover:text-ink",
                      ].join(" ")}
                    >
                      {icon}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schriftgröße */}
            <div className="border-t border-border px-4 py-3.5">
              <div className="mb-2.5 flex items-center gap-3">
                <Type aria-hidden size={22} className="text-primary" />
                <span className="font-medium text-ink">Schriftgröße</span>
              </div>
              <FontSizeToggle />
            </div>
          </Group>
        </section>

        {/* DATENQUELLEN – ePA (DF11) */}
        <section>
          <GroupHeader>Datenquellen – ePA</GroupHeader>
          <p className="mb-2 px-1 text-sm text-muted">
            Pro Kategorie steuerbar. Abgeschaltete Quellen werden app-weit nicht genutzt.
          </p>
          <Group>
            {epaSources.map((d, i) => (
              <div key={d.key} className="px-4">
                <div className={i > 0 ? "border-t border-border" : ""}>
                  <DataSourceToggle sourceKey={d.key} label={d.label} beschreibung={d.beschreibung} />
                </div>
              </div>
            ))}
          </Group>
        </section>

        {/* DATENQUELLEN – Wearable (DF11) */}
        <section>
          <GroupHeader>Datenquellen – Wearable</GroupHeader>
          <p className="mb-2 px-1 text-sm text-muted">Jeder Stream einzeln steuerbar.</p>
          <Group>
            {wearableSources.map((d, i) => (
              <div key={d.key} className="px-4">
                <div className={i > 0 ? "border-t border-border" : ""}>
                  <DataSourceToggle sourceKey={d.key} label={d.label} beschreibung={d.beschreibung} />
                </div>
              </div>
            ))}
          </Group>
        </section>

        {/* DEINE WIDERSPRÜCHE (DF12) */}
        <section>
          <GroupHeader>Deine Widersprüche</GroupHeader>
          <Group>
            {!hydrated ? (
              <p className="px-4 py-3 text-sm text-muted">Wird geladen …</p>
            ) : objections.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">
                Du hast bisher keinem Hinweis widersprochen.
              </p>
            ) : (
              objections.map((o, i) => {
                const titel = hinweisMap[o.hinweisId]?.titel ?? o.hinweisId;
                return (
                  <div key={o.hinweisId} className="px-4">
                    <div
                      className={`flex items-start justify-between gap-3 py-3 ${
                        i > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-ink">{titel}</p>
                        <p className="text-sm text-muted">
                          Grund: {objectionReasonLabel[o.reason]}
                          {o.freitext ? ` – „${o.freitext}“` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeObjection(o.hinweisId)}
                        aria-label={`Widerspruch zu „${titel}“ löschen`}
                        className="tap flex shrink-0 items-center justify-center rounded-lg text-muted hover:text-ink"
                      >
                        <Trash2 aria-hidden size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </Group>
        </section>
      </div>
    </div>
  );
}

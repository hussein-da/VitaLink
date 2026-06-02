"use client";

import { Trash2, Database, Watch, Type, MessageSquareX } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import FontSizeToggle from "@/components/FontSizeToggle";
import DataSourceToggle from "@/components/DataSourceToggle";
import { dataSources } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import { hinweisMap } from "@/data/hinweise";
import { objectionReasonLabel } from "@/lib/objections";

export default function EinstellungenPage() {
  const { objections, removeObjection, hydrated } = useSettings();
  const epaSources = dataSources.filter((d) => d.gruppe === "ePA");
  const wearableSources = dataSources.filter((d) => d.gruppe === "Wearable");

  return (
    <div>
      <AppHeader title="Einstellungen" back={{ href: "/dashboard", label: "Zu den Hinweisen" }} />

      <div className="space-y-6 px-4 py-5">
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

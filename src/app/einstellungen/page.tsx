"use client";

import type { ReactNode } from "react";
import {
  Trash2,
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
  Info,
  MessageSquareX,
} from "lucide-react";
import type { Theme } from "@/context/SettingsContext";
import type { DataSourceKey } from "@/lib/types";
import AppHeader from "@/components/AppHeader";
import FontSizeToggle from "@/components/FontSizeToggle";
import DataSourceToggle from "@/components/DataSourceToggle";
import SettingsRow from "@/components/SettingsRow";
import { dataSources } from "@/lib/dataSources";
import { useSettings } from "@/context/SettingsContext";
import { hinweisMap } from "@/data/hinweise";
import { objectionReasonLabel } from "@/lib/objections";

const THEME_OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: "light", label: "Hell", icon: <Sun aria-hidden size={16} /> },
  { value: "dark", label: "Dunkel", icon: <Moon aria-hidden size={16} /> },
  { value: "system", label: "System", icon: <Monitor aria-hidden size={16} /> },
];

// Icon je Datenquelle (Apple-Health-Sprache, §Screen 3).
const SOURCE_ICON: Record<DataSourceKey, ReactNode> = {
  "epa-vitalwerte": <HeartPulse aria-hidden size={17} className="text-cat-cardio" />,
  "epa-labor": <FlaskConical aria-hidden size={17} className="text-cat-cardio" />,
  "epa-impfungen": <Syringe aria-hidden size={17} className="text-cat-cardio" />,
  "wearable-schlaf": <Moon aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-puls": <Heart aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-hrv": <Activity aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-aktivitaet": <Footprints aria-hidden size={17} className="text-cat-lifestyle" />,
};

function GroupHeader({ children }: { children: ReactNode }) {
  return <h2 className="section-label mb-2 px-1">{children}</h2>;
}

function Group({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">{children}</div>;
}

/** Eingerückte Trennlinie (beginnt unter dem Label, nicht unter dem Icon). */
function Divider() {
  return <div aria-hidden className="ml-[60px] h-px bg-border" />;
}

export default function EinstellungenPage() {
  const { objections, removeObjection, hydrated, theme, setTheme } = useSettings();
  const epaSources = dataSources.filter((d) => d.gruppe === "ePA");
  const wearableSources = dataSources.filter((d) => d.gruppe === "Wearable");

  return (
    <div className="pb-6">
      <AppHeader title="Einstellungen" back={{ href: "/dashboard", label: "Zurück" }} />

      <div className="space-y-7 px-4 py-5">
        {/* DARSTELLUNG */}
        <section>
          <GroupHeader>Darstellung</GroupHeader>
          <Group>
            <div className="opacity-60">
              <SettingsRow
                icon={<Globe aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label="Sprache"
                right={
                  <span className="flex items-center gap-2 text-[14px] text-ink-2">
                    Deutsch
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium">
                      Demnächst
                    </span>
                  </span>
                }
              />
            </div>
            <Divider />

            {/* Anzeigemodus */}
            <div className="px-4 py-3">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-cat-lifestyle-light">
                  <Sun aria-hidden size={17} className="text-cat-lifestyle" />
                </span>
                <span className="text-[15px] font-semibold text-ink">Anzeigemodus</span>
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
                        "tap flex flex-1 items-center justify-center gap-1.5 rounded-[11px] px-2 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-cat-lifestyle text-cat-lifestyle-on shadow-sm"
                          : "text-muted hover:text-ink",
                      ].join(" ")}
                    >
                      {icon}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Divider />

            {/* Schriftgröße */}
            <div className="px-4 py-3">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-surface-2">
                  <Type aria-hidden size={17} className="text-muted" />
                </span>
                <span className="text-[15px] font-semibold text-ink">Schriftgröße</span>
              </div>
              <FontSizeToggle />
            </div>
          </Group>
        </section>

        {/* DATENSCHUTZ – ePA (DF11) */}
        <section>
          <GroupHeader>Datenschutz – ePA</GroupHeader>
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
                />
              </div>
            ))}
          </Group>
        </section>

        {/* DATENSCHUTZ – WEARABLE (DF11) */}
        <section>
          <GroupHeader>Datenschutz – Wearable</GroupHeader>
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
                />
              </div>
            ))}
          </Group>
        </section>

        {/* WIDERSPRÜCHE (DF12) */}
        <section>
          <GroupHeader>Deine Widersprüche</GroupHeader>
          <Group>
            {!hydrated ? (
              <p className="px-4 py-4 text-[14px] text-ink-2">Wird geladen …</p>
            ) : objections.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <MessageSquareX aria-hidden size={32} className="text-muted" />
                <p className="text-[15px] text-ink-2">Du hast bisher keinem Hinweis widersprochen.</p>
              </div>
            ) : (
              objections.map((o, i) => {
                const titel = hinweisMap[o.hinweisId]?.titel ?? o.hinweisId;
                return (
                  <div key={o.hinweisId}>
                    {i > 0 && <Divider />}
                    <div className="flex min-h-[54px] items-center gap-3 px-4 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-2">
                        <MessageSquareX aria-hidden size={17} className="text-muted" />
                      </span>
                      <div className="flex-1">
                        <p className="text-[15px] font-semibold text-ink">{titel}</p>
                        <p className="mt-0.5 text-[13px] text-ink-2">
                          {objectionReasonLabel[o.reason]}
                          {o.freitext ? ` · „${o.freitext}“` : ""}
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

        {/* INFORMATIONEN */}
        <section>
          <GroupHeader>Informationen</GroupHeader>
          <Group>
            <SettingsRow
              icon={<Info aria-hidden size={17} className="text-cat-travel" />}
              iconBg="bg-cat-travel-light"
              label="Über VitaLink"
              href="/ueber"
            />
          </Group>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useId, type ReactNode } from "react";
import { useSettings } from "@/context/SettingsContext";
import Switch from "@/components/ui/Switch";
import { useT } from "@/i18n/useT";
import type { DataSourceKey } from "@/lib/types";

/**
 * DF11: ein Schalter PRO Datenquelle (ePA-Kategorie oder Wearable-Stream),
 * als iOS-Listenzeile mit farbigem Icon-Container. Abgeschaltete Quellen
 * werden app-weit als "nicht genutzt" behandelt (Logik unverändert).
 */
export default function DataSourceToggle({
  sourceKey,
  label,
  beschreibung,
  icon,
  iconBg,
  onRequestDisable,
}: {
  sourceKey: DataSourceKey;
  label: string;
  beschreibung: string;
  icon: ReactNode;
  /** Soft-Hintergrund des Icon-Containers, z. B. "bg-cat-cardio-soft". */
  iconBg: string;
  /** Wird beim Abschalten (AN→AUS) statt des direkten Toggles aufgerufen
   *  (für die Bestätigungs-Abfrage). Aktivieren bleibt direkt. */
  onRequestDisable?: (sourceKey: DataSourceKey, label: string) => void;
}) {
  const { isSourceEnabled, toggleSource } = useSettings();
  const { t } = useT();
  const enabled = isSourceEnabled(sourceKey);
  const labelId = useId();
  const descId = useId();

  return (
    <div className="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </span>
      <div className="flex-1">
        <p id={labelId} className="text-[15px] font-semibold text-ink">
          {label}
        </p>
        <p id={descId} className="mt-0.5 text-[13px] text-ink-2">
          {beschreibung}
        </p>
      </div>
      <Switch
        checked={enabled}
        onChange={() => {
          if (enabled && onRequestDisable) onRequestDisable(sourceKey, label);
          else toggleSource(sourceKey);
        }}
        label={t.widgets.dataSource.useSourceSwitchLabel(label)}
        labelledBy={labelId}
        describedBy={descId}
      />
    </div>
  );
}

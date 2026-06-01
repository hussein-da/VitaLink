"use client";

import { useId } from "react";
import { useSettings } from "@/context/SettingsContext";
import Switch from "@/components/ui/Switch";
import type { DataSourceKey } from "@/lib/types";

/**
 * DF11: ein Schalter PRO Datenquelle (ePA-Kategorie oder Wearable-Stream).
 * Abgeschaltete Quellen werden app-weit als "nicht genutzt" behandelt.
 */
export default function DataSourceToggle({
  sourceKey,
  label,
  beschreibung,
}: {
  sourceKey: DataSourceKey;
  label: string;
  beschreibung: string;
}) {
  const { isSourceEnabled, toggleSource } = useSettings();
  const enabled = isSourceEnabled(sourceKey);
  const labelId = useId();
  const descId = useId();

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex-1">
        <p id={labelId} className="font-medium text-ink">
          {label}
        </p>
        <p id={descId} className="text-sm text-muted">
          {beschreibung}
        </p>
        <p className="text-sm text-muted">{enabled ? "Wird genutzt." : "Abgeschaltet."}</p>
      </div>
      <Switch
        checked={enabled}
        onChange={() => toggleSource(sourceKey)}
        label={`${label} verwenden`}
        labelledBy={labelId}
        describedBy={descId}
      />
    </div>
  );
}

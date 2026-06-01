"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DataSourceKey, Objection, ObjectionReason } from "@/lib/types";
import { objectionReasons } from "@/lib/objections";
import { hinweisMap } from "@/data/hinweise";

const validReasons = new Set<ObjectionReason>(objectionReasons.map((r) => r.value));

type FontScale = "normal" | "lg";

const EPA_KEYS: DataSourceKey[] = ["epa-vitalwerte", "epa-labor", "epa-impfungen"];
const WEARABLE_KEYS: DataSourceKey[] = [
  "wearable-schlaf",
  "wearable-puls",
  "wearable-hrv",
  "wearable-aktivitaet",
];

export type SourceGroup = "ePA" | "Wearable";

interface SettingsValue {
  hydrated: boolean;

  // DF7 - Schriftgroesse
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  toggleFontScale: () => void;

  // DF11 - Datenquellen
  disabledSources: DataSourceKey[];
  isSourceEnabled: (key: DataSourceKey) => boolean;
  setSourceEnabled: (key: DataSourceKey, enabled: boolean) => void;
  toggleSource: (key: DataSourceKey) => void;
  isGroupEnabled: (group: SourceGroup) => boolean;
  setGroupEnabled: (group: SourceGroup, enabled: boolean) => void;

  // DF12 - Widersprueche
  objections: Objection[];
  getObjection: (hinweisId: string) => Objection | undefined;
  addObjection: (hinweisId: string, reason: ObjectionReason, freitext?: string) => void;
  removeObjection: (hinweisId: string) => void;
}

const STORAGE_KEY = "vorsicht.settings.v1";

interface PersistShape {
  fontScale: FontScale;
  disabledSources: DataSourceKey[];
  objections: Objection[];
}

const SettingsContext = createContext<SettingsValue | null>(null);

function groupKeys(group: SourceGroup): DataSourceKey[] {
  return group === "ePA" ? EPA_KEYS : WEARABLE_KEYS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [fontScale, setFontScaleState] = useState<FontScale>("normal");
  const [disabledSources, setDisabledSources] = useState<DataSourceKey[]>([]);
  const [objections, setObjections] = useState<Objection[]>([]);

  // Einmalig aus localStorage laden.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistShape>;
        if (parsed.fontScale === "lg" || parsed.fontScale === "normal") {
          setFontScaleState(parsed.fontScale);
        }
        if (Array.isArray(parsed.disabledSources)) {
          setDisabledSources(parsed.disabledSources);
        }
        if (Array.isArray(parsed.objections)) {
          // Nur gueltige Widersprueche uebernehmen: bekannter Hinweis + gueltiger Grund.
          setObjections(
            parsed.objections.filter(
              (o) =>
                o &&
                typeof o.hinweisId === "string" &&
                Boolean(hinweisMap[o.hinweisId]) &&
                validReasons.has(o.reason) &&
                typeof o.createdAt === "string" &&
                (o.freitext === undefined || typeof o.freitext === "string"),
            ),
          );
        }
      }
    } catch {
      // localStorage nicht verfuegbar -> stilles Weiter mit Defaults.
    }
    setHydrated(true);
  }, []);

  // Persistieren, sobald hydratisiert.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistShape = { fontScale, disabledSources, objections };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignorieren
    }
  }, [hydrated, fontScale, disabledSources, objections]);

  // Schriftgroesse als Attribut auf <html> spiegeln (CSS-Variable --font-scale).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-fontscale", fontScale === "lg" ? "lg" : "normal");
  }, [fontScale]);

  const setFontScale = useCallback((s: FontScale) => setFontScaleState(s), []);
  const toggleFontScale = useCallback(
    () => setFontScaleState((s) => (s === "lg" ? "normal" : "lg")),
    [],
  );

  const isSourceEnabled = useCallback(
    (key: DataSourceKey) => !disabledSources.includes(key),
    [disabledSources],
  );

  const setSourceEnabled = useCallback((key: DataSourceKey, enabled: boolean) => {
    setDisabledSources((prev) => {
      const set = new Set(prev);
      if (enabled) set.delete(key);
      else set.add(key);
      return Array.from(set);
    });
  }, []);

  const toggleSource = useCallback((key: DataSourceKey) => {
    setDisabledSources((prev) => {
      const set = new Set(prev);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      return Array.from(set);
    });
  }, []);

  const isGroupEnabled = useCallback(
    (group: SourceGroup) => groupKeys(group).some((k) => !disabledSources.includes(k)),
    [disabledSources],
  );

  const setGroupEnabled = useCallback((group: SourceGroup, enabled: boolean) => {
    const keys = groupKeys(group);
    setDisabledSources((prev) => {
      const set = new Set(prev);
      for (const k of keys) {
        if (enabled) set.delete(k);
        else set.add(k);
      }
      return Array.from(set);
    });
  }, []);

  const getObjection = useCallback(
    (hinweisId: string) => objections.find((o) => o.hinweisId === hinweisId),
    [objections],
  );

  const addObjection = useCallback(
    (hinweisId: string, reason: ObjectionReason, freitext?: string) => {
      const createdAt = new Date().toISOString();
      setObjections((prev) => {
        const ohne = prev.filter((o) => o.hinweisId !== hinweisId);
        return [...ohne, { hinweisId, reason, freitext: freitext?.trim() || undefined, createdAt }];
      });
    },
    [],
  );

  const removeObjection = useCallback((hinweisId: string) => {
    setObjections((prev) => prev.filter((o) => o.hinweisId !== hinweisId));
  }, []);

  const value = useMemo<SettingsValue>(
    () => ({
      hydrated,
      fontScale,
      setFontScale,
      toggleFontScale,
      disabledSources,
      isSourceEnabled,
      setSourceEnabled,
      toggleSource,
      isGroupEnabled,
      setGroupEnabled,
      objections,
      getObjection,
      addObjection,
      removeObjection,
    }),
    [
      hydrated,
      fontScale,
      setFontScale,
      toggleFontScale,
      disabledSources,
      isSourceEnabled,
      setSourceEnabled,
      toggleSource,
      isGroupEnabled,
      setGroupEnabled,
      objections,
      getObjection,
      addObjection,
      removeObjection,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings muss innerhalb von SettingsProvider verwendet werden.");
  }
  return ctx;
}

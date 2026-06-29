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
import { dataSources } from "@/lib/dataSources";

const validReasons = new Set<ObjectionReason>(objectionReasons.map((r) => r.value));

type FontScale = "normal" | "lg";
export type Language = "de" | "en" | "tr" | "ar";
export type Theme = "light" | "dark" | "system";

export type SourceGroup = "ePA" | "Wearable";

// Gruppen-Keys aus der Datenquellen-Registry ableiten (Single Source of Truth,
// SET-03): künftige Quellen werden automatisch erfasst, keine Parallel-Liste.
const EPA_KEYS: DataSourceKey[] = dataSources.filter((d) => d.gruppe === "ePA").map((d) => d.key);
const WEARABLE_KEYS: DataSourceKey[] = dataSources
  .filter((d) => d.gruppe === "Wearable")
  .map((d) => d.key);

interface SettingsValue {
  hydrated: boolean;

  // Sprache (nur Session, nicht persistiert – damit Demo immer fragt)
  language: Language;
  setLanguage: (lang: Language) => void;

  // DF7 - Schriftgroesse
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  toggleFontScale: () => void;

  // Anzeigemodus (Hell / Dunkel / System)
  theme: Theme;
  setTheme: (t: Theme) => void;

  // Fachbegriffe: kompakt (Kürzel) vs. ausgeschrieben (Badge 2.3)
  abkuerzungenKompakt: boolean;
  setAbkuerzungenKompakt: (v: boolean) => void;

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

const STORAGE_KEY = "vitalink.settings.v1";

interface PersistShape {
  fontScale: FontScale;
  theme: Theme;
  disabledSources: DataSourceKey[];
  objections: Objection[];
  abkuerzungenKompakt: boolean;
}

const SettingsContext = createContext<SettingsValue | null>(null);

function groupKeys(group: SourceGroup): DataSourceKey[] {
  return group === "ePA" ? EPA_KEYS : WEARABLE_KEYS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [fontScale, setFontScaleState] = useState<FontScale>("normal");
  const [theme, setThemeState] = useState<Theme>("system");
  const [disabledSources, setDisabledSources] = useState<DataSourceKey[]>([]);
  const [objections, setObjections] = useState<Objection[]>([]);
  const [language, setLanguageState] = useState<Language>("de");
  const [abkuerzungenKompakt, setAbkuerzungenKompaktState] = useState(true);

  // Einmalig aus localStorage laden.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistShape>;
        if (parsed.fontScale === "lg" || parsed.fontScale === "normal") {
          setFontScaleState(parsed.fontScale);
        }
        if (parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system") {
          setThemeState(parsed.theme);
        }
        if (Array.isArray(parsed.disabledSources)) {
          setDisabledSources(parsed.disabledSources);
        }
        if (typeof parsed.abkuerzungenKompakt === "boolean") {
          setAbkuerzungenKompaktState(parsed.abkuerzungenKompakt);
        }
        if (Array.isArray(parsed.objections)) {
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

  // Persistieren, sobald hydratisiert (ohne language – Demo zeigt immer Sprachauswahl).
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistShape = {
        fontScale,
        theme,
        disabledSources,
        objections,
        abkuerzungenKompakt,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignorieren
    }
  }, [hydrated, fontScale, theme, disabledSources, objections, abkuerzungenKompakt]);

  // Schriftgroesse als Attribut auf <html> spiegeln (CSS-Variable --font-scale).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-fontscale", fontScale === "lg" ? "lg" : "normal");
  }, [fontScale]);

  // Anzeigemodus als data-theme auf <html> setzen; bei "system" auf matchMedia hoeren.
  useEffect(() => {
    if (!hydrated) return;
    const applyTheme = (t: Theme) => {
      const isDark =
        t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    };
    applyTheme(theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [hydrated, theme]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const setAbkuerzungenKompakt = useCallback((v: boolean) => setAbkuerzungenKompaktState(v), []);

  const setFontScale = useCallback((s: FontScale) => setFontScaleState(s), []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
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
      language,
      setLanguage,
      fontScale,
      setFontScale,
      toggleFontScale,
      theme,
      setTheme,
      abkuerzungenKompakt,
      setAbkuerzungenKompakt,
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
      language,
      setLanguage,
      fontScale,
      setFontScale,
      toggleFontScale,
      theme,
      setTheme,
      abkuerzungenKompakt,
      setAbkuerzungenKompakt,
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

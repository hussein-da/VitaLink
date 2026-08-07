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
import { alleSmartTippIds } from "@/data/smartTipps";
import { dataSources } from "@/lib/dataSources";
import { resolveLocale, type Language } from "@/i18n/types";

const validReasons = new Set<ObjectionReason>(objectionReasons.map((r) => r.value));

// Gültige Rückmeldungs-Ziele: konkrete Empfehlungen (SmartTipp-IDs) sowie –
// für Altdaten/Abwärtskompatibilität – Hinweis-IDs.
const gueltigeRueckmeldungIds = new Set<string>([
  ...Object.keys(hinweisMap),
  ...alleSmartTippIds,
]);

type FontScale = "normal" | "lg";
// Language ist nach @/i18n/types gewandert (einzige Definition) und wird hier
// abwaertskompatibel re-exportiert - bestehende Importe aus diesem Modul bleiben gueltig.
export type { Language };
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

  // Sprache: app-weit wirksam und in vitalink.settings.v1 persistiert.
  // Sie ueberlebt Navigation, Reload und Browser-Neustart. Der Sprachauswahl-
  // Screen im Onboarding bleibt Teil des Ablaufs (Demo), setzt aber nur noch
  // den gespeicherten Wert und zeigt ihn als aktiv an.
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

  // Profil-Avatar (Mock-Emoji; "" = Initiale, Badge 2.7)
  avatar: string;
  setAvatar: (v: string) => void;

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

  // Rückmeldung je Empfehlung: "gemerkt" (Like) und "ausgeblendet" (Dismiss).
  // Like und Widerspruch schließen sich gegenseitig aus.
  likes: string[];
  isLiked: (hinweisId: string) => boolean;
  toggleLike: (hinweisId: string) => void;
  dismissed: string[];
  isDismissed: (hinweisId: string) => boolean;
  dismiss: (hinweisId: string) => void;
  restore: (hinweisId: string) => void;
}

const STORAGE_KEY = "vitalink.settings.v1";

/**
 * Liest die roh gespeicherte Sprachwahl synchron aus dem localStorage.
 *
 * ACHTUNG - ZWILLINGSLOGIK: Dieselbe Validierung existiert ein zweites Mal,
 * wortgleich, als Inline-Skript in src/app/layout.tsx (themeInitScript). Das
 * Skript kann kein Modul importieren, weil es vor dem ersten Paint synchron im
 * <head> laufen muss. Laufen beide Fassungen auseinander, entsteht genau das
 * Sprachflackern, das sie verhindern sollen. Jede Aenderung hier MUSS in
 * layout.tsx nachgezogen werden und umgekehrt.
 *
 * Gelesen wird bewusst die ROHE Nutzerwahl aus allen vier Optionen, nicht die
 * aufgeloeste Locale: Wer Tuerkisch gewaehlt hat, soll nach dem Reload weiter
 * Tuerkisch als aktiv sehen (der Inhalt rendert englisch, siehe resolveLocale).
 */
function readStoredLanguage(): Language | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistShape>;
    if (
      parsed.language === "de" ||
      parsed.language === "en" ||
      parsed.language === "tr" ||
      parsed.language === "ar"
    ) {
      return parsed.language;
    }
  } catch {
    // localStorage nicht verfuegbar oder unlesbar -> stiller Fallback.
  }
  return null;
}

interface PersistShape {
  fontScale: FontScale;
  theme: Theme;
  disabledSources: DataSourceKey[];
  objections: Objection[];
  likes: string[];
  dismissed: string[];
  abkuerzungenKompakt: boolean;
  avatar: string;
  language: Language;
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
  const [likes, setLikes] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  // Sprache SYNCHRON im Initializer lesen, nicht erst im Effekt: Sie ist der
  // einzige Wert, der den ersten Render inhaltlich veraendert. Wuerde sie erst
  // nachtraeglich gesetzt, rendert React zuerst Deutsch und tauscht danach aus -
  // das Flackern waere nur verlagert, nicht behoben. Alle uebrigen Einstellungen
  // bleiben bewusst bei der Lade-Mechanik im Effekt weiter unten.
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "de"; // SSR/SSG
    return readStoredLanguage() ?? "de";
  });
  const [abkuerzungenKompakt, setAbkuerzungenKompaktState] = useState(true);
  const [avatar, setAvatarState] = useState("");

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
        if (typeof parsed.avatar === "string") {
          setAvatarState(parsed.avatar);
        }
        // language wird hier bewusst NICHT gelesen: Sie ist bereits synchron im
        // useState-Initializer gesetzt (readStoredLanguage), damit der erste
        // Render die richtige Sprache trifft. Ein zweites Lesen waere ein No-op
        // und wuerde eine zweite Validierungsstelle schaffen.
        if (Array.isArray(parsed.objections)) {
          setObjections(
            parsed.objections.filter(
              (o) =>
                o &&
                typeof o.hinweisId === "string" &&
                gueltigeRueckmeldungIds.has(o.hinweisId) &&
                validReasons.has(o.reason) &&
                typeof o.createdAt === "string" &&
                (o.freitext === undefined || typeof o.freitext === "string"),
            ),
          );
        }
        if (Array.isArray(parsed.likes)) {
          setLikes(
            parsed.likes.filter((id) => typeof id === "string" && gueltigeRueckmeldungIds.has(id)),
          );
        }
        if (Array.isArray(parsed.dismissed)) {
          setDismissed(
            parsed.dismissed.filter(
              (id) => typeof id === "string" && gueltigeRueckmeldungIds.has(id),
            ),
          );
        }
      }
    } catch {
      // localStorage nicht verfuegbar -> stilles Weiter mit Defaults.
    }
    setHydrated(true);
  }, []);

  // Persistieren, sobald hydratisiert - einschliesslich language: Die Sprachwahl
  // ueberlebt Navigation, Reload und Browser-Neustart (ein einziger Storage-
  // Schluessel, kein Cookie). Der Sprachauswahl-Screen im Onboarding bleibt
  // trotzdem Teil des Ablaufs, damit der Demonstrator ihn vorfuehren kann.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistShape = {
        fontScale,
        theme,
        disabledSources,
        objections,
        likes,
        dismissed,
        abkuerzungenKompakt,
        avatar,
        language,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignorieren
    }
  }, [hydrated, fontScale, theme, disabledSources, objections, likes, dismissed, abkuerzungenKompakt, avatar, language]);

  // Schriftgroesse als Attribut auf <html> spiegeln (CSS-Variable --font-scale).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-fontscale", fontScale === "lg" ? "lg" : "normal");
  }, [fontScale]);

  // Sprache auf <html> spiegeln: lang fuer Screenreader-Aussprache, data-lang
  // analog zu data-theme. Beides traegt die AUFGELOESTE Locale (de/en) - bei
  // tr/ar steht dort "en", passend zum tatsaechlich gerenderten Sprachstand.
  // Dasselbe setzt bereits das Inline-Skript in layout.tsx vor dem ersten Paint;
  // dieser Effekt haelt es bei einem Sprachwechsel zur Laufzeit aktuell.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const loc = resolveLocale(language);
    document.documentElement.lang = loc;
    document.documentElement.setAttribute("data-lang", loc);
  }, [language]);

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
  const setAvatar = useCallback((v: string) => setAvatarState(v), []);

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
      // Widerspruch und "gemerkt" schließen sich aus.
      setLikes((prev) => prev.filter((id) => id !== hinweisId));
    },
    [],
  );

  const removeObjection = useCallback((hinweisId: string) => {
    setObjections((prev) => prev.filter((o) => o.hinweisId !== hinweisId));
  }, []);

  const isLiked = useCallback((hinweisId: string) => likes.includes(hinweisId), [likes]);

  const toggleLike = useCallback((hinweisId: string) => {
    setLikes((prev) =>
      prev.includes(hinweisId) ? prev.filter((id) => id !== hinweisId) : [...prev, hinweisId],
    );
    // Beim Liken einen evtl. bestehenden Widerspruch entfernen (gegenseitig ausschließend).
    setObjections((prev) => prev.filter((o) => o.hinweisId !== hinweisId));
  }, []);

  const isDismissed = useCallback((hinweisId: string) => dismissed.includes(hinweisId), [dismissed]);

  const dismiss = useCallback((hinweisId: string) => {
    setDismissed((prev) => (prev.includes(hinweisId) ? prev : [...prev, hinweisId]));
  }, []);

  const restore = useCallback((hinweisId: string) => {
    setDismissed((prev) => prev.filter((id) => id !== hinweisId));
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
      avatar,
      setAvatar,
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
      likes,
      isLiked,
      toggleLike,
      dismissed,
      isDismissed,
      dismiss,
      restore,
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
      avatar,
      setAvatar,
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
      likes,
      isLiked,
      toggleLike,
      dismissed,
      isDismissed,
      dismiss,
      restore,
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

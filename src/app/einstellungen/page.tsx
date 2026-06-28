"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
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
  FileText,
  CheckCircle,
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

type Sprache = "de" | "en" | "tr" | "ar";

const t = {
  de: {
    titel: "Einstellungen",
    darstellung: "DARSTELLUNG",
    sprache: "Sprache",
    sprachWert: "Deutsch",
    anzeigemodus: "Anzeigemodus",
    schriftgroesse: "Schriftgröße",
    arztbericht: "Arztbericht erstellen",
    datenschutz_epa: "Datenschutz – ePA",
    datenschutz_wearable: "Datenschutz – Wearable",
    informationen: "Informationen",
    widersprueche: "Deine Widersprüche",
    widerspruecheEmpty: "Du hast bisher keinem Hinweis widersprochen.",
    ueber: "Über VitaLink",
    sprachwaehlen: "Sprache wählen",
    system: "System",
    hell: "Hell",
    dunkel: "Dunkel",
    standard: "Standard",
    gross: "Groß",
    wird_geladen: "Wird geladen …",
  },
  en: {
    titel: "Settings",
    darstellung: "APPEARANCE",
    sprache: "Language",
    sprachWert: "English",
    anzeigemodus: "Display Mode",
    schriftgroesse: "Font Size",
    arztbericht: "Create Medical Report",
    datenschutz_epa: "Privacy – EPA",
    datenschutz_wearable: "Privacy – Wearable",
    informationen: "Information",
    widersprueche: "Your Objections",
    widerspruecheEmpty: "You haven't objected to any recommendation yet.",
    ueber: "About VitaLink",
    sprachwaehlen: "Select Language",
    system: "System",
    hell: "Light",
    dunkel: "Dark",
    standard: "Standard",
    gross: "Large",
    wird_geladen: "Loading …",
  },
  tr: {
    titel: "Ayarlar",
    darstellung: "GÖRÜNÜM",
    sprache: "Dil",
    sprachWert: "Türkçe",
    anzeigemodus: "Görünüm Modu",
    schriftgroesse: "Yazı Boyutu",
    arztbericht: "Tıbbi Rapor Oluştur",
    datenschutz_epa: "Gizlilik – EPA",
    datenschutz_wearable: "Gizlilik – Giyilebilir",
    informationen: "Bilgi",
    widersprueche: "İtirazlarınız",
    widerspruecheEmpty: "Henüz hiçbir öneriye itiraz etmediniz.",
    ueber: "VitaLink Hakkında",
    sprachwaehlen: "Dil Seç",
    system: "Sistem",
    hell: "Açık",
    dunkel: "Koyu",
    standard: "Standart",
    gross: "Büyük",
    wird_geladen: "Yükleniyor …",
  },
  ar: {
    titel: "الإعدادات",
    darstellung: "المظهر",
    sprache: "اللغة",
    sprachWert: "العربية",
    anzeigemodus: "وضع العرض",
    schriftgroesse: "حجم الخط",
    arztbericht: "إنشاء تقرير طبي",
    datenschutz_epa: "الخصوصية – EPA",
    datenschutz_wearable: "الخصوصية – الجهاز",
    informationen: "المعلومات",
    widersprueche: "اعتراضاتك",
    widerspruecheEmpty: "لم تعترض على أي توصية حتى الآن.",
    ueber: "حول VitaLink",
    sprachwaehlen: "اختر اللغة",
    system: "النظام",
    hell: "فاتح",
    dunkel: "داكن",
    standard: "قياسي",
    gross: "كبير",
    wird_geladen: "جارٍ التحميل …",
  },
} as const;

const THEME_OPTIONS: { value: Theme; labelKey: "hell" | "dunkel" | "system"; icon: ReactNode }[] = [
  { value: "light", labelKey: "hell", icon: <Sun aria-hidden size={16} /> },
  { value: "dark", labelKey: "dunkel", icon: <Moon aria-hidden size={16} /> },
  { value: "system", labelKey: "system", icon: <Monitor aria-hidden size={16} /> },
];

const SOURCE_ICON: Record<DataSourceKey, ReactNode> = {
  "epa-vitalwerte": <HeartPulse aria-hidden size={17} className="text-cat-cardio" />,
  "epa-labor": <FlaskConical aria-hidden size={17} className="text-cat-cardio" />,
  "epa-impfungen": <Syringe aria-hidden size={17} className="text-cat-cardio" />,
  "wearable-schlaf": <Moon aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-puls": <Heart aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-hrv": <Activity aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-aktivitaet": <Footprints aria-hidden size={17} className="text-cat-lifestyle" />,
  "wearable-glukose": <Activity aria-hidden size={17} className="text-cat-lifestyle" />,
  "epa-vorsorge": <Syringe aria-hidden size={17} className="text-cat-cardio" />,
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
  const { objections, removeObjection, hydrated, theme, setTheme } = useSettings();
  const [sprache, setSprache] = useState<Sprache>("de");
  const [sprachBlattOffen, setSprachBlattOffen] = useState(false);

  // Reset auf Deutsch beim Verlassen der Seite
  useEffect(() => {
    return () => {
      setSprache("de");
    };
  }, []);

  const T = t[sprache];
  const epaSources = dataSources.filter((d) => d.gruppe === "ePA");
  const wearableSources = dataSources.filter((d) => d.gruppe === "Wearable");

  return (
    <>
      <div className="pb-6">
        <AppHeader title={T.titel} back={{ href: "/vitalink", label: "VitaLink" }} />

        <div className="space-y-7 px-4 py-5">
          {/* DARSTELLUNG */}
          <section>
            <GroupHeader>{T.darstellung}</GroupHeader>
            <Group>
              {/* Sprache */}
              <SettingsRow
                icon={<Globe aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label={T.sprache}
                right={
                  <span className="flex items-center gap-2 text-[14px] text-muted">
                    {T.sprachWert}
                  </span>
                }
                onClick={() => setSprachBlattOffen(true)}
              />
              <Divider />

              {/* Anzeigemodus */}
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-cat-lifestyle-light">
                    <Sun aria-hidden size={17} className="text-cat-lifestyle" />
                  </span>
                  <span className="text-[15px] font-semibold text-ink">{T.anzeigemodus}</span>
                </div>
                <div role="group" aria-label={T.anzeigemodus} className="flex gap-1 rounded-xl bg-surface-2 p-1">
                  {THEME_OPTIONS.map(({ value, labelKey, icon }) => {
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
                        {T[labelKey]}
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
                  <span className="text-[15px] font-semibold text-ink">{T.schriftgroesse}</span>
                </div>
                <FontSizeToggle />
              </div>
              <Divider />

              {/* Arztbericht erstellen */}
              <SettingsRow
                icon={<FileText aria-hidden size={17} className="text-cat-prevention" />}
                iconBg="bg-cat-prevention-light"
                label={T.arztbericht}
                href="/export"
              />
            </Group>
          </section>

          {/* DATENSCHUTZ – ePA */}
          <section>
            <GroupHeader>{T.datenschutz_epa}</GroupHeader>
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

          {/* DATENSCHUTZ – WEARABLE */}
          <section>
            <GroupHeader>{T.datenschutz_wearable}</GroupHeader>
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

          {/* WIDERSPRÜCHE */}
          <section>
            <GroupHeader>{T.widersprueche}</GroupHeader>
            <Group>
              {!hydrated ? (
                <p className="px-4 py-4 text-[14px] text-ink-2">{T.wird_geladen}</p>
              ) : objections.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <MessageSquareX aria-hidden size={32} className="text-muted" />
                  <p className="text-[15px] text-ink-2">{T.widerspruecheEmpty}</p>
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
                            {o.freitext ? ` · „${o.freitext}"` : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeObjection(o.hinweisId)}
                          aria-label={`Widerspruch zu „${titel}" löschen`}
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
            <GroupHeader>{T.informationen}</GroupHeader>
            <Group>
              <SettingsRow
                icon={<Info aria-hidden size={17} className="text-cat-travel" />}
                iconBg="bg-cat-travel-light"
                label={T.ueber}
                href="/ueber"
              />
            </Group>
          </section>
        </div>
      </div>

      {/* ── Sprach-Bottom-Sheet ── */}
      {sprachBlattOffen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSprachBlattOffen(false)}
            aria-hidden
          />

          {/* Sheet */}
          <div
            role="dialog"
            aria-label={T.sprachwaehlen}
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame overflow-hidden rounded-t-[28px] bg-surface pb-safe"
            style={{
              boxShadow: "var(--shadow-lg)",
              animation: "screen-in 200ms ease-out",
            }}
          >
            {/* Handle bar */}
            <div className="mx-auto mb-5 mt-3 h-[2px] w-9 rounded-full bg-border-strong" />

            {/* Title */}
            <p className="mb-2 px-5 text-[16px] font-semibold text-ink">{T.sprachwaehlen}</p>

            {/* Option: Deutsch */}
            <button
              type="button"
              onClick={() => { setSprache("de"); setSprachBlattOffen(false); }}
              className="flex min-h-[54px] w-full items-center gap-[14px] border-b border-border px-5 text-left transition-colors hover:bg-surface-2/40"
            >
              <span className="text-2xl leading-none" aria-hidden>🇩🇪</span>
              <span className="flex-1 text-[16px] text-ink">Deutsch</span>
              {sprache === "de" && <CheckCircle aria-hidden size={20} className="text-cat-lifestyle" />}
            </button>

            {/* Option: English */}
            <button
              type="button"
              onClick={() => { setSprache("en"); setSprachBlattOffen(false); }}
              className="flex min-h-[54px] w-full items-center gap-[14px] border-b border-border px-5 text-left transition-colors hover:bg-surface-2/40"
            >
              <span className="text-2xl leading-none" aria-hidden>🇬🇧</span>
              <span className="flex-1 text-[16px] text-ink">English</span>
              {sprache === "en" && <CheckCircle aria-hidden size={20} className="text-cat-lifestyle" />}
            </button>

            {/* Option: Türkçe */}
            <button
              type="button"
              onClick={() => { setSprache("tr"); setSprachBlattOffen(false); }}
              className="flex min-h-[54px] w-full items-center gap-[14px] border-b border-border px-5 text-left transition-colors hover:bg-surface-2/40"
            >
              <span className="text-2xl leading-none" aria-hidden>🇹🇷</span>
              <span className="flex-1 text-[16px] text-ink">Türkçe</span>
              {sprache === "tr" && <CheckCircle aria-hidden size={20} className="text-cat-lifestyle" />}
            </button>

            {/* Option: العربية */}
            <button
              type="button"
              onClick={() => { setSprache("ar"); setSprachBlattOffen(false); }}
              className="flex min-h-[54px] w-full items-center gap-[14px] px-5 text-left transition-colors hover:bg-surface-2/40"
            >
              <span className="text-2xl leading-none" aria-hidden>🇸🇦</span>
              <span className="flex-1 text-[16px] text-ink">العربية</span>
              {sprache === "ar" && <CheckCircle aria-hidden size={20} className="text-cat-lifestyle" />}
            </button>

            <div className="h-4" />
          </div>
        </>
      )}
    </>
  );
}

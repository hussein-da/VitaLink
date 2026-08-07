"use client";

// DERZEIT NICHT ERREICHBAR (verwaist): Diese Komponente wird von keiner Route
// importiert und erscheint in keinem Screen. Der Code wird gepflegt und
// zweisprachig gehalten.

import { RefreshCw, Shield, Watch } from "lucide-react";
import { geraeteFuer } from "@/data/wearable";
import { profile } from "@/data/profile";
import { useT } from "@/i18n/useT";

function AppleWatchKachel() {
  const { t, locale, fmt } = useT();
  const { appleWatch } = geraeteFuer(locale);

  return (
    <div className="flex flex-col rounded-2xl bg-surface p-[14px] shadow-card">
      {/* Oben: SVG-Illustration links, Pill-Akku rechts */}
      <div className="flex items-start justify-between">
        {/* Watch-SVG 32×40px */}
        <svg width={32} height={40} viewBox="0 0 32 40" fill="none" aria-hidden>
          {/* Band oben */}
          <rect x="10" y="0" width="12" height="10" rx="3" fill="var(--c-cat-lifestyle)" />
          {/* Gehäuse */}
          <rect x="4" y="8" width="24" height="26" rx="6" style={{ fill: "var(--c-watch-case)" }} />
          {/* Display */}
          <rect x="7" y="11" width="18" height="20" rx="4" fill="#000000" />
          {/* Winziges Herz auf dem Display */}
          <g transform="translate(16, 21) scale(0.27)">
            <path
              d="M0 9 C0 9 -13 3 -13 -3.5 C-13 -7.5 -10 -10 -7 -10 C-4.5 -10 0 -6.5 0 -6.5 C0 -6.5 4.5 -10 7 -10 C10 -10 13 -7.5 13 -3.5 C13 3 0 9 0 9Z"
              fill="#FF6B6B"
            />
          </g>
          {/* Band unten */}
          <rect x="10" y="32" width="12" height="8" rx="3" fill="var(--c-cat-lifestyle)" />
        </svg>

        {/* Horizontaler Pill-Akku */}
        <div className="flex flex-col items-end gap-[2px]">
          <div
            className="relative h-[14px] w-8 rounded-[4px]"
            style={{ border: "1.5px solid var(--c-border-strong)" }}
          >
            {/* Terminal-Pol */}
            <span
              className="absolute bg-border-strong"
              style={{
                right: -4,
                top: "calc(50% - 3px)",
                width: 3,
                height: 6,
                borderRadius: "0 2px 2px 0",
              }}
            />
            {/* Füllstand */}
            <span className="absolute inset-[1px] overflow-hidden rounded-[2px]">
              <span
                className="block h-full bg-status-ok"
                style={{ width: `${appleWatch.akkuProzent}%` }}
              />
            </span>
          </div>
          <span className="text-[10px] font-semibold text-status-ok">
            {t.orphaned.devices.batteryPercent(fmt.number(appleWatch.akkuProzent))}
          </span>
        </div>
      </div>

      {/* Mitte: Name */}
      <div className="mt-[10px]">
        <p className="text-[13px] font-semibold text-ink">Apple Watch</p>
        <p className="text-[11px] text-muted">Series 12</p>
      </div>

      {/* Unten: Status + Sync */}
      <div className="mt-2">
        <div className="flex items-center gap-[5px]">
          <span
            className="pulse-dot block h-2 w-2 rounded-full bg-status-ok"
            aria-hidden
          />
          <span className="text-[11px] font-semibold text-status-ok">
            {t.orphaned.devices.liveStatus}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <Watch aria-hidden size={10} className="text-muted" />
          <span className="text-[11px] text-muted">{t.orphaned.devices.wristDetected}</span>
        </div>
      </div>
    </div>
  );
}

function EpaKachel() {
  const { t, locale } = useT();
  const { epa } = geraeteFuer(locale);
  // Beschriftungen der Daten-Punkte auf Render-Ebene, damit sie dem
  // Sprachwechsel folgen.
  const datenPunkte = [
    t.orphaned.devices.dataLab,
    t.orphaned.devices.dataVitals,
    t.orphaned.devices.dataVaccinations,
  ];

  return (
    <div className="flex flex-col rounded-2xl bg-surface p-[14px] shadow-card">
      {/* Oben: Icon links, Badge rechts */}
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-cat-cardio-light">
          <Shield aria-hidden size={16} className="text-cat-cardio" />
        </div>
        <span className="flex items-center gap-[3px] rounded-full bg-status-ok-light px-2 py-[3px]">
          <span className="block h-[5px] w-[5px] rounded-full bg-status-ok" aria-hidden />
          <span className="text-[10px] font-semibold text-status-ok">
            {t.orphaned.devices.epaActive}
          </span>
        </span>
      </div>

      {/* Mitte: Name */}
      <div className="mt-[10px]">
        <p className="text-[13px] font-semibold text-ink">{t.orphaned.devices.epaTitle}</p>
        <p className="text-[11px] text-muted">{profile.versicherung}</p>
      </div>

      {/* Unten: Status-Dots + Sync */}
      <div className="mt-2">
        <div className="flex items-center gap-[6px]">
          {datenPunkte.map((label) => (
            <span key={label} className="flex items-center gap-[3px]">
              <span className="block h-[5px] w-[5px] rounded-full bg-status-ok" aria-hidden />
              <span className="text-[10px] text-muted">{label}</span>
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-1">
          <RefreshCw aria-hidden size={10} className="text-muted" />
          <span className="text-[11px] text-muted">
            {t.orphaned.devices.syncRelative(epa.letzteSync)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GeraeteSektion() {
  const { t } = useT();

  return (
    <section aria-label={t.orphaned.devices.sectionAria} className="mt-4 px-5">
      <h2 className="mb-[10px] px-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
        {t.orphaned.devices.sectionTitle}
      </h2>
      <div className="grid grid-cols-2 gap-[10px]">
        <AppleWatchKachel />
        <EpaKachel />
      </div>
    </section>
  );
}

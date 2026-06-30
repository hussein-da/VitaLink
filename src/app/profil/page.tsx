"use client";

import Link from "next/link";
import { Settings, Info, ChevronRight, Check, ShieldCheck, BookText } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { profile } from "@/data/profile";

// Mock-Avatar-Galerie (Tier-Emojis, synthetisch). "" = Initiale.
const AVATARE = ["🦊", "🐨", "🐼", "🐯", "🦁", "🐧", "🦉", "🐢", "🐱", "🦄"];

// Beispiel-Versichertennummer (synthetisch, kein echter Wert).
const VERSICHERTENNUMMER = "A123456789";

function Group({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">{children}</div>;
}

export default function ProfilPage() {
  const { avatar, setAvatar } = useSettings();

  return (
    <div className="pt-safe pb-10">
      <header className="px-4 pt-5">
        <h1 className="text-[24px] font-semibold leading-tight text-ink">Profil</h1>
        <p className="mt-0.5 text-[13px] text-muted">Beispiel-Persona der Nutzerstudie</p>
      </header>

      <div className="space-y-6 px-4 py-5">
        {/* Persona-Kopf */}
        <div className="flex items-center gap-4 rounded-[20px] bg-surface p-5 shadow-card">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cat-lifestyle-light text-[28px] font-semibold text-cat-lifestyle">
            {avatar || profile.vorname.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="text-[18px] font-semibold text-ink">{profile.name}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {profile.alter} Jahre · {profile.ort}
            </p>
            <span className="mt-1.5 inline-block rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
              Beispieldaten · synthetisch
            </span>
          </div>
        </div>

        {/* Avatar-Auswahl */}
        <section>
          <h2 className="section-label mb-2 px-1">Avatar wählen</h2>
          <Group>
            <div className="flex flex-wrap gap-2 p-3">
              <button
                type="button"
                onClick={() => setAvatar("")}
                aria-label="Initiale als Avatar"
                className={`tap flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-semibold ${
                  avatar === "" ? "bg-cat-lifestyle text-cat-lifestyle-on" : "bg-surface-2 text-ink"
                }`}
              >
                {profile.vorname.charAt(0)}
              </button>
              {AVATARE.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setAvatar(emo)}
                  aria-label={`Avatar ${emo}`}
                  className={`tap relative flex h-12 w-12 items-center justify-center rounded-full text-[24px] ${
                    avatar === emo ? "bg-cat-lifestyle-light ring-2 ring-cat-lifestyle" : "bg-surface-2"
                  }`}
                >
                  {emo}
                  {avatar === emo && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cat-lifestyle">
                      <Check aria-hidden size={10} className="text-cat-lifestyle-on" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Group>
        </section>

        {/* Mock-Versichertenkarte */}
        <section>
          <h2 className="section-label mb-2 px-1">Versichertenkarte</h2>
          <div className="overflow-hidden rounded-[20px] bg-cat-cardio p-5 text-cat-cardio-on shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold uppercase tracking-wide opacity-90">
                Gesundheitskarte
              </span>
              <ShieldCheck aria-hidden size={18} className="opacity-90" />
            </div>
            <p className="mt-5 text-[18px] font-semibold">{profile.name}</p>
            <p className="mt-1 text-[13px] opacity-90">{profile.versicherung}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide opacity-75">Versichertennummer</p>
                <p className="font-mono text-[15px] tracking-widest">{VERSICHERTENNUMMER}</p>
              </div>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                Beispiel
              </span>
            </div>
          </div>
          <p className="mt-2 px-1 text-[12px] text-muted">
            Hausärztin: {profile.hausaerztin}. Alle Angaben sind synthetische Beispieldaten.
          </p>
        </section>

        {/* Verwaltung */}
        <section>
          <h2 className="section-label mb-2 px-1">Verwaltung</h2>
          <Group>
            <Link href="/glossar" className="tap flex min-h-[52px] items-center gap-3 px-4 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-cat-travel-light">
                <BookText aria-hidden size={17} className="text-cat-travel" />
              </span>
              <span className="flex-1 text-[15px] font-semibold text-ink">Glossar</span>
              <ChevronRight aria-hidden size={16} className="text-muted" />
            </Link>
            <div aria-hidden className="ml-[60px] h-px bg-border" />
            <Link href="/einstellungen" className="tap flex min-h-[52px] items-center gap-3 px-4 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-2">
                <Settings aria-hidden size={17} className="text-muted" />
              </span>
              <span className="flex-1 text-[15px] font-semibold text-ink">Einstellungen</span>
              <ChevronRight aria-hidden size={16} className="text-muted" />
            </Link>
            <div aria-hidden className="ml-[60px] h-px bg-border" />
            <Link href="/ueber" className="tap flex min-h-[52px] items-center gap-3 px-4 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-cat-travel-light">
                <Info aria-hidden size={17} className="text-cat-travel" />
              </span>
              <span className="flex-1 text-[15px] font-semibold text-ink">Über VitaLink</span>
              <ChevronRight aria-hidden size={16} className="text-muted" />
            </Link>
          </Group>
        </section>
      </div>
    </div>
  );
}

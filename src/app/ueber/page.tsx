// Über-Seite — Forschungskontext und die einzige Disclaimer-Box der App (Block 4).
import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import { GraduationCap, FlaskConical, User, MapPin, Calendar, Info } from "lucide-react";

export const metadata = {
  title: "Über dieses Projekt - VitaLink",
};

const BUILD_STAMP = process.env.NEXT_PUBLIC_BUILD_TIME
  ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  : null;

const INFO_ROWS: { icon: ReactNode; label: string; value: string }[] = [
  { icon: <GraduationCap aria-hidden size={17} className="text-ink-2" />, label: "Studiengang", value: "Master MTI, HRW" },
  { icon: <FlaskConical aria-hidden size={17} className="text-ink-2" />, label: "Methodik", value: "eDSR nach Tuunanen et al." },
  { icon: <User aria-hidden size={17} className="text-ink-2" />, label: "Betreuung", value: "Ann-Kathrin Kubullek, M.A." },
  { icon: <MapPin aria-hidden size={17} className="text-ink-2" />, label: "Hochschule", value: "Hochschule Ruhr West, Bottrop" },
  { icon: <Calendar aria-hidden size={17} className="text-ink-2" />, label: "Zeitraum", value: "SoSe 2026" },
];

export default function UeberPage() {
  return (
    <div className="pb-6">
      <AppHeader title="Über VitaLink" back={{ href: "/vitalink", label: "VitaLink" }} />

      <div className="px-4 py-4">
        {/* Wordmark */}
        <div className="flex flex-col items-center py-8 text-center">
          <p className="font-display text-[40px] font-bold leading-none text-ink">VitaLink</p>
          <p className="mt-1.5 text-[14px] text-ink-2">Forschungsprototyp · Hochschule Ruhr West</p>
          <p className="mt-1 text-[13px] text-ink-2">Version 1.0 · SoSe 2026</p>
        </div>

        {/* Info-Karte „Über das Projekt" */}
        <section className="rounded-[20px] bg-surface p-5 shadow-card">
          {INFO_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`flex min-h-[48px] items-center gap-3 ${
                i < INFO_ROWS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-2">
                {row.icon}
              </span>
              <span className="text-[14px] font-medium text-ink-2">{row.label}</span>
              <span className="ml-auto text-right text-[15px] font-semibold text-ink">{row.value}</span>
            </div>
          ))}
        </section>

        {/* Disclaimer-Box — die einzige der gesamten App (Block 4, Stelle 1) */}
        <section className="mt-5 rounded-2xl bg-surface-2 p-[18px]">
          <div className="flex items-center gap-3">
            <Info aria-hidden size={18} className="shrink-0 text-ink-2" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-2">
              Hinweis zum Prototyp
            </span>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink">
            VitaLink ist ein Forschungsprototyp im Rahmen eines Masterprojekts im Modul
            Menschzentrierte Technikentwicklung für eine digitale Gesellschaft (Studiengang Master
            Mensch-Technik-Interaktion, MTI) an der Hochschule Ruhr West, SoSe 2026. Die dargestellten
            Gesundheitsdaten sind illustrativ und stellen keine medizinische Beratung dar. VitaLink
            ist kein Medizinprodukt. Für medizinische Fragen wende dich an deine Hausarztpraxis.
          </p>
        </section>

        {BUILD_STAMP && (
          <p className="py-5 text-center text-[11px] text-muted">Stand: {BUILD_STAMP}</p>
        )}
      </div>
    </div>
  );
}

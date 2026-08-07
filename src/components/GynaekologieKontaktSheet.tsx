"use client";

import { useEffect, useRef } from "react";
import { FileText, HeartPulse, MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { kategorieFuer } from "@/lib/kategorie";
import { useT } from "@/i18n/useT";

/**
 * Kontakt-Bottom-Sheet der gynäkologischen Praxis (nur für die Kachel
 * „Gynäkologische Vorsorge" auf /termine). Zeigt die aus der ePA bekannten
 * Praxis-Kontaktdaten des letzten Vorsorgebesuchs — kein neuer Termin, sondern
 * der Weg zur bereits behandelnden Praxis.
 *
 * Nutzt ausschließlich bestehende Muster: das Bottom-Sheet-Idiom der
 * Einstellungen (Grabber, rounded-t-[28px], screen-in), die Kategorie-Farbe
 * über kategorieFuer("vorsorge", locale) und die ePA-Herkunftsdarstellung (surface-2 +
 * FileText) wie in der Datengrundlage.
 *
 * Synthetische Beispiel-Praxis (Studienprofil Mara K.).
 */

// Kontaktdaten aus der ePA — letzter Vorsorgebesuch am 12.08.2025.
// Nur die sprachneutralen Angaben (Eigennamen, Adresse, Rufnummer, Links)
// stehen hier; Fachgebiet, Öffnungszeiten und Besuchsdatum kommen aus dem
// Wörterbuch, damit ein Sprachwechsel greift.
const PRAXIS = {
  name: "Frauenärztliche Praxis Dr. med. Katrin Vogel",
  strasse: "Kortumstraße 82",
  ort: "44787 Bochum",
  telefon: "0234 33 78 90",
  telefonHref: "tel:+49234337890",
  email: "praxis@gyn-vogel-bochum.de",
  emailHref: "mailto:praxis@gyn-vogel-bochum.de",
};

export default function GynaekologieKontaktSheet({ onClose }: { onClose: () => void }) {
  const { t, locale } = useT();
  const k = kategorieFuer("vorsorge", locale);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Escape schließt, Fokus in den Dialog, Body-Scroll gesperrt — dasselbe
  // Verhalten wie im bestehenden ui/Dialog.
  useEffect(() => {
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Der Quellenhinweis ist EINE Übersetzungseinheit; der Platzhalter markiert
  // nur die Stelle, an der das Besuchsdatum hervorgehoben wird.
  const [quelleVorDatum, quelleNachDatum] =
    t.appointments.practiceEpaSourceNote.split("{datum}");

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-label={t.appointments.practiceSheetAriaLabel}
        aria-modal="true"
        tabIndex={-1}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-frame overflow-y-auto rounded-t-[28px] bg-surface px-5 pb-safe pt-3 outline-none"
        style={{ maxHeight: "88vh", boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
      >
        <div className="mx-auto mb-4 h-[2px] w-9 rounded-full bg-border-strong" />

        {/* ePA-Quelle: explizit gekennzeichnet */}
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1">
          <FileText aria-hidden size={12} className="text-ink-2" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-2">
            {t.appointments.practiceFromEpa}
          </span>
        </span>

        {/* Praxis-Kopf */}
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${k.soft}`}>
            <HeartPulse aria-hidden size={20} className={k.text} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold leading-snug text-ink">{PRAXIS.name}</h2>
            <p className="mt-0.5 text-[13px] text-muted">{t.appointments.practiceSpecialty}</p>
          </div>
        </div>

        {/* Kontaktzeilen — Adresse, Telefon (tel:), E-Mail (mailto:), Öffnungszeiten */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-surface-2">
          <div className="flex items-start gap-3 px-3.5 py-3">
            <MapPin aria-hidden size={18} className="mt-0.5 shrink-0 text-ink-2" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                {t.appointments.practiceAddressLabel}
              </p>
              <p className="mt-0.5 text-[15px] leading-[1.5] text-ink">
                {PRAXIS.strasse}
                <br />
                {PRAXIS.ort}
              </p>
            </div>
          </div>

          <a
            href={PRAXIS.telefonHref}
            className="tap flex items-center gap-3 border-t border-border px-3.5 py-3"
          >
            <Phone aria-hidden size={18} className="shrink-0 text-ink-2" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                {t.appointments.practicePhoneLabel}
              </span>
              <span className="mt-0.5 block text-[15px] font-medium text-ink">{PRAXIS.telefon}</span>
            </span>
            <ChevronRight aria-hidden size={16} className="shrink-0 text-muted" />
          </a>

          <a
            href={PRAXIS.emailHref}
            className="tap flex items-center gap-3 border-t border-border px-3.5 py-3"
          >
            <Mail aria-hidden size={18} className="shrink-0 text-ink-2" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                {t.appointments.practiceEmailLabel}
              </span>
              <span className="mt-0.5 block truncate text-[15px] font-medium text-ink">
                {PRAXIS.email}
              </span>
            </span>
            <ChevronRight aria-hidden size={16} className="shrink-0 text-muted" />
          </a>

          <div className="flex items-start gap-3 border-t border-border px-3.5 py-3">
            <Clock aria-hidden size={18} className="mt-0.5 shrink-0 text-ink-2" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                {t.appointments.practiceHoursLabel}
              </p>
              <div className="mt-0.5 space-y-0.5">
                {t.appointments.practiceHours.map((zeile: string) => (
                  <p key={zeile} className="text-[15px] leading-[1.4] text-ink">
                    {zeile}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ePA-Quellenhinweis: letzter Besuch als Quelle */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface-2 p-3">
          <FileText aria-hidden size={14} className="mt-0.5 shrink-0 text-ink-2" />
          <p className="text-[13px] leading-[1.5] text-muted">
            {quelleVorDatum}
            <span className="font-semibold text-ink">{t.appointments.practiceLastVisitDate}</span>
            {quelleNachDatum}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="tap mb-4 mt-4 w-full rounded-xl bg-surface-2 px-4 py-3.5 text-[15px] font-semibold text-ink"
        >
          {t.appointments.practiceClose}
        </button>
      </div>
    </>
  );
}

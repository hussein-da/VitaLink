// Über-Seite
import AppHeader from "@/components/AppHeader";
import { FlaskConical, GraduationCap, Watch, ShieldAlert, ShieldCheck } from "lucide-react";

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

export default function UeberPage() {
  return (
    <div className="pb-6">
      <AppHeader title="Über VitaLink" back={{ href: "/dashboard", label: "Zurück" }} />

      <div className="px-4 py-6">
        {/* Wordmark */}
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary text-primary-ink shadow-card">
            <ShieldCheck aria-hidden size={32} />
          </span>
          <p className="mt-4 font-display text-[32px] font-semibold leading-none text-ink">VitaLink</p>
          <p className="mt-2 text-xs text-muted">Forschungs-Demonstrator · Master MTI, HRW</p>
        </div>

        <div className="mt-10 space-y-3">
          {/* Mock-Hinweis (eisernes Gesetz 2) – prominent */}
          <section className="flex items-start gap-3 rounded-[20px] border border-border bg-surface-2 p-5">
            <FlaskConical aria-hidden size={22} className="mt-0.5 shrink-0 text-accent-ink" />
            <div className="text-sm text-ink">
              <p className="font-semibold">Demonstrator mit fiktiven Daten.</p>
              <p className="mt-1 text-muted">
                Alle dargestellten Personen, Werte, Einrichtungen und Angebote sind frei erfunden.
                VitaLink ist kein Medizinprodukt und ersetzt keine medizinische Beratung.
              </p>
            </div>
          </section>

          {/* Forschungskontext */}
          <section className="rounded-[20px] bg-surface p-5 shadow-card">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                <GraduationCap aria-hidden size={20} className="text-primary" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">Forschungskontext</h2>
            </div>
            <p className="text-[15px] leading-relaxed text-ink">
              VitaLink entsteht im Modul{" "}
              <span className="font-medium">
                &bdquo;Menschzentrierte Technikentwicklung für eine digitale Gesellschaft&ldquo;
              </span>{" "}
              im Master Mensch-Technik-Interaktion (MTI) an der Hochschule Ruhr West, Sommersemester
              2026.
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">
              Die App ist ein Forschungs-Artefakt (echelonierte Design Science Research (eDSR)) und
              dient als Evaluationsobjekt für qualitative Interviews mit Think-Aloud-Walkthrough.
              Untersucht wird, wie eine erklärbare, nutzergerechte Oberfläche gestaltet sein muss,
              damit KI-basierte Gesundheitshinweise als vertrauenswürdig, verständlich und
              handlungsrelevant erlebt werden.
            </p>
            <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Betreuung</dt>
                <dd className="text-right font-medium text-ink">Ann-Kathrin Kubullek, M.A.</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="shrink-0 text-muted">Zielgruppe</dt>
                <dd className="text-right font-medium text-ink">
                  Erwachsene ab 20 (Gen Z), Ruhrgebiet
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="shrink-0 text-muted">Schwerpunkt</dt>
                <dd className="text-right font-medium text-ink">Prävention & Lifestyle-Monitoring</dd>
              </div>
            </dl>
          </section>

          {/* Daten */}
          <section className="rounded-[20px] bg-surface p-5 shadow-card">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                <ShieldAlert aria-hidden size={20} className="text-primary" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">Daten &amp; Datenschutz</h2>
            </div>
            <p className="text-[15px] leading-relaxed text-ink">
              Es gibt keine echte ePA-Anbindung, kein echtes Wearable und kein Backend mit
              Personendaten. Alle Datensätze liegen statisch und synthetisch im Code und sind als{" "}
              <span className="font-mono text-sm">synthetic: true</span> markiert. Deine
              Einstellungen (Schriftgröße, Datenquellen-Schalter, Widersprüche) bleiben nur lokal
              auf deinem Gerät.
            </p>
          </section>

          {/* Wearable-Definition */}
          <section className="rounded-[20px] bg-surface p-5 shadow-card">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                <Watch aria-hidden size={20} className="text-primary" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">Was ist ein Wearable?</h2>
            </div>
            <p className="text-[15px] leading-relaxed text-ink">
              Als Wearable gelten am Körper getragene Geräte, die Gesundheitsdaten kontinuierlich
              erfassen und über eine Schnittstelle bereitstellen - zum Beispiel Smartwatches, smarte
              Ringe, smarte Blutdruckmanschetten, CGM-Systeme (kontinuierliche Glukosemessung),
              EKG-Pflaster und Pulsoximeter.
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Ohne kontinuierliche Erfassung oder Schnittstelle fällt ein Gerät nicht unter diese
              Definition.
            </p>
          </section>
        </div>

        {BUILD_STAMP && (
          <p className="mt-6 text-center text-xs text-muted">Stand: {BUILD_STAMP}</p>
        )}
      </div>
    </div>
  );
}

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

      <div className="space-y-5 px-4 py-6 leading-relaxed">
        {/* Wordmark + Version (§5) */}
        <div className="flex flex-col items-center pb-1 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-ink shadow-card">
            <ShieldCheck aria-hidden size={28} />
          </span>
          <p className="mt-3 font-display text-2xl font-semibold text-ink">VitaLink</p>
          <p className="mt-1 text-sm text-muted">
            Forschungs-Demonstrator · Master MTI, HRW
          </p>
          {BUILD_STAMP && (
            <p className="mt-0.5 text-xs text-muted">Stand: {BUILD_STAMP}</p>
          )}
        </div>

        {/* Mock-Hinweis (eisernes Gesetz 2) – prominent, neues Kartendesign */}
        <section className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-5 shadow-card">
          <FlaskConical aria-hidden size={22} className="mt-0.5 shrink-0 text-accent-ink" />
          <div className="text-sm text-accent-ink">
            <p className="font-semibold">Demonstrator mit fiktiven Daten.</p>
            <p>
              Alle dargestellten Personen, Werte, Einrichtungen und Angebote sind frei erfunden.
              VitaLink ist kein Medizinprodukt und ersetzt keine medizinische Beratung.
            </p>
          </div>
        </section>

        {/* Forschungskontext */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <GraduationCap aria-hidden size={20} className="text-primary" /> Forschungskontext
          </h2>
          <p className="mt-2 text-ink">
            VitaLink entsteht im Modul{" "}
            <span className="font-medium">
              &bdquo;Menschzentrierte Technikentwicklung für eine digitale Gesellschaft&ldquo;
            </span>{" "}
            im Master Mensch-Technik-Interaktion (MTI) an der Hochschule Ruhr West, Sommersemester 2026.
          </p>
          <p className="mt-2 text-ink">
            Die App ist ein Forschungs-Artefakt (echelonierte Design Science Research (eDSR)) und dient als
            Evaluationsobjekt für qualitative Interviews mit Think-Aloud-Walkthrough. Untersucht
            wird, wie eine erklärbare, nutzergerechte Oberfläche gestaltet sein muss, damit
            KI-basierte Gesundheitshinweise als vertrauenswürdig, verständlich und
            handlungsrelevant erlebt werden.
          </p>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="font-medium text-ink">Betreuung:</dt>
              <dd className="text-muted">Ann-Kathrin Kubullek, M.A.</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-ink">Zielgruppe:</dt>
              <dd className="text-muted">
                digital-affine Erwachsene ab 20 Jahren (Generation Z) im Ruhrgebiet
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-ink">Schwerpunkt:</dt>
              <dd className="text-muted">
                Prävention, Lifestyle-Monitoring und Trendanalysen - keine klinische Versorgung
              </dd>
            </div>
          </dl>
        </section>

        {/* Daten */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <ShieldAlert aria-hidden size={20} className="text-primary" /> Daten &amp; Datenschutz
          </h2>
          <p className="mt-2 text-ink">
            Es gibt keine echte ePA-Anbindung, kein echtes Wearable und kein Backend mit
            Personendaten. Alle Datensätze liegen statisch und synthetisch im Code und sind als{" "}
            <span className="font-mono text-sm">synthetic: true</span> markiert. Deine Einstellungen
            (Schriftgröße, Datenquellen-Schalter, Widersprüche) bleiben nur lokal auf deinem
            Gerät.
          </p>
        </section>

        {/* Wearable-Definition */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Watch aria-hidden size={20} className="text-primary" /> Was ist ein Wearable?
          </h2>
          <p className="mt-2 text-ink">
            Als Wearable gelten am Körper getragene Geräte, die Gesundheitsdaten kontinuierlich
            erfassen und über eine Schnittstelle bereitstellen - zum Beispiel Smartwatches, smarte
            Ringe, smarte Blutdruckmanschetten, CGM-Systeme (kontinuierliche Glukosemessung),
            EKG-Pflaster und Pulsoximeter.
          </p>
          <p className="mt-2 text-muted">
            Ohne kontinuierliche Erfassung oder Schnittstelle fällt ein Gerät nicht unter diese
            Definition.
          </p>
        </section>
      </div>
    </div>
  );
}

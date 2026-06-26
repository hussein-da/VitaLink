// Über-Seite
import AppHeader from "@/components/AppHeader";
import { FlaskConical, GraduationCap, Watch, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Über dieses Projekt - VitaLink",
};

export default function UeberPage() {
  return (
    <div>
      <AppHeader title="Über dieses Projekt" back={{ href: "/dashboard", label: "Zu den Hinweisen" }} />

      <div className="space-y-5 px-4 py-5 leading-relaxed">
        {/* Mock-Hinweis (eisernes Gesetz 2) */}
        <section className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-5">
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
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
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
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
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
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
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

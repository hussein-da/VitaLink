import AppHeader from "@/components/AppHeader";
import HerkunftsTooltip from "@/components/HerkunftsTooltip";
import { GlossarText } from "@/components/GlossarTerm";
import {
  wearableSummary,
  glukoseSummary,
  atemfrequenzSchnitt,
  vo2max,
  hauttemperaturBaseline,
  wochenTraining,
  kalorien,
} from "@/data/wearable";
import { blutdruckReihe } from "@/data/epa";
import { koerpermasse } from "@/data/profile";

const nf1 = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const bd = blutdruckReihe[blutdruckReihe.length - 1];

interface Wert {
  label: string;
  wert: string;
  einheit?: string;
  einordnung?: string;
  herkunftId: string;
}

// Alle Werte stammen aus wearable.ts / epa.ts / profile.ts — keine erfundenen
// Zusatzwerte. Jede Zeile verweist per herkunftId auf die zentrale Datenherkunft.
const SEKTIONEN: { label: string; werte: Wert[] }[] = [
  {
    label: "Herzgesundheit",
    werte: [
      { label: "Ruhepuls", wert: String(wearableSummary.ruhepuls), einheit: "BPM", einordnung: "stabil, gute Erholung", herkunftId: "ruhepuls" },
      { label: "HRV", wert: String(wearableSummary.hrv), einheit: "ms", einordnung: "guter Wochenschnitt", herkunftId: "hrv" },
      { label: "VO₂max", wert: String(vo2max.wert), einheit: vo2max.einheit, einordnung: vo2max.einordnung, herkunftId: "vo2max" },
      { label: "Herzfrequenzzonen", wert: "Zone 2", einordnung: "Grundlagenbereich · 520 Min in 30 Tagen", herkunftId: "hf-zonen" },
    ],
  },
  {
    label: "Schlaf",
    werte: [
      { label: "Schlafdauer", wert: nf1(wearableSummary.schlafStd), einheit: "h", einordnung: "etwas unter dem Ziel von 7,5 h", herkunftId: "schlafdauer" },
      { label: "Tiefschlaf", wert: String(wearableSummary.tiefschlaf), einheit: "%", einordnung: "im unteren Normbereich", herkunftId: "tiefschlaf" },
      { label: "Schlaf-Score", wert: `${wearableSummary.schlafScore}/100`, einordnung: "mittlere Erholung", herkunftId: "schlafscore" },
    ],
  },
  {
    label: "Aktivität",
    werte: [
      { label: "Schritte", wert: wearableSummary.schritte.toLocaleString("de-DE"), einordnung: "Tagesschnitt, über dem WHO-Ziel", herkunftId: "schritte" },
      { label: "Aktive Minuten", wert: String(wearableSummary.aktiveMinuten), einheit: "Min/Tag", einordnung: "solide", herkunftId: "aktive-minuten" },
      { label: "Trainingseinheiten", wert: String(wochenTraining.einheiten.length), einheit: "/Woche", einordnung: "Kraft + Ausdauer", herkunftId: "trainings" },
      { label: "Kalorienverbrauch", wert: kalorien.gesamt.toLocaleString("de-DE"), einheit: "kcal/Tag", einordnung: "Tagesmittel", herkunftId: "kalorien" },
    ],
  },
  {
    label: "Stoffwechsel",
    werte: [
      { label: "Nüchtern-Glukose", wert: String(glukoseSummary.nuechternSchnitt), einheit: "mg/dl", einordnung: "im Normbereich", herkunftId: "glukose" },
      { label: "Wert nach dem Essen", wert: String(glukoseSummary.postprandialSchnitt), einheit: "mg/dl", einordnung: "unauffälliger Ø-Peak", herkunftId: "glukose" },
      { label: "Glukose-Variabilität", wert: String(glukoseSummary.cv), einheit: "% CV", einordnung: "stabile Werte", herkunftId: "glukose" },
    ],
  },
  {
    label: "Atmung & Erholung",
    werte: [
      { label: "SpO₂", wert: String(wearableSummary.spo2), einheit: "%", einordnung: "normal (> 95 %)", herkunftId: "spo2" },
      { label: "Atemfrequenz", wert: String(Math.round(atemfrequenzSchnitt)), einheit: "/min", einordnung: "Norm 12–20", herkunftId: "atemfrequenz" },
      { label: "Stress-Score", wert: String(wearableSummary.stress), einheit: "", einordnung: "moderat", herkunftId: "stress" } as Wert,
      { label: "Hauttemperatur", wert: nf1(hauttemperaturBaseline), einheit: "°C", einordnung: "Baseline, stabil", herkunftId: "hauttemperatur" },
    ],
  },
  {
    label: "Vitalwerte aus der ePA",
    werte: [
      { label: "Blutdruck", wert: `${bd.sys}/${bd.dia}`, einheit: "mmHg", einordnung: "oberer Normbereich", herkunftId: "blutdruck" },
      { label: "Gewicht", wert: nf1(koerpermasse.gewichtKg), einheit: "kg", einordnung: "stabil", herkunftId: "gewicht" },
      { label: "BMI", wert: nf1(koerpermasse.bmi), einordnung: "Normalgewicht", herkunftId: "bmi" },
    ],
  },
];

function WertZeile({ w, erste }: { w: Wert; erste: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${erste ? "" : "border-t border-border"}`}>
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[14px] font-medium text-ink">
          <GlossarText>{w.label}</GlossarText>
          <HerkunftsTooltip ids={[w.herkunftId]} variant="icon" label={`Datenherkunft von ${w.label} ansehen`} />
        </span>
        {w.einordnung && <span className="mt-0.5 block text-[12px] text-muted">{w.einordnung}</span>}
      </div>
      <div className="shrink-0 whitespace-nowrap text-right">
        <span className="text-[17px] font-semibold text-ink">{w.wert}</span>
        {w.einheit && <span className="ml-1 text-[12px] text-muted">{w.einheit}</span>}
      </div>
    </div>
  );
}

export default function WertePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Zurück zum Ursprung: aus der Zeitraum-Kachel (VitaLink) zurück nach /vitalink,
  // sonst nach Home. Der Home-Tab bleibt aktiv (Zuordnung in BottomNav).
  const back =
    searchParams?.from === "vitalink"
      ? { href: "/vitalink", label: "VitaLink" }
      : { href: "/dashboard", label: "Home" };
  return (
    <div className="pb-10">
      <AppHeader title="Deine Sensordaten" eyebrow="Home" back={back} />

      <div className="space-y-6 px-4 py-5">
        <p className="px-1 text-[13px] leading-[1.5] text-muted">
          Alle Werte von deiner Apple Watch Series 12 und aus deiner ePA. Tippe das Info-Symbol für
          die Datenherkunft, unterstrichene Begriffe für die Erklärung.
        </p>

        {SEKTIONEN.map((s) => (
          <section key={s.label}>
            <h2 className="section-label mb-2 px-1">{s.label}</h2>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
              {s.werte.map((w, i) => (
                <WertZeile key={w.label} w={w} erste={i === 0} />
              ))}
            </div>
          </section>
        ))}

        <div className="flex items-start gap-2.5 rounded-2xl bg-surface-2 p-3">
          <p className="text-[12px] leading-[1.5] text-muted">
            Synthetische Beispieldaten (Studienprofil). Hinweis, keine Diagnose — kein Medizinprodukt.
          </p>
        </div>
      </div>
    </div>
  );
}

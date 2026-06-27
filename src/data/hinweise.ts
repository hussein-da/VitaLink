import type { Hinweis } from "@/lib/types";

// Deutsche Zahlformatierung für die Wirkungstexte (Variante C).
function de(n: number): string {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

// Die drei Hinweis-Objekte, je einem Szenario zugeordnet.
// USP: jede Empfehlung verbindet ePA (Arztdaten) + Wearable (Körperdaten).
export const hinweise: Hinweis[] = [
  // ---------------------------------------------------------------------------
  // LIFESTYLE — Schlaf & Erholung (ePA Vitamin D + Wearable Schlaf/HRV)
  // ---------------------------------------------------------------------------
  {
    id: "lifestyle-schlaf",
    szenario: "lifestyle",
    titel: "Schlaf & Erholung verbessern",
    kurz: "Dein Wearable zeigt, dass dein Tiefschlaf unter der Woche auf unter 12 % sinkt. Kombiniert mit deinem Vitamin-D-Wert ergibt sich ein klares Bild.",
    begruendung:
      "Dein Wearable misst von Montag bis Donnerstag einen Tiefschlaf-Anteil von nur 10–13 %, und deine HRV liegt an diesen Nächten bei rund 29 ms statt 45 ms an erholten Nächten. Gleichzeitig zeigt deine ePA einen Vitamin-D-Wert von 24 ng/ml — leicht unter dem optimalen Bereich. Niedrige Vitamin-D-Spiegel hängen in Studien mit schlechterer Schlafqualität zusammen. Genau dieses Muster zeigt sich in deinen Wearable-Daten. Weder die ePA noch das Wearable allein hätten diesen Zusammenhang sichtbar gemacht — die Kombination schon.",
    detail:
      "Grundlage sind deine Wearable-Streams der letzten 14 Tage (Tiefschlaf-Anteil und Schlafdauer vom Schlafsensor, HRV und Ruhepuls vom optischen Pulssensor) sowie ein Laborwert aus deiner ePA (Vitamin D, 25-OH, 12.03.2026). Das Modell vergleicht erholte und unerholte Nächte und setzt das Schlafmuster in Beziehung zum dokumentierten Vitamin-D-Status. Es stellt keine Diagnose. Der Hinweis ist als Anstoß zur Selbstbeobachtung gedacht.",
    faktoren: [
      { label: "Tiefschlaf & Schlafdauer", gewicht: 0.4, quelleRef: "Wearable Schlafsensor, 14 Tage", sourceKey: "wearable-schlaf" },
      { label: "HRV", gewicht: 0.25, quelleRef: "Wearable optischer Pulssensor, 14 Tage", sourceKey: "wearable-hrv" },
      { label: "Vitamin D (ePA)", gewicht: 0.2, quelleRef: "ePA Laborwert, 12.03.2026", sourceKey: "epa-labor" },
      { label: "Ruhepuls", gewicht: 0.15, quelleRef: "Wearable optischer Pulssensor, 30 Tage", sourceKey: "wearable-puls" },
    ],
    kontrafaktisch: {
      faktorLabel: "Schlafdauer",
      einheit: "h pro Nacht",
      aktuell: 6.7,
      min: 4,
      max: 9,
      schritt: 0.5,
      wirkung: (wert: number) => {
        if (wert >= 7.5)
          return `Bei rund ${de(wert)} h Schlaf pro Nacht wäre ein Erholungs-Hinweis voraussichtlich nicht nötig. Dein Tiefschlaf hätte mehr Zeit, sich aufzubauen, und deine HRV würde steigen.`;
        if (wert >= 6.5)
          return `Bei rund ${de(wert)} h pro Nacht liegt deine Schlafdauer im empfohlenen Bereich. Der Hinweis fällt dann deutlich entspannter aus.`;
        if (wert >= 5.5)
          return `Bei rund ${de(wert)} h pro Nacht bleibt die Erholung knapp. Ein ruhiger Blick auf deine Abendroutine kann sich lohnen.`;
        return `Bei rund ${de(wert)} h pro Nacht ist die Erholung dauerhaft niedrig. Mehr Schlaf würde den Hinweis voraussichtlich abschwächen.`;
      },
    },
    unsicher: false,
    quellen: [
      { art: "wearable", label: "Tiefschlaf & Schlafdauer", sourceKey: "wearable-schlaf", period: "letzte 14 Tage", sensor: "Schlafsensor (Smartwatch)" },
      { art: "wearable", label: "HRV", sourceKey: "wearable-hrv", period: "letzte 14 Tage", sensor: "optischer Pulssensor" },
      { art: "epa", label: "Vitamin D (25-OH) 24 ng/ml", sourceKey: "epa-labor", date: "2026-03-12", issuer: "Labor MVZ Bochum" },
      { art: "wearable", label: "Ruhepuls", sourceKey: "wearable-puls", period: "letzte 30 Tage", sensor: "optischer Pulssensor" },
    ],
    datengrundlage: {
      epa: [
        { label: "Vitamin D (25-OH)", wert: "24 ng/ml", status: "warn" },
        { label: "Blutdruck-Trend", wert: "leicht steigend", status: "warn" },
        { label: "Ferritin", wert: "18 µg/l", status: "neutral" },
      ],
      wearable: [
        { label: "Ø Tiefschlaf", wert: "16 %", status: "neutral" },
        { label: "Ø HRV", wert: "40 ms", status: "neutral" },
        { label: "Ø Schlaf-Score", wert: "67/100", status: "neutral" },
      ],
    },
    aktionen: [{ angebotId: "essen-schlaf-workshop" }, { angebotId: "kk-bonus" }],
    genutzteQuellen: ["wearable-schlaf", "wearable-hrv", "epa-labor", "wearable-puls"],
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // HERZ-KREISLAUF — Blutdruck-Trend (ePA Blutdruck/Cholesterin + Wearable)
  // ---------------------------------------------------------------------------
  {
    id: "kardio-blutdruck",
    szenario: "kardiometabolisch",
    titel: "Blutdruck-Trend beobachten",
    kurz: "Dein Blutdruck ist in 6 Monaten von 118 auf 128 mmHg gestiegen. In Kombination mit deinen Schlafdaten zeigt sich ein möglicher Zusammenhang.",
    begruendung:
      "Deine ePA dokumentiert über sechs Monate einen systolischen Blutdruck-Anstieg von 118 auf 128 mmHg (zuletzt 124 mmHg) — noch im oberen Normbereich. Dein Ruhepuls aus dem Wearable ist mit 60 BPM stabil und gut, steigt aber an Nächten mit wenig Tiefschlaf um rund 4 BPM. Schlafmangel erhöht kurzfristig den Ruhepuls und kann langfristig den Blutdruck beeinflussen. Dein leicht steigender Blutdruck-Trend aus der ePA und das Schlafmuster aus dem Wearable ergeben zusammen einen Hinweis, den keine der beiden Quellen allein liefern würde.",
    detail:
      "Grundlage sind ein ePA-Vitalwert (Blutdruck-Messreihe, Hausarztpraxis Dr. Koch), ein ePA-Laborwert (Cholesterin gesamt 198 mg/dl, Labor MVZ Bochum) und der Wearable-Ruhepuls der letzten 30 Tage. Da es um einen Trend einzelner Praxismessungen geht, ist die Modellkonfidenz bewusst niedrig — ein einzelner Wert kann tagesform­abhängig sein. Deshalb ist dieser Hinweis als unsicher gekennzeichnet und ersetzt keine ärztliche Einordnung.",
    faktoren: [
      { label: "Blutdruck-Trend (ePA)", gewicht: 0.4, quelleRef: "ePA Vitalwert, 6-Monats-Reihe", sourceKey: "epa-vitalwerte" },
      { label: "Ruhepuls (Wearable)", gewicht: 0.25, quelleRef: "Wearable optischer Pulssensor, 30 Tage", sourceKey: "wearable-puls" },
      { label: "Cholesterin (ePA)", gewicht: 0.2, quelleRef: "ePA Laborwert, 12.03.2026", sourceKey: "epa-labor" },
      { label: "Schlafqualität", gewicht: 0.15, quelleRef: "Wearable Schlafsensor, 14 Tage", sourceKey: "wearable-schlaf" },
    ],
    kontrafaktisch: {
      faktorLabel: "Aktive Minuten pro Woche",
      einheit: "min pro Woche",
      aktuell: 150,
      min: 0,
      max: 300,
      schritt: 30,
      wirkung: (wert: number) => {
        if (wert >= 150)
          return `Mit rund ${de(wert)} aktiven Minuten pro Woche erreichst du die gängige Bewegungsempfehlung. Das wirkt sich erfahrungsgemäß günstig auf Ruhepuls und Blutdruck-Trend aus.`;
        if (wert >= 90)
          return `Mit rund ${de(wert)} aktiven Minuten pro Woche bist du auf einem guten Weg. Etwas mehr Bewegung könnte den oberen Normbereich zusätzlich entlasten.`;
        if (wert >= 30)
          return `Mit rund ${de(wert)} aktiven Minuten pro Woche ist die Bewegung noch gering. Schon etwas mehr Aktivität würde den Hinweis voraussichtlich abschwächen.`;
        return `Mit rund ${de(wert)} aktiven Minuten pro Woche findet kaum Bewegung statt. Regelmäßige Aktivität wäre hier der wirksamste Hebel.`;
      },
    },
    unsicher: true,
    quellen: [
      { art: "epa", label: "Blutdruck 118→128 mmHg", sourceKey: "epa-vitalwerte", date: "2026-03-12", issuer: "Hausarztpraxis Dr. Koch, Bochum" },
      { art: "epa", label: "Cholesterin gesamt 198 mg/dl", sourceKey: "epa-labor", date: "2026-03-12", issuer: "Labor MVZ Bochum" },
      { art: "wearable", label: "Ruhepuls", sourceKey: "wearable-puls", period: "letzte 30 Tage", sensor: "optischer Pulssensor" },
      { art: "wearable", label: "Schlafqualität", sourceKey: "wearable-schlaf", period: "letzte 14 Tage", sensor: "Schlafsensor (Smartwatch)" },
    ],
    datengrundlage: {
      epa: [
        { label: "Blutdruck", wert: "118 → 128 mmHg", status: "warn" },
        { label: "Cholesterin", wert: "198 mg/dl", status: "neutral" },
      ],
      wearable: [
        { label: "Ø Ruhepuls", wert: "60 BPM", status: "neutral" },
        { label: "HRV bei Schlechtnacht", wert: "29 ms", status: "warn" },
      ],
    },
    aktionen: [{ angebotId: "herz-check-ruhr" }],
    genutzteQuellen: ["epa-vitalwerte", "wearable-puls", "epa-labor", "wearable-schlaf"],
    normwertHinweis: "Normbereich: < 130/85 mmHg · Optimal: < 120/80 mmHg",
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // REISE — Thailand-Impfschutz (ePA Impfstatus + Nutzereingabe Reiseziel)
  // ---------------------------------------------------------------------------
  {
    id: "reise-impfung",
    szenario: "reise",
    titel: "Thailand-Reise: Impfschutz prüfen",
    kurz: "Für deine Reise nach Thailand in 6 Wochen fehlen laut ePA-Impfstatus Hepatitis A und Hepatitis B.",
    begruendung:
      "Aus deiner Reiseplanung (Ziel Thailand, Abreise am 15.08.2026) und deinem ePA-Impfstatus ergibt sich ein präzises Impfprofil: Für Thailand werden Hepatitis A und Hepatitis B empfohlen — zu beiden liegt in deiner ePA kein Eintrag vor. Deine letzte Tetanus-Auffrischung (2017) liegt zudem fast am Ende des üblichen Zehn-Jahres-Intervalls. Erst die Kombination aus deinem Reiseziel und deinem dokumentierten Impfstatus macht diese Lücken sichtbar.",
    detail:
      "Grundlage sind eine hinterlegte Reiseziel-Regel (Empfehlung nach STIKO-naher Logik) und der Impfstatus aus deiner ePA (Tetanus 20.08.2017; Hepatitis A und Hepatitis B: kein Eintrag). Anders als bei datengetriebenen Hinweisen beruht dieser Hinweis auf klaren Wenn-Dann-Regeln. Eine kontrafaktische Betrachtung bezieht sich hier nur auf den zeitlichen Vorlauf bis zur Abreise.",
    faktoren: [
      { label: "Reiseziel-Regel: Hep. A & B empfohlen", gewicht: 0.6, quelleRef: "Reiseziel-Regel (STIKO-nah)" },
      { label: "ePA-Impfstatus: keine Hep.-Einträge", gewicht: 0.4, quelleRef: "ePA Impfungen", sourceKey: "epa-impfungen" },
    ],
    kontrafaktisch: {
      faktorLabel: "Wochen bis zur Abreise",
      einheit: "Wochen",
      aktuell: 6,
      min: 1,
      max: 12,
      schritt: 1,
      wirkung: (wert: number) => {
        if (wert <= 2)
          return `Noch rund ${de(wert)} Woche(n) bis zur Abreise: Eine Hepatitis-A-Impfung sollte jetzt zeitnah besprochen werden, damit der Schutz rechtzeitig aufgebaut ist.`;
        if (wert <= 6)
          return `Noch rund ${de(wert)} Wochen bis zur Abreise: Es bleibt genug Zeit, die Impfungen in Ruhe mit deiner Hausarztpraxis zu planen.`;
        return `Noch rund ${de(wert)} Wochen bis zur Abreise: Reichlich Vorlauf — du kannst den Impfschutz ganz entspannt vorbereiten.`;
      },
    },
    unsicher: false,
    quellen: [
      { art: "epa", label: "Tetanus-Auffrischung", sourceKey: "epa-impfungen", date: "2017-08-20", issuer: "Hausarztpraxis Dr. Koch, Bochum" },
      { art: "epa", label: "Hepatitis A (kein Eintrag)", sourceKey: "epa-impfungen", date: null, issuer: "kein Eintrag in der ePA" },
      { art: "epa", label: "Hepatitis B (kein Eintrag)", sourceKey: "epa-impfungen", date: null, issuer: "kein Eintrag in der ePA" },
    ],
    datengrundlage: {
      epa: [
        { label: "Hepatitis A", wert: "kein Eintrag", status: "warn" },
        { label: "Hepatitis B", wert: "kein Eintrag", status: "warn" },
        { label: "Tetanus", wert: "2017", status: "neutral" },
      ],
      wearable: [
        { label: "Reiseziel", wert: "Thailand", status: "info" },
        { label: "Abreise", wert: "15.08.2026", status: "info" },
      ],
      wearableLabel: "Reiseplanung",
      wearableArt: "user",
    },
    aktionen: [{ angebotId: "hausarzt-ansprechen" }, { angebotId: "reisemed-ruhr" }],
    genutzteQuellen: ["epa-impfungen"],
    synthetic: true,
  },
];

export const hinweisMap: Record<string, Hinweis> = Object.fromEntries(
  hinweise.map((h) => [h.id, h]),
);

// Reihenfolge für das Dashboard: lifestyle (Hauptpfad) zuerst.
export const hinweiseSortiert: Hinweis[] = [...hinweise].sort((a, b) => {
  const rang: Record<string, number> = { lifestyle: 0, kardiometabolisch: 1, reise: 2 };
  return rang[a.szenario] - rang[b.szenario];
});

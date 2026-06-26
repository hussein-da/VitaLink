import type { Hinweis } from "@/lib/types";

// Deutsche Zahlformatierung für die Wirkungstexte (Variante C).
function de(n: number): string {
  return n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

// Die drei Hinweis-Objekte, je einem Szenario zugeordnet. Alles synthetisch.
export const hinweise: Hinweis[] = [
  // ---------------------------------------------------------------------------
  // SZENARIO 3 - LIFESTYLE (Hauptpfad, am ausführlichsten)
  // ---------------------------------------------------------------------------
  {
    id: "lifestyle-schlaf",
    szenario: "lifestyle",
    titel: "Dein Schlaf zeigt seit zwei Wochen einen Abwärtstrend",
    kurz:
      "Deine Schlafdauer ist in den letzten 14 Tagen im Schnitt gesunken, gleichzeitig ist dein Ruhepuls leicht gestiegen. Das deutet auf weniger Erholung hin.",
    begruendung:
      "Im Vergleich der letzten 14 Tage liegt deine durchschnittliche Schlafdauer rund 0,8 Stunden unter dem Wert zu Beginn des Zeitraums. Parallel ist dein Ruhepuls von etwa 57 auf 64 bpm gestiegen und deine HRV leicht gefallen. Solche Muster treten oft gemeinsam auf, wenn der Körper weniger Erholung bekommt. Ein einzelner Wert sagt wenig aus, der gemeinsame Trend ist der eigentliche Hinweis.",
    detail:
      "Grundlage sind ausschließlich deine Wearable-Streams der letzten 14 Tage: Schlafdauer (Schlafsensor), Ruhepuls und HRV (optischer Pulssensor) sowie Aktivität (Beschleunigungssensor). Das Modell vergleicht den gleitenden Mittelwert der ersten und der letzten Tage und gewichtet die Faktoren nach ihrem Beitrag zum Erholungsmuster. Es stellt keine Diagnose und nutzt keine ePA-Daten. Der Hinweis ist als Anstoß zur Selbstbeobachtung gedacht, nicht als Bewertung.",
    faktoren: [
      { label: "Schlafdauer", gewicht: 0.45, quelleRef: "Wearable Schlafsensor, 14 Tage", sourceKey: "wearable-schlaf" },
      { label: "Ruhepuls", gewicht: 0.25, quelleRef: "Wearable optischer Pulssensor, 14 Tage", sourceKey: "wearable-puls" },
      { label: "HRV", gewicht: 0.2, quelleRef: "Wearable optischer Pulssensor, 14 Tage", sourceKey: "wearable-hrv" },
      { label: "Aktivität", gewicht: 0.1, quelleRef: "Wearable Beschleunigungssensor, 14 Tage", sourceKey: "wearable-aktivitaet" },
    ],
    kontrafaktisch: {
      faktorLabel: "Schlafdauer",
      einheit: "h pro Nacht",
      aktuell: 5.8,
      min: 4,
      max: 9,
      schritt: 0.5,
      wirkung: (wert: number) => {
        if (wert >= 7.5)
          return `Bei rund ${de(wert)} h Schlaf pro Nacht wäre ein Erholungs-Hinweis voraussichtlich nicht nötig. Dein Ruhepuls hätte nachts genug Zeit, sich zu senken.`;
        if (wert >= 6.5)
          return `Bei rund ${de(wert)} h pro Nacht liegt deine Schlafdauer im empfohlenen Bereich. Der Hinweis fällt dann deutlich entspannter aus.`;
        if (wert >= 5.5)
          return `Bei rund ${de(wert)} h pro Nacht bleibt die Erholung knapp. Ein ruhiger Blick auf deine Abendroutine kann sich lohnen.`;
        return `Bei rund ${de(wert)} h pro Nacht ist die Erholung dauerhaft niedrig. Mehr Schlaf würde den Hinweis voraussichtlich abschwächen.`;
      },
    },
    unsicher: false,
    quellen: [
      {
        art: "wearable",
        label: "Schlafdauer",
        sourceKey: "wearable-schlaf",
        period: "letzte 14 Tage",
        sensor: "Schlafsensor (Smartwatch)",
      },
      {
        art: "wearable",
        label: "Ruhepuls",
        sourceKey: "wearable-puls",
        period: "letzte 14 Tage",
        sensor: "optischer Pulssensor",
      },
      {
        art: "wearable",
        label: "HRV",
        sourceKey: "wearable-hrv",
        period: "letzte 14 Tage",
        sensor: "optischer Pulssensor",
      },
      {
        art: "wearable",
        label: "Aktivität",
        sourceKey: "wearable-aktivitaet",
        period: "letzte 14 Tage",
        sensor: "Beschleunigungssensor",
      },
    ],
    aktionen: [{ angebotId: "essen-schlaf-workshop" }, { angebotId: "kk-bonus" }],
    genutzteQuellen: ["wearable-schlaf", "wearable-puls", "wearable-hrv", "wearable-aktivitaet"],
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // SZENARIO 1 - KARDIOMETABOLISCH (Nebenpfad)
  // ---------------------------------------------------------------------------
  {
    id: "kardio-blutdruck",
    szenario: "kardiometabolisch",
    titel: "Dein Blutdruckwert liegt im oberen Normalbereich",
    kurz:
      "Der zuletzt in deiner ePA dokumentierte Blutdruck von 128/82 mmHg liegt im oberen Normbereich, und dein leicht steigender Ruhepuls-Trend passt dazu.",
    begruendung:
      "Ein Wert von 128/82 mmHg gilt als hochnormal: noch nicht erhöht, aber am oberen Rand des Normalen. Dieser Wert stammt aus einer einzelnen Messung in deiner ePA vom 14.03.2026. Dein zuletzt dokumentierter Cholesterinwert (195 mg/dl) liegt dabei noch im Normbereich, und dein Ruhepuls aus dem Wearable ist im 14-Tage-Trend leicht gestiegen. Diese Werte zusammen sind kein Grund zur Sorge, aber ein guter Anlass, Bewegung und Blutdruck gelegentlich im Blick zu behalten.",
    detail:
      "Grundlage sind ein ePA-Vitalwert (Blutdruck, Hausarztpraxis, 14.03.2026), ein ePA-Laborwert (Cholesterin gesamt, Labor MVZ Essen, 02.02.2026) und der Wearable-Ruhepuls der letzten 14 Tage. Da nur eine einzelne Blutdruckmessung vorliegt, ist die Modellkonfidenz bewusst niedrig - ein einzelner Praxiswert kann tagesform- oder situationsabhängig sein (zum Beispiel Aufregung vor der Messung). Deshalb ist dieser Hinweis ausdrücklich als unsicher gekennzeichnet und ersetzt keine ärztliche Einordnung.",
    faktoren: [
      { label: "Blutdruck (ePA)", gewicht: 0.4, quelleRef: "ePA Vitalwert, 14.03.2026", sourceKey: "epa-vitalwerte" },
      { label: "Ruhepuls (Wearable)", gewicht: 0.25, quelleRef: "Wearable optischer Pulssensor, 14 Tage", sourceKey: "wearable-puls" },
      { label: "Cholesterin (ePA)", gewicht: 0.2, quelleRef: "ePA Laborwert, 02.02.2026", sourceKey: "epa-labor" },
      { label: "Aktivität", gewicht: 0.15, quelleRef: "Wearable Beschleunigungssensor, 14 Tage", sourceKey: "wearable-aktivitaet" },
    ],
    kontrafaktisch: {
      faktorLabel: "Aktive Minuten pro Woche",
      einheit: "min pro Woche",
      aktuell: 90,
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
      {
        art: "epa",
        label: "Blutdruck 128/82 mmHg",
        sourceKey: "epa-vitalwerte",
        date: "2026-03-14",
        issuer: "Hausarztpraxis Essen-Rüttenscheid",
      },
      {
        art: "epa",
        label: "Cholesterin gesamt 195 mg/dl",
        sourceKey: "epa-labor",
        date: "2026-02-02",
        issuer: "Labor MVZ Essen",
      },
      {
        art: "wearable",
        label: "Ruhepuls",
        sourceKey: "wearable-puls",
        period: "letzte 14 Tage",
        sensor: "optischer Pulssensor",
      },
      {
        art: "wearable",
        label: "Aktivität",
        sourceKey: "wearable-aktivitaet",
        period: "letzte 14 Tage",
        sensor: "Beschleunigungssensor",
      },
    ],
    aktionen: [{ angebotId: "herz-check-ruhr" }],
    genutzteQuellen: ["epa-vitalwerte", "epa-labor", "wearable-puls", "wearable-aktivitaet"],
    normwertHinweis: "Normbereich: < 130/85 mmHg · Optimal: < 120/80 mmHg",
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // SZENARIO 2 - REISE & IMPFUNG (Nebenpfad, regelbasiert)
  // ---------------------------------------------------------------------------
  {
    id: "reise-impfung",
    szenario: "reise",
    titel: "Vor deiner Reise: ein Impfschutz fehlt",
    kurz:
      "Für dein Reiseziel wird Hepatitis A empfohlen. In deiner ePA ist dazu kein Eintrag hinterlegt. Eine Tetanus-Auffrischung ist außerdem bald fällig.",
    begruendung:
      "Dieser Hinweis ist regelbasiert, nicht statistisch: Eine Reiseziel-Regel ordnet deinem Ziel die Empfehlung Hepatitis A zu. Ein Abgleich mit deinem ePA-Impfstatus zeigt, dass dazu kein Eintrag vorliegt. Zusätzlich liegt deine letzte Tetanus-Auffrischung (2017) über neun Jahre zurück, die übliche Auffrischung wird nach rund zehn Jahren empfohlen. Beides sind Hinweise zur Planung, keine Diagnosen.",
    detail:
      "Grundlage sind eine hinterlegte Reiseziel-Regel (Empfehlung nach STIKO-naher Logik) und der Impfstatus aus deiner ePA (Tetanus 20.08.2017; Hepatitis A: kein Eintrag). Anders als bei den datengetriebenen Hinweisen beruht dieser Hinweis auf klaren Wenn-Dann-Regeln. Eine kontrafaktische Was-wäre-wenn-Betrachtung bezieht sich hier sinnvoll nur auf den zeitlichen Vorlauf bis zur Abreise, nicht auf gewichtete Modellfaktoren - das ist ein bewusster, beschreibbarer Unterschied zwischen regelbasierten und modellbasierten Hinweisen.",
    faktoren: [
      { label: "Reiseziel-Regel: Hepatitis A empfohlen", gewicht: 0.6, quelleRef: "Reiseziel-Regel (STIKO-nah)" },
      { label: "ePA-Impfstatus: kein Hepatitis-A-Eintrag", gewicht: 0.4, quelleRef: "ePA Impfungen", sourceKey: "epa-impfungen" },
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
          return `Noch rund ${de(wert)} Wochen bis zur Abreise: Es bleibt genug Zeit, die Impfung in Ruhe mit deiner Hausarztpraxis zu planen.`;
        return `Noch rund ${de(wert)} Wochen bis zur Abreise: Reichlich Vorlauf - du kannst den Impfschutz ganz entspannt vorbereiten.`;
      },
    },
    unsicher: false,
    quellen: [
      {
        art: "epa",
        label: "Tetanus-Auffrischung",
        sourceKey: "epa-impfungen",
        date: "2017-08-20",
        issuer: "Hausarztpraxis Essen-Rüttenscheid",
      },
      {
        art: "epa",
        label: "Hepatitis A (kein Eintrag)",
        sourceKey: "epa-impfungen",
        date: null,
        issuer: "kein Eintrag in der ePA",
      },
    ],
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

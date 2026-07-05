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
    titel: "Schlafqualität & Erholung",
    kurz: "Deine Apple Watch Series 12 zeigt, dass dein Tiefschlaf unter der Woche auf unter 12 % sinkt — vor allem nach dem Donnerstag-Abendtraining. Deine HRV an diesen Nächten bestätigt das Muster.",
    begruendung:
      "Deine Apple Watch Series 12 misst von Montag bis Donnerstag einen Tiefschlaf-Anteil von nur 10–13 %, und deine HRV liegt an diesen Nächten bei rund 29 ms statt 45 ms an erholten Nächten. Besonders nach deinem Donnerstag-Abendtraining fällt der Tiefschlaf spürbar ab. An Abenden mit ruhiger Routine — etwa Freitag und Sonntag — steigt deine HRV über 43 ms und dein Tiefschlaf-Anteil deutlich. Über die zwei Wochen macht die Apple Watch Series 12 dieses Muster klar sichtbar; einzelne Nächte allein hätten es nicht gezeigt.",
    detail:
      "Grundlage sind deine Wearable-Streams der letzten 14 Tage: Tiefschlaf-Anteil und Schlafdauer vom Schlafsensor, HRV und Ruhepuls vom optischen Pulssensor. Das Modell vergleicht erholte und unerholte Nächte und ordnet sie deinen Abendaktivitäten zu. Es stellt keine Diagnose. Der Hinweis ist als Anstoß zur Selbstbeobachtung gedacht.",
    faktoren: [
      { label: "Tiefschlaf & Schlafdauer", gewicht: 0.5, quelleRef: "Wearable Schlafsensor, 14 Tage", sourceKey: "wearable-schlaf" },
      { label: "HRV", gewicht: 0.3, quelleRef: "Wearable optischer Pulssensor, 14 Tage", sourceKey: "wearable-hrv" },
      { label: "Ruhepuls", gewicht: 0.2, quelleRef: "Wearable optischer Pulssensor, 30 Tage", sourceKey: "wearable-puls" },
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
      { art: "wearable", label: "Tiefschlaf & Schlafdauer", sourceKey: "wearable-schlaf", period: "letzte 14 Tage", sensor: "Schlafsensor (Apple Watch Series 12)" },
      { art: "wearable", label: "HRV", sourceKey: "wearable-hrv", period: "letzte 14 Tage", sensor: "optischer Pulssensor" },
      { art: "wearable", label: "Ruhepuls", sourceKey: "wearable-puls", period: "letzte 30 Tage", sensor: "optischer Pulssensor" },
    ],
    datengrundlage: {
      epa: [
        { label: "Blutdruck-Trend", wert: "leicht steigend", status: "warn", herkunftId: "blutdruck" },
        { label: "Ferritin", wert: "18 µg/l", status: "neutral", herkunftId: "ferritin" },
      ],
      wearable: [
        { label: "Ø Tiefschlaf", wert: "16 %", status: "neutral", herkunftId: "tiefschlaf" },
        { label: "Ø HRV", wert: "40 ms", status: "neutral", herkunftId: "hrv" },
        { label: "Ø Schlaf-Score", wert: "67/100", status: "neutral", herkunftId: "schlafscore" },
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
    titel: "Herzgesundheit",
    kurz: "Dein Blutdruck ist in 6 Monaten von 118 auf 128 mmHg gestiegen. In Kombination mit deinen Schlafdaten zeigt sich ein möglicher Zusammenhang.",
    begruendung:
      "Deine ePA dokumentiert über sechs Monate einen systolischen Blutdruck-Anstieg von 118 auf 128 mmHg (zuletzt 124 mmHg) — noch im oberen Normbereich. Dein Ruhepuls aus deiner Apple Watch Series 12 ist mit 60 BPM stabil und gut, steigt aber an Nächten mit wenig Tiefschlaf um rund 4 BPM. Schlafmangel erhöht kurzfristig den Ruhepuls und kann langfristig den Blutdruck beeinflussen. Dein leicht steigender Blutdruck-Trend aus der ePA und das Schlafmuster aus deiner Apple Watch Series 12 ergeben zusammen einen Hinweis, den keine der beiden Quellen allein liefern würde.",
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
      { art: "wearable", label: "Schlafqualität", sourceKey: "wearable-schlaf", period: "letzte 14 Tage", sensor: "Schlafsensor (Apple Watch Series 12)" },
    ],
    datengrundlage: {
      epa: [
        { label: "Blutdruck", wert: "118 → 128 mmHg", status: "warn", herkunftId: "blutdruck" },
        { label: "Cholesterin", wert: "198 mg/dl", status: "neutral", herkunftId: "cholesterin" },
      ],
      wearable: [
        { label: "Ø Ruhepuls", wert: "60 BPM", status: "neutral", herkunftId: "ruhepuls" },
        { label: "HRV bei Schlechtnacht", wert: "29 ms", status: "warn", herkunftId: "hrv" },
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
        { label: "Hepatitis A", wert: "kein Eintrag", status: "warn", herkunftId: "hepatitis-a" },
        { label: "Hepatitis B", wert: "kein Eintrag", status: "warn", herkunftId: "hepatitis-b" },
        { label: "Tetanus", wert: "2017", status: "neutral", herkunftId: "tetanus" },
      ],
      wearable: [
        { label: "Reiseziel", wert: "Thailand", status: "info", herkunftId: "reiseziel" },
        { label: "Abreise", wert: "15.08.2026", status: "info", herkunftId: "reiseziel" },
      ],
      wearableLabel: "Reiseplanung",
      wearableArt: "user",
    },
    aktionen: [{ angebotId: "hausarzt-ansprechen" }, { angebotId: "reisemed-ruhr" }],
    genutzteQuellen: ["epa-impfungen"],
    dringlichkeit: "2026-08-15",
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // ZAHNARZT — Vorsorge-Termin (nur ePA)
  // ---------------------------------------------------------------------------
  {
    id: "zahnarzt",
    szenario: "vorsorge",
    titel: "Zahnarzttermin Juli 2026",
    kurz: "VitaLink liest deinen Zahnarzt-Eintrag aus deiner ePA und berechnet daraus den nächsten empfohlenen Termin. Das GKV-Standardintervall beträgt 6 Monate. Da dein letzter Besuch am 27. Januar 2026 war, ist der 28. Juli das empfohlene Datum. Diese Erinnerung ist eine der einfachsten Stärken der ePA — Vorsorge-Termine werden nicht vergessen.",
    begruendung:
      "Der letzte dokumentierte Zahnarztbesuch (27.01.2026, Professionelle Zahnreinigung, Befund unauffällig) liegt 5 Monate zurück. Das Standard-GKV-Recall-Intervall von 6 Monaten führt zu einem empfohlenen Nächsttermin am 28.07.2026. Durch die Kombination von ePA-Datum und Recall-Regel kann VitaLink Erinnerungen ohne Wearable-Daten generieren.",
    detail:
      "Grundlage: ePA-Eintrag Zahnarztpraxis Dr. Maier, Bochum-Innenstadt, 27.01.2026. Berechnungsregel: letztes Besuchsdatum + 6 Monate = empfohlenes nächstes Datum. Das Intervall entspricht dem GKV-Bonusheft-Empfehlungsrahmen. Kein Wearable-Anteil. Regelbasiert, keine ML-Komponente.",
    faktoren: [
      { label: "ePA-Datum letzter Besuch", gewicht: 0.7, quelleRef: "ePA Vorsorge", sourceKey: "epa-vorsorge" },
      { label: "GKV-Intervall 6 Monate", gewicht: 0.3, quelleRef: "Recall-Regel" },
    ],
    unsicher: false,
    quellen: [
      { art: "epa", label: "Zahnarztbesuch 27.01.2026", sourceKey: "epa-vorsorge", date: "2026-01-27", issuer: "Zahnarztpraxis Dr. Maier, Bochum-Innenstadt" },
    ],
    datengrundlage: {
      epa: [
        { label: "Letzter Besuch", wert: "27.01.2026", status: "neutral", herkunftId: "zahnarzt" },
        { label: "Befund", wert: "unauffällig", status: "ok", herkunftId: "zahnarzt" },
        { label: "Nächster Termin", wert: "28.07.2026", status: "warn", herkunftId: "zahnarzt" },
        { label: "Praxis", wert: "Dr. Maier, Bochum", status: "neutral", herkunftId: "zahnarzt" },
      ],
      wearable: [],
    },
    aktionen: [],
    genutzteQuellen: ["epa-vorsorge"],
    dringlichkeit: "2026-07-28",
    aehnlicheTermine: [
      { titel: "Blutbild", zuletzt: "12.03.2026", naechstes: "September 2026", status: "ok" },
      { titel: "Gynäkologie", zuletzt: "24.07.2025", naechstes: "Juli 2026", status: "bald" },
      { titel: "Hautkrebs-Screening", naechstes: "empfohlen ab sofort", status: "fehlt" },
      { titel: "Augenarzt", zuletzt: "2024", naechstes: "2026", status: "ok" },
    ],
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // GLUKOSE — Blutzucker & Stoffwechsel (ePA Laborwerte + Apple Watch Series 12)
  // ---------------------------------------------------------------------------
  {
    id: "glukose",
    szenario: "stoffwechsel",
    titel: "Blutzucker & Stoffwechsel",
    kurz: "Deine Apple Watch Series 12 misst kontinuierlich deinen Gewebezucker über optische Sensoren und kalibriert die Werte gegen deinen ePA-Laborwert (94 mg/dl, März 2026). VitaLink erkennt dabei, dass dein Schlaf den größten Einfluss auf deine Glukosewerte hat — mehr als Ernährung oder Sport allein. Weder ePA noch Wearable hätten diesen Zusammenhang allein sichtbar gemacht.",
    begruendung:
      "Die Apple Watch Series 12 misst seit 8 Wochen kontinuierlich deinen Gewebezucker als Trendindikator (kombinierter Infrarot-PPG-Algorithmus). Nach Nächten mit weniger als 6,5 h Schlaf steigt dein Mittagspeak auf Ø 154 mg/dl — nach erholten Nächten sind es nur 134 mg/dl. Diese 20 mg/dl Differenz ist konsistent über alle gemessenen Schlechtnächte. An deinen 4 Trainingstagen sinkt der Abend-Glukosewert im Schnitt um 11 mg/dl gegenüber trainingsfreien Tagen.",
    detail:
      "Grundlage: Wearable-Glukose-Trendindikator der Apple Watch Series 12 (letzte 14 Tage), kalibriert gegen ePA-Laborwert Nüchternblutzucker 94 mg/dl und HbA1c 5,4 % (Labor MVZ Bochum, 12.03.2026). Messmodus: nicht-invasiv, optischer Algorithmus — kein klinisch zertifizierter Absolutwert, sondern validierter Trendindikator. Die Schlaf-Glukose-Korrelation basiert auf automatischer Klassifikation der Nächte nach Tiefschlafanteil. Synthetische Daten, kein Medizinprodukt.",
    faktoren: [
      { label: "Schlafqualität", gewicht: 0.5, quelleRef: "Wearable Schlafsensor, 14 Tage", sourceKey: "wearable-schlaf" },
      { label: "Glukose-Trendindikator", gewicht: 0.3, quelleRef: "Apple Watch Series 12, 14 Tage", sourceKey: "wearable-glukose" },
      { label: "Nüchternblutzucker (ePA)", gewicht: 0.2, quelleRef: "ePA Laborwert 12.03.2026", sourceKey: "epa-labor" },
    ],
    kontrafaktisch: {
      faktorLabel: "Sporttage pro Woche",
      einheit: "Tage",
      aktuell: 4,
      min: 0,
      max: 7,
      schritt: 1,
      wirkung: (wert: number) => {
        if (wert >= 7)
          return "Mit täglicher Bewegung könnte dein Abend-Blutzuckerwert auf geschätzte 88 mg/dl sinken — deutlich stabiler.";
        if (wert >= 4)
          return `Bei ${de(wert)} Trainingstagen liegt dein Ø Abend-Blutzuckerwert bei 96 mg/dl — unter dem Wert an trainingsfreien Tagen.`;
        if (wert >= 1)
          return "Mit nur 1–2 Trainingstagen steigt der geschätzte Abend-Wert auf 104–107 mg/dl — das Muster aus deinen Daten deutet das an.";
        return "Ohne Bewegung könnten deine Abend-Werte auf über 110 mg/dl steigen, basierend auf deinem aktuellen Datenmuster.";
      },
    },
    unsicher: false,
    quellen: [
      { art: "wearable", label: "Glukose-Trendindikator", sourceKey: "wearable-glukose", period: "letzte 14 Tage", sensor: "optischer Sensor (Apple Watch Series 12)" },
      { art: "epa", label: "Nüchternblutzucker 94 mg/dl", sourceKey: "epa-labor", date: "2026-03-12", issuer: "Labor MVZ Bochum" },
      { art: "epa", label: "HbA1c 5,4 %", sourceKey: "epa-labor", date: "2026-03-12", issuer: "Labor MVZ Bochum" },
      { art: "wearable", label: "Schlafqualität", sourceKey: "wearable-schlaf", period: "letzte 14 Tage", sensor: "Schlafsensor (Apple Watch Series 12)" },
    ],
    datengrundlage: {
      epa: [
        { label: "Nüchternblutzucker", wert: "94 mg/dl", status: "ok", herkunftId: "nuechternblutzucker" },
        { label: "HbA1c", wert: "5,4 %", status: "ok", herkunftId: "hba1c" },
      ],
      wearable: [
        { label: "Ø Nüchternwert (14 T.)", wert: "90 mg/dl", status: "ok", herkunftId: "glukose" },
        { label: "Postprandialer Peak Ø", wert: "143 mg/dl", status: "neutral", herkunftId: "glukose" },
        { label: "Peak Schlechtnacht", wert: "154 mg/dl", status: "warn", herkunftId: "glukose" },
        { label: "Variabilität (CV)", wert: "18 %", status: "neutral", herkunftId: "glukose" },
      ],
      wearableLabel: "Apple Watch Series 12",
    },
    aktionen: [],
    genutzteQuellen: ["wearable-glukose", "epa-labor", "wearable-schlaf"],
    dringlichkeit: null,
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // VITALITÄT — Sonne & Vitamin D (ePA Vitamin D/Ferritin + Wearable Aktivität)
  // ---------------------------------------------------------------------------
  {
    id: "vitamin-d",
    szenario: "vitalitaet",
    titel: "Vitamin D & Tageslicht",
    kurz: "Dein Vitamin-D-Wert liegt mit 24 ng/ml leicht unter dem Optimum. Zusammen mit deinen niedrigen Werktags-Schritten zeigt sich: Die Junisonne mittags bringt Sonne und Bewegung in einem.",
    begruendung:
      "Deine ePA dokumentiert einen Vitamin-D-Wert von 24 ng/ml (Optimum 30–60) — leicht defizitär, obwohl du seit Januar täglich 1.000 IE einnimmst. Deine Apple Watch Series 12 zeigt an Werktagen nur Ø 10.800 Schritte, am Wochenende dagegen 15.700; unter der Woche sitzt du im Schnitt 6,2 Stunden am Stück. Gleichzeitig ist es Juni — die Mittagssonne in Bochum reicht schon nach etwa 15 Minuten für eine spürbare Vitamin-D-Bildung. Erst die Kombination aus deinem Laborwert (ePA) und deinem Bewegungsmuster (Wearable) macht sichtbar, dass ein Mittagsspaziergang zwei Lücken auf einmal schließt.",
    detail:
      "Grundlage sind ein ePA-Laborwert (Vitamin D 25-OH, 24 ng/ml, 12.03.2026, Labor MVZ Bochum), dein dokumentiertes Vitamin-D-Präparat (1.000 IE seit 15.01.2026), dein Ferritin (18 µg/l) sowie deine Wearable-Aktivität der letzten 14 Tage (Schritte werktags und am Wochenende, aktivste Tagesstunde). Das Modell setzt deinen Vitamin-D-Status in Beziehung zu Bewegungsmuster und Jahreszeit. Es stellt keine Diagnose und ersetzt keine ärztliche Einschätzung.",
    faktoren: [
      { label: "Vitamin-D-Wert (ePA)", gewicht: 0.4, quelleRef: "ePA Laborwert, 12.03.2026", sourceKey: "epa-labor" },
      { label: "Werktags-Bewegung (Wearable)", gewicht: 0.3, quelleRef: "Wearable Beschleunigungssensor, 14 Tage", sourceKey: "wearable-aktivitaet" },
      { label: "Jahreszeit & Standort", gewicht: 0.2, quelleRef: "Regel (Juni, Bochum)" },
      { label: "Ferritin (ePA)", gewicht: 0.1, quelleRef: "ePA Laborwert, 12.03.2026", sourceKey: "epa-labor" },
    ],
    kontrafaktisch: {
      faktorLabel: "Tageslicht am Mittag",
      einheit: "Min pro Tag",
      aktuell: 15,
      min: 0,
      max: 60,
      schritt: 5,
      wirkung: (wert: number) => {
        if (wert >= 30)
          return `Bei rund ${de(wert)} Min Mittagssonne täglich bildet dein Körper im Juni spürbar Vitamin D — dein Wert würde sich mit der Zeit Richtung 30–60 ng/ml bewegen, ganz ohne höhere Dosis.`;
        if (wert >= 15)
          return `Bei rund ${de(wert)} Min Mittagssonne täglich ist im Juni schon eine merkliche Vitamin-D-Bildung möglich. Etwas mehr Zeit draußen würde den Effekt verstärken.`;
        if (wert >= 5)
          return `Bei rund ${de(wert)} Min Tageslicht am Mittag bleibt die Vitamin-D-Bildung gering. Ein paar Minuten mehr in der Sonne lohnen sich.`;
        return "Ohne Mittagssonne trägt vor allem dein Präparat zur Vitamin-D-Versorgung bei. Etwas Tageslicht würde zusätzlich helfen.";
      },
    },
    unsicher: false,
    quellen: [
      { art: "epa", label: "Vitamin D (25-OH) 24 ng/ml", sourceKey: "epa-labor", date: "2026-03-12", issuer: "Labor MVZ Bochum" },
      { art: "epa", label: "Ferritin 18 µg/l", sourceKey: "epa-labor", date: "2026-03-12", issuer: "Labor MVZ Bochum" },
      { art: "wearable", label: "Schritte (werktags/Wochenende)", sourceKey: "wearable-aktivitaet", period: "letzte 14 Tage", sensor: "Beschleunigungssensor" },
    ],
    datengrundlage: {
      epa: [
        { label: "Vitamin D (25-OH)", wert: "24 ng/ml", status: "warn", herkunftId: "vitamin-d" },
        { label: "Präparat", wert: "1.000 IE/Tag", status: "neutral", herkunftId: "vitamin-d-praeparat" },
        { label: "Ferritin", wert: "18 µg/l", status: "neutral", herkunftId: "ferritin" },
      ],
      wearable: [
        { label: "Schritte werktags", wert: "10.800", status: "neutral", herkunftId: "schritte" },
        { label: "Schritte Wochenende", wert: "15.700", status: "ok", herkunftId: "schritte" },
        { label: "Aktivste Stunde", wert: "12–13 Uhr", status: "info", herkunftId: "schritte" },
      ],
    },
    aktionen: [],
    genutzteQuellen: ["epa-labor", "wearable-aktivitaet"],
    normwertHinweis: "Optimaler Vitamin-D-Bereich: 30–60 ng/ml",
    dringlichkeit: null,
    synthetic: true,
  },
];

export const hinweisMap: Record<string, Hinweis> = Object.fromEntries(
  hinweise.map((h) => [h.id, h]),
);

/** Sortiert nach Dringlichkeit: konkrete Deadlines zuerst (aufsteigend), dann ongoing. */
function sortHinweiseByDringlichkeit(list: Hinweis[]): Hinweis[] {
  return [...list].sort((a, b) => {
    if (a.dringlichkeit && b.dringlichkeit) {
      return new Date(a.dringlichkeit).getTime() - new Date(b.dringlichkeit).getTime();
    }
    if (a.dringlichkeit) return -1;
    if (b.dringlichkeit) return 1;
    return 0;
  });
}

export const hinweiseSortiert: Hinweis[] = sortHinweiseByDringlichkeit(hinweise);

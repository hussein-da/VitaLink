import type {
  Datengrundlage,
  Datenpunkt,
  Faktor,
  Hinweis,
  Kontrafaktisch,
  Provenance,
  VorsorgeTermin,
} from "@/lib/types";
import type { Locale, Lokalisiert } from "@/i18n/types";
import { plural, zahl } from "@/i18n/format";

// ---------------------------------------------------------------------------
// Lokalisierte Quelldatentypen.
// Die oeffentlichen Typen aus @/lib/types bleiben unveraendert (reine strings);
// nur die Quelldaten hier sind zweisprachig und werden per Accessor aufgeloest.
// ---------------------------------------------------------------------------

interface FaktorQuelle extends Omit<Faktor, "label" | "quelleRef"> {
  label: Lokalisiert;
  quelleRef: Lokalisiert;
}

interface KontrafaktischQuelle
  extends Omit<Kontrafaktisch, "faktorLabel" | "einheit" | "wirkung"> {
  faktorLabel: Lokalisiert;
  einheit: Lokalisiert;
  /** Schwellenlogik unveraendert; nur die Rueckgabetexte sind zweisprachig. */
  wirkung: (wert: number, locale: Locale) => string;
}

interface ProvenanceQuelle
  extends Omit<Provenance, "label" | "period" | "sensor" | "issuer"> {
  label: Lokalisiert;
  period?: Lokalisiert;
  sensor?: Lokalisiert;
  /** Eigennamen stehen in beiden Sprachen gleich; nur Saetze wie "kein Eintrag" variieren. */
  issuer?: Lokalisiert;
}

interface DatenpunktQuelle extends Omit<Datenpunkt, "label" | "wert"> {
  label: Lokalisiert;
  wert: Lokalisiert;
}

interface DatengrundlageQuelle
  extends Omit<Datengrundlage, "epa" | "wearable" | "wearableLabel"> {
  epa: DatenpunktQuelle[];
  wearable: DatenpunktQuelle[];
  wearableLabel?: Lokalisiert;
}

interface VorsorgeTerminQuelle
  extends Omit<VorsorgeTermin, "titel" | "zuletzt" | "naechstes"> {
  titel: Lokalisiert;
  zuletzt?: Lokalisiert;
  naechstes?: Lokalisiert;
}

interface HinweisQuelle
  extends Omit<
    Hinweis,
    | "titel"
    | "kurz"
    | "begruendung"
    | "detail"
    | "faktoren"
    | "kontrafaktisch"
    | "quellen"
    | "normwertHinweis"
    | "datengrundlage"
    | "aehnlicheTermine"
  > {
  titel: Lokalisiert;
  kurz: Lokalisiert;
  begruendung: Lokalisiert;
  detail: Lokalisiert;
  faktoren: FaktorQuelle[];
  kontrafaktisch?: KontrafaktischQuelle;
  quellen: ProvenanceQuelle[];
  normwertHinweis?: Lokalisiert;
  datengrundlage?: DatengrundlageQuelle;
  aehnlicheTermine?: VorsorgeTerminQuelle[];
}

// Die sechs Hinweis-Objekte, je einem Szenario zugeordnet.
// USP: jede Empfehlung verbindet ePA (Arztdaten) + Wearable (Körperdaten).
const quellen: HinweisQuelle[] = [
  // ---------------------------------------------------------------------------
  // LIFESTYLE — Schlaf & Erholung (ePA Vitamin D + Wearable Schlaf/HRV)
  // ---------------------------------------------------------------------------
  {
    id: "lifestyle-schlaf",
    szenario: "lifestyle",
    titel: { de: "Schlafqualität & Erholung", en: "Sleep quality & recovery" },
    kurz: {
      de: "Deine Apple Watch Series 12 zeigt, dass dein Tiefschlaf unter der Woche auf unter 12 % sinkt — vor allem nach dem Donnerstag-Abendtraining. Deine HRV an diesen Nächten bestätigt das Muster.",
      en: "Your Apple Watch Series 12 shows that your deep sleep drops below 12 % during the week - above all after your Thursday evening workout. Your HRV on those nights confirms the pattern.",
    },
    begruendung: {
      de: "Deine Apple Watch Series 12 misst von Montag bis Donnerstag einen Tiefschlaf-Anteil von nur 10–13 %, und deine HRV liegt an diesen Nächten bei rund 29 ms statt 45 ms an erholten Nächten. Besonders nach deinem Donnerstag-Abendtraining fällt der Tiefschlaf spürbar ab. An Abenden mit ruhiger Routine — etwa Freitag und Sonntag — steigt deine HRV über 43 ms und dein Tiefschlaf-Anteil deutlich. Über die zwei Wochen macht die Apple Watch Series 12 dieses Muster klar sichtbar; einzelne Nächte allein hätten es nicht gezeigt.",
      en: "From Monday to Thursday your Apple Watch Series 12 measures a deep sleep share of only 10-13 %, and on those nights your HRV sits at around 29 ms instead of 45 ms on rested nights. Deep sleep drops noticeably above all after your Thursday evening workout. On evenings with a calm routine - Friday and Sunday, for example - your HRV rises above 43 ms and your deep sleep share climbs clearly. Across the two weeks the Apple Watch Series 12 makes this pattern easy to see; single nights on their own would not have shown it.",
    },
    detail: {
      de: "Grundlage sind deine Wearable-Streams der letzten 14 Tage: Tiefschlaf-Anteil und Schlafdauer vom Schlafsensor, HRV und Ruhepuls vom optischen Pulssensor. Das Modell vergleicht erholte und unerholte Nächte und ordnet sie deinen Abendaktivitäten zu. Es stellt keine Diagnose. Der Hinweis ist als Anstoß zur Selbstbeobachtung gedacht.",
      en: "This builds on your wearable streams from the past 14 days: deep sleep share and sleep duration from the sleep sensor, HRV and resting heart rate from the optical pulse sensor. The model compares rested and unrested nights and links them to your evening activities. It does not make a diagnosis. The insight is meant as a prompt to observe yourself.",
    },
    faktoren: [
      {
        label: { de: "Tiefschlaf & Schlafdauer", en: "Deep sleep & sleep duration" },
        gewicht: 0.5,
        quelleRef: { de: "Wearable Schlafsensor, 14 Tage", en: "Wearable sleep sensor, 14 days" },
        sourceKey: "wearable-schlaf",
      },
      {
        label: { de: "HRV", en: "HRV" },
        gewicht: 0.3,
        quelleRef: {
          de: "Wearable optischer Pulssensor, 14 Tage",
          en: "Wearable optical pulse sensor, 14 days",
        },
        sourceKey: "wearable-hrv",
      },
      {
        label: { de: "Ruhepuls", en: "Resting heart rate" },
        gewicht: 0.2,
        quelleRef: {
          de: "Wearable optischer Pulssensor, 30 Tage",
          en: "Wearable optical pulse sensor, 30 days",
        },
        sourceKey: "wearable-puls",
      },
    ],
    kontrafaktisch: {
      faktorLabel: { de: "Schlafdauer", en: "Sleep duration" },
      einheit: { de: "h pro Nacht", en: "h per night" },
      aktuell: 6.7,
      min: 4,
      max: 9,
      schritt: 0.5,
      wirkung: (wert: number, locale: Locale) => {
        if (wert >= 7.5)
          return locale === "de"
            ? `Bei rund ${zahl(wert, locale)} h Schlaf pro Nacht wäre ein Erholungs-Hinweis voraussichtlich nicht nötig. Dein Tiefschlaf hätte mehr Zeit, sich aufzubauen, und deine HRV würde steigen.`
            : `At around ${zahl(wert, locale)} h of sleep per night, a recovery insight would most likely not be needed. Your deep sleep would have more time to build up, and your HRV would rise.`;
        if (wert >= 6.5)
          return locale === "de"
            ? `Bei rund ${zahl(wert, locale)} h pro Nacht liegt deine Schlafdauer im empfohlenen Bereich. Der Hinweis fällt dann deutlich entspannter aus.`
            : `At around ${zahl(wert, locale)} h per night, your sleep duration is in the recommended range. The insight then reads far more relaxed.`;
        if (wert >= 5.5)
          return locale === "de"
            ? `Bei rund ${zahl(wert, locale)} h pro Nacht bleibt die Erholung knapp. Ein ruhiger Blick auf deine Abendroutine kann sich lohnen.`
            : `At around ${zahl(wert, locale)} h per night, recovery stays tight. A calm look at your evening routine may be worth it.`;
        return locale === "de"
          ? `Bei rund ${zahl(wert, locale)} h pro Nacht ist die Erholung dauerhaft niedrig. Mehr Schlaf würde den Hinweis voraussichtlich abschwächen.`
          : `At around ${zahl(wert, locale)} h per night, recovery stays low over time. More sleep would most likely soften the insight.`;
      },
    },
    unsicher: false,
    quellen: [
      {
        art: "wearable",
        label: { de: "Tiefschlaf & Schlafdauer", en: "Deep sleep & sleep duration" },
        sourceKey: "wearable-schlaf",
        period: { de: "letzte 14 Tage", en: "past 14 days" },
        sensor: {
          de: "Schlafsensor (Apple Watch Series 12)",
          en: "Sleep sensor (Apple Watch Series 12)",
        },
      },
      {
        art: "wearable",
        label: { de: "HRV", en: "HRV" },
        sourceKey: "wearable-hrv",
        period: { de: "letzte 14 Tage", en: "past 14 days" },
        sensor: { de: "optischer Pulssensor", en: "optical pulse sensor" },
      },
      {
        art: "wearable",
        label: { de: "Ruhepuls", en: "Resting heart rate" },
        sourceKey: "wearable-puls",
        period: { de: "letzte 30 Tage", en: "past 30 days" },
        sensor: { de: "optischer Pulssensor", en: "optical pulse sensor" },
      },
    ],
    datengrundlage: {
      epa: [
        {
          label: { de: "Blutdruck-Trend", en: "Blood pressure trend" },
          wert: { de: "leicht steigend", en: "rising slightly" },
          status: "warn",
          herkunftId: "blutdruck",
        },
        {
          label: { de: "Ferritin", en: "Ferritin" },
          wert: { de: "18 µg/l", en: "18 µg/l" },
          status: "neutral",
          herkunftId: "ferritin",
        },
      ],
      wearable: [
        {
          label: { de: "Ø Tiefschlaf", en: "Avg deep sleep" },
          wert: { de: "16 %", en: "16 %" },
          status: "neutral",
          herkunftId: "tiefschlaf",
        },
        {
          label: { de: "Ø HRV", en: "Avg HRV" },
          wert: { de: "40 ms", en: "40 ms" },
          status: "neutral",
          herkunftId: "hrv",
        },
        {
          label: { de: "Ø Schlaf-Score", en: "Avg sleep score" },
          wert: { de: "67/100", en: "67/100" },
          status: "neutral",
          herkunftId: "schlafscore",
        },
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
    titel: { de: "Herzgesundheit", en: "Heart health" },
    kurz: {
      de: "Dein Blutdruck ist in 6 Monaten von 118 auf 128 mmHg gestiegen. In Kombination mit deinen Schlafdaten zeigt sich ein möglicher Zusammenhang.",
      en: "Your blood pressure has risen from 118 to 128 mmHg over 6 months. Combined with your sleep data, a possible connection shows up.",
    },
    begruendung: {
      de: "Deine ePA dokumentiert über sechs Monate einen systolischen Blutdruck-Anstieg von 118 auf 128 mmHg (zuletzt 124 mmHg) — noch im oberen Normbereich. Dein Ruhepuls aus deiner Apple Watch Series 12 ist mit 60 BPM stabil und gut, steigt aber an Nächten mit wenig Tiefschlaf um rund 4 BPM. Schlafmangel erhöht kurzfristig den Ruhepuls und kann langfristig den Blutdruck beeinflussen. Dein leicht steigender Blutdruck-Trend aus der ePA und das Schlafmuster aus deiner Apple Watch Series 12 ergeben zusammen einen Hinweis, den keine der beiden Quellen allein liefern würde.",
      en: "Over six months, your ePA (Germany's electronic patient record) documents a systolic blood pressure rise from 118 to 128 mmHg (most recently 124 mmHg) - still in the upper part of the normal range. Your resting heart rate from your Apple Watch Series 12 is steady and good at 60 BPM, but on nights with little deep sleep it goes up by around 4 BPM. Too little sleep raises the resting heart rate in the short term and can affect blood pressure over time. Your slightly rising blood pressure trend from the ePA and the sleep pattern from your Apple Watch Series 12 together give an insight that neither source would deliver on its own.",
    },
    detail: {
      de: "Grundlage sind ein ePA-Vitalwert (Blutdruck-Messreihe, Hausarztpraxis Dr. Koch), ein ePA-Laborwert (Cholesterin gesamt 198 mg/dl, Labor MVZ Bochum) und der Wearable-Ruhepuls der letzten 30 Tage. Da es um einen Trend einzelner Praxismessungen geht, ist die Modellkonfidenz bewusst niedrig — ein einzelner Wert kann tagesform­abhängig sein. Deshalb ist dieser Hinweis als unsicher gekennzeichnet und ersetzt keine ärztliche Einordnung.",
      en: "This builds on one ePA vital sign (a series of blood pressure readings, Hausarztpraxis Dr. Koch), one ePA lab value (total cholesterol 198 mg/dl, Labor MVZ Bochum) and your wearable resting heart rate from the past 30 days. Because this is a trend from single readings at the practice, the model confidence is deliberately low - one reading can depend on the day. That is why this insight is marked as uncertain, and it does not replace a doctor's assessment.",
    },
    faktoren: [
      {
        label: { de: "Blutdruck-Trend (ePA)", en: "Blood pressure trend (ePA)" },
        gewicht: 0.4,
        quelleRef: { de: "ePA Vitalwert, 6-Monats-Reihe", en: "ePA vital sign, 6-month series" },
        sourceKey: "epa-vitalwerte",
      },
      {
        label: { de: "Ruhepuls (Wearable)", en: "Resting heart rate (wearable)" },
        gewicht: 0.25,
        quelleRef: {
          de: "Wearable optischer Pulssensor, 30 Tage",
          en: "Wearable optical pulse sensor, 30 days",
        },
        sourceKey: "wearable-puls",
      },
      {
        label: { de: "Cholesterin (ePA)", en: "Cholesterol (ePA)" },
        gewicht: 0.2,
        quelleRef: { de: "ePA Laborwert, 12.03.2026", en: "ePA lab value, 12 March 2026" },
        sourceKey: "epa-labor",
      },
      {
        label: { de: "Schlafqualität", en: "Sleep quality" },
        gewicht: 0.15,
        quelleRef: { de: "Wearable Schlafsensor, 14 Tage", en: "Wearable sleep sensor, 14 days" },
        sourceKey: "wearable-schlaf",
      },
    ],
    kontrafaktisch: {
      faktorLabel: { de: "Aktive Minuten pro Woche", en: "Active minutes per week" },
      einheit: { de: "min pro Woche", en: "min per week" },
      aktuell: 150,
      min: 0,
      max: 300,
      schritt: 30,
      wirkung: (wert: number, locale: Locale) => {
        if (wert >= 150)
          return locale === "de"
            ? `Mit rund ${zahl(wert, locale)} aktiven Minuten pro Woche erreichst du die gängige Bewegungsempfehlung. Das wirkt sich erfahrungsgemäß günstig auf Ruhepuls und Blutdruck-Trend aus.`
            : `With around ${zahl(wert, locale)} active minutes per week you meet the common movement recommendation. Experience shows that this does your resting heart rate and blood pressure trend good.`;
        if (wert >= 90)
          return locale === "de"
            ? `Mit rund ${zahl(wert, locale)} aktiven Minuten pro Woche bist du auf einem guten Weg. Etwas mehr Bewegung könnte den oberen Normbereich zusätzlich entlasten.`
            : `With around ${zahl(wert, locale)} active minutes per week you are on a good track. A bit more movement could ease the upper part of the normal range further.`;
        if (wert >= 30)
          return locale === "de"
            ? `Mit rund ${zahl(wert, locale)} aktiven Minuten pro Woche ist die Bewegung noch gering. Schon etwas mehr Aktivität würde den Hinweis voraussichtlich abschwächen.`
            : `With around ${zahl(wert, locale)} active minutes per week there is still little movement. Even a bit more activity would most likely soften the insight.`;
        return locale === "de"
          ? `Mit rund ${zahl(wert, locale)} aktiven Minuten pro Woche findet kaum Bewegung statt. Regelmäßige Aktivität wäre hier der wirksamste Hebel.`
          : `With around ${zahl(wert, locale)} active minutes per week there is hardly any movement. Regular activity would be the strongest lever here.`;
      },
    },
    unsicher: true,
    quellen: [
      {
        art: "epa",
        label: { de: "Blutdruck 118→128 mmHg", en: "Blood pressure 118→128 mmHg" },
        sourceKey: "epa-vitalwerte",
        date: "2026-03-12",
        issuer: {
          de: "Hausarztpraxis Dr. Koch, Bochum",
          en: "Hausarztpraxis Dr. Koch, Bochum",
        },
      },
      {
        art: "epa",
        label: { de: "Cholesterin gesamt 198 mg/dl", en: "Total cholesterol 198 mg/dl" },
        sourceKey: "epa-labor",
        date: "2026-03-12",
        issuer: { de: "Labor MVZ Bochum", en: "Labor MVZ Bochum" },
      },
      {
        art: "wearable",
        label: { de: "Ruhepuls", en: "Resting heart rate" },
        sourceKey: "wearable-puls",
        period: { de: "letzte 30 Tage", en: "past 30 days" },
        sensor: { de: "optischer Pulssensor", en: "optical pulse sensor" },
      },
      {
        art: "wearable",
        label: { de: "Schlafqualität", en: "Sleep quality" },
        sourceKey: "wearable-schlaf",
        period: { de: "letzte 14 Tage", en: "past 14 days" },
        sensor: {
          de: "Schlafsensor (Apple Watch Series 12)",
          en: "Sleep sensor (Apple Watch Series 12)",
        },
      },
    ],
    datengrundlage: {
      epa: [
        {
          label: { de: "Blutdruck", en: "Blood pressure" },
          wert: { de: "118 → 128 mmHg", en: "118 → 128 mmHg" },
          status: "warn",
          herkunftId: "blutdruck",
        },
        {
          label: { de: "Cholesterin", en: "Cholesterol" },
          wert: { de: "198 mg/dl", en: "198 mg/dl" },
          status: "neutral",
          herkunftId: "cholesterin",
        },
      ],
      wearable: [
        {
          label: { de: "Ø Ruhepuls", en: "Avg resting heart rate" },
          wert: { de: "60 BPM", en: "60 BPM" },
          status: "neutral",
          herkunftId: "ruhepuls",
        },
        {
          label: { de: "HRV bei Schlechtnacht", en: "HRV after a poor night" },
          wert: { de: "29 ms", en: "29 ms" },
          status: "warn",
          herkunftId: "hrv",
        },
      ],
    },
    aktionen: [{ angebotId: "herz-check-ruhr" }],
    genutzteQuellen: ["epa-vitalwerte", "wearable-puls", "epa-labor", "wearable-schlaf"],
    normwertHinweis: {
      de: "Normbereich: < 130/85 mmHg · Optimal: < 120/80 mmHg",
      en: "Normal range: < 130/85 mmHg · Optimal: < 120/80 mmHg",
    },
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // REISE — Thailand-Impfschutz (ePA Impfstatus + Nutzereingabe Reiseziel)
  // ---------------------------------------------------------------------------
  {
    id: "reise-impfung",
    szenario: "reise",
    titel: {
      de: "Thailand-Reise: Impfschutz prüfen",
      en: "Thailand trip: check your vaccinations",
    },
    kurz: {
      de: "Für deine Reise nach Thailand in 6 Wochen fehlen laut ePA-Impfstatus Hepatitis A und Hepatitis B.",
      en: "For your trip to Thailand in 6 weeks, the vaccination record in your ePA (Germany's electronic patient record) shows no entry for Hepatitis A and Hepatitis B.",
    },
    begruendung: {
      de: "Aus deiner Reiseplanung (Ziel Thailand, Abreise am 15.08.2026) und deinem ePA-Impfstatus ergibt sich ein präzises Impfprofil: Für Thailand werden Hepatitis A und Hepatitis B empfohlen — zu beiden liegt in deiner ePA kein Eintrag vor. Deine letzte Tetanus-Auffrischung (2017) liegt zudem fast am Ende des üblichen Zehn-Jahres-Intervalls. Erst die Kombination aus deinem Reiseziel und deinem dokumentierten Impfstatus macht diese Lücken sichtbar.",
      en: "Your travel plan (destination Thailand, departure on 15 August 2026) and your ePA vaccination record together give a precise vaccination profile: Hepatitis A and Hepatitis B are recommended for Thailand - and your ePA holds no entry for either. Your last tetanus booster (2017) is also close to the end of the usual ten-year interval. Only the combination of your destination and your documented vaccination record makes these gaps visible.",
    },
    detail: {
      de: "Grundlage sind eine hinterlegte Reiseziel-Regel (Empfehlung nach STIKO-naher Logik) und der Impfstatus aus deiner ePA (Tetanus 20.08.2017; Hepatitis A und Hepatitis B: kein Eintrag). Anders als bei datengetriebenen Hinweisen beruht dieser Hinweis auf klaren Wenn-Dann-Regeln. Eine kontrafaktische Betrachtung bezieht sich hier nur auf den zeitlichen Vorlauf bis zur Abreise.",
      en: "This builds on a stored destination rule (a recommendation that follows STIKO-style logic) and the vaccination record from your ePA (tetanus 20 August 2017; Hepatitis A and Hepatitis B: no entry). Unlike data-driven insights, this one rests on clear if-then rules. A \"What if\" view here only covers how much time is left before departure.",
    },
    faktoren: [
      {
        label: {
          de: "Reiseziel-Regel: Hep. A & B empfohlen",
          en: "Destination rule: Hep. A & B recommended",
        },
        gewicht: 0.6,
        quelleRef: { de: "Reiseziel-Regel (STIKO-nah)", en: "Destination rule (STIKO-style)" },
      },
      {
        label: {
          de: "ePA-Impfstatus: keine Hep.-Einträge",
          en: "ePA vaccination record: no Hep. entries",
        },
        gewicht: 0.4,
        quelleRef: { de: "ePA Impfungen", en: "ePA vaccinations" },
        sourceKey: "epa-impfungen",
      },
    ],
    kontrafaktisch: {
      faktorLabel: { de: "Wochen bis zur Abreise", en: "Weeks until departure" },
      einheit: { de: "Wochen", en: "weeks" },
      aktuell: 6,
      min: 1,
      max: 12,
      schritt: 1,
      wirkung: (wert: number, locale: Locale) => {
        if (wert <= 2)
          return locale === "de"
            ? `Noch rund ${zahl(wert, locale)} Woche(n) bis zur Abreise: Eine Hepatitis-A-Impfung sollte jetzt zeitnah besprochen werden, damit der Schutz rechtzeitig aufgebaut ist.`
            : plural(wert, locale, {
                one: "Around {n} week left before departure: it is worth talking about a Hepatitis A vaccination soon, so the protection builds up in time.",
                other:
                  "Around {n} weeks left before departure: it is worth talking about a Hepatitis A vaccination soon, so the protection builds up in time.",
              });
        if (wert <= 6)
          return locale === "de"
            ? `Noch rund ${zahl(wert, locale)} Wochen bis zur Abreise: Es bleibt genug Zeit, die Impfungen in Ruhe mit deiner Hausarztpraxis zu planen.`
            : `Around ${zahl(wert, locale)} weeks left before departure: there is enough time to plan the vaccinations calmly with your GP practice.`;
        return locale === "de"
          ? `Noch rund ${zahl(wert, locale)} Wochen bis zur Abreise: Reichlich Vorlauf — du kannst den Impfschutz ganz entspannt vorbereiten.`
          : `Around ${zahl(wert, locale)} weeks left before departure: plenty of lead time - you can sort out your vaccinations at an easy pace.`;
      },
    },
    unsicher: false,
    quellen: [
      {
        art: "epa",
        label: { de: "Tetanus-Auffrischung", en: "Tetanus booster" },
        sourceKey: "epa-impfungen",
        date: "2017-08-20",
        issuer: {
          de: "Hausarztpraxis Dr. Koch, Bochum",
          en: "Hausarztpraxis Dr. Koch, Bochum",
        },
      },
      {
        art: "epa",
        label: { de: "Hepatitis A (kein Eintrag)", en: "Hepatitis A (no entry)" },
        sourceKey: "epa-impfungen",
        date: null,
        issuer: { de: "kein Eintrag in der ePA", en: "no entry in the ePA" },
      },
      {
        art: "epa",
        label: { de: "Hepatitis B (kein Eintrag)", en: "Hepatitis B (no entry)" },
        sourceKey: "epa-impfungen",
        date: null,
        issuer: { de: "kein Eintrag in der ePA", en: "no entry in the ePA" },
      },
    ],
    datengrundlage: {
      epa: [
        {
          label: { de: "Hepatitis A", en: "Hepatitis A" },
          wert: { de: "kein Eintrag", en: "no entry" },
          status: "warn",
          herkunftId: "hepatitis-a",
        },
        {
          label: { de: "Hepatitis B", en: "Hepatitis B" },
          wert: { de: "kein Eintrag", en: "no entry" },
          status: "warn",
          herkunftId: "hepatitis-b",
        },
        {
          label: { de: "Tetanus", en: "Tetanus" },
          wert: { de: "2017", en: "2017" },
          status: "neutral",
          herkunftId: "tetanus",
        },
      ],
      wearable: [
        {
          label: { de: "Reiseziel", en: "Destination" },
          wert: { de: "Thailand", en: "Thailand" },
          status: "info",
          herkunftId: "reiseziel",
        },
        {
          label: { de: "Abreise", en: "Departure" },
          wert: { de: "15.08.2026", en: "15 August 2026" },
          status: "info",
          herkunftId: "reiseziel",
        },
      ],
      wearableLabel: { de: "Reiseplanung", en: "Travel planning" },
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
    titel: { de: "Zahnarzttermin Juli 2026", en: "Dental appointment July 2026" },
    kurz: {
      de: "VitaLink liest deinen Zahnarzt-Eintrag aus deiner ePA und berechnet daraus den nächsten empfohlenen Termin. Das GKV-Standardintervall beträgt 6 Monate. Da dein letzter Besuch am 27. Januar 2026 war, ist der 28. Juli das empfohlene Datum. Diese Erinnerung ist eine der einfachsten Stärken der ePA — Vorsorge-Termine werden nicht vergessen.",
      en: "VitaLink reads your dental entry from your ePA (Germany's electronic patient record) and works out the next recommended appointment from it. The standard interval under statutory health insurance is 6 months. Since your last visit was on 27 January 2026, 28 July is the recommended date. This reminder is one of the simplest strengths of the ePA - preventive care appointments do not get forgotten.",
    },
    begruendung: {
      de: "Der letzte dokumentierte Zahnarztbesuch (27.01.2026, Professionelle Zahnreinigung, Befund unauffällig) liegt 5 Monate zurück. Das Standard-GKV-Recall-Intervall von 6 Monaten führt zu einem empfohlenen Nächsttermin am 28.07.2026. Durch die Kombination von ePA-Datum und Recall-Regel kann VitaLink Erinnerungen ohne Wearable-Daten generieren.",
      en: "Your last documented dental visit (27 January 2026, professional teeth cleaning, findings unremarkable) was 5 months ago. The standard recall interval of 6 months under statutory health insurance points to a recommended next appointment on 28 July 2026. By combining the ePA date with the recall rule, VitaLink can create reminders without any wearable data.",
    },
    detail: {
      de: "Grundlage: ePA-Eintrag Zahnarztpraxis Dr. Maier, Bochum-Innenstadt, 27.01.2026. Berechnungsregel: letztes Besuchsdatum + 6 Monate = empfohlenes nächstes Datum. Das Intervall entspricht dem GKV-Bonusheft-Empfehlungsrahmen. Kein Wearable-Anteil. Regelbasiert, keine ML-Komponente.",
      en: "Basis: the ePA entry from Zahnarztpraxis Dr. Maier, Bochum-Innenstadt, 27 January 2026. Calculation rule: date of last visit + 6 months = recommended next date. The interval follows the bonus booklet guidance of the statutory health insurance. No wearable data involved. Rule-based, no ML component.",
    },
    faktoren: [
      {
        label: { de: "ePA-Datum letzter Besuch", en: "ePA date of last visit" },
        gewicht: 0.7,
        quelleRef: { de: "ePA Vorsorge", en: "ePA preventive care" },
        sourceKey: "epa-vorsorge",
      },
      {
        label: {
          de: "GKV-Intervall 6 Monate",
          en: "Statutory health insurance interval: 6 months",
        },
        gewicht: 0.3,
        quelleRef: { de: "Recall-Regel", en: "Recall rule" },
      },
    ],
    unsicher: false,
    quellen: [
      {
        art: "epa",
        label: { de: "Zahnarztbesuch 27.01.2026", en: "Dental visit 27 January 2026" },
        sourceKey: "epa-vorsorge",
        date: "2026-01-27",
        issuer: {
          de: "Zahnarztpraxis Dr. Maier, Bochum-Innenstadt",
          en: "Zahnarztpraxis Dr. Maier, Bochum-Innenstadt",
        },
      },
    ],
    datengrundlage: {
      epa: [
        {
          label: { de: "Letzter Besuch", en: "Last visit" },
          wert: { de: "27.01.2026", en: "27 January 2026" },
          status: "neutral",
          herkunftId: "zahnarzt",
        },
        {
          label: { de: "Befund", en: "Findings" },
          wert: { de: "unauffällig", en: "unremarkable" },
          status: "ok",
          herkunftId: "zahnarzt",
        },
        {
          label: { de: "Nächster Termin", en: "Next appointment" },
          wert: { de: "28.07.2026", en: "28 July 2026" },
          status: "warn",
          herkunftId: "zahnarzt",
        },
        {
          label: { de: "Praxis", en: "Practice" },
          wert: { de: "Dr. Maier, Bochum", en: "Dr. Maier, Bochum" },
          status: "neutral",
          herkunftId: "zahnarzt",
        },
      ],
      wearable: [],
    },
    aktionen: [],
    genutzteQuellen: ["epa-vorsorge"],
    dringlichkeit: "2026-07-28",
    aehnlicheTermine: [
      {
        titel: { de: "Blutbild", en: "Blood count" },
        zuletzt: { de: "12.03.2026", en: "12 March 2026" },
        naechstes: { de: "September 2026", en: "September 2026" },
        status: "ok",
      },
      {
        titel: { de: "Gynäkologie", en: "Gynaecology" },
        zuletzt: { de: "24.07.2025", en: "24 July 2025" },
        naechstes: { de: "Juli 2026", en: "July 2026" },
        status: "bald",
      },
      {
        titel: { de: "Hautkrebs-Screening", en: "Skin cancer screening" },
        naechstes: { de: "empfohlen ab sofort", en: "recommended from now on" },
        status: "fehlt",
      },
      {
        titel: { de: "Augenarzt", en: "Eye doctor" },
        zuletzt: { de: "2024", en: "2024" },
        naechstes: { de: "2026", en: "2026" },
        status: "ok",
      },
    ],
    synthetic: true,
  },

  // ---------------------------------------------------------------------------
  // GLUKOSE — Blutzucker & Stoffwechsel (ePA Laborwerte + Apple Watch Series 12)
  // ---------------------------------------------------------------------------
  {
    id: "glukose",
    szenario: "stoffwechsel",
    titel: { de: "Blutzucker & Stoffwechsel", en: "Blood sugar & metabolism" },
    kurz: {
      de: "Deine Apple Watch Series 12 misst kontinuierlich deinen Gewebezucker über optische Sensoren und kalibriert die Werte gegen deinen ePA-Laborwert (94 mg/dl, März 2026). VitaLink erkennt dabei, dass dein Schlaf den größten Einfluss auf deine Glukosewerte hat — mehr als Ernährung oder Sport allein. Weder ePA noch Wearable hätten diesen Zusammenhang allein sichtbar gemacht.",
      en: "Your Apple Watch Series 12 measures your tissue glucose continuously through optical sensors and calibrates the values against the lab value in your ePA (Germany's electronic patient record) (94 mg/dl, March 2026). VitaLink sees that your sleep has the biggest influence on your glucose values - more than food or exercise alone. Neither the ePA nor the wearable would have made this connection visible on its own.",
    },
    begruendung: {
      de: "Die Apple Watch Series 12 misst seit 8 Wochen kontinuierlich deinen Gewebezucker als Trendindikator (kombinierter Infrarot-PPG-Algorithmus). Nach Nächten mit weniger als 6,5 h Schlaf steigt dein Mittagspeak auf Ø 154 mg/dl — nach erholten Nächten sind es nur 134 mg/dl. Diese 20 mg/dl Differenz ist konsistent über alle gemessenen Schlechtnächte. An deinen 4 Trainingstagen sinkt der Abend-Glukosewert im Schnitt um 11 mg/dl gegenüber trainingsfreien Tagen.",
      en: "The Apple Watch Series 12 has measured your tissue glucose continuously for 8 weeks as a trend indicator (a combined infrared PPG algorithm). After nights with less than 6.5 h of sleep, your midday peak rises to an average of 154 mg/dl - after rested nights it is only 134 mg/dl. This difference of 20 mg/dl is consistent across every poor night measured. On your 4 training days, your evening glucose value drops by 11 mg/dl on average compared with days without training.",
    },
    detail: {
      de: "Grundlage: Wearable-Glukose-Trendindikator der Apple Watch Series 12 (letzte 14 Tage), kalibriert gegen ePA-Laborwert Nüchternblutzucker 94 mg/dl und HbA1c 5,4 % (Labor MVZ Bochum, 12.03.2026). Messmodus: nicht-invasiv, optischer Algorithmus — kein klinisch zertifizierter Absolutwert, sondern validierter Trendindikator. Die Schlaf-Glukose-Korrelation basiert auf automatischer Klassifikation der Nächte nach Tiefschlafanteil. Synthetische Daten, kein Medizinprodukt.",
      en: "Basis: the wearable glucose trend indicator of the Apple Watch Series 12 (past 14 days), calibrated against the ePA lab values fasting blood sugar 94 mg/dl and HbA1c 5.4 % (Labor MVZ Bochum, 12 March 2026). Measurement mode: non-invasive, optical algorithm - not a clinically certified absolute value, but a validated trend indicator. The sleep-glucose correlation comes from an automatic classification of nights by deep sleep share. Synthetic data, not a medical device.",
    },
    faktoren: [
      {
        label: { de: "Schlafqualität", en: "Sleep quality" },
        gewicht: 0.5,
        quelleRef: { de: "Wearable Schlafsensor, 14 Tage", en: "Wearable sleep sensor, 14 days" },
        sourceKey: "wearable-schlaf",
      },
      {
        label: { de: "Glukose-Trendindikator", en: "Glucose trend indicator" },
        gewicht: 0.3,
        quelleRef: {
          de: "Apple Watch Series 12, 14 Tage",
          en: "Apple Watch Series 12, 14 days",
        },
        sourceKey: "wearable-glukose",
      },
      {
        label: { de: "Nüchternblutzucker (ePA)", en: "Fasting blood sugar (ePA)" },
        gewicht: 0.2,
        quelleRef: { de: "ePA Laborwert 12.03.2026", en: "ePA lab value 12 March 2026" },
        sourceKey: "epa-labor",
      },
    ],
    kontrafaktisch: {
      faktorLabel: { de: "Sporttage pro Woche", en: "Training days per week" },
      einheit: { de: "Tage", en: "days" },
      aktuell: 4,
      min: 0,
      max: 7,
      schritt: 1,
      wirkung: (wert: number, locale: Locale) => {
        if (wert >= 7)
          return locale === "de"
            ? "Mit täglicher Bewegung könnte dein Abend-Blutzuckerwert auf geschätzte 88 mg/dl sinken — deutlich stabiler."
            : "With daily movement, your evening blood sugar could drop to an estimated 88 mg/dl - clearly more stable.";
        if (wert >= 4)
          return locale === "de"
            ? `Bei ${zahl(wert, locale)} Trainingstagen liegt dein Ø Abend-Blutzuckerwert bei 96 mg/dl — unter dem Wert an trainingsfreien Tagen.`
            : `With ${zahl(wert, locale)} training days, your average evening blood sugar is 96 mg/dl - below the value on days without training.`;
        if (wert >= 1)
          return locale === "de"
            ? "Mit nur 1–2 Trainingstagen steigt der geschätzte Abend-Wert auf 104–107 mg/dl — das Muster aus deinen Daten deutet das an."
            : "With only 1-2 training days, the estimated evening value rises to 104-107 mg/dl - the pattern in your data points that way.";
        return locale === "de"
          ? "Ohne Bewegung könnten deine Abend-Werte auf über 110 mg/dl steigen, basierend auf deinem aktuellen Datenmuster."
          : "Without movement, your evening values could rise above 110 mg/dl, based on your current data pattern.";
      },
    },
    unsicher: false,
    quellen: [
      {
        art: "wearable",
        label: { de: "Glukose-Trendindikator", en: "Glucose trend indicator" },
        sourceKey: "wearable-glukose",
        period: { de: "letzte 14 Tage", en: "past 14 days" },
        sensor: {
          de: "optischer Sensor (Apple Watch Series 12)",
          en: "optical sensor (Apple Watch Series 12)",
        },
      },
      {
        art: "epa",
        label: { de: "Nüchternblutzucker 94 mg/dl", en: "Fasting blood sugar 94 mg/dl" },
        sourceKey: "epa-labor",
        date: "2026-03-12",
        issuer: { de: "Labor MVZ Bochum", en: "Labor MVZ Bochum" },
      },
      {
        art: "epa",
        label: { de: "HbA1c 5,4 %", en: "HbA1c 5.4 %" },
        sourceKey: "epa-labor",
        date: "2026-03-12",
        issuer: { de: "Labor MVZ Bochum", en: "Labor MVZ Bochum" },
      },
      {
        art: "wearable",
        label: { de: "Schlafqualität", en: "Sleep quality" },
        sourceKey: "wearable-schlaf",
        period: { de: "letzte 14 Tage", en: "past 14 days" },
        sensor: {
          de: "Schlafsensor (Apple Watch Series 12)",
          en: "Sleep sensor (Apple Watch Series 12)",
        },
      },
    ],
    datengrundlage: {
      epa: [
        {
          label: { de: "Nüchternblutzucker", en: "Fasting blood sugar" },
          wert: { de: "94 mg/dl", en: "94 mg/dl" },
          status: "ok",
          herkunftId: "nuechternblutzucker",
        },
        {
          label: { de: "HbA1c", en: "HbA1c" },
          wert: { de: "5,4 %", en: "5.4 %" },
          status: "ok",
          herkunftId: "hba1c",
        },
      ],
      wearable: [
        {
          label: { de: "Ø Nüchternwert (14 T.)", en: "Avg fasting value (14 d)" },
          wert: { de: "90 mg/dl", en: "90 mg/dl" },
          status: "ok",
          herkunftId: "glukose",
        },
        {
          label: { de: "Postprandialer Peak Ø", en: "Avg peak after meals" },
          wert: { de: "143 mg/dl", en: "143 mg/dl" },
          status: "neutral",
          herkunftId: "glukose",
        },
        {
          label: { de: "Peak Schlechtnacht", en: "Peak after a poor night" },
          wert: { de: "154 mg/dl", en: "154 mg/dl" },
          status: "warn",
          herkunftId: "glukose",
        },
        {
          label: { de: "Variabilität (CV)", en: "Variability (CV)" },
          wert: { de: "18 %", en: "18 %" },
          status: "neutral",
          herkunftId: "glukose",
        },
      ],
      wearableLabel: { de: "Apple Watch Series 12", en: "Apple Watch Series 12" },
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
    titel: { de: "Vitamin D & Tageslicht", en: "Vitamin D & daylight" },
    kurz: {
      de: "Dein Vitamin-D-Wert liegt mit 24 ng/ml leicht unter dem Optimum. Zusammen mit deinen niedrigen Werktags-Schritten zeigt sich: Die Junisonne mittags bringt Sonne und Bewegung in einem.",
      en: "At 24 ng/ml, your vitamin D level is a little below the optimum. Together with your low step count on weekdays, one thing stands out: the June sun at midday gives you sunlight and movement in one go.",
    },
    begruendung: {
      de: "Deine ePA dokumentiert einen Vitamin-D-Wert von 24 ng/ml (Optimum 30–60) — leicht defizitär, obwohl du seit Januar täglich 1.000 IE einnimmst. Deine Apple Watch Series 12 zeigt an Werktagen nur Ø 10.800 Schritte, am Wochenende dagegen 15.700; unter der Woche sitzt du im Schnitt 6,2 Stunden am Stück. Gleichzeitig ist es Juni — die Mittagssonne in Bochum reicht schon nach etwa 15 Minuten für eine spürbare Vitamin-D-Bildung. Erst die Kombination aus deinem Laborwert (ePA) und deinem Bewegungsmuster (Wearable) macht sichtbar, dass ein Mittagsspaziergang zwei Lücken auf einmal schließt.",
      en: "Your ePA (Germany's electronic patient record) documents a vitamin D level of 24 ng/ml (optimum 30-60) - slightly low, even though you have been taking 1,000 IU daily since January. Your Apple Watch Series 12 shows an average of only 10,800 steps on weekdays, but 15,700 at the weekend; during the week you sit for 6.2 hours at a stretch on average. At the same time it is June - the midday sun in Bochum is already enough for noticeable vitamin D production after about 15 minutes. Only the combination of your lab value (ePA) and your movement pattern (wearable) shows that a walk at midday closes two gaps at once.",
    },
    detail: {
      de: "Grundlage sind ein ePA-Laborwert (Vitamin D 25-OH, 24 ng/ml, 12.03.2026, Labor MVZ Bochum), dein dokumentiertes Vitamin-D-Präparat (1.000 IE seit 15.01.2026), dein Ferritin (18 µg/l) sowie deine Wearable-Aktivität der letzten 14 Tage (Schritte werktags und am Wochenende, aktivste Tagesstunde). Das Modell setzt deinen Vitamin-D-Status in Beziehung zu Bewegungsmuster und Jahreszeit. Es stellt keine Diagnose und ersetzt keine ärztliche Einschätzung.",
      en: "This builds on one ePA lab value (vitamin D 25-OH, 24 ng/ml, 12 March 2026, Labor MVZ Bochum), your documented vitamin D supplement (1,000 IU since 15 January 2026), your ferritin (18 µg/l) and your wearable activity from the past 14 days (steps on weekdays and at the weekend, most active hour of the day). The model relates your vitamin D status to your movement pattern and the season. It does not make a diagnosis and does not replace a doctor's assessment.",
    },
    faktoren: [
      {
        label: { de: "Vitamin-D-Wert (ePA)", en: "Vitamin D level (ePA)" },
        gewicht: 0.4,
        quelleRef: { de: "ePA Laborwert, 12.03.2026", en: "ePA lab value, 12 March 2026" },
        sourceKey: "epa-labor",
      },
      {
        label: { de: "Werktags-Bewegung (Wearable)", en: "Weekday movement (wearable)" },
        gewicht: 0.3,
        quelleRef: {
          de: "Wearable Beschleunigungssensor, 14 Tage",
          en: "Wearable accelerometer, 14 days",
        },
        sourceKey: "wearable-aktivitaet",
      },
      {
        label: { de: "Jahreszeit & Standort", en: "Season & location" },
        gewicht: 0.2,
        quelleRef: { de: "Regel (Juni, Bochum)", en: "Rule (June, Bochum)" },
      },
      {
        label: { de: "Ferritin (ePA)", en: "Ferritin (ePA)" },
        gewicht: 0.1,
        quelleRef: { de: "ePA Laborwert, 12.03.2026", en: "ePA lab value, 12 March 2026" },
        sourceKey: "epa-labor",
      },
    ],
    kontrafaktisch: {
      faktorLabel: { de: "Tageslicht am Mittag", en: "Daylight at midday" },
      einheit: { de: "Min pro Tag", en: "min per day" },
      aktuell: 15,
      min: 0,
      max: 60,
      schritt: 5,
      wirkung: (wert: number, locale: Locale) => {
        if (wert >= 30)
          return locale === "de"
            ? `Bei rund ${zahl(wert, locale)} Min Mittagssonne täglich bildet dein Körper im Juni spürbar Vitamin D — dein Wert würde sich mit der Zeit Richtung 30–60 ng/ml bewegen, ganz ohne höhere Dosis.`
            : `With around ${zahl(wert, locale)} min of midday sun a day, your body makes noticeable vitamin D in June - your level would move towards 30-60 ng/ml over time, with no higher dose at all.`;
        if (wert >= 15)
          return locale === "de"
            ? `Bei rund ${zahl(wert, locale)} Min Mittagssonne täglich ist im Juni schon eine merkliche Vitamin-D-Bildung möglich. Etwas mehr Zeit draußen würde den Effekt verstärken.`
            : `With around ${zahl(wert, locale)} min of midday sun a day, noticeable vitamin D production is already possible in June. A bit more time outside would strengthen the effect.`;
        if (wert >= 5)
          return locale === "de"
            ? `Bei rund ${zahl(wert, locale)} Min Tageslicht am Mittag bleibt die Vitamin-D-Bildung gering. Ein paar Minuten mehr in der Sonne lohnen sich.`
            : `With around ${zahl(wert, locale)} min of daylight at midday, vitamin D production stays low. A few more minutes in the sun are worth it.`;
        return locale === "de"
          ? "Ohne Mittagssonne trägt vor allem dein Präparat zur Vitamin-D-Versorgung bei. Etwas Tageslicht würde zusätzlich helfen."
          : "Without midday sun, it is mainly your supplement that keeps your vitamin D up. Some daylight would help on top of that.";
      },
    },
    unsicher: false,
    quellen: [
      {
        art: "epa",
        label: { de: "Vitamin D (25-OH) 24 ng/ml", en: "Vitamin D (25-OH) 24 ng/ml" },
        sourceKey: "epa-labor",
        date: "2026-03-12",
        issuer: { de: "Labor MVZ Bochum", en: "Labor MVZ Bochum" },
      },
      {
        art: "epa",
        label: { de: "Ferritin 18 µg/l", en: "Ferritin 18 µg/l" },
        sourceKey: "epa-labor",
        date: "2026-03-12",
        issuer: { de: "Labor MVZ Bochum", en: "Labor MVZ Bochum" },
      },
      {
        art: "wearable",
        label: {
          de: "Schritte (werktags/Wochenende)",
          en: "Steps (weekdays/weekend)",
        },
        sourceKey: "wearable-aktivitaet",
        period: { de: "letzte 14 Tage", en: "past 14 days" },
        sensor: { de: "Beschleunigungssensor", en: "accelerometer" },
      },
    ],
    datengrundlage: {
      epa: [
        {
          label: { de: "Vitamin D (25-OH)", en: "Vitamin D (25-OH)" },
          wert: { de: "24 ng/ml", en: "24 ng/ml" },
          status: "warn",
          herkunftId: "vitamin-d",
        },
        {
          label: { de: "Präparat", en: "Supplement" },
          wert: { de: "1.000 IE/Tag", en: "1,000 IU/day" },
          status: "neutral",
          herkunftId: "vitamin-d-praeparat",
        },
        {
          label: { de: "Ferritin", en: "Ferritin" },
          wert: { de: "18 µg/l", en: "18 µg/l" },
          status: "neutral",
          herkunftId: "ferritin",
        },
      ],
      wearable: [
        {
          label: { de: "Schritte werktags", en: "Steps on weekdays" },
          wert: { de: "10.800", en: "10,800" },
          status: "neutral",
          herkunftId: "schritte",
        },
        {
          label: { de: "Schritte Wochenende", en: "Steps at the weekend" },
          wert: { de: "15.700", en: "15,700" },
          status: "ok",
          herkunftId: "schritte",
        },
        {
          label: { de: "Aktivste Stunde", en: "Most active hour" },
          wert: { de: "12–13 Uhr", en: "12:00-13:00" },
          status: "info",
          herkunftId: "schritte",
        },
      ],
    },
    aktionen: [],
    genutzteQuellen: ["epa-labor", "wearable-aktivitaet"],
    normwertHinweis: {
      de: "Optimaler Vitamin-D-Bereich: 30–60 ng/ml",
      en: "Optimal vitamin D range: 30-60 ng/ml",
    },
    dringlichkeit: null,
    synthetic: true,
  },
];

// ---------------------------------------------------------------------------
// Aufloesung: Quelldaten -> oeffentlicher Hinweis-Typ (reine strings)
// ---------------------------------------------------------------------------

function faktorAufloesen(q: FaktorQuelle, locale: Locale): Faktor {
  return { ...q, label: q.label[locale], quelleRef: q.quelleRef[locale] };
}

function provenanceAufloesen(q: ProvenanceQuelle, locale: Locale): Provenance {
  return {
    ...q,
    label: q.label[locale],
    period: q.period?.[locale],
    sensor: q.sensor?.[locale],
    issuer: q.issuer?.[locale],
  };
}

function datenpunktAufloesen(q: DatenpunktQuelle, locale: Locale): Datenpunkt {
  return { ...q, label: q.label[locale], wert: q.wert[locale] };
}

function datengrundlageAufloesen(q: DatengrundlageQuelle, locale: Locale): Datengrundlage {
  return {
    ...q,
    epa: q.epa.map((d) => datenpunktAufloesen(d, locale)),
    wearable: q.wearable.map((d) => datenpunktAufloesen(d, locale)),
    wearableLabel: q.wearableLabel?.[locale],
  };
}

function terminAufloesen(q: VorsorgeTerminQuelle, locale: Locale): VorsorgeTermin {
  return {
    ...q,
    titel: q.titel[locale],
    zuletzt: q.zuletzt?.[locale],
    naechstes: q.naechstes?.[locale],
  };
}

function kontrafaktischAufloesen(q: KontrafaktischQuelle, locale: Locale): Kontrafaktisch {
  return {
    ...q,
    faktorLabel: q.faktorLabel[locale],
    einheit: q.einheit[locale],
    // Locale wird hier gebunden -> der oeffentliche Typ bleibt (wert) => string,
    // CounterfactualSlider braucht keine Aenderung.
    wirkung: (wert: number) => q.wirkung(wert, locale),
  };
}

function aufloesen(q: HinweisQuelle, locale: Locale): Hinweis {
  return {
    ...q,
    titel: q.titel[locale],
    kurz: q.kurz[locale],
    begruendung: q.begruendung[locale],
    detail: q.detail[locale],
    faktoren: q.faktoren.map((f) => faktorAufloesen(f, locale)),
    kontrafaktisch: q.kontrafaktisch
      ? kontrafaktischAufloesen(q.kontrafaktisch, locale)
      : undefined,
    quellen: q.quellen.map((p) => provenanceAufloesen(p, locale)),
    normwertHinweis: q.normwertHinweis?.[locale],
    datengrundlage: q.datengrundlage
      ? datengrundlageAufloesen(q.datengrundlage, locale)
      : undefined,
    aehnlicheTermine: q.aehnlicheTermine?.map((t) => terminAufloesen(t, locale)),
  };
}

/** Locale-unabhaengige ID-Liste (Validierung, generateStaticParams, SettingsContext). */
export const hinweisIds: string[] = quellen.map((q) => q.id);

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

export function hinweisFuer(id: string, locale: Locale): Hinweis | undefined {
  const q = quellen.find((x) => x.id === id);
  return q ? aufloesen(q, locale) : undefined;
}

export function hinweiseSortiertFuer(locale: Locale): Hinweis[] {
  return sortHinweiseByDringlichkeit(quellen.map((q) => aufloesen(q, locale)));
}

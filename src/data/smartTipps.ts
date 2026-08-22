// Smarte Empfehlungen je Hinweis.
//
// Die Inhalte sind statisch hinterlegt, aber so formuliert, als wären sie live
// aus Maras Daten berechnet worden. Jeder Tipp ist auf zwei Sätze verdichtet
// (Erkenntnis) plus eine eigene Handlungszeile (der „→"-Schritt). Werte stammen
// aus epa.ts / wearable.ts / hinweise.ts und sind synthetisch.
//
// Die Record-Schlüssel sind die echten Hinweis-IDs aus hinweise.ts:
//   lifestyle-schlaf · kardio-blutdruck · reise-impfung
//
// ZWEISPRACHIGKEIT (E6): Die Quelldaten unten sind lokalisiert
// ({ de, en }); die öffentlichen Typen (SmartTipp, InsightStatementDaten, …)
// bleiben reine `string`-Typen. Accessoren lösen eine Locale auf, damit die
// konsumierenden Komponenten unverändert bleiben. Locale-unabhängige
// ID-Exporte (alleSmartTippIds) bleiben erhalten — SettingsContext darf keine
// Locale kennen.

import type { Locale, Lokalisiert } from "@/i18n/types";

export type SmartTippQuelle = "epa" | "wearable" | "context";

export interface SmartTipp {
  id: string;
  /** lucide-react Icon-Name (Mapping in SmartTippCard). */
  icon: string;
  titel: string;
  /** Erkenntnis: max. 2 Sätze, Zahlen mit Einheit. */
  text: string;
  /** Konkreter Handlungsschritt (ohne „→", wird visuell als Schritt gerahmt). */
  handlung: string;
  /** Welche Datenquellen in den Tipp eingeflossen sind (steuert die Chips). */
  quellen: SmartTippQuelle[];
}

/** Lokalisierte Quellform eines SmartTipp. */
interface SmartTippQuelleDaten extends Omit<SmartTipp, "titel" | "text" | "handlung"> {
  titel: Lokalisiert;
  text: Lokalisiert;
  handlung: Lokalisiert;
}

const smartTippQuellen: Record<string, SmartTippQuelleDaten[]> = {
  // ───────────────────────────────────────────────────────────────────────
  // SCHLAF & ERHOLUNG
  // ───────────────────────────────────────────────────────────────────────
  "lifestyle-schlaf": [
    {
      id: "schlaf-training-timing",
      icon: "Dumbbell",
      titel: {
        de: "Donnerstagtraining vorziehen",
        en: "Move Thursday's workout earlier",
      },
      text: {
        de: "Dein Do-Abendtraining drückt HRV auf 29 ms, Samstagmorgen sind es 47 ms — Tiefschlaf halbiert sich.",
        en: "Your Thursday evening workout pushes HRV down to 29 ms; on Saturday morning it is 47 ms - and your deep sleep halves.",
      },
      handlung: {
        de: "Verleg das Do-Training auf 12–14 Uhr.",
        en: "Move the Thursday session to 12:00-14:00.",
      },
      quellen: ["wearable"],
    },
    {
      id: "schlaf-abendritual-hrv",
      icon: "Moon",
      titel: {
        de: "Abend-Routine für tiefere Nächte",
        en: "An evening routine for deeper nights",
      },
      text: {
        de: "Freitag- und Sonntagabend — HRV über 43 ms — schläfst du 6 % mehr Tiefschlaf als im Wochenschnitt.",
        en: "On Friday and Sunday evenings, when your HRV is above 43 ms, you get 6 % more deep sleep than your weekly average.",
      },
      handlung: {
        de: "Ab 21:30 Uhr: Licht dimmen, 10 Min ruhige Atmung.",
        en: "From 21:30: dim the lights, 10 min of calm breathing.",
      },
      quellen: ["wearable", "epa"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // HERZ-KREISLAUF (Blutdruck-Trend)
  // ───────────────────────────────────────────────────────────────────────
  "kardio-blutdruck": [
    {
      id: "kardio-schlaf-blutdruck",
      icon: "TrendingDown",
      titel: {
        de: "Schlaf schützt deinen Blutdruck",
        en: "Sleep protects your blood pressure",
      },
      text: {
        de: "Nach unruhigen Nächten liegt dein Ruhepuls bei 64 BPM — etwa 7 mehr als sonst. Dein Blutdruck stieg in 6 Monaten von 118 auf 128 mmHg systolisch.",
        en: "After restless nights your resting heart rate is 64 BPM - about 7 more than usual. Over 6 months your blood pressure rose from 118 to 128 mmHg systolic.",
      },
      handlung: {
        de: "Die Schlafverbesserung aus „Schlafqualität & Erholung“ direkt angehen.",
        en: "Start with the sleep steps from \"Sleep quality & recovery\".",
      },
      quellen: ["wearable", "epa"],
    },
    {
      id: "kardio-ernaehrung-cholesterin-eisen",
      icon: "Salad",
      titel: {
        de: "Hülsenfrüchte: Eisen und Cholesterin",
        en: "Legumes: iron and cholesterol",
      },
      text: {
        de: "Dein LDL liegt bei 118 mg/dl, Ferritin bei 18 µg/l (niedrig-normal). Linsen, Kichererbsen und Haferflocken senken LDL und heben Ferritin.",
        en: "Your LDL is 118 mg/dl and your ferritin is 18 µg/l (low-normal). Lentils, chickpeas and oats bring LDL down and lift ferritin.",
      },
      handlung: {
        de: "3× pro Woche eine Portion Hülsenfrüchte zum Mittagessen.",
        en: "A portion of legumes with lunch 3× a week.",
      },
      quellen: ["epa"],
    },
    {
      id: "kardio-hitze-hydration",
      icon: "Droplets",
      titel: {
        de: "Sommer-Training und Hydration",
        en: "Summer training and hydration",
      },
      text: {
        de: "Du trainierst 4× pro Woche, Ø 103 Min. Bei Hitze im Juli/August erhöht Dehydration den Blutdruck messbar.",
        en: "You train 4× a week, 103 min on average. In the July and August heat, dehydration raises blood pressure measurably.",
      },
      handlung: {
        de: "Trink 500 ml extra pro Trainingseinheit — vor, nicht nur nach.",
        en: "Drink an extra 500 ml per session - before, not just after.",
      },
      quellen: ["wearable", "context"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // REISEVORSORGE THAILAND
  // ───────────────────────────────────────────────────────────────────────
  "reise-impfung": [
    {
      id: "reise-impf-zeitplan",
      icon: "Syringe",
      titel: {
        de: "Zeitnah einen Termin vereinbaren",
        en: "Book an appointment soon",
      },
      text: {
        de: "Bei Reiseimpfungen kann ein gewisser Vorlauf sinnvoll sein. Prüfe den Impfstatus deshalb frühzeitig ärztlich. Deine Abreise: 15.08.2026.",
        en: "Travel vaccinations often need some lead time. So it helps to have your vaccination status checked by a doctor early. You leave on 15 August 2026.",
      },
      handlung: {
        de: "Sprich frühzeitig mit deiner Hausarztpraxis über Hepatitis A und B. Für einige Impfschemata ist ausreichend Vorlauf sinnvoll — kläre, welche Option zu dir passt.",
        en: "Talk to your GP practice about hepatitis A and B in good time. Some vaccination schedules need enough lead time - ask which option suits you.",
      },
      quellen: ["epa", "context"],
    },
    {
      id: "reise-jetlag-schlaf",
      icon: "Plane",
      titel: {
        de: "Jetlag abmildern: jetzt anfangen",
        en: "Ease jet lag: start now",
      },
      text: {
        de: "Thailand liegt 5 Stunden vor uns. Dein Schlaf-Score liegt bei Ø 67/100 — Jetlag trifft Menschen mit Schlafdefizit deutlich härter.",
        en: "Thailand is 5 hours ahead of us. Your sleep score averages 67/100 - jet lag hits people who are short on sleep much harder.",
      },
      handlung: {
        de: "Ab 01.08.: Schlafzeit täglich 30 Min früher, damit dein Körper ankommt, bevor du fliegst.",
        en: "From 1 August: go to bed 30 min earlier each day, so your body arrives before you fly.",
      },
      quellen: ["wearable", "context"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // GLUKOSE & STOFFWECHSEL
  // ───────────────────────────────────────────────────────────────────────
  glukose: [
    {
      id: "glukose-schlaf",
      icon: "Moon",
      titel: {
        de: "Schlaf reguliert deinen Blutzucker",
        en: "Sleep steadies your blood sugar",
      },
      text: {
        de: "Nach Nächten mit weniger als 6,5 h Schlaf steigt dein höchster Blutzuckerwert nach dem Mittagessen auf Ø 154 mg/dl — nach erholten Nächten sind es nur 134 mg/dl.",
        en: "After nights with less than 6.5 h of sleep, your highest blood sugar after lunch rises to 154 mg/dl on average - after restful nights it is only 134 mg/dl.",
      },
      handlung: {
        de: "Schon eine Stunde mehr Schlaf pro Nacht kann deinen Blutzucker nach dem Essen stabilisieren.",
        en: "Just one hour more sleep a night can steady your blood sugar after meals.",
      },
      quellen: ["wearable"],
    },
    {
      id: "glukose-training",
      icon: "Dumbbell",
      titel: {
        de: "Sport als Glukose-Puffer",
        en: "Exercise as a glucose buffer",
      },
      text: {
        de: "An deinen 4 Trainingstagen liegt dein Abend-Glukosewert bei Ø 96 mg/dl — an trainingsfreien Tagen bei 107 mg/dl. Das ist etwas ungünstiger, kein Alarm, aber ein klares Muster.",
        en: "On your 4 training days your evening glucose is 96 mg/dl on average - on rest days it is 107 mg/dl. That is slightly less favourable, nothing to worry about, but a clear pattern.",
      },
      handlung: {
        de: "Baue an trainingsfreien Tagen eine kurze 20-minütige Bewegungseinheit ein.",
        en: "Fit in a short 20-minute bout of movement on rest days.",
      },
      quellen: ["wearable"],
    },
    {
      id: "glukose-spaziergang",
      icon: "Footprints",
      titel: {
        de: "15 Min nach dem Essen gehen",
        en: "Walk for 15 min after eating",
      },
      text: {
        de: "Dein höchstgemessener Wert (161 mg/dl) war an einem Donnerstag ohne Mittagsbewegung. Ein kurzer Spaziergang senkt den Wert um bis zu 18 mg/dl.",
        en: "Your highest reading (161 mg/dl) came on a Thursday with no movement at lunchtime. A short walk brings the value down by up to 18 mg/dl.",
      },
      handlung: {
        de: "15 Min Spaziergang direkt nach dem Mittagessen.",
        en: "A 15 min walk straight after lunch.",
      },
      quellen: ["wearable"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // ZAHNARZT / VORSORGE
  // ───────────────────────────────────────────────────────────────────────
  zahnarzt: [
    {
      id: "zahnarzt-termin",
      icon: "Phone",
      titel: {
        de: "Vorsorgetermin für Juli planen",
        en: "Plan a preventive care visit for July",
      },
      text: {
        de: "Dein letzter Besuch bei Dr. Maier war am 27.01.2026. Das Intervall von 6 Monaten endet am 28.07.2026.",
        en: "Your last visit to Dr. Maier was on 27 January 2026. The 6-month interval ends on 28 July 2026.",
      },
      handlung: {
        de: "Plane am besten einen Termin für Juli ein. Letzter Besuch: 27.01.2026, Intervall endet am 28.07.2026.",
        en: "It is worth booking an appointment for July. Last visit: 27 January 2026, interval ends on 28 July 2026.",
      },
      quellen: ["epa"],
    },
    {
      id: "zahnarzt-kalender",
      icon: "Calendar",
      titel: {
        de: "Befund unauffällig — so bleibt es",
        en: "Findings all clear - keep it that way",
      },
      text: {
        de: "Beim letzten Besuch war dein Befund vollständig unauffällig. Regelmäßige Reinigung alle 6 Monate erhält diesen Status.",
        en: "At your last visit everything was completely clear. A cleaning every 6 months keeps it that way.",
      },
      handlung: {
        de: "Du kannst dir eine Erinnerung setzen, damit der Termin nicht untergeht.",
        en: "You can set a reminder so the appointment does not slip past you.",
      },
      quellen: ["epa"],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // VITALITÄT — Sonne & Vitamin D (ePA Labor + Wearable Aktivität)
  // ───────────────────────────────────────────────────────────────────────
  "vitamin-d": [
    {
      id: "vitamin-d-mittagssonne",
      icon: "Sun",
      titel: {
        de: "Mittagssonne: Sonne und Schritte zugleich",
        en: "Midday sun: sunlight and steps in one go",
      },
      text: {
        de: "Dein Vitamin D liegt bei 24 ng/ml (Optimum 30–60), werktags gehst du nur 10.800 Schritte — am Wochenende 15.700. Die Bochumer Mittagssonne im Juni reicht schon nach 15 Min für spürbare Vitamin-D-Bildung.",
        en: "Your vitamin D is 24 ng/ml (optimum 30-60), and on weekdays you walk only 10,800 steps - at the weekend 15,700. The midday sun in Bochum in June is enough after 15 min to build up noticeable vitamin D.",
      },
      handlung: {
        de: "Geh täglich 20–25 Min zwischen 12 und 14 Uhr nach draußen — das bringt Sonne und rund 2.500 zusätzliche Schritte.",
        en: "Go outside for 20-25 min every day between 12:00 and 14:00 - that gives you sun and around 2,500 extra steps.",
      },
      quellen: ["epa", "wearable", "context"],
    },
    {
      id: "vitamin-d-ernaehrung",
      icon: "Salad",
      titel: {
        de: "Fetter Fisch und Eisen clever kombinieren",
        en: "Combine oily fish and iron cleverly",
      },
      text: {
        de: "Dein Vitamin D ist mit 24 ng/ml leicht defizitär, dein Ferritin mit 18 µg/l niedrig-normal. Lachs, Hering und Makrele liefern Vitamin D; Linsen und Haferflocken heben das Eisen — mit einer Vitamin-C-Quelle (Paprika, Zitrone) nimmt dein Körper das Eisen besser auf.",
        en: "At 24 ng/ml your vitamin D is slightly low, and your ferritin at 18 µg/l is low-normal. Salmon, herring and mackerel provide vitamin D; lentils and oats lift your iron - and with a source of vitamin C (peppers, lemon) your body takes the iron up better.",
      },
      handlung: {
        de: "2× pro Woche fetten Fisch essen und Hülsenfrüchte mit etwas Vitamin C kombinieren.",
        en: "Eat oily fish 2× a week and pair legumes with a little vitamin C.",
      },
      quellen: ["epa"],
    },
    {
      id: "vitamin-d-praeparat",
      icon: "Clock",
      titel: {
        de: "Präparat zur Hauptmahlzeit nehmen",
        en: "Take the supplement with your main meal",
      },
      text: {
        de: "Du nimmst seit Januar täglich 1.000 IE Vitamin D. Vitamin D ist fettlöslich — zusammen mit einer fetthaltigen Mahlzeit nimmt dein Körper es deutlich besser auf. Dein letzter Laborwert ist von März.",
        en: "Since January you have taken 1,000 IU of vitamin D a day. Vitamin D is fat-soluble - your body takes it up much better with a meal that contains fat. Your last lab value is from March.",
      },
      handlung: {
        de: "Nimm das Präparat zur größten Mahlzeit mit etwas Fett — und frag beim nächsten Arztbesuch einen Kontrollwert an.",
        en: "Take the supplement with your biggest meal and some fat - and ask for a follow-up value at your next doctor's visit.",
      },
      quellen: ["epa", "context"],
    },
  ],
};

function smartTippAufloesen(q: SmartTippQuelleDaten, locale: Locale): SmartTipp {
  return {
    ...q,
    titel: q.titel[locale],
    text: q.text[locale],
    handlung: q.handlung[locale],
  };
}

/** Alle SmartTipps eines Hinweises in der gewünschten Sprache. */
export function smartTippsFuer(hinweisId: string, locale: Locale): SmartTipp[] {
  return (smartTippQuellen[hinweisId] ?? []).map((q) => smartTippAufloesen(q, locale));
}

/**
 * Flache Map je konkreter Empfehlung (SmartTipp-Ebene):
 * Tipp-ID -> { Tipp, übergeordnete Hinweis-ID }. Quelle der Wahrheit bleibt
 * smartTippQuellen; diese Map ist nur ein abgeleiteter Index.
 */
export function smartTippMapFuer(
  locale: Locale,
): Record<string, { tipp: SmartTipp; hinweisId: string }> {
  return Object.fromEntries(
    Object.entries(smartTippQuellen).flatMap(([hinweisId, tipps]) =>
      tipps.map((q) => [q.id, { tipp: smartTippAufloesen(q, locale), hinweisId }] as const),
    ),
  );
}

/**
 * Locale-unabhängige Zuordnung Tipp-ID -> Hinweis-ID. Für Validierung und
 * Verlinkung, ohne dass eine Locale bekannt sein muss.
 */
export const smartTippHinweisIdMap: Record<string, string> = Object.fromEntries(
  Object.entries(smartTippQuellen).flatMap(([hinweisId, tipps]) =>
    tipps.map((q) => [q.id, hinweisId] as const),
  ),
);

/** Locale-unabhängige ID-Liste (SettingsContext-tauglich, kennt keine Locale). */
export const alleSmartTippIds: string[] = Object.keys(smartTippHinweisIdMap);

// ─────────────────────────────────────────────────────────────────────────
// INSIGHT-STATEMENT — eine kraftvolle Hauptaussage
// + kurzer Kontexthalbsatz je Hinweis.
// ─────────────────────────────────────────────────────────────────────────

export interface InsightStatementDaten {
  /** Eine Satz, 18px SemiBold. Das erkannte Muster auf den Punkt gebracht. */
  haupt: string;
  /** Kurzer Kontext-Halbsatz, 12px muted. */
  kontext: string;
}

interface InsightStatementQuelleDaten {
  haupt: Lokalisiert;
  kontext: Lokalisiert;
}

const insightStatementQuellen: Record<string, InsightStatementQuelleDaten> = {
  "lifestyle-schlaf": {
    haupt: {
      de: "Dein Donnerstag-Abendtraining drückt deinen Tiefschlaf — eine frühere Trainingszeit und eine ruhige Abend-Routine ziehen beide in dieselbe Richtung.",
      en: "Your Thursday evening workout pushes your deep sleep down - training earlier and a calm evening routine both pull in the same direction.",
    },
    kontext: {
      de: "Beide Ansätze lassen sich gemeinsam angehen.",
      en: "You can work on both at the same time.",
    },
  },
  "kardio-blutdruck": {
    haupt: {
      de: "Wenig Schlaf kann den Ruhepuls erhöhen und langfristig den Blutdruck beeinflussen.",
      en: "Too little sleep can raise your resting heart rate and, over time, affect your blood pressure.",
    },
    kontext: {
      de: "Schlaf ist hier ein wirksamer Ansatzpunkt.",
      en: "Sleep is an effective place to start here.",
    },
  },
  "reise-impfung": {
    haupt: {
      de: "Sechs Wochen bis Thailand — genug Zeit für vollen Schutz, aber nur wenn du diese Woche handelst.",
      en: "Six weeks until Thailand - enough time for full protection, but only if you act this week.",
    },
    kontext: {
      de: "Für Hepatitis B ist das Schnellschema möglich, aber nur bis Mitte Juli.",
      en: "The rapid schedule for hepatitis B is possible, but only until mid-July.",
    },
  },
  glukose: {
    haupt: {
      de: "Wenig Schlaf erhöht deinen höchsten Blutzuckerwert nach dem Mittagessen auf 154 mg/dl — 20 mg/dl mehr als nach erholten Nächten.",
      en: "Too little sleep raises your highest blood sugar after lunch to 154 mg/dl - 20 mg/dl more than after restful nights.",
    },
    kontext: {
      de: "Dein Körper verarbeitet Zucker nach wenig Schlaf etwas weniger effizient.",
      en: "After short nights your body handles sugar a little less efficiently.",
    },
  },
  "vitamin-d": {
    haupt: {
      de: "Dein Vitamin-D-Wert (24 ng/ml) und deine niedrigen Werktags-Schritte ziehen in dieselbe Richtung — die Junisonne mittags adressiert beides zugleich.",
      en: "Your vitamin D level (24 ng/ml) and your low weekday step count pull in the same direction - the midday sun in June addresses both at once.",
    },
    kontext: {
      de: "Sonne, Bewegung und Ernährung greifen hier ineinander.",
      en: "Sun, movement and food all work together here.",
    },
  },
};

export function insightStatementFuer(
  hinweisId: string,
  locale: Locale,
): InsightStatementDaten | undefined {
  const q = insightStatementQuellen[hinweisId];
  return q ? { haupt: q.haupt[locale], kontext: q.kontext[locale] } : undefined;
}

/** Locale-unabhängige ID-Liste der Hinweise mit Insight-Statement. */
export const insightStatementIds: string[] = Object.keys(insightStatementQuellen);

// ─────────────────────────────────────────────────────────────────────────
// INSIGHT-HEADER (Protected Core — im Code erhalten, nicht mehr in der UI):
// Kausal-Ketten aus Boxen + Pfeilen, kurzes Fazit.
// ─────────────────────────────────────────────────────────────────────────

export interface InsightKette {
  /** Boxen der Kette, mit „→" dazwischen gerendert. */
  boxen: string[];
}

export interface InsightHeaderDaten {
  ketten: InsightKette[];
  /** Wissenschaftliche Einordnung in einem Halbsatz (kursiv). */
  fazit: string;
}

interface InsightHeaderQuelleDaten {
  ketten: { boxen: Lokalisiert[] }[];
  fazit: Lokalisiert;
}

const insightHeaderQuellen: Record<string, InsightHeaderQuelleDaten> = {
  "lifestyle-schlaf": {
    ketten: [
      {
        boxen: [
          { de: "Abendtraining", en: "Evening workout" },
          { de: "HRV 29 ms ↓", en: "HRV 29 ms ↓" },
          { de: "Tiefschlaf 10 %", en: "Deep sleep 10 %" },
        ],
      },
      {
        boxen: [
          { de: "Vitamin D 24 ng/ml", en: "Vitamin D 24 ng/ml" },
          { de: "Schlafarchitektur ↓", en: "Sleep architecture ↓" },
        ],
      },
    ],
    fazit: {
      de: "Beide Faktoren verstärken sich gegenseitig.",
      en: "The two factors reinforce each other.",
    },
  },
  "kardio-blutdruck": {
    ketten: [
      {
        boxen: [
          { de: "Schlechter Schlaf", en: "Poor sleep" },
          { de: "Ruhepuls +7 BPM", en: "Resting heart rate +7 BPM" },
          { de: "Blutdruck ↑", en: "Blood pressure ↑" },
        ],
      },
      {
        boxen: [
          { de: "LDL 118 + Cholesterin 198", en: "LDL 118 + cholesterol 198" },
          { de: "Langzeit-Risiko", en: "Long-term risk" },
        ],
      },
    ],
    fazit: {
      de: "Schlaf ist dein stärkster Blutdruck-Hebel.",
      en: "Sleep is your strongest lever for blood pressure.",
    },
  },
  "reise-impfung": {
    ketten: [
      {
        boxen: [
          { de: "Hep A fehlt + Thailand", en: "Hep A missing + Thailand" },
          { de: "Infektionsrisiko", en: "Risk of infection" },
        ],
      },
      {
        boxen: [
          { de: "6 Wochen bis Abreise", en: "6 weeks until departure" },
          { de: "Impfschutz noch möglich", en: "Vaccination still possible" },
        ],
      },
    ],
    fazit: {
      de: "Jetzt handeln reicht — aber nicht in 3 Wochen.",
      en: "Acting now is enough - in 3 weeks it will not be.",
    },
  },
};

export function insightHeaderFuer(
  hinweisId: string,
  locale: Locale,
): InsightHeaderDaten | undefined {
  const q = insightHeaderQuellen[hinweisId];
  if (!q) return undefined;
  return {
    ketten: q.ketten.map((k) => ({ boxen: k.boxen.map((b) => b[locale]) })),
    fazit: q.fazit[locale],
  };
}

/** Locale-unabhängige ID-Liste der Hinweise mit Insight-Header. */
export const insightHeaderIds: string[] = Object.keys(insightHeaderQuellen);

// ─────────────────────────────────────────────────────────────────────────
// METHODE & DATENQUELLEN (aufklappbar) — je Datenpunkt
// zwei Zeilen: Quelle + konkreter Wert mit Kontext. Max. 4 Punkte je Hinweis.
// ─────────────────────────────────────────────────────────────────────────

export interface MethodePunkt {
  titel: string;
  /** Zeile 1: woher der Wert stammt. */
  quelle: string;
  /** Zeile 2: konkreter Wert + Kontext (Schnitt, Norm, Extremwert). */
  wert: string;
}

interface MethodePunktQuelleDaten {
  titel: Lokalisiert;
  quelle: Lokalisiert;
  wert: Lokalisiert;
}

const methodeQuellen: Record<string, MethodePunktQuelleDaten[]> = {
  "lifestyle-schlaf": [
    {
      titel: { de: "Tiefschlaf", en: "Deep sleep" },
      quelle: {
        de: "gemessen von deiner Apple Watch Series 12",
        en: "measured by your Apple Watch Series 12",
      },
      wert: {
        de: "Schnitt letzte 14 Nächte: 16 % · schlechteste Nacht: 10 %",
        en: "Average of the last 14 nights: 16 % · lowest night: 10 %",
      },
    },
    {
      titel: { de: "HRV", en: "HRV" },
      quelle: {
        de: "optischer Pulssensor deiner Apple Watch Series 12",
        en: "optical heart rate sensor on your Apple Watch Series 12",
      },
      wert: {
        de: "Schnitt: 40 ms · nach Abendtraining: 29 ms",
        en: "Average: 40 ms · after an evening workout: 29 ms",
      },
    },
    {
      titel: { de: "Vitamin D", en: "Vitamin D" },
      quelle: { de: "Laborwert aus deiner ePA", en: "lab value from your ePA" },
      wert: {
        de: "Messung 12.03.2026: 24 ng/ml · Norm: 30–60 ng/ml",
        en: "Measured 12 March 2026: 24 ng/ml · normal range: 30-60 ng/ml",
      },
    },
    {
      titel: { de: "Ruhepuls", en: "Resting heart rate" },
      quelle: {
        de: "optischer Pulssensor, letzte 30 Tage",
        en: "optical heart rate sensor, last 30 days",
      },
      wert: {
        de: "Schnitt: 60 BPM · schlechteste Nacht: 64 BPM",
        en: "Average: 60 BPM · highest night: 64 BPM",
      },
    },
  ],
  "kardio-blutdruck": [
    {
      titel: { de: "Blutdruck", en: "Blood pressure" },
      quelle: {
        de: "Praxismessung aus deiner ePA",
        en: "measured at the practice, from your ePA",
      },
      wert: {
        de: "6-Monats-Trend: 118 → 128 mmHg · Norm: < 130/85 mmHg",
        en: "6-month trend: 118 → 128 mmHg · normal: < 130/85 mmHg",
      },
    },
    {
      titel: { de: "Ruhepuls", en: "Resting heart rate" },
      quelle: {
        de: "optischer Pulssensor deiner Apple Watch Series 12",
        en: "optical heart rate sensor on your Apple Watch Series 12",
      },
      wert: {
        de: "Schnitt: 57 BPM · Schlechtnacht: 64 BPM",
        en: "Average: 57 BPM · after a poor night: 64 BPM",
      },
    },
    {
      titel: { de: "Cholesterin", en: "Cholesterol" },
      quelle: { de: "Laborwert aus deiner ePA", en: "lab value from your ePA" },
      wert: {
        de: "Gesamt: 198 mg/dl · LDL: 118 mg/dl",
        en: "Total: 198 mg/dl · LDL: 118 mg/dl",
      },
    },
    {
      titel: { de: "Ferritin", en: "Ferritin" },
      quelle: { de: "Laborwert aus deiner ePA", en: "lab value from your ePA" },
      wert: {
        de: "18 µg/l · Norm: 15–150 µg/l",
        en: "18 µg/l · normal range: 15-150 µg/l",
      },
    },
  ],
  "reise-impfung": [
    {
      titel: { de: "Hepatitis A", en: "Hepatitis A" },
      quelle: {
        de: "Impfstatus aus deiner ePA",
        en: "vaccination status from your ePA",
      },
      wert: {
        de: "kein Eintrag · für Thailand empfohlen",
        en: "no entry · recommended for Thailand",
      },
    },
    {
      titel: { de: "Hepatitis B", en: "Hepatitis B" },
      quelle: {
        de: "Impfstatus aus deiner ePA",
        en: "vaccination status from your ePA",
      },
      wert: {
        de: "kein Eintrag · Schnellschema (3 Dosen) möglich",
        en: "no entry · rapid schedule (3 doses) possible",
      },
    },
    {
      titel: { de: "Reiseziel", en: "Destination" },
      quelle: { de: "aus deiner Reiseplanung", en: "from your travel plans" },
      wert: {
        de: "Thailand · Abreise 15.08.2026",
        en: "Thailand · departure 15 August 2026",
      },
    },
    {
      titel: { de: "Tetanus", en: "Tetanus" },
      quelle: {
        de: "Impfstatus aus deiner ePA",
        en: "vaccination status from your ePA",
      },
      wert: {
        de: "letzte Auffrischung: 2017 · Intervall: 10 Jahre",
        en: "last booster: 2017 · interval: 10 years",
      },
    },
  ],
};

export function methodeFuer(hinweisId: string, locale: Locale): MethodePunkt[] {
  return (methodeQuellen[hinweisId] ?? []).map((q) => ({
    titel: q.titel[locale],
    quelle: q.quelle[locale],
    wert: q.wert[locale],
  }));
}

/** Locale-unabhängige ID-Liste der Hinweise mit Methode-Punkten. */
export const methodeIds: string[] = Object.keys(methodeQuellen);

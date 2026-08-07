// Deutsches Woerterbuch. Dies ist die Quelle der Wahrheit fuer die STRUKTUR:
// aus `typeof de` wird der Typ `Dictionary` abgeleitet, gegen den das englische
// Woerterbuch typisiert wird. Ein dort fehlender Schluessel bricht den Build.
//
// Regeln (siehe I18N_INVENTORY.md und Auftrag 4.2):
// - Verschachtelte Objekte, gruppiert je Route bzw. Feature.
// - Schluesselnamen beschreiben Bedeutung und Ort, nie den deutschen Wortlaut.
// - Ein Eintrag pro Bedeutung; gleicher Wortlaut in anderem Kontext bekommt
//   einen eigenen Eintrag, weil er in der Zielsprache auseinanderlaufen kann.
// - Texte mit variablen Anteilen sind Funktionen, nie String-Konkatenation.

import type { Widen } from "./types";

export const de = {
  /** Persistente Bottom-Navigation (4 Haupt-Tabs). */
  nav: {
    ariaLabel: "Hauptnavigation",
    home: "Home",
    insights: "VitaLink",
    appointments: "Termine",
    profile: "Profil",
  },

  /** Gemeinsame UI-Bausteine (Dialog, Sheets, wiederkehrende Aktionen). */
  common: {
    closeDialog: "Dialog schließen",
    continue: "Weiter",
    connect: "Verbinden",
  },

  /** Home / kuratierte Tagesuebersicht. */
  dashboard: {
    greetingMorning: "Guten Morgen",
    greetingDay: "Guten Tag",
    greetingEvening: "Guten Abend",
    greetingNight: "Gute Nacht",
    // Vollstaendiger Satz mit Platzhaltern; {n} setzt fmt.plural, {land} der Aufrufer.
    travelCountdown: { one: "{land} in {n} Woche", other: "{land} in {n} Wochen" },
    missingInEpa: (impfungen: string) => `${impfungen} fehlen in deiner ePA`,
    check: "Prüfen",
    currentValues: "Aktuelle Werte",
    seeAll: "Alle ansehen",
    forYouToday: "Für dich heute",
    nextAppointment: "Nächster Termin",
    dentist: "Zahnarzt",
    appointmentLine: (datum: string, art: string) => `${datum} · ${art}`,
    inDays: { one: "in {n} Tag", other: "in {n} Tagen" },
    directions: "Wegbeschreibung",
    privacyTitle: "Deine Daten. Deine Entscheidung.",
    privacySub: "DSGVO-konform · lokal gespeichert",
    metrics: {
      steps: "Schritte",
      sleep: "Schlaf",
      pulse: "Puls",
      bloodPressure: "Blutdruck",
      bloodSugar: "Blutzucker",
      respiratoryRate: "Atemfrequenz",
      weight: "Gewicht",
      height: "Körpergröße",
      bmi: "BMI",
    },
    badges: {
      normal: "Normal",
      optimal: "Optimal",
      stable: "Stabil",
      stepsDelta: "+18 %",
      sleepGoal: "89 % Ziel",
    },
    subs: {
      // F14: deutsche Tausender-/Dezimaltrennung; die englische Fassung nutzt en-GB.
      stepsPrev: "Vorwoche: 10.100",
      sleepGoal: "Ziel: 7,5 h",
      pulsePrev: "Vorwoche: 62",
      bpNorm: "Norm <130/85",
      sugarPrev: "Vorwert: 95",
      respNorm: "Norm 12–20",
      weightInRange: "im Zielbereich",
      heightMeasured: "gemessen",
      bmiRange: "18,5–24,9",
    },
  },

  /** "Deine Analysen" - die vollstaendige, erklaerbare Analysenliste. */
  insights: {
    title: "Deine Analysen",
    // Eigener Eintrag, obwohl wortgleich mit `title`: andere Stelle, kann in
    // der Zielsprache auseinanderlaufen.
    sectionAll: "Deine Analysen",
    status: (datum: string, anzahl: string) => `Stand ${datum} · ${anzahl} Analysen`,
    rangeAriaLabel: "Zeitraum",
    rangeToday: "Heute",
    rangeWeek: "Woche",
    rangeMonth: "Monat",
    metaInsight:
      "Dein Donnerstag ist dein schwächster Tag — eine Trainingsverschiebung würde mehrere Werte gleichzeitig verbessern.",
    metaAnalysis: "14-Tage-Analyse",
    sourceEpa: "ePA",
    sourceWearable: "Wearable",
    sectionUpcoming: "Anstehend",
    emptyState: "Keine Analysen verfügbar. Aktiviere Datenquellen, um Hinweise zu erhalten.",
    enableInSettings: "In den Einstellungen aktivieren",
  },

  /** Ueber / Forschungskontext. Enthaelt die einzige Disclaimer-Box der App. */
  about: {
    headerTitle: "Über VitaLink",
    backLabel: "Einstellungen",
    tagline: "Forschungsprototyp · Hochschule Ruhr West",
    version: "Version 1.0 · SoSe 2026",
    rowProgramme: "Studiengang",
    rowMethod: "Methodik",
    rowSupervision: "Betreuung",
    rowUniversity: "Hochschule",
    rowPeriod: "Zeitraum",
    valueMethod: "eDSR nach Tuunanen et al.",
    valuePeriod: "SoSe 2026",
    disclaimerLabel: "Hinweis zum Prototyp",
    // L5: Diese Passage traegt die rechtliche Schutzwirkung und wird bewusst
    // konservativ-woertlich uebersetzt. Nicht kuerzen, nicht abschwaechen.
    disclaimerBody:
      "VitaLink ist ein Forschungsprototyp im Rahmen eines Masterprojekts im Modul Menschzentrierte Technikentwicklung für eine digitale Gesellschaft (Studiengang Master Mensch-Technik-Interaktion, MTI) an der Hochschule Ruhr West, SoSe 2026. Die dargestellten Gesundheitsdaten sind illustrativ und stellen keine medizinische Beratung dar. VitaLink ist kein Medizinprodukt. Für medizinische Fragen wende dich an deine Hausarztpraxis.",
    buildStamp: (stand: string) => `Stand: ${stand}`,
  },

  /** Antippbare Fachbegriffe (DF8) und Glossar-Bottom-Sheet. */
  glossary: {
    stop: "Stopp",
    readAloud: "Vorlesen",
    close: "Schließen",
    openInGlossary: "Im Glossar ansehen",
    /** Langform-Anzeige bei aktivem Umschalter "Fachbegriffe ausschreiben". */
    expanded: (langform: string, kuerzel: string) => `${langform} (${kuerzel})`,
  },

  /** Onboarding-Kette: Verbinden -> ePA-Assistent -> Synchronisieren. */
  onboarding: {
    connect: {
      title: "Datenquellen verbinden",
      subtitle: "Verbinde deine Geräte für personalisierte Empfehlungen",
      wearableHeading: "Wearable",
      wearableDetected: "Erkannt via Bluetooth",
      wearableConnected: "Verbunden",
      epaHeading: "Elektronische Patientenakte",
      epaBody: "Verknüpfe deine ePA, um Impfungen, Laborwerte und Medikamente einzubeziehen.",
      epaSecure: "Sicher via NFC-Karte",
      disconnectHint: "Du kannst die Verbindung jederzeit in den Einstellungen trennen.",
    },
    epa: {
      wizardTitle: "ePA Verknüpfungsassistent",
      cardAlt: "Gesundheitskarte",
      introTitle: "ePA verbinden",
      introBody:
        "Halte nach Aufforderung deine Gesundheitskarte ans Handy, um deine elektronische Patientenakte sicher zu verknüpfen.",
      introCta: "Verknüpfen starten",
      tapTitleDone: "Karte erkannt ✓",
      tapTitle: "Gesundheitskarte ans Handy halten",
      tapBodyDone: "NFC-Verbindung hergestellt – einen Moment …",
      tapBody: "Bitte die Karte auf der Rückseite des Handys berühren",
      pinTitle: "ePA-PIN eingeben",
      pinHint: "Demo: beliebige 4-stellige Zahl",
      successTitle: "ePA verbunden",
      successBody: "Verbindung hergestellt — deine Daten werden gleich synchronisiert.",
      successWearableSub: "Wearable-Daten verbunden",
      successEpaLabel: "Elektronische Patientenakte",
      successEpaSub: "ePA erfolgreich verknüpft",
    },
    sync: {
      title: "Daten werden verarbeitet",
      subtitle: "Einen Moment bitte …",
      stepWearable: "Wearable-Daten werden geladen …",
      stepWearableDone: "Wearable-Daten",
      stepEpa: "ePA-Einträge werden synchronisiert …",
      stepEpaDone: "ePA-Einträge",
      stepInsights: "Empfehlungen werden berechnet …",
      stepInsightsDone: "Empfehlungen",
    },
  },
} as const;

export type Dictionary = Widen<typeof de>;

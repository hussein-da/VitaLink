// Deutsches Woerterbuch. Dies ist die Quelle der Wahrheit fuer die STRUKTUR:
// aus `typeof de` wird der Typ `Dictionary` abgeleitet, gegen den das englische
// Woerterbuch typisiert wird. Ein dort fehlender Schluessel bricht den Build.
//
// Regeln:
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
    loading: "Lädt …",
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

  /** Sensordaten-Uebersicht (/werte). */
  values: {
    headerTitle: "Deine Sensordaten",
    headerEyebrow: "Home",
    backInsights: "VitaLink",
    backHome: "Home",
    intro:
      "Alle Werte von deiner Apple Watch Series 12 und aus deiner ePA. Tippe das Info-Symbol für die Datenherkunft, unterstrichene Begriffe für die Erklärung.",
    sourceTooltip: (label: string) => `Datenherkunft von ${label} ansehen`,

    sectionHeart: "Herzgesundheit",
    sectionSleep: "Schlaf",
    sectionActivity: "Aktivität",
    sectionMetabolism: "Stoffwechsel",
    sectionBreathing: "Atmung & Erholung",
    sectionEpa: "Vitalwerte aus der ePA",

    labelRestingHeartRate: "Ruhepuls",
    labelHrv: "HRV",
    labelVo2max: "VO₂max",
    labelHeartRateZones: "Herzfrequenzzonen",
    labelSleepDuration: "Schlafdauer",
    labelDeepSleep: "Tiefschlaf",
    labelSleepScore: "Schlaf-Score",
    labelSteps: "Schritte",
    labelActiveMinutes: "Aktive Minuten",
    labelWorkouts: "Trainingseinheiten",
    labelCalories: "Kalorienverbrauch",
    labelFastingGlucose: "Nüchtern-Glukose",
    labelPostMealGlucose: "Wert nach dem Essen",
    labelGlucoseVariability: "Glukose-Variabilität",
    labelSpo2: "SpO₂",
    labelRespiratoryRate: "Atemfrequenz",
    labelStressScore: "Stress-Score",
    labelSkinTemperature: "Hauttemperatur",
    labelBloodPressure: "Blutdruck",
    labelWeight: "Gewicht",
    labelBmi: "BMI",

    unitActiveMinutes: "Min/Tag",
    unitWorkoutsPerWeek: "/Woche",
    unitCalories: "kcal/Tag",

    valueHeartRateZone: "Zone 2",

    contextRestingHeartRate: "stabil, gute Erholung",
    contextHrv: "guter Wochenschnitt",
    // Vollstaendiger Satz mit Platzhaltern: {n} setzt fmt.plural (Tage),
    // die Trainingsminuten reicht der Aufrufer locale-formatiert herein.
    contextHeartRateZones: (minuten: string) => ({
      one: `Grundlagenbereich · ${minuten} Min in {n} Tag`,
      other: `Grundlagenbereich · ${minuten} Min in {n} Tagen`,
    }),
    contextSleepDuration: (ziel: string) => `etwas unter dem Ziel von ${ziel} h`,
    contextDeepSleep: "im unteren Normbereich",
    contextSleepScore: "mittlere Erholung",
    contextSteps: "Tagesschnitt, über dem WHO-Ziel",
    contextActiveMinutes: "solide",
    contextWorkouts: "Kraft + Ausdauer",
    contextCalories: "Tagesmittel",
    contextFastingGlucose: "im Normbereich",
    contextPostMealGlucose: "unauffälliger Ø-Peak",
    contextGlucoseVariability: "stabile Werte",
    contextSpo2: "normal (> 95 %)",
    contextRespiratoryRate: "Norm 12–20",
    contextStressScore: "moderat",
    contextSkinTemperature: "Baseline, stabil",
    contextBloodPressure: "oberer Normbereich",
    contextWeight: "stabil",
    contextBmi: "Normalgewicht",

    footerNote:
      "Synthetische Beispieldaten (Studienprofil). Hinweis, keine Diagnose — kein Medizinprodukt.",
  },

  /** Arztbericht-Export (/export): Empfaenger, Datenauswahl, Zusammenfassung, Toast. */
  exportReport: {
    title: "Arztbericht",
    backToSettings: "Einstellungen",
    introTitle: "Deine Daten für den Arzt",
    introText:
      "Wähle aus, was dein Arzt sehen soll. VitaLink bereitet daraus einen übersichtlichen Bericht vor.",
    recipientSection: "Für welchen Termin",
    // Schluessel = Empfaenger-Union aus exportKategorien.ts (locale-unabhaengig).
    recipients: {
      hausarzt: { label: "Hausarzt", forAppointment: "Für Hausarzttermin" },
      kardiologe: { label: "Kardiologe", forAppointment: "Für Kardiologietermin" },
      anderer: { label: "Anderer", forAppointment: "Für Arzttermin" },
    },
    contentSection: "Inhalte auswählen",
    selectAll: "Alles auswählen",
    clearSelection: "Auswahl aufheben",
    summarySection: "Zusammenfassung",
    reportTitle: "Dein Arztbericht",
    summaryDataPoints: { one: "{n} Datenpunkt", other: "{n} Datenpunkte" },
    summaryCategories: { one: "{n} Kategorie", other: "{n} Kategorien" },
    summaryLine: (datenpunkte: string, kategorien: string) => `${datenpunkte} · ${kategorien}`,
    summaryLineWithVitalink: (datenpunkte: string, kategorien: string) =>
      `${datenpunkte} · ${kategorien} · mit VitaLink-Analyse`,
    dataRange: "Daten: letzte 14–30 Tage",
    createdToday: (datum: string) => `Erstellt: heute, ${datum}`,
    createPdf: "PDF erstellen",
    resetSelection: "Auswahl zurücksetzen",
    toastPreparing: "PDF wird vorbereitet …",
    toastDone:
      "PDF wurde erstellt. In einem echten System würde die Datei jetzt heruntergeladen.",
  },

  /** Einstellungen (/einstellungen). */
  settings: {
    title: "Einstellungen",
    backToProfile: "Profil",

    // Block A — Darstellung & Bedienung
    blockAppearanceTitle: "Darstellung & Bedienung",
    languageLabel: "Sprache",
    languagePartial: "Teilweise übersetzt",
    languageSheetTitle: "Sprache wählen",
    languageSheetAria: "Sprache wählen",
    appearanceTitle: "Anzeigemodus",
    appearanceGroupAria: "Anzeigemodus",
    themeOption: {
      light: "Hell",
      dark: "Dunkel",
      system: "System",
    },
    textSizeTitle: "Schriftgröße",
    spellOutTermsTitle: "Fachbegriffe ausschreiben",
    spellOutTermsExample: "HRV → Herzratenvariabilität",
    spellOutTermsSwitchAria: "Fachbegriffe ausschreiben",

    // Block B — Export & Berichte
    blockExportTitle: "Export & Berichte",
    reportTitle: "Arztbericht erstellen",
    reportText:
      "Erstelle eine verständliche Zusammenfassung deiner Gesundheitsdaten für dein nächstes Arztgespräch.",
    reportCta: "Bericht vorbereiten",

    // Block C — Daten & Freigaben
    blockDataTitle: "Daten & Freigaben",
    dataIntro:
      "Lege fest, welche Daten VitaLink für deine Hinweise nutzen darf. Wenn du eine Quelle deaktivierst, entfallen die darauf basierenden Empfehlungen. Du kannst jede Freigabe jederzeit ändern.",
    dataGroupEpa: "Datenschutz — ePA",
    dataGroupWearable: "Datenschutz — Wearable",

    // Block D — Deine Datenschutz-Entscheidungen
    blockDecisionsTitle: "Deine Datenschutz-Entscheidungen",
    decisionsIntro:
      "Hier siehst du, welche Datenquellen du freigegeben oder deaktiviert hast. Du kannst deine Entscheidung jederzeit unter „Daten & Freigaben\" ändern.",
    loading: "Wird geladen …",
    allSourcesEnabled: "Alle Datenquellen sind aktuell freigegeben.",
    allSourcesEnabledHint: "Du kannst Freigaben jederzeit unter „Daten & Freigaben\" anpassen.",
    disabledSourceHint:
      "Deaktiviert · Empfehlungen auf Basis dieser Quelle werden nicht angezeigt.",
    reenableAll: "Alle wieder aktivieren",

    // Block E — Informationen & Hilfe
    blockInfoTitle: "Informationen & Hilfe",
    aboutRow: "Über VitaLink",

    // Block F — Abkürzungsverzeichnis
    blockGlossaryTitle: "Abkürzungsverzeichnis",
    glossaryRowTitle: "Abkürzungen nachschlagen",
    glossaryEntries: { one: "{n} Eintrag", other: "{n} Einträge" },
    glossaryOwnEntries: { one: "{n} eigener", other: "{n} eigene" },
    glossaryCountLine: (entries: string, own: string) => `${entries} · ${own}`,

    // Bestätigungs-Sheet beim Deaktivieren einer Datenquelle
    disableSheetTitle: "Datenquelle deaktivieren?",
    disableSheetAria: "Datenquelle deaktivieren?",
    disableSheetText: (quelle: string) =>
      `„${quelle}": Die darauf basierenden Empfehlungen werden dann nicht mehr angezeigt.`,
    disableConfirm: "Trotzdem deaktivieren",
    cancel: "Abbrechen",
  },

  /** Hinweis-Detail (/hinweis/[id]) und die Bausteine des erklaerbaren Kerns. */
  insightDetail: {
    // --- Detailseite: Zurueck / nicht gefunden ---
    back: "Zurück",
    notFoundTitle: "Hinweis nicht gefunden",
    notFoundBody: "Diesen Hinweis gibt es nicht (mehr).",
    notFoundLink: "Zurück zu deinen Analysen",

    // --- Abgeschaltete Datenquellen (DF11) ---
    disabledSourcesTitle: "Dieser Hinweis nutzt abgeschaltete Quellen",
    disabledSourcesAffectedLabel: "Betroffen:",
    disabledSourcesNote: "Die Aussage wird daher nicht vollständig berechnet.",
    disabledSourcesAction: "In den Einstellungen wieder einschalten",

    // --- Sektionen ---
    sectionRecommendations: "Smarte Empfehlungen",
    sectionDataBasis: "Datengrundlage",
    sectionHowItWorks: "Wie VitaLink zu diesen Empfehlungen kommt",
    sectionWhatIf: "Was wäre, wenn",
    sectionSimilarAppointments: "Ähnliche Termine in deiner ePA",
    similarAppointmentsSeeAll: "Alle ansehen",
    sectionTravelPlanning: "Reiseplanung",
    travelCta: "Reiseziel und Impfungen verwalten",

    // --- G7: Diagnose-Hinweis (kein Medizinprodukt) ---
    disclaimerNoDiagnosis:
      "Hinweis, keine Diagnose. Diese Empfehlung dient der Orientierung und ersetzt keine ärztliche Einschätzung.",
    disclaimerUncertain:
      "Der dargestellte Trend basiert auf wenigen Messpunkten — die statistische Aussagekraft ist begrenzt.",

    // --- UncertaintyBadge (DF2) ---
    uncertaintyAriaLabel: "Unsicherheits-Hinweis",
    uncertaintyLead: "Hinweis, keine Diagnose.",
    uncertaintyBody:
      "Die Modellkonfidenz ist hier niedrig. Bitte den Wert bei Fragen oder anhaltenden Beschwerden ärztlich abklären lassen.",

    // --- InsightStatement ---
    patternLabel: "Das Muster",

    // --- DataSourceMiniCard ---
    originTooltipLabel: (wert: string) => `Datenherkunft von ${wert} ansehen`,

    // --- VorsorgeTerminZeile ---
    appointmentLast: (datum: string) => `zuletzt: ${datum}`,
    appointmentNext: (datum: string) => `nächste: ${datum}`,

    // --- CounterfactualSlider (Variante C) ---
    whatIfIntro:
      "Verschiebe den Regler und sieh, wie sich der Hinweis verändern würde. Die zugrunde liegenden Daten bleiben unverändert — das ist ein Gedankenexperiment.",

    // --- SmartTippCard ---
    tipHidden: (titel: string) => `„${titel}" ausgeblendet`,
    tipUndo: "Rückgängig",
    tipHideAria: (titel: string) => `„${titel}" ausblenden`,
    tipDataBasisLabel: "Datengrundlage:",
    tipSourceEpa: "ePA",
    tipSourceWearable: "Wearable",
    tipSourceContext: "Kontext",

    // --- FeedbackControls ---
    likeRemoveAria: "Gemerkt aufheben",
    likeAddAria: "Empfehlung merken",
    objectionChangeAria: "Widerspruch ändern",
    objectionAddAria: "Passt nicht zu mir",

    // --- ObjectionDialog (DF12) ---
    objectionDialogTitle: "Rückmeldung geben",
    objectionLegend:
      "Warum passt dieser Hinweis nicht zu dir? Deine Angabe bleibt nur auf diesem Gerät.",
    objectionFreetextLabel: "Optionaler Freitext",
    objectionFreetextPlaceholder: "Optional: in eigenen Worten ...",
    objectionCancel: "Abbrechen",
    objectionSave: "Speichern",
  },

  /**
   * Vorsorge & Termine: Liste (/termine), Termin-Karte, Platzhalter-Detail,
   * Praxis-Kontakt-Sheet aus der ePA und die Benachrichtigungs-Glocke.
   */
  appointments: {
    title: "Vorsorge & Termine",
    // F5: Zaehlzeile im Kopf. Beide Formen sind vollstaendige Textbausteine,
    // auch wo der deutsche Fall n===1 im Demo-Datenstand nie eintritt.
    countImportantNow: { one: "{n} jetzt wichtig", other: "{n} jetzt wichtig" },
    countSoon: { one: "{n} bald", other: "{n} bald" },
    countDone: { one: "{n} erledigt", other: "{n} erledigt" },
    filterAriaLabel: "Termine filtern",
    filterAll: "Alle",
    filterNow: "Jetzt wichtig",
    filterSoon: "Bald planen",
    // Eigener Eintrag: der Filter-Chip ist kuerzer als das Sektions-Label
    // "Später im Blick" in data/termine.ts.
    filterLater: "Später",
    filterDone: "Erledigt",
    toastPlannedInCalendar: (titel: string) =>
      `„${titel}" würde in einem echten System in deinen Kalender übernommen.`,
    toastCorrectionInactive: "Eintrag korrigieren ist in dieser Demo nicht aktiv.",

    /* Termin-Karte (/termine) */
    cardDetails: "Details",
    cardPlanAppointment: "Termin planen",
    cardCorrect: "Korrigieren",

    /* Ehrliche Platzhalter-Detailseite (/termine/placeholder) */
    placeholderHeaderTitle: "Vorsorge-Hinweis",
    placeholderBackLabel: "Termine",
    placeholderTitle: "Noch nicht vollständig erklärt",
    placeholderBody:
      "Dieser Vorsorge-Hinweis ist in der Demo noch nicht mit einer vollständigen Erklärungsseite verknüpft. Die Funktion ist angelegt und wird schrittweise ausgebaut.",
    placeholderBack: "Zurück zu Terminen",

    /* Kontakt-Sheet der gynäkologischen Praxis (Daten aus der ePA) */
    practiceSheetAriaLabel: "Kontaktdaten der gynäkologischen Praxis aus deiner ePA",
    practiceFromEpa: "Aus deiner ePA",
    practiceSpecialty: "Gynäkologische Vorsorge · Bochum",
    practiceAddressLabel: "Adresse",
    practicePhoneLabel: "Telefon",
    practiceEmailLabel: "E-Mail",
    practiceHoursLabel: "Öffnungszeiten",
    // F12: eingefrorene Referenzdaten der synthetischen Praxis; nur die
    // Wochentags-Kürzel sind sprachabhängig, die Uhrzeiten bleiben gleich.
    practiceHours: [
      "Mo, Di, Do  8:00–12:30 · 15:00–18:00",
      "Mi  8:00–13:00",
      "Fr  8:00–12:00",
    ],
    practiceLastVisitDate: "12.08.2025",
    // Vollständiger Satz als EINE Übersetzungseinheit; {datum} markiert die
    // hervorgehobene Stelle, die die Komponente fett setzt.
    practiceEpaSourceNote:
      "Diese Kontaktdaten stammen aus deiner ePA — von deinem letzten Vorsorgebesuch am {datum} bei dieser Praxis.",
    practiceClose: "Schließen",

    /* Benachrichtigungs-Glocke im Home-Header (synthetische Demo-Meldungen) */
    notificationsButtonAriaLabel: "Benachrichtigungen",
    notificationsDialogAriaLabel: "Benachrichtigungen",
    notificationsTitle: "Benachrichtigungen",
    notificationsMarkAllRead: "Alle lesen",
    notificationsEmpty: "Keine neuen Benachrichtigungen",
    notificationDentistTitle: "Zahnarzttermin im Juli",
    notificationDentistText: "Plane rechtzeitig einen Termin bei Dr. Maier ein.",
    notificationTravelTitle: "Thailand: Impfschutz prüfen",
    notificationTravelText: "Hepatitis A und B fehlen in deiner ePA.",
    notificationWeeklyTitle: "Neue Wochenanalyse verfügbar",
    notificationWeeklyText: "Dein Wellness-Score ist um 4 Punkte gestiegen.",
    notificationTimeToday: "Heute",
    notificationTimeYesterday: "Gestern",
    notificationTimeDaysAgo: { one: "Vor {n} Tag", other: "Vor {n} Tagen" },
  },

  /** Profil-Bereich: /profil, /glossar, /rueckmeldungen und ihre Sheets. */
  profileArea: {
    // — /profil —
    title: "Profil",
    subtitle: "Beispiel-Persona der Nutzerstudie",
    personaAgeYears: { one: "{n} Jahr", other: "{n} Jahre" },
    personaMeta: (alter: string, ort: string) => `${alter} · ${ort}`,
    personaSyntheticBadge: "Beispieldaten · synthetisch",
    avatarSectionTitle: "Avatar wählen",
    avatarInitialLabel: "Initiale als Avatar",
    avatarOptionLabel: (emoji: string) => `Avatar ${emoji}`,
    cardSectionTitle: "Versichertenkarte",
    cardBrand: "Gesundheitskarte",
    cardNumberLabel: "Versichertennummer",
    cardSampleBadge: "Beispiel",
    cardFootnote: (praxis: string) =>
      `Hausärztin: ${praxis}. Alle Angaben sind synthetische Beispieldaten.`,
    manageSectionTitle: "Verwaltung",
    linkFeedback: "Meine Rückmeldungen",
    linkGlossary: "Glossar",
    linkSettings: "Einstellungen",
    linkAbout: "Über VitaLink",

    // — Profil-Avatar im Home-Header —
    headerAvatarLabel: "Profil und Konto",

    // — /glossar —
    glossaryTitle: "Glossar",
    glossaryBackLabel: "Profil",
    glossaryLoading: "Lädt …",
    glossaryIntro:
      "Jeder Fachbegriff einfach erklärt. In den Erklärtexten der App sind diese Begriffe gestrichelt unterstrichen und direkt antippbar.",
    glossarySearchPlaceholder: "Begriff suchen …",
    /** Filter-Chips; Schlüssel = FilterKat aus /glossar. */
    glossaryFilters: {
      alle: "Alle",
      nutzerdefiniert: "Meine",
      allgemein: "Allgemein",
      herz: "Herz",
      labor: "Labor",
      schlaf: "Schlaf",
      digital: "Digital",
    },
    /** Gruppen-Überschriften; Schlüssel = AbkuerzungKategorie. */
    glossaryCategories: {
      herz: "Herzgesundheit",
      labor: "Laborwerte",
      schlaf: "Schlaf",
      digital: "Digital",
      allgemein: "Allgemein",
      nutzerdefiniert: "Meine Einträge",
    },
    glossaryEmptyTitle: "Kein Eintrag gefunden",
    glossaryEmptyHint: (begriff: string) => `Füge „${begriff}“ als eigene Abkürzung hinzu.`,
    glossaryEmptyAddCta: "Hinzufügen",
    glossaryRemoveEntryLabel: (kuerzel: string) => `${kuerzel} entfernen`,
    glossaryAddOwnCta: "Eigene Abkürzung hinzufügen",

    // — Bottom-Sheet „Eigene Abkürzung" —
    addAbbrTitle: "Eigene Abkürzung",
    addAbbrIntro: "Füge Abkürzungen hinzu, die du in VitaLink häufig siehst.",
    addAbbrShortLabel: "Kürzel",
    addAbbrShortPlaceholder: "z. B. ALT",
    addAbbrLongLabel: "Ausgeschrieben",
    addAbbrLongPlaceholder: "z. B. Alanin-Aminotransferase",
    addAbbrExplanationLabel: "Erklärung (optional)",
    addAbbrExplanationPlaceholder: "Kurze Erklärung in einfacher Sprache …",
    addAbbrCharCount: (genutzt: string, maximum: string) => `${genutzt}/${maximum}`,
    addAbbrErrorShortMissing: "Bitte ein Kürzel eingeben",
    addAbbrErrorLongMissing: "Bitte den Begriff ausschreiben",
    addAbbrErrorDuplicate: (kuerzel: string) =>
      `Diese Abkürzung gibt es bereits — sieh nach unter „${kuerzel}“`,
    addAbbrSubmit: "Hinzufügen",
    addAbbrCancel: "Abbrechen",

    // — /rueckmeldungen —
    feedbackTitle: "Meine Rückmeldungen",
    feedbackBackLabel: "Profil",
    feedbackIntro:
      "Hier sammeln sich deine Rückmeldungen zu einzelnen Empfehlungen. Alles bleibt nur auf diesem Gerät gespeichert.",
    feedbackLoading: "Wird geladen …",
    feedbackEmptyTitle: "Noch keine Rückmeldungen",
    feedbackEmptyBody:
      "Öffne eine Analyse und bewerte einzelne Empfehlungen mit 👍, 👎 oder blende sie mit „×“ aus.",
    feedbackEmptyCta: "Zu deinen Analysen",
    feedbackObjectedHeading: { one: "Widersprochen · {n}", other: "Widersprochen · {n}" },
    feedbackLikedHeading: { one: "Gemerkt · {n}", other: "Gemerkt · {n}" },
    feedbackHiddenHeading: { one: "Ausgeblendet · {n}", other: "Ausgeblendet · {n}" },
    feedbackParentContext: (titel: string) => `in „${titel}“`,
    /** L3: `freitext` ist Nutzertext und wird nie übersetzt — nur der Rahmen. */
    feedbackObjectionWithNote: (grund: string, freitext: string) => `${grund} – „${freitext}“`,
    feedbackEditObjection: "Ändern",
    feedbackRemoveObjection: "Entfernen",
    feedbackRemoveLike: "Entfernen",
    feedbackRestore: "Wieder einblenden",
  },

  /** Wiederverwendete Oberflaechen-Bausteine (Hero, Karten, Panels, Schalter). */
  widgets: {
    /** Gesundheits-Score-Hero auf Home (WellnessHero). */
    wellness: {
      sectionAria: "Dein Gesundheits-Score",
      eyebrow: "Gesundheits-Score",
      // Anzeigetexte zu den sprachneutralen Schluesseln aus lib/wellnessScore.
      labels: {
        "very-good": "Sehr gut",
        good: "Gut",
        moderate: "Mittel",
        low: "Niedrig",
      },
      deltaSinceYesterday: "↑ +4 seit gestern",
      whyButton: (score: string) => `Warum ${score}?`,
      sheetTitle: "Wie sich dein Score zusammensetzt",
      factorActivity: "Aktivität (12.584 Schritte)",
      factorHeart: "Herzgesundheit (60 BPM stabil)",
      factorSleep: "Schlaf (Score 67/100)",
      factorBloodPressure: "Blutdruck (leicht steigend)",
      factorLab: "Laborwerte (weitgehend gut)",
      factorPoints: (punkte: string) => `+${punkte}`,
      sheetFooter: "Der Score fasst deine Gesundheitsdaten aus ePA und Wearable zusammen.",
    },

    /** Wochenrueckblick-Karte (Schritte, Trainings, Ruhepuls je Zeitraum). */
    weeklyReview: {
      periods: {
        today: {
          label: "Heute",
          range: "29. Juni",
          stepsLabel: { one: "Schritt", other: "Schritte" },
        },
        week: {
          label: "Diese Woche",
          range: "17.–23. Juni",
          stepsLabel: { one: "Schritt/Woche", other: "Schritte/Woche" },
        },
        month: {
          label: "Dieser Monat",
          range: "Juni 2026",
          stepsLabel: { one: "Schritt/Monat", other: "Schritte/Monat" },
        },
      },
      workouts: { one: "Training", other: "Trainings" },
      restingPulse: "Ruhepuls",
      sourceOff: "Quelle aus",
      // Vollstaendiger Satz; {quelle} markiert den hervorgehobenen Quellennamen.
      sourceOffNotice:
        "Nutzt abgeschaltete Quelle: {quelle}. In den Einstellungen wieder einschalten.",
      sourceActivityWearable: "Aktivität (Wearable)",
      allSensorDataAria: (zeitraum: string) => `${zeitraum}: alle Sensordaten ansehen`,
      reviewAria: (zeitraum: string) => `Rückblick ${zeitraum}`,
    },

    /** Panel "Aktuelles im Ruhrgebiet" (News und Veranstaltungen). */
    ruhr: {
      sectionTitle: "Aktuelles im Ruhrgebiet",
      tabsAria: "Kategorie",
      tabNews: "News",
      tabEvents: "Veranstaltungen",
      // Quellen sind Eigennamen und bleiben, wo sie Eigennamen sind.
      items: {
        tiktokStudy: {
          title: "Psychische Gesundheit auf TikTok: Studie warnt vor Fehlinfos",
          source: "Uni Duisburg-Essen",
        },
        preventionStudy: {
          title: "Mehr Prävention statt teurer Behandlung: Public-Health-Studie",
          source: "Universitätsmedizin Essen",
        },
        clinicList: {
          title: "stern-Klinikliste 2026: Ruhrgebiets-Kliniken ausgezeichnet",
          source: "St. Elisabeth Gruppe",
        },
        nutritionEvent: {
          title: "Fokus Ernährung: Ernährung bei Kindern und Jugendlichen",
          source: "MedEcon Ruhr · Essen",
        },
        marathon: {
          title: "Rhein-Ruhr-Marathon und weitere Läufe",
          source: "Laufkalender Duisburg",
        },
        muelheimRuns: {
          title: "Stadt- und Volksläufe in Mülheim",
          source: "Laufkalender Mülheim",
        },
      },
      itemMeta: (quelle: string, datum: string) => `${quelle} · ${datum}`,
    },

    /** Herkunfts-Popover an Datenpunkten (DF5/DF6). */
    origin: {
      heading: "Datenherkunft",
      popoverAria: "Datenherkunft",
      defaultTriggerLabel: "Datenquelle ansehen",
      types: {
        epa: "Aus deiner ePA",
        wearable: "Apple Watch Series 12",
        userInput: "Deine Eingabe",
        vitalinkAi: "VitaLink-KI",
      },
    },

    /** Umschalter Schriftgroesse (DF7). */
    textSize: {
      groupAria: "Schriftgröße",
      standard: "Standard",
      large: "Groß",
    },

    /** Datenquellen-Zeile mit Schalter (DF11). */
    dataSource: {
      useSourceSwitchLabel: (label: string) => `${label} verwenden`,
    },
  },

  /**
   * Verwaiste Komponenten: derzeit ueber keine Route erreichbar, aber gepflegt
   * und zweisprachig gehalten. Gruppiert je Komponente.
   */
  orphaned: {
    /** XaiVariantSwitch — Umschalter zwischen den drei Erklaervarianten. */
    xaiSwitch: {
      sectionAria: "Erklärvariante",
      tablistAria: "Erklärvariante",
      tabWords: "In Worten",
      tabVisual: "Visuell",
      tabWhatIf: "Was wäre, wenn",
      referenceLabel: "Referenz:",
      noCounterfactual:
        "Für diesen regelbasierten Hinweis ist eine kontrafaktische Betrachtung nicht sinnvoll.",
    },

    /** FactorBars — Einflussfaktoren als Balken mit relativer Gewichtung. */
    factorBars: {
      intro:
        "So stark fließen die einzelnen Faktoren in diesen Hinweis ein (relative Gewichtung):",
      percentValue: (pct: string) => `${pct} %`,
      weightAria: { one: "{n} Prozent Gewichtung", other: "{n} Prozent Gewichtung" },
      barAria: (label: string, gewichtung: string) => `${label}: ${gewichtung}`,
      barAriaSourceOff: (label: string, gewichtung: string) =>
        `${label}: ${gewichtung}, Quelle abgeschaltet`,
      sourceOffNote: (quelle: string) => `${quelle} – Quelle abgeschaltet`,
    },

    /** ExplanationPanel — drei Erklaertiefen als Inline-Toggles. */
    explanationPanel: {
      openReasoning: "Begründung lesen",
      openDetail: "Detailansicht",
      collapse: "weniger",
    },

    /** ProvenanceChip — Herkunfts-Chip fuer ePA- und Wearable-Werte. */
    provenance: {
      noDate: "kein Datum",
      kindEpa: "ePA",
      kindWearable: "Wearable",
      kindWithMeta: (art: string, meta: string) => `${art} – ${meta}`,
      sourceOff: (art: string) => `${art} - Quelle abgeschaltet`,
      sourceOffNote:
        "Wird aktuell nicht genutzt, Wert ausgeblendet. In den Einstellungen wieder einschalten.",
      typeLabel: "Art",
      typeEpaEntry: "ePA-Eintrag",
      typeWearableStream: "Wearable-Stream",
      issuerLabel: "Einrichtung",
      dateLabel: "Datum",
      sensorLabel: "Sensorart",
      periodLabel: "Zeitraum",
      unknown: "unbekannt",
    },

    /** GeraeteSektion — Kacheln der verbundenen Geraete. */
    devices: {
      sectionAria: "Verbundene Geräte",
      sectionTitle: "Verbundene Geräte",
      batteryPercent: (n: string) => `${n}%`,
      liveStatus: "Echtzeit",
      wristDetected: "Am Handgelenk erkannt",
      epaActive: "Aktiv",
      epaTitle: "Patientenakte",
      dataLab: "Labor",
      dataVitals: "Vital",
      dataVaccinations: "Impf.",
      syncRelative: (relativ: string) => `Sync ${relativ}`,
    },

    /** StatusRings — zwei konzentrische Ringe mit Zahl in der Mitte. */
    statusRings: {
      activityLabel: "Aktivität",
      recoveryLabel: "Erholung",
      percentAria: { one: "{n} Prozent", other: "{n} Prozent" },
      ringsAria: (
        aktivitaet: string,
        aktivitaetProzent: string,
        erholung: string,
        erholungProzent: string,
      ) => `${aktivitaet} ${aktivitaetProzent}, ${erholung} ${erholungProzent}`,
    },

    /** MethodeQuellen — aufklappbare Methoden- und Quellenliste. */
    methodSources: {
      toggleLabel: "Methode und Datenquellen",
      pointTitle: (titel: string) => `${titel}:`,
    },

    /** ComboChip — Quellen-Chips plus Details-Aktion. */
    comboChip: {
      epaChip: "ePA",
      secondSourceWearable: "Wearable",
      detailsAction: "Details",
    },

    /** InsightHeader — Kausalketten-Kopf ueber einem Hinweis. */
    insightHeader: {
      title: "So hängt das zusammen",
    },
  },
} as const;

export type Dictionary = Widen<typeof de>;

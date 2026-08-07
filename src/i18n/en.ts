// Englisches Woerterbuch (Sprachstand fuer en, tr und ar - siehe resolveLocale).
//
// Die Typannotation `: Dictionary` ist die zentrale Absicherung des Projekts:
// Sie erzwingt Vollstaendigkeit zur Compile-Zeit und ersetzt damit die fehlende
// Testsuite. Sie darf NICHT durch `as Dictionary`, `satisfies`, `Partial<>` oder
// ein weggelassenes Typ-Annotat umgangen werden - ein fehlender Schluessel muss
// ein roter Build sein, kein stiller Laufzeitfehler.

import type { Dictionary } from "./de";

export const en: Dictionary = {
  nav: {
    ariaLabel: "Main navigation",
    home: "Home",
    insights: "VitaLink",
    appointments: "Appointments",
    profile: "Profile",
  },

  common: {
    closeDialog: "Close dialog",
    loading: "Loading …",
    continue: "Continue",
    connect: "Connect",
  },

  dashboard: {
    greetingMorning: "Good morning",
    greetingDay: "Good afternoon",
    greetingEvening: "Good evening",
    greetingNight: "Good night",
    travelCountdown: { one: "{land} in {n} week", other: "{land} in {n} weeks" },
    missingInEpa: (impfungen: string) => `${impfungen} are missing from your ePA`,
    check: "Check",
    currentValues: "Latest values",
    seeAll: "See all",
    forYouToday: "For you today",
    nextAppointment: "Next appointment",
    dentist: "Dentist",
    appointmentLine: (datum: string, art: string) => `${datum} · ${art}`,
    inDays: { one: "in {n} day", other: "in {n} days" },
    directions: "Directions",
    privacyTitle: "Your data. Your choice.",
    privacySub: "GDPR-compliant · stored on your device",
    metrics: {
      steps: "Steps",
      sleep: "Sleep",
      pulse: "Pulse",
      bloodPressure: "Blood pressure",
      bloodSugar: "Blood sugar",
      respiratoryRate: "Respiratory rate",
      weight: "Weight",
      height: "Height",
      bmi: "BMI",
    },
    badges: {
      normal: "Normal",
      optimal: "Optimal",
      stable: "Stable",
      stepsDelta: "+18 %",
      sleepGoal: "89 % of goal",
    },
    subs: {
      // F14: en-GB - Tausenderkomma und Dezimalpunkt, umgekehrt zum Deutschen.
      stepsPrev: "Last week: 10,100",
      sleepGoal: "Goal: 7.5 h",
      pulsePrev: "Last week: 62",
      bpNorm: "Normal <130/85",
      sugarPrev: "Previous: 95",
      respNorm: "Normal 12–20",
      weightInRange: "within target range",
      heightMeasured: "measured",
      bmiRange: "18.5–24.9",
    },
  },

  insights: {
    title: "Your insights",
    sectionAll: "Your insights",
    status: (datum: string, anzahl: string) => `As of ${datum} · ${anzahl} insights`,
    rangeAriaLabel: "Time range",
    rangeToday: "Today",
    rangeWeek: "Week",
    rangeMonth: "Month",
    metaInsight:
      "Thursday is your weakest day. Moving your workout would improve several values at once.",
    metaAnalysis: "14-day analysis",
    sourceEpa: "ePA",
    sourceWearable: "Wearable",
    sectionUpcoming: "Coming up",
    emptyState: "No insights available. Turn on data sources to receive insights.",
    enableInSettings: "Turn them on in Settings",
  },

  about: {
    headerTitle: "About VitaLink",
    backLabel: "Settings",
    // Hochschule Ruhr West bleibt als Eigenname stehen (E6).
    tagline: "Research prototype · Hochschule Ruhr West",
    version: "Version 1.0 · Summer term 2026",
    rowProgramme: "Programme",
    rowMethod: "Method",
    rowSupervision: "Supervision",
    rowUniversity: "University",
    rowPeriod: "Period",
    valueMethod: "eDSR after Tuunanen et al.",
    valuePeriod: "Summer term 2026",
    disclaimerLabel: "About this prototype",
    // L5: konservativ-woertliche Entsprechung; Modul-, Studiengangs- und
    // Hochschulnamen bleiben als Eigennamen im Original (E6).
    disclaimerBody:
      "VitaLink is a research prototype created for a master's project in the module Menschzentrierte Technikentwicklung für eine digitale Gesellschaft (master's programme Mensch-Technik-Interaktion, MTI) at Hochschule Ruhr West, summer term 2026. The health data shown is illustrative and does not constitute medical advice. VitaLink is not a medical device. For medical questions, please contact your GP practice.",
    buildStamp: (stand: string) => `As of: ${stand}`,
  },

  glossary: {
    stop: "Stop",
    readAloud: "Read aloud",
    close: "Close",
    openInGlossary: "View in glossary",
    expanded: (langform: string, kuerzel: string) => `${langform} (${kuerzel})`,
  },

  onboarding: {
    connect: {
      title: "Connect your data sources",
      subtitle: "Connect your devices to get recommendations made for you",
      wearableHeading: "Wearable",
      wearableDetected: "Found via Bluetooth",
      wearableConnected: "Connected",
      // ePA = deutscher Rechtsbegriff (SGB V), Kuerzel bleibt; bei der ersten
      // Nennung je Screen mit englischer Apposition eingefuehrt.
      epaHeading: "Electronic patient record (ePA)",
      epaBody: "Link your ePA to include vaccinations, lab results and medicines.",
      epaSecure: "Secure via NFC card",
      disconnectHint: "You can disconnect at any time in Settings.",
    },
    epa: {
      wizardTitle: "ePA linking assistant",
      cardAlt: "Health card",
      introTitle: "Connect your ePA",
      introBody:
        "When prompted, hold your health card against your phone to link your electronic patient record (ePA) securely.",
      introCta: "Start linking",
      tapTitleDone: "Card detected ✓",
      tapTitle: "Hold your health card against your phone",
      tapBodyDone: "NFC connected. Just a moment …",
      tapBody: "Please touch the card to the back of your phone",
      pinTitle: "Enter your ePA PIN",
      pinHint: "Demo: any 4-digit number",
      successTitle: "ePA connected",
      successBody: "Connected. Your data will sync in a moment.",
      successWearableSub: "Wearable data connected",
      successEpaLabel: "Electronic patient record (ePA)",
      successEpaSub: "ePA linked successfully",
    },
    sync: {
      title: "Processing your data",
      subtitle: "Just a moment …",
      stepWearable: "Loading wearable data …",
      stepWearableDone: "Wearable data",
      stepEpa: "Syncing ePA entries …",
      stepEpaDone: "ePA entries",
      stepInsights: "Calculating recommendations …",
      stepInsightsDone: "Recommendations",
    },
  },

  /** Sensordaten-Uebersicht (/werte). */
  values: {
    headerTitle: "Your sensor data",
    headerEyebrow: "Home",
    backInsights: "VitaLink",
    backHome: "Home",
    intro:
      "All values from your Apple Watch Series 12 and from your ePA (Germany's electronic patient record). Tap the info icon for the data basis, underlined terms for the explanation.",
    sourceTooltip: (label: string) => `View the data basis for ${label}`,

    sectionHeart: "Heart health",
    sectionSleep: "Sleep",
    sectionActivity: "Activity",
    sectionMetabolism: "Metabolism",
    sectionBreathing: "Breathing & recovery",
    sectionEpa: "Vital signs from your ePA",

    labelRestingHeartRate: "Resting heart rate",
    labelHrv: "HRV",
    labelVo2max: "VO₂max",
    labelHeartRateZones: "Heart rate zones",
    labelSleepDuration: "Sleep duration",
    labelDeepSleep: "Deep sleep",
    labelSleepScore: "Sleep score",
    labelSteps: "Steps",
    labelActiveMinutes: "Active minutes",
    labelWorkouts: "Workouts",
    labelCalories: "Calories burned",
    labelFastingGlucose: "Fasting glucose",
    labelPostMealGlucose: "Value after eating",
    labelGlucoseVariability: "Glucose variability",
    labelSpo2: "SpO₂",
    labelRespiratoryRate: "Respiratory rate",
    labelStressScore: "Stress score",
    labelSkinTemperature: "Skin temperature",
    labelBloodPressure: "Blood pressure",
    labelWeight: "Weight",
    labelBmi: "BMI",

    unitActiveMinutes: "min/day",
    unitWorkoutsPerWeek: "/week",
    unitCalories: "kcal/day",

    valueHeartRateZone: "Zone 2",

    contextRestingHeartRate: "stable, good recovery",
    contextHrv: "good weekly average",
    // Vollstaendiger Satz mit Platzhaltern: {n} setzt fmt.plural (Tage),
    // die Trainingsminuten reicht der Aufrufer locale-formatiert herein.
    contextHeartRateZones: (minuten: string) => ({
      one: `Base zone · ${minuten} min in {n} day`,
      other: `Base zone · ${minuten} min in {n} days`,
    }),
    contextSleepDuration: (ziel: string) => `slightly below your target of ${ziel} h`,
    contextDeepSleep: "at the lower end of the normal range",
    contextSleepScore: "moderate recovery",
    contextSteps: "daily average, above the WHO target",
    contextActiveMinutes: "solid",
    contextWorkouts: "strength + endurance",
    contextCalories: "daily average",
    contextFastingGlucose: "within the normal range",
    contextPostMealGlucose: "average peak, nothing unusual",
    contextGlucoseVariability: "steady values",
    contextSpo2: "normal (> 95%)",
    contextRespiratoryRate: "normal 12-20",
    contextStressScore: "moderate",
    contextSkinTemperature: "baseline, stable",
    contextBloodPressure: "upper end of the normal range",
    contextWeight: "stable",
    contextBmi: "normal weight",

    footerNote:
      "Synthetic sample data (study profile). An insight, not a diagnosis - not a medical device.",
  },

  exportReport: {
    title: "Doctor report",
    backToSettings: "Settings",
    introTitle: "Your data for your doctor",
    introText:
      "Choose what your doctor should see. VitaLink turns it into a clear report.",
    recipientSection: "Which appointment",
    recipients: {
      hausarzt: { label: "GP", forAppointment: "For a GP appointment" },
      kardiologe: { label: "Cardiologist", forAppointment: "For a cardiology appointment" },
      anderer: { label: "Other", forAppointment: "For a doctor's appointment" },
    },
    contentSection: "What to include",
    selectAll: "Select all",
    clearSelection: "Clear selection",
    summarySection: "Summary",
    reportTitle: "Your doctor report",
    summaryDataPoints: { one: "{n} data point", other: "{n} data points" },
    summaryCategories: { one: "{n} category", other: "{n} categories" },
    summaryLine: (dataPoints: string, categories: string) => `${dataPoints} · ${categories}`,
    summaryLineWithVitalink: (dataPoints: string, categories: string) =>
      `${dataPoints} · ${categories} · with VitaLink analysis`,
    dataRange: "Data: last 14-30 days",
    createdToday: (date: string) => `Created: today, ${date}`,
    createPdf: "Create PDF",
    resetSelection: "Reset selection",
    toastPreparing: "Preparing your PDF …",
    toastDone:
      "The PDF has been created. In a real system, the file would now be downloaded.",
  },

  /** Settings (/einstellungen). */
  settings: {
    title: "Settings",
    backToProfile: "Profile",

    // Block A — display & controls
    blockAppearanceTitle: "Display & controls",
    languageLabel: "Language",
    languagePartial: "Partly translated",
    languageSheetTitle: "Choose language",
    languageSheetAria: "Choose language",
    appearanceTitle: "Appearance",
    appearanceGroupAria: "Appearance",
    themeOption: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    textSizeTitle: "Text size",
    spellOutTermsTitle: "Spell out technical terms",
    spellOutTermsExample: "HRV → heart rate variability",
    spellOutTermsSwitchAria: "Spell out technical terms",

    // Block B — export & reports
    blockExportTitle: "Export & reports",
    reportTitle: "Create a doctor report",
    reportText:
      "Create an easy-to-read summary of your health data for your next appointment with your doctor.",
    reportCta: "Prepare report",

    // Block C — data & sharing
    blockDataTitle: "Data & sharing",
    dataIntro:
      "Choose which data VitaLink may use for your insights. If you turn off a source, the recommendations based on it are no longer shown. You can change any sharing setting at any time.",
    dataGroupEpa: "Privacy — ePA",
    dataGroupWearable: "Privacy — wearable",

    // Block D — your privacy choices
    blockDecisionsTitle: "Your privacy choices",
    decisionsIntro:
      "Here you can see which data sources you have shared or turned off. You can change your choice at any time under \"Data & sharing\".",
    loading: "Loading …",
    allSourcesEnabled: "All data sources are currently shared.",
    allSourcesEnabledHint: "You can adjust sharing at any time under \"Data & sharing\".",
    disabledSourceHint:
      "Turned off · recommendations based on this source are not shown.",
    reenableAll: "Turn all back on",

    // Block E — information & help
    blockInfoTitle: "Information & help",
    aboutRow: "About VitaLink",

    // Block F — list of abbreviations
    blockGlossaryTitle: "List of abbreviations",
    glossaryRowTitle: "Look up abbreviations",
    glossaryEntries: { one: "{n} entry", other: "{n} entries" },
    glossaryOwnEntries: { one: "{n} of your own", other: "{n} of your own" },
    glossaryCountLine: (entries: string, own: string) => `${entries} · ${own}`,

    // Confirmation sheet when turning off a data source
    disableSheetTitle: "Turn off data source?",
    disableSheetAria: "Turn off data source?",
    disableSheetText: (quelle: string) =>
      `"${quelle}": the recommendations based on it will then no longer be shown.`,
    disableConfirm: "Turn off anyway",
    cancel: "Cancel",
  },

  /** Insight detail (/hinweis/[id]) and the building blocks of the explainable core. */
  insightDetail: {
    // --- Detail page: back / not found ---
    back: "Back",
    notFoundTitle: "Insight not found",
    notFoundBody: "This insight does not exist (any more).",
    notFoundLink: "Back to your insights",

    // --- Disabled data sources (DF11) ---
    disabledSourcesTitle: "This insight uses data sources you turned off",
    disabledSourcesAffectedLabel: "Affected:",
    disabledSourcesNote: "So this insight is not calculated in full.",
    disabledSourcesAction: "Turn them back on in settings",

    // --- Sections ---
    sectionRecommendations: "Smart recommendations",
    sectionDataBasis: "Data basis",
    sectionHowItWorks: "How VitaLink arrives at these recommendations",
    sectionWhatIf: "What if",
    sectionSimilarAppointments: "Similar appointments in your ePA",
    similarAppointmentsSeeAll: "See all",
    sectionTravelPlanning: "Travel planning",
    travelCta: "Manage travel destination and vaccinations",

    // --- G7: not a medical device note ---
    disclaimerNoDiagnosis:
      "An insight, not a diagnosis. This recommendation is for orientation and does not replace a medical assessment.",
    disclaimerUncertain:
      "The trend shown is based on few measurements — its statistical significance is limited.",

    // --- UncertaintyBadge (DF2) ---
    uncertaintyAriaLabel: "Note on uncertainty",
    uncertaintyLead: "An insight, not a diagnosis.",
    uncertaintyBody:
      "The model confidence is low here. If you have questions or ongoing symptoms, please have the value checked by a doctor.",

    // --- InsightStatement ---
    patternLabel: "The pattern",

    // --- DataSourceMiniCard ---
    originTooltipLabel: (wert: string) => `View where ${wert} comes from`,

    // --- VorsorgeTerminZeile ---
    appointmentLast: (datum: string) => `last: ${datum}`,
    appointmentNext: (datum: string) => `next: ${datum}`,

    // --- CounterfactualSlider (mode C) ---
    whatIfIntro:
      "Move the slider and see how this insight would change. The underlying data stays the same — this is a thought experiment.",

    // --- SmartTippCard ---
    tipHidden: (titel: string) => `"${titel}" hidden`,
    tipUndo: "Undo",
    tipHideAria: (titel: string) => `Hide "${titel}"`,
    tipDataBasisLabel: "Data basis:",
    tipSourceEpa: "ePA",
    tipSourceWearable: "Wearable",
    tipSourceContext: "Context",

    // --- FeedbackControls ---
    likeRemoveAria: "Remove from saved",
    likeAddAria: "Save this recommendation",
    objectionChangeAria: "Change objection",
    objectionAddAria: "Does not fit me",

    // --- ObjectionDialog (DF12) ---
    objectionDialogTitle: "Give feedback",
    objectionLegend:
      "Why does this insight not fit you? What you enter stays on this device only.",
    objectionFreetextLabel: "Optional free text",
    objectionFreetextPlaceholder: "Optional: in your own words ...",
    objectionCancel: "Cancel",
    objectionSave: "Save",
  },

  appointments: {
    title: "Preventive care & appointments",
    countImportantNow: { one: "{n} important now", other: "{n} important now" },
    countSoon: { one: "{n} due soon", other: "{n} due soon" },
    countDone: { one: "{n} done", other: "{n} done" },
    filterAriaLabel: "Filter appointments",
    filterAll: "All",
    filterNow: "Important now",
    filterSoon: "Plan soon",
    filterLater: "Later",
    filterDone: "Done",
    toastPlannedInCalendar: (titel: string) =>
      `"${titel}" would be added to your calendar in a real system.`,
    toastCorrectionInactive: "Correcting an entry is not active in this demo.",

    cardDetails: "Details",
    cardPlanAppointment: "Plan appointment",
    cardCorrect: "Correct entry",

    placeholderHeaderTitle: "Preventive care insight",
    placeholderBackLabel: "Appointments",
    placeholderTitle: "Not fully explained yet",
    placeholderBody:
      "In this demo, this preventive care insight is not yet linked to a full explanation page. The feature is in place and will be expanded step by step.",
    placeholderBack: "Back to appointments",

    practiceSheetAriaLabel: "Contact details of the gynaecology practice from your ePA",
    practiceFromEpa: "From your ePA",
    practiceSpecialty: "Gynaecological preventive care · Bochum",
    practiceAddressLabel: "Address",
    practicePhoneLabel: "Phone",
    practiceEmailLabel: "Email",
    practiceHoursLabel: "Opening hours",
    practiceHours: [
      "Mon, Tue, Thu  8:00–12:30 · 15:00–18:00",
      "Wed  8:00–13:00",
      "Fri  8:00–12:00",
    ],
    practiceLastVisitDate: "12 August 2025",
    practiceEpaSourceNote:
      "These contact details come from your ePA (Germany's electronic patient record) — from your last preventive care visit at this practice on {datum}.",
    practiceClose: "Close",

    notificationsButtonAriaLabel: "Notifications",
    notificationsDialogAriaLabel: "Notifications",
    notificationsTitle: "Notifications",
    notificationsMarkAllRead: "Mark all as read",
    notificationsEmpty: "No new notifications",
    notificationDentistTitle: "Dental appointment in July",
    notificationDentistText: "Book an appointment with Dr. Maier in good time.",
    notificationTravelTitle: "Thailand: check your vaccinations",
    notificationTravelText: "Hepatitis A and B are missing from your ePA.",
    notificationWeeklyTitle: "New weekly analysis available",
    notificationWeeklyText: "Your wellness score has gone up by 4 points.",
    notificationTimeToday: "Today",
    notificationTimeYesterday: "Yesterday",
    notificationTimeDaysAgo: { one: "{n} day ago", other: "{n} days ago" },
  },

  /** Profile area: /profil, /glossar, /rueckmeldungen and their sheets. */
  profileArea: {
    // — /profil —
    title: "Profile",
    subtitle: "Example persona from the user study",
    personaAgeYears: { one: "{n} year", other: "{n} years" },
    personaMeta: (alter: string, ort: string) => `${alter} · ${ort}`,
    personaSyntheticBadge: "Example data · synthetic",
    avatarSectionTitle: "Choose an avatar",
    avatarInitialLabel: "Your initial as avatar",
    avatarOptionLabel: (emoji: string) => `Avatar ${emoji}`,
    cardSectionTitle: "Health insurance card",
    cardBrand: "Health card",
    cardNumberLabel: "Insurance number",
    cardSampleBadge: "Sample",
    cardFootnote: (praxis: string) =>
      `GP: ${praxis}. All details are synthetic example data.`,
    manageSectionTitle: "Manage",
    linkFeedback: "My feedback",
    linkGlossary: "Glossary",
    linkSettings: "Settings",
    linkAbout: "About VitaLink",

    // — Profile avatar in the home header —
    headerAvatarLabel: "Profile and account",

    // — /glossar —
    glossaryTitle: "Glossary",
    glossaryBackLabel: "Profile",
    glossaryLoading: "Loading …",
    glossaryIntro:
      "Every technical term explained simply. In the app's explanations these terms have a dashed underline and you can tap them.",
    glossarySearchPlaceholder: "Search for a term …",
    /** Filter chips; keys = FilterKat from /glossar. */
    glossaryFilters: {
      alle: "All",
      nutzerdefiniert: "Mine",
      allgemein: "General",
      herz: "Heart",
      labor: "Lab",
      schlaf: "Sleep",
      digital: "Digital",
    },
    /** Group headings; keys = AbkuerzungKategorie. */
    glossaryCategories: {
      herz: "Heart health",
      labor: "Lab values",
      schlaf: "Sleep",
      digital: "Digital",
      allgemein: "General",
      nutzerdefiniert: "My entries",
    },
    glossaryEmptyTitle: "No entry found",
    glossaryEmptyHint: (begriff: string) => `Add "${begriff}" as your own abbreviation.`,
    glossaryEmptyAddCta: "Add",
    glossaryRemoveEntryLabel: (kuerzel: string) => `Remove ${kuerzel}`,
    glossaryAddOwnCta: "Add your own abbreviation",

    // — Bottom sheet "Your own abbreviation" —
    addAbbrTitle: "Your own abbreviation",
    addAbbrIntro: "Add abbreviations you often see in VitaLink.",
    addAbbrShortLabel: "Abbreviation",
    addAbbrShortPlaceholder: "e.g. ALT",
    addAbbrLongLabel: "Written out",
    addAbbrLongPlaceholder: "e.g. alanine aminotransferase",
    addAbbrExplanationLabel: "Explanation (optional)",
    addAbbrExplanationPlaceholder: "Short explanation in plain language …",
    addAbbrCharCount: (genutzt: string, maximum: string) => `${genutzt}/${maximum}`,
    addAbbrErrorShortMissing: "Please enter an abbreviation",
    addAbbrErrorLongMissing: "Please write out the full term",
    addAbbrErrorDuplicate: (kuerzel: string) =>
      `This abbreviation already exists — look under "${kuerzel}"`,
    addAbbrSubmit: "Add",
    addAbbrCancel: "Cancel",

    // — /rueckmeldungen —
    feedbackTitle: "My feedback",
    feedbackBackLabel: "Profile",
    feedbackIntro:
      "This is where your feedback on individual recommendations is collected. Everything stays on this device only.",
    feedbackLoading: "Loading …",
    feedbackEmptyTitle: "No feedback yet",
    feedbackEmptyBody:
      "Open an analysis and rate individual recommendations with 👍, 👎 or hide them with \"×\".",
    feedbackEmptyCta: "To your analyses",
    feedbackObjectedHeading: { one: "Objected · {n}", other: "Objected · {n}" },
    feedbackLikedHeading: { one: "Saved · {n}", other: "Saved · {n}" },
    feedbackHiddenHeading: { one: "Hidden · {n}", other: "Hidden · {n}" },
    feedbackParentContext: (titel: string) => `in "${titel}"`,
    /** L3: `freitext` is user text and is never translated — only the frame is. */
    feedbackObjectionWithNote: (grund: string, freitext: string) => `${grund} – "${freitext}"`,
    feedbackEditObjection: "Edit",
    feedbackRemoveObjection: "Remove",
    feedbackRemoveLike: "Remove",
    feedbackRestore: "Show again",
  },

  /** Reused interface building blocks (hero, cards, panels, toggles). */
  widgets: {
    /** Health score hero on Home (WellnessHero). */
    wellness: {
      sectionAria: "Your health score",
      eyebrow: "Health score",
      // Display texts for the language-neutral keys from lib/wellnessScore.
      labels: {
        "very-good": "Very good",
        good: "Good",
        moderate: "Moderate",
        low: "Low",
      },
      deltaSinceYesterday: "↑ +4 since yesterday",
      whyButton: (score: string) => `Why ${score}?`,
      sheetTitle: "How your score adds up",
      factorActivity: "Activity (12,584 steps)",
      factorHeart: "Heart health (60 BPM, steady)",
      factorSleep: "Sleep (score 67/100)",
      factorBloodPressure: "Blood pressure (rising slightly)",
      factorLab: "Lab results (mostly good)",
      factorPoints: (punkte: string) => `+${punkte}`,
      sheetFooter: "The score brings together your health data from your ePA and wearable.",
    },

    /** Weekly review card (steps, workouts, resting heart rate per period). */
    weeklyReview: {
      periods: {
        today: {
          label: "Today",
          range: "29 June",
          stepsLabel: { one: "Step", other: "Steps" },
        },
        week: {
          label: "This week",
          range: "17–23 June",
          stepsLabel: { one: "Step/week", other: "Steps/week" },
        },
        month: {
          label: "This month",
          range: "June 2026",
          stepsLabel: { one: "Step/month", other: "Steps/month" },
        },
      },
      workouts: { one: "Workout", other: "Workouts" },
      restingPulse: "Resting HR",
      sourceOff: "Source off",
      // Full sentence; {quelle} marks where the highlighted source name goes.
      sourceOffNotice:
        "Uses a source that is switched off: {quelle}. You can switch it back on in Settings.",
      sourceActivityWearable: "Activity (wearable)",
      allSensorDataAria: (zeitraum: string) => `${zeitraum}: see all sensor data`,
      reviewAria: (zeitraum: string) => `Review: ${zeitraum}`,
    },

    /** "Latest from the Ruhr area" panel (news and events). */
    ruhr: {
      sectionTitle: "Latest from the Ruhr area",
      tabsAria: "Category",
      tabNews: "News",
      tabEvents: "Events",
      // Sources stay as they are wherever they are proper names.
      items: {
        tiktokStudy: {
          title: "Mental health on TikTok: study finds misinformation is common",
          source: "Uni Duisburg-Essen",
        },
        preventionStudy: {
          title: "More prevention instead of costly treatment: public health study",
          source: "Universitätsmedizin Essen",
        },
        clinicList: {
          title: "stern-Klinikliste 2026: Ruhr area hospitals honoured",
          source: "St. Elisabeth Gruppe",
        },
        nutritionEvent: {
          title: "Focus on nutrition: nutrition for children and young people",
          source: "MedEcon Ruhr · Essen",
        },
        marathon: {
          title: "Rhein-Ruhr-Marathon and other runs",
          source: "Running calendar Duisburg",
        },
        muelheimRuns: {
          title: "City and community runs in Mülheim",
          source: "Running calendar Mülheim",
        },
      },
      itemMeta: (quelle: string, datum: string) => `${quelle} · ${datum}`,
    },

    /** Data origin popover on data points (DF5/DF6). */
    origin: {
      heading: "Data origin",
      popoverAria: "Data origin",
      defaultTriggerLabel: "See data source",
      types: {
        epa: "From your ePA",
        wearable: "Apple Watch Series 12",
        userInput: "Your entry",
        vitalinkAi: "VitaLink AI",
      },
    },

    /** Text size switch (DF7). */
    textSize: {
      groupAria: "Text size",
      standard: "Standard",
      large: "Large",
    },

    /** Data source row with switch (DF11). */
    dataSource: {
      useSourceSwitchLabel: (label: string) => `Use ${label}`,
    },
  },

  /**
   * Orphaned components: currently not reachable through any route, but kept
   * maintained and bilingual. Grouped per component.
   */
  orphaned: {
    /** XaiVariantSwitch — switch between the three explanation modes. */
    xaiSwitch: {
      sectionAria: "Explanation mode",
      tablistAria: "Explanation mode",
      tabWords: "In words",
      tabVisual: "Visual",
      tabWhatIf: "What if",
      referenceLabel: "Reference:",
      noCounterfactual:
        "For this rule-based insight, a what-if view is not useful.",
    },

    /** FactorBars — contributing factors as bars with relative weighting. */
    factorBars: {
      intro:
        "This is how strongly each factor feeds into this insight (relative weighting):",
      percentValue: (pct: string) => `${pct}%`,
      weightAria: { one: "{n} percent of the weighting", other: "{n} percent of the weighting" },
      barAria: (label: string, gewichtung: string) => `${label}: ${gewichtung}`,
      barAriaSourceOff: (label: string, gewichtung: string) =>
        `${label}: ${gewichtung}, source switched off`,
      sourceOffNote: (quelle: string) => `${quelle} – source switched off`,
    },

    /** ExplanationPanel — three explanation depths as inline toggles. */
    explanationPanel: {
      openReasoning: "Read the reasoning",
      openDetail: "Detailed view",
      collapse: "less",
    },

    /** ProvenanceChip — data origin chip for ePA and wearable values. */
    provenance: {
      noDate: "no date",
      kindEpa: "ePA",
      kindWearable: "Wearable",
      kindWithMeta: (art: string, meta: string) => `${art} – ${meta}`,
      sourceOff: (art: string) => `${art} - source switched off`,
      sourceOffNote:
        "Not in use right now, so the value stays hidden. You can switch it back on in Settings.",
      typeLabel: "Type",
      typeEpaEntry: "ePA entry",
      typeWearableStream: "Wearable stream",
      issuerLabel: "Issued by",
      dateLabel: "Date",
      sensorLabel: "Sensor type",
      periodLabel: "Period",
      unknown: "unknown",
    },

    /** GeraeteSektion — tiles for the connected devices. */
    devices: {
      sectionAria: "Connected devices",
      sectionTitle: "Connected devices",
      batteryPercent: (n: string) => `${n}%`,
      liveStatus: "Live",
      wristDetected: "Detected on your wrist",
      epaActive: "Active",
      epaTitle: "Patient record",
      dataLab: "Lab",
      dataVitals: "Vitals",
      dataVaccinations: "Vacc.",
      syncRelative: (relativ: string) => `Synced ${relativ}`,
    },

    /** StatusRings — two concentric rings with a value in the centre. */
    statusRings: {
      activityLabel: "Activity",
      recoveryLabel: "Recovery",
      percentAria: { one: "{n} percent", other: "{n} percent" },
      ringsAria: (
        aktivitaet: string,
        aktivitaetProzent: string,
        erholung: string,
        erholungProzent: string,
      ) => `${aktivitaet} ${aktivitaetProzent}, ${erholung} ${erholungProzent}`,
    },

    /** MethodeQuellen — expandable list of method and data sources. */
    methodSources: {
      toggleLabel: "Method and data sources",
      pointTitle: (titel: string) => `${titel}:`,
    },

    /** ComboChip — source chips plus the details action. */
    comboChip: {
      epaChip: "ePA",
      secondSourceWearable: "Wearable",
      detailsAction: "Details",
    },

    /** InsightHeader — causal-chain header above an insight. */
    insightHeader: {
      title: "How this fits together",
    },
  },
};

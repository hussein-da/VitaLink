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
};

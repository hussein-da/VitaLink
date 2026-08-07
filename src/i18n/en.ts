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

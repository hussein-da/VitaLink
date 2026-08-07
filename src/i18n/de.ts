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

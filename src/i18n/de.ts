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
} as const;

export type Dictionary = Widen<typeof de>;

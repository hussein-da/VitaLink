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
};

// Smarte Empfehlungen je Hinweis (Prompt 10, Block 3+4).
//
// Die Tipps sind statisch hinterlegt, aber so formuliert, als wären sie live
// aus Maras Daten berechnet worden. Jeder Tipp kombiniert nach Möglichkeit
// mehrere Datenpunkte aus ePA und Wearable bzw. dem Kontext (Jahreszeit, Reise)
// und endet mit einem konkreten, sofort umsetzbaren Schritt. Alle Werte stammen
// aus epa.ts / wearable.ts / hinweise.ts und sind synthetisch.
//
// Die Record-Schlüssel sind die echten Hinweis-IDs aus hinweise.ts:
//   lifestyle-schlaf · kardio-blutdruck · reise-impfung

export type SmartTippQuelle = "epa" | "wearable" | "context";

export interface SmartTipp {
  id: string;
  /** lucide-react Icon-Name (Mapping in SmartTippCard). */
  icon: string;
  titel: string;
  /** Konkret, praktisch, max. 3 Sätze. */
  text: string;
  /** Welche Datenquellen in den Tipp eingeflossen sind (steuert die Chips). */
  quellen: SmartTippQuelle[];
  /** Kurze Datenbegründung für das „Warum?“-Akkordeon (max. ~80 Wörter). */
  warum?: string;
}

export const smartTippsJeHinweis: Record<string, SmartTipp[]> = {
  // ───────────────────────────────────────────────────────────────────────
  // SCHLAF & ERHOLUNG
  // ───────────────────────────────────────────────────────────────────────
  "lifestyle-schlaf": [
    {
      id: "schlaf-training-timing",
      icon: "Dumbbell",
      titel: "Donnerstags früher trainieren",
      text: "Nach deiner Einheit am Donnerstagabend (20:00 Uhr) liegt deine HRV bei rund 29 ms – nach dem Samstagstraining um 10:00 Uhr dagegen bei 47–50 ms. In genau diesen Donnerstagnächten fällt dein Tiefschlaf auf 10–11 %, halb so viel wie nach dem Samstagstraining. Verleg eine Abendeinheit auf Donnerstagmittag oder Freitagfrüh – das ist der größte Einzelhebel für deine Wochenmitte.",
      quellen: ["wearable"],
      warum:
        "Spätes, intensives Training hält Puls und Stresshormone bis in die Nacht hoch. Dein Wearable zeigt den Effekt deutlich: HRV nach Abendsport rund 29 ms gegenüber etwa 48 ms nach Vormittagssport, Tiefschlaf 10–11 % statt 21–22 %. Frühere Einheiten geben dem Körper Stunden zum Herunterfahren.",
    },
    {
      id: "schlaf-vitd-mittagssonne",
      icon: "Sun",
      titel: "Mittagspause draußen: zwei Baustellen, ein Schritt",
      text: "Dein Vitamin D liegt laut ePA bei 24 ng/ml (Optimum 30–60), und unter der Woche kommst du nur auf rund 10.800 Schritte – am Wochenende sind es 15.700. Im Juni reicht die Bochumer Mittagssonne (11–15 Uhr) für die Vitamin-D-Bildung schon nach 15–20 Minuten unbedeckter Haut. Ein 25-Minuten-Spaziergang in der Mittagspause füllt beide Lücken auf einmal.",
      quellen: ["epa", "wearable", "context"],
      warum:
        "Vitamin D entsteht über UVB-Licht in der Haut – im Juni mittags in unseren Breiten in 15–20 Minuten in relevanter Menge. Derselbe Spaziergang hebt deine niedrigen Wochentags-Schritte Richtung Wochenend-Niveau. Ein Termin, zwei Effekte: höherer Vitamin-D-Spiegel und mehr Alltagsbewegung.",
    },
    {
      id: "schlaf-abendritual-hrv",
      icon: "Moon",
      titel: "Fixes Abend-Ritual für tiefere Nächte",
      text: "An deinen besten Nächten – Freitag und Sonntag, HRV über 43 ms – schläfst du rund 6 Prozentpunkte mehr Tiefschlaf als im Wochenschnitt. Diese Abende haben gemeinsam: früheres Abschalten und kein spätes Training. Dimm ab 21:30 Uhr das Licht und leg 10 Minuten ruhige Atmung ein; ein angehobener Vitamin-D-Wert (aktuell 24 ng/ml) stützt die Schlaftiefe zusätzlich.",
      quellen: ["wearable", "epa"],
      warum:
        "Deine HRV ist der beste Frühindikator für Erholung – über 43 ms gehen bei dir mit spürbar mehr Tiefschlaf einher. Gedimmtes Licht und langsame Atmung senken die Aktivierung vor dem Schlafen. Der in der ePA dokumentierte, leicht niedrige Vitamin-D-Wert ist ein zweiter, langfristiger Hebel für stabilere Tiefschlafphasen.",
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // HERZ-KREISLAUF (Blutdruck-Trend)
  // ───────────────────────────────────────────────────────────────────────
  "kardio-blutdruck": [
    {
      id: "kardio-schlaf-blutdruck",
      icon: "TrendingDown",
      titel: "Besserer Schlaf zahlt auf den Blutdruck ein",
      text: "Beim Hausarzt wurde zuletzt 128/83 mmHg gemessen – in sechs Monaten von 118/76 gestiegen, noch im Normbereich. In deinen schlechtesten Schlafnächten zeigt dein Wearable einen Ruhepuls von 64 BPM, 12 % über den 57 BPM deiner besten Nächte. Die Schlafverbesserung aus „Schlaf & Erholung“ wirkt hier doppelt: ruhigere Nächte entlasten Puls und Blutdruck-Trend gleichzeitig.",
      quellen: ["epa", "wearable"],
      warum:
        "Schlafmangel hält das sympathische Nervensystem aktiv – messbar an deinem um 12 % erhöhten Ruhepuls in schlechten Nächten – und gilt als dokumentierter Treiber steigenden Blutdrucks. Dein ePA-Trend (118 → 128 mmHg) und das Wearable-Schlafmuster zeigen dasselbe Bild aus zwei Quellen. Mehr Tiefschlaf ist damit zugleich eine Herz-Kreislauf-Maßnahme.",
    },
    {
      id: "kardio-ernaehrung-cholesterin-eisen",
      icon: "Salad",
      titel: "Hafer & Hülsenfrüchte: Cholesterin runter, Eisen rauf",
      text: "Dein Gesamtcholesterin liegt bei 198 mg/dl (LDL 118), dein Ferritin mit 18 µg/l im unteren Bereich. Haferflocken, Linsen, Kichererbsen und dunkles Blattgemüse senken über Ballaststoffe das LDL und liefern gleichzeitig pflanzliches Eisen. Kombinier sie mit etwas Vitamin C (z. B. Paprika oder ein Spritzer Zitrone) – das steigert die Eisenaufnahme deutlich.",
      quellen: ["epa"],
      warum:
        "Lösliche Ballaststoffe aus Hafer und Hülsenfrüchten binden Gallensäuren und senken so das LDL-Cholesterin. Dieselben Lebensmittel sind gute pflanzliche Eisenquellen – relevant bei deinem niedrig-normalen Ferritin von 18 µg/l. Vitamin C verbessert die Aufnahme des pflanzlichen Eisens. So lassen sich beide ePA-Werte über eine Ernährungsumstellung adressieren.",
    },
    {
      id: "kardio-hitze-hydration",
      icon: "Droplets",
      titel: "An Trainingstagen mehr trinken",
      text: "Du trainierst rund viermal pro Woche, im Schnitt 103 Minuten je Einheit – bei sommerlicher Hitze verliert dein Körper dabei spürbar Flüssigkeit. Dehydration verengt die Gefäße und treibt den Blutdruck nach oben, der bei dir ohnehin im oberen Normbereich liegt (zuletzt 128/83 mmHg). Stell dir an Trainingstagen 2,5–3 Liter bereit und trink schon vor der Einheit ein großes Glas.",
      quellen: ["epa", "wearable", "context"],
      warum:
        "Bei Flüssigkeitsmangel sinkt das Blutvolumen, der Körper gegenreguliert mit engeren Gefäßen – der Blutdruck steigt kurzfristig. An heißen Tagen plus 100+ Minuten Training ist der Verlust am größten. Bei deinem leicht erhöhten ePA-Blutdruck-Trend ist konsequentes Trinken ein einfacher, wirksamer Hebel.",
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // REISEVORSORGE THAILAND
  // ───────────────────────────────────────────────────────────────────────
  "reise-impfung": [
    {
      id: "reise-impf-zeitplan",
      icon: "Syringe",
      titel: "Diese Woche den Impftermin machen",
      text: "Für Thailand fehlen laut ePA Hepatitis A und B – bis zur Abreise am 15.08.2026 bleiben rund sechs Wochen. Hepatitis A schützt 2–4 Wochen nach der ersten Dosis, Hepatitis B braucht im Schnellschema drei Dosen über 3–4 Wochen. Wenn du jetzt buchst, reicht die Zeit genau; zwei Wochen später wird vor allem das Hep-B-Schnellschema knapp.",
      quellen: ["epa", "context"],
      warum:
        "Impfschutz baut sich nicht sofort auf: Hepatitis A wirkt 2–4 Wochen nach der ersten Dosis, das Hepatitis-B-Schnellschema verlangt drei Termine über 3–4 Wochen plus Wirkzeit. Bei rund sechs Wochen Vorlauf ist das machbar – aber nur ohne weiteres Zuwarten. Deshalb ist der Termin diese Woche der entscheidende Schritt.",
    },
    {
      id: "reise-termin-kombinieren",
      icon: "ClipboardCheck",
      titel: "Ein Hausarzttermin, drei Erledigungen",
      text: "Deinen Impftermin kannst du gleich dreifach nutzen: Deine gynäkologische Vorsorge ist im Juli 2026 fällig (zuletzt 24.07.2025), und dein Vitamin-D-Wert von 24 ng/ml gehört kontrolliert. Bitte beim selben Termin um die Reiseimpfberatung, eine Überweisung zur Gynäkologie und eine Vitamin-D-Nachmessung. Drei offene Punkte, ein Gang zur Praxis.",
      quellen: ["epa"],
      warum:
        "Reiseimpfberatung, fällige Vorsorge und Vitamin-D-Kontrolle landen sonst auf drei separaten Terminen. Alle drei sind ohnehin in den nächsten Wochen dran – die Hep-Impfung ist der natürliche Anlass, sie zu bündeln. Das spart Wege und stellt sicher, dass vor der Reise nichts liegen bleibt.",
    },
    {
      id: "reise-jetlag-schlaf",
      icon: "Plane",
      titel: "Schlaf zwei Wochen vorher vorverlegen",
      text: "Thailand liegt 5–6 Stunden vor unserer Zeit, und dein Schlaf-Score von 67/100 ist an Arbeitstagen ohnehin gedrückt – das macht Jetlag zäher. Schieb ab Anfang August deine Schlafenszeit alle paar Tage um 20–30 Minuten nach vorn. Wer ausgeruht und schon leicht angepasst ankommt, übersteht die ersten Urlaubstage deutlich wacher.",
      quellen: ["wearable", "context"],
      warum:
        "Der circadiane Rhythmus verschiebt sich nur langsam – etwa eine Stunde pro Tag. Startest du zwei Wochen vor Abflug, ist die 5–6-Stunden-Differenz bei Ankunft schon halb überbrückt. Dein Wearable-Schlaf-Score von 67/100 zeigt wenig Reserve, deshalb lohnt der frühe, sanfte Start besonders.",
    },
  ],
};

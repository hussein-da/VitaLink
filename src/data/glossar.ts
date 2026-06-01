import type { GlossarEintrag } from "@/lib/types";

// B1-Erklaerungen der Fachbegriffe (einfache Sprache).
export const glossar: GlossarEintrag[] = [
  {
    term: "HRV",
    kurz:
      "HRV steht fuer Herzfrequenzvariabilitaet. Sie misst, wie stark die Zeit zwischen zwei Herzschlaegen schwankt. Eine hoehere Schwankung gilt meist als Zeichen guter Erholung.",
  },
  {
    term: "Ruhepuls",
    kurz:
      "Der Ruhepuls ist die Zahl der Herzschlaege pro Minute, wenn du ganz ruhig bist. Niedrigere Werte deuten oft auf gute Erholung und Fitness hin.",
  },
  {
    term: "Blutdruck",
    kurz:
      "Der Blutdruck ist der Druck, mit dem das Blut durch die Gefaesse stroemt. Er wird mit zwei Zahlen angegeben, zum Beispiel 128 zu 82.",
  },
  {
    term: "systolisch",
    kurz:
      "Der systolische Wert ist die obere (groessere) Zahl beim Blutdruck. Er entsteht, wenn das Herz Blut in die Gefaesse pumpt.",
  },
  {
    term: "diastolisch",
    kurz:
      "Der diastolische Wert ist die untere (kleinere) Zahl beim Blutdruck. Er entsteht, wenn sich das Herz zwischen zwei Schlaegen entspannt.",
  },
  {
    term: "Cholesterin",
    kurz:
      "Cholesterin ist ein Fettstoff im Blut. Der Koerper braucht ihn, doch zu viel davon kann die Gefaesse mit der Zeit belasten.",
  },
  {
    term: "kardiovaskulaer",
    kurz:
      "Kardiovaskulaer bedeutet 'Herz und Gefaesse betreffend'. Gemeint ist alles rund um Herz und Blutbahnen.",
  },
  {
    term: "STIKO",
    kurz:
      "Die STIKO ist die Staendige Impfkommission in Deutschland. Sie empfiehlt, welche Impfungen wann sinnvoll sind.",
  },
];

// Schneller Zugriff per Begriff.
export const glossarMap: Record<string, GlossarEintrag> = Object.fromEntries(
  glossar.map((g) => [g.term.toLowerCase(), g]),
);

// Alle Begriffe, nach Laenge absteigend (laengste zuerst -> sauberes Matching im Text).
export const glossarTerms: string[] = glossar
  .map((g) => g.term)
  .sort((a, b) => b.length - a.length);

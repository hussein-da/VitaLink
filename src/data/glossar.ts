import type { GlossarEintrag } from "@/lib/types";

// B1-Erklärungen der Fachbegriffe (einfache Sprache).
export const glossar: GlossarEintrag[] = [
  {
    term: "HRV",
    kurz:
      "HRV steht für Herzfrequenzvariabilität. Sie misst, wie stark die Zeit zwischen zwei Herzschlägen schwankt. Eine höhere Schwankung gilt meist als Zeichen guter Erholung.",
  },
  {
    term: "Ruhepuls",
    kurz:
      "Der Ruhepuls ist die Zahl der Herzschläge pro Minute, wenn du ganz ruhig bist. Niedrigere Werte deuten oft auf gute Erholung und Fitness hin.",
  },
  {
    term: "Blutdruck",
    kurz:
      "Der Blutdruck ist der Druck, mit dem das Blut durch die Gefäße strömt. Er wird mit zwei Zahlen angegeben, zum Beispiel 128 zu 82.",
  },
  {
    term: "systolisch",
    kurz:
      "Der systolische Wert ist die obere (größere) Zahl beim Blutdruck. Er entsteht, wenn das Herz Blut in die Gefäße pumpt.",
  },
  {
    term: "diastolisch",
    kurz:
      "Der diastolische Wert ist die untere (kleinere) Zahl beim Blutdruck. Er entsteht, wenn sich das Herz zwischen zwei Schlägen entspannt.",
  },
  {
    term: "Cholesterin",
    kurz:
      "Cholesterin ist ein Fettstoff im Blut. Der Körper braucht ihn, doch zu viel davon kann die Gefäße mit der Zeit belasten.",
  },
  {
    term: "kardiovaskulär",
    kurz:
      "Kardiovaskulär bedeutet 'Herz und Gefäße betreffend'. Gemeint ist alles rund um Herz und Blutbahnen.",
  },
  {
    term: "STIKO",
    kurz:
      "Die STIKO ist die Ständige Impfkommission in Deutschland. Sie empfiehlt, welche Impfungen wann sinnvoll sind.",
  },
  {
    term: "mmHg",
    kurz:
      "Millimeter Quecksilbersäule. Einheit für den Blutdruck. Der Name stammt aus der Zeit mechanischer Messgeräte.",
  },
  {
    term: "mg/dl",
    kurz:
      "Milligramm pro Deziliter. Einheit für Blutzucker und Cholesterin im Blut.",
  },
  {
    term: "ng/ml",
    kurz:
      "Nanogramm pro Milliliter. Sehr kleine Mengeneinheit, z. B. für den Vitamin-D-Spiegel im Blut.",
  },
  {
    term: "HbA1c",
    kurz:
      "Langzeit-Blutzuckerwert. Zeigt, wie hoch dein Blutzucker in den letzten 2–3 Monaten durchschnittlich war. Unter 5,7 % gilt als normal.",
  },
  {
    term: "BPM",
    kurz: "Schläge pro Minute (beats per minute). Einheit für die Herzfrequenz.",
  },
  {
    term: "ms",
    kurz: "Millisekunden, Tausendstel einer Sekunde. Einheit für HRV-Messwerte.",
  },
  {
    term: "Gewebezucker",
    kurz:
      "Zuckerwert im Gewebe direkt unter der Haut. Die Apple Watch misst diesen optisch. Er hängt eng mit dem Blutzucker zusammen, läuft ihm aber 5–15 Minuten nach.",
  },
];

// Schneller Zugriff per Begriff.
export const glossarMap: Record<string, GlossarEintrag> = Object.fromEntries(
  glossar.map((g) => [g.term.toLowerCase(), g]),
);

// Alle Begriffe, nach Länge absteigend (längste zuerst -> sauberes Matching im Text).
export const glossarTerms: string[] = glossar
  .map((g) => g.term)
  .sort((a, b) => b.length - a.length);

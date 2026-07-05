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
      "Zuckerwert im Gewebe direkt unter der Haut. Die Apple Watch Series 12 misst diesen optisch. Er hängt eng mit dem Blutzucker zusammen, läuft ihm aber 5–15 Minuten nach.",
  },
  {
    term: "Ferritin",
    kurz:
      "Ferritin ist der Eisenspeicher deines Körpers. Niedrige Werte können auf Eisenmangel hindeuten, hohe auf Entzündungen.",
  },
  {
    term: "Vitamin D",
    kurz:
      "Vitamin D unterstützt Knochen, Muskeln und Immunsystem. Der Körper bildet es vor allem durch Sonnenlicht; im Winter sind die Werte oft niedriger.",
  },
  {
    term: "Tiefschlaf",
    kurz:
      "Tiefschlaf ist die erholsamste Schlafphase. In ihr regeneriert sich der Körper besonders stark; ein höherer Anteil gilt als Zeichen guter Erholung.",
  },
  {
    term: "Glukose",
    kurz:
      "Glukose ist Traubenzucker, der wichtigste Energieträger im Blut. Stabile Werte sind günstig für Stoffwechsel und Herz.",
  },
  {
    term: "Blutzucker",
    kurz:
      "Der Blutzucker ist die Menge an Glukose (Traubenzucker) im Blut. Er schwankt über den Tag, je nach Mahlzeiten, Bewegung und Schlaf.",
  },
  {
    term: "Tetanus",
    kurz:
      "Tetanus (Wundstarrkrampf) ist eine Infektion über Wunden. Die Impfung schützt rund zehn Jahre, danach wird eine Auffrischung empfohlen.",
  },
  {
    term: "Hepatitis A",
    kurz:
      "Hepatitis A ist eine Leberentzündung, oft über verunreinigtes Wasser oder Essen. Die Impfung wird für viele Reiseziele empfohlen.",
  },
  {
    term: "Hepatitis B",
    kurz:
      "Hepatitis B ist eine Leberentzündung, die über Blut und Körperflüssigkeiten übertragen wird. Die Impfung bietet langfristigen Schutz.",
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

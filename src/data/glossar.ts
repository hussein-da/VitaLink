import type { GlossarEintrag } from "@/lib/types";
import type { Locale } from "@/i18n/types";

// Zweisprachige Glossar-Datenbasis (B1-Erklaerungen / plain English).
//
// BESONDERHEIT (F2): Der Glossar-Mechanismus erkennt Fachbegriffe per Regex
// ueber eine Begriffsliste. Im Englischen sind das teils ANDERE WOERTER
// ("systolisch" -> "systolic", "Wundstarrkrampf/Tetanus" -> "tetanus"), nicht
// nur andere Erklaerungen desselben Wortlauts. Darum traegt jede Locale ihren
// EIGENEN `term` — die Begriffsliste und die Lookup-Map werden je Locale
// gebaut.
//
// Kanonischer, locale-unabhaengiger Schluessel jedes Eintrags ist der
// kleingeschriebene DEUTSCHE Begriff (`glossarIds`). Er bleibt beim
// Sprachwechsel stabil und dient als Referenz fuer Kategorie-Zuordnung
// (glossarEintraege.ts) und Abkuerzungs-Metadaten (abkuerzungen.ts).

interface GlossarQuelle {
  /** Locale-unabhaengiger Schluessel: kleingeschriebener deutscher Begriff. */
  id: string;
  de: GlossarEintrag;
  en: GlossarEintrag;
}

const quellen: GlossarQuelle[] = [
  {
    id: "hrv",
    de: {
      term: "HRV",
      kurz:
        "HRV steht für Herzfrequenzvariabilität. Sie misst, wie stark die Zeit zwischen zwei Herzschlägen schwankt. Eine höhere Schwankung gilt meist als Zeichen guter Erholung.",
    },
    en: {
      term: "HRV",
      kurz:
        "HRV stands for heart rate variability. It measures how much the time between two heartbeats changes. More variation is usually a sign of good recovery.",
    },
  },
  {
    id: "ruhepuls",
    de: {
      term: "Ruhepuls",
      kurz:
        "Der Ruhepuls ist die Zahl der Herzschläge pro Minute, wenn du ganz ruhig bist. Niedrigere Werte deuten oft auf gute Erholung und Fitness hin.",
    },
    en: {
      term: "Resting heart rate",
      kurz:
        "Your resting heart rate is the number of heartbeats per minute when you are completely calm. Lower values often point to good recovery and fitness.",
    },
  },
  {
    id: "blutdruck",
    de: {
      term: "Blutdruck",
      kurz:
        "Der Blutdruck ist der Druck, mit dem das Blut durch die Gefäße strömt. Er wird mit zwei Zahlen angegeben, zum Beispiel 128 zu 82.",
    },
    en: {
      term: "Blood pressure",
      kurz:
        "Blood pressure is the pressure your blood puts on the vessels as it flows. It is given as two numbers, for example 128 over 82.",
    },
  },
  {
    id: "systolisch",
    de: {
      term: "systolisch",
      kurz:
        "Der systolische Wert ist die obere (größere) Zahl beim Blutdruck. Er entsteht, wenn das Herz Blut in die Gefäße pumpt.",
    },
    en: {
      term: "Systolic",
      kurz:
        "The systolic value is the upper (higher) number of a blood pressure reading. It comes from the moment your heart pumps blood into the vessels.",
    },
  },
  {
    id: "diastolisch",
    de: {
      term: "diastolisch",
      kurz:
        "Der diastolische Wert ist die untere (kleinere) Zahl beim Blutdruck. Er entsteht, wenn sich das Herz zwischen zwei Schlägen entspannt.",
    },
    en: {
      term: "Diastolic",
      kurz:
        "The diastolic value is the lower (smaller) number of a blood pressure reading. It comes from the moment your heart relaxes between two beats.",
    },
  },
  {
    id: "cholesterin",
    de: {
      term: "Cholesterin",
      kurz:
        "Cholesterin ist ein Fettstoff im Blut. Der Körper braucht ihn, doch zu viel davon kann die Gefäße mit der Zeit belasten.",
    },
    en: {
      term: "Cholesterol",
      kurz:
        "Cholesterol is a fatty substance in your blood. Your body needs it, but too much of it can strain the vessels over time.",
    },
  },
  {
    id: "kardiovaskulär",
    de: {
      term: "kardiovaskulär",
      kurz:
        "Kardiovaskulär bedeutet 'Herz und Gefäße betreffend'. Gemeint ist alles rund um Herz und Blutbahnen.",
    },
    en: {
      term: "Cardiovascular",
      kurz:
        'Cardiovascular means "relating to the heart and the blood vessels". It covers everything around your heart and your bloodstream.',
    },
  },
  {
    id: "stiko",
    de: {
      term: "STIKO",
      kurz:
        "Die STIKO ist die Ständige Impfkommission in Deutschland. Sie empfiehlt, welche Impfungen wann sinnvoll sind.",
    },
    en: {
      term: "STIKO",
      kurz:
        "The STIKO is Germany's standing committee on vaccination. It recommends which vaccinations make sense and when.",
    },
  },
  {
    id: "mmhg",
    de: {
      term: "mmHg",
      kurz:
        "Millimeter Quecksilbersäule. Einheit für den Blutdruck. Der Name stammt aus der Zeit mechanischer Messgeräte.",
    },
    en: {
      term: "mmHg",
      kurz:
        "Millimetres of mercury. The unit for blood pressure. The name goes back to the days of mechanical measuring devices.",
    },
  },
  {
    id: "mg/dl",
    de: {
      term: "mg/dl",
      kurz:
        "Milligramm pro Deziliter. Einheit für Blutzucker und Cholesterin im Blut.",
    },
    en: {
      term: "mg/dl",
      kurz: "Milligrams per decilitre. The unit for blood sugar and cholesterol in the blood.",
    },
  },
  {
    id: "ng/ml",
    de: {
      term: "ng/ml",
      kurz:
        "Nanogramm pro Milliliter. Sehr kleine Mengeneinheit, z. B. für den Vitamin-D-Spiegel im Blut.",
    },
    en: {
      term: "ng/ml",
      kurz:
        "Nanograms per millilitre. A very small unit of amount, used for example for the vitamin D level in the blood.",
    },
  },
  {
    id: "hba1c",
    de: {
      term: "HbA1c",
      kurz:
        "Langzeit-Blutzuckerwert. Zeigt, wie hoch dein Blutzucker in den letzten 2–3 Monaten durchschnittlich war. Unter 5,7 % gilt als normal.",
    },
    en: {
      term: "HbA1c",
      kurz:
        "Long-term blood sugar value. It shows how high your blood sugar was on average over the last 2–3 months. Below 5.7 % counts as normal.",
    },
  },
  {
    id: "bpm",
    de: {
      term: "BPM",
      kurz: "Schläge pro Minute (beats per minute). Einheit für die Herzfrequenz.",
    },
    en: {
      term: "BPM",
      kurz: "Beats per minute. The unit for heart rate.",
    },
  },
  {
    id: "ms",
    de: {
      term: "ms",
      kurz: "Millisekunden, Tausendstel einer Sekunde. Einheit für HRV-Messwerte.",
    },
    en: {
      term: "ms",
      kurz: "Milliseconds, thousandths of a second. The unit for HRV readings.",
    },
  },
  {
    id: "gewebezucker",
    de: {
      term: "Gewebezucker",
      kurz:
        "Zuckerwert im Gewebe direkt unter der Haut. Die Apple Watch Series 12 misst diesen optisch. Er hängt eng mit dem Blutzucker zusammen, läuft ihm aber 5–15 Minuten nach.",
    },
    en: {
      term: "Tissue glucose",
      kurz:
        "The sugar level in the tissue just under your skin. The Apple Watch Series 12 measures it with light. It is closely linked to blood sugar, but it follows about 5–15 minutes behind.",
    },
  },
  {
    id: "ferritin",
    de: {
      term: "Ferritin",
      kurz:
        "Ferritin ist der Eisenspeicher deines Körpers. Niedrige Werte können auf Eisenmangel hindeuten, hohe auf Entzündungen.",
    },
    en: {
      term: "Ferritin",
      kurz:
        "Ferritin is your body's iron store. Low values can point to a lack of iron, high ones to inflammation.",
    },
  },
  {
    id: "vitamin d",
    de: {
      term: "Vitamin D",
      kurz:
        "Vitamin D unterstützt Knochen, Muskeln und Immunsystem. Der Körper bildet es vor allem durch Sonnenlicht; im Winter sind die Werte oft niedriger.",
    },
    en: {
      term: "Vitamin D",
      kurz:
        "Vitamin D supports your bones, muscles and immune system. Your body makes it mainly from sunlight, so levels are often lower in winter.",
    },
  },
  {
    id: "tiefschlaf",
    de: {
      term: "Tiefschlaf",
      kurz:
        "Tiefschlaf ist die erholsamste Schlafphase. In ihr regeneriert sich der Körper besonders stark; ein höherer Anteil gilt als Zeichen guter Erholung.",
    },
    en: {
      term: "Deep sleep",
      kurz:
        "Deep sleep is the most restful sleep stage. Your body recovers especially well during it, so a higher share is a sign of good recovery.",
    },
  },
  {
    id: "glukose",
    de: {
      term: "Glukose",
      kurz:
        "Glukose ist Traubenzucker, der wichtigste Energieträger im Blut. Stabile Werte sind günstig für Stoffwechsel und Herz.",
    },
    en: {
      term: "Glucose",
      kurz:
        "Glucose is a simple sugar and the main source of energy in your blood. Steady levels are good for your metabolism and your heart.",
    },
  },
  {
    id: "blutzucker",
    de: {
      term: "Blutzucker",
      kurz:
        "Der Blutzucker ist die Menge an Glukose (Traubenzucker) im Blut. Er schwankt über den Tag, je nach Mahlzeiten, Bewegung und Schlaf.",
    },
    en: {
      term: "Blood sugar",
      kurz:
        "Blood sugar is the amount of glucose in your blood. It moves up and down over the day, depending on meals, activity and sleep.",
    },
  },
  {
    id: "tetanus",
    de: {
      term: "Tetanus",
      kurz:
        "Tetanus (Wundstarrkrampf) ist eine Infektion über Wunden. Die Impfung schützt rund zehn Jahre, danach wird eine Auffrischung empfohlen.",
    },
    en: {
      term: "Tetanus",
      kurz:
        "Tetanus is an infection that gets in through wounds. The vaccination protects for about ten years, and a booster is recommended after that.",
    },
  },
  {
    id: "hepatitis a",
    de: {
      term: "Hepatitis A",
      kurz:
        "Hepatitis A ist eine Leberentzündung, oft über verunreinigtes Wasser oder Essen. Die Impfung wird für viele Reiseziele empfohlen.",
    },
    en: {
      term: "Hepatitis A",
      kurz:
        "Hepatitis A is an inflammation of the liver, often picked up from unclean water or food. The vaccination is recommended for many travel destinations.",
    },
  },
  {
    id: "hepatitis b",
    de: {
      term: "Hepatitis B",
      kurz:
        "Hepatitis B ist eine Leberentzündung, die über Blut und Körperflüssigkeiten übertragen wird. Die Impfung bietet langfristigen Schutz.",
    },
    en: {
      term: "Hepatitis B",
      kurz:
        "Hepatitis B is an inflammation of the liver that passes on through blood and body fluids. The vaccination gives long-term protection.",
    },
  },
];

/**
 * Locale-unabhaengige Schluessel, gleiche Reihenfolge wie glossarFuer().
 * Wer Metadaten an einen Eintrag haengt (Kategorie, Abkuerzungs-Langform),
 * referenziert diesen Schluessel — nicht den uebersetzten Begriff.
 */
export const glossarIds: string[] = quellen.map((q) => q.id);

const eintraegeProLocale: Record<Locale, GlossarEintrag[]> = {
  de: quellen.map((q) => q.de),
  en: quellen.map((q) => q.en),
};

const mapProLocale: Record<Locale, Record<string, GlossarEintrag>> = {
  de: Object.fromEntries(eintraegeProLocale.de.map((g) => [g.term.toLowerCase(), g])),
  en: Object.fromEntries(eintraegeProLocale.en.map((g) => [g.term.toLowerCase(), g])),
};

// Laengste Begriffe zuerst -> im Text matcht "Resting heart rate" vor "heart".
// Die Sortierung muss je Locale eigenstaendig erfolgen, weil die englischen
// Begriffe andere Laengen haben als die deutschen.
const termsProLocale: Record<Locale, string[]> = {
  de: eintraegeProLocale.de.map((g) => g.term).sort((a, b) => b.length - a.length),
  en: eintraegeProLocale.en.map((g) => g.term).sort((a, b) => b.length - a.length),
};

/** Alle Glossar-Eintraege einer Locale, in Quellreihenfolge. */
export function glossarFuer(locale: Locale): GlossarEintrag[] {
  return eintraegeProLocale[locale];
}

/** Schnellzugriff per Begriff (Schluessel = term.toLowerCase() DER LOCALE). */
export function glossarMapFuer(locale: Locale): Record<string, GlossarEintrag> {
  return mapProLocale[locale];
}

/** Begriffsliste einer Locale, nach Laenge absteigend (Regex-Matching). */
export function glossarTermsFuer(locale: Locale): string[] {
  return termsProLocale[locale];
}

/** Ein einzelner Eintrag ueber den Begriff der jeweiligen Locale. */
export function glossarEintragFuer(term: string, locale: Locale): GlossarEintrag | undefined {
  return mapProLocale[locale][term.toLowerCase()];
}

// --- Deutschsprachige Sicht (unveraenderte Altschnittstelle) -----------------
// abkuerzungen.ts zieht die kanonischen Erklaerungen ueber glossarMap. Diese
// Datenbasis ist (noch) rein deutsch, deshalb bleibt der deutsche Stand hier
// unter den alten Namen erreichbar. Neue Aufrufer nutzen die *Fuer()-Accessoren.

export const glossar: GlossarEintrag[] = eintraegeProLocale.de;

/** Deutsche Map — Grundlage der deutschsprachigen Abkuerzungs-Datenbasis. */
export const glossarMap: Record<string, GlossarEintrag> = mapProLocale.de;

export const glossarTerms: string[] = termsProLocale.de;

// VitaLink — Abkürzungs-Datenbasis (Badge 2.3/2.4).
// Read-only; nutzerdefinierte Einträge liegen separat im localStorage.
//
// ZUSTÄNDIGKEIT (korrigiert): Diese Datei ist die Quelle für die
// Abkürzungs-METADATEN — Langform (`ausgeschrieben`), Kategorie, Einheit und
// Referenzbereich. Sie ist NICHT die Quelle der Begriffs-ERKLÄRUNG.
//
// Kanonische Quelle jeder Erklärung ist src/data/glossar.ts. Für Begriffe, die
// in beiden Dateien vorkommen, wird die Erklärung über ausGlossar() referenziert
// statt kopiert. Zuvor hielten beide Dateien eigene, voneinander abweichende
// Texte für dieselben fünf Begriffe (HRV, BPM, mmHg, HbA1c, mg/dl); je nach
// Oberfläche erschien ein anderer Text. Bei HRV war die hiesige Fassung nicht
// nur ungenauer, sondern sachlich falsch ("wie gleichmäßig dein Herz schlägt" —
// tatsächlich misst die HRV die SCHWANKUNG, eine höhere Variabilität ist das
// Gütezeichen). Die Referenzierung beseitigt die Divergenzquelle strukturell,
// statt nur den Momentanstand zu synchronisieren.
//
// ZWEISPRACHIGKEIT: Die Quelldaten (`quellen`) tragen je Textfeld ein
// `Lokalisiert`-Paar; der öffentliche Typ `Abkuerzung` bleibt reine strings.
// Aufgelöst wird je Locale über abkuerzungenFuer()/abkuerzungMapFuer().
// Locale-UNABHÄNGIG bleiben: `id`, `kuerzel` (HRV, HbA1c, mmHg … sind
// international), `kategorie`, `vordefiniert`, `einheit` und die Zahlen des
// Referenzbereichs.

import { glossarMapFuer } from "./glossar";
import type { Lokalisiert, Locale } from "@/i18n/types";

/**
 * Holt die Erklärung aus der kanonischen Quelle glossar.ts — für BEIDE Locales,
 * damit die Referenzierung auch zweisprachig erhalten bleibt.
 * Fehlt der Begriff dort in einer der Sprachen, schlägt der Build fehl statt
 * still auf einen abweichenden Zweittext zurückzufallen — die Divergenz soll
 * nicht unbemerkt wiederkehren können.
 *
 * Zulässig ist ein gemeinsamer Begriff nur, weil die fünf Überschneidungen
 * (HRV, BPM, mmHg, HbA1c, mg/dl) in glossar.ts in beiden Sprachen denselben
 * `term` tragen. Andere Glossar-Einträge führen je Locale andere Begriffe
 * ("Ruhepuls" / "Resting heart rate"); für die wäre ein Locale-Paar als
 * Schlüssel nötig — der throw deckt den Fall auf, statt ihn zu verschlucken.
 */
function ausGlossar(term: string): Lokalisiert {
  const hole = (locale: Locale): string => {
    const eintrag = glossarMapFuer(locale)[term.toLowerCase()];
    if (!eintrag) {
      throw new Error(
        `abkuerzungen.ts: Erklärung für "${term}" fehlt in glossar.ts (Locale "${locale}", kanonische Quelle).`,
      );
    }
    return eintrag.kurz;
  };
  return { de: hole("de"), en: hole("en") };
}

export type AbkuerzungKategorie =
  | "herz"
  | "labor"
  | "schlaf"
  | "allgemein"
  | "digital"
  | "nutzerdefiniert";

/** Öffentliche, bereits aufgelöste Sicht (eine Sprache). */
export interface Abkuerzung {
  id: string;
  kuerzel: string;
  ausgeschrieben: string;
  erklaerung: string;
  kategorie: AbkuerzungKategorie;
  vordefiniert: boolean;
  /** Einheit (z. B. "µg/l", "ms"). */
  einheit?: string;
  referenzBereich?: { min?: number; max?: number; einheit: string; label: string };
  /** ICD-Klartext (z. B. "Eisenmangel-Blutarmut"). */
  icdKlartext?: string;
  /** Wirkstoff-Klartext (z. B. "Vitamin D"). */
  wirkstoffKlartext?: string;
}

/** Interne Quellform: dieselben Felder, Texte als Locale-Paar. */
interface AbkuerzungQuelle {
  id: string;
  kuerzel: string;
  ausgeschrieben: Lokalisiert;
  erklaerung: Lokalisiert;
  kategorie: AbkuerzungKategorie;
  vordefiniert: boolean;
  einheit?: string;
  referenzBereich?: { min?: number; max?: number; einheit: string; label: string };
  icdKlartext?: Lokalisiert;
  wirkstoffKlartext?: Lokalisiert;
}

const quellen: AbkuerzungQuelle[] = [
  // HERZGESUNDHEIT
  {
    id: "hrv",
    kuerzel: "HRV",
    ausgeschrieben: { de: "Herzratenvariabilität", en: "Heart rate variability" },
    erklaerung: ausGlossar("HRV"),
    kategorie: "herz",
    vordefiniert: true,
  },
  {
    id: "bpm",
    kuerzel: "BPM",
    ausgeschrieben: { de: "Schläge pro Minute", en: "Beats per minute" },
    erklaerung: ausGlossar("BPM"),
    kategorie: "herz",
    vordefiniert: true,
    einheit: "BPM",
  },
  {
    id: "spo2",
    kuerzel: "SpO₂",
    ausgeschrieben: { de: "Blutsauerstoffsättigung", en: "Blood oxygen saturation" },
    erklaerung: {
      de: "Gibt an, wie viel Sauerstoff dein Blut transportiert. Werte über 95 % gelten als normal.",
      en: "Shows how much oxygen your blood carries. Values above 95 % count as normal.",
    },
    kategorie: "herz",
    vordefiniert: true,
  },
  {
    id: "rr",
    kuerzel: "RR",
    ausgeschrieben: { de: "Blutdruck (Riva-Rocci)", en: "Blood pressure (Riva-Rocci)" },
    erklaerung: {
      de: "Abkürzung für Blutdruck. Der erste Wert (systolisch) ist der Druck beim Herzschlag, der zweite (diastolisch) in der Ruhephase.",
      en: "Short for blood pressure. The first value (systolic) is the pressure when your heart beats, the second (diastolic) the pressure while it rests.",
    },
    kategorie: "herz",
    vordefiniert: true,
  },
  {
    id: "vo2max",
    kuerzel: "VO₂max",
    ausgeschrieben: { de: "Maximale Sauerstoffaufnahme", en: "Maximum oxygen uptake" },
    erklaerung: {
      de: "Zeigt, wie effizient dein Körper beim Sport Sauerstoff nutzt. Ein höherer Wert steht für bessere Ausdauer.",
      en: "Shows how well your body uses oxygen during exercise. A higher value stands for better endurance.",
    },
    kategorie: "herz",
    vordefiniert: true,
    einheit: "ml/kg/min",
  },
  {
    id: "rmssd",
    kuerzel: "RMSSD",
    ausgeschrieben: {
      de: "Quadratwurzel des mittleren quadratischen Abstands",
      en: "Square root of the mean squared difference",
    },
    erklaerung: {
      de: "Mathematische Methode zur Berechnung der HRV. Ein höherer Wert bedeutet bessere Erholung und geringeren Stress.",
      en: "A mathematical method for calculating HRV. A higher value means better recovery and less stress.",
    },
    kategorie: "herz",
    vordefiniert: true,
  },
  {
    id: "mmhg",
    kuerzel: "mmHg",
    ausgeschrieben: { de: "Millimeter Quecksilbersäule", en: "Millimetres of mercury" },
    erklaerung: ausGlossar("mmHg"),
    kategorie: "herz",
    vordefiniert: true,
    einheit: "mmHg",
  },

  // LABORWERTE
  {
    id: "hba1c",
    kuerzel: "HbA1c",
    ausgeschrieben: { de: "Langzeit-Blutzuckerwert", en: "Long-term blood sugar value" },
    erklaerung: ausGlossar("HbA1c"),
    kategorie: "labor",
    vordefiniert: true,
  },
  {
    id: "ldl",
    kuerzel: "LDL",
    ausgeschrieben: { de: "LDL-Cholesterin", en: "LDL cholesterol" },
    erklaerung: {
      de: "Wird oft als „schlechtes“ Cholesterin bezeichnet. Hohe Werte können langfristig das Herzrisiko erhöhen.",
      en: "Often called “bad” cholesterol. High values can affect your heart health over the long term.",
    },
    kategorie: "labor",
    vordefiniert: true,
  },
  {
    id: "hdl",
    kuerzel: "HDL",
    ausgeschrieben: { de: "HDL-Cholesterin", en: "HDL cholesterol" },
    erklaerung: {
      de: "Wird als „gutes“ Cholesterin bezeichnet. Höhere Werte sind gesundheitlich vorteilhaft.",
      en: "Known as “good” cholesterol. Higher values are good for your health.",
    },
    kategorie: "labor",
    vordefiniert: true,
  },
  {
    id: "crp",
    kuerzel: "CRP",
    ausgeschrieben: { de: "C-reaktives Protein", en: "C-reactive protein" },
    erklaerung: {
      de: "Entzündungsmarker im Blut. Erhöhte Werte können auf eine Entzündung oder Infektion hinweisen.",
      en: "An inflammatory marker in the blood. Raised values may indicate inflammation or an infection.",
    },
    kategorie: "labor",
    vordefiniert: true,
  },
  {
    id: "tsh",
    kuerzel: "TSH",
    ausgeschrieben: { de: "Thyreoidea-stimulierendes Hormon", en: "Thyroid-stimulating hormone" },
    erklaerung: {
      de: "Steuert die Schilddrüsenfunktion. Abweichende Werte können auf eine Über- oder Unterfunktion hinweisen.",
      en: "It steers your thyroid function. Values outside the usual range may indicate an overactive or underactive thyroid.",
    },
    kategorie: "labor",
    vordefiniert: true,
    einheit: "mU/l",
  },
  {
    id: "gfr",
    kuerzel: "GFR",
    ausgeschrieben: { de: "Glomeruläre Filtrationsrate", en: "Glomerular filtration rate" },
    erklaerung: {
      de: "Misst, wie gut deine Nieren das Blut filtern. Werte über 90 ml/min gelten als normal.",
      en: "Measures how well your kidneys filter your blood. Values above 90 ml/min count as normal.",
    },
    kategorie: "labor",
    vordefiniert: true,
  },
  {
    id: "mcv",
    kuerzel: "MCV",
    ausgeschrieben: { de: "Mittleres Erythrozytenvolumen", en: "Mean red blood cell volume" },
    erklaerung: {
      de: "Gibt die durchschnittliche Größe deiner roten Blutkörperchen an. Hilft bei der Diagnose verschiedener Blutarmut-Formen.",
      en: "Shows the average size of your red blood cells. It helps with diagnosing different forms of anaemia.",
    },
    kategorie: "labor",
    vordefiniert: true,
  },
  {
    id: "mgdl",
    kuerzel: "mg/dl",
    ausgeschrieben: { de: "Milligramm pro Deziliter", en: "Milligrams per decilitre" },
    erklaerung: ausGlossar("mg/dl"),
    kategorie: "labor",
    vordefiniert: true,
    einheit: "mg/dl",
  },
  {
    id: "ugml",
    kuerzel: "µg/l",
    ausgeschrieben: { de: "Mikrogramm pro Liter", en: "Micrograms per litre" },
    erklaerung: {
      de: "Sehr kleine Mengeneinheit für Spurenstoffe im Blut. Wird z. B. für Ferritin und Vitamin D verwendet.",
      en: "A very small unit of amount for trace substances in the blood. It is used for ferritin and vitamin D, for example.",
    },
    kategorie: "labor",
    vordefiniert: true,
    einheit: "µg/l",
  },
  {
    id: "mul",
    kuerzel: "mU/l",
    ausgeschrieben: { de: "Milli-Units pro Liter", en: "Milli-units per litre" },
    erklaerung: {
      de: "Einheit für Hormonkonzentrationen im Blut. Wird z. B. für den TSH-Schilddrüsenwert verwendet.",
      en: "The unit for hormone levels in the blood. It is used for the TSH thyroid value, for example.",
    },
    kategorie: "labor",
    vordefiniert: true,
    einheit: "mU/l",
  },
  {
    id: "gdl",
    kuerzel: "g/dl",
    ausgeschrieben: { de: "Gramm pro Deziliter", en: "Grams per decilitre" },
    erklaerung: {
      de: "Einheit für Hämoglobin im Blut. Zeigt an, wie viel des roten Blutfarbstoffs in deinem Blut enthalten ist.",
      en: "The unit for haemoglobin in the blood. It shows how much of the red blood pigment your blood contains.",
    },
    kategorie: "labor",
    vordefiniert: true,
    einheit: "g/dl",
  },

  // SCHLAF
  {
    id: "rem",
    kuerzel: "REM",
    ausgeschrieben: { de: "Rapid Eye Movement", en: "Rapid eye movement" },
    erklaerung: {
      de: "Schlafphase mit schnellen Augenbewegungen. In dieser Phase träumst du — sie ist wichtig für Gedächtnis und emotionale Verarbeitung.",
      en: "The sleep stage with quick eye movements. This is the stage where you dream, and it matters for memory and for working through emotions.",
    },
    kategorie: "schlaf",
    vordefiniert: true,
  },
  {
    id: "cv",
    kuerzel: "CV",
    ausgeschrieben: { de: "Variationskoeffizient", en: "Coefficient of variation" },
    erklaerung: {
      de: "Maß für die Streuung von Messwerten. Bei Glukose zeigt ein niedriger CV stabile Blutzuckerwerte an.",
      en: "A measure of how widely readings are spread. For glucose, a low CV shows steady blood sugar values.",
    },
    kategorie: "schlaf",
    vordefiniert: true,
  },

  // DIGITAL / EPA
  {
    id: "epa",
    kuerzel: "ePA",
    ausgeschrieben: { de: "Elektronische Patientenakte", en: "Electronic patient record" },
    erklaerung: {
      de: "Digitale Gesundheitsakte der gesetzlichen Krankenkassen. Enthält Befunde, Laborwerte, Impfungen und weitere medizinische Dokumente.",
      en: "The digital health record of the statutory health insurance funds. It holds findings, lab values, vaccinations and other medical documents.",
    },
    kategorie: "digital",
    vordefiniert: true,
  },
  {
    id: "cgm",
    kuerzel: "CGM",
    ausgeschrieben: { de: "Kontinuierliches Glukosemonitoring", en: "Continuous glucose monitoring" },
    erklaerung: {
      de: "Sensor, der dauerhaft den Blutzucker misst, ohne Fingerstich. Gibt Echtzeit-Einblicke in Glukoseverläufe.",
      en: "A sensor that measures blood sugar around the clock, without a finger prick. It gives real-time insight into how glucose changes.",
    },
    kategorie: "digital",
    vordefiniert: true,
  },
  {
    id: "ppg",
    kuerzel: "PPG",
    ausgeschrieben: { de: "Photoplethysmographie", en: "Photoplethysmography" },
    erklaerung: {
      de: "Optisches Messverfahren, das Puls, SpO₂ und HRV über Lichtsensoren in der Apple Watch Series 12 erfasst.",
      en: "An optical measuring method. It records pulse, SpO₂ and HRV through the light sensors in the Apple Watch Series 12.",
    },
    kategorie: "digital",
    vordefiniert: true,
  },

  // ALLGEMEIN
  {
    id: "bmi",
    kuerzel: "BMI",
    ausgeschrieben: { de: "Body-Mass-Index", en: "Body mass index" },
    erklaerung: {
      de: "Verhältnis von Gewicht zu Körpergröße. Ein Wert zwischen 18,5 und 24,9 gilt als Normalgewicht.",
      en: "The ratio of your weight to your height. A value between 18.5 and 24.9 counts as normal weight.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
  },
  {
    id: "gkv",
    kuerzel: "GKV",
    ausgeschrieben: { de: "Gesetzliche Krankenversicherung", en: "Statutory health insurance" },
    erklaerung: {
      de: "Das gesetzliche Krankenversicherungssystem in Deutschland. VitaLink ist für GKV-Versicherte konzipiert.",
      en: "Germany's statutory health insurance system. VitaLink is designed for people insured under the GKV.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
  },
  {
    id: "icd",
    kuerzel: "ICD-10",
    ausgeschrieben: {
      de: "Internationale Klassifikation der Krankheiten (10. Revision)",
      en: "International Classification of Diseases (10th revision)",
    },
    erklaerung: {
      de: "Weltweit verwendetes System zur Kodierung von Diagnosen. Wird in der ePA zur Dokumentation von Erkrankungen genutzt.",
      en: "A system used worldwide to code diagnoses. The ePA (Germany's electronic patient record) uses it to document conditions.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
  },
  {
    id: "mmol",
    kuerzel: "ml/kg/min",
    ausgeschrieben: {
      de: "Milliliter pro Kilogramm Körpergewicht pro Minute",
      en: "Millilitres per kilogram of body weight per minute",
    },
    erklaerung: {
      de: "Einheit für VO₂max. Misst, wie viel Sauerstoff dein Körper pro Kilo Gewicht und Minute aufnehmen kann.",
      en: "The unit for VO₂max. It measures how much oxygen your body can take up per kilo of weight and minute.",
    },
    kategorie: "herz",
    vordefiniert: true,
    einheit: "ml/kg/min",
  },

  // ICD-Codes (mit Klartext)
  {
    id: "d509",
    kuerzel: "D50.9",
    ausgeschrieben: { de: "Eisenmangel-Blutarmut", en: "Iron deficiency anaemia" },
    erklaerung: {
      de: "Blutarmut durch zu wenig Eisen im Körper. Kann Müdigkeit und Erschöpfung verursachen.",
      en: "Anaemia caused by too little iron in the body. It can lead to tiredness and exhaustion.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
    icdKlartext: { de: "Eisenmangel-Blutarmut", en: "Iron deficiency anaemia" },
  },
  {
    id: "j301",
    kuerzel: "J30.1",
    ausgeschrieben: { de: "Allergischer Schnupfen", en: "Allergic rhinitis (hay fever)" },
    erklaerung: {
      de: "Saisonale Allergie gegen Pollen. Verursacht Niesen, laufende Nase und juckende Augen, meist im Frühling und Sommer.",
      en: "A seasonal allergy to pollen. It causes sneezing, a runny nose and itchy eyes, mostly in spring and summer.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
    icdKlartext: { de: "Allergischer Schnupfen", en: "Allergic rhinitis (hay fever)" },
  },

  // Wirkstoffe
  {
    id: "cholecalciferol",
    kuerzel: "Cholecalciferol",
    ausgeschrieben: { de: "Vitamin D₃", en: "Vitamin D₃" },
    erklaerung: {
      de: "Die natürliche Form von Vitamin D. Wird vom Körper auch durch Sonnenlicht gebildet und unterstützt Knochen und Immunsystem.",
      en: "The natural form of vitamin D. Your body also makes it from sunlight, and it supports your bones and your immune system.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
    wirkstoffKlartext: { de: "Vitamin D", en: "Vitamin D" },
  },
  {
    id: "cetirizin",
    kuerzel: "Cetirizin",
    ausgeschrieben: {
      de: "Antihistaminikum gegen Allergien",
      en: "Antihistamine for allergies",
    },
    erklaerung: {
      de: "Medikament, das allergische Reaktionen dämpft. Wird bei Heuschnupfen und Hautallergie eingesetzt.",
      en: "A medicine that dampens allergic reactions. It is used for hay fever and skin allergies.",
    },
    kategorie: "allgemein",
    vordefiniert: true,
    wirkstoffKlartext: { de: "Allergiemittel", en: "Allergy medicine" },
  },
];

function aufloesen(q: AbkuerzungQuelle, locale: Locale): Abkuerzung {
  const a: Abkuerzung = {
    id: q.id,
    kuerzel: q.kuerzel,
    ausgeschrieben: q.ausgeschrieben[locale],
    erklaerung: q.erklaerung[locale],
    kategorie: q.kategorie,
    vordefiniert: q.vordefiniert,
  };
  if (q.einheit !== undefined) a.einheit = q.einheit;
  if (q.referenzBereich !== undefined) a.referenzBereich = q.referenzBereich;
  if (q.icdKlartext !== undefined) a.icdKlartext = q.icdKlartext[locale];
  if (q.wirkstoffKlartext !== undefined) a.wirkstoffKlartext = q.wirkstoffKlartext[locale];
  return a;
}

const proLocale: Record<Locale, Abkuerzung[]> = {
  de: quellen.map((q) => aufloesen(q, "de")),
  en: quellen.map((q) => aufloesen(q, "en")),
};

const mapProLocale: Record<Locale, Record<string, Abkuerzung>> = {
  de: Object.fromEntries(proLocale.de.map((a) => [a.kuerzel.toLowerCase(), a])),
  en: Object.fromEntries(proLocale.en.map((a) => [a.kuerzel.toLowerCase(), a])),
};

/**
 * Locale-unabhängige Schlüssel, gleiche Reihenfolge wie abkuerzungenFuer().
 * Wer einen Eintrag referenziert (Deep-Links, React-Keys), nutzt diese id —
 * nicht die übersetzte Langform.
 */
export const abkuerzungIds: string[] = quellen.map((q) => q.id);

/**
 * Alle vergebenen Kürzel, kleingeschrieben — locale-unabhängig, weil die
 * Kürzel selbst international sind. Grundlage für Duplikat-Prüfungen und für
 * die Frage, ob ein Glossar-Begriff schon als Abkürzung existiert.
 */
export const abkuerzungKuerzel: string[] = quellen.map((q) => q.kuerzel.toLowerCase());

/** Alle vordefinierten Abkürzungen einer Locale, in Quellreihenfolge. */
export function abkuerzungenFuer(locale: Locale): Abkuerzung[] {
  return proLocale[locale];
}

/** Schnell-Lookup nach Kürzel (case-insensitive), aufgelöst in der Locale. */
export function abkuerzungMapFuer(locale: Locale): Record<string, Abkuerzung> {
  return mapProLocale[locale];
}

const KATEGORIE_LABEL: Record<AbkuerzungKategorie, Lokalisiert> = {
  herz: { de: "Herzgesundheit", en: "Heart health" },
  labor: { de: "Laborwerte", en: "Lab values" },
  schlaf: { de: "Schlaf", en: "Sleep" },
  digital: { de: "Digital", en: "Digital" },
  allgemein: { de: "Allgemein", en: "General" },
  nutzerdefiniert: { de: "Meine Einträge", en: "My entries" },
};

/** Anzeigename einer Kategorie (Verzeichnisseite), aufgelöst in der Locale. */
export function kategorieLabelFuer(kategorie: AbkuerzungKategorie, locale: Locale): string {
  return KATEGORIE_LABEL[kategorie][locale];
}

// VitaLink — Abkürzungs-/Glossar-Datenbasis (Badge 2.3/2.4).
// Einzige Quelle der Wahrheit für Begriffserklärungen in der gesamten App.
// Read-only; nutzerdefinierte Einträge liegen separat im localStorage.

export type AbkuerzungKategorie =
  | "herz"
  | "labor"
  | "schlaf"
  | "allgemein"
  | "digital"
  | "nutzerdefiniert";

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

export const vordefinierteAbkuerzungen: Abkuerzung[] = [
  // HERZGESUNDHEIT
  { id: "hrv", kuerzel: "HRV", ausgeschrieben: "Herzratenvariabilität", erklaerung: "Misst, wie gleichmäßig dein Herz schlägt. Eine höhere HRV zeigt gute Erholung und geringen Stress an.", kategorie: "herz", vordefiniert: true },
  { id: "bpm", kuerzel: "BPM", ausgeschrieben: "Schläge pro Minute", erklaerung: "Einheit für die Herzfrequenz. Gibt an, wie oft dein Herz in einer Minute schlägt.", kategorie: "herz", vordefiniert: true, einheit: "BPM" },
  { id: "spo2", kuerzel: "SpO₂", ausgeschrieben: "Blutsauerstoffsättigung", erklaerung: "Gibt an, wie viel Sauerstoff dein Blut transportiert. Werte über 95 % gelten als normal.", kategorie: "herz", vordefiniert: true },
  { id: "rr", kuerzel: "RR", ausgeschrieben: "Blutdruck (Riva-Rocci)", erklaerung: "Abkürzung für Blutdruck. Der erste Wert (systolisch) ist der Druck beim Herzschlag, der zweite (diastolisch) in der Ruhephase.", kategorie: "herz", vordefiniert: true },
  { id: "vo2max", kuerzel: "VO₂max", ausgeschrieben: "Maximale Sauerstoffaufnahme", erklaerung: "Zeigt, wie effizient dein Körper beim Sport Sauerstoff nutzt. Ein höherer Wert steht für bessere Ausdauer.", kategorie: "herz", vordefiniert: true, einheit: "ml/kg/min" },
  { id: "rmssd", kuerzel: "RMSSD", ausgeschrieben: "Quadratwurzel des mittleren quadratischen Abstands", erklaerung: "Mathematische Methode zur Berechnung der HRV. Ein höherer Wert bedeutet bessere Erholung und geringeren Stress.", kategorie: "herz", vordefiniert: true },
  { id: "mmhg", kuerzel: "mmHg", ausgeschrieben: "Millimeter Quecksilbersäule", erklaerung: "Einheit für Blutdruck. Der Name stammt aus der Zeit mechanischer Blutdruckmessgeräte.", kategorie: "herz", vordefiniert: true, einheit: "mmHg" },

  // LABORWERTE
  { id: "hba1c", kuerzel: "HbA1c", ausgeschrieben: "Langzeit-Blutzuckerwert", erklaerung: "Zeigt, wie hoch dein Blutzucker im Durchschnitt der letzten 2–3 Monate war. Werte unter 5,7 % gelten als normal.", kategorie: "labor", vordefiniert: true },
  { id: "ldl", kuerzel: "LDL", ausgeschrieben: "LDL-Cholesterin", erklaerung: "Wird oft als „schlechtes“ Cholesterin bezeichnet. Hohe Werte können langfristig das Herzrisiko erhöhen.", kategorie: "labor", vordefiniert: true },
  { id: "hdl", kuerzel: "HDL", ausgeschrieben: "HDL-Cholesterin", erklaerung: "Wird als „gutes“ Cholesterin bezeichnet. Höhere Werte sind gesundheitlich vorteilhaft.", kategorie: "labor", vordefiniert: true },
  { id: "crp", kuerzel: "CRP", ausgeschrieben: "C-reaktives Protein", erklaerung: "Entzündungsmarker im Blut. Erhöhte Werte können auf eine Entzündung oder Infektion hinweisen.", kategorie: "labor", vordefiniert: true },
  { id: "tsh", kuerzel: "TSH", ausgeschrieben: "Thyreoidea-stimulierendes Hormon", erklaerung: "Steuert die Schilddrüsenfunktion. Abweichende Werte können auf eine Über- oder Unterfunktion hinweisen.", kategorie: "labor", vordefiniert: true, einheit: "mU/l" },
  { id: "gfr", kuerzel: "GFR", ausgeschrieben: "Glomeruläre Filtrationsrate", erklaerung: "Misst, wie gut deine Nieren das Blut filtern. Werte über 90 ml/min gelten als normal.", kategorie: "labor", vordefiniert: true },
  { id: "mcv", kuerzel: "MCV", ausgeschrieben: "Mittleres Erythrozytenvolumen", erklaerung: "Gibt die durchschnittliche Größe deiner roten Blutkörperchen an. Hilft bei der Diagnose verschiedener Blutarmut-Formen.", kategorie: "labor", vordefiniert: true },
  { id: "mgdl", kuerzel: "mg/dl", ausgeschrieben: "Milligramm pro Deziliter", erklaerung: "Einheit für Stoffkonzentrationen im Blut. Wird für Blutzucker und Cholesterin verwendet.", kategorie: "labor", vordefiniert: true, einheit: "mg/dl" },
  { id: "ugml", kuerzel: "µg/l", ausgeschrieben: "Mikrogramm pro Liter", erklaerung: "Sehr kleine Mengeneinheit für Spurenstoffe im Blut. Wird z. B. für Ferritin und Vitamin D verwendet.", kategorie: "labor", vordefiniert: true, einheit: "µg/l" },
  { id: "mul", kuerzel: "mU/l", ausgeschrieben: "Milli-Units pro Liter", erklaerung: "Einheit für Hormonkonzentrationen im Blut. Wird z. B. für den TSH-Schilddrüsenwert verwendet.", kategorie: "labor", vordefiniert: true, einheit: "mU/l" },
  { id: "gdl", kuerzel: "g/dl", ausgeschrieben: "Gramm pro Deziliter", erklaerung: "Einheit für Hämoglobin im Blut. Zeigt an, wie viel des roten Blutfarbstoffs in deinem Blut enthalten ist.", kategorie: "labor", vordefiniert: true, einheit: "g/dl" },

  // SCHLAF
  { id: "rem", kuerzel: "REM", ausgeschrieben: "Rapid Eye Movement", erklaerung: "Schlafphase mit schnellen Augenbewegungen. In dieser Phase träumst du — sie ist wichtig für Gedächtnis und emotionale Verarbeitung.", kategorie: "schlaf", vordefiniert: true },
  { id: "cv", kuerzel: "CV", ausgeschrieben: "Variationskoeffizient", erklaerung: "Maß für die Streuung von Messwerten. Bei Glukose zeigt ein niedriger CV stabile Blutzuckerwerte an.", kategorie: "schlaf", vordefiniert: true },

  // DIGITAL / EPA
  { id: "epa", kuerzel: "ePA", ausgeschrieben: "Elektronische Patientenakte", erklaerung: "Digitale Gesundheitsakte der gesetzlichen Krankenkassen. Enthält Befunde, Laborwerte, Impfungen und weitere medizinische Dokumente.", kategorie: "digital", vordefiniert: true },
  { id: "cgm", kuerzel: "CGM", ausgeschrieben: "Kontinuierliches Glukosemonitoring", erklaerung: "Sensor, der dauerhaft den Blutzucker misst, ohne Fingerstich. Gibt Echtzeit-Einblicke in Glukoseverläufe.", kategorie: "digital", vordefiniert: true },
  { id: "ppg", kuerzel: "PPG", ausgeschrieben: "Photoplethysmographie", erklaerung: "Optisches Messverfahren, das Puls, SpO₂ und HRV über Lichtsensoren in der Apple Watch Series 12 erfasst.", kategorie: "digital", vordefiniert: true },

  // ALLGEMEIN
  { id: "bmi", kuerzel: "BMI", ausgeschrieben: "Body-Mass-Index", erklaerung: "Verhältnis von Gewicht zu Körpergröße. Ein Wert zwischen 18,5 und 24,9 gilt als Normalgewicht.", kategorie: "allgemein", vordefiniert: true },
  { id: "gkv", kuerzel: "GKV", ausgeschrieben: "Gesetzliche Krankenversicherung", erklaerung: "Das gesetzliche Krankenversicherungssystem in Deutschland. VitaLink ist für GKV-Versicherte konzipiert.", kategorie: "allgemein", vordefiniert: true },
  { id: "icd", kuerzel: "ICD-10", ausgeschrieben: "Internationale Klassifikation der Krankheiten (10. Revision)", erklaerung: "Weltweit verwendetes System zur Kodierung von Diagnosen. Wird in der ePA zur Dokumentation von Erkrankungen genutzt.", kategorie: "allgemein", vordefiniert: true },
  { id: "mmol", kuerzel: "ml/kg/min", ausgeschrieben: "Milliliter pro Kilogramm Körpergewicht pro Minute", erklaerung: "Einheit für VO₂max. Misst, wie viel Sauerstoff dein Körper pro Kilo Gewicht und Minute aufnehmen kann.", kategorie: "herz", vordefiniert: true, einheit: "ml/kg/min" },

  // ICD-Codes (mit Klartext)
  { id: "d509", kuerzel: "D50.9", ausgeschrieben: "Eisenmangel-Blutarmut", erklaerung: "Blutarmut durch zu wenig Eisen im Körper. Kann Müdigkeit und Erschöpfung verursachen.", kategorie: "allgemein", vordefiniert: true, icdKlartext: "Eisenmangel-Blutarmut" },
  { id: "j301", kuerzel: "J30.1", ausgeschrieben: "Allergischer Schnupfen", erklaerung: "Saisonale Allergie gegen Pollen. Verursacht Niesen, laufende Nase und juckende Augen, meist im Frühling und Sommer.", kategorie: "allgemein", vordefiniert: true, icdKlartext: "Allergischer Schnupfen" },

  // Wirkstoffe
  { id: "cholecalciferol", kuerzel: "Cholecalciferol", ausgeschrieben: "Vitamin D₃", erklaerung: "Die natürliche Form von Vitamin D. Wird vom Körper auch durch Sonnenlicht gebildet und unterstützt Knochen und Immunsystem.", kategorie: "allgemein", vordefiniert: true, wirkstoffKlartext: "Vitamin D" },
  { id: "cetirizin", kuerzel: "Cetirizin", ausgeschrieben: "Antihistaminikum gegen Allergien", erklaerung: "Medikament, das allergische Reaktionen dämpft. Wird bei Heuschnupfen und Hautallergie eingesetzt.", kategorie: "allgemein", vordefiniert: true, wirkstoffKlartext: "Allergiemittel" },
];

/** Schnell-Lookup nach Kürzel (case-insensitive). */
export const abkuerzungMap: Record<string, Abkuerzung> = Object.fromEntries(
  vordefinierteAbkuerzungen.map((a) => [a.kuerzel.toLowerCase(), a]),
);

export const KATEGORIE_LABEL: Record<AbkuerzungKategorie, string> = {
  herz: "Herzgesundheit",
  labor: "Laborwerte",
  schlaf: "Schlaf",
  digital: "Digital",
  allgemein: "Allgemein",
  nutzerdefiniert: "Meine Einträge",
};

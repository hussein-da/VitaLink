import type { Angebot } from "@/lib/types";
import type { Lokalisiert, Locale } from "@/i18n/types";

// Lokale Angebote im Ruhrgebiet (illustrativ, plausibel). Im Code als
// beispiel: true markiert; in der UI ohne Beispiel-Kennzeichnung (Block 4).
//
// Zweisprachigkeit (E6): `titel`, `ort` und `traeger` sind Eigennamen bzw.
// Bezeichnungen lokaler Angebote und bleiben in BEIDEN Sprachstaenden
// unveraendert deutsch. Nur `hinweis` ist lokalisiert; die englische Fassung
// traegt jeweils eine knappe Apposition, die den deutschen Namen erklaert.

interface AngebotQuelle extends Omit<Angebot, "hinweis"> {
  hinweis: Lokalisiert;
}

const quellen: AngebotQuelle[] = [
  {
    id: "essen-schlaf-workshop",
    titel: "Schlaf- und Stress-Workshop",
    ort: "Essen",
    traeger: "Gesundheitsamt Essen",
    hinweis: {
      de: "Offenes Präventionsangebot, keine Anmeldung nötig.",
      en: "An open preventive care workshop on sleep and stress, run by the Essen public health office. No sign-up needed.",
    },
    beispiel: true,
  },
  {
    id: "kk-bonus",
    titel: "Bonusprogramm deiner Krankenkasse",
    ort: "ortsunabhängig",
    traeger: "gesetzliche Krankenkasse",
    hinweis: {
      de: "Viele Kassen bezuschussen Präventionskurse oder Wearables. Frag direkt bei deiner Kasse nach.",
      en: "Your statutory health insurer's bonus programme works anywhere in Germany. Many insurers pay towards preventive courses or wearables. Just ask yours.",
    },
    beispiel: true,
  },
  {
    id: "herz-check-ruhr",
    titel: "Herz-Kreislauf-Check",
    ort: "Essen / Bochum",
    traeger: "MVZ Ruhr",
    hinweis: {
      de: "Kurzer Check von Blutdruck und Puls bei einer Hausarztpraxis.",
      en: "A short cardiovascular check of your blood pressure and pulse at a GP practice. MVZ Ruhr is a medical care centre with sites in Essen and Bochum.",
    },
    beispiel: true,
  },
  {
    id: "hausarzt-ansprechen",
    titel: "Hausarztpraxis ansprechen",
    ort: "deine Praxis vor Ort",
    traeger: "Hausarztpraxis",
    hinweis: {
      de: "Impfberatung und Auffrischungen vor einer Reise.",
      en: "Talk to your local GP practice ('Hausarztpraxis') about vaccination advice and boosters before a trip.",
    },
    beispiel: true,
  },
  {
    id: "reisemed-ruhr",
    titel: "Reisemedizinische Beratungsstelle",
    ort: "Ruhrgebiet",
    traeger: "Reisemedizin Ruhr",
    hinweis: {
      de: "Beratung zu empfohlenen Reiseimpfungen je nach Reiseziel.",
      en: "Reisemedizin Ruhr is a travel medicine advice centre in the Ruhr area. It advises on the vaccinations suggested for your destination.",
    },
    beispiel: true,
  },
];

function aufloesen(q: AngebotQuelle, locale: Locale): Angebot {
  return { ...q, hinweis: q.hinweis[locale] };
}

/** Locale-unabhaengige ID-Liste (Referenzen aus hinweise.ts `angebotId`). */
export const angebotIds: string[] = quellen.map((q) => q.id);

export function angeboteFuer(locale: Locale): Angebot[] {
  return quellen.map((q) => aufloesen(q, locale));
}

export function angebotFuer(id: string, locale: Locale): Angebot | undefined {
  const q = quellen.find((x) => x.id === id);
  return q ? aufloesen(q, locale) : undefined;
}

export function angebotMapFuer(locale: Locale): Record<string, Angebot> {
  return Object.fromEntries(angeboteFuer(locale).map((a) => [a.id, a]));
}

/**
 * @deprecated Deutscher Sprachstand als Uebergangsexport, damit bestehende
 * Importe waehrend der Zweisprachigkeits-Migration gueltig bleiben.
 * Neue Aufrufer nutzen `angeboteFuer(locale)` / `angebotMapFuer(locale)`.
 */
export const angebote: Angebot[] = angeboteFuer("de");

/** @deprecated siehe `angebote` — bitte `angebotMapFuer(locale)` verwenden. */
export const angebotMap: Record<string, Angebot> = angebotMapFuer("de");

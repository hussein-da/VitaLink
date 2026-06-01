import type { Angebot } from "@/lib/types";

// Fiktiv-plausible lokale Angebote im Ruhrgebiet. Alles Beispiele, keine echten Adressen.
export const angebote: Angebot[] = [
  {
    id: "essen-schlaf-workshop",
    titel: "Kostenfreier Schlaf- und Stress-Workshop",
    ort: "Essen",
    traeger: "Gesundheitsamt Essen (Beispiel)",
    hinweis: "Offenes Praeventionsangebot, keine Anmeldung noetig. Beispielhafte Darstellung.",
    beispiel: true,
  },
  {
    id: "kk-bonus",
    titel: "Bonusprogramm deiner Krankenkasse",
    ort: "ortsunabhaengig",
    traeger: "gesetzliche Krankenkasse (Beispiel)",
    hinweis:
      "Viele Kassen bezuschussen Praeventionskurse oder Wearables. Frag direkt bei deiner Kasse nach. Beispiel.",
    beispiel: true,
  },
  {
    id: "herz-check-ruhr",
    titel: "Herz-Kreislauf-Check",
    ort: "Essen / Bochum",
    traeger: "MVZ Ruhr (Beispiel)",
    hinweis: "Kurzer Check von Blutdruck und Puls bei einer Hausarztpraxis. Beispielhaftes Angebot.",
    beispiel: true,
  },
  {
    id: "hausarzt-ansprechen",
    titel: "Hausarztpraxis ansprechen",
    ort: "deine Praxis vor Ort",
    traeger: "Hausarztpraxis",
    hinweis: "Impfberatung und Auffrischungen vor einer Reise. Beispielhafte Handlungsoption.",
    beispiel: true,
  },
  {
    id: "reisemed-ruhr",
    titel: "Reisemedizinische Beratungsstelle",
    ort: "Ruhrgebiet",
    traeger: "Reisemedizin Ruhr (Beispiel)",
    hinweis: "Beratung zu empfohlenen Reiseimpfungen je nach Reiseziel. Beispiel.",
    beispiel: true,
  },
];

export const angebotMap: Record<string, Angebot> = Object.fromEntries(
  angebote.map((a) => [a.id, a]),
);

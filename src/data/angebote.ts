import type { Angebot } from "@/lib/types";

// Lokale Angebote im Ruhrgebiet (illustrativ, plausibel). Im Code als
// beispiel: true markiert; in der UI ohne Beispiel-Kennzeichnung (Block 4).
export const angebote: Angebot[] = [
  {
    id: "essen-schlaf-workshop",
    titel: "Schlaf- und Stress-Workshop",
    ort: "Essen",
    traeger: "Gesundheitsamt Essen",
    hinweis: "Offenes Präventionsangebot, keine Anmeldung nötig.",
    beispiel: true,
  },
  {
    id: "kk-bonus",
    titel: "Bonusprogramm deiner Krankenkasse",
    ort: "ortsunabhängig",
    traeger: "gesetzliche Krankenkasse",
    hinweis:
      "Viele Kassen bezuschussen Präventionskurse oder Wearables. Frag direkt bei deiner Kasse nach.",
    beispiel: true,
  },
  {
    id: "herz-check-ruhr",
    titel: "Herz-Kreislauf-Check",
    ort: "Essen / Bochum",
    traeger: "MVZ Ruhr",
    hinweis: "Kurzer Check von Blutdruck und Puls bei einer Hausarztpraxis.",
    beispiel: true,
  },
  {
    id: "hausarzt-ansprechen",
    titel: "Hausarztpraxis ansprechen",
    ort: "deine Praxis vor Ort",
    traeger: "Hausarztpraxis",
    hinweis: "Impfberatung und Auffrischungen vor einer Reise.",
    beispiel: true,
  },
  {
    id: "reisemed-ruhr",
    titel: "Reisemedizinische Beratungsstelle",
    ort: "Ruhrgebiet",
    traeger: "Reisemedizin Ruhr",
    hinweis: "Beratung zu empfohlenen Reiseimpfungen je nach Reiseziel.",
    beispiel: true,
  },
];

export const angebotMap: Record<string, Angebot> = Object.fromEntries(
  angebote.map((a) => [a.id, a]),
);

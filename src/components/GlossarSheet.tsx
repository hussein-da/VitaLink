"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, Plus, Trash2 } from "lucide-react";
import {
  vordefinierteAbkuerzungen,
  KATEGORIE_LABEL,
  type AbkuerzungKategorie,
} from "@/data/abkuerzungen";
import { useNutzerAbkuerzungen } from "@/lib/abkuerzung";
import AddAbkuerzungSheet from "@/components/AddAbkuerzungSheet";

type FilterKat = "alle" | AbkuerzungKategorie;

const FILTER: { id: FilterKat; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "herz", label: "Herz" },
  { id: "labor", label: "Labor" },
  { id: "schlaf", label: "Schlaf" },
  { id: "digital", label: "Digital" },
  { id: "allgemein", label: "Allgemein" },
  { id: "nutzerdefiniert", label: "Meine" },
];

const REIHENFOLGE: AbkuerzungKategorie[] = [
  "herz",
  "labor",
  "schlaf",
  "digital",
  "allgemein",
  "nutzerdefiniert",
];

/** Glossar-Bottom-Sheet (Badge 2.3, Block 6): Suche + Kategorie-Filter + Liste. */
export default function GlossarSheet({ onClose }: { onClose: () => void }) {
  const { eintraege, entfernen } = useNutzerAbkuerzungen();
  const [suche, setSuche] = useState("");
  const [kat, setKat] = useState<FilterKat>("alle");
  const [addOffen, setAddOffen] = useState(false);
  const [loeschKandidat, setLoeschKandidat] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const alle = useMemo(
    () => [
      ...vordefinierteAbkuerzungen,
      ...eintraege.map((e) => ({ ...e, kategorie: "nutzerdefiniert" as const })),
    ],
    [eintraege],
  );

  const gefiltert = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return alle.filter((a) => {
      if (kat !== "alle" && a.kategorie !== kat) return false;
      if (!s) return true;
      return (
        a.kuerzel.toLowerCase().includes(s) ||
        a.ausgeschrieben.toLowerCase().includes(s) ||
        a.erklaerung.toLowerCase().includes(s)
      );
    });
  }, [alle, kat, suche]);

  const gruppen = REIHENFOLGE.map((k) => ({
    kategorie: k,
    items: gefiltert.filter((a) => a.kategorie === k),
  })).filter((g) => g.items.length > 0);

  const bestehendeKuerzel = eintraege.map((e) => e.kuerzel);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label="Abkürzungsverzeichnis"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[90vh] max-w-frame flex-col overflow-hidden rounded-t-[28px] bg-surface pb-safe"
        style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
      >
        {/* Sticky Header */}
        <div className="border-b border-border bg-surface px-4 pt-3">
          <div className="mx-auto mb-3 h-[2px] w-9 rounded-full bg-border-strong" />
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-semibold text-ink">Abkürzungsverzeichnis</p>
            <button type="button" onClick={onClose} aria-label="Schließen" className="tap text-muted">
              <X aria-hidden size={20} />
            </button>
          </div>
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-2.5">
            <Search aria-hidden size={16} className="text-muted" />
            <input
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Abkürzung suchen …"
              className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
            />
          </div>
          <div className="no-scrollbar mb-2 mt-2.5 flex gap-2 overflow-x-auto">
            {FILTER.map((f) => {
              const aktiv = kat === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setKat(f.id)}
                  className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    aktiv ? "bg-cat-travel text-white" : "bg-surface-2 text-muted"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          {gruppen.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Search aria-hidden size={28} className="text-muted" />
              <p className="text-[15px] font-semibold text-ink">Kein Eintrag gefunden</p>
              <p className="text-[13px] text-muted">
                Füge „{suche}" als eigene Abkürzung hinzu.
              </p>
              <button
                type="button"
                onClick={() => setAddOffen(true)}
                className="tap mt-2 rounded-full bg-cat-travel px-4 py-2 text-[13px] font-semibold text-white"
              >
                Hinzufügen
              </button>
            </div>
          ) : (
            gruppen.map((g) => (
              <section key={g.kategorie}>
                <h3 className="px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {KATEGORIE_LABEL[g.kategorie]}
                </h3>
                {g.items.map((a) => {
                  const istNutzer = a.kategorie === "nutzerdefiniert";
                  const loeschen = loeschKandidat === a.id;
                  return (
                    <div key={a.id} className="border-b border-border px-4 py-3 last:border-b-0">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[16px] font-bold text-cat-travel">{a.kuerzel}</span>
                        {istNutzer &&
                          (loeschen ? (
                            <span className="flex items-center gap-2 text-[12px]">
                              <button
                                type="button"
                                onClick={() => {
                                  entfernen(a.id);
                                  setLoeschKandidat(null);
                                }}
                                className="font-semibold text-status-warn"
                              >
                                Entfernen
                              </button>
                              <button
                                type="button"
                                onClick={() => setLoeschKandidat(null)}
                                className="text-muted"
                              >
                                Abbrechen
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setLoeschKandidat(a.id)}
                              aria-label={`${a.kuerzel} entfernen`}
                              className="tap text-muted"
                            >
                              <Trash2 aria-hidden size={14} />
                            </button>
                          ))}
                      </div>
                      <p className="mt-0.5 text-[14px] font-semibold text-ink">{a.ausgeschrieben}</p>
                      {a.erklaerung && (
                        <p className="mt-1 text-[13px] leading-[1.5] text-muted">{a.erklaerung}</p>
                      )}
                    </div>
                  );
                })}
                {g.kategorie === "nutzerdefiniert" && (
                  <button
                    type="button"
                    onClick={() => setAddOffen(true)}
                    className="tap flex w-full items-center gap-2 px-4 py-3.5 text-[15px] font-semibold text-cat-lifestyle"
                  >
                    <Plus aria-hidden size={16} />
                    Eigene Abkürzung hinzufügen
                  </button>
                )}
              </section>
            ))
          )}

          {/* Hinzufügen-Zeile, falls "Meine"-Gruppe leer */}
          {!gruppen.some((g) => g.kategorie === "nutzerdefiniert") && gruppen.length > 0 && (
            <button
              type="button"
              onClick={() => setAddOffen(true)}
              className="tap flex w-full items-center gap-2 border-t border-border px-4 py-3.5 text-[15px] font-semibold text-cat-lifestyle"
            >
              <Plus aria-hidden size={16} />
              Eigene Abkürzung hinzufügen
            </button>
          )}
        </div>
      </div>

      {addOffen && (
        <AddAbkuerzungSheet
          vorbelegung={gruppen.length === 0 ? suche : ""}
          bestehendeKuerzel={bestehendeKuerzel}
          onClose={() => setAddOffen(false)}
          onAdded={() => {
            setAddOffen(false);
            setKat("nutzerdefiniert");
            setSuche("");
          }}
        />
      )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Trash2, BookText } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AddAbkuerzungSheet from "@/components/AddAbkuerzungSheet";
import {
  vordefinierteAbkuerzungen,
  KATEGORIE_LABEL,
  type AbkuerzungKategorie,
} from "@/data/abkuerzungen";
import { useNutzerAbkuerzungen } from "@/lib/abkuerzung";

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

const KAT_FARBE: Record<AbkuerzungKategorie, string> = {
  herz: "text-cat-cardio",
  labor: "text-cat-cardio",
  schlaf: "text-cat-lifestyle",
  digital: "text-cat-travel",
  allgemein: "text-cat-prevention",
  nutzerdefiniert: "text-cat-travel",
};

export default function GlossarPage() {
  const { eintraege, entfernen } = useNutzerAbkuerzungen();
  const [suche, setSuche] = useState("");
  const [kat, setKat] = useState<FilterKat>("alle");
  const [addOffen, setAddOffen] = useState(false);

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

  return (
    <div className="pb-10">
      <AppHeader title="Glossar" back={{ href: "/profil", label: "Profil" }} />

      <div className="px-4 py-5">
        {/* Intro */}
        <div className="mb-4 flex items-start gap-3 rounded-[18px] bg-cat-travel-light p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cat-travel">
            <BookText aria-hidden size={20} className="text-cat-travel-on" />
          </span>
          <p className="text-[13px] leading-[1.5] text-ink">
            Jeder Fachbegriff einfach erklärt. In den Erklärtexten der App sind diese Begriffe
            gestrichelt unterstrichen und direkt antippbar.
          </p>
        </div>

        {/* Suche */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-2.5">
          <Search aria-hidden size={16} className="text-muted" />
          <input
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Begriff suchen …"
            className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        {/* Kategorie-Filter */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTER.map((f) => {
            const aktiv = kat === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setKat(f.id)}
                className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  aktiv ? "bg-cat-travel text-cat-travel-on" : "bg-surface-2 text-muted"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Liste */}
        {gruppen.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <Search aria-hidden size={28} className="text-muted" />
            <p className="text-[15px] font-semibold text-ink">Kein Eintrag gefunden</p>
            <p className="text-[13px] text-muted">Füge „{suche}" als eigene Abkürzung hinzu.</p>
            <button
              type="button"
              onClick={() => setAddOffen(true)}
              className="tap mt-2 rounded-full bg-cat-travel px-4 py-2 text-[13px] font-semibold text-cat-travel-on"
            >
              Hinzufügen
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {gruppen.map((g) => (
              <section key={g.kategorie}>
                <h2 className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
                  {KATEGORIE_LABEL[g.kategorie]}
                </h2>
                <div className="space-y-2.5">
                  {g.items.map((a) => (
                    <div key={a.id} className="rounded-[16px] bg-surface p-4 shadow-card">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`text-[17px] font-bold ${KAT_FARBE[a.kategorie]}`}>
                          {a.kuerzel}
                        </span>
                        {a.kategorie === "nutzerdefiniert" && (
                          <button
                            type="button"
                            onClick={() => entfernen(a.id)}
                            aria-label={`${a.kuerzel} entfernen`}
                            className="tap -m-1 p-1 text-muted"
                          >
                            <Trash2 aria-hidden size={15} />
                          </button>
                        )}
                      </div>
                      <p className="mt-0.5 text-[14px] font-semibold text-ink">{a.ausgeschrieben}</p>
                      {a.erklaerung && (
                        <p className="mt-1 text-[13px] leading-[1.5] text-muted">{a.erklaerung}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Eigene Abkürzung hinzufügen */}
            <button
              type="button"
              onClick={() => setAddOffen(true)}
              className="tap flex w-full items-center justify-center gap-2 rounded-[16px] border border-dashed border-border py-3.5 text-[14px] font-semibold text-cat-lifestyle"
            >
              <Plus aria-hidden size={16} />
              Eigene Abkürzung hinzufügen
            </button>
          </div>
        )}
      </div>

      {addOffen && (
        <AddAbkuerzungSheet
          vorbelegung={gruppen.length === 0 ? suche : ""}
          bestehendeKuerzel={eintraege.map((e) => e.kuerzel)}
          onClose={() => setAddOffen(false)}
          onAdded={() => {
            setAddOffen(false);
            setKat("nutzerdefiniert");
            setSuche("");
          }}
        />
      )}
    </div>
  );
}

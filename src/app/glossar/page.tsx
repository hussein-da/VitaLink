"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Trash2, BookText } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AddAbkuerzungSheet from "@/components/AddAbkuerzungSheet";
import { type AbkuerzungKategorie } from "@/data/abkuerzungen";
import { glossarBegriffeFuer } from "@/lib/glossarEintraege";
import { useNutzerAbkuerzungen } from "@/lib/abkuerzung";
import { useT } from "@/i18n/useT";

type FilterKat = "alle" | AbkuerzungKategorie;

// R3: nur die REIHENFOLGE der Filter ist locale-unabhaengig; die Beschriftungen
// kommen im Render aus dem Woerterbuch, damit ein Sprachwechsel sie erreicht.
const FILTER_IDS: FilterKat[] = [
  "alle",
  "nutzerdefiniert",
  "allgemein",
  "herz",
  "labor",
  "schlaf",
  "digital",
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

function GlossarContent() {
  const { eintraege, entfernen } = useNutzerAbkuerzungen();
  const { t, locale } = useT();
  const zielTerm = useSearchParams().get("term");
  const [suche, setSuche] = useState("");
  const [kat, setKat] = useState<FilterKat>("alle");
  const [addOffen, setAddOffen] = useState(false);

  // Aus einem Erklärtext verlinkt (?term=…): direkt zum Begriff filtern.
  useEffect(() => {
    if (zielTerm) {
      setKat("alle");
      setSuche(zielTerm);
    }
  }, [zielTerm]);

  const alle = useMemo(
    () => [
      ...glossarBegriffeFuer(locale),
      ...eintraege.map((e) => ({ ...e, kategorie: "nutzerdefiniert" as const })),
    ],
    [eintraege, locale],
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

  // Exakter Kürzel-Treffer der aktuellen Suche zuerst — damit ein aus einem
  // Erklärtext verlinkter Begriff (?term=…) genau oben steht, nicht unter
  // verwandten Abkürzungen (z. B. „Cholesterin" über LDL/HDL).
  const sucheLower = suche.trim().toLowerCase();
  const istExakt = (a: { kuerzel: string }) =>
    sucheLower.length > 0 && a.kuerzel.toLowerCase() === sucheLower;

  // F7: innerhalb einer Gruppe zuerst der exakte Kuerzel-Treffer, danach
  // alphabetisch nach der aktiven Sprache. Ohne localeCompare(…, locale) wirkt
  // die Liste im englischen Sprachstand ungeordnet, weil die uebersetzten
  // Fachbegriffe die deutsche Quellreihenfolge nicht mehr abbilden.
  const gruppen = REIHENFOLGE.map((k) => ({
    kategorie: k,
    items: gefiltert
      .filter((a) => a.kategorie === k)
      .sort(
        (a, b) =>
          Number(istExakt(b)) - Number(istExakt(a)) ||
          a.kuerzel.localeCompare(b.kuerzel, locale, { sensitivity: "base" }),
      ),
  }))
    .filter((g) => g.items.length > 0)
    .sort((g1, g2) => Number(g2.items.some(istExakt)) - Number(g1.items.some(istExakt)));

  return (
    <div className="pb-10">
      <AppHeader
        title={t.profileArea.glossaryTitle}
        back={{ href: "/profil", label: t.profileArea.glossaryBackLabel }}
      />

      <div className="px-4 py-5">
        {/* Intro */}
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-cat-travel-light p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cat-travel">
            <BookText aria-hidden size={20} className="text-cat-travel-on" />
          </span>
          <p className="text-[13px] leading-[1.5] text-ink">
            {t.profileArea.glossaryIntro}
          </p>
        </div>

        {/* Suche */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-2.5">
          <Search aria-hidden size={16} className="text-muted" />
          <input
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder={t.profileArea.glossarySearchPlaceholder}
            className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        {/* Kategorie-Filter (horizontal scrollbar; Fade rechts als Hinweis) */}
        <div className="relative mt-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 pr-8">
            {FILTER_IDS.map((id) => {
              const aktiv = kat === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKat(id)}
                  className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    aktiv ? "bg-cat-travel text-cat-travel-on" : "bg-surface-2 text-muted"
                  }`}
                >
                  {t.profileArea.glossaryFilters[id]}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent" />
        </div>

        {/* Liste */}
        {gruppen.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <Search aria-hidden size={28} className="text-muted" />
            <p className="text-[15px] font-semibold text-ink">{t.profileArea.glossaryEmptyTitle}</p>
            <p className="text-[13px] text-muted">{t.profileArea.glossaryEmptyHint(suche)}</p>
            <button
              type="button"
              onClick={() => setAddOffen(true)}
              className="tap mt-2 rounded-full bg-cat-travel px-4 py-2 text-[13px] font-semibold text-cat-travel-on"
            >
              {t.profileArea.glossaryEmptyAddCta}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {gruppen.map((g) => (
              <section key={g.kategorie}>
                <h2 className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
                  {t.profileArea.glossaryCategories[g.kategorie]}
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
                            aria-label={t.profileArea.glossaryRemoveEntryLabel(a.kuerzel)}
                            className="tap -m-1 p-1 text-muted"
                          >
                            <Trash2 aria-hidden size={15} />
                          </button>
                        )}
                      </div>
                      {a.ausgeschrieben && a.ausgeschrieben !== a.kuerzel && (
                        <p className="mt-0.5 text-[14px] font-semibold text-ink">{a.ausgeschrieben}</p>
                      )}
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
              {t.profileArea.glossaryAddOwnCta}
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

export default function GlossarPage() {
  const { t } = useT();
  return (
    <Suspense
      fallback={<div className="px-4 py-5 text-[15px] text-muted">{t.profileArea.glossaryLoading}</div>}
    >
      <GlossarContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { MapPin, Newspaper, CalendarDays, ExternalLink } from "lucide-react";
import { useT } from "@/i18n/useT";

// `id` verweist auf Titel und Quelle im Woerterbuch (t.widgets.ruhr.items),
// `iso` ist das maschinenlesbare Datum — es traegt Sortierung UND Anzeige
// (locale-formatiert: de "7. Juli 2026" / en "7 July 2026"). Die URL bleibt
// unveraendert.
type Eintrag = { id: RuhrId; iso: string; url: string };
type RuhrId =
  | "tiktokStudy"
  | "preventionStudy"
  | "clinicList"
  | "nutritionEvent"
  | "marathon"
  | "muelheimRuns";

// Echte, regionale Links (Prototyp → bewusst fest hinterlegt, nicht gescrapt).
// Alle übrigen App-Daten bleiben synthetisch/kanonisch.
const NEWS: Eintrag[] = [
  {
    id: "tiktokStudy",
    iso: "2026-07-07",
    url: "https://www.evangelisch.de/inhalte/254391/07-04-2026/studie-oft-falschinformationen-ueber-psychische-gesundheit-auf-tiktok",
  },
  {
    id: "preventionStudy",
    iso: "2026-06-25",
    url: "https://www.uni-due.de/med/meldung.php?id=1752",
  },
  {
    id: "clinicList",
    iso: "2026-07-01",
    url: "https://medecon.ruhr/2026/07/stern-klinikliste-2026/",
  },
];

const VERANSTALTUNGEN: Eintrag[] = [
  {
    id: "nutritionEvent",
    iso: "2026-07-28",
    url: "https://medecon.ruhr/termine/fokus-ernaehrung-eine-interprofessionelle-herausforderung/",
  },
  {
    id: "marathon",
    iso: "2026-07-18",
    url: "https://www.runme.de/laufkalender/duisburg/",
  },
  {
    id: "muelheimRuns",
    iso: "2026-07-15",
    url: "https://www.runme.de/laufkalender/muelheim-an-der-ruhr/",
  },
];

// News absteigend (neueste zuerst), Veranstaltungen aufsteigend (nächste zuerst) —
// dynamisch aus dem ISO-Datumsfeld, nicht aus der Listenreihenfolge.
const NEWS_SORTED = [...NEWS].sort((a, b) => b.iso.localeCompare(a.iso));
const VERANSTALTUNGEN_SORTED = [...VERANSTALTUNGEN].sort((a, b) => a.iso.localeCompare(b.iso));

type Reiter = "news" | "veranstaltungen";

export default function RuhrgebietPanel() {
  const [reiter, setReiter] = useState<Reiter>("news");
  const { t, fmt } = useT();
  const rp = t.widgets.ruhr;
  const istNews = reiter === "news";
  const eintraege = istNews ? NEWS_SORTED : VERANSTALTUNGEN_SORTED;

  // Reiter-Beschriftungen in der Render-Ebene (Sprachwechsel).
  const REITER: { id: Reiter; label: string }[] = [
    { id: "news", label: rp.tabNews },
    { id: "veranstaltungen", label: rp.tabEvents },
  ];

  return (
    <section aria-label={rp.sectionTitle} className="mt-3 px-4">
      <h2 className="mb-2.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
        <MapPin aria-hidden size={12} className="text-cat-travel" />
        {rp.sectionTitle}
      </h2>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
        {/* Segment-Umschalter (Optik wie Heute/Woche/Monat) */}
        <div className="px-4 pb-2 pt-3">
          <div role="tablist" aria-label={rp.tabsAria} className="flex gap-1 rounded-full bg-surface-2 p-1">
            {REITER.map((r) => {
              const on = reiter === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setReiter(r.id)}
                  className={`tap flex-1 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    on ? "bg-surface text-ink shadow-sm" : "text-muted"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zeilen des aktiven Reiters */}
        <div>
          {eintraege.map((e, i) => {
            const item = rp.items[e.id];
            return (
            <a
              key={e.url}
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2/50 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${
                  istNews ? "bg-cat-travel-light" : "bg-cat-prevention-light"
                }`}
              >
                {istNews ? (
                  <Newspaper aria-hidden size={17} className="text-cat-travel" />
                ) : (
                  <CalendarDays aria-hidden size={17} className="text-cat-prevention" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-[14px] font-semibold text-ink">{item.title}</span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  {rp.itemMeta(
                    item.source,
                    fmt.date(e.iso, { day: "numeric", month: "long", year: "numeric" }),
                  )}
                </span>
              </span>
              <ExternalLink aria-hidden size={15} className="shrink-0 text-muted" />
            </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ThumbsUp,
  ThumbsDown,
  EyeOff,
  RotateCcw,
  Trash2,
  Pencil,
  Inbox,
  ChevronRight,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import ObjectionDialog from "@/components/ObjectionDialog";
import { useSettings } from "@/context/SettingsContext";
import { hinweisFuer, hinweisIds } from "@/data/hinweise";
import { smartTippMapFuer, alleSmartTippIds } from "@/data/smartTipps";
import { useT } from "@/i18n/useT";
import type { Locale } from "@/i18n/types";
import { objectionReasonLabel } from "@/lib/objections";
import { kategorie } from "@/lib/kategorie";
import type { Szenario } from "@/lib/types";

type Aufgeloest = {
  titel: string;
  szenario: Szenario | null;
  hinweisId: string | null;
  parentTitel?: string;
};

/** Rückmeldungs-ID auflösen: erst konkrete Empfehlung (SmartTipp), dann Hinweis (Altdaten). */
function aufloesen(id: string, locale: Locale): Aufgeloest | null {
  const st = smartTippMapFuer(locale)[id];
  if (st) {
    const h = hinweisFuer(st.hinweisId, locale);
    return {
      titel: st.tipp.titel,
      szenario: h?.szenario ?? null,
      hinweisId: st.hinweisId,
      parentTitel: h?.titel,
    };
  }
  const h = hinweisFuer(id, locale);
  if (h) return { titel: h.titel, szenario: h.szenario, hinweisId: id };
  return null;
}

/**
 * Zeile mit Kategorie-Icon + verlinktem Empfehlungs-Titel. Nur der Titel ist ein
 * Link (→ zur Detailseite); `children` (Meta + Verwalten-Buttons) liegen
 * AUSSERHALB des Anchors.
 */
function EintragZeile({ id, children }: { id: string; children: React.ReactNode }) {
  const { locale } = useT();
  const e = aufloesen(id, locale);
  if (!e) return null;
  const k = e.szenario ? kategorie(e.szenario) : null;
  const Icon = k?.icon;
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${
            k ? k.solid : "bg-surface-2"
          }`}
        >
          {Icon && <Icon aria-hidden size={18} className={k!.on} strokeWidth={2} />}
        </span>
        <div className="min-w-0 flex-1">
          {e.hinweisId ? (
            <Link href={`/hinweis/${e.hinweisId}`} className="flex items-center gap-1">
              <span className="truncate text-[15px] font-semibold text-ink">{e.titel}</span>
              <ChevronRight aria-hidden size={14} className="shrink-0 text-muted" />
            </Link>
          ) : (
            <span className="block truncate text-[15px] font-semibold text-ink">{e.titel}</span>
          )}
          {e.parentTitel && (
            <span className="mt-0.5 block truncate text-[12px] text-muted">in „{e.parentTitel}"</span>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RueckmeldungenPage() {
  const { hydrated, objections, removeObjection, likes, toggleLike, dismissed, restore } =
    useSettings();

  const [editId, setEditId] = useState<string | null>(null);

  // Locale-frei: die Gueltigkeit einer gespeicherten Rueckmeldung darf nicht
  // von der Sprachwahl abhaengen.
  const gueltig = (id: string) => alleSmartTippIds.includes(id) || hinweisIds.includes(id);
  const objectionsGueltig = objections.filter((o) => gueltig(o.hinweisId));
  const likesGueltig = likes.filter(gueltig);
  const dismissedGueltig = dismissed.filter(gueltig);
  const leer =
    objectionsGueltig.length === 0 && likesGueltig.length === 0 && dismissedGueltig.length === 0;

  return (
    <>
      <div className="pb-10">
        <AppHeader title="Meine Rückmeldungen" back={{ href: "/profil", label: "Profil" }} />

        <div className="space-y-7 px-4 py-5">
          <p className="px-1 text-[13px] leading-[1.5] text-muted">
            Hier sammeln sich deine Rückmeldungen zu einzelnen Empfehlungen. Alles bleibt nur auf
            diesem Gerät gespeichert.
          </p>

          {!hydrated ? (
            <p className="px-1 text-[14px] text-muted">Wird geladen …</p>
          ) : leer ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-2 px-4 py-10 text-center">
              <Inbox aria-hidden size={28} className="text-muted" />
              <p className="text-[15px] font-semibold text-ink">Noch keine Rückmeldungen</p>
              <p className="max-w-[16rem] text-[13px] text-muted">
                Öffne eine Analyse und bewerte einzelne Empfehlungen mit 👍, 👎 oder blende sie mit
                „×" aus.
              </p>
              <Link
                href="/vitalink"
                className="tap mt-2 rounded-full bg-cat-lifestyle px-4 py-2 text-[13px] font-semibold text-cat-lifestyle-on"
              >
                Zu deinen Analysen
              </Link>
            </div>
          ) : (
            <>
              {/* ── Widersprochen ── */}
              {objectionsGueltig.length > 0 && (
                <section>
                  <h2 className="section-label mb-2 flex items-center gap-1.5 px-1">
                    <ThumbsDown aria-hidden size={13} className="text-accent-ink" /> Widersprochen ·{" "}
                    {objectionsGueltig.length}
                  </h2>
                  <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
                    {objectionsGueltig.map((o, i) => (
                      <div key={o.hinweisId}>
                        {i > 0 && <div aria-hidden className="ml-[60px] h-px bg-border" />}
                        <EintragZeile id={o.hinweisId}>
                          <span className="mt-1 block text-[12px] leading-[1.4] text-muted">
                            {objectionReasonLabel[o.reason]}
                            {o.freitext ? ` – „${o.freitext}"` : ""}
                          </span>
                          <span className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditId(o.hinweisId)}
                              className="tap inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink"
                            >
                              <Pencil aria-hidden size={12} /> Ändern
                            </button>
                            <button
                              type="button"
                              onClick={() => removeObjection(o.hinweisId)}
                              className="tap inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink"
                            >
                              <Trash2 aria-hidden size={12} /> Entfernen
                            </button>
                          </span>
                        </EintragZeile>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Gemerkt ── */}
              {likesGueltig.length > 0 && (
                <section>
                  <h2 className="section-label mb-2 flex items-center gap-1.5 px-1">
                    <ThumbsUp aria-hidden size={13} className="text-status-ok" /> Gemerkt ·{" "}
                    {likesGueltig.length}
                  </h2>
                  <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
                    {likesGueltig.map((id, i) => (
                      <div key={id}>
                        {i > 0 && <div aria-hidden className="ml-[60px] h-px bg-border" />}
                        <EintragZeile id={id}>
                          <span className="mt-2 inline-flex">
                            <button
                              type="button"
                              onClick={() => toggleLike(id)}
                              className="tap inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink"
                            >
                              <Trash2 aria-hidden size={12} /> Entfernen
                            </button>
                          </span>
                        </EintragZeile>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Ausgeblendet ── */}
              {dismissedGueltig.length > 0 && (
                <section>
                  <h2 className="section-label mb-2 flex items-center gap-1.5 px-1">
                    <EyeOff aria-hidden size={13} className="text-muted" /> Ausgeblendet ·{" "}
                    {dismissedGueltig.length}
                  </h2>
                  <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
                    {dismissedGueltig.map((id, i) => (
                      <div key={id}>
                        {i > 0 && <div aria-hidden className="ml-[60px] h-px bg-border" />}
                        <EintragZeile id={id}>
                          <span className="mt-2 inline-flex">
                            <button
                              type="button"
                              onClick={() => restore(id)}
                              className="tap inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink"
                            >
                              <RotateCcw aria-hidden size={12} /> Wieder einblenden
                            </button>
                          </span>
                        </EintragZeile>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <ObjectionDialog open={editId !== null} onClose={() => setEditId(null)} id={editId ?? ""} />
    </>
  );
}

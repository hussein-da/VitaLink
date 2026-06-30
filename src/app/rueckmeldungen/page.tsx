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
import { hinweisMap } from "@/data/hinweise";
import { objectionReasonLabel } from "@/lib/objections";
import { kategorie } from "@/lib/kategorie";

/**
 * Zeile mit Kategorie-Icon + verlinktem Titel. Nur der Titel ist ein Link;
 * `children` (Meta-Text + Verwalten-Buttons) liegen AUSSERHALB des Anchors,
 * damit keine interaktiven Elemente in einem <a> verschachtelt sind.
 */
function HinweisZeile({ id, children }: { id: string; children: React.ReactNode }) {
  const hinweis = hinweisMap[id];
  if (!hinweis) return null;
  const k = kategorie(hinweis.szenario);
  const Icon = k.icon;
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${k.solid}`}>
          <Icon aria-hidden size={18} className={k.on} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/hinweis/${id}`} className="flex items-center gap-1">
            <span className="truncate text-[15px] font-semibold text-ink">{hinweis.titel}</span>
            <ChevronRight aria-hidden size={14} className="shrink-0 text-muted" />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RueckmeldungenPage() {
  const {
    hydrated,
    objections,
    removeObjection,
    likes,
    toggleLike,
    dismissed,
    restore,
  } = useSettings();

  const [editId, setEditId] = useState<string | null>(null);

  const objectionsGueltig = objections.filter((o) => hinweisMap[o.hinweisId]);
  const likesGueltig = likes.filter((id) => hinweisMap[id]);
  const dismissedGueltig = dismissed.filter((id) => hinweisMap[id]);
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
            <div className="flex flex-col items-center gap-2 rounded-[20px] bg-surface-2 px-4 py-10 text-center">
              <Inbox aria-hidden size={28} className="text-muted" />
              <p className="text-[15px] font-semibold text-ink">Noch keine Rückmeldungen</p>
              <p className="max-w-[16rem] text-[13px] text-muted">
                Merke dir Empfehlungen mit 👍, widersprich mit 👎 oder blende sie mit „×" aus.
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
                  <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
                    {objectionsGueltig.map((o, i) => (
                      <div key={o.hinweisId}>
                        {i > 0 && <div aria-hidden className="ml-[60px] h-px bg-border" />}
                        <HinweisZeile id={o.hinweisId}>
                          <span className="mt-0.5 block text-[12px] leading-[1.4] text-muted">
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
                        </HinweisZeile>
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
                  <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
                    {likesGueltig.map((id, i) => (
                      <div key={id}>
                        {i > 0 && <div aria-hidden className="ml-[60px] h-px bg-border" />}
                        <HinweisZeile id={id}>
                          <span className="mt-2 inline-flex">
                            <button
                              type="button"
                              onClick={() => toggleLike(id)}
                              className="tap inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink"
                            >
                              <Trash2 aria-hidden size={12} /> Entfernen
                            </button>
                          </span>
                        </HinweisZeile>
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
                  <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
                    {dismissedGueltig.map((id, i) => (
                      <div key={id}>
                        {i > 0 && <div aria-hidden className="ml-[60px] h-px bg-border" />}
                        <HinweisZeile id={id}>
                          <span className="mt-2 inline-flex">
                            <button
                              type="button"
                              onClick={() => restore(id)}
                              className="tap inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink"
                            >
                              <RotateCcw aria-hidden size={12} /> Wieder einblenden
                            </button>
                          </span>
                        </HinweisZeile>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <ObjectionDialog
        open={editId !== null}
        onClose={() => setEditId(null)}
        hinweisId={editId ?? ""}
      />
    </>
  );
}

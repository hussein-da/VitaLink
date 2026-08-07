"use client";

import { useRouter } from "next/navigation";
import { FileSearch } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useT } from "@/i18n/useT";

/**
 * Ehrliche Platzhalter-Detailseite (Badge 2.1, Block 2) für Vorsorge-Hinweise,
 * die in der Demo noch keine vollständige Erklärseite haben. Verhindert
 * Fehlnavigation auf fremde Detailseiten.
 */
export default function TerminPlaceholderPage() {
  const router = useRouter();
  const { t } = useT();

  return (
    <div className="pb-10">
      <AppHeader
        title={t.appointments.placeholderHeaderTitle}
        back={{ href: "/termine", label: t.appointments.placeholderBackLabel }}
      />

      <div className="px-4 py-6">
        <div className="rounded-2xl bg-surface px-5 py-8 text-center shadow-card">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
            <FileSearch aria-hidden size={28} className="text-muted" />
          </span>
          <h2 className="text-[17px] font-semibold text-ink">{t.appointments.placeholderTitle}</h2>
          <p className="mx-auto mt-2 max-w-xs px-2 text-[14px] leading-[1.6] text-muted">
            {t.appointments.placeholderBody}
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="tap mt-6 w-full rounded-xl bg-surface-2 px-4 py-3.5 text-[15px] font-semibold text-ink"
          >
            {t.appointments.placeholderBack}
          </button>
        </div>
      </div>
    </div>
  );
}

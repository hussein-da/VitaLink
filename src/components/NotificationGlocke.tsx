"use client";

import { useMemo, useState } from "react";
import { Bell, BellOff, CalendarCheck, Plane, TrendingUp, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/useT";

interface Notif {
  id: string;
  Icon: LucideIcon;
  farbe: string;
  bg: string;
  border: string;
  titel: string;
  text: string;
  zeit: string;
  gelesen: boolean;
}

/**
 * Sprachneutraler Teil der Demo-Benachrichtigungen: Icon, Farben und der
 * Ausgangs-Lesestatus. Die Texte kommen im Render aus dem Wörterbuch, damit
 * ein Sprachwechsel greift.
 */
const NOTIF_STIL = [
  {
    id: "n-zahn",
    Icon: CalendarCheck,
    farbe: "text-cat-prevention",
    bg: "bg-cat-prevention-light",
    border: "border-cat-prevention",
    gelesen: false,
  },
  {
    id: "n-reise",
    Icon: Plane,
    farbe: "text-cat-travel",
    bg: "bg-cat-travel-light",
    border: "border-cat-travel",
    gelesen: false,
  },
  {
    id: "n-analyse",
    Icon: TrendingUp,
    farbe: "text-cat-lifestyle",
    bg: "bg-cat-lifestyle-light",
    border: "border-cat-lifestyle",
    gelesen: true,
  },
] as const;

/** Home-Header: Glocke + Benachrichtigungs-Sheet (Badge 2.6, Block 1, synthetisch). */
export default function NotificationGlocke() {
  const { t, fmt } = useT();
  const [offen, setOffen] = useState(false);
  // Nur der Lesestatus ist Zustand — die Texte werden bei jedem Render neu
  // aus dem Wörterbuch gelesen.
  const [alleGelesen, setAlleGelesen] = useState(false);

  const notifs: Notif[] = useMemo(() => {
    const texte = [
      {
        titel: t.appointments.notificationDentistTitle,
        text: t.appointments.notificationDentistText,
        zeit: t.appointments.notificationTimeToday,
      },
      {
        titel: t.appointments.notificationTravelTitle,
        text: t.appointments.notificationTravelText,
        zeit: t.appointments.notificationTimeYesterday,
      },
      {
        titel: t.appointments.notificationWeeklyTitle,
        text: t.appointments.notificationWeeklyText,
        zeit: fmt.plural(2, t.appointments.notificationTimeDaysAgo),
      },
    ];
    return NOTIF_STIL.map((stil, i) => ({
      ...stil,
      ...texte[i],
      gelesen: alleGelesen || stil.gelesen,
    }));
  }, [t, fmt, alleGelesen]);

  const ungelesen = notifs.some((n) => !n.gelesen);

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        aria-label={t.appointments.notificationsButtonAriaLabel}
        className="tap relative flex h-10 w-10 items-center justify-center rounded-full active:bg-surface-2"
      >
        <Bell aria-hidden size={22} className="text-muted" />
        {ungelesen && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-bg bg-status-warn" />
        )}
      </button>

      {offen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setOffen(false)} aria-hidden />
          <div
            role="dialog"
            aria-label={t.appointments.notificationsDialogAriaLabel}
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[75vh] max-w-frame flex-col overflow-hidden rounded-t-[28px] bg-surface pb-safe"
            style={{ boxShadow: "var(--shadow-lg)", animation: "screen-in 200ms ease-out" }}
          >
            <div className="border-b border-border px-5 pt-3">
              <div className="mx-auto mb-3 h-[2px] w-9 rounded-full bg-border-strong" />
              <div className="flex items-center justify-between pb-3">
                <p className="text-[17px] font-semibold text-ink">
                  {t.appointments.notificationsTitle}
                </p>
                <button
                  type="button"
                  onClick={() => setAlleGelesen(true)}
                  className="tap text-[14px] font-semibold text-cat-lifestyle"
                >
                  {t.appointments.notificationsMarkAllRead}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!ungelesen && notifs.every((n) => n.gelesen) ? (
                <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                  <BellOff aria-hidden size={28} className="text-muted" />
                  <p className="text-[14px] font-semibold text-ink">
                    {t.appointments.notificationsEmpty}
                  </p>
                </div>
              ) : null}
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-5 py-3.5 ${
                    n.gelesen ? "opacity-75" : `border-l-[3px] ${n.border}`
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${n.bg}`}>
                    <n.Icon aria-hidden size={18} className={n.farbe} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink">{n.titel}</p>
                    <p className="mt-0.5 text-[12px] text-muted">{n.text}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{n.zeit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

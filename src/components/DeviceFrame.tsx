import type { ReactNode } from "react";

/**
 * Zentrierter Mobile-Rahmen. Auf breiten Viewports wird die App in einem
 * schlichten Geräterahmen (max. 430px Inhaltsbreite) zentriert dargestellt,
 * damit Desktop-Betrachter dieselbe mobile Ansicht sehen (eisernes Gesetz 3).
 * Auf schmalen Viewports full-bleed.
 */
export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex min-h-dvh w-full max-w-frame flex-col bg-bg sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-border sm:shadow-2xl">
        {children}
      </div>
    </div>
  );
}

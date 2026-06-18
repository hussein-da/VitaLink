import type { ReactNode } from "react";

export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex h-dvh w-full max-w-frame flex-col overflow-hidden bg-bg sm:my-6 sm:h-[calc(100dvh-3rem)] sm:rounded-[2rem] sm:border sm:border-border sm:shadow-2xl">
        {children}
      </div>
    </div>
  );
}

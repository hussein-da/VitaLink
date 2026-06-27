import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * iOS-Settings-Listenzeile: farbiger Icon-Container (32×32), Label,
 * rechts entweder Wert + Chevron oder ein Steuerelement (Toggle).
 * Als Link, Button oder statische Zeile verwendbar. Trennlinien setzt
 * die umgebende Gruppe (eingerückt unter dem Label).
 */
export default function SettingsRow({
  icon,
  iconBg,
  label,
  sublabel,
  value,
  right,
  href,
  onClick,
}: {
  icon: ReactNode;
  /** Soft-Hintergrund des Icon-Containers, z. B. "bg-primary-soft". */
  iconBg: string;
  label: string;
  sublabel?: string;
  value?: string;
  /** Steuerelement rechts (z. B. Switch); ersetzt Wert + Chevron. */
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        {sublabel && <span className="mt-0.5 block text-xs text-muted">{sublabel}</span>}
      </span>
      {right ?? (
        <span className="flex items-center gap-1 text-sm text-muted">
          {value}
          {(href || onClick) && <ChevronRight aria-hidden size={16} />}
        </span>
      )}
    </>
  );

  const base = "flex w-full items-center gap-3 px-4 py-2.5 text-left min-h-[52px]";

  if (href) {
    return (
      <Link href={href} className={`${base} transition-colors hover:bg-surface-2/40`}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} transition-colors hover:bg-surface-2/40`}>
        {inner}
      </button>
    );
  }
  return <div className={base}>{inner}</div>;
}

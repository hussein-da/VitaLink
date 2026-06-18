import Link from "next/link";
import { Home, Settings, Info } from "lucide-react";

/**
 * Dauerhafter Footer auf jedem Screen (eisernes Gesetz 2).
 * Der Mock-/Kein-Medizinprodukt-Hinweis ist nicht wegklickbar und immer sichtbar.
 * Enthält zusätzlich die globale Navigation (Mobile-App ohne sonstige Leiste).
 */
export default function Disclaimer() {
  return (
    <footer className="border-t border-border bg-surface-2/60">
      <nav aria-label="Hauptnavigation" className="flex items-stretch justify-around px-2 py-1">
        <FooterLink href="/dashboard" label="Hinweise" icon={<Home aria-hidden size={20} />} />
        <FooterLink
          href="/einstellungen"
          label="Einstellungen"
          icon={<Settings aria-hidden size={20} />}
        />
        <FooterLink href="/ueber" label="Über" icon={<Info aria-hidden size={20} />} />
      </nav>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="tap flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-sm text-muted hover:text-primary focus-visible:text-primary"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Home, Settings, Info } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Disclaimer() {
  const { appReady } = useSettings();

  if (!appReady) return null;

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

"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { vorname } from "@/data/profile";

/** Klickbarer Profil-Avatar im Home-Header (Badge 2.7): Emoji oder Initiale, → /profil. */
export default function HeaderAvatar() {
  const { avatar } = useSettings();
  return (
    <Link
      href="/profil"
      aria-label="Profil und Konto"
      className="tap flex h-10 w-10 items-center justify-center rounded-full bg-cat-lifestyle-light text-[17px] font-semibold text-cat-lifestyle"
    >
      {avatar || vorname.charAt(0)}
    </Link>
  );
}

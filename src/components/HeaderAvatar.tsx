"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { vorname } from "@/data/profile";
import { useT } from "@/i18n/useT";

/** Klickbarer Profil-Avatar im Home-Header (Badge 2.7): Emoji oder Initiale, → /profil. */
export default function HeaderAvatar() {
  const { avatar } = useSettings();
  const { t } = useT();
  return (
    <Link
      href="/profil"
      aria-label={t.profileArea.headerAvatarLabel}
      className="tap flex h-10 w-10 items-center justify-center rounded-full bg-cat-lifestyle-light text-[17px] font-semibold text-cat-lifestyle ring-2 ring-cat-lifestyle/35 ring-offset-2 ring-offset-bg"
    >
      {avatar || vorname.charAt(0)}
    </Link>
  );
}

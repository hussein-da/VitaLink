"use client";

import type { Language } from "@/context/SettingsContext";

const LANGUAGES: {
  code: Language;
  flag: string;
  name: string;
  hint: string;
  dir?: "rtl";
}[] = [
  { code: "de", flag: "🇩🇪", name: "Deutsch", hint: "Auf Deutsch fortfahren" },
  { code: "en", flag: "🇬🇧", name: "English", hint: "Continue in English" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe", hint: "Türkçe devam et" },
  { code: "ar", flag: "🇸🇦", name: "العربية", hint: "تابع باللغة العربية", dir: "rtl" },
];

interface Props {
  onSelect: (lang: Language) => void;
}

export default function LanguageSelect({ onSelect }: Props) {
  return (
    <div className="flex flex-1 flex-col animate-screen-in">
      <div className="flex flex-1 flex-col justify-center gap-8 px-6 py-10">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Sprache wählen
          </h1>
          <p className="mt-1 text-sm text-muted">
            Choose your language · Dil seçin · اختر لغتك
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map(({ code, flag, name, hint, dir }, idx) => (
            <button
              key={code}
              dir={dir}
              onClick={() => onSelect(code)}
              className="tap animate-lang-btn-in flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-5 text-center shadow-sm transition-colors hover:border-primary/40 hover:bg-primary-soft active:scale-95"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <span className="text-4xl leading-none" role="img" aria-label={name}>
                {flag}
              </span>
              <span className="font-semibold text-ink">{name}</span>
              <span className="text-xs text-muted">{hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

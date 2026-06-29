"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Language } from "@/context/SettingsContext";

const T = {
  de: {
    tagline: "Deine Gesundheit. Klar erklärt.",
    welcome: "Willkommen zurück",
    apple: "Mit Apple anmelden",
    google: "Mit Google anmelden",
    or: "oder",
    user: "Benutzername oder E-Mail",
    pass: "Passwort",
    btn: "Anmelden",
    hint: "Demo: beliebige Anmeldedaten",
    lang: "Sprache",
  },
  en: {
    tagline: "Your health. Clearly explained.",
    welcome: "Welcome back",
    apple: "Continue with Apple",
    google: "Continue with Google",
    or: "or",
    user: "Username or Email",
    pass: "Password",
    btn: "Sign In",
    hint: "Demo: any credentials",
    lang: "Language",
  },
  tr: {
    tagline: "Sağlığın. Net anlatım.",
    welcome: "Tekrar hoş geldiniz",
    apple: "Apple ile giriş yap",
    google: "Google ile giriş yap",
    or: "veya",
    user: "Kullanıcı adı veya E-posta",
    pass: "Şifre",
    btn: "Giriş Yap",
    hint: "Demo: herhangi bir kimlik bilgisi",
    lang: "Dil",
  },
  ar: {
    tagline: "صحتك. موضحة بوضوح.",
    welcome: "مرحباً بعودتك",
    apple: "تابع مع Apple",
    google: "تابع مع Google",
    or: "أو",
    user: "اسم المستخدم أو البريد الإلكتروني",
    pass: "كلمة المرور",
    btn: "تسجيل الدخول",
    hint: "تجريبي: أي بيانات اعتماد",
    lang: "اللغة",
  },
} as const;

const LANGS: { code: Language; flag: string; label: string }[] = [
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "tr", flag: "🇹🇷", label: "TR" },
  { code: "ar", flag: "🇸🇦", label: "AR" },
];

// Demo-Rahmung + Login-Rückmeldung (AUTH-02/07). Persona „Mara K." (Abschnitt 2).
const DEMO_TEXT: Record<Language, { hinweis: string; angemeldet: string }> = {
  de: {
    hinweis: "Demo-Modus — du meldest dich als Beispiel-Person Mara K. an. Anmeldedaten beliebig.",
    angemeldet: "Angemeldet als Mara K.",
  },
  en: {
    hinweis: "Demo mode — you sign in as the sample persona Mara K. Any credentials work.",
    angemeldet: "Signed in as Mara K.",
  },
  tr: {
    hinweis: "Demo modu — örnek kişi Mara K. olarak giriş yaparsın. Herhangi bir bilgi geçerli.",
    angemeldet: "Mara K. olarak giriş yapıldı",
  },
  ar: {
    hinweis: "وضع تجريبي — تسجّل الدخول كشخص نموذجي Mara K. أي بيانات اعتماد صالحة.",
    angemeldet: "تم تسجيل الدخول كـ Mara K.",
  },
};

interface Props {
  onLogin: (lang: Language) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [lang, setLang] = useState<Language>("de");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [angemeldet, setAngemeldet] = useState(false);

  const t = T[lang];
  const demo = DEMO_TEXT[lang];
  const rtl = lang === "ar";

  // Kurze Rückmeldung mit Persona, dann weiter (AUTH-02). Kein echtes Auth.
  const handleLogin = () => {
    if (angemeldet) return;
    setAngemeldet(true);
    setTimeout(() => onLogin(lang), 900);
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="flex flex-1 flex-col overflow-y-auto">
      {/* Hero */}
      <div className="bg-primary px-6 pb-10 pt-12 animate-screen-in">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <ShieldCheck size={26} className="text-white" strokeWidth={1.6} />
            </span>
            <span className="font-display text-3xl font-semibold tracking-tight text-white">
              VitaLink
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-white/65">{t.tagline}</p>
        <h2 className="mt-1 text-center font-display text-2xl font-semibold text-white">
          {t.welcome}
        </h2>
      </div>

      <div
        className="flex flex-1 flex-col justify-between gap-6 px-5 py-6 animate-screen-in"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex flex-col gap-3.5">
          {/* Demo-Rahmung (AUTH-07) */}
          <p className="rounded-xl bg-primary-soft px-3.5 py-2.5 text-center text-[12px] font-medium leading-snug text-primary">
            {demo.hinweis}
          </p>

          {/* Login-Rückmeldung mit Persona (AUTH-02) */}
          {angemeldet && (
            <p
              role="status"
              className="flex items-center justify-center gap-2 rounded-xl bg-status-ok-light px-3.5 py-2.5 text-[13px] font-semibold text-status-ok"
            >
              <CheckCircle2 aria-hidden size={16} />
              {demo.angemeldet}
            </p>
          )}

          {/* Apple — feste dunkle Marken-Flaeche (theme-fest, nicht via --c-ink,
              das im Dark Mode zu Weiss invertiert; CROSS-09). */}
          <button
            onClick={handleLogin}
            className="tap flex w-full items-center justify-center gap-3 rounded-xl bg-black py-3.5 text-base font-semibold text-white"
          >
            <AppleIcon />
            {t.apple}
          </button>

          {/* Google */}
          <button
            onClick={handleLogin}
            className="tap flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface py-3.5 text-base font-semibold text-ink"
          >
            <GoogleIcon />
            {t.google}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted">{t.or}</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.user}
            dir={rtl ? "rtl" : "ltr"}
            className="tap w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.pass}
              dir={rtl ? "rtl" : "ltr"}
              className="tap w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className={`absolute top-1/2 -translate-y-1/2 text-muted ${rtl ? "left-3" : "right-3"}`}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-center text-xs text-muted">{t.hint}</p>

          <button
            onClick={handleLogin}
            disabled={!username}
            className="tap w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-ink disabled:opacity-40"
          >
            {t.btn}
          </button>
        </div>

        {/* Language selector */}
        <div className="border-t border-border pt-4">
          <p className="mb-2.5 text-center text-xs text-muted">{t.lang}</p>
          <div className="flex justify-center gap-2">
            {LANGS.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`tap flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === code
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-muted hover:text-ink"
                }`}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

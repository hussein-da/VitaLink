import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Farben als CSS-Variablen (RGB-Kanaltripel, siehe globals.css). Das
        // <alpha-value>-Pattern laesst Tailwind-Opacity-Modifier (z. B. bg-ink/40)
        // korrekt funktionieren und haelt die Designtokens an einem Ort.
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--c-surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--c-surface-3) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        "ink-2": "rgb(var(--c-ink-2) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        "muted-2": "rgb(var(--c-muted-2) / <alpha-value>)",
        border: "rgb(var(--c-border) / <alpha-value>)",
        "border-strong": "rgb(var(--c-border-strong) / <alpha-value>)",
        focus: "rgb(var(--c-focus) / <alpha-value>)",

        primary: "rgb(var(--c-primary) / <alpha-value>)",
        "primary-on": "rgb(var(--c-primary-on) / <alpha-value>)",

        // Kategorie: Lifestyle (Teal)
        "cat-lifestyle": "rgb(var(--c-cat-lifestyle) / <alpha-value>)",
        "cat-lifestyle-light": "rgb(var(--c-cat-lifestyle-light) / <alpha-value>)",
        "cat-lifestyle-dark": "rgb(var(--c-cat-lifestyle-dark) / <alpha-value>)",
        "cat-lifestyle-on": "rgb(var(--c-cat-lifestyle-on) / <alpha-value>)",
        // Kategorie: Herz-Kreislauf (Rosé-Magenta)
        "cat-cardio": "rgb(var(--c-cat-cardio) / <alpha-value>)",
        "cat-cardio-light": "rgb(var(--c-cat-cardio-light) / <alpha-value>)",
        "cat-cardio-dark": "rgb(var(--c-cat-cardio-dark) / <alpha-value>)",
        "cat-cardio-on": "rgb(var(--c-cat-cardio-on) / <alpha-value>)",
        // Kategorie: Reise (Indigo-Blau)
        "cat-travel": "rgb(var(--c-cat-travel) / <alpha-value>)",
        "cat-travel-light": "rgb(var(--c-cat-travel-light) / <alpha-value>)",
        "cat-travel-dark": "rgb(var(--c-cat-travel-dark) / <alpha-value>)",
        "cat-travel-on": "rgb(var(--c-cat-travel-on) / <alpha-value>)",
        // Kategorie: Prävention / Termine (Violett)
        "cat-prevention": "rgb(var(--c-cat-prevention) / <alpha-value>)",
        "cat-prevention-light": "rgb(var(--c-cat-prevention-light) / <alpha-value>)",
        "cat-prevention-dark": "rgb(var(--c-cat-prevention-dark) / <alpha-value>)",
        "cat-prevention-on": "rgb(var(--c-cat-prevention-on) / <alpha-value>)",
        // Kategorie: Stoffwechsel / Blutzucker (Bernstein-Gold)
        "cat-metabolism": "rgb(var(--c-cat-metabolism) / <alpha-value>)",
        "cat-metabolism-light": "rgb(var(--c-cat-metabolism-light) / <alpha-value>)",
        "cat-metabolism-dark": "rgb(var(--c-cat-metabolism-dark) / <alpha-value>)",
        "cat-metabolism-on": "rgb(var(--c-cat-metabolism-on) / <alpha-value>)",
        // Kategorie: Vitalität / Sonne & Vitamin D (Orange)
        "cat-vitamind": "rgb(var(--c-cat-vitamind) / <alpha-value>)",
        "cat-vitamind-light": "rgb(var(--c-cat-vitamind-light) / <alpha-value>)",
        "cat-vitamind-dark": "rgb(var(--c-cat-vitamind-dark) / <alpha-value>)",
        "cat-vitamind-on": "rgb(var(--c-cat-vitamind-on) / <alpha-value>)",
        // Zukunft / weitere Datenquellen (Violett)
        "cat-future": "rgb(var(--c-cat-future) / <alpha-value>)",
        "cat-future-light": "rgb(var(--c-cat-future-light) / <alpha-value>)",
        "cat-future-on": "rgb(var(--c-cat-future-on) / <alpha-value>)",

        // Semantische Status-Farben
        "status-ok": "rgb(var(--c-status-ok) / <alpha-value>)",
        "status-ok-light": "rgb(var(--c-status-ok-light) / <alpha-value>)",
        "status-warn": "rgb(var(--c-status-warn) / <alpha-value>)",
        "status-warn-light": "rgb(var(--c-status-warn-light) / <alpha-value>)",
        "status-info": "rgb(var(--c-status-info) / <alpha-value>)",
        "status-info-light": "rgb(var(--c-status-info-light) / <alpha-value>)",
        "status-amber": "rgb(var(--c-status-amber) / <alpha-value>)",
        "status-amber-light": "rgb(var(--c-status-amber-light) / <alpha-value>)",

        // Legacy-Aliasse (nicht-redesignte Komponenten)
        "primary-ink": "rgb(var(--c-primary-ink) / <alpha-value>)",
        "primary-bright": "rgb(var(--c-primary-bright) / <alpha-value>)",
        "primary-soft": "rgb(var(--c-primary-soft) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--c-accent-soft) / <alpha-value>)",
        "accent-ink": "rgb(var(--c-accent-ink) / <alpha-value>)",
        "cat-cardio-soft": "rgb(var(--c-cat-cardio-soft) / <alpha-value>)",
        "cat-travel-soft": "rgb(var(--c-cat-travel-soft) / <alpha-value>)",
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        "2xl2": "1.75rem",
      },
      boxShadow: {
        // Token-basierte Tiefe (globals.css). Karten-Abgrenzung ohne Border.
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-card)",
        "card-lg": "var(--shadow-lg)",
      },
      maxWidth: {
        frame: "430px",
      },
      keyframes: {
        "reveal-down": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "splash-in": {
          "0%": { opacity: "0", transform: "scale(0.86)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "splash-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.06)" },
        },
        "heart-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.28)" },
          "65%": { transform: "scale(0.88)" },
        },
        "screen-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "lang-btn-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "nfc-ring": {
          "0%": { transform: "scale(0.3)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "65%": { transform: "scale(1.18)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "toast-drop": {
          "0%": { opacity: "0", transform: "translateY(-20px) scale(0.94)" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "reveal-down": "reveal-down 220ms ease-out",
        "toast-drop": "toast-drop 380ms cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-in": "fade-in 200ms ease-out",
        "splash-in": "splash-in 700ms cubic-bezier(0.16,1,0.3,1) forwards",
        "splash-out": "splash-out 450ms ease-in forwards",
        "heart-pulse": "heart-pulse 950ms ease-in-out infinite",
        "screen-in": "screen-in 380ms cubic-bezier(0.16,1,0.3,1) both",
        "lang-btn-in": "lang-btn-in 360ms cubic-bezier(0.16,1,0.3,1) both",
        "nfc-ring": "nfc-ring 1800ms ease-out infinite",
        "bounce-in": "bounce-in 440ms cubic-bezier(0.34,1.56,0.64,1) both",
        "progress-fill": "progress-fill 900ms ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

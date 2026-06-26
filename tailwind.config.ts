import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
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
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        border: "rgb(var(--c-border) / <alpha-value>)",
        primary: "rgb(var(--c-primary) / <alpha-value>)",
        "primary-ink": "rgb(var(--c-primary-ink) / <alpha-value>)",
        "primary-bright": "rgb(var(--c-primary-bright) / <alpha-value>)",
        "primary-soft": "rgb(var(--c-primary-soft) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--c-accent-soft) / <alpha-value>)",
        "accent-ink": "rgb(var(--c-accent-ink) / <alpha-value>)",
        focus: "rgb(var(--c-focus) / <alpha-value>)",
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        // Weiche, kleine Elevation laut Designvorgabe (§7): kein hartes Aufpoppen.
        card: "0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        "card-lg": "0 2px 8px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
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
      },
      animation: {
        "reveal-down": "reveal-down 220ms ease-out",
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

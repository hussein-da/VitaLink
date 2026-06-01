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
      },
      animation: {
        "reveal-down": "reveal-down 220ms ease-out",
        "fade-in": "fade-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

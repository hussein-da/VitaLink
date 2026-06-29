# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # development server on http://localhost:3000
npm run build    # production build (must pass before every push)
npm run start    # start production build (uses $PORT, defaults to 3000)
npm run lint     # next lint
```

No test suite. Validation is manual: run `npm run build` and check for TypeScript errors.

---

## Architecture

**VitaLink** is a mobile-first Next.js 14 App Router prototype (no backend, no real patient data). All data is static TypeScript in `src/data/` and marked `synthetic: true`. No external APIs. Settings (font scale, theme, disabled sources, objections) are persisted to `localStorage` under the key `vitalink.settings.v1`.

### Routing

| Route | Description |
|---|---|
| `/` | Onboarding / language select |
| `/dashboard` | Home (kuratierte Tagesübersicht) — der **Home**-Tab und das Onboarding-Ziel |
| `/vitalink` | Main insights screen ("Deine Analysen") |
| `/hinweis/[id]` | Insight detail — the core XAI screen |
| `/termine` | Preventive care appointments |
| `/reise` | Travel vaccination planning |
| `/einstellungen` | Settings: data sources, font size, objections |
| `/export` | PDF report builder |
| `/ueber` | About / research context |

Back buttons on subpages point to their origin where known (e.g. `/reise?from=<id>` → the originating hinweis, subpages opened from Settings → `/einstellungen`), otherwise to `/vitalink`.

### Informationsarchitektur (drei Ebenen — eine Hauptquelle je Inhalt)

- **E1 — VitaLink-Hinweise** (`/vitalink`, `/hinweis/[id]`): der erklärbare Forschungskern. Ein Hinweis-Objekt in `hinweise.ts` ist die kanonische Quelle seines Inhalts (3 Erklärvarianten/3 Tiefen/Regler/volle Texte). Reine Terminlisten oder das Länder-Werkzeug gehören NICHT hierher.
- **E2 — Termine** (`/termine`): abgeleitete Aufgaben-/Terminsicht, keine eigene Wahrheit. Jede Zeile verlinkt zurück auf ihren erklärenden Hinweis (oder, wenn kein Hinweis existiert, ist sie nicht-klickbar — nie ein falscher Link).
- **E3 — Reise & Impfung** (`/reise`): exploratives Werkzeug (Länderwahl → Status). Nur die geplante Reise (Thailand, `epa.ts geplanteReise`) wird zu einem Termin.

`/dashboard` (Home) und `/vitalink` (Analysen) haben getrennte Rollen: Home = kuratierte Tagesübersicht mit CTAs, /vitalink = die vollständige, erklärbare Analysenliste.

### Layout shell (`src/app/layout.tsx`)

Every screen is wrapped in:
- `SettingsProvider` — global settings context
- `DeviceFrame` — centers the 430px-max mobile frame on desktop
- `Disclaimer` — bottom navigation bar (also the persistent footer)

The `Disclaimer` component (`src/components/Disclaimer.tsx`) is the bottom tab bar with four tabs: Home (`/dashboard`), VitaLink (`/vitalink`), Termine (`/termine`), Einstellungen (`/einstellungen`). Active-state logic uses `usePathname()`. To make a tab active on subpages, extend the `active` condition (e.g., `pathname.startsWith('/hinweise/')`).

### Data layer (`src/data/`)

| File | Contents |
|---|---|
| `hinweise.ts` | All `Hinweis` objects — insight cards (exported as `hinweisMap` and `hinweiseSortiert`) |
| `smartTipps.ts` | Smart recommendation cards per hinweis id |
| `epa.ts` | Synthetic ePA entries (FHIR-R5-adjacent) |
| `wearable.ts` | Synthetic wearable streams + weekly summary data |
| `termine.ts` | Preventive care appointments |
| `reise.ts` | Travel destination / vaccination logic |
| `laender.ts` | Country → required vaccinations mapping |
| `glossar.ts` | B1-level glossary terms (used by `GlossarTerm`) |
| `angebote.ts` | Local Ruhrgebiet action offers |
| `exportKategorien.ts` | Export report categories |
| `profile.ts` | Synthetic user profile ("Mara K.") |

### Key types (`src/lib/types.ts`)

`Hinweis` is the central data type — every insight card has `id`, `szenario`, `titel`, `kurz`, `faktoren[]`, `kontrafaktisch?`, `genutzteQuellen: DataSourceKey[]`, `datengrundlage?`, and `synthetic: true`.

`Szenario` values: `"lifestyle" | "kardiometabolisch" | "reise" | "stoffwechsel" | "vorsorge"`

`DataSourceKey` values control DF11 data-source toggles. A disabled source causes its dependent `Hinweis` cards to show a degraded warning instead of content.

### Category system (`src/lib/kategorie.ts`)

`kategorie(szenario)` returns a `KategorieIdentitaet` with Tailwind class strings (`text`, `soft`, `solid`, `on`, `iconBg`) and a lucide `icon`. **Always use this function** to colour scenario-specific UI — never hardcode category colours inline.

Category mapping:
- `lifestyle` → Teal (`cat-lifestyle`)
- `kardiometabolisch` → Rosé-Magenta (`cat-cardio`)
- `reise` → Indigo-Blue (`cat-travel`)
- `stoffwechsel` → Teal (`cat-lifestyle`)
- `vorsorge` → Violet (`cat-prevention`)

### Design tokens (`src/app/globals.css`)

All colours are CSS-variable RGB triplets (`--c-*`) referenced in `tailwind.config.ts` via the `rgb(var(...) / <alpha-value>)` pattern. This enables Tailwind opacity modifiers like `bg-cat-lifestyle/20`. Light and dark themes are set via `data-theme="light|dark"` on `<html>` — set by a blocking inline script in `layout.tsx` before first paint to avoid flash.

Key layout classes from `globals.css`:
- `.tap` — enforces 44×44 px minimum tap target (required on all interactive elements)
- `.section-label` — small-caps section heading style
- `.pb-safe` / `.pt-safe` — safe-area insets for notch/home-indicator devices
- `.no-scrollbar` — hides scrollbars on horizontal scroll rows

### `SettingsContext` (`src/context/SettingsContext.tsx`)

Single context that manages: `fontScale`, `theme`, `disabledSources` (DF11), `objections` (DF12), `language`. Access via `useSettings()`. All values are persisted to localStorage except `language` (resets on each session so the demo always prompts for language).

Dark mode is driven by `data-fontscale` on `<html>` (toggled by `SettingsContext`) and `data-theme` on `<html>`.

### Header components

- **`AppHeader`** (`src/components/AppHeader.tsx`) — sticky thin header for list/settings screens. Takes optional `back`, `eyebrow`, `right` props.
- **`DetailHeader`** (`src/components/DetailHeader.tsx`) — tall coloured hero for insight detail screens. Category badge is absolutely positioned top-right; back button top-left — both using `style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}`.

### XAI variants (insight detail)

The insight detail screen (`/hinweis/[id]`) supports three explanation modes switchable via `XaiVariantSwitch`:
- **A** — plain-language (`kurz` field)
- **B** — `FactorBars` visualising weighted `faktoren[]`
- **C** — `CounterfactualSlider` with live `wirkung()` callback from `kontrafaktisch`

### Deployment

Push to `main` → Railway deploys automatically. The start command must be `next start -p ${PORT:-3000}` (Railway injects `$PORT`).

---

## Non-negotiable constraints (from project brief)

1. **Synthetic data only.** Every data object carries `synthetic: true`. No real patient records, no real API endpoints.
2. **Not a medical product.** The disclaimer must remain on every screen. Never remove or hide the footer.
3. **Mobile-first, 390px reference width.** No desktop-specific layouts. `max-w-frame` (430px) wraps content for desktop viewers.
4. **No Alarmrot.** Never use red as a status/alert surface colour. Use `status-warn` (orange) for attention.
5. **WCAG 2.2 AA contrast** on all text. The token comments in `globals.css` document measured ratios — check them when adding new colour combinations.

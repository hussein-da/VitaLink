# VorSicht

**Erklaerbare, nutzergerechte Vorsorge-Hinweise aus synthetischen Gesundheitsdaten.**

VorSicht ist ein mobile-first Forschungs-Demonstrator (Design Science Research) fuer das
Modul *Menschzentrierte Technikentwicklung fuer eine digitale Gesellschaft*, Master HCI,
Hochschule Ruhr West, SoSe 2026. Die App zeigt fiktiven Nutzenden aus **rein synthetischen**
Daten erklaerbare Vorsorge-Hinweise: transparent begruendet, in der Tiefe einstellbar,
quellenbelegt, alterszugaenglich, nicht-alarmistisch und vollstaendig nutzerkontrolliert.

> **Demonstrator mit fiktiven Daten. Kein Medizinprodukt. Keine medizinische Beratung.**

---

## Schnellstart (lokal)

Voraussetzung: Node.js 20+.

```bash
npm install
npm run dev      # Entwicklung auf http://localhost:3000
```

Produktions-Build pruefen:

```bash
npm run build
npm run start    # startet auf Port $PORT (Default 3000)
```

Die App ist mobile-first. Am Desktop wird die mobile Ansicht zentriert in einem
Geraeterahmen (max. 430px) dargestellt - oeffne sie idealerweise im Smartphone-Browser
oder in der Geraete-Emulation der Browser-DevTools (Referenz: 390px Breite).

---

## Was die App enthaelt

| Bereich | Inhalt |
|---|---|
| **Onboarding** (`/`) | Willkommen, Mock-Hinweis, erste Datenkontrolle (ePA/Wearable), Start |
| **Dashboard** (`/dashboard`) | Hinweis-Karten aller drei Szenarien (Lifestyle als Hauptpfad) |
| **Hinweis-Detail** (`/hinweis/[id]`) | Herzstueck: 3 XAI-Varianten, 3 Erklaertiefen, Datenherkunft, Aktionen, Widerspruch |
| **Einstellungen** (`/einstellungen`) | Datenkontrolle pro Quelle, Schriftgroesse, Widersprueche-Uebersicht |
| **Ueber** (`/ueber`) | Forschungskontext, Mock-Daten, Wearable-Definition |

Drei XAI-Erklaervarianten (umschaltbar je Hinweis):

- **A - In Worten:** ein erklaerender Klartext-Satz.
- **B - Visuell:** Einflussfaktoren als gewichtete Balken.
- **C - Was waere, wenn:** kontrafaktischer Regler, der den Wirkungstext live aendert.

Alle Daten liegen synthetisch unter [`src/data/`](src/data/) und sind als `synthetic: true`
markiert. Es gibt kein Backend und keine externe API. Einstellungen werden nur lokal im
`localStorage` des Geraets gehalten.

---

## Projektstruktur (Kurz)

```
src/
  app/            Screens (App Router): page, dashboard, hinweis/[id], einstellungen, ueber
  components/     UI-Komponenten (DeviceFrame, Disclaimer, XaiVariantSwitch, ...)
  context/        SettingsContext (Schriftgroesse, Datenquellen, Widersprueche)
  data/           synthetische Daten (profile, epa, wearable, hinweise, glossar, angebote)
  lib/            types.ts, featureMap.ts (DF -> Komponente), dataSources.ts
```

Die explizite Zuordnung Design-Feature -> Komponente -> Akzeptanzkriterium steht in
[`src/lib/featureMap.ts`](src/lib/featureMap.ts). Den Bau- und Verifikationsstand
dokumentiert [BUILD_REPORT.md](BUILD_REPORT.md).

---

## Deployment auf Railway

Ziel: eine oeffentliche URL, die jede Testperson ohne Login im Handy-Browser oeffnet.

1. Sicherstellen, dass `npm run build` und `npm run start` lokal laufen.
2. Git-Repo committen und zu GitHub pushen.
3. Auf [railway.app](https://railway.app) ein neues Projekt anlegen:
   **New Project -> Deploy from GitHub Repo** (oder via Railway CLI: `railway up`).
4. Railway erkennt Next.js automatisch. Falls noetig manuell setzen:
   - Build-Command: `npm run build`
   - Start-Command: `npm run start`
   - Node-Version: 20+
5. Der Start-Command nutzt `next start -p ${PORT:-3000}`; Railway setzt `PORT` selbst -
   keine weitere Konfiguration noetig.
6. Unter **Settings -> Networking -> Generate Domain** die oeffentliche URL erzeugen.
7. URL auf einem echten Smartphone testen - das ist der Artefakt-Link fuer die Evaluation.

---

## Barrierefreiheit (Teil der Forschung, RQ2)

- Schrift ab 16px Basis (nie unter 14px fuer Inhaltstext), global vergroesserbar (DF7).
- Alle Text/Hintergrund-Kombinationen >= 4.5:1 (WCAG 2.2 AA, real geprueft).
- Interaktive Elemente >= 44x44px, sichtbarer Tastatur-Fokus.
- `prefers-reduced-motion` wird respektiert.

---

## PWA

Eine `manifest.json` und ein App-Icon liegen unter [`public/`](public/), damit
"Zum Startbildschirm hinzufuegen" funktioniert. Ein Service Worker wurde bewusst
weggelassen, um Caching-Verwirrung im Evaluationskontext zu vermeiden (siehe BUILD_REPORT).

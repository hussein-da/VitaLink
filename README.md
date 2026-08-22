# VitaLink

Erklärbare Vorsorge-Hinweise aus kombinierten ePA- und Wearable-Daten.
Forschungsprototyp im Modul *Menschzentrierte Technikentwicklung für eine digitale Gesellschaft* (Master HCI, Hochschule Ruhr West, SoSe 2026, Team 1), entwickelt nach dem echeloned-Design-Science-Research-Ansatz.

> **Demonstrator mit ausschließlich synthetischen Daten. Kein Medizinprodukt, keine medizinische Beratung.**

Live-Version: https://vitalink-production-f0cd.up.railway.app

## Code beziehen

Entweder das der Abgabe beiliegende ZIP entpacken oder das Repository klonen:

```bash
git clone https://github.com/hussein-da/VitaLink.git
cd VitaLink
```

## Lokal starten

Voraussetzung ist Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Danach ist die App unter http://localhost:3000 erreichbar. Ein Produktions-Build lässt sich mit `npm run build` und `npm run start` prüfen. Die App ist mobile-first: am Desktop erscheint die mobile Ansicht zentriert in einem Geräterahmen; am besten wirkt sie im Smartphone-Browser oder in der Geräte-Emulation der Browser-DevTools (Referenzbreite 390 px).

## Rundgang (evaluierter Stand, Juli 2026)

Nach einem Onboarding, das das Verbinden von elektronischer Patientenakte und Wearable simuliert, führt der Weg auf ein Dashboard mit aktuellen Werten und regionalen Vorsorgeinhalten, von dort in die Übersicht der sechs Analysen und in das Empfehlungsdetail, die zentrale Erklärfläche. Dort stehen die Erklärbereiche als parallele Abschnitte untereinander statt hinter einem Varianten-Umschalter: die wortbasierte Empfehlung mit Handlungszeile, die Datengrundlage mit Herkunftsangabe je Wert, die Herleitung „Wie VitaLink zu diesen Empfehlungen kommt“ und der Was-wäre-wenn-Bereich mit kontrafaktischem Regler; beim reinen Vorsorge-Hinweis entfallen die letzten beiden zugunsten passender ePA-Termine. In den Einstellungen liegen neun granulare Datenquellen-Schalter (vier ePA-Kategorien, fünf Wearable-Streams) sowie die Übersicht der Widersprüche; jeder Empfehlung kann mit Begründung widersprochen werden. Vollständig ausgebaut ist die Oberfläche auf Deutsch und Englisch; umgeschaltet wird beim Einstieg oder in den Einstellungen, wo zusätzlich Türkisch und Arabisch wählbar sind (dort ist nur der Einstieg übersetzt, der Rest erscheint im englischen Sprachstand). Die Evaluation fand auf der deutschen Oberfläche statt.

## Umsetzungsstand

Der Status jedes Design-Features im evaluierten Build ist offen dokumentiert: sechs Features vollständig implementiert, vier teilweise, zwei ohne Rendering-Pfad (die gewichteten Faktor-Balken und das dreistufige Erklär-Panel). Details stehen in Tabelle 1 des zugehörigen Papers; die Zuordnung von Design-Features zu Komponenten und Akzeptanzkriterien liegt in [`src/lib/featureMap.ts`](src/lib/featureMap.ts). Weitere Entwicklungsdokumentation liegt unter [`docs/`](docs/).

## Projektstruktur

```
src/
  app/          14 Routen (Next.js App Router): Onboarding, Dashboard, Analysen,
                Empfehlungsdetail, Einstellungen, Glossar, Termine, Reise u. a.
  components/   UI-Komponenten
  context/      SettingsContext (Sprache, Anzeigemodus, Schriftgröße,
                Datenquellen, Widersprüche, Rückmeldungen)
  data/         synthetische Daten (Profil, ePA, Wearable, Empfehlungen, Glossar, Angebote)
  i18n/         Sprachstände Deutsch/Englisch
  lib/          Typen, Design-Feature-Map, Datenquellen-Registry, Kategorien,
                Normwerte, Widerspruchsgründe
  utils/        Text-Helfer (Hervorhebung von Messwerten im Fließtext)
```

Alle Daten liegen synthetisch unter `src/data/` und sind als `synthetic: true` markiert. Es gibt kein Backend und keine externe API; Einstellungen liegen nur im lokalen Speicher des Browsers. Technischer Stack: Next.js 14, React 18, TypeScript, Tailwind CSS.

## Deployment-Hinweis

Die Live-Instanz läuft auf Railway mit dem Next.js-Standard-Build; die Plattform setzt den Port selbst. Für Begutachtung und lokale Nutzung ist kein Deployment nötig, `npm run dev` genügt.

## Lizenz

MIT, siehe [`LICENSE`](LICENSE).

## Kontext

Begleitrepository zum Paper *Designing and Evaluating Explainable Preventive Health Recommendations through User-Controlled Integration of Electronic Health Record and Wearable Data* (Team 1, MTG SoSe 2026, Hochschule Ruhr West). Die App diente als Artefakt der formativen Think-Aloud-Evaluation mit zwölf Teilnehmenden.

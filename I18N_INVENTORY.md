# I18N_INVENTORY — Phase 1: Ist-Zustand der Internationalisierung

Erhebungsstand: `main` @ `eadec16`, Baseline-Build grün (23 Seiten, 6 SSG-Pfade für `/hinweis/[id]`).
Reine Leseanalyse. **Es wurde keine Datei der Anwendung geändert.**

Grundlage der Zahlen ist ein eigens geschriebener Scanner (Kommentar-Stripping, tiefenkorrektes
Entfernen von `{…}`-Interpolationen, Positiv-/Negativlisten gegen Tailwind-Klassen, CSS-Werte,
Pfade, URLs und Identifier), stichprobenartig gegen den Quelltext verifiziert. Restunsicherheit
ca. ±5 %.

---

## 0. Kernbefund in drei Sätzen

Die Anwendung enthält **1.377 übersetzungspflichtige Zeichenketten mit ca. 47.700 Zeichen
Textvolumen, verteilt auf 73 Dateien**; weitere 529 Zeichenketten sind bereits zweisprachig
vorhanden. Es existieren **sechs** voneinander unabhängige Ad-hoc-Übersetzungsansätze (nicht vier),
von denen keiner mehr als einen Screen abdeckt. Zwei Prämissen des Auftrags treffen auf den
aktuellen Code nicht zu und werden in Abschnitt 1 belegt korrigiert.

---

## 1. Abweichungen von den Auftragsprämissen (vor Migrationsbeginn zu klären)

### 1.1 Die Sprache wird bereits persistiert (betrifft E2)

Der Auftrag beschreibt unter E2 die Persistenz als herzustellen und verweist auf einen
Persistier-Effekt, „aus dem `language` heute ausdrücklich ausgeschlossen ist". **Das trifft nicht
zu.** `language` ist bereits vollständig verdrahtet:

| Stelle | Datei:Zeile | Inhalt |
|---|---|---|
| Feld im Persistenz-Schema | `src/context/SettingsContext.tsx:100` | `language: Language;` in `PersistShape` |
| Schreiben in den Payload | `src/context/SettingsContext.tsx:195` | `language` im `payload`-Objekt |
| Effekt-Abhängigkeit | `src/context/SettingsContext.tsx:201` | `language` in der Dependency-Liste |
| Defensives Lesen | `src/context/SettingsContext.tsx:142-149` | Validierung gegen alle vier Codes |

Eingeführt wurde das mit Commit `26468d8` („i18n-Geruest — Sprachwahl wirkt global via setLanguage
+ persistiert").

**Irreführend sind ausschließlich die Kommentare und die Projektdoku**, die weiterhin das Gegenteil
behaupten:
- `src/context/SettingsContext.tsx:43` — „Sprache (nur Session, nicht persistiert – damit Demo immer fragt)"
- `src/context/SettingsContext.tsx:182` — „Persistieren, sobald hydratisiert (ohne language – Demo zeigt immer Sprachauswahl)."
- `CLAUDE.md:102` — „All values are persisted to localStorage except `language`"

Von E2 verbleibt damit real: die Kommentare durch die neue Entscheidung ersetzen und die
Abwärtskompatibilität prüfen (Validierung existiert bereits und ist defensiv, `:142-149`).

### 1.2 Der Sprachumschalter der Einstellungsseite ist keine Attrappe (betrifft 4.4)

Der Auftrag beschreibt unter 4.4 einen Umschalter, der „seinen Zustand in lokalem Component-State
hält und beim Unmount auf Deutsch zurücksetzt", und fordert, diesen State und den Reset-Effekt zu
entfernen. **In `src/app/einstellungen/page.tsx` existiert beides nicht.**

- `grep -n 'useEffect' src/app/einstellungen/page.tsx` → **0 Treffer**; `useEffect` ist nicht einmal
  importiert (`:3` lautet `import { useState, type ReactNode } from "react";`). Die Datei enthält
  keinen einzigen Effekt, folglich keinen Unmount-Cleanup.
- Die beiden `useState`-Aufrufe sind sprachfremd: `:101` `sprachBlattOffen` (Sheet-Sichtbarkeit),
  `:102-104` `pendingDisable` (Bestätigungsdialog Datenquellen).
- Sprache kommt ausschließlich aus dem Context: gelesen `:124` und `:381`, geschrieben `:368`
  (`setLanguage(code)`).

**Das beschriebene Reset-Verhalten existiert tatsächlich — aber an anderer Stelle**, und es ist
gravierender als im Auftrag angenommen:

| Stelle | Datei:Zeile | Wirkung |
|---|---|---|
| Lokaler Sprach-State, startet immer bei `"de"` | `src/components/LoginPage.tsx:91` | `const [lang, setLang] = useState<Language>("de")` — liest die gespeicherte Sprache nicht |
| Selbstübersetzung aus lokalem State | `src/components/LoginPage.tsx:97-98` | `T[lang]`, `DEMO_TEXT[lang]` |
| Übergabe nach oben beim Login-Klick | `src/components/LoginPage.tsx:105` | `setTimeout(() => onLogin(lang), 900)` |
| Überschreiben des Contexts | `src/app/page.tsx:24` | `setLanguage(lang)` |

**Konsequenz (Datenverlust-Pfad):** Wer in den Einstellungen Englisch wählt und danach `/` aufruft,
sieht den Login auf Deutsch mit DE-markiertem Umschalter; ein Klick auf „Anmelden" ruft
`onLogin("de")` und **überschreibt die persistierte Sprachwahl auf Deutsch**. Das ist der eigentliche
Defekt, den 4.4 adressieren wollte. Er ist bei der Umsetzung von E3 mitzulösen (E3 verlangt ohnehin,
dass die gespeicherte Sprache auf dem Auswahl-Screen als aktiv markiert erscheint).

### 1.3 Es sind sechs Ansätze, nicht vier (betrifft F10)

Siehe Abschnitt 5. Zusätzlich zu den vier im Auftrag genannten existieren:
- `src/lib/dataSources.ts:81` — Funktion, die ein `{de,en}`-Paar zurückgibt; der Aufrufer indiziert selbst.
- `src/data/reise.ts:210` — Funktion mit `lang`-Parameter und Default `"de"`; **beide** realen
  Aufrufer (`src/app/dashboard/page.tsx:54`, `src/data/termine.ts:81`) übergeben nichts und
  bekommen still Deutsch.

### 1.4 Zwei weitere eingefrorene Daten weichen von der kanonischen Quelle ab (betrifft F12)

`src/lib/zeit.ts:8` ist die dokumentierte einzige „Heute"-Quelle (`SZENARIO_HEUTE`, 29.06.2026).
Davon weichen ab:
- `src/app/dashboard/page.tsx:48` — friert ein **zweites, anderes** Datum ein (`new Date(2026, 6, 14, 14, 0, 0)`, 14.07.2026) für die Begrüßung.
- `src/lib/insightMoment.ts:33` — nutzt **echte Systemzeit**.

Das ist ein Bestandsbefund, kein i18n-Problem. Gemäß L4 wird es nicht nebenbei geändert, aber bei
der Datumslokalisierung ist es zu beachten, damit nicht versehentlich vereinheitlicht wird.

---

## 2. Gesamtumfang

**1.377 Zeichenketten · ca. 47.705 Zeichen · 73 Dateien mit Text** (von 99 untersuchten).

| Bereich | Dateien | mit Text | JSX-Text | Attribute | String-Literale | Summe | Zeichen |
|---|---:|---:|---:|---:|---:|---:|---:|
| `src/app` | 16 | 14 | 103 | 31 | 164 | **298** | 7.040 |
| `src/components` | 56 | 36 | 90 | 33 | 117 | **240** | 5.148 |
| `src/context` | 1 | 1 | 0 | 0 | 2 | **2** | 73 |
| `src/utils` | 1 | 1 | 0 | 0 | 9 | **9** | 52 |
| **UI-Chrome gesamt** | **74** | **52** | **193** | **64** | **292** | **549** | **12.313** |
| `src/data` | 12 | 10 | 0 | 0 | 692 | **692** | 31.670 |
| `src/lib` | 13 | 11 | 2 | 0 | 134 | **136** | 3.722 |
| **Inhaltstext gesamt** | **25** | **21** | **2** | **0** | **826** | **828** | **35.392** |
| **GESAMT** | **99** | **73** | **195** | **64** | **1.118** | **1.377** | **47.705** |

Längenverteilung Inhaltstext: 612 kurze Labels (≤40 Z., 8.660 Zeichen), 159 mittlere (41–120 Z.,
12.070 Zeichen), **57 lange Fließtextabsätze (>120 Z., 12.465 Zeichen)**. Der Aufwand konzentriert
sich: 7 % der Strings tragen 35 % des Textvolumens.

Größte Einzelposten:

| Datei | Strings | Zeichen | davon >120 Z. |
|---|---:|---:|---:|
| `src/data/hinweise.ts` | 187 | 11.792 | 25 |
| `src/data/exportKategorien.ts` | 116 | 2.529 | 0 |
| `src/data/smartTipps.ts` | 107 | 6.143 | 14 |
| `src/data/abkuerzungen.ts` | 83 | 4.174 | 4 |
| `src/data/epa.ts` | 55 | 1.341 | 0 |
| `src/lib/datenherkunft.ts` | 46 | 908 | 0 |
| `src/data/wearable.ts` | 45 | 621 | 0 |
| `src/data/glossar.ts` | 37 | 2.919 | 12 |
| `src/data/termine.ts` | 36 | 1.468 | 2 |

### Bereits lokalisierter Bestand (529 Strings, kein Übersetzungsaufwand)

| Datei | Strings | Mechanismus |
|---|---:|---|
| `src/data/laender.ts` | 386 | 193 UN-Staaten als `{ code, de, en }` (`:5-11`) |
| `src/components/AnimatedIntro.tsx` | 45 | `Record<Language, …>` — **alle vier Sprachen** |
| `src/app/reise/page.tsx` | 40 | `UI`-Objekt `satisfies Record<string, Lokalisiert>` (`:70`) |
| `src/components/LoginPage.tsx` | 39 | `T` / `DEMO_TEXT` — **alle vier Sprachen** |
| `src/data/reise.ts` | 34 | `Lokalisiert`-Typ (`:8`) |
| `src/lib/dataSources.ts` | 3 | nur 3 von 29 Feldern zweisprachig; **22 weiterhin deutsch** (`:15-64`) |

---

## 3. Routen

Alle 15 Route-Dateien. In `src/app/` existieren **keine** `loading.tsx`, `error.tsx`,
`not-found.tsx`, `template.tsx` — Lade-, Fehler- und 404-Zustände sind Next.js-Defaults und
enthalten daher keine deutschen Strings, bieten aber auch keine Stelle für sprachabhängige Ausgabe.

| Route | Datei | Typ | Textstellen | Besondere Fallstricke |
|---|---|---|---:|---|
| — | `app/layout.tsx` | **Server** | 5 | `metadata` deutsch (`:16-18`); `<html lang="de">` hart (`:40`); Init-Skript liest nur `theme` (`:36`); Font ohne `arabic`-Subset (`:9-13`) |
| `/` | `app/page.tsx` | Client | 0 | Einziger Schreibpunkt `setLanguage` (`:24`) — überschreibt persistierte Wahl (1.2) |
| `/dashboard` | `app/dashboard/page.tsx` | **Server** | 46 | `GRID`-Konstante mit `de-DE` auf **Modulebene** (`:30-40`); 2. eingefrorenes Datum (`:48`); Plurale ohne Singular (`:104`, `:181`); degradiert bei DF11 nicht |
| `/vitalink` | `app/vitalink/page.tsx` | Client | 20 | `STAND_DATUM` `de-DE` auf **Modulebene** (`:12`); Sortierung nach Szenario (`:83`) |
| `/hinweis/[id]` | `app/hinweis/[id]/page.tsx` | **Server** | 0 | `generateStaticParams()` (`:4-6`) — Server-Status muss erhalten bleiben |
| `/hinweis/[id]` | `…/HinweisDetail.tsx` | Client | ca. 121 Z. | Einziger Inline-Ternary (`:46-50`); „Hinweis nicht gefunden" (`:56-60`); textreichste Detailseite |
| `/termine` | `app/termine/page.tsx` | Client | hoch | Toast mit deutschen Anführungszeichen (`:56`) |
| `/termine/placeholder` | `app/termine/placeholder/page.tsx` | Client | niedrig | — |
| `/reise` | `app/reise/page.tsx` | Client | 40 lokalisiert | **Vorbild**; Rest: `„Lädt …"` (`:374`), 2 Inline-Ternaries (`:91`, `:167`), Satzkonkatenation (`:353-355`) |
| `/einstellungen` | `app/einstellungen/page.tsx` | Client | ca. 237 Z. | Textreichste Datei; `THEME_OPTIONS` (`:58-62`); `SPRACH_TEILWEISE` deutsch (`:53-56`) |
| `/export` | `app/export/page.tsx` | Client | hoch | `de-DE` im Render (`:103`) |
| `/glossar` | `app/glossar/page.tsx` | Client | mittel | Sortierung ohne `localeCompare` (`:86-93`) |
| `/profil` | `app/profil/page.tsx` | Client | mittel | — |
| `/ueber` | `app/ueber/page.tsx` | **Server** | 19 | Eigene `metadata` (`:7`); `process.env.NEXT_PUBLIC_BUILD_TIME` + `de-DE` auf **Modulebene** (`:10-18`) |
| `/rueckmeldungen` | `app/rueckmeldungen/page.tsx` | Client | mittel | Deutsche Anführungszeichen um **nutzergenerierten** Freitext (`:144`) — L3 beachten |
| `/werte` | `app/werte/page.tsx` | **Server** | 51 | `SEKTIONEN`-Konstante mit ca. 40 Labels + `de-DE` auf **Modulebene** (`:16-81`); liest `searchParams` |

**Fünf Route-Level-Server-Components:** `layout.tsx`, `dashboard`, `werte`, `ueber`, `hinweis/[id]`.
Davon nutzen Server-Fähigkeiten, die bei einer Umwandlung verlorengingen: `layout.tsx` (`metadata`,
`viewport`), `ueber` (`metadata`, `process.env`), `hinweis/[id]` (`generateStaticParams`), `werte`
(`searchParams`). `dashboard` nutzt keine — ist aber die textreichste Server-Route.

---

## 4. Komponenten

56 Dateien (53 flach + 3 unter `ui/`), davon **36 mit sichtbarem Text**.

### 4.1 Komponenten ohne `"use client"`, die sichtbaren Text enthalten (F9-kritisch)

Diese acht können `useSettings()` nicht konsumieren und brauchen zwingend eine Entscheidung:

| Datei | Anmerkung |
|---|---|
| `src/components/UncertaintyBadge.tsx` | `aria-label` `:11`, Disclaimer-Text `:16-17` — **L5-relevant** |
| `src/components/InsightStatement.tsx` | Kernaussage der Detailseite |
| `src/components/DataSourceMiniCard.tsx` | interpoliertes `aria-label` `:52` |
| `src/components/VorsorgeTerminZeile.tsx` | Terminzeilen |
| `src/components/ComboChip.tsx` | Defaults `"Details"` `:16`, `"Wearable"` `:17` — **verwaist** |
| `src/components/InsightHeader.tsx` | datengetrieben — **verwaist** |
| `src/components/StatusRings.tsx` | Default-Props + `" Prozent, "` `:46-48` — **verwaist** |
| `src/components/FactorBars.tsx` | Faktortext `:20`, `aria-label` `:35` — **verwaist** |

Drei weitere Server-Komponenten haben **keinen eigenen Text** (100 % prop-getrieben) und sind
unkritisch: `AppHeader.tsx`, `DetailHeader.tsx`, `DeviceFrame.tsx`.

### 4.2 Onboarding-Kette (der auffälligste Kohärenzdefekt)

| Datei | Client? | Textstellen | Übersetzt? |
|---|---|---:|---|
| `LoginPage.tsx` | JA | 0 offen | **JA — 4 Sprachen**, aber lokaler State (1.2) |
| `AnimatedIntro.tsx` | JA | 0 offen | **JA — 4 Sprachen** |
| `ConnectScreen.tsx` | JA | 15 | NEIN |
| `EpaWizard.tsx` | JA | 19 | NEIN |
| `SyncingScreen.tsx` | JA | 8 | NEIN |

Die Screens 1–2 sind viersprachig, die Screens 3–5 rein deutsch. Der Sprachbruch mitten im
Onboarding ist der sichtbarste Defekt des Ist-Zustands.

### 4.3 Verwaiste Komponenten (16 von 56, ca. 1.083 Zeilen)

Ermittelt über einen transitiven Import-Graph ausgehend von allen 15 Route-Entrypoints. Der im
Auftrag genannte Grundsatz „verwaiste Komponenten werden mitübersetzt, aber gekennzeichnet" gilt.

**Mit sichtbarem Text (ca. 46 Textstellen):**
`XaiVariantSwitch.tsx` (5) · `FactorBars.tsx` (3) · `ExplanationPanel.tsx` (3) ·
`ProvenanceChip.tsx` (ca. 16) · `GeraeteSektion.tsx` (ca. 12) · `StatusRings.tsx` (3) ·
`MethodeQuellen.tsx` (1) · `ComboChip.tsx` (3)

**Ohne eigenen Text:** `InsightMoment.tsx` · `InsightHeader.tsx` · `NormLabelChip.tsx` ·
`FeatureCard.tsx` · `BatteryRing.tsx` · `BlutdruckSparkline.tsx` · `AppleWatchIllustration.tsx` ·
`EpaIllustration.tsx`

**Mitverwaiste lib-Dateien:** `src/lib/featureMap.ts` (24 Strings) ·
`src/lib/insightMoment.ts` (10 Mehrzeilentexte, F11-kritisch) · `src/lib/normwerte.ts` (3 Labels)

Damit ist die in `CLAUDE.md:111-116` beschriebene A/B/C-Variantenumschaltung **auf keiner Route mehr
erreichbar**. Die live gerenderte XAI-Seite besteht aus `DetailHeader`, `InsightStatement`,
`GlossarText`, `CounterfactualSlider`, `DataSourceMiniCard`, `SmartTippCard`, `UncertaintyBadge`,
`VorsorgeTerminZeile`. `CounterfactualSlider` ist erreichbar, weil `HinweisDetail.tsx:20` ihn direkt
importiert.

---

## 5. Vorgefundene Übersetzungsansätze (sechs, alle unverbunden)

Kein i18n-Framework installiert (`grep -nE 'i18n|intl|next-intl|lingui|react-i18next' package.json`
→ 0 Treffer).

| # | Ansatz | Ort | Sprachen | Umfang | Bewertung |
|---|---|---|---|---|---|
| 1 | `UI`-Objekt + `Lang` + `t()` | `app/reise/page.tsx:23-85` | de, en | 20 Schlüssel | **Teil-Vorbild** |
| 2 | `Record<Language, …>` | `AnimatedIntro.tsx:16,139,145` | **alle 4** | 14 × 4 | **Vorbild** (Sprachdimension) |
| 3 | `T`/`DEMO_TEXT` + lokaler State | `LoginPage.tsx:7,67,91` | **alle 4** | 11 × 4 | **Altlast** (Datenverlust-Pfad) |
| 4 | Inline-Ternary | `HinweisDetail.tsx:46-50` | de, en | 1 Stelle | **Altlast** |
| 5 | `Lokalisiert` / `Land` | `data/reise.ts:8`, `data/laender.ts:5` | de, en | 193 + 17 | **Vorbild** in der Form |
| 6 | `SPRACH_WERT`/`SPRACH_TEILWEISE` | `einstellungen/page.tsx:44-56` | — | 4 Endonyme | **Altlast**, `SPRACHEN` behalten |

**Ansatz 1 — Detail.** Vorbildlich sind die `satisfies`-Typprüfung (`:70`, das einzige Konstrukt der
App mit Vollständigkeitsgarantie), die Trennung UI-Strings/Inhaltsstrings und `localeCompare` mit
Locale-Argument (`:102`). Altlast: eigener `Lang`-Typ neben `Language` (verengt still auf 2 von 4),
zwei Inline-Ternaries (`:91`, `:167`), die das eigene Objekt umgehen, `lang` als Funktionsparameter
statt via Hook, Satzkonkatenation mit Prefix/Suffix (`:353-355`, `:421-423`). Der Code kommentiert
sich selbst als Provisorium (`:25-27`: „es gibt noch kein zentrales i18n-System in der App").

**Ansatz 2 — Detail.** Einziger Ort mit echter DE/EN/TR/AR-Abdeckung. Altlast ist die Datenform:
JSX-Icons sind pro Sprache dupliziert (`<ShieldCheck …>` steht 4×), Struktur und Text sind vermengt.
Beim Umbau muss `icon`/`dark` aus der Sprachdimension herausgezogen werden. **Die TR/AR-Texte sind
der einzige nicht-deutsche/nicht-englische Textbestand der App und dürfen nicht verlorengehen**
(F10-Vorgabe).

**Ansatz 5 — Detail.** `Lokalisiert` (`data/reise.ts:8`) und `Land` (`laender.ts:5`) sind formgleich,
aber getrennt deklariert. `Lokalisiert` liegt in einem **Inhalts**modul, weshalb
`app/reise/page.tsx:20` einen UI-Typ aus dem Reise-Datenmodul importiert — das ist der von 4.1
geforderte Hebe-Kandidat nach `src/i18n/types.ts`.

**Zusätzlich (in 1.3 genannt):** `dataSources.ts:81` (Funktion gibt `{de,en}` zurück) und
`reise.ts:210` (Funktion mit `lang`-Default `"de"`, beide Aufrufer übergeben nichts).

**Vier verschiedene Auflösungsstile** koexistieren: `UI.key[lang]`, `t(v)`, `T[lang].key`,
`SLIDES[language]`, plus Ternaries. Drei unterschiedliche Fallback-Formen (`?? SLIDES.de`,
`?? "Deutsch"`, `language === "en" ? "en" : "de"`).

---

## 6. Datenschicht: übersetzungspflichtige Felder je Datei

| Datei | Übersetzungspflichtige Felder | Nicht übersetzen |
|---|---|---|
| `hinweise.ts` | `titel`, `kurz`, `begruendung`, `detail`, `faktoren[].label`, `faktoren[].quelleRef`, `normwertHinweis`, `datengrundlage.*.label`/`.wert`/`.einordnung`, `kontrafaktisch.faktorLabel`/`.einheit`, **`kontrafaktisch.wirkung()`-Rückgaben** | `id`, `szenario`, `sourceKey`, `genutzteQuellen`, `dringlichkeit` |
| `smartTipps.ts` | `titel`, `text`, `cta`-Labels, Header-Texte | Tipp-IDs, `hinweisId` |
| `epa.ts` | `kind`, `value` (Freitextanteile) | `id`, `resourceType`, `kategorie`, `sourceKey`, `date`, **`issuer`** (Eigennamen) |
| `wearable.ts` | `label`, `sensor`, `period` | `id`, `metric`, `unit`, `sourceKey`, **`wearableGeraet`** („Apple Watch Series 12") |
| `termine.ts` | `titel`, Beschreibungen, Statustexte, `dringlichkeitMeta`-Labels | IDs, ISO-Daten, CSS-Klassen in denselben Objekten |
| `glossar.ts` | `kurz` (B1-Erklärungen) | **`term`** — ist zugleich Lookup-Schlüssel (siehe F2) |
| `abkuerzungen.ts` | `ausgeschrieben`, `erklaerung` | `id`, `kuerzel` |
| `angebote.ts` | `hinweis` | `id`, **`titel`, `ort`, `traeger`** (Eigennamen, E6) |
| `exportKategorien.ts` | Kategorie- und Zeilenlabels (116 Strings) | Zeilen-IDs |
| `profile.ts` | `note` | **`name`, `vorname`, `ort`, `versicherung`, `hausaerztin`** (Eigennamen) |
| `reise.ts` | bereits `Lokalisiert`; offen: Restfelder | `id`, ISO-Daten |
| `laender.ts` | bereits vollständig | **`code`** |

Analog in `src/lib/`: `dataSources.ts` (22 offene Strings), `datenherkunft.ts` (46),
`objections.ts` (Grund-Labels), `kategorie.ts` (6 Labels), `wellnessScore.ts` (siehe F6),
`dringlichkeit.ts` (siehe F5), `glossarEintraege.ts`, `featureMap.ts` (verwaist),
`insightMoment.ts` (verwaist, F11), `normwerte.ts` (verwaist).

---

## 7. Fallstricke F1–F15: vollständige Trefferliste

Alle fünfzehn sind im Code **bestätigt**.

### F1 — Textproduzierende Funktionen in Datenobjekten · Risiko hoch
`src/lib/types.ts:129` (`wirkung: (wert: number) => string`) ·
`src/data/hinweise.ts:4-6` (Formatierer `de()`) · `:35-42` · `:92-100` · `:148-154` · `:246-253` ·
`:307-315` · Konsument `src/components/CounterfactualSlider.tsx:78`
Fünf Regler erzeugen Text aus Schwellenwert-Verzweigungen (`>=7.5`, `>=150`, `<=2`, `>=7`, `>=30`).
Der Formatierer `de()` ist **zweimal dupliziert** (`hinweise.ts:4`, `CounterfactualSlider.tsx:6`),
beide hart auf `de-DE`. `hinweise.ts:150` enthält den Notbehelf „Woche(n)".

### F2 — Glossar-Regex über deutsche Begriffe · Risiko hoch
`src/data/glossar.ts:4-118` (23 Einträge, `term` = Schlüssel **und** Anzeigetext) ·
`:121-123` (`glossarMap` per `toLowerCase()`) · `:126-128` (Sortierung nach Länge, **Modulebene**) ·
`src/components/GlossarTerm.tsx:109-111` (`escapeRegExp`) · **`:113`** (`pattern`, Modulebene) ·
**`:114`** (`new RegExp(\`\\b(${pattern})\\b\`, "gi")`, Modulebene) · `:120-134` (`GlossarText`) ·
`:126` (Lookup `glossarMap[part.toLowerCase()]`)
Der Regex entsteht **einmal beim Import** und ist nach einem Sprachwechsel nicht neu berechenbar.
Die Längensortierung ist die Kollisionsstrategie für deutsche Komposita. `\b` ist in JavaScript
ASCII-basiert. Schlägt der Lookup fehl, fällt der Treffer **still** auf `<Fragment>` zurück (`:130`)
— DF8 verschwindet lautlos bei grünem Build.
Live-Aufrufstellen: nur 3 erreichbare (plus 4 in verwaisten Komponenten).
**Zusatzbefund:** Für die 5 Begriffe in der Schnittmenge `glossar ∩ abkuerzungen`
(`HRV, BPM, mmHg, mg/dl, HbA1c`) existieren **zwei divergierende deutsche Erklärtexte** —
`/glossar` zeigt die Abkürzungs-Version, das Bottom-Sheet die `glossar.ts`-Version.

### F3 — Messwert-Hervorhebung per deutscher Einheitenliste · Risiko hoch
`src/utils/highlight.tsx:13-33` (`EINHEITEN`, davon deutsch: „Schritte", „Wochen", „Woche",
„Monaten", „Monate", „Stunden", „Stunde", „Min") · `:35` (`unitPattern`, Modulebene) ·
`:38` (`NUM` behandelt `.` und `,` gleichrangig) · **`:41`** (`REGEX` mit Lookahead
`(?![\wäöüßÄÖÜ])`, Modulebene) · `:43-54` · `:60-73` (F2-Kopplung)
Im Englischen bliebe „12,584 steps" unmarkiert; die klinischen Einheiten griffen weiter. Ergebnis
ist eine halb funktionierende Hervorhebung ohne Fehlermeldung.

### F4 — Hartkodierte `de-DE`-Formatierung · Risiko mittel
**Auf Modulebene (reagieren prinzipiell nicht auf Sprachwechsel):**
`app/dashboard/page.tsx:23,31,32,37,39` (`nf1`, `GRID`) · `app/vitalink/page.tsx:12` (`STAND_DATUM`) ·
`app/ueber/page.tsx:10` (`BUILD_STAMP`) · `app/werte/page.tsx:16,42,50,53,70,76-78` (`SEKTIONEN`)
**Im Render (reagieren nach Locale-Umstellung):**
`app/dashboard/page.tsx:50` · `app/export/page.tsx:103` · `components/CounterfactualSlider.tsx:7` ·
`data/hinweise.ts:5`
Zusätzlich `components/GlossarTerm.tsx:23` (`u.lang = "de-DE"` für die Vorlesefunktion — einzige
`speechSynthesis`-Nutzung der App).

### F5 — Pluralisierung und relative Zeitangaben · Risiko mittel
`src/lib/dringlichkeit.ts:31` (`` `${tage} Tage` ``, **kein** `n===1`) · `:32` (`` `${…} Wochen` ``) ·
`app/dashboard/page.tsx:104,181` · `:52-56` · `data/hinweise.ts:150` („Woche(n)")
**Schwerster Einzelfall:** `src/components/HinweisCard.tsx:23` —
`` `in ${frist.replace(" Tage", " Tagen")}` ``. String-Chirurgie am bereits erzeugten deutschen
Text, um Nominativ→Dativ zu erzwingen. Im Englischen gäbe es kein `" Tage"` zu ersetzen; der Text
bliebe unverändert und die Beugungslogik wäre sinnlos. **Keine einzige Stelle behandelt heute
`n === 1`.**

### F6 — Deutsche Strings als Typen / Record-Schlüssel · Risiko mittel
`src/lib/wellnessScore.ts:6` (`type WellnessLabel = "Sehr gut" | "Gut" | "Mittel" | "Niedrig"`) ·
`:29-34` · `:59` · Konsument `components/WellnessHero.tsx:24,66` (direkt gerendert) ·
`src/lib/types.ts:63` (`type Trend = "steigend" | …`) · `data/wearable.ts:81,93,105,117` ·
`src/lib/types.ts:219` (`status: "ok" | "bald" | "fehlt"`)
**Zehn Status-Meta-Tabellen mischen Label und CSS-Klasse im selben Objektliteral:**
`data/termine.ts:175-212` (`dringlichkeitMeta`) · `lib/normwerte.ts:13-17` (`NORM_META`) ·
`lib/kategorie.ts:28-78` · `app/reise/page.tsx:72-80` (`statusChip`) u. a.

### F7 — Sprachabhängige Sortierung · Risiko mittel
**Einzige korrekte Stelle:** `app/reise/page.tsx:101-103`
(`localeCompare(b[lang], lang)`, `useMemo` mit `[lang]`) — das Vorbild.
**Kritisch:** `app/glossar/page.tsx:86-93` — zweistufige Sortierung sichtbarer Einträge **ohne**
`localeCompare` und ohne alphabetisches Kriterium; Grundreihenfolge ist die Array-Reihenfolge aus
`abkuerzungen.ts`/`glossar.ts`. · `:56-63`
Sprachneutral und unkritisch: `app/vitalink/page.tsx:83` (nach Szenario-Schlüssel).
`data/glossar.ts:126-128` sortiert nach Länge und steuert die Regex-Alternation, nicht die Anzeige.

### F8 — `aria`-Attribute und Screenreader-Texte · Risiko mittel
Ca. 47 statische Attribut-Literale plus interpolierte Templates, die deutsche Fragmente mit
Datenwerten verweben:
`components/StatusRings.tsx:24-25,46-48` (Wort „Prozent" hartkodiert) ·
`components/FactorBars.tsx:35` (`", Quelle abgeschaltet"`) ·
`components/CounterfactualSlider.tsx:58` (`aria-valuetext` mit `de()`-Zahl) ·
`components/DataSourceMiniCard.tsx:52` · `app/werte/page.tsx:89` ·
`components/WochenrueckblickCard.tsx:101,111` · `components/SmartTippCard.tsx:115` (mit deutschen
Anführungszeichen) · `components/GynaekologieKontaktSheet.tsx:68` · `components/ui/Dialog.tsx:74` ·
`components/DataSourceToggle.tsx:55-57` · `components/ObjectionDialog.tsx:43` ·
`components/HerkunftsTooltip.tsx:105` · `components/BottomNav.tsx:36` ·
`app/einstellungen/page.tsx:135,356,401`
Diese Templates sind nicht per einfachem Wörterbuch-Eintrag ersetzbar — sie brauchen die von 4.2
geforderte Platzhalter-Form.

### F9 — Server- vs. Client-Components · Risiko hoch
**34 Dateien ohne `"use client"` mit sichtbarem Text:** `src/app` 4 · `src/components` 8 ·
`src/data` 10 · `src/lib` 11 · `src/utils` 1. Details in Abschnitt 3 und 4.1.
Sämtliche 828 Inhaltstext-Strings aus `src/data`/`src/lib` sind reine Modul-Konstanten **ohne
Sprachparameter** und liegen außerhalb jedes Client-Contexts.
Referenzmuster für den Umbau ist bereits im Repo etabliert: `app/hinweis/[id]/page.tsx` (Server,
`generateStaticParams`) + `HinweisDetail.tsx` (Client).

### F10 — Konkurrierende Übersetzungsansätze · Risiko hoch
Sechs Ansätze, siehe Abschnitt 5. `reise/page.tsx:83-85` degradiert `tr`/`ar` **stillschweigend**
auf Deutsch.

### F11 — Textlänge und 430-px-Layout · Risiko mittel
**Manuelle `\n`-Umbrüche:** `src/lib/insightMoment.ts:56,67,78,89,104,115,126,136,146,156` —
10 Texte mit je 2 hartkodierten Umbrüchen, exakt auf deutsche Wortlängen bei 390 px kalibriert
(Beispiel `:56`: „Deine beste Nacht seit 2 Wochen.\nHeute: Sonne 11–17 Uhr —\nideal für Vitamin D
und Schritte."). Renderort `components/InsightMoment.tsx` (**verwaist**).
**`truncate`/`line-clamp` (12 Container, schneiden schon heute deutschen Text ab):**
`app/dashboard/page.tsx:106,161,162,176` · `components/AppHeader.tsx:34` (`max-w-[60%]`) + `:40` ·
`components/HinweisCard.tsx:39` · `components/FeatureCard.tsx:25` (`w-[240px]`) + `:28` ·
`components/SmartTippCard.tsx:93`
**`whitespace-nowrap`:** u. a. Bottom-Nav-Labels.

### F12 — Eingefrorenes Szenario-Datum · Risiko niedrig
`src/lib/zeit.ts:8` (`SZENARIO_HEUTE`, 29.06.2026) · `:11` · Warnkommentare `:1-5`, `:7`, `:15-19` ·
`:20-23` (`tageBis`) · `lib/dringlichkeit.ts:4-6,10-11` · `data/reise.ts:178-181` · `data/epa.ts:141`
**Abweichungen (Bestandsbefund, siehe 1.4):** `app/dashboard/page.tsx:48` (zweites Datum,
14.07.2026) · `lib/insightMoment.ts:33` (echte Systemzeit).
Für die Migration günstig: alle abgeleiteten Countdowns sind deterministisch und damit testbar.

### F13 — Umschalt-Pfad · Risiko hoch
**Einstieg 1 (Onboarding):** `components/LoginPage.tsx:59-64` (`LANGS`) · **`:91`** (lokaler State) ·
`:97-98` · `:87` · `app/page.tsx:22-28` · `:38`
**Einstieg 2 (Einstellungen):** `app/einstellungen/page.tsx:367-368` (schreibt sofort in den
Context) · `:124` · `:381`
**Zwei Defekte der Senke:** (a) Sprach-Flash durch `SettingsContext.tsx:117`
(`useState<Language>("de")`, Laden erst im Effekt); (b) der in 1.2 beschriebene Überschreib-Pfad.
`SPRACHEN` (`einstellungen:50`) und `LANGS` (`LoginPage:59-64`) sind **zwei getrennte Listen
derselben vier Sprachen** — Duplikatsrisiko.

### F14 — Deutsche Zahl-/Datums-/Uhrzeit-Literale mitten in Strings · Risiko mittel
Ca. **130 Fundstellen**, davon 44 im Format `dd.mm.yyyy`. Auswahl:
`lib/datenherkunft.ts:15` (`LABORDATUM = "12.03.2026"`, an `:19-23` fünffach verwendet) ·
`:29,30,31,56` · `data/termine.ts:57,61-62,72,76,92-93,122-123,136-137,147,150-151` ·
`data/hinweise.ts:82,134,136,170,190,192,199,203,205,214,215,233,237,293,295,298` ·
**`:187,188,229`** (deutsche Monatsnamen im Fließtext: „am 27. Januar 2026 war, ist der 28. Juli") ·
`data/smartTipps.ts:87,139,140,299,343` · `data/exportKategorien.ts:69` ·
`components/GynaekologieKontaktSheet.tsx:36`
Betroffen sind vier Konventionen: Datumsreihenfolge `dd.mm.yyyy`, Tausenderpunkt, Dezimalkomma,
Uhrzeiten („21:30 Uhr", „11–17 Uhr"). Jeder dieser Werte ist Teil eines unteilbaren Strings und
muss beim Übersetzen von Hand mitgezogen werden.

### F15 — Deutsche Anführungszeichen und Typografie · Risiko niedrig
**41 Vorkommen in 27 Dateien**, davon 14 in sichtbarem Text und 1 in einem `aria-label`:
`app/termine/page.tsx:56` (Toast) · `components/SmartTippCard.tsx:93` · **`:115`** (`aria-label`) ·
`app/rueckmeldungen/page.tsx:78` · `:119` · **`:144`** (umschließt **nutzergenerierten** Freitext,
plus Halbgeviertstrich als Trenner) · `app/einstellungen/page.tsx:412` · `app/glossar/page.tsx:148` ·
`components/AddAbkuerzungSheet.tsx:37`
Kritisch sind die interpolierten Fälle: die Zeichen liegen im Code, der Inhalt kommt aus Daten oder
Nutzereingabe. `rueckmeldungen:144` berührt **L3** (nutzergenerierter Text darf nicht verändert
werden — nur die umschließenden Zeichen sind Teil der Übersetzung).

---

## 8. Statische Assets außerhalb `src/`

| Datei | Fundstelle | Inhalt |
|---|---|---|
| `public/manifest.json` | `:2` | `"name": "VitaLink - erklaerbare Vorsorge-Hinweise"` (Ersatzschreibung `ae` statt `ä`) |
| | `:4` | `"description": "Forschungs-Demonstrator mit fiktiven Daten. Kein Medizinprodukt."` — **L5-relevant** |
| | `:5` | `"lang": "de"` |
| `public/gesundheitskarte.svg` | `:` `<text x="490" y="68">` | **„Gesundheitskarte" ist in die Grafik eingebrannt** und per Code nicht umschaltbar |
| `src/app/layout.tsx` | `:16-18`, `:40` | `metadata` deutsch, `<html lang="de">` |
| `src/app/ueber/page.tsx` | `:7` | eigene `metadata` |

Ein einziges Manifest bedient alle Sprachen. Die Schriftart lädt nur das Subset `latin`
(`layout.tsx:9-13`) — für `ar` fehlt das arabische Subset (ohne Belang, solange E1 gilt und `ar` auf
den englischen Sprachstand fällt).

**Offene Entscheidung für die Freigabe (F9):** Route-Metadata, Manifest-Name und der SVG-Text sind
statisch und können den Hook nicht nutzen. Vorschlag: `metadata` und Manifest **zweisprachig-neutral**
formulieren (Produktname plus englische Kurzbeschreibung, da beide bereits weitgehend aus Eigennamen
bestehen), den SVG-Text unverändert lassen (Eigenname der deutschen Gesundheitskarte, E6). Zur
Bestätigung vorgelegt.

---

## 9. Zusammenfassung für die Freigabe

| Kennzahl | Wert |
|---|---|
| Zu übersetzende Zeichenketten | **1.377** (UI-Chrome 549 · Inhaltstext 828) |
| Textvolumen | ca. **47.700 Zeichen** (davon 12.465 in 57 langen Absätzen) |
| Betroffene Dateien | **73** von 99 |
| Bereits zweisprachig | 529 Strings (Länder 386, Onboarding 84, Reise 59) |
| Routen | 15 (davon **5 Server-Components**) |
| Komponenten mit Text | 36 von 56 (davon **8 ohne `"use client"`**) |
| Verwaiste Komponenten | **16** (+ 3 lib-Dateien), ca. 46 Textstellen |
| Bestehende Übersetzungsansätze | **6** (2 Vorbilder, 4 Altlasten) |
| Fallstricke F1–F15 | **15 von 15 bestätigt** (5 mit Risiko „hoch") |

**Vor Migrationsbeginn zu bestätigen:**
1. Die drei Prämissen-Korrekturen aus Abschnitt 1 (Persistenz existiert; der Reset sitzt in
   `LoginPage`, nicht in den Einstellungen; sechs statt vier Ansätze).
2. Die Entscheidung zu Route-Metadata, Manifest und dem eingebrannten SVG-Text (Abschnitt 8).
3. Umgang mit den 16 verwaisten Komponenten: mitübersetzen (Auftragsvorgabe) — mit dem Hinweis, dass
   ca. 46 Textstellen und 3 lib-Dateien betroffen sind, die auf keiner Route sichtbar sind.

**Noch nicht angelegt:** Feature-Branch (laut Auftrag erst vor Umsetzungsbeginn) und
`src/i18n/`-Fundament (Phase 2).

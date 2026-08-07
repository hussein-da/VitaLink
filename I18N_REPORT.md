# VitaLink DE/EN — Abschlussbericht

Branch `feat/i18n-de-en`, sechs Commits, auf `origin` gepusht. **`main` ist unverändert
(`eadec16`), es wurde nichts gemerged.** Railway deployt ausschließlich von `main` und hat
folgerichtig nicht gebaut.

Dieser Bericht führt die drei Zwischenberichte und den Abschluss zu einem Dokument zusammen.

---

## 1. Umfang

| Kennzahl | Wert |
|---|---:|
| Geänderte Dateien (`main..HEAD`) | 88 |
| Zeilen | +8.256 / −1.786 |
| Wörterbuch-Namensräume | 15 |
| Wörterbuch-Blattwerte je Sprache | 457 |
| Übersetzte Datenfelder (Datenschicht) | ca. 660 Locale-Paare |
| Routen migriert | 18 |
| Komponenten migriert | 45 (davon 12 verwaiste) |
| Neue i18n-Module | 5 (`types`, `format`, `de`, `en`, `useT`) |

Die Phase-1-Inventur hatte 1.377 übersetzungspflichtige Zeichenketten mit ca. 47.700 Zeichen
ermittelt (`I18N_INVENTORY.md`). Die Aufteilung nach der Migration: 457 Schlüssel im UI-Wörterbuch,
der Rest als `{de,en}`-Paare in der Datenschicht, wo der Text zum Datensatz gehört.

### Architektur

Kein i18n-Framework, kein Locale-Routing, keine Middleware — `package.json` ist unverändert (L10),
die URL-Struktur ist Byte für Byte identisch (L2).

**UI-Schicht:** ein React-Context (der bestehende `SettingsContext`), ein Hook `useT()`, zwei
Wörterbücher. `en.ts` ist gegen `Dictionary = Widen<typeof de>` typisiert; ein fehlender Schlüssel
ist ein roter Build, kein stiller Laufzeitfehler.

**Datenschicht:** lokalisierte Quelldaten plus locale-parametrisierte Accessoren. Die öffentlichen
Typen in `@/lib/types` behalten reine Strings, ein interner Quelltyp trägt `Lokalisiert`, der
Accessor löst je Locale auf. Dadurch mussten die nachgelagerten Komponenten nicht angefasst werden.

**Zwingend locale-unabhängig:** Jede Datendatei exportiert zusätzlich eine ID-Liste
(`hinweisIds`, `alleSmartTippIds`, `terminIds`, `exportZeilenIds`, `abkuerzungIds` …). Der
`SettingsContext` validiert gespeicherte Widersprüche und `generateStaticParams` läuft zur
Build-Zeit — beide dürfen nicht von der Sprachwahl abhängen, sonst zerstört ein Sprachwechsel
die DF12-Nutzerdaten (L3).

**Formatierung:** `src/i18n/format.ts` ist der einzige Weg — React-frei, von der Datenschicht und
von `useT().fmt` gemeinsam genutzt, Intl-Instanzen je Locale memoisiert.

---

## 2. Fallstricke F1–F15

| # | Fundstelle | Lösung | Verifikation |
|---|---|---|---|
| **F1** | `types.ts:129`, `hinweise.ts` (5 Regler), `CounterfactualSlider.tsx:7` | Quelle: `wirkung: (wert, locale) => string`; der Accessor bindet die Locale, der öffentliche Typ bleibt `(wert) => string`. Der Slider brauchte keine Signaturänderung. Beide `de(n)`-Dubletten durch `zahl(n, locale)` ersetzt. Schwellenlogik identisch. | Regler auf `/hinweis/kardio-blutdruck` EN gelesen: „With around 150 active minutes per week …" |
| **F2** | `GlossarTerm.tsx:113-114` (Modul-Regex), `glossar.ts:126-128` | Regex, Lookup-Map und Begriffsliste je Locale memoisiert statt Modulkonstante. Eigene englische Begriffsliste (`systolic`, nicht `systolisch`). Sortierung „längster zuerst" je Locale erhalten. `u.lang` der Vorlesefunktion war hart `de-DE`. | `/glossar` und Detailseiten in beiden Sprachen: unterstrichene Begriffe vorhanden, Sheet zeigt die passende Erklärung |
| **F3** | `highlight.tsx:13-41` | Einheitenliste je Locale (`steps`/`weeks`/`hours`/`IU`), Lookahead je Locale (`\wäöüßÄÖÜ` vs. `\w`), Regex memoisiert. Zahlenmuster lässt beide Trennzeichen zu. | Smart-Tipps EN: „**12,584 steps**", „**6.7 h**" fett hervorgehoben |
| **F4** | 14 Aufrufe, davon 10 auf **Modulebene** | Alle Modulkonstanten in die Render-Ebene verlagert: `dashboard` GRID, `vitalink` STAND_DATUM, `ueber` BUILD_STAMP, `werte` SEKTIONEN, `export` datum. Kein bloßer Locale-String-Tausch. | Grep: kein `de-DE` außerhalb `src/i18n/` (nur Kommentare) |
| **F5** | `dringlichkeit.ts:31-32`, `HinweisCard.tsx:23` | Der `.replace(" Tage", " Tagen")`-Hack ist ersatzlos entfernt. Die Präposition ist Teil der Pluralform je Locale (`Intl.PluralRules`), damit ist `n === 1` erstmals korrekt („in 1 Tag" statt „1 Tage"). Alle Zahl+Substantiv-Konstruktionen laufen über `fmt.plural`. | `/termine`, `/dashboard`, `/vitalink` in beiden Sprachen |
| **F6** | `wellnessScore.ts:6`, `types.ts:63,219`, 10 Status-Meta-Tabellen | `WellnessLabel` auf sprachneutrale Schlüssel (`very-good` … `low`), Anzeige über Wörterbuch. Label und CSS-Klasse in den Meta-Tabellen getrennt. | Dashboard EN: „Good" unter „HEALTH SCORE" |
| **F7** | `reise/page.tsx:102` (Vorbild), `glossar/page.tsx:86-93` (Lücke) | Glossar-Liste sortiert jetzt mit `localeCompare(other, locale)`. Länderliste war bereits korrekt. | `/glossar` EN alphabetisch |
| **F8** | ca. 47 Attribut-Literale plus interpolierte Templates | Alle `aria-label`/`title`/`alt`/`placeholder` im Wörterbuch. Interpolierte Fälle als vollständige Satzform mit Platzhalter, nie aus Fragmenten. | Grep: keine deutschen Attribute außerhalb `src/i18n/` |
| **F9** | 34 Dateien ohne `"use client"` mit Text | `/dashboard` zu Client (nutzt keine Server-Fähigkeiten). `/ueber` und `/werte` bleiben Server-Components (metadata bzw. searchParams) mit ausgelagerten `UeberContent`/`WerteContent`. 8 Komponenten `"use client"` ergänzt. | Build grün, alle Routen laden |
| **F10** | 6 konkurrierende Ansätze | Alle auf das Fundament zurückgeführt. `/reise` brauchte seinen lokalen `Lang`-Typ und die Fallback-Kette nicht mehr. Die tr/ar-Texte in `LoginPage`/`AnimatedIntro` sind erhalten. | Grep: `locale === "de"` nur noch in Datenschicht-Schwellen und der dokumentierten Zwillingslogik |
| **F11** | 10 `\n`-Texte in `insightMoment.ts`, 12 truncate-Container | Englische Umbrüche neu gesetzt, nicht an denselben Positionen. Wo eng, kürzere englische Formulierung statt Layoutänderung. **Keine Layoutänderung nötig.** | 390 px und 430 px, beide Sprachen, große Schrift: kein horizontales Scrollen |
| **F12** | `zeit.ts:8` plus 4 Warnkommentare | Kein fixes Datum durch `new Date()` ersetzt. Nur die Formatierung ist locale-abhängig. | Countdowns deterministisch in beiden Sprachen |
| **F13** | `LoginPage.tsx:91`, `einstellungen:367` | Beide Einstiegspunkte schreiben in denselben Context. Die in Phase 1 gefundene Regression (LoginPage überschrieb die persistierte Wahl mit `"de"`) ist behoben. | Onboarding EN → Anmelden → Sprache bleibt `en` |
| **F14** | ca. 130 Literale | Jede Ziffer im englischen Text von Hand gezogen: `12.584`→`12,584`, `6,7`→`6.7`, `12.03.2026`→`12 March 2026`, `21:30 Uhr`→`21:30`, Wochentage/Monatsnamen. | Grep: keine deutschen Tausenderpunkte in `en.ts`; Dashboard EN zeigt „12,584" und „6.7 h" |
| **F15** | 41 Vorkommen in 27 Dateien | Deutscher Text behält `„…"`, englischer nutzt englische Typografie. Der **nutzergenerierte** Freitext in `/rueckmeldungen` bleibt unangetastet (L3) — nur der Rahmen ist übersetzt. | Grep: keine deutschen Anführungszeichen in `en.ts` |

---

## 3. Verifikationsnachweis

### 3.1 Maschinell

```
npm run build                                  → EXIT 0
npx tsc --noEmit                               → keine Fehler
grep deutsche JSX-Textknoten ausserhalb i18n   → keine
grep deutsche Attribute ausserhalb i18n        → keine
grep de-DE ausserhalb i18n                     → keine (nur Kommentare)
grep deutsche Anfuehrungszeichen in en.ts      → keine
grep deutsche Tausenderpunkte in en.ts         → keine
grep TODO/FIXME/Platzhalter in src/i18n        → keine
grep public/                                   → nur Binaerdateien (PNG-Dateinamen)
```

**Abnahmekriterium 2 nachgewiesen, nicht behauptet.** Schlüssel `seeAll` testweise aus `en.ts`
entfernt:

```
src/i18n/en.ts(27,3): error TS2741: Property 'seeAll' is missing in type ...
```

Nach Wiederherstellung ist `tsc` sauber. Derselbe Nachweis war zuvor mit `appointments` geführt
worden.

### 3.2 Browser (Playwright, Produktions-Build)

| Prüfung | Ergebnis |
|---|---|
| 18 Routen × 2 Sprachen bei 390 px | kein Restdeutsch, kein horizontales Scrollen, keine Konsolen- oder Hydration-Fehler |
| Leerer localStorage | `lang=de`, keine Fehler |
| Gespeichert `en`, nach Reload | `lang=en`, Navigation englisch, keine Fehler |
| Ungültiger Wert `"xx"` | stiller Fallback auf `de` |
| **Altdaten ohne `language`-Feld** | `lang=de`; Theme, Schriftgröße, abgeschaltete Quellen und Widersprüche **alle erhalten** |
| Fallback `tr` / `ar` | Inhalt englisch (`lang=en`), Wahl bleibt gespeichert, Endonym `Türkçe` / `العربية` weiter als aktiv sichtbar |
| 430 px + große Schrift + Dark Mode, beide Sprachen | alle Routen ohne Overflow, `data-theme` und `data-fontscale` korrekt |

Skripte: `verify-final.js`, `verify-all-routes.js`, `verify-onboarding.js`, `verify-i18n.js`,
`verify-login.js`, `verify-a11y-window.js` im Scratchpad.

### 3.3 Gegenlesen

Die drei textreichsten Screens am Stück auf Englisch gelesen (`/hinweis/kardio-blutdruck`,
`/dashboard`, `/export`). Zwei Befunde, die kein Grep gefunden hätte, wurden korrigiert:

- **„Pulses: iron and cholesterol"** → **„Legumes"**. In einer Gesundheits-App, die auf dem
  Dashboard „Pulse" als Herzfrequenz-Metrik führt, ist „Pulses" für Hülsenfrüchte aktiv
  irreführend.
- **„… does your resting heart rate and blood pressure trend good"** → **„… is good for your
  resting heart rate and your blood pressure trend"**. Unidiomatisch.

---

## 4. Terminologie-Glossar (finale Fassung)

| Deutsch | Englisch | Anmerkung |
|---|---|---|
| ePA / elektronische Patientenakte | **ePA**, erste Nennung je Screen „ePA (Germany's electronic patient record)" | Deutscher Rechtsbegriff (SGB V), Kürzel erscheint in Quellenangaben |
| STIKO | **STIKO** | Institution |
| Hausarzt / Hausärztin | **GP** | durchgängig eine Variante |
| Hausarztpraxis | **GP practice** | |
| Vorsorge | **preventive care** | nie „precaution" |
| Hinweis (Karten-Entität) | **insight** | |
| Empfehlung | **recommendation** | |
| Widerspruch (DF12) | **objection** | |
| Datengrundlage | **data basis** | |
| Wochenrückblick | **weekly review** | |
| Erklärvariante | **explanation mode** | |
| Was wäre, wenn | **What if** | |
| Ruhepuls | **resting heart rate** | |
| HRV | **HRV** | Kürzel bleibt |
| Tiefschlaf | **deep sleep** | |
| Impfung / Auffrischung | **vaccination / booster** | |
| Schriftgröße | **text size** | |
| Anzeigemodus | **appearance** | iOS-Konvention |
| Datenquellen | **data sources** | |
| Arztbericht | **doctor report** | |
| Synthetische Daten | **synthetic data** | |
| Kein Medizinprodukt | **not a medical device** | feststehende regulatorische Wendung |
| Gesundheitskarte | **health card** | kein formaler Rechtsbegriff wie ePA |
| Hülsenfrüchte | **legumes** | **nicht** „pulses" (Kollision mit der Metrik „Pulse") |
| GKV / gesetzliche Krankenkassen | **statutory health insurance** | |
| SoSe 2026 | **summer term 2026** | |
| Ø | **Avg** bzw. „on average" | kein etabliertes en-GB-Zeichen |

**Unübersetzt (E6):** Personennamen, Praxis-, Labor- und Klinikbezeichnungen („Labor MVZ Bochum",
„Hausarztpraxis Dr. Koch", „Zahnarztpraxis Dr. Maier"), Orte (Bochum, Essen, Mülheim, Ruhrgebiet),
Trägernamen, lokale Angebote und Kurse, VitaLink, Apple Watch Series 12, Hochschule Ruhr West,
Modul- und Studiengangsname, Einheitenzeichen. Die Sprach-Endonyme (Deutsch / English / Türkçe /
العربية) bleiben immer in der eigenen Sprache — internationaler Standard für Sprachauswahl.

---

## 5. Getroffene Entscheidungen

**5.1 Hydrations-Gate statt reinem Sync-Initializer (E4).** Der in E4 vorgeschriebene synchrone
`useState`-Initializer allein war nicht ausreichend — er war die Ursache. Gemessen mit Playwright
gegen dev und prod: bei gespeichertem `en` meldete React `Text content did not match` und ersetzte
**das gesamte Dokument**. E4 verweist für diesen Fall auf den `hydrated`-Flag „für die wenigen
Teilbäume" — nach vollständiger Migration sind das jedoch alle Textknoten. Umgesetzt an der einen
verursachenden Stelle: `useT` liefert bis zur Hydration den deutschen Stand. Kein
`suppressHydrationWarning`, nirgends. Der Rest-Flash von einem Frame bei `en`/`tr` ist unter L1+L2
strukturell unvermeidbar, weil das statische HTML zur Build-Zeit entsteht und die Sprache nicht
kennen kann.

**5.2 Route-Metadata, Manifest und SVG (F9).** Metadata und `manifest.json` sind statisch und
können den Sprach-Context nicht lesen. Beide sind **zweisprachig-neutral** formuliert: Titel ist der
Produktname, die Beschreibung führt beide Sprachen — dadurch steht der Nicht-Medizinprodukt-Hinweis
in **beiden** Sprachen und behält seine Schutzwirkung (L5). Der in `gesundheitskarte.svg`
eingebrannte Text „Gesundheitskarte" bleibt unangetastet: Eigenname der deutschen Gesundheitskarte
(E6), und die Grafik ist Teil des deutschen Szenarios.

**5.3 Server- vs. Client-Components.** `/dashboard` wurde Client-Component, weil sie keine
Server-Fähigkeiten nutzt — ein Server/Client-Paar wäre zusätzliche Struktur ohne Gegenwert.
`/ueber` (metadata) und `/werte` (searchParams) bleiben Server-Components mit ausgelagerter
Client-Unterkomponente, nach dem im Repo etablierten Muster `page.tsx` + Detail-Komponente.

**5.4 Glossar-Konsolidierung (inhaltliche Korrektur, getrennt committet).** `glossar.ts` und
`abkuerzungen.ts` hielten für dieselben fünf Begriffe abweichende Erklärungen; je nach Oberfläche
erschien ein anderer Text. Bei HRV war die `abkuerzungen.ts`-Fassung **sachlich falsch** („wie
gleichmäßig dein Herz schlägt" — die HRV misst die Schwankung, höhere Variabilität ist das
Gütezeichen). Beide zu übersetzen hätte die Falschaussage zweisprachig verdoppelt. `glossar.ts` ist
jetzt kanonische Quelle; `abkuerzungen.ts` referenziert sie über `ausGlossar()` und bricht den Build,
wenn ein Begriff fehlt. Das beseitigt die Divergenzquelle strukturell statt nur den Momentanstand
zu synchronisieren. `abkuerzungen.ts` bleibt als Datei nötig — sie trägt Langform, Kategorie,
Einheit und Referenzbereich, die `glossar.ts` nicht hat.

**5.5 Keine Layoutänderung (F11).** In allen Fällen ließ sich eine kürzere, ebenso präzise englische
Formulierung finden. Bei 390 px und 430 px, in beiden Sprachen, mit großer Schrift und im Dark Mode
tritt auf keiner Route horizontales Scrollen auf.

---

## 6. Offene Punkte und Risiken

**6.1 Screenreader-Fenster von 64 ms — nicht abschließend verifizierbar.** Gemessen auf
`/dashboard` im Produktions-Build bei gespeichertem `en`: FCP bei 144 ms, `lang="en"` steht ab
124 ms, englischer Text ab 188 ms. In diesem Fenster meldet das Dokument `lang="en"` bei noch
deutschem Inhalt. Ein Screenreader könnte für den Bruchteil einer Sekunde englische Aussprache auf
deutschen Text anwenden. **Ein Gegencheck mit einem echten Screenreader (NVDA/JAWS/VoiceOver) war
in dieser Umgebung nicht möglich** — headless, und die Accessibility-API von Playwright 1.62 bietet
das nicht mehr. Die Einschätzung, dass 64 ms unterhalb der Ankündigungsschwelle liegen (Screenreader
kündigen typischerweise erst nach Ladeabschluss oder bei Fokuswechsel an), ist begründet, aber
**nicht verifiziert**. Bewusst nicht weiter verfolgt.

**6.2 A/B/C-XAI-Variantenumschaltung ist auf keiner Route erreichbar — Funktionsregression
außerhalb dieses Auftrags.** `XaiVariantSwitch`, `FactorBars` und `ExplanationPanel` wurden mit
Commit `75ec0ff` (2026-06-27, „Detailseiten radikal vereinfachen") aus `HinweisDetail` entfernt und
sind seither verwaist. `CLAUDE.md` beschreibt sie weiterhin als Kernfeature (drei umschaltbare
Erklärmodi). Live erscheint nur Variante A als Fließtext plus der kontrafaktische Regler; die Felder
`begruendung` und `detail` werden an keiner Stelle gerendert. **Das ist nicht durch die i18n-Arbeit
entstanden und wurde bewusst nicht repariert.** Die Komponenten sind übersetzt und am Dateikopf als
derzeit nicht erreichbar gekennzeichnet.

**6.3 `npm run lint` ist nicht ausführbar — vorbestehend.** Der Befehl startet einen interaktiven
ESLint-Setup-Dialog. Gegenprobe auf `main` vor diesem Branch: identisches Verhalten, keine
ESLint-Config, kein `eslint` in den devDependencies. Nicht eingerichtet, weil das
Dev-Dependencies hinzufügen und `package.json` ändern würde (L10). **Abnahmekriterium 1 differenziert:
Build grün, Lint durch vorbestehende, i18n-unabhängige Repo-Bedingung nicht ausführbar.**

**6.4 Fehler im deutschen Original (L4: benannt, nicht geändert).**

| Fundstelle | Befund |
|---|---|
| `hinweise.ts` (zahnarzt) | Letzter Besuch 27.01.2026 + 6 Monate = 27.07.2026; im Text und in `dringlichkeit` steht 28.07.2026 — ein Tag daneben |
| `hinweise.ts` (lifestyle-schlaf) | Tiefschlaf inkonsistent: `kurz` „unter 12 %", `begruendung` „10–13 %", `datengrundlage` „16 %" |
| `hinweise.ts` (kardio) | Soft-Hyphen (U+00AD) in „tagesform­abhängig" |
| `smartTipps.ts` | Ruhepuls-Schnitt uneinheitlich: implizit 57 BPM, an anderer Stelle 60 BPM |
| `abkuerzungen.ts` | RMSSD-Langform unpräzise; korrekt wäre „…der Abstände aufeinanderfolgender Herzschläge" |
| `abkuerzungen.ts` | Eintrag `id: "mmol"` trägt `kuerzel: "ml/kg/min"`; steht unter „ALLGEMEIN", hat aber `kategorie: "herz"` |

**6.5 Kleinere Beobachtungen.**

- `insightHeaderQuellen` enthält „Langzeit-Risiko"/„Infektionsrisiko" → englisch „Long-term risk"/
  „Risk of infection". Das verstößt formal gegen die Nicht-Alarmismus-Wortliste, ist aber wortgetreu
  (L4). Der Block ist derzeit nicht erreichbar.
- „An insight, not a diagnosis." erscheint auf der Detailseite zweimal (UncertaintyBadge und
  G7-Hinweis) — genau wie im deutschen Original.
- `kategorieLabelFuer` in `abkuerzungen.ts` hat aktuell keinen Konsumenten; `KATEGORIE_LABEL` war
  schon vorher toter Code.
- `export const exportKategorien` (deutsche Modulkonstante) hat nach der Migration keinen Aufrufer
  mehr.
- Die Schriftart lädt nur das Subset `latin`. Für `ar` fehlt das arabische Subset — ohne Belang,
  solange E1 gilt und `ar` auf den englischen Sprachstand fällt.

---

## 7. Abnahmekriterien

| # | Kriterium | Status |
|---|---|---|
| 1 | Greps aus Abschnitt 3 liefern das erwartete Ergebnis | erfüllt |
| 2 | `npm run build` grün; `lint` dokumentiert | Build grün; Lint vorbestehend nicht ausführbar (6.3) |
| 3 | Fehlender Schlüssel bricht den Build (nachgewiesen) | erfüllt, `TS2741` gezeigt |
| 4 | Alle 15 Fallstricke einzeln dokumentiert | erfüllt (Abschnitt 2) |
| 5 | Jede Route im Browser durchgeklickt, beide Sprachen | erfüllt (Abschnitt 3.2) |
| 6 | Verwaiste Komponenten übersetzt und markiert | erfüllt |
| 7 | Ein Übersetzungsmechanismus im Repository | erfüllt |
| 8 | Terminologie app-weit konsistent | erfüllt (Abschnitt 4) |
| 9 | Keine i18n-Bibliothek, `package.json` unverändert | erfüllt |
| 10 | URL-Struktur unverändert | erfüllt |
| 11 | Deutscher Sprachstand regressionsfrei | erfüllt (18 Routen geprüft) |
| 12 | `main` unverändert, nichts gemerged | erfüllt |

**Der Merge nach `main` steht aus und ist ein eigener, bewusster Schritt.**

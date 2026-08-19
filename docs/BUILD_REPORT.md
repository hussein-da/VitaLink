# VorSicht - Build-Report

Stand: Build abgeschlossen, `npm run build` und `npm run start` lokal gruen, Verifikationsschleife
A-G durchlaufen. Dieser Report dokumentiert den Stand jeder DF-Zeile, die bewussten Auslassungen
und die Abweichungen vom Auftrag.

---

## 1. Gesamtstatus

| Pruefpunkt | Status |
|---|---|
| `npm run build` (Next.js 14.2, TypeScript strict) | gruen, 0 Fehler, 0 Warnungen |
| `npm run start` (Produktionsserver) | gruen (liest `PORT`, lokal 3000, getestet auf 3210) |
| 11 Routen praerendert | gruen (`/`, `/dashboard`, `/hinweis/[id]` x3, `/einstellungen`, `/ueber`) |
| Eisernes Gesetz (5 Punkte) | erfuellt |
| Design-Features DF1-DF12 | alle 12 erfuellt |
| Drei XAI-Varianten umschaltbar | erfuellt |
| Barrierefreiheit (>=14px / >=4.5:1 / >=44px) | erfuellt, Kontraste real berechnet |
| Datenkontrolle + Widerspruch (localStorage) | erfuellt, ueberlebt Reload |
| Nur synthetische Daten | erfuellt (`synthetic: true` / `beispiel: true`) |

Verifikation erfolgte als adversariale Mehr-Agenten-Pruefung (17 unabhaengige Pruefer pro Durchgang,
je mit Datei:Zeile-Beleg). Gefundene Punkte wurden sofort behoben und erneut geprueft.

---

## 2. DF-Status (gegen `src/lib/featureMap.ts`)

| DF | Requirement | Komponente / Ort | Status | Beleg / Akzeptanz |
|----|----|----|----|----|
| DF1 | DR1 | `FactorBars` in `XaiVariantSwitch` (B) | erfuellt | Faktoren nach Gewicht sortiert, Label + Prozent + Balken; jeder Hinweis >=2 Faktoren |
| DF2 | DR2 | `UncertaintyBadge` (Detail) | erfuellt | bei `unsicher:true` Label "Hinweis, keine Diagnose" + Verweis auf aerztliche Abklaerung (kardio-blutdruck) |
| DF3 | DR3 | `ExplanationPanel` | erfuellt | drei Tiefen Kurz/Begruendung/Detail als Accordion, "Kurz" offen |
| DF4 | DR4 | `CounterfactualSlider` (C) | erfuellt | Regler aendert Wirkungstext live (aria-live), mehrere Schwellen je Hinweis |
| DF5 | DR5 | `ProvenanceChip` (ePA) | erfuellt | ePA-Chip zeigt Quelle + Datum + Einrichtung |
| DF6 | DR6 | `ProvenanceChip` (Wearable) | erfuellt | Wearable-Chip zeigt Zeitraum + Sensorart; jede genutzte Wearable-Quelle hat einen Chip |
| DF7 | DR7 | `FontSizeToggle` + Designtokens | erfuellt | Schrift >=14px, Kontrast >=4.5:1, Tap >=44px, globale Schriftskalierung via `--font-scale` |
| DF8 | DR8 | `GlossarTerm` / `GlossarText` | erfuellt | 8 Begriffe (HRV, Ruhepuls, Blutdruck, systolisch, diastolisch, Cholesterin, kardiovaskulaer, STIKO) antippbar -> B1-Popover |
| DF9 | DR9 | `ActionCard` | erfuellt | jeder Hinweis >=1 lokale Ruhrgebiet-Handlungsoption (als Beispiel markiert) |
| DF10 | DR10 | Designsystem + Tonalitaet | erfuellt | kein Alarmrot (Palette nur Teal/Sand/Braun), sachliche Sprache; per Grep bestaetigt 0 Rot-Treffer |
| DF11 | DR11 | `DataSourceToggle` | erfuellt | Schalter pro ePA-Kategorie (Vitalwerte/Labor/Impfungen) und pro Wearable-Stream (Schlaf/Puls/HRV/Aktivitaet); Wirkung app-weit |
| DF12 | DR12 | `ObjectionButton` | erfuellt | Widerspruch mit 3 Gruenden + Freitext, in localStorage gespeichert, Hinweis markiert, in Einstellungen gelistet, loeschbar |

---

## 3. Eisernes Gesetz

1. **Nur synthetische Mock-Daten:** alle Datensaetze in `src/data/` tragen `synthetic: true` bzw.
   `beispiel: true`; kein Backend, keine externe API, kein Netzwerkcode (per Grep bestaetigt).
2. **Kein Medizinprodukt:** Disclaimer "Demonstrator mit fiktiven Daten. Kein Medizinprodukt.
   Keine medizinische Beratung." dauerhaft im globalen Layout (`Disclaimer.tsx` im Footer jeder
   Seite, nicht wegklickbar) plus prominenter Hinweis im Onboarding und auf `/ueber`.
3. **Nur mobile:** mobile-first, `DeviceFrame` zentriert die Ansicht auf breiten Viewports in max.
   430px; keine Desktop-spezifische Vorgabe.
4. **Deutsch:** alle sichtbaren Texte deutsch (`<html lang="de">`).
5. **Barrierefreiheit eingebaut:** siehe DF7 / Abschnitt 5.

Betreuung exakt "Ann-Kathrin Kubullek, M.A." auf `/ueber`, kein zweiter Name.

---

## 4. Verifikationsschleife (A-G)

| Durchgang | Inhalt | Ergebnis |
|---|---|---|
| A - Build & Typen | `npm run build` ohne Fehler/Warnungen | gruen |
| B - Feature-Vollstaendigkeit | 12 DF-Zeilen einzeln gegen Akzeptanzkriterium | alle erfuellt |
| C - Drei XAI-Varianten | A/B/C umschaltbar, C live, A11y-Tabs | erfuellt |
| D - Eisernes Gesetz | Disclaimer ueberall, Deutsch, kein Alarmrot, Betreuung exakt | erfuellt |
| E - Barrierefreiheit | Kontraste real >=4.5:1, Tap >=44px, Fokus sichtbar, globale Schriftskalierung | erfuellt |
| F - Datenkontrolle & Widerspruch | Abschalten markiert app-weit (nicht gefaket), Widerspruch persistiert | erfuellt |
| G - Realdaten-Check | keine echten Endpunkte/Keys/PII, alles synthetisch | erfuellt |

### In der Schleife behobene Funde (Auszug)

- **Opacity-Tokens:** CSS-Farbvariablen auf RGB-Kanaltripel umgestellt
  (`rgb(var(--c-x) / <alpha-value>)`), damit Tailwind-Opacity-Modifier (z. B. der Dialog-Backdrop
  `bg-ink/40`, die transluzente Kopfleiste) tatsaechlich rendern - vorher wurden sie still verworfen.
- **DF11 "Labor" wirksam gemacht:** der ePA-Laborwert (Cholesterin) wird jetzt im
  kardiometabolischen Hinweis genutzt (Faktor + Provenance + `genutzteQuellen`), damit der
  Labor-Schalter eine sichtbare app-weite Wirkung hat.
- **DF6 vollstaendig:** fuer jede genutzte Wearable-Quelle (inkl. Aktivitaet) existiert ein
  ProvenanceChip mit Zeitraum + Sensorart.
- **F-Konsistenz (kein Restleck):** bei abgeschalteter Quelle blendet die Detailseite XAI,
  Erklaerung, Aktionen und Widerspruch aus; der ProvenanceChip einer abgeschalteten Quelle wird
  redigiert (generischer Quellenname statt konkretem Messwert) - es werden keine Daten gezeigt,
  die laut Einstellungen nicht genutzt werden duerfen.
- **A11y-Tabs:** drei persistente Tabpanels (aufloesbare `aria-controls`) plus Home/End-Tasten.
- **Robustheit:** Widersprueche werden beim Laden gegen bekannte Hinweise und gueltige Gruende
  validiert; Slider gegen NaN abgesichert.

---

## 5. Barrierefreiheit - real gepruefte Kontraste (WCAG 2.2 AA, >=4.5:1)

| Vordergrund / Hintergrund | Kontrast |
|---|---|
| ink (#1e2a2b) / bg (#f7f3ec) | 13,4:1 |
| ink / surface (#ffffff) | 14,8:1 |
| muted (#4f5e5a) / bg | 6,2:1 |
| muted / surface | 6,8:1 |
| primary (#0e5c57) / bg (Links/Headlines) | 7,1:1 |
| weiss / primary (Buttons) | 7,8:1 |
| accent (#8a5a12) / surface (Text-Akzent) | 5,9:1 |
| accent-ink (#6b4410) / accent-soft (#f3e6cc) (Badges) | 6,9:1 |

Fokus-Outline `--c-focus` (#1d6fa3) auf bg = 4,9:1 (Outline-Anforderung SC 1.4.11 nur >=3:1).
Kleinste verwendete Schrift: `text-sm` = 14px (kein `text-xs`). Globale Schriftskalierung
16px -> ~19px ueber `--font-scale` (alle rem-Groessen ziehen mit). Tap-Flaechen >=44px via `.tap`.
`prefers-reduced-motion` wird respektiert.

---

## 6. Bewusste Auslassungen & Abweichungen vom Auftrag

- **PWA - Service Worker bewusst weggelassen.** `manifest.json` und App-Icon liegen unter
  `public/` (Theme-Color, Standalone, maskable Icon) und `src/app/icon.svg` als Favicon, sodass
  "Zum Startbildschirm hinzufuegen" funktioniert. Ein Service Worker wurde NICHT eingebaut, um
  Caching-Verwirrung im Evaluationskontext (veraltete Staende bei Testpersonen) zu vermeiden -
  wie im Auftrag (§3, "wenn es Reibung erzeugt, weglassen und im Build-Report vermerken")
  ausdruecklich gestattet.
- **shadcn/ui nicht per CLI.** Die benoetigten Komponenten (Switch, Dialog, Tabs, Accordion,
  Slider, Tooltip/Popover) sind als eigene, barrierefreie Tailwind-Komponenten nachgebaut -
  gleiches Verhalten, weniger Setup-Reibung. Im Auftrag (§3) explizit als Option vorgesehen.
- **`package.json` Start-Command abgewichen:** statt `next start -p ${PORT:-3000}` wird
  `next start` verwendet. Begruendung: die Shell-Expansion `${PORT:-3000}` bricht unter dem
  npm-Default-Shell `cmd.exe` auf Windows, wodurch `npm run start` lokal scheitern wuerde (§11
  fordert aber, dass es lokal laeuft). `next start` liest die `PORT`-Umgebungsvariable automatisch:
  lokal ohne `PORT` -> 3000, auf Railway -> das von Railway gesetzte `$PORT`. Damit ist der
  Auftrags-Intent ("Next.js liest `PORT` aus der Umgebung; Railway setzt ihn automatisch")
  plattformuebergreifend erfuellt. Verifiziert: `PORT=3210 next start` bindet auf 3210.
- **Kontrafaktik fuer Szenario "reise" enthalten.** Statt C wegzulassen, ist ein einfacher
  Regler "Wochen bis zur Abreise" -> Dringlichkeitstext umgesetzt, damit der XAI-Umschalter auf
  allen Hinweisen konsistent drei Varianten zeigt. Der `detail`-Text vermerkt ausdruecklich, dass
  sich die kontrafaktische Betrachtung bei regelbasierten Hinweisen auf den zeitlichen Vorlauf
  bezieht (nicht auf gewichtete Modellfaktoren) - das ist der im Auftrag (§5) genannte legitime,
  beschreibbare Befund.
- **Betreuung-Klarname** "Ann-Kathrin Kubullek, M.A." steht bewusst und exakt gemaess Auftrag
  (§7.5) im Quellcode. Das ist keine Realdaten-Verletzung, sondern eine geforderte akademische
  Nennung; es sind keine echten Patienten-/Gesundheitsdaten betroffen.

---

## 7. Naechster Schritt: Deployment

Repo committen, auf Railway als "Deploy from GitHub Repo" anlegen, Domain generieren (siehe
[README.md](README.md), Abschnitt Deployment). Build-Command `npm run build`, Start-Command
`npm run start`, Node 20+. Nach dem Deploy die generierte oeffentliche URL auf einem echten
Smartphone testen - das ist der Artefakt-Link fuer die Evaluation.

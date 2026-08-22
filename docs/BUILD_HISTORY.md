# VORSICHT - Build-Auftrag fuer Claude Code

Dies ist ein vollstaendiger, autonom auszufuehrender Bauauftrag. Arbeite ihn von oben nach unten ab. Frage nicht nach, sondern entscheide im Zweifel im Sinne der hier festgelegten Regeln. Am Ende dieses Dokuments steht eine Verifikations-Schleife, die du mehrfach durchlaufen musst, bis jeder Punkt erfuellt ist.

---

## 0. WAS DU HIER BAUST (in einem Satz)

Eine mobile-first Web-App namens VorSicht, die fiktiven Nutzerinnen und Nutzern aus synthetischen Gesundheitsdaten erklaerbare Vorsorge-Hinweise anzeigt, und zwar so, dass jeder Hinweis transparent begruendet, in der Tiefe einstellbar, quellenbelegt, alterszugaenglich, nicht-alarmistisch und vollstaendig nutzerkontrolliert ist.

Die App ist ein **Forschungs-Artefakt** fuer ein Hochschulprojekt (Design Science Research), kein Produkt und kein Medizinprodukt. Sie dient als Evaluationsobjekt fuer qualitative Interviews mit Think-Aloud-Walkthrough.

---

## 1. DAS EISERNE GESETZ (NICHT VERHANDELBAR)

1. **Nur synthetische Mock-Daten.** Es gibt keine echten Patientendaten, keine echte ePA-Anbindung, kein echtes Wearable, kein Backend mit Personendaten. Alle Daten sind frei erfunden und liegen statisch im Code.
2. **Kein Medizinprodukt.** In der App muss an sichtbarer, dauerhafter Stelle (Footer auf jedem Screen plus Hinweis im Onboarding) stehen: "Demonstrator mit fiktiven Daten. Kein Medizinprodukt. Keine medizinische Beratung." Dieser Hinweis darf nicht wegklickbar dauerhaft verschwinden.
3. **Nur mobile Anwendung.** Es gibt KEIN Desktop-Layout als eigenes Designziel. Die App wird mobile-first gebaut und auf einem schmalen Viewport (Referenz 390px Breite, iPhone-Klasse) optimiert. Auf groesseren Screens wird die mobile Ansicht zentriert in einem Geraeterahmen dargestellt (max. Inhaltsbreite 430px), damit Testpersonen auf jedem Geraet dieselbe mobile Erfahrung sehen. Keine Requirement und kein Feature darf eine Desktop-spezifische Vorgabe enthalten.
4. **Deutsch als Sprache der Oberflaeche.** Alle sichtbaren Texte sind auf Deutsch.
5. **Barrierefreiheit ist eingebaut, nicht optional.** Schrift ab 14px, Kontrast ab 4.5:1, Tap-Flaechen ab 44x44px. Das ist Teil der Forschung (RQ2), nicht Kosmetik.

---

## 2. PROJEKTKONTEXT (damit du gute Mikro-Entscheidungen triffst)

**Projekt:** VorSicht, Modul "Menschzentrierte Technikentwicklung fuer eine digitale Gesellschaft", Master HCI, Hochschule Ruhr West, SoSe 2026.

**Zielgruppe:** digital-affine Erwachsene ab 20 Jahren (Generation Z) im Ruhrgebiet. Wearable-Nutzung ist optional. Es geht um Praevention, Lifestyle-Monitoring und Trendanalysen, NICHT um klinische Versorgung und NICHT um chronische Erkrankungen.

**Forschungsfrage (Haupt):** Wie muss eine erklaerbare, nutzergerechte Benutzeroberflaeche gestaltet sein, damit diese Zielgruppe KI-basierte Gesundheitshinweise als vertrauenswuerdig, verstaendlich und handlungsrelevant erlebt?

- RQ1 (Verstaendlichkeit/XAI): Welche Erklaerungsstrategie hilft medizinisch nicht vorgebildeten Personen am besten beim Verstehen?
- RQ2 (Nutzergerechte Gestaltung): Welche Gestaltungsmerkmale machen die Oberflaeche fuer alle nutzbar, unabhaengig von digitaler Vorerfahrung und Gesundheitskompetenz?
- RQ3 (Datenkontrolle): Wie viel Kontrolle ueber die eigenen Daten brauchen Nutzende, um der gemeinsamen Auswertung von ePA- und Wearable-Daten zuzustimmen?

**Die drei XAI-Erklaervarianten** (zentral fuer RQ1, die App muss alle drei umsetzen und umschaltbar machen):
- Variante A natuerlichsprachlich: ein erklaerender Klartext-Satz.
- Variante B visuell: Balken/Diagramm der Einflussfaktoren mit Gewichtung.
- Variante C kontrafaktisch: "Was waere, wenn"-Darstellung mit veraenderbarem Faktor.

**Drei Szenarien:**
- Szenario 3 LIFESTYLE ist der voll ausimplementierte Hauptpfad (Schlaf, Stress/HRV, Aktivitaet). Passt am besten zur Gen-Z-Praevention.
- Szenario 1 KARDIOMETABOLISCH ist ein kuerzerer Nebenpfad (Herz-Kreislauf-Trend).
- Szenario 2 REISE & IMPFUNG ist ein kuerzerer Nebenpfad (regelbasierter Impfhinweis vor einer Reise).

---

## 3. TECH-STACK (verbindlich, auf Railway lauffaehig)

- **Framework:** Next.js 14+ mit App Router, TypeScript.
- **Styling:** Tailwind CSS. Komponenten mit shadcn/ui, wo sinnvoll (Button, Card, Dialog, Switch, Tabs, Slider, Tooltip, Accordion). Wenn shadcn-Setup zu viel Reibung erzeugt, baue die wenigen Komponenten als eigene Tailwind-Komponenten nach, gleiches Verhalten.
- **State:** rein clientseitig, React State und Context. Kein externer State-Store noetig. Der Widerspruchs- und Einstellungs-State darf in `localStorage` gehalten werden (das ist erlaubt, weil dies eine echte, ausserhalb von Claude.ai gehostete App ist, keine Artefakt-Sandbox).
- **Daten:** statische TypeScript-Dateien unter `src/data/`. Kein echtes Backend, keine externe API.
- **Icons:** lucide-react.
- **Fonts:** ueber `next/font`. Body gut lesbar (z. B. "Source Sans 3" oder "Public Sans"), Display/Headline charaktervoll, aber seriös (z. B. "Fraunces" oder "Bricolage Grotesque"). KEINE generischen System-Fonts, kein Inter als Hauptschrift. Achte trotzdem auf hohe Lesbarkeit (Forschungskontext Gesundheit).
- **Rendering:** Wo moeglich statisch (kann als statische Next-App deployen). Interaktivitaet via Client Components.
- **PWA (Kuer, einbauen wenn ohne Mehraufwand moeglich):** `manifest.json` plus minimaler Service Worker, damit "Zum Startbildschirm hinzufuegen" moeglich ist. Wenn es Reibung erzeugt, weglassen und im Build-Report vermerken.

---

## 4. ORDNERSTRUKTUR (Soll-Zustand)

```
vorsicht/
  README.md                      <- Kurzanleitung Start/Deploy (du erzeugst sie)
  package.json
  next.config.js
  tailwind.config.ts
  tsconfig.json
  public/
    manifest.json                (PWA, optional)
    icons/                       (PWA-Icons, optional)
  src/
    app/
      layout.tsx                 <- globales Layout, Geraeterahmen, Footer-Disclaimer, Fonts
      globals.css                <- Designtokens als CSS-Variablen, Tailwind base
      page.tsx                   <- Onboarding/Einwilligung (Start)
      dashboard/page.tsx         <- Dashboard mit Hinweis-Karten aller Szenarien
      hinweis/[id]/page.tsx      <- Detailansicht eines Hinweises mit XAI-Panel
      einstellungen/page.tsx     <- Datenkontrolle (DF11) + Widersprueche-Uebersicht
      ueber/page.tsx             <- Transparenzseite: Mock-Daten, Methode, Forschungskontext
    components/
      DeviceFrame.tsx            <- zentrierter Mobile-Rahmen fuer Desktop-Betrachter
      Disclaimer.tsx             <- dauerhafter Footer-Hinweis (eisernes Gesetz 2)
      HinweisCard.tsx            <- Karte auf dem Dashboard
      ExplanationPanel.tsx       <- DF3: drei Erklaertiefen (Kurz/Begruendung/Detail)
      XaiVariantSwitch.tsx       <- RQ1: Umschalter A natuerlichsprachlich / B visuell / C kontrafaktisch
      FactorBars.tsx             <- DF1/Variante B: Einflussfaktoren als Balken
      CounterfactualSlider.tsx   <- DF4/Variante C: "Was waere, wenn"-Regler
      ProvenanceChip.tsx         <- DF5/DF6: Herkunfts-Chip (Quelle, Datum, Sensor)
      ActionCard.tsx             <- DF9: lokale Handlungsoption (Ruhrgebiet)
      UncertaintyBadge.tsx       <- DF2: "Hinweis, keine Diagnose" + Abklaerung
      GlossarTerm.tsx            <- DF8: Fachbegriff antippbar -> B1-Erklaerung
      ObjectionButton.tsx        <- DF12: "Diese Empfehlung passt nicht zu mir"
      FontSizeToggle.tsx         <- DF7: groessere Schrift
      DataSourceToggle.tsx       <- DF11: Schalter pro Datenquelle
    context/
      SettingsContext.tsx        <- Schriftgroesse, Datenquellen-Schalter, Widersprueche
    data/
      profile.ts                 <- fiktive Person (Gen-Z, Ruhrgebiet)
      epa.ts                     <- synthetische ePA-Eintraege (FHIR-R5-nah)
      wearable.ts                <- synthetische Wearable-Streams
      hinweise.ts                <- die Hinweis-Objekte aller drei Szenarien
      glossar.ts                 <- B1-Erklaerungen der Fachbegriffe
      angebote.ts                <- lokale Ruhrgebiet-Angebote (fiktiv/plausibel)
    lib/
      types.ts                   <- TypeScript-Typen
      featureMap.ts              <- explizite Zuordnung DF -> Komponente (fuer Verifikation)
```

---

## 5. SYNTHETISCHE DATEN (fiktiv, FHIR-R5-nah, NICHT echt)

Lege die folgenden Daten in `src/data/` an. Halte die Struktur an FHIR R5 angelehnt (Resource-Typen wie `Patient`, `Observation`, `Immunization`, `Condition`), aber vereinfacht. Markiere jeden Datensatz klar als synthetisch (`synthetic: true`).

### profile.ts (eine fiktive Person)
- Name: "Mara K." (Pseudonym), Alter 24, wohnhaft in Essen (Ruhrgebiet).
- Hinweis im Datenobjekt: `synthetic: true`, `note: "Frei erfundene Person fuer Demonstrationszwecke."`

### epa.ts (synthetische ePA-Eintraege, je mit Datum und ausstellender Einrichtung)
Beispiele (du darfst plausibel ergaenzen, aber alles fiktiv):
- Observation Blutdruck 128/82 mmHg, Datum 2026-03-14, Quelle "Hausarztpraxis Essen-Ruettenscheid".
- Observation Cholesterin gesamt 195 mg/dl, Datum 2026-02-02, Quelle "Labor MVZ Essen".
- Immunization Tetanus, letzte Auffrischung 2017-08-20, Quelle "Hausarztpraxis Essen-Ruettenscheid".
- Immunization Hepatitis A: KEIN Eintrag (fehlt absichtlich, fuer Szenario 2).
- Condition: bewusst KEINE chronische Erkrankung (Zielgruppe Gen-Z, Praevention).
Jeder Eintrag traegt: `id`, `kind`, `value`, `date`, `issuer`, `synthetic: true`.

### wearable.ts (synthetische Streams, je mit Zeitraum und Sensorart)
- Schlafdauer letzte 14 Tage: Werte um 5.5-6.5 h, klar fallender 14-Tage-Trend. Sensorart "Schlafsensor (Smartwatch)".
- Ruhepuls letzte 14 Tage: leicht steigend. Sensorart "optischer Pulssensor".
- HRV (Herzfrequenzvariabilitaet) letzte 14 Tage: leicht fallend. Sensorart "optischer Pulssensor".
- Schritte/Aktivitaet letzte 14 Tage: schwankend, leicht unter persoenlichem Schnitt. Sensorart "Beschleunigungssensor".
Jeder Stream traegt: `id`, `metric`, `series` (Array aus {date, value}), `sensor`, `period`, `synthetic: true`.

### hinweise.ts (die Hinweis-Objekte)
Erzeuge drei Hinweise, je einem Szenario zugeordnet. Jeder Hinweis ist ein Objekt mit dieser Struktur (Typ in types.ts):

```
Hinweis {
  id: string                       // z. B. "lifestyle-schlaf"
  szenario: "lifestyle" | "kardiometabolisch" | "reise"
  titel: string                    // nicht-alarmistisch, sachlich
  kurz: string                     // Variante A natuerlichsprachlich, 1 Satz
  begruendung: string              // Erklaertiefe 2
  detail: string                   // Erklaertiefe 3 (Methode, Datenquellen)
  faktoren: Faktor[]               // Variante B visuell: {label, gewicht (0-1), quelleRef}
  kontrafaktisch: {                // Variante C
     faktorLabel: string           // z. B. "Schlafdauer"
     einheit: string               // z. B. "h pro Nacht"
     aktuell: number
     min: number
     max: number
     schritt: number
     wirkung: (wert:number)=>string // Text, der sich mit dem Regler aendert
  }
  unsicher: boolean                // true -> UncertaintyBadge
  quellen: Provenance[]            // {art:"epa"|"wearable", label, date|period, issuer|sensor}
  aktionen: Aktion[]               // lokale Ruhrgebiet-Angebote (aus angebote.ts referenziert)
  synthetic: true
}
```

Inhaltliche Vorgaben pro Hinweis:

**lifestyle (Hauptpfad, am ausfuehrlichsten):**
- titel: "Dein Schlaf zeigt seit zwei Wochen einen Abwaertstrend"
- kurz (A): "Deine Schlafdauer ist in den letzten 14 Tagen im Schnitt gesunken, gleichzeitig ist dein Ruhepuls leicht gestiegen. Das deutet auf weniger Erholung hin."
- faktoren (B): Schlafdauer 0.45, Ruhepuls 0.25, HRV 0.20, Aktivitaet 0.10.
- kontrafaktisch (C): Faktor "Schlafdauer", aktuell 5.8, min 4, max 9, schritt 0.5; wirkung gibt je nach Wert einen sachlichen Satz aus (mehr Schlaf -> entspannterer Hinweis).
- unsicher: false.
- quellen: Wearable Schlafsensor letzte 14 Tage, Wearable optischer Pulssensor letzte 14 Tage.
- aktionen: kostenfreier Stress-/Schlaf-Workshop Stadt Essen (fiktiv-plausibel), Hinweis auf Krankenkassen-Bonus.

**kardiometabolisch (Nebenpfad):**
- titel: "Dein Blutdruckwert liegt im oberen Normalbereich"
- kurz (A): sachlich, dass der zuletzt in der ePA dokumentierte Blutdruck im oberen Normbereich liegt und der Ruhepuls-Trend dazu passt.
- faktoren (B): Blutdruck (ePA) 0.5, Ruhepuls (Wearable) 0.3, Aktivitaet 0.2.
- kontrafaktisch (C): Faktor "Aktive Minuten pro Woche", aktuell 90, min 0, max 300, schritt 30.
- unsicher: true (Modellkonfidenz niedrig -> UncertaintyBadge sichtbar, Verweis auf aerztliche Abklaerung).
- quellen: ePA Blutdruck (Datum, Hausarztpraxis), Wearable Ruhepuls.
- aktionen: Herz-Kreislauf-Check-Angebot im Ruhrgebiet (fiktiv-plausibel).

**reise (Nebenpfad, regelbasiert):**
- titel: "Vor deiner Reise: ein Impfschutz fehlt"
- kurz (A): "Fuer dein Reiseziel wird Hepatitis A empfohlen. In deiner ePA ist dazu kein Eintrag hinterlegt. Eine Tetanus-Auffrischung ist ebenfalls bald faellig."
- faktoren (B): regelbasiert darstellen (Reiseziel-Regel + ePA-Impfstatus), Gewichte als zwei Bloecke.
- kontrafaktisch (C): hier optional einfacher (z. B. Faktor "Wochen bis Abreise" -> Dringlichkeitstext). Wenn zu kuenstlich, kontrafaktisch fuer dieses Szenario weglassen und im Detail vermerken, dass C bei regelbasierten Hinweisen nicht sinnvoll ist (das ist ein legitimer, beschreibbarer Befund).
- unsicher: false.
- quellen: ePA Impfstatus (Tetanus Datum), ePA (Hepatitis A fehlt).
- aktionen: Hinweis "Sprich deine Hausarztpraxis an" plus Reisemedizin-Beratungsstelle Ruhrgebiet (fiktiv-plausibel).

### glossar.ts
B1-Erklaerungen mindestens fuer: HRV, Ruhepuls, Blutdruck (systolisch/diastolisch), Cholesterin, kardiovaskulaer, STIKO. Jeweils ein bis zwei einfache Saetze.

### angebote.ts
Fiktiv-plausible lokale Angebote im Ruhrgebiet mit Feldern {id, titel, ort, traeger, hinweis}. Klar als Beispiel markiert.

---

## 6. DESIGNSYSTEM (Tokens in globals.css als CSS-Variablen)

Lege ein konsistentes, ruhiges, vertrauenswuerdiges Designsystem an. Nicht-alarmistisch ist Pflicht (DF10): kein Alarmrot als Flaechenfarbe, keine dramatische Lexik, keine Schock-Visuals.

- **Farbwelt:** ruhige, gedeckte Palette. Eine bedaechtige Primaerfarbe (z. B. ein tiefes Petrol/Teal oder ein gedaempftes Gruenblau), warmes Off-White als Hintergrund, ein dunkler Lesetext-Ton. Akzent sparsam. Risiko/Aufmerksamkeit wird NICHT ueber Rot, sondern ueber ruhige Kennzeichnung und Text geloest.
- **Kontrast:** jeder Text/Hintergrund mindestens 4.5:1 (WCAG 2.2 AA). Pruefe das real, nicht nur nach Gefuehl.
- **Schrift:** Basis 16px, nie unter 14px fuer Inhaltstext. Schriftgroessen-Umschalter (DF7) skaliert die Basis (z. B. 16px -> 19px) ueber eine CSS-Variable, die alle rem-Groessen mitzieht.
- **Tap-Flaechen:** interaktive Elemente mindestens 44x44px.
- **Abstand/Rhythmus:** grosszuegig, ruhig, klare Hierarchie. Eine Hauptaktion pro Screen sichtbar.
- **Motion:** dezent. Sanfte Reveals beim Oeffnen der Erklaertiefen und beim Umschalten der XAI-Varianten. Nichts Hektisches.

---

## 7. SCREENS (Soll-Verhalten, Screen fuer Screen)

### 7.1 Onboarding / Einwilligung  (app/page.tsx)
- Kurzer Willkommenstext: was VorSicht ist (erklaerbare Vorsorge-Hinweise), eine Zeile.
- **Prominenter Mock-Hinweis** (eisernes Gesetz 2): fiktive Daten, kein Medizinprodukt.
- Erste Stufe der Datenkontrolle (DF11 Vorschau): zwei Schalter "ePA-Daten verwenden" und "Wearable-Daten verwenden", beide standardmaessig an, beide abschaltbar. Erklaerzeile, dass Abschalten erlaubt und folgenlos ist.
- Button "Starten" -> /dashboard.
- Link "Mehr ueber dieses Projekt" -> /ueber.

### 7.2 Dashboard  (app/dashboard/page.tsx)
- Begruessung mit Pseudonym ("Hallo Mara").
- Liste von HinweisCard, eine pro Hinweis (lifestyle zuerst und visuell hervorgehoben als Hauptpfad, dann kardiometabolisch, dann reise).
- Jede HinweisCard zeigt: Titel (sachlich), eine Zeile Kurzfassung, einen ruhigen Statusindikator (KEIN Alarmrot), und einen klaren "Ansehen"-Button -> /hinweis/[id].
- Wenn eine Datenquelle in den Einstellungen abgeschaltet ist, zeigen betroffene Karten sichtbar "nutzt abgeschaltete Quelle: ..." statt Inhalte zu faken (Konsistenz mit DF11).
- Footer-Disclaimer dauerhaft sichtbar.

### 7.3 Hinweis-Detail  (app/hinweis/[id]/page.tsx)  <- HERZSTUECK, hier sitzen die meisten DF
Aufbau von oben nach unten:
1. Titel + ggf. UncertaintyBadge (DF2), wenn `unsicher: true`.
2. **XaiVariantSwitch** (RQ1): drei Tabs/Segmente "In Worten" (A), "Visuell" (B), "Was waere, wenn" (C). Standard ist A.
   - A natuerlichsprachlich: zeigt `kurz` als gut lesbaren Klartext.
   - B visuell: FactorBars rendert `faktoren` als horizontale Balken mit Prozent-Gewicht und Label. (DF1)
   - C kontrafaktisch: CounterfactualSlider rendert `kontrafaktisch`; beim Ziehen aendert sich der Wirkungstext live. (DF4)
3. **ExplanationPanel** (DF3): drei Tiefen als Accordion/Stufen "Kurz" / "Begruendung" / "Detail", entspricht `kurz` / `begruendung` / `detail`. Standard: Kurz offen.
4. **Datenherkunft:** unter den Werten ProvenanceChip je Quelle (DF5 ePA: Quelle+Datum+Einrichtung; DF6 Wearable: Zeitraum+Sensorart), antippbar fuer Details.
5. **Fachbegriffe** im Text sind GlossarTerm (DF8): gestrichelt unterstrichen, Antippen oeffnet B1-Erklaerung als Tooltip/Popover.
6. **ActionCard** (DF9): mindestens eine lokale Ruhrgebiet-Handlungsoption aus `aktionen`. Sachlich, nicht-alarmistisch (DF10).
7. **ObjectionButton** (DF12): "Diese Empfehlung passt nicht zu mir" -> oeffnet Dialog mit drei vordefinierten Gruenden (medizinisch geklaert / persoenlich anders bewertet / technischer Fehler) plus optionalem Freitext. Auswahl wird in SettingsContext + localStorage gespeichert und der Hinweis sichtbar als "widersprochen" markiert. In /einstellungen sind alle Widersprueche gelistet.
8. Footer-Disclaimer dauerhaft sichtbar.

### 7.4 Einstellungen / Datenkontrolle  (app/einstellungen/page.tsx)
- **DataSourceToggle** (DF11): ein Schalter PRO Datenquelle, getrennt je ePA-Kategorie (Vitalwerte, Labor, Impfungen) UND je Wearable-Stream (Schlaf, Puls, HRV, Aktivitaet). Abgeschaltete Quellen werden app-weit als "nicht genutzt" behandelt.
- **FontSizeToggle** (DF7): groessere Schrift global.
- **Widersprueche-Uebersicht:** Liste aller via DF12 gespeicherten Widersprueche mit Grund, loeschbar.
- Footer-Disclaimer.

### 7.5 Ueber / Transparenz  (app/ueber/page.tsx)
- Erklaert: Forschungskontext (Master HCI HRW SoSe 2026), Mock-Daten, kein Medizinprodukt, Zweck als Evaluationsobjekt.
- Betreuung: "Ann-Kathrin Kubullek, M.A." (genau so, kein weiterer Name).
- Kurzdefinition Wearable (analog zur Projektdefinition: Smartwatches, smarte Ringe, smarte Blutdruckmanschetten, CGM-Systeme, EKG-Pflaster, Pulsoximeter; ohne kontinuierliche Erfassung/Schnittstelle faellt ein Geraet nicht darunter).

### 7.6 Globales Layout  (app/layout.tsx)
- DeviceFrame: auf breiten Viewports die App zentriert in einem schlichten Geraeterahmen (max ~430px), damit Desktop-Betrachter dieselbe mobile Ansicht sehen. Auf schmalen Viewports full-bleed.
- Disclaimer-Footer auf jedem Screen.
- Fonts via next/font.

---

## 8. DF-ZU-KOMPONENTE-ZUORDNUNG  (lib/featureMap.ts, Pflicht fuer Verifikation)

Lege diese Map explizit als exportierte Konstante an. Jeder Eintrag: DF-Id, Requirement, Komponente/Screen, Akzeptanzkriterium. Dies ist die Checkliste, die du in der Verifikation (Abschnitt 10) abarbeitest.

| DF   | setzt um | Komponente / Ort                    | Akzeptanzkriterium (sichtbar/testbar) |
|------|----------|-------------------------------------|----------------------------------------|
| DF1  | DR1      | FactorBars in XaiVariantSwitch (B)  | Mind. 2 staerkste Faktoren mit relativer Gewichtung sichtbar |
| DF2  | DR2      | UncertaintyBadge (Hinweis-Detail)   | Bei `unsicher:true` Label "Hinweis, keine Diagnose" + Verweis auf aerztliche Abklaerung |
| DF3  | DR3      | ExplanationPanel                    | Drei Tiefen Kurz/Begruendung/Detail umschaltbar |
| DF4  | DR4      | CounterfactualSlider (C)            | Regler aendert Wirkungstext live |
| DF5  | DR5      | ProvenanceChip (ePA)                | ePA-Wert zeigt Quelle + Datum + Einrichtung |
| DF6  | DR6      | ProvenanceChip (Wearable)           | Wearable-Wert zeigt Zeitraum + Sensorart |
| DF7  | DR7      | FontSizeToggle + Designtokens       | Schrift >=14px, Kontrast >=4.5:1, Tap >=44px, Schriftgroesse umschaltbar |
| DF8  | DR8      | GlossarTerm                         | Fachbegriff antippbar -> B1-Erklaerung |
| DF9  | DR9      | ActionCard                          | Mind. 1 lokale Ruhrgebiet-Handlungsoption pro Risikoaussage |
| DF10 | DR10     | Designsystem + Texttonalitaet       | Kein Alarmrot, sachliche Sprache durchgaengig |
| DF11 | DR11     | DataSourceToggle                    | Schalter pro ePA-Kategorie und pro Wearable-Stream, Wirkung app-weit |
| DF12 | DR12     | ObjectionButton                     | Widerspruch mit 3 Gruenden + Freitext, gespeichert, markiert |

---

## 9. BAU-REIHENFOLGE (so arbeitest du den Build ab)

1. Next.js-Projekt initialisieren, Tailwind, TypeScript, lucide-react, Fonts. App startet leer.
2. Designtokens in globals.css, layout.tsx mit DeviceFrame + Disclaimer + Fonts.
3. types.ts, dann alle data/-Dateien (profile, epa, wearable, glossar, angebote, hinweise). featureMap.ts.
4. SettingsContext (Schriftgroesse, Datenquellen-Schalter, Widersprueche; localStorage-Persistenz).
5. Atom-Komponenten: Disclaimer, ProvenanceChip, GlossarTerm, UncertaintyBadge, ActionCard, FontSizeToggle, DataSourceToggle, ObjectionButton.
6. Komplex-Komponenten: FactorBars, CounterfactualSlider, ExplanationPanel, XaiVariantSwitch, HinweisCard.
7. Screens: Onboarding -> Dashboard -> Hinweis-Detail -> Einstellungen -> Ueber.
8. Verdrahtung: Datenquellen-Schalter wirken auf Dashboard/Detail; Widerspruch wirkt auf Markierung + Einstellungen.
9. README.md mit Start- und Railway-Deploy-Anleitung.
10. Verifikationsschleife (Abschnitt 10) starten.

---

## 10. VERIFIKATIONSSCHLEIFE (mehrfach durchlaufen, bis ALLES gruen)

Fuehre nach dem ersten lauffaehigen Stand die folgenden Durchgaenge nacheinander aus. Behebe jeden Fund SOFORT und wiederhole den jeweiligen Durchgang, bis er ohne Fund bleibt. Erst dann zum naechsten Durchgang. Am Ende alle Durchgaenge noch einmal komplett.

**Durchgang A - Build & Typen:**
- `npm run build` laeuft ohne Fehler. Keine TypeScript-Fehler, keine ungenutzten kritischen Imports. Behebe alles.

**Durchgang B - Feature-Vollstaendigkeit (gegen featureMap.ts):**
- Gehe die 12-Zeilen-Tabelle Zeile fuer Zeile durch. Oeffne den jeweiligen Screen mental/real und pruefe das Akzeptanzkriterium. Notiere pro DF: erfuellt ja/nein. Bei nein: implementieren, dann Durchgang B neu.

**Durchgang C - Drei XAI-Varianten:**
- Auf dem Hinweis-Detail lassen sich A/B/C umschalten, jede zeigt sichtbar andere Darstellung, C reagiert live auf den Regler. Wenn eine Variante leer/kaputt ist: fixen, Durchgang C neu.

**Durchgang D - Eisernes Gesetz:**
- Mock-Disclaimer auf JEDEM Screen sichtbar. Keine Desktop-spezifische Vorgabe. Sprache durchgaengig Deutsch. Kein Alarmrot. Betreuung exakt "Ann-Kathrin Kubullek, M.A." und kein zweiter Name. Bei Verstoss: fixen, Durchgang D neu.

**Durchgang E - Barrierefreiheit (RQ2/DR7):**
- Kontraste real pruefen (>=4.5:1). Interaktive Elemente >=44px. Schriftgroessen-Umschalter wirkt global. Tastatur-Fokus sichtbar. Bei Verstoss: fixen, Durchgang E neu.

**Durchgang F - Datenkontrolle & Widerspruch (DR11/DR12):**
- Datenquelle abschalten -> betroffene Inhalte werden app-weit als "nicht genutzt" markiert, nicht gefaket. Widerspruch speichern -> Hinweis markiert + in Einstellungen gelistet + nach Reload noch da (localStorage). Bei Verstoss: fixen, Durchgang F neu.

**Durchgang G - Realdaten-Check:**
- Sicherstellen, dass NIRGENDS echte Personendaten, echte Endpunkte oder echte API-Keys stehen. Alles `synthetic: true`. Bei Fund: entfernen, Durchgang G neu.

**Abschluss:** A bis G am Stueck wiederholen. Erst wenn alle sieben in Folge ohne Fund bleiben, ist der Build fertig. Schreibe einen kurzen BUILD_REPORT.md: was steht, was bewusst weggelassen (z. B. PWA), Stand jeder DF-Zeile.

---

## 11. DEPLOYMENT AUF RAILWAY

Ziel: eine oeffentliche URL, die jedes Teammitglied und jede Testperson ohne Login im Handy-Browser oeffnet.

1. Sicherstellen, dass `npm run build` und `npm run start` lokal laufen (Next.js Standard).
2. Git-Repo initialisieren und committen.
3. Auf Railway ein neues Projekt aus dem Repo anlegen (Deploy from GitHub Repo oder `railway up` via Railway CLI).
4. Railway erkennt Next.js automatisch. Falls nicht: Start-Command `npm run start`, Build-Command `npm run build`, Node 20+.
5. Port: Next.js liest `PORT` aus der Umgebung; Railway setzt ihn automatisch. Keine zusaetzliche Config noetig, wenn `next start -p $PORT` genutzt wird. Stelle in package.json sicher: `"start": "next start -p ${PORT:-3000}"`.
6. Nach dem Deploy die generierte Domain unter Settings -> Networking -> Generate Domain oeffentlich machen.
7. Diese URL ist der Artefakt-Link fuer die Abgabe und die Evaluation. Teste sie auf einem echten Smartphone.

Wenn ein Railway-Schritt scheitert, gib die genaue Fehlermeldung aus und schlage den konkret naechsten Schritt vor, statt abzubrechen.

---

## 12. WAS DU AM ENDE LIEFERST

- Lauffaehige App lokal (`npm run dev`).
- Erfolgreicher `npm run build`.
- BUILD_REPORT.md mit DF-Status (alle 12) und Liste bewusster Auslassungen.
- README.md mit Start- und Railway-Anleitung.
- Die oeffentliche Railway-URL (nach Deploy).

Arbeite jetzt los. Halte das eiserne Gesetz ein. Nutze die Verifikationsschleife so oft wie noetig.

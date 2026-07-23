# TITAN — Katalog interaktiver Lern-Module

> Stand 2026-07-16. Build-Spezifikation für die interaktiven Werkzeuge der Phase „Anwenden" (Phase 3) — und darüber hinaus. Grundlage: die vier IHK-Handlungsbereiche, die fünf Lehrbücher (`docs/quellen/`, gitignored) und die 46 vorhandenen Planeten/Themen.

## Leitprinzipien

1. **Star-Company = roter Faden.** Jedes Modul operiert auf `norive-kompass-v1` (dem fiktiven Übungsunternehmen des Lerners) und erzeugt ein **Artefakt**. Alle Artefakte fügen sich am Ende zum individuellen **IHK-Präsentations-Deck** zusammen („Missions-Launch", der USP). Ein Modul, das nichts fürs Deck produziert, ist unvollständig gedacht.
2. **Engine + Content-Pack.** Module sind **wiederverwendbare, parametrierte Typen**, die per `werkzeug`-Feld einem Planeten zugewiesen werden — kein Einzelstück pro Thema. Ein neuer Fachwirt = neues Content-Pack, dieselben Module.
3. **Zwei Stufen.**
   - **Stufe A — deterministisch** (Rechner, Matrizen, Sortierer, Sequenzer): sofort baubar, kostenlos, offline, keine KI. Der Großteil.
   - **Stufe B — KI-gestützt** (Freitext-Feedback, Fall-Rekontextualisierung): braucht das n8n/Claude-Backend (Roadmap Phase 3). Veredelt einzelne Module, ist aber **kein Blocker**.
4. **Artefakt-Vertrag (einheitlich).** Jedes Modul schreibt beim Abschluss ein JSON in den Fortschritt:
   ```ts
   interface Artefakt {
     planetSlug: string;
     modul: string;          // werkzeug-Key
     titel: string;          // fürs Deck, z. B. "SWOT-Analyse — Musterfrau GmbH"
     erstelltAm: string;     // ISO
     daten: unknown;         // modulspezifische Struktur (unten je Modul)
     deckReif: boolean;      // fürs Präsentations-Deck freigegeben
   }
   ```

## Umsetzungs-Status heute (aktualisiert 2026-07-21)

**Die Engine steht.** `src/scripts/module-engine.ts` ist ein generischer Modul-Renderer mit einheitlichem **Artefakt-Vertrag**: Jedes Modul mountet in `#modul-mount` (Phase „Anwenden" der Lernseite), liest die Star-Company und schreibt beim Speichern ein Artefakt über das Event `norive:artefakt-speichern` → `norive-progress.ts` (persistiert + gesynct; einziger Schreiber). Die Deck-Ansicht (`src/pages/deck.astro`) sammelt die `deckReif`-Artefakte bereits ein — die **Vorstufe des Missions-Launch**.

**Implementiert (7 Modultypen, alle Stufe A, deterministisch):** `swot`, `smart`, `deckungsbeitrag`, `marktanteil`, `preisberechnung`, `vier-stufen`, `scoring`. Das `werkzeug`-Enum (`src/content.config.ts`) führt exakt diese 7 Werte; **13 der 46 Planeten** haben ein Werkzeug zugewiesen (`swot` ×3, `smart` ×3, `scoring` ×3, je ×1 `deckungsbeitrag`/`marktanteil`/`preisberechnung`/`vier-stufen`). Fehlt einem Planeten das Werkzeug, zeigt die „Interaktive Module"-Kachel ehrlich „bald".

**Offen:** die restlichen ~21 spezifizierten Modultypen (unten), Zuweisung der übrigen 33 Planeten und alle **Stufe-B**-Veredelungen (Freitext-Feedback, Fall-Recast) — letztere hängen am KI-Backend (Roadmap Phase 3.1). Nächster Schritt: weitere Typen entlang der Bau-Reihenfolge unten ausrollen (Renderer je Familie steht als Muster bereit).

---

## Modul-Katalog

Format je Modul: **Key** · Zweck · Eingabe → Ausgabe/Artefakt · Star-Company-Anbindung · Stufe · Planet(en).

### Familie 1 — Rechner

**`statistik-rechner`**
Mittelwerte, Median, Modus, Spannweite, Standardabweichung + Verteilungs-Visualisierung.
Eingabe: Datenreihe → Ausgabe: Kennzahlen + Histogramm. Artefakt: berechnete Auswertung.
Star-Company: Beispieldaten aus der Branche des Unternehmens vorbelegt. **Stufe A.**
Planet: HB1 · *Statistische Maßzahlen: Mittelwerte & Streuung*.

**`marktkennzahlen-rechner`** *(erweitert bestehendes `marktanteil`)*
Marktanteil (absolut/relativ), Marktvolumen, Marktpotenzial, Sättigungsgrad + einfache Trendextrapolation.
Eingabe: Absatz/Umsatz, Gesamtmarkt → Ausgabe: Kennzahlen + Deutung. Artefakt: Markt-Steckbrief.
Star-Company: Marktzahlen der Star-Company. **Stufe A.**
Planet: HB1 · *Marktkennzahlen & Prognosetechniken*.

**`db-rechner`** *(erweitert bestehendes `deckungsbeitrag`)*
Ein- und mehrstufige Deckungsbeitragsrechnung, Break-even-Menge/-Umsatz.
Eingabe: Preis, variable/fixe Kosten → Ausgabe: DB je Stufe, Break-even + Diagramm. Artefakt: DB-Rechnung.
Star-Company: Produkt/Preis der Star-Company. **Stufe A.**
Planet: HB3 · *Deckungsbeitragsrechnung im Marketingcontrolling* (zusätzlich nutzbar in HB2 Preispolitik).

**`preis-rechner`** *(`preisberechnung`)*
Zuschlagskalkulation, Preiselastizität, Break-even-Preis, Rabatt-/Skonto-Wirkung.
Eingabe: Kostenbasis, Zuschläge, Nachfrageelastizität → Ausgabe: Preisuntergrenze/-empfehlung. Artefakt: Preiskalkulation.
Star-Company: Kostenstruktur der Star-Company. **Stufe A.**
Planet: HB2 · *Preispolitik*.

**`scoring-rechner`** *(`scoring`)*
Nutzwertanalyse / Scoring-Modell: Kriterien × Gewichte × Bewertung → gewichteter Gesamtnutzen; Rangfolge.
Eingabe: Alternativen, Kriterien, Gewichte, Punkte → Ausgabe: Scoring-Tabelle + Sieger. Artefakt: Nutzwertanalyse.
Star-Company: Entscheidungssituation des Unternehmens (z. B. Kanal-, Lieferanten-, Standortwahl). **Stufe A.**
Planet: HB2 · *Steuerungstechniken: Scoring-Modelle & Balanced Scorecard*. Querschnitt: überall, wo Alternativen bewertet werden.

**`budget-allokator`**
Marketingbudget auf Maßnahmen/Instrumente verteilen; Kosten-, Reichweiten- und Wirkungs-Trade-off sichtbar.
Eingabe: Gesamtbudget, Maßnahmen mit Kennwerten → Ausgabe: Allokation + Wirkungsschätzung. Artefakt: Budgetplan.
Star-Company: Budgetrahmen der Star-Company. **Stufe A.**
Planet: HB2 · *Marketingmaßnahmen & Budgetplanung*.

**`kpi-dashboard`**
KPIs auswählen, berechnen, interpretieren; Soll-/Ist-Ampel.
Eingabe: Marketing-Kennzahlen → Ausgabe: KPI-Kachelset + Deutung. Artefakt: KPI-Set.
Star-Company: Kennzahlen der Star-Company. **Stufe A.**
Planet: HB3 · *KPI-Systematik im Marketing*.

### Familie 2 — Matrizen & Canvas

**`swot`** *(bereits im Enum)*
SWOT-Matrix (Stärken/Schwächen/Chancen/Risiken) + Ableitung von SO/ST/WO/WT-Strategien.
Eingabe: geführte Felder → Ausgabe: 4-Quadranten-Matrix + Normstrategien. Artefakt: SWOT-Analyse.
Star-Company: vollständig auf die Star-Company bezogen. **Stufe A** (Feedback zur Qualität = Stufe B).
Planet: HB1 · *Marktsegmentierung & Zielgruppen* als Analyse-Capstone; Querschnitt-Werkzeug für Strategie-Planeten.

**`bcg-matrix`**
Portfolio-Matrix (Marktwachstum × relativer Marktanteil): Produkte in Stars / Cash Cows / Question Marks / Poor Dogs einordnen; Normstrategien.
Eingabe: Produkte mit Wachstum/Anteil → Ausgabe: platzierte Matrix + Handlungsempfehlung. Artefakt: Portfolio-Analyse.
Star-Company: Produktprogramm der Star-Company. **Stufe A.**
Planet: HB2 · *Produktpolitik* (+ *Produkt-/Dienstleistungsmanagement*).

**`balanced-scorecard`**
BSC-Builder über vier Perspektiven (Finanzen, Kunde, Prozesse, Lernen/Entwicklung) mit Zielen/Kennzahlen/Maßnahmen.
Eingabe: je Perspektive Ziel+KPI+Maßnahme → Ausgabe: BSC-Karte. Artefakt: Balanced Scorecard.
Star-Company: Strategie der Star-Company. **Stufe A.**
Planet: HB2 · *Scoring & Balanced Scorecard*; HB3 · *Marketingcontrolling als Führungsinstrument*.

**`gap-analyse`**
Ziel- vs. Prognose-Verlauf; strategische und operative Lücke visuell trennen; Schließungsmaßnahmen.
Eingabe: Zielpfad, Prognosepfad → Ausgabe: Gap-Chart + Maßnahmen. Artefakt: Gap-Analyse.
Star-Company: Zielsetzung der Star-Company. **Stufe A.**
Planet: HB3 · *Controllinginstrumente: Gap-Analyse & Benchmarking*.

**`segmentierungs-canvas`**
Marktsegmente nach Kriterien (geografisch/demografisch/psychografisch/verhaltensbezogen) bilden; Persona ableiten.
Eingabe: Kriterienwahl + Ausprägungen → Ausgabe: Segment-Steckbriefe/Persona. Artefakt: Zielgruppenprofil.
Star-Company: Zielmarkt der Star-Company. **Stufe A.**
Planet: HB1 · *Marktsegmentierung & Zielgruppen*.

**`positionierungs-kreuz`**
Positionierungsmodell (zwei Nutzenachsen); eigenes Angebot und Wettbewerber platzieren; Lücken erkennen.
Eingabe: Achsen + Wettbewerber → Ausgabe: Positioning-Map. Artefakt: Positionierung.
Star-Company: Wettbewerbsumfeld der Star-Company. **Stufe A.**
Planet: HB2 · *Marketingziele und Zielgruppenanalyse* (Querschnitt Strategie).

**`reifegrad-matrix`**
Situatives Führen nach Hersey/Blanchard: Reifegrad des Mitarbeiters → passender Stil (S1 dirigieren … S4 delegieren).
Eingabe: Reifegrad-Einschätzung → Ausgabe: empfohlener Stil + Begründung. Artefakt: Führungsempfehlung.
Star-Company: Team der Star-Company. **Stufe A.**
Planet: HB4 · *Situativer Führungsstil nach Hersey/Blanchard*.

### Familie 3 — Sequenzer & Klassifikatoren

**`prozess-sequenzer`**
Schritte eines Ablaufs in die richtige Reihenfolge bringen; Feedback bei Fehlordnung.
Eingabe: gemischte Schritte → Ausgabe: korrekte Sequenz. Artefakt: Ablaufdiagramm.
Star-Company: Ablauf auf die Star-Company bezogen. **Stufe A.**
Planeten: HB1 · *Marktforschungsprozess* · HB4 · *Vier-Stufen-Methode* (`vier-stufen`) · HB4 · *Präsentationsvorbereitung: Fünf-Phasen-Modell* · HB4 · *Gefährdungsbeurteilung nach § 5*.

**`klassifikator`** (Drag-to-Bucket)
Elemente den richtigen Kategorien zuordnen; sofortiges Feedback.
Eingabe: Elemente + Kategorien → Ausgabe: Zuordnung. Artefakt: Zuordnungsübersicht.
Star-Company: Beispiele aus der Star-Company. **Stufe A.**
Planeten (breit einsetzbar): HB1 · *Sekundärforschung* (Quellen intern/extern) · HB1 · *Beobachtung/Experiment/Panel* (Methodenwahl) · HB2 · *Fünf Organisationsformen* · HB2 · *People/Process/Physical & CRM* (7P) · HB3 · *Objektiver & subjektiver Qualitätsbegriff* · HB4 · *Duales Arbeitsschutzsystem* · HB4 · *Klassische Führungsstile* · HB4 · *Management-by-Techniken*.

**`fragebogen-baukasten`**
Fragebogen bauen: Fragetypen (offen/geschlossen/Skala) wählen, Suggestiv-/Doppelfragen erkennen und entschärfen.
Eingabe: Fragenentwürfe → Ausgabe: geprüfter Fragebogen. Artefakt: Erhebungsinstrument.
Star-Company: Befragung für die Star-Company. **Stufe A** (Formulierungs-Feedback = Stufe B).
Planet: HB1 · *Primärforschung: Befragung*.

**`stichproben-simulator`**
Auswahlverfahren wählen (Zufalls-/Quoten-/Klumpen-…); Stichprobengröße einstellen; Verzerrung sichtbar machen.
Eingabe: Verfahren + Parameter → Ausgabe: Stichprobe + Bias-Hinweis. Artefakt: Stichprobenplan.
Star-Company: Grundgesamtheit der Star-Company. **Stufe A.**
Planet: HB1 · *Stichproben & Auswahlverfahren*.

### Familie 4 — Kommunikation, Führung & Personal (HB4)

**`vier-ohren-analyzer`**
Nachricht in die vier Seiten nach Schulz von Thun zerlegen (Sach / Selbstoffenbarung / Beziehung / Appell).
Eingabe: Aussage → Ausgabe: vier gedeutete Ebenen. Artefakt: Kommunikationsanalyse.
Star-Company: Situation im Star-Company. **Stufe A** (Deutung freier Sätze = Stufe B).
Planet: HB4 · *Das Nachrichtenquadrat nach Schulz von Thun*.

**`eskalations-slider`**
Konflikteskalation nach Glasl (9 Stufen / 3 Ebenen): Stufe bestimmen, passende Intervention/Rolle (Moderation … Machteingriff) wählen.
Eingabe: Konfliktbeschreibung → Ausgabe: Stufe + Interventionsempfehlung. Artefakt: Konfliktanalyse.
Star-Company: Konfliktfall im Star-Company. **Stufe A.**
Planet: HB4 · *Konflikteskalation nach Glasl*.

**`anforderungsprofil-builder`**
Stellenbeschreibung → Anforderungsprofil: Muss-/Kann-/Ausschluss-Kriterien gewichten.
Eingabe: Aufgaben + Kompetenzen → Ausgabe: Anforderungsprofil. Artefakt: Anforderungsprofil.
Star-Company: offene Stelle im Star-Company. **Stufe A.**
Planet: HB4 · *Stellenbeschreibung & Anforderungsprofil*.

**`schichtplan-simulator`**
Arbeitszeit-/Schichtmodell aufstellen; Besetzung und Abdeckung gegen Bedarf prüfen; Ruhezeiten-Regeln.
Eingabe: Bedarf, Mitarbeiter, Modell → Ausgabe: Plan + Abdeckungs-Check. Artefakt: Einsatzplan.
Star-Company: Belegschaft der Star-Company. **Stufe A.**
Planet: HB4 · *Arbeitszeitmodelle & Schichtplanung*.

**`checkliste-assistent`**
Geführte Prüf-/Vorgehens-Checkliste mit Fortschritt; für Audits, Zyklen, Beurteilungen.
Eingabe: abgehakte Schritte + Notizen → Ausgabe: ausgefüllte Checkliste. Artefakt: Prüfprotokoll.
Star-Company: angewandt auf die Star-Company. **Stufe A.**
Planeten: HB3 · *Marketingaudit* · HB3 · *TQM & Kaizen* (PDCA) · HB4 · *Gefährdungsbeurteilung* · HB4 · *Erfolgskontrolle von PE-Maßnahmen*.

---

## Planeten-Abdeckung (Kurzüberblick)

| HB | Planeten | primär zugewiesene Module |
|---|---|---|
| HB1 (8) | Marktforschung & Analyse | prozess-sequenzer, klassifikator, fragebogen-baukasten, stichproben-simulator, statistik-rechner, marktkennzahlen-rechner, segmentierungs-canvas, swot |
| HB2 (10) | Marketing-Mix | positionierungs-kreuz/smart-ziel, budget-allokator, scoring-rechner + balanced-scorecard, klassifikator (Org-Formen/7P), bcg-matrix, preis-rechner, klassifikator (Distribution/Kommunikation) |
| HB3 (10) | Controlling, Erfolgsmessung, Qualität | kpi-dashboard, db-rechner, klassifikator (Pre/Posttest), gap-analyse, checkliste-assistent (Audit/PDCA), balanced-scorecard |
| HB4 (18) | Kommunikation, Führung & Personal | vier-ohren-analyzer, eskalations-slider, reifegrad-matrix, klassifikator (Führungsstile/MbX), prozess-sequenzer (Vier-Stufen/Präsentation/GBU), anforderungsprofil-builder, schichtplan-simulator, checkliste-assistent |

> Nicht jeder Planet braucht ein schweres Werkzeug — Planeten ohne Rechen-/Matrix-Bezug bekommen die leichten `klassifikator`-/`prozess-sequenzer`-Varianten. Ein „`smart`-Ziel-Prüfer" (bestehender Enum-Wert) sitzt auf HB2 · *Marketingziele und Zielgruppenanalyse*.

---

## Prüfungs-abgeleitete Module (aus `docs/quellen/Prüfungen/`, 13 IHK-Prüfungen 2017–2025)

> ⚠️ **Urheberrecht:** IHK-/AkA-Prüfungsaufgaben sind geschützt. In einem kommerziellen (Paywall-)Produkt **nicht verbatim** übernehmen. Die folgenden Module nutzen die Prüfungen als **Analyse-Input** und erzeugen daraus **eigene** Aufgaben im selben Stil. Vor Live-Gang rechtlich prüfen.

- **`pruefungsrelevanz` (Datenlayer, kein Planet-Modul):** Häufigkeit je Thema über alle Jahrgänge → „Prüfungsrelevanz"-Score je Planet → steuert Wiederholungs-Priorität und ein sichtbares Badge. Ersetzt sinnvoll die heute fehlende Prüfungsdatum-Logik.
- **`fallstudien-recast` (Stufe B):** Struktur der Situationsaufgaben extrahieren → Motor überträgt sie auf das **Star-Company** → Üben im echten Format an der eigenen Firma; Ergebnis = Artefakt fürs Deck.
- **`operatoren-trainer` (Stufe A/B):** Antworttechnik nach IHK-Operatoren (analysieren/beurteilen/entwickeln), Gliederung, Punktelogik.
- **`pruefungssimulator` (Stufe A):** getakteter Probelauf als schriftliches Gegenstück zum mündlichen Präsentations-Deck.

---

## Bau-Reihenfolge (Vorschlag)

1. **Fundament:** `werkzeug`-Enum erweitern, generischer Modul-Renderer in der Lernseite (Phase „Anwenden"), Artefakt-Vertrag + Speicherung im Fortschritt.
2. **Referenz je Familie zuerst** (Muster etablieren): `statistik-rechner` (Rechner), `bcg-matrix` (Matrix), `prozess-sequenzer` (Sequenzer), `vier-ohren-analyzer` (HB4). Danach die restlichen Typen ausrollen.
3. **Missions-Launch:** Deck-Ansicht, die alle `deckReif`-Artefakte einsammelt.
4. **Stufe B / Prüfungs-Module:** mit dem KI-Backend (Roadmap Phase 3) nachziehen.

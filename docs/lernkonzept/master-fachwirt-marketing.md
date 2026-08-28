# Master — Fachwirt Marketing (Ziel-Struktur & Muster)

> **Zweck:** Verbindliche **Basis-Struktur** für die komplette Überarbeitung des Fachwirt
> Marketing. Diese Datei definiert, **was ein vollständiges Thema enthalten muss**, damit **alle
> Lern-Modi** (Entdecken · Lernzettel · Übungsbereich/MC · IHK-Test · Werkzeuge) funktionieren.
>
> **Status (2026-07-30):** Basis steht. **Herr Laudien** schreibt darauf zum **Jahresende** den
> vollständigen Master-Content für diesen Fachwirt neu. Bis dahin ist dies das Ziel-Gerüst.
>
> Quellen: `docs/quellen/` (5 Lehrbücher + 13 IHK-Prüfungen), `docs/lernkonzept/pruefungs-blaupause.md`,
> `docs/lernkonzept/content-richtlinien.md`, `docs/content-schema` (Notion) und die bestehenden 46 Themen.
> Technisch maßgeblich: das Zod-Schema in `src/content.config.ts` (Markdown **und** Directus).

---

## 1. Warum diese Basis nötig ist

Aktueller Ist-Zustand: nur **5–6 von 46** Themen haben `begriffe`/`definitionen` — 41 haben nur
„Basis-Struktur" (Merksatz + Fallbeispiel + Prüfungsfrage). Deshalb funktionieren **Lernzettel**
und **Multiple-Choice** nur auf wenigen Themen. Der Master schließt genau diese Lücke: **jedes
Thema wird mode-komplett.**

## 2. Taxonomie (Ist-Gerüst, 4 Handlungsbereiche · 46 Themen)

- **HB1 — Marktforschung & Analyse** (8): Marktforschungsprozess · Sekundärforschung · Befragung ·
  Beobachtung/Experiment/Panel · Stichproben & Auswahlverfahren · Mittelwerte & Streuung ·
  Marktkennzahlen & Prognose · Marktsegmentierung & Zielgruppen
- **HB2 — Marketing-Mix** (10): Marketingziele & Zielgruppen · Maßnahmen & Budget ·
  Steuerungstechniken (Scoring/BSC) · Marketingorganisation · Produktmanagement & Marketingarten ·
  Produktpolitik · Preispolitik · Distributionspolitik · Kommunikationspolitik · People/Process/CRM
- **HB3 — Erfolgsmessung, Controlling & Qualität** (10): *Erfolgsmessung* (KPI-Systematik ·
  Deckungsbeitrag · Werbeerfolgskontrolle) · *Marketingcontrolling* (Führungsinstrument ·
  strategisch/operativ · Controllinginstrumente · Marketingaudit) · *Qualitätssicherung*
  (Qualitätsbegriff · TQM & Kaizen · Betriebliche Vernetzung)
- **HB4 — Kommunikation, Führung & Personal** (18): *Arbeitsschutz* · *Berufsausbildung* ·
  *Führungsmethoden* · *Situationsgerechte Kommunikation* · *Personalauswahl* ·
  *Personaleinsatzplanung* · *Personalentwicklung*

> Der neue Master kann die Taxonomie schärfen (am aktuellen IHK-Rahmenplan), sollte aber
> `fachwirt` + `handlungsbereich` + `themengruppe` als Ordnungsraster beibehalten (skaliert auf
> weitere Fachwirte → „Marketing – HB1").

## 3. Vollständige Feld-Referenz (was JEDES Thema haben soll)

Legende: **⬛ Pflicht** · ◻ optional (aber empfohlen) · ▽ nur wo fachlich sinnvoll.

### Identität
- **⬛ fachwirt** — `marketing`
- **⬛ handlungsbereich** — `hb1`…`hb4`
- **⬛ themengruppe** — thematische Untergruppe (frei, konsistent halten)
- **⬛ order** — Reihenfolge im HB (kleinste zuerst)
- **⬛ description** — 1–2 Sätze Teaser/Meta

### ① Verstehen
- **⬛ body** (Markdown) — Haupterklärung; Absätze, Listen, **fett** für Schlüsselbegriffe, Tabellen
- **◻ definitionen** `[{begriff, definition}]` — **wichtig: speist Lernzettel + MC.** Mind. 4–6 je Thema
- **▽ formeln** `[{name, formel, erklaerung, einheit?}]` — bei rechen-/kennzahllastigen Themen
- **▽ rechenbeispiel** `{aufgabe, schritte[{schritt,beschreibung,berechnung?,ergebnis?}], fazit?}`
- **◻ zusammenfassung** `[string]` — 3–5 Kernaussagen als Stichpunkte
- **▽ gesetze** `[{norm, titel, erklaerung, anwendung, quelle}]` — **nur Rechtsthemen** (v. a. HB4).
  KEIN Verbatim → eigene Erklärung + Anwendungsbeispiel + Link zur amtlichen Quelle

### ② Merken
- **⬛ merksatz** — EIN einprägsamer Kernsatz
- **◻ begriffe** `[{begriff, aufloesung?, erklaerung}]` — **wichtig: speist Lernzettel + MC.** Mind. 4–6

### ③ Anwenden
- **⬛ fallbeispiel** `{situation, aufgabe, musterloesung}` — realistischer Fall; **`{{firma}}`** statt
  Fantasienamen (Star-Company schlägt durch)
- **▽ werkzeug** — eines von: `swot · smart · deckungsbeitrag · marktanteil · preisberechnung ·
  vier-stufen · scoring · portfolio · breakeven · statistik` (**10**, maßgeblich das Enum in
  `src/content.config.ts`); wo ein interaktives Werkzeug fachlich passt

### ④ Prüfen
- **⬛ pruefungsfrage** `{frage, loesungsweg[]}` — prüfungsnahe Frage + Lösungsweg
- **◻ mcFragen** `[{frage, optionen[≥2], richtige, erklaerung, operator?}]` — Recall-Übung
  (nennen/definieren). Position der richtigen Antwort egal (Laufzeit mischt)
- **◻ pruefungsaufgabe** `{situation, teilaufgaben[{operator, aufgabe, punkte, loesungshinweis}]}` —
  echte Situationsaufgabe im IHK-Format (Operatoren: erläutern/begründen/empfehlen …; Punkte)

### Wiederholung
- **◻ wiederholungTage** — Standard 4

## 4. Wording- & Qualitätsregeln (verbindlich)

1. **Star-Company:** In Fällen/Aufgaben **`{{firma}}`** verwenden (nie hartkodierte Firmennamen).
   Weitere Platzhalter: `{{branche}}`, `{{rechtsform}}`, `{{groesse}}`.
2. **Kein IHK-/Verlags-Verbatim** — eigenes Titan-Wording (siehe `content-richtlinien.md`).
3. **Gesetze:** eigene Erklärung + Anwendung + Link zu gesetze-im-internet.de; keine Kommentar-Zitate.
4. **IHK-Operatoren** korrekt einsetzen (erläutern ≠ nennen ≠ begründen; siehe `pruefungs-blaupause.md`).
   Idealerweise pro Thema mind. eine Aufgabe je dominierendem Operator.
5. **Zod ist das Sicherheitsnetz:** fehlerhafte/leere Pflichtfelder lassen den Build scheitern.

## 5. Annotiertes Frontmatter-Skelett (Kopiervorlage pro Thema)

```yaml
---
fachwirt: "marketing"
handlungsbereich: "hb2"          # hb1..hb4
themengruppe: "Marketing-Mix"
order: 6
description: "1–2 Sätze Teaser."
body: |                          # Haupttext (Markdown) ODER als Datei-Body unter dem ---
  ...
definitionen:                    # ← speist Lernzettel + MC (mind. 4–6)
  - begriff: "Begriff A"
    definition: "Klare Definition."
formeln:                         # nur bei Kennzahl-/Rechenthemen
  - name: "Conversion Rate"
    formel: "Conversions ÷ Besucher × 100"
    erklaerung: "Anteil der Besucher mit gewünschter Aktion."
    einheit: "%"
zusammenfassung:
  - "Kernaussage 1"
gesetze:                         # nur Rechtsthemen (kein Verbatim!)
  - norm: "§ 5 ArbSchG"
    titel: "Gefährdungsbeurteilung"
    erklaerung: "Eigene Erklärung."
    anwendung: "Beispiel an der {{firma}}."
    quelle: "https://www.gesetze-im-internet.de/..."
merksatz: |
  Ein einprägsamer Kernsatz.
begriffe:                        # ← speist Lernzettel + MC (mind. 4–6)
  - begriff: "Begriff"
    aufloesung: "Abk. (optional)"
    erklaerung: "Kurze Erklärung."
werkzeug: "swot"                 # optional, wo ein Werkzeug passt
fallbeispiel:
  situation: "Die {{firma}} …"
  aufgabe: "Erläutern Sie …"
  musterloesung: "…"
pruefungsfrage:
  frage: "…"
  loesungsweg:
    - "Schritt/Aspekt 1"
mcFragen:                        # optional (Recall). richtige = Index; Laufzeit mischt
  - frage: "Was bedeutet …?"
    optionen: ["richtig", "falsch1", "falsch2", "falsch3"]
    richtige: 0
    erklaerung: "Warum richtig."
    operator: "definieren"
pruefungsaufgabe:                # optional (IHK-Test-Format)
  situation: "Die {{firma}} …"
  teilaufgaben:
    - operator: "erläutern"
      aufgabe: "Erläutern Sie …"
      punkte: 8
      loesungshinweis: "…"
wiederholungTage: 4
---
```

## 6. Referenz-Beispiele im Bestand

- **Analytisch komplett** (body, begriffe, definitionen, formeln, zusammenfassung, mcFragen,
  pruefungsaufgabe): **HB3 · KPI-Systematik** → das **Gold-Standard-Muster-Thema**.
- **Gesetze-Baustein:** HB4 · Gefährdungsbeurteilung (§ 5/§ 13 ArbSchG).
- **Werkzeug im Thema:** HB2 · Produktpolitik (`breakeven`), HB3 · Controllinginstrumente (`portfolio`).

## 7. Nächste Schritte

1. **Basis (jetzt):** diese Ziel-Struktur + das Gold-Standard-Muster-Thema (KPI) stehen.
2. **Jahresende (Laudien):** vollständiger Master-Content pro Thema entlang dieser Struktur —
   v. a. `begriffe`/`definitionen` überall ergänzen (schließt die Lernzettel-/MC-Lücke).
3. **Optional KI (Phase 3):** Roh-Vorschläge für `begriffe`/`mcFragen` aus dem `body` generieren,
   danach fachlich prüfen (Prorsus/Laudien).

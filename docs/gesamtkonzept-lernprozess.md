# Titan — Gesamtkonzept & Lernprozess

> Konzept-Landkarte des End-to-End-Lernwegs — von der Zertifizierung bis zur
> fertigen IHK-Präsentation. Stand 2026-07-24 · **zur Prüfung**. Verweist auf
> [produktvision.md](produktvision.md), [interaktive-module.md](interaktive-module.md),
> [ki-governance.md](ki-governance.md), [content-richtlinien.md](content-richtlinien.md),
> [roadmap.md](roadmap.md). Grundlage Deck-Teil: `docs/Module-Präsi/10 Training
> Fachgespräch.pdf`.

---

## 1. Nordstern (der rote Faden)

**„Ich zeige nicht, was Marketing ist, sondern dass ich als Fachwirt Entscheidungen
treffen kann — unter Berücksichtigung von Markt, Wirtschaftlichkeit und Menschen."**
(Abschluss-Merksatz aus der Fachgespräch-Schulung — er ist Titans didaktischer Nordstern.)

Konkret: Der Lernende beschreibt **einmal** seine **Star-Company** und wird durch den
**kompletten Prozess** begleitet — jedes Kapitel wendet ein Werkzeug **auf genau diese
Firma** an → jedes Ergebnis ist ein **Artefakt** → alle Artefakte fügen sich zur
**fertigen, individuellen IHK-Präsentation** zusammen (**Missions-Launch**, der USP).

**Raumschiff-Metapher (Design-Sprache, umgesetzt):** Draußen der **dunkle Kosmos**
(Universum/Galaxie/Planeten = Navigation). Beim **Eintritt in ein Kapitel geht das
Licht an** — heller, fokussierter Lern-Innenraum. Der Wechsel selbst wird zum Moment.

---

## 2. Die Lern-Landkarte (Navigation)

```
UNIVERSUM  (IHK-Zertifizierung, z. B. Fachwirt Marketing)   ── dunkler Kosmos
  └─ GALAXIE  (Handlungsfeld 1–4)                            ── dunkler Kosmos
       └─ PLANET  (Kapitel/Thema, 46 Stück)                  ── dunkler Kosmos
            └─ [ Kapitel betreten → „Licht an" → heller Lern-Innenraum ]
                 └─ MODUS-AUSWAHL: „Wie möchtest du bearbeiten?"
```

- **Universum** = eine Zertifizierung. Skaliert auf weitere Fachwirte (neues Content-Pack).
- **Galaxie** = Handlungsfeld. **Neu (Konzept):** bekommt eine eigene **Handlungsfeld-Ebene**
  (siehe §4) — der „Satellit/Trainingsraum".
- **Planet** = Kapitel/Thema. Einstieg über die **Modus-Auswahl**.

---

## 3. Der Kapitel-Lernprozess (die Modi)

Beim Betreten eines Planeten wählt der Lernende einen **Modus**. **Entdecken** ist der
Master-Lernpfad; die übrigen Modi sind **eigenständige Übungswelten** (bewusst getrennt,
mit Varianz zum echten Üben).

| Modus | Zweck | Ergebnis | Stand |
|---|---|---|---|
| **Entdecken** | Lernen in 4 Phasen: **Verstehen · Merken · Anwenden · Prüfen** | Verständnis + Merksatz + Fallbeispiel + Prüfungsfrage | ✅ live |
| **Interaktive Module** | Werkzeug an der Star-Company anwenden (SWOT, DB-Rechner, Scoring …) | **Artefakt** fürs Deck | ✅ 7 Werkzeuge, 13 Planeten |
| **Übungsbereich** | Üben mit **Varianz** — Fallaufgaben/MC, immer neue Stellung | Übungs-Ergebnis, Selbstcheck | ⬜ (bald; KI-Stufe-B veredelt) |
| **IHK-Test-Format** | Prüfung im **Original-Format**, getaktet | Probelauf-Auswertung | ⬜ (bald) |
| **Lernzettel** | Karteikarten der Schlüsselbegriffe (Flip) | Wiederholung | ✅ wo `begriffe` vorhanden |
| **Rechtsgrundlagen** | §-Karten: eigene Erklärung + Anwendung + amtliche Quelle | Verständnis Recht | ✅ (Gesetzes-Erklärer) |

**Prinzip Übungswelten:** gleiche Kompetenz, **immer neue Fallstellung/Zahlen** an der
Star-Company. Genau hier kommt die **KI (Stufe B)** ins Spiel — sie **rekontextualisiert**
Aufgaben, damit man *unbegrenzt* üben kann statt dieselbe Aufgabe zweimal (siehe §6).

---

## 4. Die Handlungsfeld-Ebene — „Trainingsraum-Satellit" (Konzept)

**Idee (vom Gründer, als Raumschiff/Satellit darstellbar):** Auf der Galaxie-/Planeten-
Übersicht bekommt jedes **Handlungsfeld** einen eigenen **Trainingsraum** — ein
**andockbarer Satellit**, in dem alles des HB zusammenläuft:

- **HB-Karteikarten-Stapel** — alle Begriffe des Handlungsfelds in einem Deck.
- **HB-Artefakt-Sammlung** — alle in diesem HB erzeugten Artefakte.
- **HB-Fortschritt** — aggregierter Stand über alle Kapitel.
- **HB-Prüfungssimulator** — mischt Aufgaben aus allen Kapiteln des Handlungsfelds.

Der Satellit ist die **natürliche Brücke** zwischen Kapitel (Planet) und dem finalen
**Missions-Launch** (Deck).

**Empfehlung (gestuft, reversibel):**
- **Stufe 1 (jetzt, ohne WebGL):** Der Trainingsraum erscheint als **eigenes Item am
  Ende des Planeten-Karussells** (Seite 3) — eine **andersartige „Station"/Satellit-
  Kachel** (kein Planet), die sich klar abhebt. Narrativ: erst alle Kapitel (Planeten),
  dann dockt der Trainingsraum an → „zusammenführen → Richtung Missions-Launch".
  Öffnet einen **hellen Lern-Innenraum** („Licht an", wie ein Kapitel) mit den 4
  Sammlungen. CSS/SVG genügt, architektur-konform, jederzeit rückführbar.
- **Stufe 2 (Phase 4.2, WebGL):** echtes 3D-**Satelliten-Objekt**, das das Handlungsfeld
  umkreist — gekoppelt an das three.js-Kosmos-Redesign.
- **Warum am Karussell-Ende:** macht die HB-Ebene greifbar, ohne eine neue
  Navigationsebene einzuziehen; der Satellit ist die sichtbare Brücke Kapitel → Deck.

📝 *Noch zu klären: genaue Kennzahlen im Trainingsraum; ob der Satellit erst nach
gewissem Kapitel-Fortschritt „andockt" (Belohnungsmoment).*

---

## 5. Missions-Launch — das IHK-Präsentationsdeck (USP)

> Grundlage: die Fachgespräch-Schulung (`docs/Module-Präsi/…`). **Leitprinzip: der
> Schüler denkt selbst mit — die KI assistiert, entscheidet aber nicht.** (Passt zum
> formativen Feedback ohne Note, [ki-governance.md](ki-governance.md).)

### 5.1 Die 4 Spannungsbögen (wählbare Struktur-Templates)

Für die 10-minütige Präsentation stehen **4 bewährte Strukturmodelle** bereit — der
Lernende **wählt bewusst** einen und **begründet** die Wahl (Prüfungskriterium!):

| Bogen | 6-Schritt-Logik | Wofür |
|---|---|---|
| **1 · IST → SOLL** (Problemlösung) | Ausgangssituation → Problem → Ziel (fachl.+wirtsch.) → Lösungsalternativen → Bewertung & Entscheidung → Umsetzung & Kontrolle | Strategie, Organisation, Optimierung |
| **2 · Management** (Entscheidung) | Anlass → Rahmenbedingungen/Restriktionen → Entscheidungskriterien → Handlungsoptionen → Bewertung (Kosten/Nutzen/Risiken) → Entscheidung & Begründung | Budget-, Kanal-, Strukturentscheidungen |
| **3 · Change** (Veränderung) | Ausgangslage & Druck → Zielbild → Auswirkungen auf Org & Mitarbeitende → Maßnahmenplanung → Umsetzung (inkl. Komm. & Qualifizierung) → Erfolgskontrolle & Lessons Learned | Digitalisierung, Reorganisation, neue Prozesse |
| **4 · Markt & Kunde** | Markt-/Kundenanalyse → Marktproblem/Chance → Marketingziel(e) → Strategische Stoßrichtung → Operative Maßnahmen → Erfolgsmessung | Markt-/Kundenthemen, mit Vertrieb/Service verknüpfbar |

### 5.2 KI-Assistenz beim Deck-Bau (Schüler entscheidet)

1. **Ideenfindung Thema:** KI schlägt aus der Star-Company + gewähltem Handlungsfeld
   **reale betriebspraktische Probleme** vor (kein Theorie-Vortrag). Der Schüler wählt/schärft.
2. **Bogen-Auswahl:** KI **empfiehlt** den passenden Spannungsbogen zum Thema — der
   Schüler **bestätigt und begründet** (Kompetenznachweis).
3. **Gliederung:** KI hilft, die 6 Schritte des Bogens mit **eigenen Stichworten** zu
   füllen (aus den Artefakten des Lernenden gespeist) — der Schüler formuliert aus.
4. **Theme/Design — bewusst VIELFÄLTIG:** **Auswahl aus vielen fertigen Themes**
   (Norive-Familie, breite Palette) **oder** KI-gestützte Theme-Erstellung.
   ⚠️ **Anti-Uniformität ist Pflicht, kein Nice-to-have:** Der Prüfungsausschuss achtet
   darauf, **dass nicht alle Prüflinge dasselbe Deck mitbringen** — also braucht Titan
   **große Design-Vielfalt** (viele Themes + KI-Generierung + individuelle Farbwelt je
   Star-Company). Dennoch: „Der Prüfungsausschuss prüft **Kompetenz, nicht
   Designpreise**" → Design bleibt unterstützend, nie Selbstzweck.
5. **Artefakt-Einbau:** Das Deck zieht die passenden **Artefakte** (SWOT, DB-Rechnung …)
   automatisch an die richtigen Bogen-Schritte.

> **Struktureller Schutz vor „Schablonen-Decks" (zugleich Verkaufsargument, vgl.
> [businessplan.md](businessplan.md)):** Vielfalt entsteht auf **vier** Ebenen —
> (a) unterschiedliche **Star-Company** (Branche/Name/Zahlen), (b) unterschiedlich
> **gewählter Spannungsbogen**, (c) **große Theme-/Design-Palette** + KI-Theme-Erstellung,
> (d) **KI-variierter Inhalt/Wording**. Titan **verhindert** uniforme Präsentationen,
> statt sie zu erzeugen.

### 5.3 Qualitäts-Gate: die 9 Bewertungskriterien

Das Deck wird gegen die **echten Prüfer-Kriterien** geprüft (KI gibt **formatives
Feedback**, **keine Note**):

1. **Thema & Problemstellung** — reales betriebliches Problem, komplex genug, Relevanz klar.
2. **Struktur & Spannungsbogen** — klarer roter Faden, Analyse → Lösung, Bogen bewusst gewählt.
3. **Analysekompetenz** — Faktoren priorisiert, Zusammenhänge, Annahmen begründet (*Tiefe > Vollständigkeit*).
4. **Zieldefinition** — klar (fachl.+wirtsch.), realistisch/überprüfbar, Zielkonflikte benannt.
5. **Lösungs-/Entscheidungskompetenz** — mehrere Optionen, Kosten/Nutzen/Risiken, **begründete** Auswahl.
6. **Personalaspekt (PFLICHT!)** — Auswirkungen auf Mitarbeitende (Qualifikation/Kapazität/Motivation/Organisation/Führung/Kommunikation) + Maßnahmen. **„Personal ≠ extra Folie — Personal ist Teil der Lösung."**
7. **Umsetzung & Praxisbezug** — wie umgesetzt, Verantwortlichkeiten, Risiken, Erfolgskontrolle. *„Fachwirte konzipieren nicht nur, sie setzen um."*
8. **Zeitmanagement — 10 Minuten:** Analyse & Problem **3–4 Min**, Lösung & Entscheidung **4–5 Min**, Umsetzung & Fazit **1–2 Min**.
9. **Präsentationsstil** — klare Sprache (kein Foliensprech), Fachbegriffe korrekt, selbstbewusst; Deck **unterstützt** den Vortrag.

### 5.4 Fachgespräch-Simulator (nach der Präsentation)

„Nach der Präsentation folgt das Fachgespräch — oft entscheidet es über die Note." Die
KI generiert aus den gewählten Artefakten einen **Verteidigungs-Leitfaden**:
- Kann ich meine **Entscheidung verteidigen**?
- Kenne ich **Alternativen und deren Nachteile**?
- Kann ich erklären, **warum genau dieser Weg**?
- Kann ich den **Personalaspekt vertiefen**?

---

## 6. Die Rolle der KI (EU-AI-Act-konform)

- **Stufe A (jetzt, ohne KI):** deterministische Werkzeuge/Rechner/Matrizen → Artefakte.
- **Stufe B (Phase 3, n8n + Claude):** **Rekontextualisierung** von Aufgaben (unbegrenztes
  Üben mit Varianz) + **formatives inhaltliches Feedback** (Freitext) + Deck-Assistenz
  (Ideenfindung/Bogen/Gliederung) + Fachgespräch-Simulator.
- **Immer:** KI **assistiert und gibt Feedback — bewertet/benotet nicht**. Der Mensch
  behält die fachliche Hoheit; der Schüler **denkt selbst mit**. Niedrigrisiko-Einstufung,
  Details in [ki-governance.md](ki-governance.md). Aufgaben-Aufbereitung folgt
  [content-richtlinien.md](content-richtlinien.md) (kein Verbatim, eigene Erklärung).

**Entwicklungspfad der KI-Rolle (Assistent ist der Start, nicht das Ende):**
Der **Assistent** (assistieren, Feedback geben, Schüler entscheidet) ist bewusst der
**Einstieg** — datenschutz- und akzeptanzfreundlich. Danach denkbare, **wählbare**
Ausbaustufen (der Lernende steuert das Maß):
- **Sparringspartner / sokratisch:** hinterfragt Entscheidungen („Warum dieser Bogen?
  Welche Alternative hast du verworfen?") — trainiert genau das Fachgespräch.
- **Prüfer-Simulation (Rollenspiel):** die KI spielt den Prüfungsausschuss durch
  (Fachgespräch-Fragen, Nachbohren am Personalaspekt) — perspektivisch auch mit Stimme.
- **Adaptiver Tutor:** erkennt Schwachstellen über Kapitel/HB hinweg und schlägt
  gezielt Wiederholung/Übung vor (speist den HB-Trainingsraum).
- **Höhere Autonomie (optional):** für Fortgeschrittene mehr Vorschlagskraft — **immer**
  mit dem Schüler als Entscheider und ohne Benotung.
📝 *Reihenfolge/Umfang der Ausbaustufen später terminieren (Roadmap Phase 3+).*

---

## 7. Offene Punkte (zu besprechen)

- **HB-Trainingsraum/Satellit:** UI-Ort, Kennzahlen, ob eigenes 3D-Objekt im Karussell.
- **Übungswelten-Content:** Fallaufgaben/MC pro Kapitel (Stufe A) + KI-Varianz (Stufe B).
- **Deck-Generator:** Umfang Stufe-A-Vorstufe (Aggregation steht) → KI-Assistenz → Export
  (HTML-Slides/PDF). Fertige Themes vs. KI-Theme-Erstellung.
- **„alle weiteren Themen"** (vom Nutzer angekündigt) — hier andocken.

# Titan — Gesamtkonzept & Lernprozess

> Konzept-Landkarte des End-to-End-Lernwegs — von der Zertifizierung bis zur
> fertigen IHK-Präsentation. Stand 2026-07-24 · **zur Prüfung**. Verweist auf
> [produktvision.md](produktvision.md), [interaktive-module.md](interaktive-module.md),
> [ki-governance.md](ki-governance.md), [content-richtlinien.md](content-richtlinien.md),
> [roadmap.md](roadmap.md). Grundlage Deck-Teil: `docs/Module-Präsi/10 Training
> Fachgespräch.pdf`.

---

## Auf einen Blick (Executive Summary)

- **Was:** Titan führt den Lernenden vom **Universum** (IHK-Zertifizierung) bis zur **fertigen
  IHK-Präsentation** — einmal die eigene **Star-Company** beschreiben, jedes Kapitel erzeugt ein
  **Artefakt**, alle Artefakte werden zur Prüfungspräsentation (**Missions-Launch**, der USP).
- **Nordstern (Design-Kompass):** *„Ich zeige nicht, was Marketing ist, sondern dass ich als Fachwirt
  **Entscheidungen treffen** kann — unter Berücksichtigung von Markt, Wirtschaftlichkeit und Menschen."*
  Jedes Feature wird daran gemessen.
- **Die Reise:** **Planet** (lernen + Artefakt) → **Satellit** (HB-Trainingsstation + Probe-Startrampe,
  dockt beim ersten Artefakt an) → **Missions-Launch** (Universum-Startrampe = die Prüfungspräsentation).
- **Das Deck:** 4 wählbare **Spannungsbögen**, **KI-Assistenz** (Ideen/Bogen/Gliederung/Theme — *Schüler
  entscheidet*), **9 Bewertungskriterien** als mitlaufender Status, **agiles Fachgespräch jederzeit**,
  **Personalaspekt weich erzwungen**, **Anti-Uniformität** (Vielfalt ist Pflicht — IHK prüft das).
- **KI:** Stufe A (jetzt, deterministisch) · Stufe B (Phase 3: Varianz, Feedback, Fachgespräch) —
  **assistiert & gibt Feedback, benotet nie**. EU-Pfad: **Anthropic → Langdock (EU-Gateway) → Soofi/Mistral**.
- **Design:** dunkler **Kosmos draußen**, „Licht an" im **Lernbereich** (umgesetzt).

---

## 1. Nordstern (der rote Faden)

**„Ich zeige nicht, was Marketing ist, sondern dass ich als Fachwirt Entscheidungen
treffen kann — unter Berücksichtigung von Markt, Wirtschaftlichkeit und Menschen."**
(Abschluss-Merksatz aus der Fachgespräch-Schulung — er ist Titans didaktischer Nordstern.)

> **Design-Kompass (VERBINDLICH):** **Jede** Feature-/Design-Entscheidung wird an genau
> diesem Satz gemessen. Prüffrage immer: *„Bringt das den Lernenden näher an eine
> **begründete Entscheidung** mit Bezug auf **Markt, Wirtschaftlichkeit und Menschen**?"*
> Reines Faktenwissen (z. B. Karteikarten) ist **Mittel, nicht Ziel** — auch Wiederholung
> und Übung zahlen letztlich auf **Entscheidungskompetenz** ein. Features, die diese Frage
> nicht mit „ja" beantworten, werden zurückgestellt.

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

**Fortschritt Richtung Missions-Launch (neu, bestätigt):** Die Landkarte zeigt nicht nur
„wo im Stoff", sondern den **Weg zur prüfungsfertigen Präsentation**. Thematisch als
**„Startklar"-/Launch-Bereitschaft** (kosmos-passend, nicht als nüchterne Büro-Ampel):
je mehr Artefakte pro Galaxie/Universum gesammelt sind, desto weiter füllt sich die
**Missions-Bereitschaft** — Kandidaten: ein sich füllender **Energie-/Antriebs-Ring** ums
Universum, ein **aufleuchtendes Sternbild**, oder ein **Start-Countdown**. Eine
Ampel-Logik (rot → gelb → grün = „wie startklar") kann als subtiler Status dahinterliegen,
aber im **Kosmos-Look** (Reaktor-/Energie-Metapher).

**Entscheidung (Review 2026-07-24):** **MVP = Energie-/Antriebs-Ring, der sich füllt** (Artefakte
gesammelt) **+ Textlabel „X/Y"** (barrierefrei — nicht nur Farbe; der Ring-Glow changiert subtil
rot→gold, aber die **Zahl** trägt die Info). **Optional:** Prüfungsdatum-**Countdown**, sobald ein
Datum gesetzt ist. **Sternbild** (aufleuchtende Sterne) = **Phase 4.2** (Ausbaustufe). **Wichtig:
Phase-4-Ziel ist NASA-„Eyes"-Qualität** — die Launch-Anzeige soll dort in echtes WebGL-Niveau
wachsen (siehe [roadmap.md](roadmap.md) 4.2, V2-Konzept im Figma).

**Satellit in der Umlaufbahn (Phase 4):** Der HB-Trainingsraum-Satellit (§4) soll — mit
Blick auf Phase 4 — **in der Umlaufbahn mitschweben** (WebGL: umkreist das Handlungsfeld).
Stufe 1: andockende **Station** am Karussell-Ende (CSS/SVG). Stufe 2: echtes
**orbitierendes 3D-Objekt**. Bleibt bei **3 Navigationsebenen** (Universum/Galaxie/Planet)
+ orbitierendem Satellit — keine zusätzliche Klick-Ebene.

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

**Entscheidungen (Review 2026-07-24):**
- **Artefakt-Spur (leicht):** Nur **Interaktive Module** erzeugen deck-reife **Artefakte**.
  Übung/Test/Karteikarten bleiben **Training** — hinterlassen aber eine **leichte Spur**:
  ein **„geübt/geprüft"-Marker** (fließt in HB-Fortschritt + Wiederholungslogik) und die
  **Fachbegriffe** aus den Karteikarten als Vokabular-Brücke zur Präsentation
  („Fachbegriffe korrekt"). **Keine** vollen Artefakte aus Übung/Test (verwässert den Begriff).
- **Empfohlene, nicht erzwungene Dramaturgie:** **Entdecken** ist visuell der **Startpunkt**,
  üben/test als „festigen/prüfen" nachgelagert dargestellt — **alle Modi frei wählbar**
  (kein hartes Gate; erwachsene Selbststeuerung, Local-First).
- **Kein zusätzlicher Modus:** **Wiederholung/Prüfungsdatum** (Spaced Repetition, Roadmap
  4.3) ist **kein Kapitel-Modus**, sondern eine **übergeordnete Ebene** (steuert *wann*
  Karten/Übungen wiederkehren) → gehört in den HB-Satellit / eine globale
  „Prüfungsvorbereitung"-Sicht. Die 6 Kapitel-Modi sind vollständig.

**Star-Company-Durchschlag (Prinzip, Review 2026-07-24):** Sobald die Star-Company
definiert ist, **trägt sie durch alle Aufgaben** — Fallbeispiele, interaktive Module,
Übungen, Deck. Technische Basis: die Ersetzungs-Engine `kompass-vars.ts`
(`{{firma}}/{{branche}}/{{groesse}}/…` überall ersetzt). Das ist der **rote Faden** +
Anti-Uniformitäts-Motor.
> **Bewusste Ausnahme — IHK-Test-Format:** Die echte schriftliche IHK-Prüfung gibt eine
> **fremde, vorgegebene** Fallfirma (ad-hoc-Analyse unter Zeitdruck). Deshalb trainiert die
> **Prüfungssimulation bewusst auch an FREMDEN, KI-variierten Firmen** (Stufe B) — sonst
> blinder Fleck bei **Transfer-/Analysekompetenz** auf neue Situationen (Bewertungskriterium).
> Also: Star-Company als roter Faden **überall**; die Prüfungssim mischt **fremde Fälle** dazu.

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

**Lern-Dramaturgie „Planet → Station → Startrampe" (Review 2026-07-24, empfohlen & bestätigt):**
1. **Planet (Kapitel):** lernen + **Artefakt** erzeugen.
2. **Satellit (HB) = Trainingsstation *und* Probe-Startrampe:** sammeln, üben/prüfen
   (HB-**Trainings**-Sim), HB-Fortschritt — **und** eine **Probe-Präsentation** zu einem
   HB-Thema bauen (Deck-Bau **niedrigschwellig lernen**, bevor es ernst wird). Der Satellit
   ist **immer sichtbar**, aber **inaktiv/dunkel** und **erwacht/dockt an**, sobald das
   **erste HB-Artefakt** existiert — Belohnungsmoment **ohne Gate**.
3. **Missions-Launch (Universum-Ebene) = die echte Startrampe:** **DIE** Prüfungspräsentation
   zum **einen** gewählten Thema (IHK-Realität: eine 10-Min-Präsentation, nicht eine je HB) —
   zieht Artefakte aus dem ganzen Weg. Hier liegt auch die **globale Prüfungsvorbereitung**
   + Spaced-Repetition (§3). Details: §5.

**Prüfungssimulator, zwei Ebenen:** **HB-Trainings-Sim** im Satellit (Fokus ein HB) +
**globale Prüfungsvorbereitung** (Ernst-Sim über alles, zeit-/prüfungsdatumsgesteuert) auf
Universum-Ebene.

**Kennzahlen im Satellit (Entscheidung 2026-07-24)** — am Design-Kompass ausgerichtet („wie
startklar bin ich für die Präsentation dieses HB?", keine Vanity-Zahlen):
1. **Artefakte gesammelt** (X/Y) — die eigentliche Deck-Reife.
2. **Kapitel-Fortschritt** (Verstehen → Anwenden).
3. **Letztes Prüfungssim-Ergebnis** (HB-Trainings-Sim).
4. **Wiederholung fällig / letzte Aktivität** (Spaced-Repetition-Signal).

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

**Feedback-Modus (Review 2026-07-24):** Die 9 Kriterien laufen als **subtiler mitlaufender
Status** mit (Orientierung). Zusätzlich — der Kern: der Schüler kann **jederzeit ein
Fachgespräch auslösen** (§5.4), eine **agile Feedback-Schleife** statt Bewertung erst am
Ende. **Personalaspekt (häufigster Stolperstein): weich erzwungen** — die KI fragt beim
Lösungs-/Umsetzungsschritt **aktiv** nach der Personal-Dimension, und der Status flaggt
**auffällig** „Personal noch nicht als Teil der Lösung erkennbar", **blockiert aber nicht**
(Schüler entscheidet, kein hartes Gate).

### 5.4 Fachgespräch-Simulator — jederzeit (agile Feedback-Schleife)

Das Fachgespräch ist **nicht** nur der Abschluss: Der Schüler kann **während des Baus
jederzeit „frag mich" auslösen** → die KI führt ein **Mini-Fachgespräch zum aktuellen
Stand** (aus den gewählten Artefakten). Kern-Fragen (auch für den finalen Ernst-Lauf):
- Kann ich meine **Entscheidung verteidigen**?
- Kenne ich **Alternativen und deren Nachteile**?
- Kann ich erklären, **warum genau dieser Weg**?
- Kann ich den **Personalaspekt vertiefen**?

„Nach der Präsentation folgt das Fachgespräch — oft entscheidet es über die Note." Deshalb
ist das Üben davon **durchgängig** verfügbar, nicht nur am Schluss.

### 5.5 Export, Zustände & Vielfalt (Review 2026-07-24)

- **Export = portable Datei (prüfungstauglich):** **PDF** als primäres, **offline-sicheres**
  Ergebnis (läuft auf jedem IHK-Beamer/Laptop ohne Internet); **PPTX** zum Nachbearbeiten als
  spätere Option. **Titan-Web = Bau-Werkzeug, nicht Präsentations-Laufzeit.** Erst der Export
  macht „fertiges Deck" real.
- **Zwei Zustände + Versionierung:** **„In Bearbeitung"** (editierbar) ↔ **„Publikation-Frei"**
  (eingefrorene Prüfungsversion). Entspricht sichtbar dem `deckReif`-Flag.
- **Vielfalt — kleinster Nenner:** Der Großteil ist **inhärent & gratis** — (a) andere
  Star-Company, (b) anderer Spannungsbogen, (c) anderes Thema → Inhalt + Struktur unterscheiden
  sich schon stark. **Minimaler Zusatz:** **3–5 Basis-Templates × ~6 Farbwelten** (auto aus
  Star-Company/Branche oder wählbar) = **20–30 distinkte Looks**. **Große KI-Theme-Generierung =
  Ausbaustufe, nicht MVP.**
- **Sprecher-Notizen + 10-Min-Timing:** je Folie ein **auto-Entwurf** für Sprecher-Notizen
  (editierbar); Export als **Präsentations-PDF** + **„Notizen-Handout"**. Beim Bauen läuft eine
  **10-Min-Timing-Leiste** (3–4 / 4–5 / 1–2 Min) mit und **warnt bei Überladung**.

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
**Phase-3-Reihenfolge (entschieden 2026-07-24):**
1. **Star-Company-Kontext-JSON** (Deklination) — billig, einmalig, Voraussetzung fürs Wording.
2. **Formatives Feedback (Freitext)** — USP-Differenzierer; **direkt via Claude/Tool-Runner, ohne n8n**.
3. **Fachgespräch-Simulator** (agile Schleife) — auf demselben Feedback-Kern.
4. **Fallaufgaben-Varianz / Fall-Recast** — **hier** kommen die **n8n-Agenten-Teams** rein
   (komplexe Orchestrierung: Master variieren, fremde Firma, Lösung mitgenerieren).
5. **Sparring / Prüfer-Sim / adaptiver Tutor** — spätere Veredelung (Kosten stets im Blick).

**Von Tag 1 mit:** Guardrails (Master/Personalakte-Grounding, **kein Benoten**, Transparenz) +
Kosten-Gate (Inklusiv-Kontingent + Haiku-Fallback). **n8n-Flows erst ab Schritt 4** (kein
Over-Engineering) — **aber das Agenten-Team + die „Personalakten" (Persona + fachliche Tiefe) werden
früh als Design-Artefakt DEFINIERT**, bevor gebaut wird.
📝 *n8n-Instanz auf dem VPS vorhanden, aber noch zu installieren/konfigurieren (Support nötig) →
abgesicherter docker-compose-Service neben Titan, EU/self-hosted, Claude/Langdock-Anbindung.*

**Kosten, EU-Souveränität & AI Act (Review 2026-07-24):**
- **AI Act ≠ Modell-Herkunft:** Der EU AI Act ist **risikobasiert**. Titan ist **niedrigrisiko**
  (formatives Feedback, **keine Benotung/Entscheidung über die Person**); die Pflicht ist v. a.
  **Transparenz** („es ist KI"). **Der AI Act verlangt kein EU-Modell** — ein US-Anbieter
  (Anthropic) ist AI-Act-konform, solange Risikoklasse + Transparenz stimmen.
- **EU-Souveränität = DSGVO-/Vertrauens-Frage (nicht AI-Act):** Der Datentransfer in die USA ist
  ein **DSGVO**-Thema. Entschärft durch: (a) es gehen nur **fiktive Star-Company-Daten** an die KI
  (**keine echten Personendaten**) → minimale DSGVO-Exposition; (b) Zugriff über **Langdock**
  (DE, ISO 27001, SOC 2, **EU-Hosting, Zero-Retention**, DPA) als konforme Durchleitung.
- **Anbieter-Pfad (gestuft):**
  1. **Start Anthropic/Claude** direkt (beste Qualität).
  2. **EU-konform via Langdock** (DE-Gateway, reicht Claude/Mistral EU-konform + DPA + Zero-Retention
     durch), sobald Compliance/Vertrieb es verlangt.
  3. **Perspektivisch nativ EU (beobachten, gestuft einsetzen):**
     - **Soofi S** (DE, 30B **quelloffen**, München/Telekom-AI-Cloud, erneuerbare Energie) — **der
       spannendste souveräne, nachhaltige EU-Kandidat**: deutsch-optimiert (passt zu Titans Content!),
       **self-hostbar → volle Souveränität, ~0 Token-Kosten**. **Heute** schlägt es andere *offene*
       Modelle (OLMo 3/Apertus), ist aber **noch nicht Claude-Frontier** fürs nuancierte
       Fachgespräch/Feedback; die **~100B-Version** ist das Ziel.
     - **Mistral** (FR) — GPT-4-Klasse, günstig, aber eine Stufe unter der Claude-Spitze bei hartem
       Reasoning. **Aleph Alpha** (DE) = Souveränität, nicht Claude-Qualität.
  - **Split-Strategie (Empfehlung):** **Soofi/EU self-hosted** für **deutsch-lastige, einfachere**
    Aufgaben (Begriffs-/Karteikarten-Erklärungen, simple Varianten, Star-Company-Deklination);
    **Claude via Langdock** für **hohes Reasoning** (formatives Feedback, Fachgespräch) — bis ein
    EU-Modell auch das trägt. *Self-Hosting von Soofi braucht GPU-Infra → Kostenfaktor gegen die
    Token-Ersparnis abwägen.*
  - **Test-Trigger (entschieden 2026-07-24):** Soofi **nicht jetzt** — Beobachtungs-Kandidat ab
    Phase 3. Sobald das Feedback via Claude steht → **Blind-Vergleich Soofi vs. Claude** auf
    deutsch-lastigen/einfachen Aufgaben; besteht Soofi eine **Qualitäts-Schwelle** → diese Aufgaben
    umlegen. **Zuerst über einen EU-gehosteten Endpoint testen** (falls verfügbar); **GPU-Box nur,
    wenn Kosten/Souveränität es rechtfertigen** — nicht früh mieten. (Verbindet mit Agenten-QA, §7.)
- **Kosten je Fachgespräch:** niedrig ~1 ct (Haiku) · **mittel ~6 ct (Sonnet 5 + Caching → Empfehlung)**
  · hoch ~20 ct (Opus). **Kontingent-Risiko niedrig** → großzügiges Fair-Use, Drossel nur bei
  Missbrauch. Tabelle + Rechnung: [finanzplan.md](finanzplan.md) §1.2.

---

## 7. Offene Punkte & Test-Strategie

- **Agent-gestützte QA (entschieden 2026-07-24, zweigleisig):** (a) **deterministische
  E2E-Regressionstests** (Playwright) **laufend ab jetzt** für die gebauten Teile; (b) ein
  **KI-„verwirrter-Anfänger"-Agent**, der den kompletten Missions-Launch **durchspielt** und
  **UX-Sackgassen / Verständnis-Hürden / KI-Feedback-Qualität / Durchspielbarkeit** aufdeckt —
  **ab Phase 3** (sobald der Flow steht). Als **Subagent on-demand** (interne QA, vernachlässigbare
  Kosten). Ergebnis: knappes **„Fallstrick-Protokoll"**.
- **Lastentest (bestätigt):** **vor dem ersten öffentlichen/Marketing-Launch UND vor der ersten
  großen B2B-Kohorte**. Titan ist überwiegend **statisch** (Lernseiten prerendered → sehr lastarm);
  der Test zielt auf die **dynamischen Teile**: gleichzeitige **Auth/Sessions**, **/api/progress**-
  Durchsatz, **DB unter Last**, und (Phase 3) die **KI/n8n-Pipeline** + Kontingent-Kosten bei
  Parallelnutzung. Werkzeug: **k6** oder **Artillery** (EU/self-host-freundlich), gegen den
  Staging-VPS. Früh Engpässe sehen (DB-Pool, n8n-Concurrency, KI-Kontingent).
- **HB-Trainingsraum/Satellit:** verbleibend nur noch **Kennzahlen** im Trainingsraum
  (UI-Ort/Andock-Logik in §4 entschieden).
- **Launch-Bereitschaft (§2):** konkrete Kosmos-Visualisierung wählen (Energie-Ring /
  Sternbild / Countdown) — Kandidat für den Phase-4.2-Block.
- **Übungswelten-Content (entschieden 2026-07-24):** **Stufe A = MC + Selbstcheck** (jetzt, ohne
  KI); **Freitext-Fallaufgaben + Varianz = Stufe B** (KI ab Phase 3). Aufgaben in **eigenem
  Titan-Wording** (weg von IHK-Formulierungen, [content-richtlinien.md](content-richtlinien.md)).
  Varianz/„Master" über **n8n-Agenten-Teams mit fiktiver Personalakte** (Persona + fachliche Tiefe,
  gegen Halluzination — [ki-governance.md](ki-governance.md)). *Offen: Menge Aufgaben je Kapitel.*
- **Redaktionssystem-Integration (entschieden 2026-07-24):** **Directus = Quelle der Wahrheit**;
  Titan **zieht beim Build** (Content-Loader + **Zod-Validierung** → statisch), **Webhook → CI-Build
  → Deploy**. **Nicht** Runtime-Fetch, **nicht** Push (bewahrt statisch/schnell/**offline** — kritisch
  in der Prüfung). Vorhandene **Fachwirt-PDFs müssen erst strukturiert** in Directus abgelegt werden
  (pro Thema/Feld) — der eigentliche Aufwand. Siehe [roadmap.md](roadmap.md) 2.6 / EPIC-13.
- **Deck-Generator:** Export (HTML-Slides/PDF); Umfang der KI-Assistenz-Stufen.
- **KI-Ausbaustufen (§6):** Reihenfolge Sparring/Prüfer-Sim/adaptiver Tutor terminieren.
- **„alle weiteren Themen"** (vom Nutzer angekündigt) — hier andocken.

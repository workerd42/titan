# Titan — Problembasiertes Lernen (PBL): Konzept & Pitch

> **Single Source of Truth** für den pädagogischen Kern, den Wert und die technische Vision
> von Titan. Adressaten: Team, Bildungspartner, Stakeholder/Investoren.
> Bezug zur Umsetzung: [gesamtkonzept-lernprozess.md](gesamtkonzept-lernprozess.md) ·
> [ki-governance.md](../ki/ki-governance.md) · [roadmap.md](../planung/roadmap.md) ·
> [interaktive-module.md](interaktive-module.md).

---

## Kurzfassung

Titan verwandelt die Fachwirt-Weiterbildung **vom Auswendiglernen von Theorie in das Lösen
echter betrieblicher Probleme** — am eigenen Unternehmen des Lernenden („Star-Company"). Der
didaktische Kern ist **Problembasiertes Lernen (PBL)**, umgesetzt als **geführtes, gestütztes
PBL**: erst Schema-Aufbau, dann Szenario-Exploration mit einem **Sokratischen KI-Tutor**, der
Fragen stellt statt Antworten zu liefern.

> **Kernthese:** Die IHK-Fachwirtprüfung ist **handlungsspezifisch** (Situationsaufgaben,
> Fachgespräch). Wer nur Fakten büffelt, scheitert am Transfer. Titan trainiert genau die
> Kompetenz, die geprüft *und* im Berufsalltag gebraucht wird: **begründet entscheiden.**

---

# TEIL 1 — Bedeutung & Relevanz: Warum PBL hier der Gamechanger ist

## 1.1 Warum Frontalunterricht/Büffeln für Fachwirte unzureichend ist

- **Die Prüfung fragt Handlung, nicht Wissen.** IHK-Fachwirtprüfungen bestehen aus
  **Situationsaufgaben** und einem **Fachgespräch** — bewertet wird die *Anwendung* von
  Wissen auf einen betrieblichen Fall, nicht das Nacherzählen von Definitionen.
- **Träges Wissen.** Auswendig Gelerntes bleibt „inert": abrufbar im Test, **nicht abrufbar
  in der Entscheidungssituation**. Genau diese Lücke lässt Kandidaten im Fachgespräch scheitern.
- **Erwachsene lernen anders (Andragogik).** Berufstätige lernen **problem- und
  erfahrungsorientiert**, nicht themen-linear. Sie fragen „Was bringt mir das in *meinem*
  Betrieb?" — Frontalstoff beantwortet das nicht.
- **Zeit ist der knappste Faktor.** Die Zielgruppe lernt neben Vollzeitjob und Familie.
  Ineffizientes, kontextfreies Büffeln verschwendet die knappste Ressource.

## 1.2 Warum PBL exakt zum Fachwirt-Profil passt

- **Deckungsgleich mit dem Prüfungsformat.** PBL *ist* die Situationsaufgabe: ein
  realistisches, unscharfes Problem, das strukturiert, analysiert und entschieden werden muss.
- **Mittlere Führungsebene = Entscheider.** Fachwirte führen Teams und Projekte. Ihr
  Alltag ist **Problemlösen unter Unsicherheit** — nicht Faktenreproduktion. PBL trainiert
  die reale Rollenkompetenz.
- **Transfer by design.** Weil das Problem am **eigenen Unternehmen** (Star-Company)
  bearbeitet wird, entsteht Wissen bereits *im Anwendungskontext* — der Transfer in den
  Berufsalltag ist nicht Hoffnung, sondern eingebaut.

## 1.3 Der Mehrwert — didaktisch & betriebswirtschaftlich

**Für Lernende**
- **Höhere Bestehenswahrscheinlichkeit**, weil genau die geprüfte Handlungskompetenz trainiert wird.
- **Motivation durch Relevanz** — jede Aufgabe betrifft *ihr* Unternehmen.
- **Prüfungsangst runter** — das Fachgespräch ist nicht mehr fremd, sondern hundertfach geübt.

**Für Bildungsanbieter**
- **Differenzierung**: weg vom austauschbaren PDF-Skript, hin zu einem messbaren
  Kompetenz-Erlebnis.
- **Skalierung ohne Qualitätsverlust**: der Sokratische Tutor gibt individuelles,
  geduldiges Feedback — 1:1-Betreuung zu Grenzkosten nahe null.
- **Datengetriebene Betreuung**: Dozenten sehen, *wo* Lernende hängen (Kompetenz, nicht nur Fortschritt).

## 1.4 Kritischer Rahmen — „Scaffolded PBL", nicht reines PBL

> **Leitplanke, kein Kleingedrucktes.** *Reines* entdeckendes PBL ist für Novizen
> nachweislich riskant (Kirschner/Sweller/Clark, 2006): ohne Vorwissen fehlt das Gerüst, um
> ein offenes Problem zu strukturieren → Überforderung.

Titan setzt daher **geführtes, gestütztes PBL**:
1. **Erst Schema, dann Problem.** Die Phasen *Verstehen* und *Merken* bauen das Fundament,
   bevor *Anwenden* zur Szenario-Exploration wird.
2. **Abbaubare Stütze (Fading).** Stützräder werden entfernt, sobald Kompetenz wächst.
3. **Beraten statt blockieren.** Der Tutor führt und stützt — **er benotet und sperrt nicht**
   (siehe [ki-governance.md](../ki/ki-governance.md): *formatives Feedback ohne Note*).
4. **Immer an der IHK verankert.** Jedes Problem ist einem Handlungsbereich + einer
   Prüfungskompetenz zugeordnet — Exploration driftet nicht ins Beliebige.

---

# TEIL 2 — Konsolidierung unseres Applikations-Konzepts

## 2.1 Kernprinzip: Vom Theorie-Konsum zur Szenario-Exploration

Die bestehende **4-Phasen-Reise pro Thema** ist das Trägersystem des PBL:

| Phase | Rolle im PBL | Zustand |
|-------|--------------|---------|
| **① Verstehen** | Schema-Aufbau (geführte Instruktion, Worked Examples) | ✅ live |
| **② Merken** | Verankerung (Merksatz, Begriffe) | ✅ live |
| **③ Anwenden** | **PBL-Kern**: Problem am eigenen Unternehmen lösen, Werkzeuge, Sokratischer Tutor | 🔧 teils live, KI ab Phase 3 |
| **④ Prüfen** | Validierung im Prüfungsformat + Fachgespräch | 🔧 teils live |

**Der Motor ist die Star-Company.** Der Lernende beschreibt einmal sein Unternehmen; dieses
schlägt via Platzhalter (`{{firma}}`, `{{branche}}` …) in **alle Fallaufgaben** durch. Aus
einer generischen Übung wird *sein* Problem. (Aktueller Ausbau: siehe Roadmap-Punkt
„Star-Company-Durchschlag".)

## 2.2 Interaktive UI/UX-Elemente

### a) Szenario-Explorer & Dashboard (Problem-Discovery)
- Einstieg in *Anwenden* nicht als Textwand, sondern als **Fall-Dashboard**: Ausgangslage,
  Kennzahlen, Beteiligte, offene Frage — der Lernende **entdeckt das Problem**, statt es serviert
  zu bekommen.
- **Status:** SOLL (Phase 3). Baut auf dem bestehenden Fallbeispiel-Block auf.

### b) Visual Scaffolding
- **Ishikawa-/Ursache-Wirkungs-Diagramm**, **Drag-and-Drop-Mindmaps** zum Strukturieren
  komplexer Probleme (z. B. Ursachen eines Umsatzeinbruchs).
- Ordnet sich in die bestehende **Werkzeug-Engine** (`module-engine.ts`) ein — dieselbe
  Mechanik wie SWOT/Scoring, nur visuell-manipulierbar.
- **Status:** SOLL (Phase 3/4, nach den quantitativen Werkzeugen).

### c) Simulationen
- **Parameter-Regler** für Kosten-/Kennzahlenrechnung: Preis, Menge, Fixkosten schieben →
  Deckungsbeitrag/Break-Even/Marktanteil verändern sich live. Aus „Formel anwenden" wird
  „Wirkung *erleben*".
- **Branching Scenarios**: Entscheidung A/B/C führt zu unterschiedlichen Folgesituationen —
  Konsequenz-Kompetenz statt Einzelantwort.
- **Status:** Regler = natürliche Erweiterung der bestehenden Rechen-Werkzeuge (Phase 2/3);
  Branching = Phase 3 (an den Tutor gekoppelt).

## 2.3 Der Sokratische KI-Tutor

> Titans **Fachgespräch-Simulator** *ist* der Sokratische Tutor. EU-Pfad:
> Anthropic → optional Langdock (DE-Gateway) → Perspektive Soofi.

### Rolle
- **Keine fertigen Antworten — nur gezielte Fragen.** Der Tutor führt den Lernenden per
  Frage zur eigenen Erkenntnis („Was passiert mit dem Deckungsbeitrag, wenn …?").
- Er ist **geduldig, wertschätzend, prüfungsnah** — die Probe für das echte Fachgespräch.

### Technische Architektur
- **System-Prompt** definiert Rolle, Ton, didaktische Regeln (nie die Lösung verraten) und
  Kein-Note-Governance.
- **XML-Kontext-Injektion**: Fall, Musterlösung, IHK-Kompetenz **und die Star-Company-Daten**
  werden strukturiert in den Kontext gegeben → das Gespräch ist auf *dieses* Unternehmen und
  *diesen* Fall zugeschnitten.
- **State-Machine für Phasen**: definierte Gesprächsphasen (Problem erfassen → analysieren →
  entscheiden → begründen); der Tutor weiß, wo im Prozess der Lernende steht.

### Dual-Output-Logik
Jede Tutor-Antwort erzeugt **zwei Ausgaben**:
1. **JSON (Backend)** — strukturierte Bewertung: erreichte Kompetenzsignale, Phasenstand,
   nächster Zug. **Wichtig (Governance): advisorisch, kein harter Gatekeeper** — es steuert
   die Stütze, sperrt aber nie den Fortschritt.
2. **UI-Botschaft (Lernender)** — die menschlich formulierte Frage/Rückmeldung.

### Frustrations-Ventil (mehrstufiges Scaffolding)
Erkennt der Tutor eine Blockade, **fadet er die Stütze stufenweise ein** statt den Lernenden
hängen zu lassen:
1. **Umformulieren** der Frage · 2. **Hinweis** (Konzept nennen) · 3. **Teil-Lösung / Analogie**
· 4. **Angebot**, die Musterlösung gemeinsam durchzugehen.
→ Löst die **Novizen-Überforderung** (Teil 1.4) direkt auf.

---

## Einordnung in die Titan-Architektur (Fit-Matrix)

| PBL-Baustein | Titan-Heimat | Projekt-Phase | Status |
|--------------|--------------|---------------|--------|
| Personalisiertes Problem | Star-Company (`{{firma}}`) | P2 | 🔧 Ausbau |
| Szenario-Explorer/Dashboard | Anwenden-Phase | P3 | ⬜ |
| Visual Scaffolding (Ishikawa/Mindmap) | Werkzeug-Engine | P3/P4 | ⬜ |
| Parameter-Regler-Simulation | Rechen-Werkzeuge | P2/P3 | 🔧 Erweiterung |
| Branching Scenarios | Anwenden + Tutor | P3 | ⬜ |
| Sokratischer Tutor | Fachgespräch-Simulator | P3 | ⬜ |
| Kompetenz-Datenspur | Dozenten-Cockpit | P2/P3 | ⬜ |
| Capstone: IHK-Präsentation | Missions-Launch / Deck | P3/P4 | 🔧 Vorstufe live |

## Sequenzierung (bewusst, kein Big-Bang)

1. **Jetzt (P2):** Content-Fundament — Star-Company-Durchschlag, Directus-Redaktion,
   quantitative Werkzeuge (BCG, Break-Even). *Das Gerüst, auf dem PBL steht.*
2. **Phase 3 (KI):** Sokratischer Tutor + Fall-Dashboard + Branching + formatives Feedback.
3. **Phase 4:** Visual Scaffolding in 3D/Kosmos, volle Simulationen, Missions-Launch-Capstone.

## Risiken & Leitplanken (Zusammenfassung)

| Risiko | Leitplanke |
|--------|------------|
| Novizen-Überforderung | Scaffolded PBL: erst Schema, Fading, Frustrations-Ventil |
| Exploration vs. Prüfungssicherheit | PBL ergänzt die 4 Phasen, ersetzt sie nicht; IHK-Anker |
| KI-Gatekeeper = versteckte Note | Tutor berät/stützt, blockiert nie (Kein-Note-Governance) |
| Scope-Explosion | Strikte Phasen-Sequenzierung; Fundament zuerst |
| Datenschutz (echte Firmendaten) | Fiktionale Angaben genügen; EU-Hosting; DSGVO-Pfad (Langdock) |

---

## Fundierung & Bezug

Die didaktische/wissenschaftliche Fundierung dieses PBL-Ansatzes sowie Prüfungsfragen-
Entwicklung und ein Autoren-Netzwerk für die Content-Skalierung kommen über den
strategischen Beirat (**Dr. Carsten Wittling / Prorsus Digital** — Agentur für interaktive
Lernmedien). Die KI-Umsetzung (Sokratischer Tutor / Fachgespräch) ist Phase 3 — Kosten/
Risiken/Reihenfolge in [phase3-ki-plan.md](../ki/phase3-ki-plan.md).

---

*Dieses Dokument ist die pädagogische SSOT. Änderungen hier zuerst, dann Abgleich mit Notion.*

# KI-Governance & EU-AI-Act-Konformität

> **Zweck:** Dieses Dokument beschreibt, wie Titan Künstliche Intelligenz einsetzt,
> und weist nach, dass der Einsatz **bewusst niedrigrisiko** ausgelegt ist —
> für Rechtskonformität (EU AI Act, DSGVO) und als belastbare Grundlage für
> Investoren und Bildungsträger.
>
> **⚖️ Rechtlicher Vorbehalt:** Dieses Dokument ist **keine Rechtsberatung**. Es
> hält die *Design-Intention und Compliance-by-Design* fest. Die formale
> Risiko-Einstufung nach EU AI Act sowie eine DSGVO-Datenschutz-Folgenabschätzung
> (DPIA) sind vor dem produktiven KI-Betrieb durch eine:n Fachjurist:in bzw.
> Datenschutzbeauftragte:n zu bestätigen. Die hier getroffenen Einordnungen sind
> nach bestem Wissen begründet, aber nicht abschließend verbindlich.

---

## 0. Aktueller Stand

**Zum jetzigen Zeitpunkt ist KEINE KI produktiv im Einsatz.** Die Lernplattform
arbeitet mit vom Menschen erstellten Inhalten und – für die Personalisierung auf
das „Kompass"-Unternehmen – mit **rein lokaler, offline arbeitender
Textersetzung** (`{{platzhalter}}`, siehe [architektur.md](./architektur.md)),
also ohne jedes KI-Modell.

Dieses Dokument beschreibt die **geplante** KI-Schicht als **Governance- und
Architektur-Leitplanke**: Sie wird von Beginn an so entworfen, dass sie den
niedrigsten sinnvollen Risiko-Status behält. Jede spätere Implementierung ist an
diesem Dokument zu messen.

---

## 1. Leitprinzip: Der Mensch bleibt die fachliche Autorität

Titan setzt KI **assistierend**, nie **entscheidend** ein. Der rote Faden:

```
 Dozent (Mensch)            KI-Schicht (assistierend)          Lerner
 ───────────────            ─────────────────────────          ──────
 liefert den fachlichen  →  (1) variiert Aufgaben/Fälle     →  übt, schreibt zu
 „Master" (autoritative        (Formulierung, Zahlen,           Fallaufgaben eigene
 Inhalte, Musterlösungen)      Branchenkontext)                 Freitext-Lösungen
                            (2) gibt dazu formatives,
                                inhaltliches Feedback
                                – erfindet nichts,
                                VERGIBT KEINE NOTE
```

- **Der Dozenten-Master ist die einzige Quelle der fachlichen Wahrheit.** Die KI
  erzeugt keine neuen Lerninhalte „aus dem Nichts", sondern **transformiert**
  ausschließlich vorhandenes, vom Menschen freigegebenes Material.
- **Formatives Feedback statt Benotung:** Bei Fallaufgaben mit Freitext-Antwort
  gibt die KI ein **inhaltliches, unterstützendes Feedback** (Abgleich mit der
  Musterlösung, fehlende Aspekte, Hinweise) — als **Lernhilfe zur
  Selbstorientierung**. Sie vergibt **keine Note/keinen prüfungsrelevanten Score**
  und trifft **keine Entscheidung über die Person**.
- **Bewertung, Benotung, Prüfungsergebnis und Zugang bleiben zu 100 % beim
  Dozenten bzw. der IHK.**
- **Menschliche Aufsicht (Human-in-the-Loop):** der Master bleibt jederzeit die
  Referenz; das KI-Feedback ist unverbindlich und vom Lerner überstimmbar.

Diese Rollentrennung ist die tragende Säule der gesamten Risiko-Einordnung.

---

## 2. Technische Architektur der KI-Schicht (geplant)

**Framework:** n8n (self-hosted, EU/Deutschland – siehe DSGVO-Abschnitt) als
Orchestrierung für **spezialisierte Agenten**.

**Halluzinations-Vermeidung durch Einschränkung (Grounding & Scoping):** Jeder
Agent erhält

1. ein **fiktives Rollen-/Kompetenzprofil** („Personalakte" im Sinne einer
   Agenten-Spezifikation, z. B. *„Fachexperte Handlungsfeld 2 – Marketing-Mix"*)
   — **keine echten personenbezogenen Daten**, sondern eine reine
   Verhaltens-/Facheingrenzung;
2. **Skills / Spezifikationen** und den relevanten **Ausschnitt des
   Dozenten-Masters** als gebundenen Wissenskontext.

Dadurch arbeitet der Agent nur **innerhalb** eines eng definierten fachlichen
Rahmens (ein Handlungsfeld, ein Aufgabentyp). Das reduziert Halluzinationen
strukturell: Der Agent hat weder Anlass noch Spielraum, außerhalb des
freigegebenen Masters zu „erfinden".

> **Wichtig für die Einordnung:** Die „Personalakte" ist ein **Agenten-Rollenprofil
> zur Steuerung**, kein Datensatz über eine reale Person. Es werden hierfür
> **keine personenbezogenen Daten** verarbeitet.

---

## 3. Einordnung nach EU AI Act (VO (EU) 2024/1689)

### 3.1 Keine verbotene Praktik (Art. 5)
Titan nutzt keine der verbotenen Praktiken (kein Social Scoring, keine
manipulative/ausnutzende KI, keine biometrische Kategorisierung o. Ä.).

### 3.2 **Nicht Hochrisiko** — Begründung (Annex III Nr. 3 „Bildung")
Annex III stuft KI in der Bildung u. a. dann als hochrisiko ein, wenn sie
eingesetzt wird, um
- **den Zugang/die Zulassung** zu Bildungseinrichtungen zu bestimmen,
- **Lernergebnisse zu bewerten** (einschließlich Steuerung des Lernprozesses),
- das angemessene Bildungsniveau einer Person zu bestimmen,
- **unzulässiges Verhalten während Prüfungen** zu überwachen/erkennen.

**Einordnung für Titan:** Die KI **bestimmt keinen Zugang/kein Bildungsniveau** und
**überwacht keine Prüfungen**. Sie gibt bei Fallaufgaben **formatives, inhaltliches
Feedback** — aber **ohne Note/Score, ohne prüfungsrelevante Entscheidung und ohne
den offiziellen Lern-/Prüfungsweg festzulegen**. Bewertung, Benotung und Prüfung
verbleiben vollständig beim Menschen (Dozent/IHK). Ein reines **Selbstlern-Feedback**,
das der Lerner ignorieren kann und das keine offizielle Wirkung entfaltet,
„bewertet Lernergebnisse" nach unserer Einschätzung **nicht** im regulatorisch
gemeinten (ergebnis-/entscheidungswirksamen) Sinn.

→ **Design-Einordnung: Titan ist voraussichtlich kein Hochrisiko-KI-System.**
⚠️ **Dies ist der sensibelste Punkt der Einstufung** und **vor KI-Livegang
juristisch verbindlich zu bestätigen** — formatives Feedback liegt näher an der
Hochrisiko-Grenze als reine Aufgaben-Varianten. Abgesichert wird es durch die
Guardrails (Abschnitt 4) und die menschliche Aufsicht. Sobald die KI je
Noten/Scores mit **offizieller Wirkung** vergäbe, kippt die Einstufung in
Hochrisiko — das ist ausgeschlossen.

### 3.3 Anwendbare Pflicht: **Transparenz (Art. 50)**
Für KI, die Inhalte erzeugt, gelten **Transparenzpflichten**. Titan setzt sie um:
- **Kennzeichnung:** KI-generierte/-variierte Aufgabenstellungen werden für den
  Lerner **klar als KI-erzeugt ausgewiesen** (keine Vortäuschung menschlicher
  bzw. „amtlicher" Autorschaft).
- **Nachvollziehbarkeit (Provenienz):** Zu jeder Variante bleibt der zugrunde
  liegende **Dozenten-Master** referenzierbar.
- Werden Modell-Ausgaben maschinenlesbar markiert (soweit vom eingesetzten
  Modell/Anbieter unterstützt), wird dies genutzt.

### 3.4 GPAI / Rollen (Anbieter vs. Betreiber)
Wird ein Universalmodell (GPAI) eines Dritten eingesetzt, ist Titan dessen
**Betreiber („Deployer")** und zugleich Anbieter des daraus gebauten Features.
Die Anbieter-Pflichten beschränken sich im Niedrigrisiko-Fall im Kern auf
**Transparenz** (3.3). Die genaue Rollen-/Pflichtenabgrenzung ist mit dem
gewählten Modellanbieter und juristisch zu fixieren.

### 3.5 Geltungszeitlinie (Orientierung)
- In Kraft getreten: **1. Aug 2024**
- Verbotene Praktiken: seit **2. Feb 2025**
- GPAI-Pflichten: seit **2. Aug 2025**
- Hochrisiko-Pflichten (Annex III): überwiegend ab **2. Aug 2026**

Da Titan **nicht** hochrisiko ist, sind die einschlägigen Pflichten die
Transparenzpflichten – vor jedem KI-Livegang umzusetzen.

---

## 4. Datenschutz (DSGVO)

- **Keine personenbezogenen Daten in der KI-Schicht:** Agenten arbeiten mit
  **fiktiven Rollenprofilen** und dem fachlichen Master, nicht mit realen
  Lerner-/Dozentendaten. Damit ist der sensibelste DSGVO-Pfad von vornherein
  vermieden.
- **EU/Deutschland-Pflicht:** Alle datenverarbeitenden Dienste liegen in
  EU/Deutschland (stehende Projektvorgabe – siehe [deployment.md](./deployment.md)).
  n8n wird **self-hosted** betrieben; ein etwaiges LLM ist EU-gehostet bzw. über
  einen Anbieter mit EU-Verarbeitung und Auftragsverarbeitungsvertrag (AVV)
  anzubinden.
- **Datensparsamkeit:** Sollte künftig doch personenbezogener Kontext an die KI
  gelangen (heute ausdrücklich nicht vorgesehen), ist vorab Rechtsgrundlage, AVV,
  DPIA und EU-Hosting verbindlich zu klären.

---

## 5. Investoren-Kurzfassung (Risiko-Posture in 5 Punkten)

1. **Kein Hochrisiko-KI-System:** KI erzeugt nur Übungsvarianten, bewertet und
   entscheidet nie über Personen → außerhalb Annex III (Bildung).
2. **Mensch bleibt Autorität:** Dozenten-Master ist die Quelle; Human-in-the-Loop
   ist strukturell verankert, nicht nachträglich aufgesetzt.
3. **Halluzinationen strukturell eingegrenzt:** eng gescopte Agenten mit
   Rollenprofil + gebundenem Master statt „offener" Generierung.
4. **Datenschutz minimal-invasiv:** keine echten Personendaten in der KI;
   EU/DE-Hosting, n8n self-hosted.
5. **Transparenz erfüllt:** KI-Inhalte sind gekennzeichnet und auf den Master
   rückführbar.

→ Ergebnis: **maximale Funktionalität bei minimaler regulatorischer Angriffsfläche.**

---

## 6. Offene Punkte / To-do vor KI-Livegang

- [ ] Formale Einstufung + DPIA durch Fachjurist:in/DSB bestätigen lassen.
- [ ] Modell-/Anbieterwahl inkl. EU-Verarbeitung + AVV fixieren; Rolle
      Anbieter/Betreiber sauber abgrenzen.
- [ ] Kennzeichnungs-UX für KI-generierte Inhalte in der Lernoberfläche umsetzen.
- [ ] Human-in-the-Loop-Freigabe des Dozenten technisch abbilden.
- [ ] Protokollierung (welcher Master → welche Variante) für Nachvollziehbarkeit.

---

## 7. Unabhängigkeit & Disclaimer (in Footer/Impressum aufnehmen)

> **TITAN ist ein unabhängiges Lern- & Kompetenzsystem.** Alle Lehrinhalte,
> Fallbeispiele und Übungen wurden von Dozenten eigenständig entwickelt. TITAN
> steht in **keiner offiziellen Verbindung** zur Deutschen Industrie- und
> Handelskammer (DIHK) oder zu regionalen Industrie- und Handelskammern.

Dieser Hinweis gehört in die **Website-Fußzeile / das Impressum** und in
Außendarstellung/Verkaufsmaterial (schützt vor dem Eindruck einer offiziellen
IHK-Zusammenarbeit).

---

*Verweise: [produktvision.md](./produktvision.md) · [architektur.md](./architektur.md) ·
[roadmap.md](./roadmap.md) · [lastenheft.md](./lastenheft.md) (KI-Anforderungen).*

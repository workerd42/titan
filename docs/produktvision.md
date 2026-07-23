# TITAN — The Competence Engine

> Quelle: [Notion — Produktvision & Konzept](https://app.notion.com/p/39895f8eb37681a98d36f6779d88af35) (Stand: 2026-07-09)

> **Aktualisierung (2026-07-17):** Dieses Dokument beschreibt die **Vision**. Der real umgesetzte Stack weicht bewusst ab: **Better Auth + Drizzle + self-hosted Postgres** (Fundament **live**, Phase 2), **Directus** (statt Payload CMS) als geplantes Redaktionssystem, n8n self-hosted **EU/DE**. Das echte Login-Gate ist live (invite-only). Die KI gibt **formatives Feedback (keine Note)** — siehe [ki-governance.md](ki-governance.md). Maßgeblich für den Ist-Stand: [architektur.md](architektur.md), [roadmap.md](roadmap.md), [deployment.md](deployment.md).

> **"Vom trägen Auswendiglernen zum strategischen Handeln."**
> Ein universelles, kontextbasiertes Kompetenzsystem für IHK-Fachwirte.

## 1. Das Leitbild & das Core-Versprechen

TITAN ist kein trockenes Learning-Management-System (LMS), sondern ein **interaktives Arbeits- und Kompetenz-Cockpit**.

Lerner konsumieren nicht nur Wissen, sondern erarbeiten Schritt für Schritt ihren eigenen **digitalen Zwilling für den beruflichen Erfolg**:

- **Keine Bremsen:** Modernes Sci-Fi-/Minimal-Tech-Dashboard (Dark Mode, 60-FPS-Transitionen mit Astro & GSAP).
- **Inverted Learning:** Die Theorie dient rein als Vorbereitung, um **Artefakte** (SWOT, Nutzwertanalyse, Deckungsbeiträge) für das eigene **Star-Company** freizuschalten.
- **Dualer Nutzen:** Nach dem Meistern aller Galaxien steht nicht nur ein grünes Häkchen auf dem Bildschirm, sondern ein **fertiges, druckfähiges Präsentations-Deck für die mündliche IHK-Prüfung** bereit.

## 2. Die UI/UX-Architektur: Das Galaxien-System

``` 
                          UNIVERSUM (Fachwirt X)
                                    │
        ┌──────────────────┬───────┴────────┬──────────────────┐
        ▼                  ▼                ▼                  ▼
   [Galaxie HF 1]     [Galaxie HF 2]   [Galaxie HF 3]     [Galaxie HF 4]
   (Marketing-        (Marketing-      (Marketing-        (Kommunikation,
    strategien)        konzepte)        prozesse)          Führung & Org.)
        │                  │                │                  │
        ├─ Planet 1        ├─ Planet 1       ├─ Planet 1        ├─ Planet 1
        ├─ Planet 2        ├─ Planet 2       ├─ Planet 2        ├─ Planet 2
        └─ ...             └─ ...            └─ ...             └─ ...
```

### Navigations-Dynamics

> **Umgesetzt (Frontend-Rework 2026-07-14):** Die ursprüngliche Orbit-Drag-Idee wurde durch eine **Karussell-Navigation** ersetzt (siehe [architektur.md](architektur.md) §4). Das Folgende beschreibt den aktuellen Stand.

- **Universum & Galaxie (Seite 1+2):** horizontales 3D-Rotations-Karussell — ausgewähltes Element vorne-unten (groß), Nachbarn kleiner/blasser nach hinten, Caption mittig, endlose Rotation. Steuerung per Pfeilen/Tastatur/Swipe/Klick auf Nachbar; Navigation nur per CTA.
- **Planeten (Seite 3):** vertikales Karussell — ausgewählter Planet größer mittig, Nachbarn oben/unten weich auslaufend, Info-Panel rechts.
- **Suche:** Volltext-Command-Palette (Lupe oben rechts) über alle drei Ebenen inkl. Themen-Volltext.
- **Mobile:** Karussell bleibt auf Seite 1+2 aktiv (Swipe); Seite 3 nutzt eine statische, barrierefreie Themen-Liste.
- **Persistente Panels (Konzept / Mein Bereich):** rechts angedockt, jederzeit aufklappbar; die Star-Company bleibt zugänglich.

## 3. Die synthetisierte 4-Phasen-Kompetenzreise

Jeder Planet (Kapitel) folgt exakt derselben 4-Phasen-Methodik, verbindet jedoch Theorie, KI-Szenarien und die Artefakt-Generierung:

```
◉ Phase 1: VERSTEHEN  [#6E7EA0 - Blaugrau]
├── Wissensbibliothek mit Definitionen, Formeln & LaTeX-Rechenwegen.
└── Bietet den theoretischen Werkzeugkasten für das Kapitel.

◈ Phase 2: MERKEN     [#C4A882 - Warm Amber]
├── Der prägnante Prüfungsanker (Must-know-Kernaussage).
└── Baut das visuelle Gedächtnis für schwere IHK-Begriffe auf.

◆ Phase 3: ANWENDEN   [#5A8A6A - Grün]  <-- DIE CORE-ENGINE!
├── AI-Szenario-Generator (Anthropic Claude via n8n Middleware).
├── Generiert ein maßgeschneidertes Fallbeispiel für deine Star-Company.
└── Interaktiver Baukasten (Guided Writing): Du wendest das Werkzeug (z.B. SWOT) an.
    → RESULTAT: Generiert ein "Artefakt" (Folie) für dein Präsentations-Deck!

◎ Phase 4: PRÜFEN     [#8A7650 - Gold]
├── Echte IHK-Prüfungsfrage im Prüfungsmodus mit Selbsteinschätzung.
└── Exam-Countdown-Spaced-Repetition: Wiederholungsabstände passen sich
    dynamisch an dein eingetragenes IHK-Prüfungsdatum an.
```

## 4. Das Star-Company-System & Artefakt-Baukasten

Beim ersten Betreten des Universums konfiguriert der Nutzer die Star-Company.

### Der KI-Kontext-Puffer

Um "Grammatik-Glitches" einfacher Template-Substitutionen zu vermeiden, schickt TITAN die Unternehmensdaten bei der Erstellung einmalig durch Claude. Daraus entsteht ein **dekliniertes Kontext-JSON**, das clientseitig und in den Prompts nahtlos eingesetzt wird:

```json
{
  "company": "Musterfrau GmbH",
  "industry": "Maschinenbau",
  "size": "Mittelstand (150 MA)",
  "context_genitive": "der Musterfrau GmbH",
  "context_dative": "bei der Musterfrau GmbH",
  "primary_target": "B2B Industriekunden"
}
```

### Der Artefakt-Missions-Launch

Jedes Mal, wenn Phase 3 (Anwenden) auf einem Planeten erfolgreich abgeschlossen wird, wandert das erstellte Framework (z.B. SWOT-Analyse, Nutzenmatrix, Marketing-Mix) als **Baustein in den Präsentations-Kanal**.

Am Ende aller Handlungsfelder heißt es: **"Missions-Launch"**

- TITAN fügt alle gesammelten Artefakte zu einem durchgängigen **IHK-Präsentationsentwurf** zusammen.
- Inklusive KI-generiertem **Leitfaden für das anschließende Fachgespräch**.

## 5. Technisches Fundament & Skalierbarkeit

Die Trennung von **Engine (Software)** und **Content-Packs (IHK-Daten)** garantiert die weltweite und fachübergreifende Skalierbarkeit.

```
┌───────────────────────────────────────────────────────────────┐
│                    FRONTEND (Astro.js)                        │
│ - Ultra-schnell (Zero-JS-Standard), GSAP-Animationen, TS, CSS  │
└───────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                 AUTOMATION & MIDDLEWARE                        │
│ - n8n auf Docker (Ionos-Server): Anthropic Claude API-Prompts  │
└───────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│               HEADLESS BACKEND & DATENBANK                     │
│ - Payload CMS v3 (Node.js/TypeScript) + PostgreSQL DB          │
│ - Verwaltet Universen, Galaxien, Planeten, Schemas, Artefakte  │
└───────────────────────────────────────────────────────────────┘
```

### Warum diese Kombination gewinnt

1. **Einmal entwickeln, N-mal ausrollen:** Ein neues Universum (z.B. Wirtschaftsfachwirt) wird nur im Content/Redaktionssystem (geplant: **Directus**) angelegt — UI-, Animation- und KI-Logik bleiben unberührt.
2. **PostgreSQL für Skalierung:** Erfasst riesige Datenmengen an User-Eingaben, Spaced-Repetition-Logs und generierten Artefakten.
3. **Low-Latency KI-Workflows:** n8n puffert Prompts ab, damit Claude-Anfragen das Frontend nicht blockieren.

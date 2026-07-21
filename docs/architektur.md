# TITAN — Technische Architektur

> Quelle: [Notion — Technische Architektur](https://app.notion.com/p/39895f8eb37681338704fe176b436a13) (Stand: 2026-07-09)

## 1. High-Level System- & Hybrid-Architektur

Das System nutzt einen **Local-First & Offline-Capable Hybrid-Ansatz**:

1. **Frontend (GitHub Pages / Ionos Edge):** Statisch gerendertes, blitzschnelles Astro-Bundle. Speichert Fortschritt und Kompass-Daten primär im `localStorage` für 0ms Latenz.
2. **Backend Engine (Ionos Docker Server):** Verarbeitet komplexe KI-Evaluierungen (Phase 3), steuert n8n-Workflows und synchronisiert den Datenstand persistiert in PostgreSQL.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ CLIENT / BROWSER (Local-First Architecture)                                   │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ ASTRO FRONTEND LAYER                                                     │ │
│  │ - Static Pages / ClientRouter (View Transitions)                         │ │
│  │ - GSAP 3.15 Karussell-Engine (Index-basiert, ring/linear, 3D-perspective)│ │
│  │ - Norive Design Tokens & Custom CSS (Obsidian Dark / Warm Linen Light)   │ │
│  └───────────────────────┬──────────────────────────┬───────────────────────┘ │
│                          │                          │                        │
│                          ▼                          ▼                        │
│  ┌───────────────────────────────┐     ┌─────────────────────────────────┐    │
│  │ LOCAL STORAGE PERSISTENCE     │     │ N8N/KI-BRIDGE (HTTP/Webhooks)   │    │
│  │ - 'norive-progress-v2'        │     │ - Trigger KI-Bewertung (Phase 3)│    │
│  │ - 'norive-kompass-v1'         │     │ - Generiert Präsentations-      │    │
│  │ - 'titan-first-visit'         │     │   Artefakte                     │    │
│  └───────────────────────────────┘     └────────────────┬─────────────────┘    │
└──────────────────────────────────────────────────────────┼───────────────────┘
                                                            │
                                                  HTTPS / REST Webhook
                                                            │
┌───────────────────────────────────────────────────────────┼───────────────────┐
│ IONOS SERVER (Ubuntu Host + Docker Environment)            │                  │
│                                                             │                  │
│  ┌──────────────────────────────────────────────────────────▼───────────────┐ │
│  │ NGINX REVERSE PROXY & SSL (Subdomain Routing & Rate Limiting)            │ │
│  └────────┬──────────────────────────────────┬───────────────────────────────┘ │
│           │ (api.titan.de)                   │ (n8n.titan.de)                 │
│           ▼                                  ▼                                │
│  ┌────────────────────────┐        ┌────────────────────────┐                 │
│  │ PAYLOAD CMS v3         │        │ n8n AUTOMATION ENGINE  │                 │
│  │ - Headless Content API │        │ - AI Prompt Orchestration│                │
│  │ - Users & Sync Engine  │        │ - SSE / Event Pipeline  │                │
│  └────────┬────────────────┘        └────────┬─────────────┘                 │
│           └──────────────────┬────────────────┘                              │
│                              ▼                                               │
│                     ┌───────────────┐                                        │
│                     │ POSTGRESQL DB │                                        │
│                     └───────────────┘                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                             HTTPS REST API
                                    │
                                    ▼
                       [ ANTHROPIC CLAUDE API ]
```

> **Hinweis (aktualisiert 2026-07-17 — Ist-Stand):** Die folgende Notion-Planung nennt Payload CMS/n8n als Backend. **Real umgesetzt und LIVE ist inzwischen das Phase-2-Fundament:** **Astro-Hybrid (`@astrojs/node`) + Better Auth + Drizzle + self-hosted PostgreSQL**, als **Node+Postgres** containerisiert auf `prototyp-staging.norive.de` (kein nginx-static mehr im Container; Host-nginx nur Reverse-Proxy/TLS). Ein **serverseitiges Login-Gate (invite-only)** + **Admin-Panel/Rollen** sind live. **Payload ist verworfen** — Redaktionssystem wird **Directus** (geplant); n8n/KI-Schicht ist Phase 3 (KI: **formatives Feedback, keine Note** — [ki-governance.md](ki-governance.md)). Maßgeblich: [roadmap.md](roadmap.md), [deployment.md](deployment.md).

## 2. Der integrierte Tech-Stack

| Schicht | Technologie | Verwendung & Funktion |
|---|---|---|
| Frontend Framework | Astro 5.x/7.x | SSG/SSR Hybrid, Content Collections für 51 Themen-Slugs, Zod-Validierung |
| Sprache | TypeScript 5.x | Ende-zu-Ende Typsicherheit (Frontend State, Payload Schemas, Data Tokens) |
| Styling | Vanilla CSS + Tokens | Norive Design Tokens (Light/Dark Switch), `tokens.css`, `space.css`, `planet.css` |
| Animation Engine | GSAP 3.15.0 | Karussell-Engine (`gsap-carousel.ts`, ring/linear, echte CSS-3D-perspective; GSAP nur zum Tweenen) |
| Typografie | @fontsource | Cormorant Garamond (Eleganz/Überschriften) + DM Mono (Tech/Prüfungsanker) |
| Client Persistence | localStorage | Local-First Speicherung für Fortschritt (`norive-progress-v2`) & Firmenprofil |
| Backend & CMS | Payload CMS v3 (geplant) | Headless CMS (Node.js/TypeScript) auf Docker zur Verwaltung aller Fachwirte |
| Automation & AI | n8n Engine (geplant) | Docker-basierte Workflow-Engine; orchestriert Prompts zwischen Client & Claude API |
| Datenbank | PostgreSQL 16 (geplant) | Relationale Datenbank für Nutzerkonten, Sync-Daten, Prompt-Logs & Artefakte |
| Infrastructure | Ionos Ubuntu Server | Docker Compose Setup geschützt durch Nginx Reverse Proxy |

## 3. Datenarchitektur & State-Management

### A. LocalStorage Schema (Client-Side State)

```typescript
// 1. Fortschritts-Tracking ('norive-progress-v2')
interface NoriveProgressV2 {
  themen: {
    [slug: string]: {
      verstehen: boolean; // Phase 1
      merken: boolean;    // Phase 2
      anwenden: boolean;  // Phase 3 (Eingabe gemacht & Artefakt freigeschaltet)
      pruefen: boolean;   // Phase 4
      letzteWiederholung?: string; // ISO-Date für Spaced Repetition
      userSolutionPhase3?: string; // Gespeicherter Textarea-Inhalt
    };
  };
  lernStreakTage: number;
}

// 2. Das Kompass-Unternehmen ('norive-kompass-v1')
interface KompassUnternehmen {
  name: string;
  branche: 'handel' | 'industrie' | 'dienstleistung' | 'handwerk' | 'sonstiges';
  rechtsform: string;
  groesse: 'mikro' | 'klein' | 'mittel' | 'gross';
  ausbildungsberufe: string;
  zielgruppen: string;
  besonderheiten: string;
  erstellt: string; // ISO-Date
}
```

### B. Payload CMS v3 Schemas (geplante Server-Side Architecture)

```typescript
// Planeten Collection (Beispiel für Phasenzuweisung)
import { CollectionConfig } from 'payload';

export const Planeten: CollectionConfig = {
  slug: 'planeten',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'galaxy', type: 'relationship', relationTo: 'galaxien', required: true },

    // Phase 1: Verstehen (#6E7EA0)
    {
      name: 'phase1_verstehen',
      type: 'group',
      fields: [
        { name: 'contentMarkdown', type: 'textarea' },
        { name: 'formulas', type: 'array', fields: [{ name: 'latex', type: 'text' }] }
      ]
    },
    // Phase 2: Merken (#C4A882)
    {
      name: 'phase2_merken',
      type: 'group',
      fields: [{ name: 'anchorSentence', type: 'textarea', required: true }]
    },
    // Phase 3: Anwenden (#5A8A6A)
    {
      name: 'phase3_anwenden',
      type: 'group',
      fields: [
        { name: 'toolType', type: 'select', options: ['swot', 'pestel', 'matrix', 'text_guided'] },
        { name: 'promptTemplate', type: 'textarea' }
      ]
    },
    // Phase 4: Prüfen (#8A7650)
    {
      name: 'phase4_pruefen',
      type: 'group',
      fields: [
        { name: 'ihkQuestionText', type: 'textarea', required: true },
        { name: 'sampleSolution', type: 'textarea', required: true }
      ]
    }
  ]
};
```

## 4. Die Karussell-Engine (Engine-Core)

> **Frontend-Rework 2026-07-14:** Das ursprüngliche Drag-Orbit-System (`gsap-orbits.ts` + `gsap-focus.ts` + `Universe.astro` + `FocusPanel.astro`) wurde vollständig durch eine **Karussell-Navigation** ersetzt und aus dem Code gelöscht. Grund: das freie Ziehen auf elliptischen Bahnen skalierte konzeptionell schlecht und die neue Coverflow-Optik ist klarer. Der folgende Abschnitt beschreibt den aktuellen Stand.

Das UI-Herzstück ist `src/scripts/gsap-carousel.ts` — ein **Index-basiertes Karussell** (keine Winkel-/Ellipsen-Mathematik mehr, keine `gsap.Draggable`-Abhängigkeit; GSAP nur zum Tweenen). Zwei Modi:

- **`ring` (Seite 1 Universum + Seite 2 Galaxie):** horizontales 3D-Rotations-Karussell. Items sitzen via echter CSS-`perspective` + `translate3d` auf einer Ellipse und rotieren **endlos** um einen festen Mittelpunkt (dort sitzt die Caption). Das ausgewählte Item steht vorne-unten (groß, opak, unten angeschnitten), die Nachbarn weichen kleiner/blasser nach hinten. `goTo()` wählt stets den kürzeren Rotationsweg.
- **`linear` (Seite 3 Planeten):** vertikales Karussell — ausgewähltes Item größer in der Mitte, Nachbarn laufen oben/unten via CSS-Maske weich aus, Info-Panel rechts.

**Modell B+ (kein separater Zoom-Schritt mehr):** Sobald ein Item zentriert ist, blendet `src/scripts/carousel-caption.ts` sofort die Caption (Eyebrow/Titel/Beschreibung/CTA) ein. Navigation passiert **ausschließlich** über den CTA-Button, nie durch Antippen des Elements. Steuerung: Pfeil-Buttons, Tastatur (←/→ bzw. ↑/↓), Klick auf ein Nachbar-Item (zentriert es), Swipe (ein Schritt) — **kein freies Ziehen**.

```typescript
// gsap-carousel.ts — Kern-API
export function initCarousel(opts: {
  container: HTMLElement; items: HTMLElement[];
  orientation: 'horizontal' | 'vertical';
  mode?: 'linear' | 'ring';
  showHint?: boolean;                        // einmaliger Bedienhinweis (Erstbesuch)
  onCenterChange: (index: number, el: HTMLElement) => void;
}): CarouselController;                        // { goTo, next, prev, getCenterIndex, destroy }
```

**Zusätzliche Frontend-Bausteine (2026-07-14):** Positions-Indikatoren (`wireDots`/`updateDots` bzw. „X / N"-Zähler), einmaliger Erstbesuch-Bedienhinweis, Coming-Soon-Badges (`UniversumGlobe`), Info-Button (`InfoButton.astro`, Version/Build unten links) und eine **Volltextsuche** (`SearchOverlay.astro` — Lupe oben rechts, zentrierte Command-Palette über alle drei Hierarchieebenen inkl. Themen-Volltext; Index als lazy geladene `/search-index.json` via `src/pages/search-index.json.ts`, nicht pro Seite inline).

## 5. End-to-End Datenfluss (Die 4-Phasen-Pipeline)

```
[Nutzer betritt Planet]
         │
         ├──► Phase 1 (Verstehen) ──► Astro liest Content / Rendert Markdown (#6E7EA0)
         │
         ├──► Phase 2 (Merken)    ──► Holt Merksatz aus Content Collection (#C4A882)
         │
         ├──► Phase 3 (Anwenden)  ──► User befüllt Textarea mit Kompass-Kontext (#5A8A6A)
         │                                 │
         │                                 ▼
         │                        [n8n Webhook Call] ──► Anthropic API (Claude)
         │                                 │
         │                                 ▼
         │                        Generiert Folien-Artefakt (JSON)
         │                        & speichert in localStorage + Postgres
         │
         └──► Phase 4 (Prüfen)    ──► Echte IHK-Frage + Countdown-Spaced-Repetition (#8A7650)
```

## 6. Der Artefakt- & Präsentations-Generator (Missions-Launch)

Sobald der Nutzer Themen absolviert hat, greift der Präsentations-Generator:

1. Liefert alle Themen aus `norive-progress-v2` mit Status `anwenden: true`.
2. Verknüpft die KI-generierten Artefakte aus Phase 3.
3. Rendert ein IHK-konformes Folien-Deck im Astro-View, exportierbar als PDF/Druckversion oder zum Üben für das mündliche Fachgespräch.

## 6a. Auth & Persistenz (Phase-2-Fundament, umgesetzt 2026-07-15)

Ergänzt das bisher rein lokale (localStorage-)System um Accounts und serverseitige Persistenz — **ohne** den Local-First-Charakter aufzugeben.

**Rendering:** Astro-Hybrid. `output: 'static'` + `@astrojs/node`-Adapter (standalone). Alle Lern-/Karussell-Seiten bleiben **prerendered** (2–12 ms Auslieferung, kein Session-Overhead); nur `/konto` und `/api/*` sind on-demand (`export const prerender = false`).

**Stack:** Better Auth (Email/Passwort, Sessions, Passwort-Hashing) · Drizzle ORM · Postgres 16 — alles self-hosted im eigenen Docker-Stack, keine externen Dienste/Kosten.

| Datei | Rolle |
|---|---|
| `src/lib/auth.ts` | Better-Auth-Server-Config (Drizzle-Adapter, 30-Tage-Sessions) |
| `src/lib/auth-client.ts` | Browser-Client (same-origin) |
| `src/lib/db/schema.ts` · `src/lib/db/index.ts` | Drizzle-Schema · Pool/Client (`astro:env/server`) |
| `src/lib/progress-merge.ts` | **Union-Merge** (reine Funktionen, server- und clientseitig nutzbar) |
| `src/pages/api/auth/[...all].ts` | Better-Auth-Handler |
| `src/pages/api/progress.ts` | GET/PUT Fortschritt+Kompass, session-geschützt (401 ohne Login) |
| `src/middleware.ts` | Session → `Astro.locals.user/session`; `isPrerendered`-Guard + dynamischer Import (kein DB-Zugriff beim Bauen) |
| `src/scripts/norive-sync.ts` | Local-First-Brücke (no-op ohne Login) |
| `src/pages/konto.astro` | Login/Registrierung |

**Datenmodell:** Better-Auth-Tabellen (`user`, `session`, `account`, `verification`) + `user_progress` und `kompass_profile` (je ein JSONB-Blob pro Nutzer, 1:1-Spiegel der localStorage-Keys). Normalisierung erst, wenn das Dozenten-Cockpit aggregierte Queries braucht.

**Sync-Prinzip (Local-First bleibt):**
1. **Ohne Login:** unverändert nur localStorage — anonymes Lernen, 0 ms, offline.
2. **Beim Login:** lokaler Stand wird an `/api/progress` gepusht, der Server merged **autoritativ** und gibt das Ergebnis zurück (→ localStorage).
3. **Union-Regel:** Eine Phase gilt als erledigt, wenn sie lokal **oder** serverseitig erledigt ist; Streak = max; späteres Lerndatum gewinnt. **Kein „last write wins"** — ein Gerät mit leerem Stand kann keinen Fortschritt löschen (verifiziert).

**Event-Semantik (wichtig beim Erweitern):** `norive:kompass-updated` = *der Nutzer* hat den Kompass bearbeitet (öffnet „Mein Bereich"). `norive:synced` = Daten kamen vom Server (nur neu rendern, Panel **nicht** aufklappen). Diese Trennung verhindert, dass das Panel bei jedem Login aufspringt — und eine Push-Schleife.

**Sicherheit:** Passwort-Hashing/Sessions/CSRF ausschließlich über Better Auth (nichts selbst gebaut); Cookies `httpOnly` + `SameSite=Lax`; Sessions serverseitig geprüft; Postgres ohne Host-Port (nur Docker-Netz); Secrets nur zur Laufzeit aus der Env (`astro:env/server`), nie im Bundle.

## 7. Docker-Deployment (ursprüngliche Notion-Planung — teilweise überholt)

> **Aktualisierung 2026-07-14:** Für das **Phase-2-Fundament** wurde die Architektur bewusst schlanker gewählt als diese ursprüngliche Payload/n8n-Planung: **Astro-Hybrid (`@astrojs/node`-Adapter) + Better Auth + Drizzle + self-hosted Postgres**, alles in einem Codebase/Docker-Stack, keine externen Kosten. Payload CMS + n8n bleiben optional für später (Phase 3 KI-Artefakte). Der aktuelle `docker-compose.yml` im Repo-Root containerisiert derzeit noch das rein statische Frontend (nginx); mit Phase 2 wird daraus „Node + Postgres". Details siehe [deployment.md](deployment.md) und der Phase-2-Plan. Das folgende YAML ist die **historische Notion-Vision**, nicht der Ist-Zustand.

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: titan_postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: titan_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - titan_net

  payload:
    build: ./backend
    container_name: titan_payload
    restart: always
    environment:
      DATABASE_URI: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/titan_db
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
    depends_on:
      - postgres
    networks:
      - titan_net

  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: titan_n8n
    restart: always
    environment:
      - N8N_HOST=n8n.titan.de
      - N8N_PORT=5678
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=titan_db
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
    networks:
      - titan_net

networks:
  titan_net:
    driver: bridge

volumes:
  postgres_data:
  n8n_data:
```

## Komponenten-Architektur (Stand nach Frontend-Rework 2026-07-14)

Die Karussell-Komponenten sind die kanonischen Bausteine der drei Auswahl-Ebenen:

| Komponente | Rolle |
|---|---|
| `CarouselStage.astro` | Horizontale Bühne (Seite 1+2): `.carousel-track` mit `perspective`, Pfeil-Buttons, Positions-Punkte, Caption-Slot. Props: `stageId`, `universumId`, `itemCount`. Ersetzt das gelöschte `Universe.astro`. |
| `CarouselStageVertical.astro` | Vertikale Bühne (Seite 3): vertikaler Track mit Rand-Fade-Maske, „X / N"-Zähler, Caption rechts. |
| `UniversumGlobe.astro` | Universum-Sphäre (Seite 1) — Karussell-Item mit SVG-Kugel; Coming-Soon-Badge für Platzhalter. |
| `GalaxieGlobe.astro` | HF-Sphäre (Seite 2) — Karussell-Item. |
| `Planet.astro` | Themen-Planet (Seite 3) inkl. 4 Phasen-Dots. |
| `CarouselCaption.astro` | Zentrierte Caption für Seite 1+2 (Modell B+). Ersetzt das gelöschte `FocusPanel.astro`. |
| `CarouselCaptionSide.astro` | Rechts platzierte Caption für Seite 3. |
| `gsap-carousel.ts` | Karussell-Engine (`initCarousel`, `wireDots`/`updateDots`). Ersetzt `gsap-orbits.ts`. |
| `carousel-caption.ts` | Caption-Sync (Crossfade bei Center-Wechsel). Ersetzt `gsap-focus.ts`. |
| `SearchOverlay.astro` · `InfoButton.astro` | Volltextsuche (Command-Palette) · Build-Info-Button. |

**Gelöscht im Rework:** `gsap-orbits.ts`, `gsap-focus.ts`, `FocusPanel.astro`, `Universe.astro`, `universe.ts`, die toten Funktionen aus `gsap-universe.ts` sowie ein toter CSS-Block in `space.css`. Das 3-State-Zoom-Modell (STATE 1/2/3) existiert nicht mehr.

**Telemetrie-Kontrakt (Dozenten-Dashboard, Phase 2 — unverändert gültig):**
- `data-universum-id` — auf Stage (titan-system / hb1–hb4) und jedem Objekt
- `data-hb-slugs` — kommagetrennte Themen-Slugs pro HF-Kugel
- `data-progress-hb` — HF-Fortschritt in %, client-seitig aus localStorage berechnet (zählt nur die Slugs des jeweiligen HF)

## Hierarchie-Erweiterung v3 (m3.0 — Universum-Ebene)

Neue oberste Hierarchieebene ergänzt: **Universum → Galaxie (HF) → Planet (Thema) → Lernseite**. Zuvor begann die Struktur direkt bei den Galaxien; jetzt gibt es eine skalierbare Universum-Auswahl davor.

### Neues Routing

| Route | Inhalt | Vorher |
|---|---|---|
| `/` | Universum-Auswahl (neu) — aktuell 1 Universum "Fachwirt Marketing" | war Galaxie-Auswahl |
| `/fachwirt-marketing/` | Galaxie-Auswahl (HF1–4) | war `/` |
| `/fachwirt-marketing/hb1/` | Planeten-Auswahl (Themen) | war `/hb1/` |
| `/fachwirt-marketing/hb1/thema-slug/` | Lernseite | war `/hb1/thema-slug/` |

Alle drei Auswahl-Ebenen (Universum, Galaxie, Planet) nutzen dieselbe Karussell-Engine (`ring` horizontal für 1+2, `linear` vertikal für 3) — konsistent, skaliert automatisch sobald weitere Universen in `data/universen.ts` ergänzt werden (Platzhalter via `comingSoon`-Flag).

### Nebenbei behobener Bug

`Handlungsbereich.universumName` (interne Kennung wie `"hf1"`) wurde versehentlich als sichtbarer Breadcrumb-Linktext auf der Lernseite angezeigt. Feld umbenannt zu `universumId`, Breadcrumb zeigt jetzt `{bereich.titel}`. Ebenso wurde ein Link in "Mein Bereich" (PersoenlichPanel) gefunden, der noch auf die alte Route ohne Universum-Präfix zeigte — korrigiert.

# TITAN — Technische Architektur

> Repo ist primäres Arbeitsmedium; Notion spiegelt (Doku-Parität). **Stand 2026-08-28 (IST, validiert gegen den Code).** Diese Fassung ist auf den real umgesetzten Stand gemergt — die frühere **Payload-CMS/n8n-Planung** und das **Orbit-Drag-Navigationssystem** wurden entfernt (nicht mehr Teil der Architektur).

## 1. Überblick (IST)

Titan ist eine **Astro-Hybrid-App** (`output: 'static'` + `@astrojs/node`-Adapter, `mode: 'standalone'`, `trailingSlash: 'ignore'`): Lern-/Karussell-Seiten sind **prerendered** (2–12 ms, offline-fähig, kein Session-Overhead), Auth-/API-/gegatete Seiten laufen **on-demand** (`prerender = false`). **Local-First:** Nutzerzustand primär im `localStorage`, serverseitig durabel gesynct. Betrieb **EU/Deutschland** (self-hosted, Docker) auf `prototyp-staging.norive.de`; ein **serverseitiges Login-Gate (invite-only)** + **Admin-Panel/Rollen** sind live.

## 2. Tech-Stack (real umgesetzt & live)

| Schicht | Technologie | Verwendung & Funktion |
|---|---|---|
| Frontend | Astro (Hybrid, 5.x/7.x) + TypeScript 5.x | SSG/SSR-Hybrid, Content Collections für **46 Themen**, Zod-Validierung, Ende-zu-Ende-Typsicherheit |
| Styling | Vanilla CSS + **Norive Design Tokens** | Light/Dark (Obsidian Dark / Warm Linen), `tokens.css`/`space.css`/`planet.css` — **kein Tailwind** |
| Animation | GSAP 3.15 | Karussell-Engine (`gsap-carousel.ts`, ring/linear, echte CSS-3D-`perspective`; GSAP nur zum Tweenen) |
| Typografie | Cormorant Garamond (Serif) + DM Mono | Eleganz/Überschriften · Tech/Prüfungsanker |
| Auth | **Better Auth** | E-Mail/Passwort, Sessions, Passwort-Hashing, CSRF |
| ORM / DB | **Drizzle ORM** + self-hosted **PostgreSQL 16** | Konten, Sync-Daten, Prompt-Logs & Artefakte |
| Client-Persistenz | localStorage | Local-First (`norive-progress-v2`, `norive-kompass-v1`) |
| Redaktionssystem | **Directus** (geplant, EU-gehostet) | Build-time-Pull + geteiltes Zod-Schema — **Payload verworfen** |
| KI (Phase 3) | Anthropic Claude (Sonnet 5) | formatives **Feedback ohne Note**; n8n optional für Agenten/Varianz |
| Infrastruktur | VPS (Ubuntu) + Docker | **Node + Postgres**; Host-nginx nur Reverse-Proxy/TLS |

## 3. Rendering & Local-First

- Lernseiten **prerendered**; nur `/konto` + `/api/*` + gegatete Seiten on-demand.
- **Middleware** (`src/middleware.ts`): Session-Kontext → `Astro.locals.user/session`; **Login-Gate (invite-only)**; `isPrerendered`-Guard + **dynamischer** Auth-Import (kein DB-Zugriff beim Bauen).
- **Sync (Union-Merge):** Beim Login wird der lokale Stand an `/api/progress` gepusht; der Server merged **autoritativ** — eine Phase gilt als erledigt, wenn sie lokal **oder** serverseitig erledigt ist; Streak = max; späteres Lerndatum gewinnt. **Kein „last write wins"** — ein Gerät mit leerem Stand kann keinen Fortschritt löschen (verifiziert).

## 4. Datenarchitektur & State

### A. LocalStorage-Schema (Client-Side State)

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

// 2. Die Star-Company ('norive-kompass-v1' — interner Key, Wording „Star-Company")
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

### B. Server-Datenmodell

Better-Auth-Tabellen (`user`, `session`, `account`, `verification`) + `user_progress` und `kompass_profile` (je ein **JSONB-Blob** pro Nutzer, 1:1-Spiegel der localStorage-Keys). Normalisierung erst, wenn das Dozenten-Cockpit aggregierte Queries braucht.

### C. Content (Themen) — dualer Loader, ein Schema

46 Themen als **Content Collections** mit **zwei Loadern und geteiltem Zod-Schema** (`src/content.config.ts`): `themen` (Markdown-`glob` unter `src/content/themen`) und `themenCms` (aus **Directus** gezogen) — **eine Schema-Quelle, kein Drift**. Multi-Fachwirt über `fachwirt`-Feld → Einordnung „Marketing – HB1".

## 5. Die Karussell-Engine (Engine-Core)

> **Frontend-Rework 2026-07-14:** Das ursprüngliche Drag-Orbit-System (`gsap-orbits.ts` + `gsap-focus.ts` + `Universe.astro` + `FocusPanel.astro`) wurde vollständig durch eine **Karussell-Navigation** ersetzt und aus dem Code gelöscht (verifiziert: Dateien nicht mehr vorhanden). Grund: freies Ziehen auf elliptischen Bahnen skalierte schlecht, die Coverflow-Optik ist klarer.

Das UI-Herzstück ist `src/scripts/gsap-carousel.ts` — ein **Index-basiertes Karussell** (keine Winkel-/Ellipsen-Mathematik, keine `gsap.Draggable`-Abhängigkeit; GSAP nur zum Tweenen). Zwei Modi:

- **`ring` (Seite 1 Universum + Seite 2 Galaxie):** horizontales 3D-Rotations-Karussell. Items sitzen via echter CSS-`perspective` + `translate3d` auf einer Ellipse und rotieren **endlos** um einen festen Mittelpunkt (dort die Caption). Ausgewähltes Item vorne-unten (groß, opak), Nachbarn kleiner/blasser nach hinten. `goTo()` wählt den kürzeren Rotationsweg.
- **`linear` (Seite 3 Planeten):** vertikales Karussell — ausgewähltes Item größer in der Mitte, Nachbarn oben/unten via CSS-Maske weich auslaufend, Info-Panel rechts.

**Modell B+ (kein separater Zoom-Schritt):** Sobald ein Item zentriert ist, blendet `src/scripts/carousel-caption.ts` sofort die Caption (Eyebrow/Titel/Beschreibung/CTA) ein. Navigation **ausschließlich** über den CTA-Button, nie durch Antippen des Elements. Steuerung: Pfeil-Buttons, Tastatur (←/→ bzw. ↑/↓), Klick auf Nachbar-Item (zentriert es), Swipe (ein Schritt) — **kein freies Ziehen**.

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

**Zusätzliche Frontend-Bausteine (2026-07-14):** Positions-Indikatoren (`wireDots`/`updateDots` bzw. „X / N"-Zähler), einmaliger Erstbesuch-Bedienhinweis, Coming-Soon-Badges (`UniversumGlobe`), Info-Button (`InfoButton.astro`) und eine **Volltextsuche** (`SearchOverlay.astro` — Command-Palette über alle drei Ebenen; Index als lazy geladene `/search-index.json` via `src/pages/search-index.json.ts`).

## 6. Lernbereich (Modi)

Pro Thema **getrennte, fokussierte Ansichten** (`data-modus`):

- **Entdecken** — die 4-Phasen-Reise: Verstehen · Merken · Anwenden · Prüfen
- **Lernzettel** — Karteikarten (Begriffe/Definitionen, Flip)
- **Übungsbereich** — Multiple-Choice mit Sofort-Feedback
- **IHK-Test-Format** — Situationsaufgabe + Teilaufgaben (Operator/Punkte) + Musterlösung-Selbstcheck
- **Interaktive Werkzeuge** — **10 Stück** (validiert im `werkzeug`-Enum): `swot`, `smart`, `deckungsbeitrag`, `marktanteil`, `preisberechnung`, `vier-stufen`, `scoring`, `portfolio` (BCG), `breakeven`, `statistik` — als Mini-Kurs (Konzept + Beispiel → selbst anwenden). Die **Star-Company** (`{{firma}}`) schlägt in alle Fallaufgaben durch.

## 7. Auth & Persistenz (Phase-2-Fundament, live seit 2026-07-15)

Ergänzt das bisher rein lokale (localStorage-)System um Accounts und serverseitige Persistenz — **ohne** den Local-First-Charakter aufzugeben.

**Stack:** Better Auth (E-Mail/Passwort, Sessions, Passwort-Hashing) · Drizzle ORM · Postgres 16 — alles self-hosted im eigenen Docker-Stack, keine externen Dienste/Kosten.

| Datei | Rolle |
|---|---|
| `src/lib/auth.ts` | Better-Auth-Server-Config (Drizzle-Adapter, 30-Tage-Sessions) |
| `src/lib/auth-client.ts` | Browser-Client (same-origin) |
| `src/lib/db/schema.ts` · `src/lib/db/index.ts` | Drizzle-Schema · Pool/Client (`astro:env/server`) |
| `src/lib/progress-merge.ts` | **Union-Merge** (reine Funktionen, server- und clientseitig nutzbar) |
| `src/pages/api/auth/[...all].ts` | Better-Auth-Handler |
| `src/pages/api/progress.ts` | GET/PUT Fortschritt+Star-Company, session-geschützt (401 ohne Login) |
| `src/middleware.ts` | Session → `Astro.locals.user/session`; `isPrerendered`-Guard + dynamischer Import |
| `src/scripts/norive-sync.ts` | Local-First-Brücke (no-op ohne Login) |
| `src/pages/konto.astro` | Login/Registrierung |

**Event-Semantik (wichtig beim Erweitern):** `norive:kompass-updated` = *der Nutzer* hat die Star-Company bearbeitet (öffnet „Mein Bereich"). `norive:synced` = Daten kamen vom Server (nur neu rendern, Panel **nicht** aufklappen). Verhindert, dass das Panel bei jedem Login aufspringt — und eine Push-Schleife.

**Sicherheit:** Passwort-Hashing/Sessions/CSRF ausschließlich über Better Auth (nichts selbst gebaut); Cookies `httpOnly` + `SameSite=Lax`; Sessions serverseitig geprüft; Postgres ohne Host-Port (nur Docker-Netz); Secrets nur zur Laufzeit aus der Env (`astro:env/server`), nie im Bundle.

## 8. End-to-End-Datenfluss (Die 4-Phasen-Pipeline)

```
[Nutzer betritt Planet]
         │
         ├──► Phase 1 (Verstehen) ──► Astro liest Content / Rendert Markdown (#6E7EA0)
         │
         ├──► Phase 2 (Merken)    ──► Holt Merksatz aus Content Collection (#C4A882)
         │
         ├──► Phase 3 (Anwenden)  ──► User befüllt Werkzeug/Textarea mit Star-Company-Kontext (#5A8A6A)
         │                                 │
         │                                 ▼
         │                        Artefakt (JSON) → localStorage + Postgres
         │                        (KI-Veredelung/Feedback = Phase 3, geplant, via Claude)
         │
         └──► Phase 4 (Prüfen)    ──► Echte IHK-Frage + Countdown-Spaced-Repetition (#8A7650)
```

## 9. Der Artefakt- & Präsentations-Generator (Missions-Launch)

1. Liefert alle Themen aus `norive-progress-v2` mit Status `anwenden: true`.
2. Verknüpft die erzeugten Artefakte aus Phase 3.
3. Rendert ein IHK-konformes Folien-Deck (`src/pages/deck.astro`), exportierbar als PDF/Druckversion oder zum Üben für das mündliche Fachgespräch.

## 10. Deployment (IST)

Container = **Node + Postgres** (kein nginx-static mehr). **Runtime-Migration** via `scripts/migrate.mjs` (idempotent beim Start, **kein drizzle-kit zur Laufzeit**); `drizzle-kit` nur in **Dev-Scripts** (`db:generate` / `db:migrate` / `db:push`). Postgres **ohne Host-Port** (nur Docker-Netz). **Directus** als **separater** Stack (`docker-compose.directus.yml`). Details: [deployment.md](deployment.md).

## 11. Komponenten-Architektur (Stand nach Frontend-Rework 2026-07-14)

| Komponente | Rolle |
|---|---|
| `CarouselStage.astro` | Horizontale Bühne (Seite 1+2): `.carousel-track` mit `perspective`, Pfeil-Buttons, Positions-Punkte, Caption-Slot. Ersetzt das gelöschte `Universe.astro`. |
| `CarouselStageVertical.astro` | Vertikale Bühne (Seite 3): vertikaler Track mit Rand-Fade-Maske, „X / N"-Zähler, Caption rechts. |
| `UniversumGlobe.astro` | Universum-Sphäre (Seite 1) — Karussell-Item mit SVG-Kugel; Coming-Soon-Badge für Platzhalter. |
| `GalaxieGlobe.astro` | HF-Sphäre (Seite 2) — Karussell-Item. |
| `Planet.astro` | Themen-Planet (Seite 3) inkl. 4 Phasen-Dots. |
| `CarouselCaption.astro` | Zentrierte Caption für Seite 1+2 (Modell B+). Ersetzt das gelöschte `FocusPanel.astro`. |
| `CarouselCaptionSide.astro` | Rechts platzierte Caption für Seite 3. |
| `gsap-carousel.ts` | Karussell-Engine (`initCarousel`, `wireDots`/`updateDots`). Ersetzt `gsap-orbits.ts`. |
| `carousel-caption.ts` | Caption-Sync (Crossfade bei Center-Wechsel). Ersetzt `gsap-focus.ts`. |
| `SearchOverlay.astro` · `InfoButton.astro` | Volltextsuche (Command-Palette) · Build-Info-Button. |

**Telemetrie-Kontrakt (Dozenten-Dashboard):** `data-universum-id` (Stage + Objekte), `data-hb-slugs` (Themen-Slugs pro HF-Kugel), `data-progress-hb` (HF-Fortschritt %, client-seitig aus localStorage).

## 12. Hierarchie (Universum → Galaxie → Planet) & Routing

Oberste Ebene ist das **Universum**: **Universum → Galaxie (HF) → Planet (Thema) → Lernseite**.

| Route | Inhalt |
|---|---|
| `/` | Universum-Auswahl (aktuell 1 Universum „Fachwirt Marketing") |
| `/fachwirt-marketing/` | Galaxie-Auswahl (HF1–4) |
| `/fachwirt-marketing/hb1/` | Planeten-Auswahl (Themen) |
| `/fachwirt-marketing/hb1/thema-slug/` | Lernseite |

Alle drei Auswahl-Ebenen nutzen dieselbe Karussell-Engine (`ring` horizontal für 1+2, `linear` vertikal für 3) — skaliert automatisch, sobald weitere Universen in `data/universen.ts` ergänzt werden (Platzhalter via `comingSoon`-Flag).

## Behobene Fallen (Protokoll)

1. **`trailingSlash: 'always'`** legte die gesamte Auth-API lahm (Better Auth ruft ohne Slash) → steht auf **`'ignore'`** (verifiziert in `astro.config.mjs`).
2. Die Middleware darf Auth/DB **nicht statisch** importieren (läuft auch beim Prerendern) → `isPrerendered`-Guard + **dynamischer Import**.

---

*Maßgeblich für den Ist-Stand ergänzend: [roadmap.md](../planung/roadmap.md), [deployment.md](deployment.md), [ki-governance.md](../ki/ki-governance.md).*

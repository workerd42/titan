# TITAN — Produkt- & Entwicklungs-Roadmap

> Quelle: [Notion — Produkt- & Entwicklungs-Roadmap](https://app.notion.com/p/39895f8eb376811fb6aee7e9c6274216)
> Ursprung: 2026-07-09 · Zuletzt aktualisiert nach Frontend-Rework & Deployment: 2026-07-14

## ✅ Phase 1: Local-First MVP (Astro + GSAP + localStorage)

**Ziel:** Vollständig funktionierender, ultraschneller Frontend-Prototyp als statisch generierte Site (SSG). — **Abgeschlossen.**

### 1.1 Core Frontend Architecture & UI

- [x] M1.1–1.6: Astro Grundstruktur, Content-Collections Schema, Project Setup.
- [x] Design System v2 Integration: Norive Tokens (Warm Linen, Espresso, Cormorant Garamond, DM Mono).
- [x] Side-Panels (Konzept & Mein Bereich) mit Mutual Exclusion, Backdrop-Blur & ESC/Outside-Dismiss.
- [x] **Navigations-Rework (2026-07-14): Orbit-Drag-System vollständig ersetzt durch Karussell-Navigation.**
  - Seite 1 (Universum) + Seite 2 (Galaxie/HF): **horizontales 3D-Rotations-Karussell** (echte CSS-`perspective` + `translate3d`, endlose Rotation, kürzester Rotationsweg, zentrierte Caption). Ersetzt `gsap-orbits.ts` + `gsap-focus.ts` (Modell B+: kein separater Zoom-Schritt mehr, Caption folgt der Zentrierung, Navigation nur per CTA).
  - Seite 3 (Planeten): **vertikales Karussell** mit Info-Panel rechts, weichem Rand-Fade (CSS-Maske), Positions-Zähler.
  - Positions-Indikatoren (Punkte bzw. „X / N"), einmaliger Bedienhinweis für Erstbesucher, Coming-Soon-Badges für Platzhalter-Universen.
  - Volltextsuche (Lupe oben rechts, zentrierte Command-Palette) über alle drei Hierarchieebenen inkl. Themen-Volltext; Index als lazy geladene `/search-index.json`.
  - Info-Button (Version/Build/Status) unten links.
  - Verifiziert über Chromium/Firefox/WebKit × 5 Displaygrößen (15/15 fehlerfrei).

### 1.2 Content & Local Persistence

- [x] Local State Engine: `norive-progress-v2` & `norive-kompass-v1` Speicherung im `localStorage`.
- [x] Content Rollout (46 Themen/Planeten across 4 Handlungsfelder — tatsächlicher Stand auf Disk):
  - HF 1 (Marktforschung & Analyse): 8 Planeten
  - HF 2 (Marketing-Mix): 10 Planeten
  - HF 3 (Erfolgsmessung/Controlling/Qualität): 10 Planeten
  - HF 4 (Kommunikation, Führung & Personal): 16 Planeten

## 🛠️ Phase 2: Production Infrastructure, Auth, Datenbank & Dozenten-Cockpit

**Ziel:** Vom reinen Local-First-Frontend zu einem System mit Accounts, serverseitiger Persistenz und einem Dozenten-Cockpit. **Nächste aktive Phase.**

> **Status:** Teilweise begonnen. **Deployment-Fundament steht** — das statische Frontend läuft containerisiert (Docker/nginx) auf dem VPS `prototyp-staging.norive.de`, ausgerollt von GitHub (`workerd42/titan`) via `deploy.sh`. Siehe [deployment.md](deployment.md). Backend (Auth/DB/API/Cockpit) ist noch offen.
>
> **Hinweis zur Architektur-Entscheidung:** Die ursprüngliche Notion-Planung sah Payload CMS v3 als Content-Backend vor. Für „Dozent sieht Fortschritt aller Schüler" reicht zunächst ein schlankeres Auth+DB+API-Fundament; der volle Payload/n8n-Stack wird erst mit Phase 3 (KI-Artefakte) relevant. Konkrete Wahl (Auth-Methode, DB, Hosting) wird zu Beginn von Phase 2 festgelegt.

### 2.0 Account- & Onboarding-Modell (festgelegt 2026-07-14)

Zwei gleichrangige Zielgruppen, zwei Einstiegswege:

- **B2C — Einzellerner:** Landingpage → Selbst-Registrierung (Email/Passwort) → lernen, eigener Fortschritts-Sync. (Optional fiktives Kompass-Übungsunternehmen anlegen.)
- **B2B — Bildungsträger/Unternehmen:** Landingpage → **Organisation** registriert sich (Registrierender = Org-Admin, ggf. zugleich Dozent) → Admin legt Lerner an / lädt sie per Email ein → Lerner sind der Organisation zugeordnet → **Dozent sieht deren Fortschritt im Cockpit** → später Abrechnung pro Platz.

**Rollen:** Plattform-Admin (Betreiber) · Org-Admin · Dozent · Lerner. (Org-Admin und Dozent können dieselbe Person sein.)

**Begriffs-Trennung (wichtig, nicht vermischen):**
- **Kompass-Unternehmen** = *fiktives Übungsunternehmen des Lerners* (für Fallbeispiele, existiert bereits im Frontend, `norive-kompass-v1`).
- **Organisation / Bildungsträger** = *echter zahlender Kunde*, der Zugänge kauft und Lerner provisioniert. Im Code konsequent „Organisation".

**Technik:** Better Auth **Organization-Plugin** (Organisationen + Rollen + Einladungen fertig) deckt den B2B-Weg ab. Das Dozenten-Cockpit ist die Org-/Dozent-Sicht auf den Fortschritt.

**Sequenzierung (festgelegt):** Erst das **Einzel-Account-Fundament** (2.2/2.3 — registrieren/login/eigener Fortschritts-Sync; bedient B2C sofort und ist Voraussetzung für alles). **Direkt danach** die Organisations-/Rollen-/Einladungs-Schicht **zusammen mit dem Dozenten-Cockpit** (2.4), da dasselbe Modell.

**Separat (Frontend, kein Auth):** Eine echte **Marketing-Landingpage** existiert noch nicht (aktuell ist `/` die App selbst) — eigener Baustein, unabhängig von der Auth-Arbeit.

### 2.1 Deployment-Infrastruktur

- [x] Docker-Containerisierung des statischen Frontends (Dockerfile, docker-compose.yml, nginx-Config im Repo).
- [x] VPS-Deployment auf `prototyp-staging.norive.de` (Host-nginx als Reverse-Proxy + TLS).
- [x] GitHub-basierter Deploy-Workflow (Deploy-Key, `deploy.sh` = `git pull` + `docker compose up -d --build`).
- [x] **Stack auf Node + Postgres umgestellt** (2026-07-15): App-Container läuft als Node-Server (`@astrojs/node`, kein nginx mehr im Container), Postgres-Service ohne Host-Port, Auto-Migration beim Start via `scripts/migrate.mjs`. Lokal komplett verifiziert.
- [ ] **Erster Live-Deploy mit Secrets** auf dem VPS (`.env` neben `docker-compose.yml`: `POSTGRES_*`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`) — noch offen.

### 2.2 Login / Auth ✅

- [x] Registrierung & Anmeldung (E-Mail/Passwort) via Better Auth. OAuth bewusst später.
- [x] Session-/Token-Handling, sichere Cookies (`httpOnly`, `SameSite=Lax`), Passwort-Hashing (scrypt).
- [x] Middleware (`Astro.locals.user/session`), Konto-Seite, Login-Status + Abmelden in „Mein Bereich".

### 2.3 Datenbank & User-Persistenz ✅

- [x] Drizzle-Schema (Better-Auth-Tabellen + `user_progress` + `kompass_profile`), Migrationen.
- [x] `/api/progress` (GET/PUT, session-geschützt) + `norive-sync.ts`.
- [x] **Local-First-Sync-Bridge mit Union-Merge**: anonym unverändert lokal; beim Login wandert der lokale Stand in den Account; kein Datenverlust bei Geräte-Konflikten (2-Geräte-Test verifiziert).

### 2.4 Dozenten-Cockpit

- [ ] Rolle „Dozent" (sieht Fortschritt zugeordneter Schüler).
- [ ] Dashboard: Fortschritt pro Schüler/Handlungsfeld, Lernstreak, letzte Aktivität. Genaue Kennzahlen noch zu definieren.
- [ ] Telemetrie-Kontrakt aus dem Frontend nutzen (`data-universum-id`, `data-hb-slugs`, `data-progress-hb`).

### 2.5 Admin-Bereich

- [ ] Nutzer-/Rollenverwaltung, Content-Übersicht. **Detaillierter Scope in separater Rücksprache festzulegen** (offener Punkt).

## 🤖 Phase 3: KI-Orchestrierung & Interaktiver Baukasten

**Ziel:** Aktivierung der Core-Engine in Phase 3 (Anwenden) und Phase 4 (Prüfen).

### 3.1 n8n & Anthropic Claude Integration

- [ ] Grammatik- & Kontext-Buffer Pipeline: n8n Workflow übersetzt `norive-kompass-v1` Formulareingaben bei Erstellung einmalig in ein dekliniertes KI-Kontext-JSON.
- [ ] Phase 3 Guided Writing Engine:
  - Webhook-Anbindung: User-Eingaben aus der Textarea auf der Lernseite werden an n8n gesendet.
  - Claude API generiert IHK-konformes Feedback und strukturiert die Lösung als Artefakt-Baustein.

### 3.2 Interaktive IHK-Werkzeuge (Phase 3 Modules)

- [ ] SWOT-Matrix Baukasten: Interaktives 4-Felder-Grid mit Live-KI-Hilfe.
- [ ] Deckungsbeitrags- & Kennzahlen-Rechner: LaTeX-basierter Schritt-für-Schritt Rechenweg mit eigenen Zahlen des Kompass-Unternehmens.
- [ ] SMART-Zielprüfer & PESTEL-Analyse: Eingabemasken zur Prüfung von Strategiefragen.

### 3.3 Dynamic Spaced Repetition (Phase 4)

- [ ] Exam-Countdown-Algorithmus: Passt die Wiederholungsintervalle für IHK-Fragen dynamisch an das individuell eingetragene Prüfungsdatum des Nutzers an.

## 🚀 Phase 4: Missions-Launch & Kommerzialisierung

**Ziel:** Zusammenführung aller Artefakte zum USP und Plattform-Skalierung.

### 4.1 Der IHK-Präsentations-Generator (USP)

- [ ] Artefakt-Aggregator: Liest alle absolvierten Phase-3-Werkzeuge aus.
- [ ] Missions-Launch UI: Generiert ein durchgängiges, formatiertes Präsentations-Deck (HTML-Slide-Show/Druck-PDF) für die mündliche IHK-Prüfung.
- [ ] KI-Fachgespräch-Simulator: Erstellt aus den gewählten Artefakten einen individuellen Fragen-Leitfaden zur Vorbereitung auf die mündliche Prüfung.

### 4.2 3D-Visualisierung & Universum-Designer (three.js)

- [ ] **three.js-Upgrade der Kugeln:** echte WebGL-Planeten (Licht, Textur, Partikel-Ringe für Galaxien) statt der aktuellen CSS/SVG-3D-Annäherung. Bewusst hier und nicht früher, weil es ein Wechsel der Rendering-Grundlage ist (Bundle-Size, WebGL statt Zero-JS) — lohnt sich erst, wenn es einen echten Anwendungsfall gibt.
- [ ] **Universum-Designer (Admin, no-code):** Bereich, in dem Universen/Galaxien/Planeten ohne Code gestaltet werden (Farbe, Größe, Textur einer echten 3D-Kugel). Setzt Auth+DB+Admin aus Phase 2 voraus (Speicherort für die Konfiguration) — deshalb an three.js gekoppelt und nach dem Backend eingeplant.

### 4.3 Monetarisierung & B2B/B2C Rollout

- [ ] Stripe-Payment Integration:
  - B2C: Kauf einzelner Galaxien (Handlungsfelder) oder des Komplett-Universums (Einmalkauf/zeitbasierter Pass).
  - B2B: Multi-Lizenz-Dashboard für IHK-Bildungsträger & Dozenten.
- [ ] Skalierung auf weitere Fachwirte: neue „Content-Packs" (z.B. Wirtschaftsfachwirt, Fachwirt im Gesundheitswesen) — ohne Anpassung des Core-Codes.

### Zusammenfassende Phasen-Übersicht

```
Phase 1: STATIC FRONTEND MVP ✅ ─────► Phase 2: BACKEND, AUTH & COCKPIT (aktiv)
[Astro + Karussell + LocalStorage]     [Deployment ✅ · Auth · DB · Dozenten-Cockpit · Admin]
[Docker/VPS-Deployment ✅]                                │
                                                          ▼
Phase 4: LAUNCH, 3D & MONETARISIERUNG ◄──── Phase 3: AI-ENGINE & BAUKASTEN
[Präsentations-Deck · three.js/Universum-      [n8n + Claude API + SWOT/Tools]
 Designer · Stripe · Skalierung]
```

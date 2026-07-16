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

> **Status (2026-07-16):** **Fundament live.** Der Stack läuft containerisiert als **Node + Postgres** auf dem VPS `prototyp-staging.norive.de`, ausgerollt von GitHub (`workerd42/titan`) via `deploy.sh`. Auth, DB und Fortschritts-Sync sind umgesetzt und in Produktion verifiziert (erste Registrierung liegt in der DB). Siehe [deployment.md](deployment.md). **Offen:** Dozenten-Cockpit (2.4), Admin (2.5), Redaktionssystem (2.6).
>
> **Hinweis zur Architektur-Entscheidung:** Die ursprüngliche Notion-Planung sah Payload CMS v3 als Content-Backend vor. Für „Dozent sieht Fortschritt aller Schüler" reicht zunächst ein schlankeres Auth+DB+API-Fundament; der volle Payload/n8n-Stack wird erst mit Phase 3 (KI-Artefakte) relevant. Konkrete Wahl (Auth-Methode, DB, Hosting) wird zu Beginn von Phase 2 festgelegt.

### 2.0 Account- & Onboarding-Modell (festgelegt 2026-07-14)

> **Zugangsmodell revidiert (2026-07-16): Hartes Gate statt Freemium.** Titan (die App) sitzt **vollständig hinter Login**. Vorgeschaltet ist ein **eigenes Projekt**: Unternehmens-/Produktseite + Lead-Pages + Landingpage → **Paywall** → Registrierung/Login → Titan. Das bisherige Freemium-/„anonym lernen"-Modell entfällt für die Lerninhalte.
>
> **Technische Konsequenz (Pflicht, sonst nur Kosmetik):** Die Lernseiten sind aktuell statisch vorgerendert und würden per Direkt-URL trotzdem ausgeliefert. Ein echtes Gate verlangt **serverseitiges Rendern hinter der Session** (`prerender = false` + Middleware-Redirect zu Login/Paywall) für die geschützten Routen. Ein reiner Client-Redirect schützt die Inhalte nicht. SEO ist dafür bereits aus (noindex/Disallow). Local-First (localStorage als schnelle Arbeitskopie) bleibt **post-Login** gültig.
>
> **Offen (Funnel-Detail, für die Umsetzung zu klären):** Reihenfolge Paywall ↔ Registrierung (zahlen-dann-provisionieren vs. registrieren-dann-Entitlement). Die vorgeschalteten Marketing-/Paywall-Seiten sind ein separater Baustein, nicht diese Astro-App.

Zwei gleichrangige Zielgruppen, zwei Einstiegswege:

- **B2C — Einzellerner:** Marketing-/Landingpage → Paywall → Registrierung (Email/Passwort) → lernen, eigener Fortschritts-Sync. (Optional fiktives Kompass-Übungsunternehmen anlegen.)
- **B2B — Bildungsträger/Unternehmen:** Landingpage → **Organisation** registriert sich (Registrierender = Org-Admin, ggf. zugleich Dozent) → Admin legt Lerner an / lädt sie per Email ein → Lerner sind der Organisation zugeordnet → **Dozent sieht deren Fortschritt im Cockpit** → später Abrechnung pro Platz.

**Rollen:** Plattform-Admin (Betreiber) · Org-Admin · Dozent · Lerner. (Org-Admin und Dozent können dieselbe Person sein.)

**Begriffs-Trennung (wichtig, nicht vermischen):**
- **Kompass-Unternehmen** = *fiktives Übungsunternehmen des Lerners* (für Fallbeispiele, existiert bereits im Frontend, `norive-kompass-v1`).
- **Organisation / Bildungsträger** = *echter zahlender Kunde*, der Zugänge kauft und Lerner provisioniert. Im Code konsequent „Organisation".

**Technik:** Better Auth **Organization-Plugin** (Organisationen + Rollen + Einladungen fertig) deckt den B2B-Weg ab. Das Dozenten-Cockpit ist die Org-/Dozent-Sicht auf den Fortschritt.

**Sequenzierung (festgelegt):** Erst das **Einzel-Account-Fundament** (2.2/2.3 — registrieren/login/eigener Fortschritts-Sync; bedient B2C sofort und ist Voraussetzung für alles). **Direkt danach** die Organisations-/Rollen-/Einladungs-Schicht **zusammen mit dem Dozenten-Cockpit** (2.4), da dasselbe Modell.

**Separat (eigenes Projekt, vorgeschaltet):** Unternehmens-/Produktseite + Lead-Pages + **Landingpage + Paywall** existieren noch nicht (aktuell ist `/` die App selbst). Sie sind dem Login **vorgeschaltet** und ein eigener Baustein — nicht diese Astro-App. Titan beginnt erst nach erfolgreichem Login/Entitlement.

### 2.1 Deployment-Infrastruktur

- [x] Docker-Containerisierung des Frontends (Dockerfile, docker-compose.yml). *(Die anfängliche nginx-Serve-Config wurde in Phase 2 durch den Node-Server ersetzt, siehe 2.1-Punkt unten.)*
- [x] VPS-Deployment auf `prototyp-staging.norive.de` (Host-nginx als Reverse-Proxy + TLS).
- [x] GitHub-basierter Deploy-Workflow (Deploy-Key, `deploy.sh` = `git pull` + `docker compose up -d --build`).
- [x] **Stack auf Node + Postgres umgestellt** (2026-07-15): App-Container läuft als Node-Server (`@astrojs/node`, kein nginx mehr im Container), Postgres-Service ohne Host-Port, Auto-Migration beim Start via `scripts/migrate.mjs`. Lokal komplett verifiziert.
- [x] **Erster Live-Deploy mit Secrets** auf dem VPS (`.env` neben `docker-compose.yml`: `POSTGRES_*`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`) — **erfolgt 2026-07-15**. DB-Zugangsdaten werden als diskrete `PG*`-Felder übergeben (nicht als URL) — siehe Stolperstein in [deployment.md](deployment.md).
- [x] **Backup & Restore gebaut** (`scripts/backup.sh` / `restore.sh`): hoster-unabhängiger `pg_dump` mit Rotation, optionaler GPG-Verschlüsselung, Off-site via rclone und Heartbeat-Ping. **Restore lokal echt geprobt** (Daten gelöscht → vollständig wiederhergestellt).
- [x] **Backup-Cron auf dem VPS aktiv** (2026-07-16): täglich 03:15 UTC, Test-Feuerung bewiesen. **Backup liegt vorerst nur lokal auf dem VPS** (schützt gegen DB-Verlust, nicht gegen VPS-Verlust).
- [ ] **Off-site-Backup** + externes Monitoring (Anbieter EU/DE). Off-site-Ziel: **Hetzner Storage Box 1 TB** (DE), sobald geholt — IONOS scheidet vertraglich aus. Details in [deployment.md](deployment.md).

**Anbieter-Grundsatz (festgelegt 2026-07-15):** Alle Dienste mit Datenkontakt müssen in der **EU/Deutschland** liegen. Damit ausgeschieden: Cloudflare R2, Backblaze B2, UptimeRobot, Healthchecks.io, Resend (alle US). **VPS-Standort bestätigt:** IONOS, Rechenzentrum Europa (VPS 4-4-120). Kandidaten/Entscheidungen: **Better Stack** (CZ) fürs Monitoring (offen), **Hetzner Storage Box** (DE) fürs Off-site-Backup (gewählt — ~~Scaleway~~ kostenpflichtig, ~~IONOS~~ vertraglich ausgeschlossen), **Brevo** (FR) für Transaktions-Mail. Jede Anbieter-Angabe **vor Einrichtung selbst gegenprüfen** — Konditionen ändern sich.

**Nicht geeignet — geprüft:** *Plesk*-Backups erfassen nur Panel-verwaltete Inhalte, nicht unsere Docker-Container/Volumes. *VPS-Snapshots* (z. B. IONOS) sind eine grobkörnige Ergänzung, kein Ersatz für `pg_dump`.

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

**Datenmodell — Entscheidung revidiert (2026-07-15):** Ursprünglich war eine Normalisierung des JSONB-Fortschritts geplant. Nachgerechnet ist das **verfrühte Optimierung**: 200 Lernende × 46 Themen ≈ 9.200 Einträge — dafür reicht JSONB mit GIN-Index mühelos. **Stattdessen:** beim Cockpit-Bau eine kleine abgeleitete Zusammenfassung (Prozent je Handlungsfeld + letzte Aktivität) neben dem Blob mitschreiben → triviale, schnelle Abfragen ohne Migrationsrisiko.
**Auslöser für eine echte Normalisierung** (im Blick behalten): Zeitreihen-/Verlaufsanalytik, Auswertungen über *alle* Organisationen hinweg, oder spürbar langsame Cockpit-Abfragen. Vorher nicht.

**E-Mail-Versand (Voraussetzung für Einladungen, entschieden 2026-07-15):** **Brevo** (Frankreich, EU-konform, 300 Mails/Tag gratis) für **transaktionale** Mails (Einladung, Passwort-Reset). Bewusst **nicht** HubSpot: dessen Free-Tier ist Marketing-Mail, Transaktions-Mail ist ein kostenpflichtiges Add-on, und Marketing-Tooling vermischt Zustellbarkeit und Einwilligungs-Semantik. HubSpot bleibt optional für CRM/Marketing — aber **kein Tracking-Script in die App**, das würde das aktuell nicht nötige Cookie-Banner erzwingen (es gibt nur ein technisch notwendiges Session-Cookie).

### 2.5 Admin-Bereich

- [ ] Nutzer-/Rollenverwaltung, Content-Übersicht. **Detaillierter Scope in separater Rücksprache festzulegen** (offener Punkt).

### 2.6 Redaktionssystem für Fachautoren (neu, 2026-07-15)

**Auslöser:** Die Inhalte werden **dauerhaft von einem Fachautor** (ohne Technikkenntnisse) geliefert. „Markdown-Datei + Git-Commit" ist damit kein tragfähiger Weg mehr — ein CMS ist berechtigt.

- [ ] **Auto-Deploy als Voraussetzung** — Titan rendert die Themenseiten statisch beim Build; ohne automatischen Deploy (Webhook → Build → Ausrollen) geht keine Textänderung live. **Das ist der eigentliche Aufwand, nicht das CMS.** Betrifft jede CMS-Variante.
- [ ] CMS-Entscheidung umsetzen (Richtung: **Directus**, selbst gehostet auf einer Sub-Domain im Norive-Ökosystem)
- [ ] Zod-Schema-Validierung erhalten: Astro-Content-Collections können per API laden **und** weiterhin gegen das Schema validieren → fehlerhafte Inhalte lassen den Build scheitern, statt live zu gehen.

**Abgewogene Optionen:**

| Option | Für | Gegen |
|---|---|---|
| **Directus** (selbst gehostet, kostenlos) — *Empfehlung* | Fachautor meldet sich mit **E-Mail/Passwort** an, kein GitHub nötig; sehr gute Editor-UI für verschachtelte Strukturen; EU-tauglich; eigene Revisionshistorie | Zweites System (Betrieb, Patches, Absicherung) |
| **Git-basierter CMS** (Decap/Sveltia/Pages CMS) | Inhalte bleiben versioniert/überprüfbar (bei Prüfungsinhalten wertvoll); kein zweites System; kostenlos | **Fachautor bräuchte ein GitHub-Konto** oder wir betreiben einen OAuth-Proxy — praktische Hürde |
| ~~PIM-System~~ | — | **Falsches Werkzeug.** PIM verwaltet Produktdaten (Artikel, Varianten, Attribute, Preise) für Verkaufskanäle. Titans Inhalte sind redaktionelle Lerntexte — Kategorie-Verwechslung. |
| ~~Payload CMS~~ | — | Wollte **auch** Auth/API übernehmen → hätten wir doppelt (zwei Nutzersysteme). Directus wird bewusst **nur** als Redaktionswerkzeug für Mitarbeiter eingesetzt, sauber getrennt von der Lernenden-Anmeldung. |

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

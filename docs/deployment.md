# Deployment — VPS, Docker, GitHub

Wie Titan von der lokalen Entwicklung bis zur Live-Domain kommt, und wie künftige Änderungen ausgerollt werden.

> **Stand Phase 2 (2026-07-15):** Der Stack besteht jetzt aus **zwei** Containern — die App läuft als **Node-Server** (nicht mehr nginx-static), dazu kommt **Postgres** für Accounts/Fortschritt. Migrationen laufen automatisch beim Containerstart.

## Überblick

```
Mac (lokale Entwicklung)
   │  git push
   ▼
GitHub — workerd42/titan (privates Repo, Quelle der Wahrheit)
   │  git pull (via Deploy-Key)
   ▼
VPS — /var/www/prototyp-staging.norive.de
   │  docker compose up -d --build   (liest Secrets aus .env daneben)
   ▼
┌─────────────────────────────────────────────┐
│ Container "titan" (node:22)                 │
│  1. node scripts/migrate.mjs  (idempotent)  │
│  2. node dist/server/entry.mjs              │
│  → liefert prerenderte Seiten UND           │
│    on-demand-Routen (/konto, /api/*)        │
│  127.0.0.1:8080 → 4321                      │
└──────────────────┬──────────────────────────┘
                   │ nur im Docker-Netz
┌──────────────────▼──────────────────────────┐
│ Container "titan-postgres" (postgres:16)    │
│  Volume: titan_pgdata  ·  KEIN Host-Port    │
└─────────────────────────────────────────────┘
   │
   ▼
Host-nginx (VPS) — TLS-Terminierung, Reverse-Proxy → 127.0.0.1:8080
   │
   ▼
https://prototyp-staging.norive.de
```

## Komponenten

### 1. GitHub — Quelle der Wahrheit
- Repo: `workerd42/titan` (privat)
- Lokal auf dem Mac: `/Users/Dude/Downloads/titan`, Remote `origin` zeigt auf GitHub
- Auf dem VPS: eigener Git-Checkout unter `/var/www/prototyp-staging.norive.de`, verbunden über einen **Deploy-Key** (read-only, SSH-Alias `github-titan` in `~/.ssh/config`) — nicht über den persönlichen SSH-Key

### 2. Docker-Setup (im Repo)
- **`Dockerfile`** — Zweistufiger Build: Build-Stage baut den Astro-Output; **Serve-Stage ist `node:22-alpine`** (seit Phase 2 kein nginx mehr im Container — der `@astrojs/node`-Adapter liefert prerenderte Seiten *und* on-demand-Routen selbst aus). Der Container führt beim Start erst `scripts/migrate.mjs` aus, dann `dist/server/entry.mjs`.
- **`docker-compose.yml`** — zwei Services:
  - `titan` (App) → nur an `127.0.0.1:8080` gebunden, Port 4321 im Container
  - `postgres` (DB) → **kein Host-Port**, nur im Docker-Netz erreichbar; Daten im Volume `titan_pgdata`; die App startet erst, wenn der Healthcheck grün ist
  - Secrets kommen aus einer `.env` **neben** der Compose-Datei; fehlt eine, schlägt `docker compose up` bewusst sofort fehl (`${VAR:?}`)
- **`scripts/migrate.mjs`** — programmatischer Drizzle-Migrator. Bewusst nicht `drizzle-kit` (devDependency, nicht im schlanken Prod-Image); nutzt nur `drizzle-orm`/`pg` und die generierten SQL-Dateien aus `drizzle/`. Idempotent.
- **Kein `docker/nginx.conf` mehr** (in Phase 2 entfernt). **Wichtig bleibt:** Weder Container noch Host-nginx dürfen eine eigene CSP setzen — die App liefert ihre CSP per `<meta>`-Tag aus (`BaseLayout.astro`). Eine zweite, widersprüchliche CSP hat früher genau den Bug verursacht, dass Buttons live tot waren (siehe Stolpersteine unten).

### 3. Host-nginx (VPS, außerhalb des Repos)
- Terminiert TLS für `prototyp-staging.norive.de`
- Reverse-Proxy: alle Anfragen → `127.0.0.1:8080` (der App-Container)
- **Wichtig:** darf keine eigene CSP setzen (siehe oben) — falls doch, unbedingt entfernen

### 3a. Secrets auf dem VPS (`.env` neben `docker-compose.yml`)
Vorlage: `.env.example` im Repo. Für Produktion werden gebraucht:
```bash
POSTGRES_USER=titan
POSTGRES_PASSWORD=<starkes-passwort>
POSTGRES_DB=titan
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=https://prototyp-staging.norive.de
```
`DATABASE_URL` wird von der Compose-Datei aus diesen Werten zusammengebaut — in Produktion **nicht** separat setzen. Die `.env` ist gitignored und wird nie ins Image kopiert (`.dockerignore`).

### 4. `deploy.sh` (auf dem VPS, im Projektordner)
```bash
#!/bin/bash
set -e
cd /var/www/prototyp-staging.norive.de
git pull
docker compose up -d --build
```

## Ablauf für ein normales Update

```bash
# Lokal auf dem Mac
cd /Users/Dude/Downloads/titan
git add <geänderte Dateien>
git commit -m "..."
git push

# Auf dem VPS
ssh root@<vps-ip>
cd /var/www/prototyp-staging.norive.de
./deploy.sh
```

## Verifizieren, dass ein Deploy korrekt angekommen ist

```bash
# 1. Beide Container laufen, postgres "healthy"?
docker compose ps

# 2. Migration gelaufen + Server gestartet? (erwartet "[migrate] Migrationen angewendet.")
docker compose logs titan | tail -10

# 3. CSP identisch von außen und innen?
curl -s https://prototyp-staging.norive.de/ | grep -o "Content-Security-Policy[^>]*"
curl -s http://127.0.0.1:8080/ | grep -o "Content-Security-Policy[^>]*"

# 4. Auth erreichbar? (erwartet "null" wenn nicht eingeloggt — NICHT 404)
curl -s https://prototyp-staging.norive.de/api/auth/get-session

# 5. Tabellen vorhanden?
docker exec titan-postgres psql -U titan -d titan -c "\dt"
```

## Bekannte Stolpersteine (aus der Deployment-Historie)

1. **Doppelte/widersprüchliche CSP** (Host-nginx *und* App-Meta-Tag setzen unterschiedliche Policies) → Browser wendet die *Schnittmenge* an, die restriktivere gewinnt oft unerwartet und blockiert Inline-Scripts/fetch(). Lösung: CSP **nur** in `BaseLayout.astro`, nirgendwo sonst.
2. **`docker compose` im falschen Verzeichnis ausgeführt** — wirkt immer auf das `docker-compose.yml` im aktuellen Ordner. Vor jedem `docker compose ...`-Befehl mit `pwd` prüfen, dass man in `/var/www/prototyp-staging.norive.de` ist.
3. **Verwaiste Container nach Ersetzen von `docker-compose.yml`** — wird die Datei durch eine neue Version ersetzt (z. B. via `git pull`), räumt Docker alte Container aus der *vorherigen* Version nicht automatisch auf. Mit `docker ps -a` prüfen und alte Container gezielt mit `docker rm -f <name>` entfernen, bevor der neue Stack hochgefahren wird.
4. **Dubious ownership (Git)** — falls der VPS-Ordner ursprünglich per `rsync`/`scp` statt `git clone` befüllt wurde, gehören die Dateien ggf. einem anderen User als `root`. Git verweigert dann Befehle mit "dubious ownership". Sauberste Lösung: Ordner einmalig per `git clone` neu aufsetzen (wie in dieser Session geschehen), statt `safe.directory`-Ausnahmen zu sammeln.
5. **Astro `Astro.redirect()` in statischen Builds** — funktioniert auch bei `output: "static"` (Astro erzeugt eine statische HTML-Seite mit Meta-Refresh + `noindex`), kein Sonderfall nötig.
6. **`trailingSlash: 'always'` legt die Auth-API lahm** (Phase 2, real passiert) — Better Auth ruft seine Endpunkte **ohne** Trailing-Slash auf (`/api/auth/sign-in/email`); mit `'always'` liefen *alle* Auth-Requests in einen 404, ohne erkennbaren Fehler im Log. Steht jetzt auf `'ignore'` (akzeptiert beide Schreibweisen, statische Seiten bleiben Verzeichnisse). **Nicht zurückstellen.**
7. **Middleware darf Auth/DB nicht zur Build-Zeit laden** — Astro führt die Middleware auch beim Prerendern der statischen Seiten aus. Ein statischer `import` von `lib/auth` würde beim Bauen eine DB-Verbindung/Secrets verlangen und den Build brechen. Deshalb in `middleware.ts`: `isPrerendered`-Guard + **dynamischer** Import. Beim Umbauen der Middleware unbedingt beibehalten.
8. **Migrationen im Prod-Image** — `drizzle-kit` ist devDependency und liegt bewusst nicht im Image. Migrationen laufen über `scripts/migrate.mjs` (nur `drizzle-orm`/`pg`) automatisch beim Containerstart. Schlägt die Migration fehl, startet der Server absichtlich nicht.
9. **Secrets fehlen** → `docker compose up` bricht sofort ab (`${VAR:?}` in der Compose-Datei). Das ist gewollt: besser lauter Abbruch als ein Start mit unsicheren Defaults. Dann `.env` neben `docker-compose.yml` prüfen.

## Referenzen

- Docker-/Git-Befehle im Detail: [spickzettel.md](spickzettel.md)
- Architektur-Hintergrund: [architektur.md](architektur.md)

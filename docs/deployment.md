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
POSTGRES_USER=monarch
POSTGRES_PASSWORD=<starkes-passwort>
POSTGRES_DB=hermes
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=https://prototyp-staging.norive.de
```
`DATABASE_URL` wird von der Compose-Datei aus diesen Werten zusammengebaut — in Produktion **nicht** separat setzen. Die `.env` ist gitignored und wird nie ins Image kopiert (`.dockerignore`).

**Namensgebung (festgelegt 2026-07-15):** Benutzer `monarch`, Datenbank `hermes` — bewusst **nicht** der Projektname (`titan` benennt das Projekt, nicht die Datenbank-Identität). Die **lokale Entwicklung darf abweichen** und nutzt weiterhin `titan/titan` (siehe [spickzettel.md](spickzettel.md)).

> ⚠️ **Nur einmal einstellbar:** Postgres übernimmt `POSTGRES_USER`/`POSTGRES_DB` **ausschließlich beim allerersten Start mit leerem Datenverzeichnis**. Danach stecken die Namen im Volume `titan_pgdata` fest — eine spätere Änderung in der `.env` greift wirkungslos ins Leere (die App bekäme dann Verbindungsfehler). Nachträglich zu ändern hieße: Volume löschen (= Datenverlust) oder manuell per SQL umbenennen. **Also vor dem ersten `docker compose up` festlegen.**

*(Der Container heißt weiterhin `titan-postgres` — das ist ein Docker-interner Name des Projekt-Stacks, keine Zugangsdaten.)*

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
docker exec titan-postgres psql -U monarch -d hermes -c "\dt"
```

## Datensicherung (Backup & Restore)

> **Warum das ab Phase 2 kritisch ist:** Bisher lagen alle Daten im Browser des Nutzers — ein Serverausfall war folgenlos. Jetzt liegen Konten und Lernfortschritt zentral in Postgres. **Ohne Backup ist ein Serverausfall echter Datenverlust.**

### Warum `pg_dump` und nicht Plesk/Panel-Backups

**Plesk** (bzw. vergleichbare Hosting-Panels) ist eine grafische Server-Verwaltung. Es sichert das, **was es selbst verwaltet** — Titan läuft aber als rohe Docker-Container mit einem Postgres im Docker-Volume, an dem ein Panel vorbeischaut. **Ein Plesk-Backup erfasst unsere Datenbank aller Voraussicht nach nicht.**

Ein **VPS-Snapshot** (Abbild der ganzen Maschine, z. B. als IONOS-Zusatz) enthält das Volume zwar, ist aber grobkörnig (Restore = ganzer Server zurück, inkl. anderer Dienste), meist kostenpflichtig und bei laufender DB potenziell inkonsistent. → Sinnvolle **Ergänzung**, kein Ersatz.

`scripts/backup.sh` ist deshalb hoster-unabhängig, präzise (nur unsere DB), granular wiederherstellbar und kostenlos.

### Einrichtung auf dem VPS

```bash
cd /var/www/prototyp-staging.norive.de

# Einmalig testen (schreibt nach /var/backups/titan)
./scripts/backup.sh

# Für Verschlüsselung (PFLICHT sobald off-site) auf dem VPS nötig:
apt-get install -y gnupg      # bzw. apk add gnupg
```

**Cron einrichten** (`crontab -e`), täglich 03:15 Uhr:

```cron
15 3 * * * cd /var/www/prototyp-staging.norive.de && ./scripts/backup.sh >> /var/log/titan-backup.log 2>&1
```

**Konfiguration** (Umgebungsvariablen, alle optional):

| Variable | Wirkung |
|---|---|
| `BACKUP_DIR` | Zielverzeichnis (Default `/var/backups/titan`) |
| `PG_CONTAINER` | DB-Container (Default `titan-postgres`) |
| `KEEP_DAILY` | Wie viele Dumps behalten (Default 7) |
| `BACKUP_PASSPHRASE` | Wenn gesetzt → GPG-verschlüsselt. **Pflicht für off-site** |
| `RCLONE_REMOTE` | z. B. `scaleway:titan-backups` → Off-site-Kopie |
| `HEARTBEAT_URL` | Wird nur bei **vollem Erfolg** gepingt |

**Eingebaute Schutzmechanismen:**
- Dump < 500 Bytes → Abbruch (ein „erfolgreiches" leeres Backup wäre die gefährlichste Variante)
- `RCLONE_REMOTE` **ohne** `BACKUP_PASSPHRASE` → **Abbruch**: personenbezogene Daten dürfen nicht unverschlüsselt zu Dritten
- Fehlt `gpg` trotz gesetzter Passphrase → Abbruch statt stillem Überspringen der Verschlüsselung
- Kein Heartbeat-Ping im Fehlerfall → das Monitoring schlägt an

### Restore — **mindestens einmal echt proben**

> Ein Backup, dessen Wiederherstellung nie getestet wurde, ist nur ein Versprechen. Dieser Weg wurde lokal verifiziert (14 Nutzer gelöscht → vollständig wiederhergestellt).

```bash
./scripts/restore.sh /var/backups/titan/titan_2026-07-15_031500.sql.gz
# verschlüsselt:
BACKUP_PASSPHRASE=... ./scripts/restore.sh /var/backups/titan/titan_....sql.gz.gpg
```
Das Skript fragt vor dem Überschreiben nach und zeigt danach eine Kurzprüfung (Anzahl Nutzer/Fortschritte).

### Monitoring

Zwei Dinge, **extern** überwacht (ein Monitoring auf demselben VPS merkt dessen Ausfall nicht):
1. **Erreichbarkeit** der Seite (Uptime-Check)
2. **Backup-Lauf** als Totmannschalter (`HEARTBEAT_URL`) — **wichtiger als es klingt**: ein still fehlschlagender Backup-Cron ist schlimmer als gar keiner, weil man sich in Sicherheit wiegt.

**Anbieter-Anforderung: EU/Deutschland.** Kandidaten (Free-Tier, **bitte vor Einrichtung gegenprüfen — Konditionen/Firmensitze ändern sich**):
- **Better Stack** (Tschechien 🇨🇿) — Uptime + Heartbeats in einem
- Off-site-Speicher: **Scaleway Object Storage** (Frankreich 🇫🇷, Free-Tier) oder **Hetzner Storage Box** (Deutschland 🇩🇪, ~3,50 €/Monat)
- ⚠️ **Zu klären:** Wo steht der VPS selbst? Ohne EU-Standort dort ist der Rest hinfällig.

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

## ⚠️ Domain-Umzug: `prototyp-staging.norive.de` ist NICHT die finale Adresse

Die Staging-Domain steckt an mehreren Stellen fest verdrahtet. **Beim Wechsel auf die Produktivdomain müssen alle mitwandern**, sonst brechen Logins:

| Stelle | Wirkung bei Vergessen |
|---|---|
| `astro.config.mjs` → `SITE_URL` | Canonical-URLs zeigen auf die alte Domain (SEO-Schaden) |
| **`BETTER_AUTH_URL`** (VPS-`.env`) | **Session-Cookies hängen an der Domain → Login funktioniert nicht mehr.** Der kritischste Punkt. |
| `public/robots.txt` | Sitemap-Verweis zeigt ins Leere (aktuell ohnehin `Disallow: /`) |
| JSON-LD (`BaseLayout.astro`) | `url`-Feld der Strukturdaten falsch |
| Host-nginx (VPS) | `server_name` + TLS-Zertifikat für die neue Domain |

**Bestehende Sessions werden beim Umzug ungültig** (Cookies gelten pro Domain) — alle Nutzer müssen sich einmal neu anmelden. Bei einem Prototyp unkritisch, bei echten Nutzern vorher ankündigen.

## Referenzen

- Docker-/Git-Befehle im Detail: [spickzettel.md](spickzettel.md)
- Architektur-Hintergrund: [architektur.md](architektur.md)

# Spickzettel — Git, GitHub, Docker, Deploy

Die wichtigsten Befehle aus unserer Zusammenarbeit, zum Nachschlagen.

> Ausführlicher Überblick über das Gesamt-Setup (Architektur, bekannte Stolpersteine): [deployment.md](deployment.md)

## Lokale Entwicklung (Mac)

```bash
astro dev --background   # Dev-Server im Hintergrund starten
astro dev status          # Läuft er noch? Auf welchem Port?
astro dev logs             # Live-Logs ansehen
astro dev stop              # Dev-Server beenden

npm run build              # Produktions-Build nach dist/ (immer vor dem Deployen testen)
```

## Lokale Datenbank (Phase 2)

Der Dev-Server braucht ein laufendes Postgres + eine `.env` (Vorlage: `.env.example`).

```bash
# Einmalig: lokales Postgres starten
docker run -d --name titan-pg-dev \
  -e POSTGRES_USER=titan -e POSTGRES_PASSWORD=titan -e POSTGRES_DB=titan \
  -p 5432:5432 postgres:16-alpine

docker start titan-pg-dev    # nach Neustart wieder hochfahren
docker stop titan-pg-dev     # anhalten

# Schema-Änderungen (src/lib/db/schema.ts)
npm run db:generate          # erzeugt SQL-Migration in drizzle/
npm run db:migrate           # wendet Migrationen auf die DB an

# In die DB schauen
docker exec -it titan-pg-dev psql -U titan -d titan
#   \dt                       Tabellen auflisten
#   \d "user"                 Spalten einer Tabelle
#   SELECT email FROM "user"; Nutzer ansehen
```

**Wichtig:** `npm run db:generate` nach *jeder* Schema-Änderung — sonst fehlt die Migration im Prod-Image (dort läuft kein `drizzle-kit`, nur die generierten SQL-Dateien via `scripts/migrate.mjs`).

## Git — Grundlagen

```bash
git status                 # Was ist geändert/neu?
git diff                    # Zeigt die genauen Änderungen
git add <datei>              # Datei zum Commit vormerken (gezielt, nie "git add -A" blind)
git commit -m "Kurze, prägnante Nachricht"
git log --oneline -10        # Letzte 10 Commits kompakt
git push                     # Zum Remote (GitHub) hochladen
git pull                     # Vom Remote herunterladen
```

## GitHub — SSH-Zugang einrichten (einmalig pro Rechner)

```bash
cat ~/.ssh/id_ed25519.pub     # Öffentlichen Schlüssel anzeigen und kopieren
# → auf github.com: Settings → SSH and GPG keys → New SSH key → einfügen

ssh-add --apple-use-keychain ~/.ssh/id_ed25519   # Key beim Agent anmelden (macOS Keychain)
ssh -T git@github.com          # Verbindung testen — sollte "Hi <user>!" zeigen
```

## Remote verbinden / Historie überschreiben

```bash
git remote add origin git@github.com:<user>/<repo>.git   # Neues Repo verknüpfen
git remote -v                                              # Welche Remotes sind konfiguriert?
git fetch origin                                            # Remote-Stand holen, ohne zu mergen
git push --force-with-lease -u origin main                  # Lokalen Stand als main setzen
                                                              # (überschreibt Remote-Historie —
                                                              #  nur mit Bedacht einsetzen!)
```

## Docker — auf dem VPS

```bash
docker ps                    # Laufende Container
docker ps -a                 # Alle Container, auch gestoppte
docker compose up -d --build  # Bauen + im Hintergrund starten (im Projektordner mit docker-compose.yml!)
docker compose ps             # Status der Container dieses Compose-Projekts
docker compose logs <service> --tail 50   # Logs eines Service ansehen

docker exec <container> <befehl>          # Befehl in laufendem Container ausführen
docker rm -f <container>                   # Container stoppen + entfernen
docker rmi <image>                         # Image löschen (Speicher freigeben)
```

**Wichtige Falle:** `docker compose` wirkt immer auf das `docker-compose.yml` im **aktuellen Verzeichnis** — vorher immer mit `pwd`/`cd` sicherstellen, dass man im richtigen Projektordner ist (z.B. `/var/www/prototyp-staging.norive.de`), sonst startet man versehentlich einen ganz anderen Stack.

## Backup & Restore (auf dem VPS)

```bash
cd /var/www/prototyp-staging.norive.de

./scripts/backup.sh                    # Dump + Rotation (Default: /var/backups/titan, 7 Stück)
ls -lh /var/backups/titan              # Was liegt da?

# Restore (fragt vor dem Überschreiben nach)
./scripts/restore.sh /var/backups/titan/titan_2026-07-15_031500.sql.gz

# Cron (täglich 03:15) — crontab -e
# 15 3 * * * cd /var/www/prototyp-staging.norive.de && ./scripts/backup.sh >> /var/log/titan-backup.log 2>&1
```

**Regel:** Restore mindestens **einmal echt proben** — ein ungetestetes Backup ist nur ein Versprechen. Off-site geht nur verschlüsselt (`BACKUP_PASSPHRASE`), das Skript verweigert es sonst. Details: [deployment.md](deployment.md).

## Unser Deploy-Workflow (Titan auf `prototyp-staging.norive.de`)

**Lokal auf dem Mac** (nach Änderungen):
```bash
cd /Users/Dude/Downloads/titan
git add <geänderte Dateien>
git commit -m "..."
git push
```

**Auf dem VPS** (danach):
```bash
ssh root@dein-vps-ip
cd /var/www/prototyp-staging.norive.de
./deploy.sh
```

`deploy.sh` macht automatisch `git pull` + `docker compose up -d --build`.

## Verifizieren, dass alles live korrekt angekommen ist

Seit Phase 2 ist der App-Container ein **Node-Server** (kein nginx-static mehr), Postgres läuft daneben.

```bash
docker compose ps        # titan "Up", titan-postgres "healthy"

# App über das Reverse-Proxy-Ziel (nur lokal auf dem VPS gebunden):
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/          # → 200

# Öffentlich über TLS (Host-nginx):
curl -s -o /dev/null -w "%{http_code}\n" https://prototyp-staging.norive.de/   # → 200

# CSP kommt per <meta> aus BaseLayout (nicht als Header) — einmal prüfen, dass sie da ist:
curl -s https://prototyp-staging.norive.de/ | grep -o "Content-Security-Policy" | head -1

# DB erreichbar + Tabellen vorhanden (Prod-User/DB: monarch/hermes):
docker exec titan-postgres psql -U monarch -d hermes -c "\dt"
```

> Frühere Fassung prüfte drei identische CSP-Ausgaben aus `/usr/share/nginx/html/` — das galt für den alten nginx-Container und trifft seit Phase 2 nicht mehr zu.

## SSH-Deploy-Key (nur einmalig beim VPS-Setup nötig)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/titan_deploy -N "" -C "vps-deploy-titan"   # auf dem VPS erzeugen
cat ~/.ssh/titan_deploy.pub                                                 # → als Deploy-Key bei GitHub hinterlegen
ssh -T git@github-titan                                                    # Testen (Alias aus ~/.ssh/config)
```

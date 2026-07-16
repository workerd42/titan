# TITAN — Kompetenz-Engine für IHK-Fachwirte

Interaktive Lernplattform (aktuell: Fachwirt Marketing) mit einer Karussell-Navigation durch **Universum → Galaxie (Handlungsfeld) → Planet (Thema) → 4-Phasen-Lernseite**. Local-First: anonyme Nutzer lernen offline im `localStorage`; mit Login wird der Fortschritt in einen Account synchronisiert.

> Prototyp-/Staging-Zustand. Inhalte sind bewusst nicht öffentlich auffindbar (`robots.txt: Disallow /`, `noindex`). Live: `https://prototyp-staging.norive.de` — **nicht** die finale Adresse.

## Stack

- **Astro 7** Hybrid — `output: 'static'` + `@astrojs/node` (standalone). Lernseiten sind prerendered; nur `/konto` und `/api/*` laufen on-demand (`export const prerender = false`).
- **GSAP** — Karussell-Engine (`ring` 3D horizontal für Seite 1+2, `linear` vertikal für Seite 3), GSAP nur zum Tweenen.
- **Better Auth** (E-Mail/Passwort, Sessions) · **Drizzle ORM** · **Postgres 16** — self-hosted im Docker-Stack, keine externen Kosten.
- Vanilla CSS + Norive Design Tokens (Light/Dark). Content Collections + Zod als Build-Zeit-Validierung.

## Entwicklung

```bash
npm install
# Lokales Postgres (einmalig) — siehe docs/spickzettel.md:
docker run -d --name titan-pg-dev -e POSTGRES_USER=titan -e POSTGRES_PASSWORD=titan -e POSTGRES_DB=titan -p 5432:5432 postgres:16-alpine
cp .env.example .env            # Werte anpassen (BETTER_AUTH_SECRET erzeugen)
npm run db:migrate              # Schema anlegen
npm run dev                     # http://localhost:4321
```

Dev-Server im Hintergrund (siehe [CLAUDE.md](CLAUDE.md)): `astro dev --background`, dann `astro dev status|logs|stop`.

## Datenbank

```bash
npm run db:generate   # nach jeder Änderung an src/lib/db/schema.ts → SQL-Migration in drizzle/
npm run db:migrate    # Migrationen anwenden
```

## Deployment

GitHub (`workerd42/titan`) → VPS: `./deploy.sh` macht `git pull` + `docker compose up -d --build` (baut Astro, startet Node + Postgres, migriert automatisch beim Containerstart). Secrets liegen in einer gitignored `.env` neben `docker-compose.yml` auf dem VPS. Vollständige Anleitung: [docs/deployment.md](docs/deployment.md).

## Dokumentation

| Datei | Inhalt |
|---|---|
| [docs/produktvision.md](docs/produktvision.md) | Leitbild, 4-Phasen-Kompetenzreise, Kompass-System |
| [docs/architektur.md](docs/architektur.md) | Technische Architektur, Karussell-Engine, Auth/Persistenz |
| [docs/roadmap.md](docs/roadmap.md) | Phasen 1–4, Stand der Umsetzung |
| [docs/deployment.md](docs/deployment.md) | VPS/Docker-Setup, Backup/Restore, Stolpersteine |
| [docs/design-system.md](docs/design-system.md) | Norive Design Tokens, Typografie, Farben |
| [docs/spickzettel.md](docs/spickzettel.md) | Git/Docker/Deploy-Befehle zum Nachschlagen |

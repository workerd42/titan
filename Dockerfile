# ── Build-Stage: Astro-Build (statische Seiten + Node-Server-Entry) ──────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
# Baut dist/client (prerenderte Seiten + Assets) und dist/server (on-demand
# Routen: /konto, /api/auth/*, /api/progress). Benötigt KEINE DB — Auth/DB
# werden erst zur Laufzeit geladen (siehe middleware.ts).
RUN npm run build

# ── Serve-Stage: Node liefert alles aus (Phase 2: nicht mehr nginx-static) ──
FROM node:22-alpine AS serve
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Nur Produktions-Abhängigkeiten ins Image.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
# Migrations-SQL + Migrator (nutzen nur drizzle-orm/pg = Prod-Deps, daher
# kein drizzle-kit im Prod-Image nötig).
COPY drizzle ./drizzle
COPY scripts/migrate.mjs ./scripts/migrate.mjs

EXPOSE 4321

# Migrationen sind idempotent und laufen vor dem Serverstart. Bei einer
# einzelnen App-Instanz ist das der einfachste verlässliche Weg; schlägt die
# Migration fehl, startet der Server bewusst NICHT (kein Betrieb auf einem
# halb migrierten Schema).
CMD ["sh", "-c", "node ./scripts/migrate.mjs && node ./dist/server/entry.mjs"]

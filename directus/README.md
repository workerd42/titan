# Directus — Schema (versioniert)

Dieses Verzeichnis versioniert das **Directus-Datenmodell** (das sonst nur im Docker-Volume der
lokalen Instanz läge). So ist der Aufbau der `themen`-Collection reproduzierbar und reversibel.

- **`schema-snapshot.json`** — vollständiger Schnappschuss (Collections, Felder, Relationen,
  Interfaces, Übersetzungen). Erzeugt mit der Directus-Schema-API.

## Snapshot neu erzeugen (nach Änderungen im Directus-Admin)

```bash
TOKEN=$(curl -s -X POST http://localhost:8055/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@titan.dev","password":"directus-dev-admin"}' | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
curl -s http://localhost:8055/schema/snapshot -H "Authorization: Bearer $TOKEN" \
  | sed 's/^{"data"://; s/}$//' > directus/schema-snapshot.json
```

## Schema auf einer (leeren/anderen) Instanz anwenden

```bash
# 1) Diff berechnen
curl -s -X POST http://localhost:8055/schema/diff \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  --data-binary @directus/schema-snapshot.json > /tmp/diff.json
# 2) Diff anwenden
curl -s -X POST http://localhost:8055/schema/apply \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  --data-binary @/tmp/diff.json
```

> **Inhalte** (die Themen-Datensätze) sind NICHT Teil des Schema-Snapshots — nur die Struktur.
> Inhalte pflegt die Redaktion in Directus; Titan zieht sie beim Build (`status=published`).

Setup & Schnittstelle: [../docs/directus-setup.md](../docs/directus-setup.md) ·
Autoren-Anleitung: [../docs/directus-fachautor-anleitung.md](../docs/directus-fachautor-anleitung.md)

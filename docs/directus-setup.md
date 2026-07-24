# Titan — Directus (Redaktionssystem) · lokales Setup & Schnittstelle

> Directus ist das **Redaktionssystem für Fachautoren** (Roadmap 2.6 / EPIC-13). Diese
> Anleitung beschreibt die **lokale** Instanz zum Vorbereiten/Testen und die **Schnittstelle**
> zu Titan. Konzept-Bezug: [gesamtkonzept-lernprozess.md](gesamtkonzept-lernprozess.md) §7
> („Redaktionssystem-Integration").

## 1. Lokale Instanz (Docker)

Bewusst **separat** vom Titan-Prod-Stack (`docker-compose.yml`) — eigene DB, eigene Volumes,
eigener Port. Berührt den bestehenden Titan-Stack nicht.

```bash
# Start
docker compose -f docker-compose.directus.yml up -d
# Stop (Daten bleiben in den Volumes)
docker compose -f docker-compose.directus.yml down
# Zurücksetzen (Daten löschen)
docker compose -f docker-compose.directus.yml down -v
```

- **Admin-UI:** http://localhost:8055
- **Login:** `admin@titan.local` / `directus-dev-admin`  *(nur lokal! Dev-Defaults)*
- **Health:** `curl http://localhost:8055/server/health` → `{"status":"ok"}`
- **API (Beispiel):** `curl http://localhost:8055/items/<collection>` (nach Login/Token)

> ⚠️ **Nur lokal.** Die Secrets in `docker-compose.directus.yml` sind Dev-Defaults. Die
> Produktions-Instanz kommt später als eigener, abgesicherter Service (eigene Sub-Domain im
> Norive-Ökosystem, echte Secrets, hinter Host-nginx) — siehe [deployment.md](deployment.md).
>
> **Betrieb (festgelegt):** Directus wird vom **Gründer selbst gehostet** (er ist **Admin**) und
> **auf den eigenen Server gehoben, sobald das System lokal steht**. Der lokale Stack hier ist die
> Vorstufe zum Modellieren/Testen. **Docker-Hinweis:** aktuell kostenlose Docker-Nutzung — bei
> vollem Speicher/steigendem Bedarf den Wechsel auf eine kostenpflichtige Variante prüfen (Ops-Kostenposten).

## 2. Schnittstelle Titan ↔ Directus (entschieden)

**Build-time Pull + Webhook** (nicht Runtime, nicht Push):

```
Fachautor pflegt in Directus  ──►  Directus = Quelle der Wahrheit
        │  (Webhook bei Änderung)
        ▼
   CI-Build von Titan  ──►  Astro-Content-Loader ZIEHT per Directus-API
                             + validiert gegen Zod-Schema (content.config.ts)
                             + rendert STATISCH  ──►  Deploy
```

**Warum so:** bewahrt Titans **statisch/schnell/offline** (kritisch in der Prüfungssituation)
und **Zod bleibt das Sicherheitsnetz** (fehlerhafte Inhalte lassen den Build scheitern statt
live zu gehen).

## 3. Nächste Schritte (offen)

1. **Datenmodell modellieren** — Directus-Collections spiegeln das Titan-Content-Schema
   (`src/content.config.ts`): Themen mit Feldern `title, handlungsbereich, themengruppe,
   definitionen, formeln, rechenbeispiel, zusammenfassung, gesetze, merksatz, begriffe,
   fallbeispiel, pruefungsfrage, werkzeug` (+ künftig `fallaufgaben`, `mc`).
2. **Astro-Content-Loader** bauen, der aus der Directus-API lädt **und** gegen das Zod-Schema
   validiert (Astro-Content-Collections unterstützen eigene Loader).
3. **Auto-Deploy** (Webhook → Build → Ausrollen) — der eigentliche Aufwand (Roadmap 2.6).
4. **Fachwirt-PDFs strukturieren** — einmalig pro Fachwirt in die Collections überführen
   (nicht 1:1 nutzbar; pro Thema/Feld), in **eigenem Titan-Wording**
   ([content-richtlinien.md](content-richtlinien.md)).

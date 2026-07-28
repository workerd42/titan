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
- **Login:** `admin@titan.dev` / `directus-dev-admin`  *(nur lokal! Dev-Defaults)*
  - ⚠️ **Gotcha:** Directus' Login-Validator lehnt `.local`-Domains als „ungültige E-Mail" ab →
    der Admin-Bootstrap scheitert **stillschweigend** (Schema da, aber 0 User). Darum eine
    **echte TLD** (`.dev`) verwenden. Bei „0 users": `down -v` + `up -d` (frischer Bootstrap).
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

## 3. Stand & nächste Schritte

**✅ Erledigt (2026-07-27):**
1. **Datenmodell** — Collection `themen` mit 19 Feldern (spiegelt `src/content.config.ts`;
   Nested/Arrays als JSON; `status` = draft/published für „In Bearbeitung/Publikation-Frei").
2. **Astro-Content-Loader** — Collection `themenCms` in `src/content.config.ts` zieht per
   **Build-time Pull** (`filter status=published`) und validiert gegen **dasselbe Zod-Schema**
   wie die Markdown-Themen. **Graceful:** kein Token / Directus offline → leere Collection
   (Markdown-`themen` bleibt unberührt → reversibel). Zugriff über **statischen Dev-Token**
   (`DIRECTUS_TOKEN`, lokal als Fallback; **Prod: scoped Read-Token via Env**).
3. **End-to-End verifiziert** — Test-Thema (published) kommt via Loader durch, Zod-validiert.

**✅ Arbeitsreif gemacht (2026-07-28):** Die `themen`-Collection ist jetzt **fachautor-tauglich**
(kein JSON-Tippen mehr, siehe [directus-fachautor-anleitung.md](directus-fachautor-anleitung.md)):
- **Phasen-Gruppen** im Formular (Identität · Verstehen · Merken · Anwenden · Prüfen · Wiederholung).
- **Listen** (Begriffe, Definitionen, Formeln, Rechtsgrundlagen) als klickbare **Repeater**;
  Zusammenfassung/Lösungsweg als **Tags**.
- **Fallbeispiel & Prüfungsfrage flach** — beschriftete Einzelfelder (`fall_*`, `pruef_*`) statt
  JSON-Objekt; der Loader baut daraus wieder die vom Zod-Schema erwartete verschachtelte Form.
- **Pflichtfelder**, **Dropdowns** (Handlungsbereich, Werkzeug, **Status „In Bearbeitung/Publikation-Frei"**),
  Defaults (Status=draft, Wiederholung=4), **Feld-Hinweise** (u. a. Urheberrecht bei Gesetzen).
- **Deutsche Oberfläche** + saubere Feld-Labels (Übersetzungen).
- **Schema versioniert** im Repo: [`directus/schema-snapshot.json`](../directus/schema-snapshot.json)
  (+ [`directus/README.md`](../directus/README.md) — Snapshot/Apply). Test-Thema entfernt; nur das
  echte KPI-Thema bleibt.
- `rechenbeispiel` bleibt bewusst JSON (selten/fortgeschritten).

**⬜ Offen:**
4. **Auto-Deploy** (Webhook → Build → Ausrollen) — der eigentliche Aufwand (Roadmap 2.6).
5. **Fachwirt-PDFs strukturieren** — einmalig pro Fachwirt in die Collection überführen
   (nicht 1:1 nutzbar; pro Thema/Feld), in **eigenem Titan-Wording**
   ([content-richtlinien.md](content-richtlinien.md)).
**🔁 Render-Kreislauf prototypisiert (2026-07-27):** Route `src/pages/cms-vorschau/[slug].astro`
(prerender=false, hinter dem Login-Gate) rendert ein Thema **live aus `themenCms` (Directus)** statt
aus Markdown — schlanke Inhaltsvorschau (Verstehen/Merksatz/Begriffe/Fallbeispiel/Prüfen), Body via
`marked`. End-to-End verifiziert: Titel in Directus geändert → Sync → Seite zog mit → zurückgesetzt.
Die echten 46 Lernseiten (aus `themen`, Markdown) bleiben unangetastet → **reversibel**. Dafür wurde
`body` (optional) ins geteilte `themenSchema` + den Loader aufgenommen.

**✅ Vollmigration + Multi-Fachwirt (2026-07-28):** **Alle 46 Themen** strukturiert in Directus
(`node directus/migrate-all.mjs`, idempotent — liest die Markdown-Themen, füllt Directus neu).
Neues Pflichtfeld **`fachwirt`** (Marketing/Vertrieb/Industrie) — zusammen mit `handlungsbereich`
ergibt sich die Einordnung **„Marketing – HB1"** (Collection-Anzeige `{{fachwirt}} – {{handlungsbereich}} · {{title}}`).
So skaliert das Modell auf beliebig viele Fachwirte (HB1–HB4 bleiben wiederverwendbar). `themenCms`
zieht alle 46 durch Zod (verifiziert: 46/46, 15 mit Werkzeug). **Inhalte leben im Docker-Volume**,
das **Schema** ist versioniert (`directus/schema-snapshot.json`), die **Migration** reproduzierbar
(`directus/migrate-all.mjs`).

**⬜ Offen:**
6. **Rendering-Umschaltung entscheiden**: ob/wann die *echten* Lernseiten (`[universum]/[hb]/[slug]`)
   von `themen` (Markdown) auf `themenCms` (Directus) umgestellt werden — Merge- vs. Umschalt-Strategie.
   Vorschau-Route ist der Testträger. Voraussetzung: Themen vollständig in Directus überführt.

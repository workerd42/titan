# Admin-Panel & Rollen

Nutzer- und Rollenverwaltung für Titan, umgesetzt mit dem **Better-Auth Admin-Plugin**.
Erreichbar unter `/admin` — ausschließlich für die Rolle `platform-admin`.

## Rollen

| Rolle | Bedeutung | Admin-Panel |
|---|---|---|
| `platform-admin` | Betreiber, voller Zugriff | ✅ Ja (einzige Rolle) |
| `org-admin` | verwaltet Lerner einer Organisation (Rechte folgen mit Org-Cockpit) | ❌ |
| `dozent` | sieht Fortschritt zugeordneter Lerner (Dozenten-Cockpit, folgt) | ❌ |
| `lerner` | Standard für neue Registrierungen | ❌ |

Definiert in [src/lib/rollen.ts](../src/lib/rollen.ts) (Labels) und
[src/lib/rollen-ac.ts](../src/lib/rollen-ac.ts) (Access-Control-Rechte).
Die Rollen sind im Panel jederzeit änderbar.

## Funktionsumfang

- Nutzer auflisten (Name, E-Mail, Rolle, Status)
- Rolle ändern (Dropdown pro Nutzer)
- Nutzer sperren / entsperren
- Nutzer anlegen (Name, E-Mail, Passwort, Rolle)

Die eigene Zeile ist geschützt: eigene Rolle nicht änderbar, kein Selbst-Sperren.

## Sicherheit (zwei Schichten)

1. **Seiten-Gate** ([src/pages/admin.astro](../src/pages/admin.astro), `prerender = false`):
   rendert das Panel nur bei `Astro.locals.user?.role === 'platform-admin'`,
   sonst eine „Kein Zugriff"-Ansicht.
2. **API-Autorisierung**: jeder `authClient.admin.*`-Aufruf wird serverseitig
   vom Better-Auth-Plugin gegen `adminRoles: ['platform-admin']` geprüft.
   Ein `lerner` erhält `403 YOU_ARE_NOT_ALLOWED_TO_LIST_USERS` — unabhängig
   davon, was der Client sendet.

## Ersten platform-admin einrichten (Bootstrap)

Die öffentliche Registrierung ist **invite-only** (`disableSignUp`), deshalb kann
sich auf einer frischen DB niemand selbst als erster Admin anlegen. Dafür gibt es
[scripts/bootstrap-admin.mjs](../scripts/bootstrap-admin.mjs) — legt den ersten
Admin direkt mit Better-Auths Passwort-Hashing an (login-kompatibel), idempotent.
Bewusst `.mjs` mit rohem SQL, damit es unverändert auch im schlanken Prod-Image
läuft (nur Prod-Deps `pg` + `better-auth`).

**Lokal** (Env aus `.env`):

```bash
node scripts/bootstrap-admin.mjs admin@example.de "SicheresPasswort" "Anzeigename"
```

**Im Prod-Container** (nach dem automatischen `migrate` beim Start), von der
docker-compose-Root auf dem VPS:

```bash
docker compose exec titan node scripts/bootstrap-admin.mjs admin@example.de "…" "Name"
```

Das Script verbindet über dieselben Env-Variablen wie die Migrationen
(`PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE`; im Container ohnehin gesetzt).
Existiert die E-Mail schon, wird sie nur auf `platform-admin` gehoben. Danach
normal unter `/konto` einloggen — alle weiteren Accounts und Rollen (z. B. einen
**Dozenten**) vergibst du direkt im Panel (kein SQL mehr nötig).

## Datenmodell

Das Admin-Plugin ergänzt in [src/lib/db/schema.ts](../src/lib/db/schema.ts):
`user.role`, `user.banned`, `user.banReason`, `user.banExpires` und
`session.impersonatedBy`. Migration: `drizzle/0001_sad_jackal.sql`.

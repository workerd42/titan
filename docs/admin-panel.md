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

Registrierungen bekommen immer `lerner`. Der erste Admin wird einmalig per DB
gesetzt:

1. Ganz normal unter `/konto` registrieren.
2. Diese Rolle einmalig per SQL heben (Beispiel Dev-Container):

   ```bash
   docker exec titan-pg-dev psql -U titan -d titan \
     -c "update \"user\" set role='platform-admin' where email='DEINE@MAIL';"
   ```

   Auf dem VPS analog gegen den Produktions-Postgres-Container (siehe
   [deployment.md](./deployment.md)). Danach ist `/admin` erreichbar und alle
   weiteren Admins können direkt im Panel vergeben werden.

## Datenmodell

Das Admin-Plugin ergänzt in [src/lib/db/schema.ts](../src/lib/db/schema.ts):
`user.role`, `user.banned`, `user.banReason`, `user.banExpires` und
`session.impersonatedBy`. Migration: `drizzle/0001_sad_jackal.sql`.

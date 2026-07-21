# Rollen & Rechte — wer darf was, wo

> Vollständige Berechtigungsübersicht für Titan. Rollen kommen aus dem
> Better-Auth-Admin-Plugin (`src/lib/rollen.ts` / `src/lib/rollen-ac.ts`), das
> Gate aus `src/middleware.ts`. Status: ✅ umgesetzt · 🔜 geplant.
> Siehe auch [admin-panel.md](admin-panel.md), [lastenheft.md](lastenheft.md).

## Die Rollen

| Rolle | Kurz | Admin-Panel |
|---|---|---|
| **anonym** (nicht eingeloggt) | kein Zugriff auf Inhalte | – |
| **lerner** (Default) | lernt, baut sein Kompass-Unternehmen, erzeugt Artefakte | – |
| **dozent** | wie lerner + Fortschritts-Einsicht zugeordneter Lerner (Cockpit) | – |
| **org-admin** | verwaltet Lerner der eigenen Organisation/eines Trägers | – |
| **platform-admin** | Betreiber; plattformweite Nutzer-/Rollenverwaltung | ✅ ja (einzige) |

## Rechte-Matrix

| Bereich / Aktion | anonym | lerner | dozent | org-admin | platform-admin |
|---|:--:|:--:|:--:|:--:|:--:|
| `/konto` (Login) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lerninhalte ansehen (Kapitel, Module, Deck) | ❌→Login | ✅ | ✅ | ✅ | ✅ |
| Eigenes Kompass-Unternehmen anlegen/bearbeiten | ❌ | ✅ | ✅ | ✅ | ✅ |
| Werkzeuge nutzen → Artefakte/Deck erzeugen | ❌ | ✅ | ✅ | ✅ | ✅ |
| Eigener Fortschritt speichern/synchronisieren | ❌ | ✅ | ✅ | ✅ | ✅ |
| Fortschritt **zugeordneter Lerner** einsehen (Cockpit) 🔜 | ❌ | ❌ | ✅ | ✅ | ✅ |
| Lerner der **eigenen Organisation** anlegen/einladen 🔜 | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Alle** Nutzer anlegen / Rolle ändern / sperren (`/admin`) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Registrierung (Selbst-Anmeldung) | ❌ invite-only | – | – | – | – |

Legende: ✅ erlaubt · ❌ nicht erlaubt · 🔜 geplant (Rolle vorhanden, Feature folgt).

## Wo & wie es technisch durchgesetzt wird

1. **Zugangs-Gate (Seiten)** — `src/middleware.ts`: nicht eingeloggte Zugriffe auf
   geschützte Seiten → Redirect `/konto`. Öffentlich nur `/konto` + `/api/auth`. ✅
2. **Seiten-Rollencheck** — `/admin` rendert nur bei
   `Astro.locals.user.role === 'platform-admin'`, sonst „Kein Zugriff". ✅
3. **API-Autorisierung** — das Better-Auth-Admin-Plugin prüft jede `admin.*`-Aktion
   serverseitig gegen `adminRoles: ['platform-admin']` (Access-Control in
   `src/lib/rollen-ac.ts`). Ein `lerner` erhält `403`, egal was der Client sendet. ✅
4. **Invite-only** — `disableSignUp` sperrt die öffentliche Registrierung; Accounts
   nur via Admin-Panel bzw. Bootstrap-Script. ✅

**Grundsatz:** Rechte werden **serverseitig** durchgesetzt, nie nur im Client.
Zwei Schichten (Seiten-Gate + API-Autorisierung) — Defense-in-Depth.

## Rollen vergeben

- **Erster `platform-admin`:** einmalig per `scripts/bootstrap-admin.mjs`
  (invite-only-tauglich, siehe [admin-panel.md](admin-panel.md)).
- **Alle weiteren Rollen:** im Admin-Panel `/admin` durch einen `platform-admin`
  (Dropdown pro Nutzer). Kein SQL nötig.
- **Selbstschutz:** die eigene Rolle ist im Panel nicht änderbar, kein
  Selbst-Sperren.

## Ausblick (mit B2B-Ausbau)

Der B2B-Weg (Organisationen/Bildungsträger) nutzt perspektivisch das Better-Auth
**Organization-Modell**: Org-Admin provisioniert Lerner seiner Organisation,
Dozent sieht deren Fortschritt im Cockpit — Abrechnung pro Kurs
(siehe [businessplan.md](businessplan.md), [roadmap.md](roadmap.md)).

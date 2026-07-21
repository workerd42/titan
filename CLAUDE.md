## Engineering-Prinzipien (verbindlich)

Diese Prinzipien gelten für **jede** Arbeit an Titan (destilliert aus
`docs/blueprint.md`; die dort genannten konkreten Fremd-Technologien gelten
bewusst NICHT — maßgeblich ist der reale Titan-Stack unten):

- **Barrierefreiheit (WCAG 2.2 AA):** Tastatur-/Screenreader-Bedienung, sichtbarer
  Fokus, aria-Namen für Bedienelemente, `prefers-reduced-motion` respektieren.
  Ziel: 0 axe-Verstöße.
- **Sicherheit (Zero-Trust):** kein `innerHTML` mit ungetrusteten Daten ohne
  Maskierung/Sanitizing; XSS/CSRF vermeiden; Auth/Sessions nur über Better Auth;
  serverseitige Autorisierung, nie Client-Angaben vertrauen; **Secrets nie ins
  Repo/Memory**.
- **Keine Platzhalter:** keine halben Funktionen, keine `// Rest hier` — jede
  gelieferte Einheit ist vollständig, lauffähig, getestet.
- **Defensives Error-Handling:** kritische Calls in try/catch; Fehler dem Nutzer
  über elegante UI (Toasts) verständlich machen; Graceful Degradation (App bleibt
  nutzbar, wenn ein Subsystem ausfällt — Local-First).
- **Premium-/Kosmos-UI:** ruhiges, hochwertiges Norive-Designsystem; alle
  Animationen langsam/organisch/harmonisch (60fps, weiche Eases); native Elemente
  konsistent stylen.
- **State-driven:** UI = f(State); sauberes Unmounting von Listenern, kein
  DOM-Spaghetti; Speicherlecks vermeiden.
- **Gamification behutsam:** wo Motivation sinnvoll ist, ruhige, state-basierte
  Belohnungen (kein Kitsch) im Kosmos-Stil.
- **Nach jeder Sitzung absichern:** committen/pushen + Stand ins Gedächtnis +
  Doku-Abgleich VSCode ↔ Notion ↔ GitHub.

**Realer Titan-Stack (maßgeblich):** Astro-Hybrid (`@astrojs/node`, `output:
'static'` + on-demand-Routen) · Better Auth + Drizzle + self-hosted PostgreSQL ·
**Vanilla CSS mit Norive Design Tokens** (kein Tailwind) · **localStorage**
(Local-First) + Postgres-Sync (kein IndexedDB/Web-Crypto) · mehrseitiges Projekt
(keine Single-File-App) · Betrieb **EU/Deutschland**. Details:
`docs/architektur.md`, `docs/deployment.md`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

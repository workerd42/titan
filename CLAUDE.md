## Engineering-Prinzipien (verbindlich)

Diese Prinzipien gelten für **jede** Arbeit an Titan (destilliert aus
`docs/technik/blueprint.md`; die dort genannten konkreten Fremd-Technologien gelten
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
`docs/technik/architektur.md`, `docs/technik/deployment.md`.

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

## Spezialisierte Subagenten & Routing

Bei spezifischen Aufgaben gezielt die Subagenten aus `.claude/agents/` einsetzen.
Jeder Agent kennt seine relevanten `docs/`-Dokumente (in seinem System-Prompt
hinterlegt); die Spalte „Leit-Dokumente" nennt den jeweiligen Schwerpunkt.

| Agent | Zuständig für | Leit-Dokumente (`docs/`) |
|-------|---------------|--------------------------|
| **`@titan-engineer`** | Code, Features, UI, Refactoring (Astro/Vanilla-CSS/Better Auth/Drizzle) | `technik/architektur.md`, `technik/design-system.md`, `technik/rollen-rechte.md`, `technik/admin-panel.md`, `technik/deployment.md`, `technik/landingpage.md`, `technik/chart-integration.md`, `technik/spickzettel.md`, `technik/blueprint.md` (Prinzipien), `redaktion/directus-setup.md`, `lernkonzept/lernbereich-redesign.md`, `lernkonzept/interaktive-module.md` |
| **`@titan-content-autor`** | IHK-Lerninhalte, Didaktik, Themen-Frontmatter | `lernkonzept/master-fachwirt-marketing.md`, `lernkonzept/content-richtlinien.md`, `lernkonzept/pruefungs-blaupause.md`, `lernkonzept/gesamtkonzept-lernprozess.md`, `lernkonzept/interaktive-module.md`, `lernkonzept/pbl-konzept-pitch.md`, `redaktion/directus-fachautor-anleitung.md` (+ `src/content.config.ts`, `src/content/themen/`) |
| **`@titan-ai-architect`** | KI-Schicht: n8n-Workflows, Prompts, Deklinations-JSON | `ki/ki-governance.md`, `ki/phase3-ki-plan.md`, `lernkonzept/gesamtkonzept-lernprozess.md`, `lernkonzept/interaktive-module.md`, `technik/architektur.md`, `technik/abhaengigkeiten.md`, `planung/lastenheft.md` |
| **`@titan-compliance`** | Security, DSGVO, EU AI Act, Better-Auth-/CSRF-/XSS-Audit | `ki/ki-governance.md`, `ki/phase3-ki-plan.md`, `technik/rollen-rechte.md`, `technik/admin-panel.md`, `technik/architektur.md`, `technik/deployment.md`, `technik/blueprint.md` |
| **`@titan-qa-a11y`** | WCAG 2.2 AA, Accessibility, Builds/Playwright/axe | `technik/blueprint.md`, `technik/design-system.md`, `technik/architektur.md`, `technik/spickzettel.md`, `technik/deployment.md`, `lernkonzept/lernbereich-redesign.md`, `technik/landingpage.md` |
| **`@titan-controller`** | B2B-Pricing, Infra-/LLM-Kosten, Unit Economics, KPIs | `strategie/finanzplan.md`, `strategie/businessplan.md`, `strategie/marketing-konzept.md`, `ki/phase3-ki-plan.md`, `ki/ki-governance.md`, `technik/deployment.md` |
| **`@titan-pm`** | Priorisierung, Task-Breakdown, Roadmap, Sprint-Planning | `planung/lastenheft.md`, `planung/roadmap.md`, `planung/prozess.md`, `strategie/produktvision.md`, `technik/abhaengigkeiten.md`, `lernkonzept/lernbereich-redesign.md` |
| **`@titan-advisor`** | Strategie, Sparring, B2B-Pricing & Business-Cases (Feature-ROI) | `strategie/businessplan.md`, `strategie/produktvision.md`, `strategie/marketing-konzept.md`, `strategie/finanzplan.md`, `planung/lastenheft.md`, `planung/roadmap.md` |

> Alle `docs/` liegen in thematischen Ordnern: `ki/`, `lernkonzept/`, `planung/`,
> `redaktion/`, `strategie/`, `technik/`. Bei Doku-Änderungen die Repo↔Notion-Parität
> beachten (immer der neueste Stand gewinnt, Fakten gegen den Code validieren).

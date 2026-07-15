// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

// Deployment: prototyp-staging.norive.de (VPS, an der Domain-Wurzel ausgeliefert)
const SITE_URL = 'https://prototyp-staging.norive.de';
const BASE_PATH = '/';

// Prototyp-/Staging-Zustand: bewusst kein Sitemap-Eintrag (siehe auch
// robots.txt "Disallow: /" und <meta name="robots" content="noindex,nofollow">
// in BaseLayout.astro) — Inhalte sollen noch nicht öffentlich auffindbar
// sein. @astrojs/sitemap kann wieder ergänzt werden, sobald das gewünscht ist.
//
// Phase 2: Astro-Hybrid. output bleibt 'static' → alle Lernseiten/Karussell-
// Seiten werden weiterhin prerendered (schnell). Nur Auth/API/Konto-Routen
// setzen `export const prerender = false` und werden vom Node-Adapter
// on-demand serverseitig gerendert.
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // 'ignore' statt 'always': Better Auth ruft seine API-Endpunkte ohne
  // Trailing-Slash auf (/api/auth/sign-in/email) — mit 'always' liefen die in
  // einen 404. 'ignore' akzeptiert beide Schreibweisen; die statischen Seiten
  // werden weiterhin als Verzeichnisse gebaut und unter /pfad/ ausgeliefert.
  trailingSlash: 'ignore',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  build: {
    format: 'directory',
  },
  // Typisierte Server-Env (astro:env/server). Secrets werden zur Laufzeit aus
  // der Umgebung gelesen (Dev: .env, Prod: Docker-Compose-Env), NICHT ins
  // Bundle inlined. drizzle-kit läuft außerhalb Astro und nutzt process.env.
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: 'server', access: 'secret' }),
      BETTER_AUTH_SECRET: envField.string({ context: 'server', access: 'secret' }),
      BETTER_AUTH_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});

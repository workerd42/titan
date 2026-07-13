// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployment: prototyp-staging.norive.de (VPS, an der Domain-Wurzel ausgeliefert)
const SITE_URL = 'https://prototyp-staging.norive.de';
const BASE_PATH = '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Vor Deployment: SITE_URL auf echte GitHub-Pages-URL setzen
// z. B. 'https://DEIN-USERNAME.github.io'
const SITE_URL = 'https://yourusername.github.io';
const BASE_PATH = '/titan';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});

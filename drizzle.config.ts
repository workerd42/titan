import { defineConfig } from 'drizzle-kit';

// Lädt .env (Node 22+: process.loadEnvFile). Für lokale Migrationen; auf dem
// VPS kommt DATABASE_URL aus der Compose-Env.
try { process.loadEnvFile(); } catch { /* keine .env vorhanden — Env kommt von außen */ }

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});

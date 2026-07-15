import { defineConfig } from 'drizzle-kit';

// Lädt .env (Node 22+: process.loadEnvFile). Für lokale Migrationen; auf dem
// VPS laufen Migrationen über scripts/migrate.mjs mit der Compose-Env.
try { process.loadEnvFile(); } catch { /* keine .env vorhanden — Env kommt von außen */ }

// Einzelfelder statt url: Sonderzeichen im Passwort (@ / : ? # %) zerreissen
// eine Verbindungs-URL — siehe src/lib/db/index.ts.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.PGHOST ?? 'localhost',
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE ?? '',
    ssl: false,
  },
});

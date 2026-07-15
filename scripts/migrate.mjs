/**
 * Programmatischer DB-Migrator für den Produktions-Container.
 *
 * Warum nicht drizzle-kit? Das ist eine devDependency und liegt bewusst nicht
 * im schlanken Prod-Image. Der Migrator aus drizzle-orm (Prod-Dependency)
 * wendet dieselben generierten SQL-Dateien aus ./drizzle an und ist idempotent
 * (drizzle führt Buch über bereits angewendete Migrationen).
 *
 * Läuft außerhalb von Astro → liest die Zugangsdaten aus process.env
 * (Docker-Compose-Env bzw. lokale Shell).
 *
 * Einzelfelder statt DATABASE_URL: Sonderzeichen im Passwort (@ / : ? # %)
 * zerreissen eine Verbindungs-URL — siehe src/lib/db/index.ts.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const cfg = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

const fehlend = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'].filter((k) => !process.env[k]);
if (fehlend.length) {
  console.error(`[migrate] Fehlende Umgebungsvariablen: ${fehlend.join(', ')} — Abbruch.`);
  process.exit(1);
}

const pool = new pg.Pool(cfg);

try {
  await migrate(drizzle(pool), { migrationsFolder: './drizzle' });
  console.log('[migrate] Migrationen angewendet.');
} catch (err) {
  console.error('[migrate] Fehlgeschlagen:', err);
  process.exit(1);
} finally {
  await pool.end();
}

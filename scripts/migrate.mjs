/**
 * Programmatischer DB-Migrator für den Produktions-Container.
 *
 * Warum nicht drizzle-kit? Das ist eine devDependency und liegt bewusst nicht
 * im schlanken Prod-Image. Der Migrator aus drizzle-orm (Prod-Dependency)
 * wendet dieselben generierten SQL-Dateien aus ./drizzle an und ist idempotent
 * (drizzle führt Buch über bereits angewendete Migrationen).
 *
 * Läuft außerhalb von Astro → liest DATABASE_URL aus process.env
 * (Docker-Compose-Env bzw. lokale Shell).
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('[migrate] DATABASE_URL fehlt — Abbruch.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

try {
  await migrate(drizzle(pool), { migrationsFolder: './drizzle' });
  console.log('[migrate] Migrationen angewendet.');
} catch (err) {
  console.error('[migrate] Fehlgeschlagen:', err);
  process.exit(1);
} finally {
  await pool.end();
}

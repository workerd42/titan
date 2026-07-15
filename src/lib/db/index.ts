/**
 * Drizzle-Client (node-postgres). Server-only — nur aus on-demand-Routen
 * (`prerender = false`) oder der Middleware importieren, nie aus prerenderten
 * Seiten. Der Pool verbindet lazy (erst bei der ersten Query), daher schadet
 * ein Import zur Build-Zeit nicht.
 *
 * Zugangsdaten bewusst als EINZELFELDER, nicht als DATABASE_URL: In einer URL
 * zerreissen Sonderzeichen im Passwort (@ / : ? # %) die Syntax — beim ersten
 * Deploy real passiert (ERR_INVALID_URL, Container in Neustart-Schleife).
 * Als Felder übergeben ist jedes beliebige Passwort erlaubt.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } from 'astro:env/server';
import * as schema from './schema';

const pool = new Pool({
  host: PGHOST,
  port: PGPORT,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
});

export const db = drizzle(pool, { schema });
export { schema };

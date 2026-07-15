/**
 * Drizzle-Client (node-postgres). Server-only — nur aus on-demand-Routen
 * (`prerender = false`) oder der Middleware importieren, nie aus prerenderten
 * Seiten. Der Pool verbindet lazy (erst bei der ersten Query), daher schadet
 * ein Import zur Build-Zeit nicht.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_URL } from 'astro:env/server';
import * as schema from './schema';

const pool = new Pool({ connectionString: DATABASE_URL });

export const db = drizzle(pool, { schema });
export { schema };

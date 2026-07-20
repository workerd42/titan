/**
 * Bootstrap des ersten platform-admin.
 *
 * Weil die öffentliche Registrierung invite-only (disableSignUp) ist, kann sich
 * auf einer frischen DB niemand selbst als erster Admin anlegen. Dieses Script
 * legt den ersten Admin direkt an — mit Better-Auths eigenem Passwort-Hashing
 * (`hashPassword`), sodass der normale Login ihn danach verifizieren kann.
 *
 * Idempotent: existiert die E-Mail schon, wird sie nur auf platform-admin
 * gehoben (und entsperrt). Sonst wird Nutzer + Credential-Account angelegt.
 *
 * Verbindung über process.env (PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE) —
 * dieselben Variablen wie drizzle-kit. Läuft ausserhalb der Astro-Runtime.
 *
 * Aufruf:
 *   npx tsx scripts/bootstrap-admin.ts <email> <passwort> ["Anzeigename"]
 * Im Prod-Container analog, nachdem die Migrationen gelaufen sind.
 */
import { randomUUID } from 'node:crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { hashPassword } from 'better-auth/crypto';
import * as schema from '../src/lib/db/schema';

// .env laden, falls vorhanden (Dev). Im Container kommen die Werte aus der
// Umgebung — dann gibt es keine .env, das ignorieren wir.
try {
  process.loadEnvFile('.env');
} catch {
  /* keine .env — Env kommt aus der Umgebung */
}

const [email, passwort, name] = process.argv.slice(2);
if (!email || !passwort) {
  console.error('Aufruf: npx tsx scripts/bootstrap-admin.ts <email> <passwort> ["Name"]');
  process.exit(1);
}
if (passwort.length < 8) {
  console.error('Passwort muss mindestens 8 Zeichen haben.');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});
const db = drizzle(pool, { schema });

const emailNorm = email.trim().toLowerCase();

try {
  const [vorhanden] = await db.select().from(schema.user).where(eq(schema.user.email, emailNorm)).limit(1);

  if (vorhanden) {
    await db
      .update(schema.user)
      .set({ role: 'platform-admin', banned: false, banReason: null, banExpires: null, updatedAt: new Date() })
      .where(eq(schema.user.id, vorhanden.id));
    console.log(`✓ Bestehender Nutzer ${emailNorm} auf platform-admin gehoben.`);
  } else {
    const userId = randomUUID();
    await db.insert(schema.user).values({
      id: userId,
      name: name?.trim() || emailNorm,
      email: emailNorm,
      emailVerified: true,
      role: 'platform-admin',
      banned: false,
    });
    const hash = await hashPassword(passwort);
    await db.insert(schema.account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hash,
    });
    console.log(`✓ platform-admin angelegt: ${emailNorm}`);
  }
} catch (err) {
  console.error('✗ Bootstrap fehlgeschlagen:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await pool.end();
}

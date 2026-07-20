/**
 * Bootstrap des ersten platform-admin.
 *
 * Weil die öffentliche Registrierung invite-only (disableSignUp) ist, kann sich
 * auf einer frischen DB niemand selbst als erster Admin anlegen. Dieses Script
 * legt den ersten Admin direkt an — mit Better-Auths eigenem Passwort-Hashing
 * (`hashPassword` aus better-auth/crypto), sodass der normale Login ihn danach
 * verifiziert.
 *
 * Bewusst als .mjs mit rohem SQL (pg) statt Drizzle/TS: läuft damit unverändert
 * im schlanken Prod-Image (nur Prod-Deps pg + better-auth, kein tsx/keine
 * TS-Quelle nötig) UND lokal.
 *
 * Idempotent: existiert die E-Mail schon, wird sie nur auf platform-admin
 * gehoben (und entsperrt). Sonst wird Nutzer + Credential-Account angelegt.
 *
 * Verbindung über process.env (PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE) —
 * dieselben Variablen wie scripts/migrate.mjs.
 *
 * Aufruf lokal:   npx dotenv... nicht nötig — .env wird geladen, falls vorhanden:
 *   node scripts/bootstrap-admin.mjs <email> <passwort> ["Anzeigename"]
 * Im Prod-Container (nach der automatischen Migration):
 *   docker compose exec app node scripts/bootstrap-admin.mjs <email> <pw> ["Name"]
 */
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { hashPassword } from 'better-auth/crypto';

// .env laden, falls vorhanden (lokal). Im Container kommen die Werte aus der
// Umgebung — dann existiert keine .env, das ignorieren wir.
try {
  process.loadEnvFile('.env');
} catch {
  /* keine .env — Env kommt aus der Umgebung */
}

const [email, passwort, name] = process.argv.slice(2);
if (!email || !passwort) {
  console.error('Aufruf: node scripts/bootstrap-admin.mjs <email> <passwort> ["Name"]');
  process.exit(1);
}
if (passwort.length < 8) {
  console.error('Passwort muss mindestens 8 Zeichen haben.');
  process.exit(1);
}

const fehlend = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'].filter((k) => !process.env[k]);
if (fehlend.length) {
  console.error(`[bootstrap] Fehlende Umgebungsvariablen: ${fehlend.join(', ')} — Abbruch.`);
  process.exit(1);
}

const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const emailNorm = email.trim().toLowerCase();

try {
  const vorhanden = await pool.query('SELECT id FROM "user" WHERE email = $1', [emailNorm]);

  if (vorhanden.rows.length > 0) {
    await pool.query(
      `UPDATE "user" SET role = 'platform-admin', banned = false, ban_reason = NULL,
         ban_expires = NULL, updated_at = now() WHERE email = $1`,
      [emailNorm],
    );
    console.log(`✓ Bestehender Nutzer ${emailNorm} auf platform-admin gehoben.`);
  } else {
    const userId = randomUUID();
    await pool.query(
      `INSERT INTO "user" (id, name, email, email_verified, role, banned)
       VALUES ($1, $2, $3, true, 'platform-admin', false)`,
      [userId, name?.trim() || emailNorm, emailNorm],
    );
    const hash = await hashPassword(passwort);
    await pool.query(
      `INSERT INTO account (id, account_id, provider_id, user_id, password)
       VALUES ($1, $2, 'credential', $3, $4)`,
      [randomUUID(), userId, userId, hash],
    );
    console.log(`✓ platform-admin angelegt: ${emailNorm}`);
  }
} catch (err) {
  console.error('✗ Bootstrap fehlgeschlagen:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await pool.end();
}

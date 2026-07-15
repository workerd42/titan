/**
 * Better-Auth-Server-Config (Email/Passwort, Drizzle-Adapter, Postgres).
 *
 * Wird NUR aus on-demand-Kontexten geladen (API-Route `/api/auth/[...all]`
 * und die Middleware via dynamischem Import) — nie zur Build-/Prerender-Zeit,
 * damit kein DB-/Secret-Zugriff beim statischen Bauen passiert.
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from 'astro:env/server';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  ...(BETTER_AUTH_URL ? { baseURL: BETTER_AUTH_URL } : {}),
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Fürs Fundament ohne Mail-Versand: keine erzwungene Verifizierung.
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 Tage
    updateAge: 60 * 60 * 24,      // täglich verlängern
  },
});

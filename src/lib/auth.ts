/**
 * Better-Auth-Server-Config (Email/Passwort, Drizzle-Adapter, Postgres).
 *
 * Wird NUR aus on-demand-Kontexten geladen (API-Route `/api/auth/[...all]`
 * und die Middleware via dynamischem Import) — nie zur Build-/Prerender-Zeit,
 * damit kein DB-/Secret-Zugriff beim statischen Bauen passiert.
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, organization } from 'better-auth/plugins';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from 'astro:env/server';
import { db } from './db';
import * as schema from './db/schema';
import { ac, roles } from './rollen-ac';

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
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Fürs Fundament ohne Mail-Versand: keine erzwungene Verifizierung.
    requireEmailVerification: false,
    // Invite-only: keine öffentliche Selbst-Registrierung. Accounts werden
    // ausschließlich im Admin-Panel angelegt (admin.createUser umgeht diese
    // Sperre). Die Marketing-/Paywall-Registrierung folgt als spätere Schicht.
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 Tage
    updateAge: 60 * 60 * 24,      // täglich verlängern
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: 'lerner',
      adminRoles: ['platform-admin'],
    }),
    // B2B-Struktur: Bildungsträger als Organisationen. Nur die Zuordnung
    // (Nutzer ↔ Organisation) — das Gating bleibt an der globalen user.role.
    // Orgs legt ausschließlich der platform-admin an; der Einladungs-/Mail-Flow
    // (sendInvitationEmail) folgt später mit Brevo. Zuordnung erfolgt vorerst
    // serverseitig manuell (siehe /api/org-member).
    organization({
      allowUserToCreateOrganization: false,
    }),
  ],
});

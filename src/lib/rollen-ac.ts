/**
 * Access-Control für die Titan-Rollen (Better-Auth Admin-Plugin).
 *
 * Das Admin-Plugin verlangt, dass jede in `adminRoles` genannte Rolle hier als
 * Access-Control-Rolle definiert ist. `ac` + `roles` werden identisch in
 * auth.ts (Server) UND auth-client.ts (Browser) übergeben, damit Server- und
 * Client-Permission-Checks übereinstimmen.
 *
 * Nur `platform-admin` erhält die Admin-Statements (Nutzerverwaltung). Die
 * übrigen Rollen bekommen bewusst keinerlei Admin-Panel-Rechte — ihre
 * spezifischen Rechte (Org-Cockpit, Dozenten-Sicht) folgen mit dem jeweiligen
 * Feature. Bewusst ohne DB-Import (auch aus dem Client-Bundle ladbar).
 */
import { createAccessControl } from 'better-auth/plugins/access';

// Statements = die von Better Auth vergebenen Admin-Berechtigungen.
const statement = {
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'set-email', 'get', 'update'],
  session: ['list', 'revoke', 'delete'],
} as const;

export const ac = createAccessControl(statement);

// platform-admin: voller Nutzerverwaltungs-Zugriff.
const platformAdmin = ac.newRole({
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'set-email', 'get', 'update'],
  session: ['list', 'revoke', 'delete'],
});

// Alle anderen Rollen: kein Admin-Panel-Zugriff.
const leer = { user: [], session: [] } as const;
const orgAdmin = ac.newRole({ ...leer });
const dozent = ac.newRole({ ...leer });
const lerner = ac.newRole({ ...leer });

export const roles = {
  'platform-admin': platformAdmin,
  'org-admin': orgAdmin,
  'dozent': dozent,
  'lerner': lerner,
};

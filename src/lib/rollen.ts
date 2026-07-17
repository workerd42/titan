/**
 * Rollen im Titan-System (im Admin-Panel änderbar). Bewusst ohne DB-/Auth-
 * Import, damit es auch aus statisch/prerenderten Kontexten geladen werden darf.
 *
 * - platform-admin: Betreiber, voller Zugriff (einziger mit Admin-Panel-Zugriff)
 * - org-admin:      verwaltet die Lerner seiner Organisation (Rechte folgen mit
 *                   dem Org-Plugin/Cockpit)
 * - dozent:         sieht Fortschritt zugeordneter Lerner (Cockpit, folgt)
 * - lerner:         Standard für neue Registrierungen
 */
export const ROLLEN = ['platform-admin', 'org-admin', 'dozent', 'lerner'] as const;
export type Rolle = (typeof ROLLEN)[number];

export const ROLLEN_LABEL: Record<string, string> = {
  'platform-admin': 'Plattform-Admin',
  'org-admin': 'Org-Admin',
  'dozent': 'Dozent',
  'lerner': 'Lerner',
};

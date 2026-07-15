/**
 * Better-Auth-Catch-all-Handler. Bedient /api/auth/* (Registrierung, Login,
 * Session, Logout). On-demand (prerender = false) — wird nur zur Laufzeit
 * ausgewertet, nie beim statischen Build.
 */
import type { APIRoute } from 'astro';
import { auth } from '../../../lib/auth';

export const prerender = false;

export const ALL: APIRoute = ({ request }) => auth.handler(request);

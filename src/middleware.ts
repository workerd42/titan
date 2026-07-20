/**
 * Middleware — Session-Kontext + Zugangs-Gate (Login-Vorhang).
 *
 * Zwei Aufgaben:
 * 1. Befüllt Astro.locals.user / .session für on-demand-Routen.
 * 2. Gate: Nicht angemeldete Zugriffe auf geschützte Seiten werden auf /konto
 *    umgeleitet. Öffentlich sind nur /konto und die Auth-API. So sind alle
 *    Lerninhalte serverseitig geschützt (löst die grobe nginx-Basic-Auth ab).
 *
 * Wichtig: Prerenderte Seiten laufen zur Laufzeit NICHT durch die Middleware —
 * deshalb sind alle zu schützenden Seiten on-demand (prerender = false). Der
 * dynamische Import von `./lib/auth` stellt sicher, dass DB/Secret-Zugriff nur
 * zur Laufzeit passiert, nie beim statischen Bauen.
 */
import { defineMiddleware } from 'astro:middleware';

// Öffentlich erreichbar ohne Login (Präfix-Vergleich, base ist '/').
const OEFFENTLICHE_PFADE = ['/konto', '/api/auth'];

function istOeffentlich(pfad: string): boolean {
  return OEFFENTLICHE_PFADE.some((p) => pfad === p || pfad.startsWith(p + '/') || pfad.startsWith(p));
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerenderte Seiten: kein Auth/DB-Zugriff (Build-Zeit-Schutz). Diese Seiten
  // sind bewusst öffentlich (z. B. 404) — geschützte Seiten sind on-demand.
  if (context.isPrerendered) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  try {
    const { auth } = await import('./lib/auth');
    const result = await auth.api.getSession({ headers: context.request.headers });
    context.locals.user = result?.user ?? null;
    context.locals.session = result?.session ?? null;
  } catch {
    context.locals.user = null;
    context.locals.session = null;
  }

  // Gate: nicht eingeloggt + geschützte Seite → auf /konto umleiten.
  // API-Routen leiten NICHT um (sie erzwingen ihre eigene 401/403), sonst
  // bekämen fetch-Aufrufe eine HTML-Weiterleitung statt einer JSON-Antwort.
  const pfad = context.url.pathname;
  const istApi = pfad.startsWith('/api/');
  if (!context.locals.user && !istApi && !istOeffentlich(pfad)) {
    return context.redirect('/konto/');
  }

  return next();
});

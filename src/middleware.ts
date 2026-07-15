/**
 * Middleware — befüllt Astro.locals.user / .session für on-demand-Routen.
 *
 * Wichtig: Bei prerenderten Seiten (statischer Build) NICHTS tun — sonst
 * würde beim Bauen Auth/DB geladen. Der dynamische Import von `./lib/auth`
 * innerhalb des Nicht-Prerender-Zweigs stellt sicher, dass DB/Secret-Zugriff
 * ausschließlich zur Laufzeit passiert.
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
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

  return next();
});

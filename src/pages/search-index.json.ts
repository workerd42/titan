import type { APIRoute } from 'astro';
import { getSearchIndex } from '../lib/content';

/**
 * Einmaliger, geteilter Suchindex als statische JSON-Datei — wird von
 * SearchOverlay.astro erst beim ersten Öffnen der Suche nachgeladen
 * (nicht mehr pro Seite inline eingebettet, siehe Commit-History: das
 * hätte sonst den Volltext aller 46 Themen auf jeder einzelnen Seite
 * dupliziert).
 */
export const GET: APIRoute = async () => {
  const base = import.meta.env.BASE_URL;
  const index = await getSearchIndex(base);
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};

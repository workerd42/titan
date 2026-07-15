/**
 * /api/progress — Fortschritt + Kompass-Profil des eingeloggten Nutzers.
 *
 * GET  → { progress, kompass } des Accounts (oder null-Werte).
 * PUT  → nimmt den lokalen Stand entgegen, merged ihn serverseitig
 *        autoritativ mit dem gespeicherten Stand (Union-Regel, siehe
 *        lib/progress-merge.ts), speichert und gibt den gemergten Stand
 *        zurück. Der Client schreibt das Ergebnis zurück in localStorage.
 *
 * Ohne gültige Session: 401. Die Session wird serverseitig geprüft
 * (Astro.locals aus der Middleware) — nie dem Client geglaubt.
 */
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../lib/db';
import { userProgress, kompassProfile } from '../../lib/db/schema';
import { mergeProgress, mergeKompass } from '../../lib/progress-merge';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const [progressRow] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, user.id));
  const [kompassRow] = await db
    .select()
    .from(kompassProfile)
    .where(eq(kompassProfile.userId, user.id));

  return json({
    progress: progressRow?.data ?? null,
    kompass: kompassRow?.data ?? null,
  });
};

export const PUT: APIRoute = async ({ locals, request }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  let body: { progress?: unknown; kompass?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const [progressRow] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, user.id));
  const [kompassRow] = await db
    .select()
    .from(kompassProfile)
    .where(eq(kompassProfile.userId, user.id));

  // Server merged autoritativ — der Client kann keinen Fortschritt löschen.
  const mergedProgress = mergeProgress(
    (body.progress as any) ?? null,
    (progressRow?.data as any) ?? null,
  );
  mergedProgress.userId = user.id;

  const mergedKompass = mergeKompass(
    (body.kompass as any) ?? null,
    (kompassRow?.data as any) ?? null,
  );

  const now = new Date();

  await db
    .insert(userProgress)
    .values({ userId: user.id, data: mergedProgress, updatedAt: now })
    .onConflictDoUpdate({
      target: userProgress.userId,
      set: { data: mergedProgress, updatedAt: now },
    });

  if (mergedKompass) {
    await db
      .insert(kompassProfile)
      .values({ userId: user.id, data: mergedKompass, updatedAt: now })
      .onConflictDoUpdate({
        target: kompassProfile.userId,
        set: { data: mergedKompass, updatedAt: now },
      });
  }

  return json({ progress: mergedProgress, kompass: mergedKompass });
};

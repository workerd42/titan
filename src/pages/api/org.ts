/**
 * /api/org — Organisations- & Mitglieder-Verwaltung (nur platform-admin).
 *
 * Erstes Inkrement bewusst OHNE E-Mail/Einladungs-Flow: der platform-admin legt
 * Organisationen an und ordnet bestehende Nutzer direkt zu. Mitgliedschaft wird
 * serverseitig in die `member`-Tabelle geschrieben (der Brevo-Einladungs-Flow
 * des Organization-Plugins folgt später).
 *
 * Sicherheit: Session UND Rolle werden serverseitig aus Astro.locals geprüft
 * (Middleware) — nie Client-Angaben vertrauen. Ohne platform-admin: 403.
 *
 * GET  → { organizations: [{ id, name, slug, members: [{ userId, name, email, role }] }] }
 * POST → { action: 'create-org' | 'add-member' | 'remove-member', ... }
 */
import type { APIRoute } from 'astro';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../../lib/db';
import { organization, member, user as userTable } from '../../lib/db/schema';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function istAdmin(locals: App.Locals): boolean {
  return (locals.user as { role?: string } | null)?.role === 'platform-admin';
}

function slugify(name: string): string {
  const basis = name
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'org';
  return `${basis}-${Math.random().toString(36).slice(2, 6)}`;
}

export const GET: APIRoute = async ({ locals }) => {
  if (!istAdmin(locals)) return json({ error: 'forbidden' }, 403);

  const orgs = await db
    .select({ id: organization.id, name: organization.name, slug: organization.slug })
    .from(organization);

  const orgIds = orgs.map((o) => o.id);
  const members = orgIds.length
    ? await db
        .select({
          orgId: member.organizationId,
          userId: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
        })
        .from(member)
        .innerJoin(userTable, eq(member.userId, userTable.id))
        .where(inArray(member.organizationId, orgIds))
    : [];

  return json({
    organizations: orgs
      .map((o) => ({
        ...o,
        members: members
          .filter((m) => m.orgId === o.id)
          .sort((a, b) => a.name.localeCompare(b.name, 'de')),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'de')),
  });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!istAdmin(locals)) return json({ error: 'forbidden' }, 403);

  let body: { action?: string; name?: string; organizationId?: string; userId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  switch (body.action) {
    case 'create-org': {
      const name = body.name?.trim();
      if (!name) return json({ error: 'name fehlt' }, 400);
      const row = { id: crypto.randomUUID(), name, slug: slugify(name), createdAt: new Date() };
      await db.insert(organization).values(row);
      return json({ organization: { id: row.id, name: row.name, slug: row.slug, members: [] } });
    }

    case 'add-member': {
      const { organizationId, userId } = body;
      if (!organizationId || !userId) return json({ error: 'organizationId/userId fehlt' }, 400);

      // Existenz prüfen (klarer Fehler statt FK-Verletzung).
      const [org] = await db.select({ id: organization.id }).from(organization).where(eq(organization.id, organizationId));
      const [u] = await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.id, userId));
      if (!org || !u) return json({ error: 'organisation oder nutzer nicht gefunden' }, 404);

      // Doppelte Mitgliedschaft vermeiden (idempotent).
      const [vorhanden] = await db
        .select({ id: member.id })
        .from(member)
        .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)));
      if (vorhanden) return json({ ok: true, already: true });

      await db.insert(member).values({
        id: crypto.randomUUID(),
        organizationId,
        userId,
        role: 'member',
        createdAt: new Date(),
      });
      return json({ ok: true });
    }

    case 'remove-member': {
      const { organizationId, userId } = body;
      if (!organizationId || !userId) return json({ error: 'organizationId/userId fehlt' }, 400);
      await db.delete(member).where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)));
      return json({ ok: true });
    }

    default:
      return json({ error: 'unbekannte action' }, 400);
  }
};

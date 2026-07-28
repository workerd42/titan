/**
 * Vollmigration: ALLE Markdown-Themen (src/content/themen) → Directus.
 *
 * Idempotent: löscht bestehende `themen`-Items und legt alle 46 frisch an
 * (fachwirt='marketing', status='published'). Fallbeispiel/Prüfungsfrage werden
 * in die flachen Felder (fall_ und pruef_) übersetzt; verschachtelte Arrays als JSON.
 *
 * Lauf:  node directus/migrate-all.mjs
 * Voraussetzung: lokale Directus-Instanz läuft (docker-compose.directus.yml),
 * Schema arbeitsreif inkl. `fachwirt`-Feld (siehe directus-setup.md).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const BASE = process.env.DIRECTUS_URL || 'http://localhost:8055';
const ROOT = 'src/content/themen';

const tok = (await (await fetch(BASE + '/auth/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@titan.dev', password: 'directus-dev-admin' }),
})).json()).data.access_token;
const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
async function api(method, path, body) {
  const r = await fetch(BASE + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status}: ${t.slice(0, 400)}`);
  return t ? JSON.parse(t) : null;
}

// ── alle .md-Themen einlesen ───────────────────────────────
function alleThemen() {
  const out = [];
  for (const dir of readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const file of readdirSync(join(ROOT, dir.name)).filter((f) => f.endsWith('.md'))) {
      const raw = readFileSync(join(ROOT, dir.name, file), 'utf8');
      const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (!m) { console.warn('  ⚠ keine Frontmatter:', file); continue; }
      const fm = yaml.load(m[1]);
      const body = (m[2] || '').trim();
      out.push({ slug: file.replace(/\.md$/, ''), fm, body });
    }
  }
  return out;
}

const themen = alleThemen();
console.log(`Gefunden: ${themen.length} Themen.`);

// ── bestehende Items löschen (sauberer Neustart) ───────────
const bestehende = (await api('GET', '/items/themen?fields=id&limit=-1')).data;
if (bestehende.length) {
  await api('DELETE', '/items/themen', bestehende.map((x) => x.id));
  console.log(`Gelöscht: ${bestehende.length} bestehende Items.`);
}

// ── alle neu anlegen ───────────────────────────────────────
let ok = 0;
for (const { slug, fm, body } of themen) {
  const fb = fm.fallbeispiel || {};
  const pf = fm.pruefungsfrage || {};
  const payload = {
    status: 'published',
    slug,
    fachwirt: 'marketing',
    title: fm.title,
    handlungsbereich: fm.handlungsbereich,
    themengruppe: fm.themengruppe,
    order: fm.order,
    description: fm.description,
    body: body || null,
    merksatz: fm.merksatz ?? null,
    definitionen: fm.definitionen ?? null,
    formeln: fm.formeln ?? null,
    rechenbeispiel: fm.rechenbeispiel ?? null,
    zusammenfassung: fm.zusammenfassung ?? null,
    gesetze: fm.gesetze ?? null,
    werkzeug: fm.werkzeug ?? null,
    begriffe: fm.begriffe ?? null,
    fall_situation: fb.situation ?? null,
    fall_aufgabe: fb.aufgabe ?? null,
    fall_musterloesung: fb.musterloesung ?? null,
    pruef_frage: pf.frage ?? null,
    pruef_loesungsweg: pf.loesungsweg ?? [],
    wiederholungTage: fm.wiederholungTage ?? 4,
  };
  try {
    await api('POST', '/items/themen', payload);
    ok++;
  } catch (e) {
    console.error('  ✗', slug, '→', e.message);
  }
}
console.log(`\n✔ Angelegt: ${ok}/${themen.length}`);

// ── Kontrolle ──────────────────────────────────────────────
const nachHb = {};
(await api('GET', '/items/themen?fields=handlungsbereich&limit=-1')).data
  .forEach((t) => { nachHb[t.handlungsbereich] = (nachHb[t.handlungsbereich] || 0) + 1; });
console.log('Verteilung nach Handlungsbereich:', JSON.stringify(nachHb));

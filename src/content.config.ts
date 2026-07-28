import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─────────────────────────────────────────────────────────────
// GETEILTES SCHEMA — gilt für Markdown-Themen (`themen`) UND für
// die aus Directus gezogenen Themen (`themenCms`). Eine Quelle für
// beide Loader → kein Schema-Drift.
// ─────────────────────────────────────────────────────────────
const themenSchema = z.object({
  // ── IDENTITÄT ─────────────────────────────────────────
  title: z.string(),
  handlungsbereich: z.enum(['hb1', 'hb2', 'hb3', 'hb4']),
  themengruppe: z.string(),
  order: z.number(),
  description: z.string(),

  // Haupterklärung („Verstehen"-Prosa). Bei Markdown-Themen steckt der Text im
  // Datei-Body (via render()); bei Directus-Themen kommt er als Markdown-String
  // aus diesem Feld. Darum optional — je nach Quelle ist eins der beiden gesetzt.
  body: z.string().optional(),

  // ── WISSENSBIBLIOTHEK (Phase 1: Verstehen) ─────────────
  definitionen: z.array(z.object({
    begriff: z.string(),
    definition: z.string(),
  })).optional(),

  formeln: z.array(z.object({
    name: z.string(),
    formel: z.string(),
    erklaerung: z.string(),
    einheit: z.string().optional(),
  })).optional(),

  rechenbeispiel: z.object({
    aufgabe: z.string(),
    schritte: z.array(z.object({
      schritt: z.number(),
      beschreibung: z.string(),
      berechnung: z.string().optional(),
      ergebnis: z.string().optional(),
    })),
    fazit: z.string().optional(),
  }).optional(),

  zusammenfassung: z.array(z.string()).optional(),

  // Rechtsgrundlagen (optional): eigene Erklärung + Anwendung + amtliche
  // Quelle. KEINE verbatim Gesetzestexte. Siehe docs/content-richtlinien.md.
  gesetze: z.array(z.object({
    norm: z.string(),
    titel: z.string(),
    erklaerung: z.string(),
    anwendung: z.string(),
    quelle: z.string().url(),
  })).optional(),

  // Interaktives Werkzeug (optional)
  werkzeug: z.enum([
    'swot', 'smart', 'deckungsbeitrag', 'marktanteil',
    'preisberechnung', 'vier-stufen', 'scoring',
  ]).optional(),

  // ── MERKEN ────────────────────────────────────────────
  merksatz: z.string(),

  begriffe: z.array(z.object({
    begriff: z.string(),
    aufloesung: z.string().optional(),
    erklaerung: z.string(),
  })).optional(),

  // ── ANWENDEN ──────────────────────────────────────────
  fallbeispiel: z.object({
    situation: z.string(),
    aufgabe: z.string(),
    musterloesung: z.string(),
  }),

  // ── PRÜFEN ────────────────────────────────────────────
  pruefungsfrage: z.object({
    frage: z.string(),
    loesungsweg: z.array(z.string()),
  }),

  // ── WIEDERHOLUNG ──────────────────────────────────────
  wiederholungTage: z.number().default(4),
});

// ─────────────────────────────────────────────────────────────
// QUELLE 1 (bestehend, unverändert): Markdown unter src/content/themen.
// ─────────────────────────────────────────────────────────────
const themen = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/themen',
    generateId: ({ entry }) => entry.replace(/^.*\//, '').replace(/\.md$/, ''),
  }),
  schema: themenSchema,
});

// ─────────────────────────────────────────────────────────────
// QUELLE 2 (neu): Redaktionssystem Directus, Build-time Pull.
// Zieht NUR status=published, validiert gegen dasselbe Schema.
// Graceful: kein Token / Directus offline → leere Collection
// (die Markdown-Themen bleiben davon unberührt — reversibel).
// PROD: DIRECTUS_URL + DIRECTUS_TOKEN als Env setzen (scoped Read-Token).
// LOKAL: Fallback auf die lokale Dev-Instanz + Dev-Token.
// ─────────────────────────────────────────────────────────────
const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const DIRECTUS_TOKEN =
  process.env.DIRECTUS_TOKEN ??
  (DIRECTUS_URL.includes('localhost') ? 'titan-directus-dev-token' : undefined);

async function directusThemenLoader() {
  if (!DIRECTUS_TOKEN) {
    console.warn('[themenCms] Kein DIRECTUS_TOKEN — Directus-Pull übersprungen.');
    return [];
  }
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/themen?filter[status][_eq]=published&limit=-1`,
      { headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` } },
    );
    if (!res.ok) {
      console.warn(`[themenCms] Directus antwortete ${res.status} — Pull übersprungen.`);
      return [];
    }
    const { data } = await res.json();
    return (data ?? []).map((t: Record<string, unknown>) => ({
      id: t.slug as string,
      title: t.title,
      handlungsbereich: t.handlungsbereich,
      themengruppe: t.themengruppe,
      order: t.order,
      description: t.description,
      body: t.body ?? undefined,
      definitionen: t.definitionen ?? undefined,
      formeln: t.formeln ?? undefined,
      rechenbeispiel: t.rechenbeispiel ?? undefined,
      zusammenfassung: t.zusammenfassung ?? undefined,
      gesetze: t.gesetze ?? undefined,
      werkzeug: t.werkzeug ?? undefined,
      merksatz: t.merksatz,
      begriffe: t.begriffe ?? undefined,
      // Fallbeispiel/Prüfungsfrage liegen in Directus als flache Einzelfelder
      // (autoren-freundlich) → hier zurück in die vom Zod-Schema erwartete
      // verschachtelte Form bringen.
      fallbeispiel: {
        situation: t.fall_situation,
        aufgabe: t.fall_aufgabe,
        musterloesung: t.fall_musterloesung,
      },
      pruefungsfrage: {
        frage: t.pruef_frage,
        loesungsweg: t.pruef_loesungsweg ?? [],
      },
      wiederholungTage: t.wiederholungTage ?? 4,
    }));
  } catch (e) {
    console.warn('[themenCms] Directus nicht erreichbar — Pull übersprungen:', (e as Error).message);
    return [];
  }
}

const themenCms = defineCollection({
  loader: directusThemenLoader,
  schema: themenSchema,
});

export const collections = { themen, themenCms };

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const themen = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/themen',
    generateId: ({ entry }) => entry.replace(/^.*\//, '').replace(/\.md$/, ''),
  }),
  schema: z.object({
    // ── IDENTITÄT ─────────────────────────────────────────
    title: z.string(),
    handlungsbereich: z.enum(['hb1', 'hb2', 'hb3', 'hb4']),
    themengruppe: z.string(),
    order: z.number(),
    description: z.string(),

    // ── WISSENSBIBLIOTHEK (Phase 1: Verstehen) ─────────────
    // Der Markdown-Body ist die Haupterklärung.
    // Optionale strukturierte Zusatzinhalte:
    definitionen: z.array(z.object({
      begriff: z.string(),
      definition: z.string(),
    })).optional(),

    formeln: z.array(z.object({
      name: z.string(),
      formel: z.string(),         // z. B. "DB = Umsatz − variable Kosten"
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

    // Interaktives Werkzeug (optional)
    werkzeug: z.enum([
      'swot', 'smart', 'deckungsbeitrag', 'marktanteil',
      'preisberechnung', 'vier-stufen', 'scoring'
    ]).optional(),

    // ── MERKEN ────────────────────────────────────────────
    merksatz: z.string(),

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
  }),
});

export const collections = { themen };

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

    // Rechtsgrundlagen (optional): Gesetzes-/Paragraphen-Bezüge didaktisch
    // aufbereitet — eigene Erklärung + Anwendungsbeispiel + Link zur amtlichen
    // Quelle. BEWUSST KEINE verbatim Gesetzestexte (didaktischer Mehrwert +
    // rechtlich robust; amtliche Fassung wird nur verlinkt). Siehe
    // docs/content-richtlinien.md.
    gesetze: z.array(z.object({
      norm: z.string(),          // z. B. "§ 5 ArbSchG"
      titel: z.string(),         // Kurztitel, z. B. "Gefährdungsbeurteilung"
      erklaerung: z.string(),    // eigene Erklärung (kein Gesetzeszitat)
      anwendung: z.string(),     // Anwendungsbeispiel im Prüfungskontext
      quelle: z.string().url(),  // Deep-Link zur amtlichen Fassung (gesetze-im-internet.de)
    })).optional(),

    // Interaktives Werkzeug (optional)
    werkzeug: z.enum([
      'swot', 'smart', 'deckungsbeitrag', 'marktanteil',
      'preisberechnung', 'vier-stufen', 'scoring'
    ]).optional(),

    // ── MERKEN ────────────────────────────────────────────
    merksatz: z.string(),

    // Lernzettel / Karteikarten (optional): Schlüsselbegriffe des Kapitels.
    // Vorne der Begriff, hinten Auflösung (ausgeschrieben) + kurze Erklärung.
    begriffe: z.array(z.object({
      begriff: z.string(),                 // z. B. "ROI"
      aufloesung: z.string().optional(),   // z. B. "Return on Investment"
      erklaerung: z.string(),              // kurze eigene Definition
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
  }),
});

export const collections = { themen };

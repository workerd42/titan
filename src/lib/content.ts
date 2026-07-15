/**
 * Gemeinsame Content-Collection-Helfer — konsolidiert das zuvor in
 * SpaceLayout.astro und PlanetLayout.astro duplizierte
 * `getCollection('themen')`-Pattern und liefert zusätzlich den
 * Build-Time-Suchindex für SearchOverlay.astro.
 */
import { getCollection } from 'astro:content';
import { BEREICHE } from '../data/bereiche';
import { UNIVERSEN } from '../data/universen';

/** Themen-Slugs pro Handlungsfeld — für die Fortschrittsanzeige in PersoenlichPanel. */
export async function getThemenSlugsByHb(): Promise<Record<string, string[]>> {
  const alleThemen = await getCollection('themen');
  const result: Record<string, string[]> = {};
  BEREICHE.forEach((b) => {
    result[b.id] = alleThemen
      .filter((t) => t.data.handlungsbereich === b.id)
      .map((t) => t.id);
  });
  return result;
}

export type SearchLevel = 'universum' | 'handlungsfeld' | 'thema';

export interface SearchIndexEntry {
  level: SearchLevel;
  title: string;
  subtitle: string;
  url: string;
  /** Zusätzlicher, nicht angezeigter Volltext (Merksatz, Fallbeispiel, Prüfungsfrage, …) für die Suche. */
  body?: string;
}

/**
 * Baut den durchsuchbaren Volltext eines Themas: strukturierte Frontmatter-
 * Felder PLUS der rohe Markdown-Body (Wissensbibliothek/"Verstehen"-Text) —
 * ohne Letzteren blieben Begriffe unauffindbar, die nur im Fließtext stehen
 * (z. B. "SWOT" als Beispiel in einem Aufzählungspunkt).
 */
function themaBody(
  data: {
    merksatz: string;
    zusammenfassung?: string[];
    fallbeispiel: { situation: string; aufgabe: string; musterloesung: string };
    pruefungsfrage: { frage: string };
    definitionen?: { begriff: string; definition: string }[];
    werkzeug?: string;
  },
  rawMarkdownBody?: string,
): string {
  return [
    data.merksatz,
    ...(data.zusammenfassung ?? []),
    data.fallbeispiel.situation,
    data.fallbeispiel.aufgabe,
    data.fallbeispiel.musterloesung,
    data.pruefungsfrage.frage,
    data.werkzeug,
    ...(data.definitionen ?? []).flatMap((d) => [d.begriff, d.definition]),
    rawMarkdownBody,
  ].filter(Boolean).join(' ');
}

/** Build-Time-Suchindex über alle drei Hierarchieebenen (Universum → Handlungsfeld → Thema). */
export async function getSearchIndex(base: string): Promise<SearchIndexEntry[]> {
  const alleThemen = await getCollection('themen');
  const entries: SearchIndexEntry[] = [];

  UNIVERSEN.forEach((u) => {
    entries.push({ level: 'universum', title: u.titel, subtitle: u.eyebrow, url: `${base}${u.id}/` });
  });

  BEREICHE.forEach((b) => {
    const universum = UNIVERSEN.find((u) => u.id === b.universumId);
    if (!universum) return;
    entries.push({
      level: 'handlungsfeld',
      title: b.titel,
      subtitle: `Handlungsfeld ${b.nummer}`,
      url: `${base}${universum.id}/${b.id}/`,
    });
  });

  alleThemen.forEach((t) => {
    const bereich = BEREICHE.find((b) => b.id === t.data.handlungsbereich);
    if (!bereich) return;
    const universum = UNIVERSEN.find((u) => u.id === bereich.universumId);
    if (!universum) return;
    entries.push({
      level: 'thema',
      title: t.data.title,
      subtitle: t.data.themengruppe,
      url: `${base}${universum.id}/${bereich.id}/${t.id}/`,
      body: themaBody(t.data, t.body),
    });
  });

  return entries;
}

/**
 * Merge-Logik für den Local-First-Sync (Phase 2 Fundament).
 *
 * Grundregel: NICHTS geht verloren. Ein bereits erreichter Lernstand darf
 * durch das Zusammenführen zweier Geräte nie zurückfallen ("Union"):
 * eine Phase gilt als erledigt, wenn sie lokal ODER auf dem Server erledigt
 * ist. Deshalb kein simples "last write wins".
 *
 * Reine Funktionen ohne DOM/DB — dadurch auf Server UND Client nutzbar und
 * isoliert testbar.
 */

export type Pruefen = 'geloest' | 'wiederholen' | null | undefined;

export interface ThemaState {
  verstehen?: boolean;
  merken?: boolean;
  anwenden?: boolean;
  pruefen?: Pruefen;
  eigeneEinschaetzung?: string;
  wiederholungFaelligAm?: number | null;
}

export interface NoriveProgress {
  version: 2;
  userId: null | string;
  unlockedHB: string[];
  themen: Record<string, ThemaState>;
  lastLernDatum: string | null;
  lernStreakTage: number;
  totalScore: number;
}

export const DEFAULT_PROGRESS: NoriveProgress = {
  version: 2,
  userId: null,
  unlockedHB: ['hb1', 'hb2', 'hb3', 'hb4'],
  themen: {},
  lastLernDatum: null,
  lernStreakTage: 0,
  totalScore: 0,
};

/** 'geloest' schlägt 'wiederholen' schlägt "nichts" — höherer Rang gewinnt. */
function pruefenRank(p: Pruefen): number {
  if (p === 'geloest') return 2;
  if (p === 'wiederholen') return 1;
  return 0;
}

function mergeThema(a: ThemaState = {}, b: ThemaState = {}): ThemaState {
  const merged: ThemaState = {
    verstehen: Boolean(a.verstehen || b.verstehen),
    merken: Boolean(a.merken || b.merken),
    anwenden: Boolean(a.anwenden || b.anwenden),
    pruefen: pruefenRank(a.pruefen) >= pruefenRank(b.pruefen) ? a.pruefen : b.pruefen,
  };

  // Freitext: den nicht-leeren nehmen; bei zwei Texten gewinnt a (der lokal
  // zuletzt bearbeitete Stand, der gerade gepusht wird).
  const einschaetzung = (a.eigeneEinschaetzung?.trim() ? a.eigeneEinschaetzung : undefined)
    ?? (b.eigeneEinschaetzung?.trim() ? b.eigeneEinschaetzung : undefined);
  if (einschaetzung !== undefined) merged.eigeneEinschaetzung = einschaetzung;

  // Späteres Fälligkeitsdatum gewinnt = der zuletzt gelöste Durchgang.
  const faellig = [a.wiederholungFaelligAm, b.wiederholungFaelligAm]
    .filter((v): v is number => typeof v === 'number');
  if (faellig.length) merged.wiederholungFaelligAm = Math.max(...faellig);

  return merged;
}

/**
 * Führt zwei Fortschritts-Stände zusammen.
 * @param local  Der Stand, der gerade gepusht wird (Gerät des Nutzers).
 * @param remote Der bereits gespeicherte Server-Stand.
 */
export function mergeProgress(
  local: Partial<NoriveProgress> | null,
  remote: Partial<NoriveProgress> | null,
): NoriveProgress {
  const a = { ...DEFAULT_PROGRESS, ...(local ?? {}) };
  const b = { ...DEFAULT_PROGRESS, ...(remote ?? {}) };

  const slugs = new Set([...Object.keys(a.themen ?? {}), ...Object.keys(b.themen ?? {})]);
  const themen: Record<string, ThemaState> = {};
  for (const slug of slugs) {
    themen[slug] = mergeThema(a.themen?.[slug], b.themen?.[slug]);
  }

  // ISO-Datum (YYYY-MM-DD) ist lexikografisch vergleichbar.
  const lastLernDatum = [a.lastLernDatum, b.lastLernDatum]
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
    .sort()
    .pop() ?? null;

  return {
    version: 2,
    userId: a.userId ?? b.userId ?? null,
    unlockedHB: Array.from(new Set([...(a.unlockedHB ?? []), ...(b.unlockedHB ?? [])])),
    themen,
    lastLernDatum,
    lernStreakTage: Math.max(a.lernStreakTage ?? 0, b.lernStreakTage ?? 0),
    totalScore: Math.max(a.totalScore ?? 0, b.totalScore ?? 0),
  };
}

/**
 * Kompass-Unternehmen: kein Feld-Merge (die Felder gehören inhaltlich
 * zusammen), sondern der zuletzt erstellte/bearbeitete Datensatz gewinnt.
 */
export function mergeKompass<T extends { erstellt?: string; name?: string }>(
  local: T | null,
  remote: T | null,
): T | null {
  const localValid = local?.name?.trim() ? local : null;
  const remoteValid = remote?.name?.trim() ? remote : null;
  if (!localValid) return remoteValid;
  if (!remoteValid) return localValid;
  const lt = localValid.erstellt ?? '';
  const rt = remoteValid.erstellt ?? '';
  return rt > lt ? remoteValid : localValid;
}

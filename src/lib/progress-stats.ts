/**
 * Fortschritts-Kennzahlen fürs Dozenten-Cockpit (Phase 2.4).
 *
 * Reine Funktionen ohne DB/DOM — sie leiten aus dem gespeicherten
 * `user_progress.data`-Blob (Struktur `NoriveProgress`) die Dashboard-Werte ab.
 * Bewusst on-the-fly berechnet (keine Summary-Tabelle): bei realistischen
 * Kohorten völlig ausreichend und ohne Write-Path-Kopplung, damit reversibel.
 */
import type { NoriveProgress, ThemaState } from './progress-merge';

/** Anzahl erledigter Phasen eines Themas (0–4). */
export function erledigtePhasen(t: ThemaState = {}): number {
  return (
    (t.verstehen ? 1 : 0) +
    (t.merken ? 1 : 0) +
    (t.anwenden ? 1 : 0) +
    (t.pruefen === 'geloest' ? 1 : 0)
  );
}

/**
 * Gesamtfortschritt in Prozent (0–100), gerundet.
 * Nenner = alle verfügbaren Themen × 4 Phasen (Verstehen/Merken/Anwenden/Prüfen).
 * Themen ohne Fortschritt zählen als 0. `themenGesamt <= 0` → 0 %.
 */
export function gesamtProzent(
  progress: Partial<NoriveProgress> | null | undefined,
  themenGesamt: number,
): number {
  if (!progress || themenGesamt <= 0) return 0;
  const themen = progress.themen ?? {};
  const erledigt = Object.values(themen).reduce((sum, t) => sum + erledigtePhasen(t), 0);
  const moeglich = themenGesamt * 4;
  return Math.min(100, Math.round((erledigt / moeglich) * 100));
}

/**
 * Letzte Lernaktivität als ISO-Datum (YYYY-MM-DD) oder null.
 * Basis ist `lastLernDatum` aus dem Fortschritts-Blob.
 */
export function letzteAktivitaet(
  progress: Partial<NoriveProgress> | null | undefined,
): string | null {
  const d = progress?.lastLernDatum;
  return typeof d === 'string' && d.length > 0 ? d : null;
}

/** Aktueller Lernstreak in Tagen (>= 0). */
export function lernstreak(progress: Partial<NoriveProgress> | null | undefined): number {
  return Math.max(0, Number(progress?.lernStreakTage ?? 0) || 0);
}

/** Anzahl vollständig erledigter Themen (alle 4 Phasen). */
export function erledigteThemen(progress: Partial<NoriveProgress> | null | undefined): number {
  const themen = progress?.themen ?? {};
  return Object.values(themen).filter((t) => erledigtePhasen(t) === 4).length;
}

/** Anzahl deck-reifer Artefakte (fürs Präsentations-Deck freigegeben). */
export function anzahlArtefakte(progress: Partial<NoriveProgress> | null | undefined): number {
  const themen = progress?.themen ?? {};
  return Object.values(themen).filter((t) => t?.artefakt?.deckReif === true).length;
}

/**
 * Fortschritt je Handlungsbereich in Prozent (0–100).
 * @param hbVonSlug   Zuordnung Thema-Slug → Handlungsbereich (aus der Content-Collection).
 * @param themenProHB Anzahl Themen je Handlungsbereich (Nenner-Basis, × 4 Phasen).
 * @returns Record hb → Prozent (nur für in `themenProHB` gelistete Bereiche).
 */
export function fortschrittJeHB(
  progress: Partial<NoriveProgress> | null | undefined,
  hbVonSlug: Record<string, string>,
  themenProHB: Record<string, number>,
): Record<string, number> {
  const themen = progress?.themen ?? {};
  const erledigtProHB: Record<string, number> = {};
  for (const [slug, t] of Object.entries(themen)) {
    const hb = hbVonSlug[slug];
    if (!hb) continue;
    erledigtProHB[hb] = (erledigtProHB[hb] ?? 0) + erledigtePhasen(t);
  }
  const out: Record<string, number> = {};
  for (const [hb, anzahl] of Object.entries(themenProHB)) {
    const moeglich = anzahl * 4;
    out[hb] = moeglich > 0 ? Math.min(100, Math.round(((erledigtProHB[hb] ?? 0) / moeglich) * 100)) : 0;
  }
  return out;
}

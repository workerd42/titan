/**
 * NORIVE PROGRESS TRACKER v2
 * localStorage-basiertes Fortschrittssystem für Phase 1
 * Schema ist auf Phase 2 (Backend/User-ID) vorbereitet.
 * Version: 1.0 · 2026
 */

const STORAGE_KEY = 'norive-progress-v2';

type Pruefen = 'geloest' | 'wiederholen' | null;

interface ThemaState {
  verstehen?: boolean;
  merken?: boolean;
  anwenden?: boolean;
  pruefen?: Pruefen;
  eigeneEinschaetzung?: string;
  wiederholungFaelligAm?: number | null;
}

interface NoriveProgress {
  version: 2;
  userId: null | string;           // Phase 2: Payload User ID
  unlockedHB: string[];            // Phase 1: alle freigeschaltet
  themen: Record<string, ThemaState>;
  lastLernDatum: string | null;    // ISO-Datum
  lernStreakTage: number;
  totalScore: number;
}

const DEFAULT_PROGRESS: NoriveProgress = {
  version: 2,
  userId: null,
  unlockedHB: ['hb1', 'hb2', 'hb3', 'hb4'], // Phase 1: alles offen
  themen: {},
  lastLernDatum: null,
  lernStreakTage: 0,
  totalScore: 0,
};

// ─── PERSISTENCE ──────────────────────────────────

function loadProgress(): NoriveProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<NoriveProgress>;
    // Migration aus v1 (pruefungsraum-progress-v1)
    if (!parsed.version) {
      return migrateV1(raw);
    }
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function migrateV1(rawV1: string): NoriveProgress {
  try {
    const oldData = JSON.parse(rawV1);
    const migrated: NoriveProgress = { ...DEFAULT_PROGRESS };
    // Alte Slug-Keys übernehmen
    if (typeof oldData === 'object') {
      migrated.themen = oldData as Record<string, ThemaState>;
    }
    return migrated;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(state: NoriveProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage voll oder blockiert — Seite bleibt nutzbar
  }
  // Einziger Andockpunkt für Phase 2: signalisiert Änderungen nach außen.
  // norive-sync.ts nutzt das für den Server-Sync (nur bei aktiver Session),
  // PersoenlichPanel für die Live-Aktualisierung der Fortschrittsanzeige.
  try {
    window.dispatchEvent(new CustomEvent('norive:progress-updated'));
  } catch {
    /* kein window (SSR/Build) — irrelevant, Script läuft nur im Browser */
  }
}

// ─── STREAK ───────────────────────────────────────

function updateStreak(state: NoriveProgress): NoriveProgress {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  if (state.lastLernDatum === today) return state;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = state.lastLernDatum === yesterday
    ? state.lernStreakTage + 1
    : 1;

  return { ...state, lastLernDatum: today, lernStreakTage: newStreak };
}

// ─── BERECHNUNGEN ─────────────────────────────────

function phasenAbgeschlossen(t: ThemaState | undefined): number {
  if (!t) return 0;
  return (
    (t.verstehen ? 1 : 0) +
    (t.merken ? 1 : 0) +
    (t.anwenden ? 1 : 0) +
    (t.pruefen ? 1 : 0)
  );
}

function hbProgress(state: NoriveProgress, hbId: string, slugs: string[]): number {
  if (!slugs.length) return 0;
  const total = slugs.length * 4;
  const done = slugs.reduce((s, slug) => s + phasenAbgeschlossen(state.themen[slug]), 0);
  return Math.round((done / total) * 100);
}

function isHbComplete(state: NoriveProgress, slugs: string[]): boolean {
  return slugs.length > 0 && slugs.every((slug) => phasenAbgeschlossen(state.themen[slug]) === 4);
}

// ─── RENDER FUNKTIONEN ─────────────────────────────

function renderStreakDisplay(state: NoriveProgress): void {
  const container = document.getElementById('streak-container');
  if (!container) return;
  if (state.lernStreakTage === 0) { container.innerHTML = ''; return; }

  const lineWidth = Math.min(state.lernStreakTage * 6, 96);
  container.innerHTML = `
    <div class="streak-display" aria-label="${state.lernStreakTage} Lerntage in Folge">
      <span>${state.lernStreakTage}&nbsp;${state.lernStreakTage === 1 ? 'Tag' : 'Tage'}</span>
      <span class="streak-line" style="width:${lineWidth}px" aria-hidden="true"></span>
    </div>
  `;
}

function renderPlanetProgress(state: NoriveProgress): void {
  // Topbar-Fortschrittsanzeige auf Planet-Seiten
  const el = document.querySelector<HTMLElement>('[data-hb-id]');
  if (!el) return;
  const hbId = el.getAttribute('data-hb-id') ?? '';
  const slugEls = document.querySelectorAll<HTMLElement>('[data-thema-slug]');
  const slugs = [...slugEls].map((s) => s.getAttribute('data-thema-slug') ?? '').filter(Boolean);
  if (!slugs.length) return;
  const pct = hbProgress(state, hbId, slugs);
  el.textContent = `${pct} %`;
}

function renderPhaseDots(state: NoriveProgress): void {
  document.querySelectorAll<HTMLElement>('[data-phase-dots]').forEach((wrap) => {
    const slug = wrap.getAttribute('data-phase-dots') ?? '';
    const done = phasenAbgeschlossen(state.themen[slug]);
    // Unterstützt beide CSS-Klassen: .phase-dot (TOC alt) und .tp-dot (Universum-Innenansicht)
    wrap.querySelectorAll<HTMLElement>('.phase-dot, .tp-dot').forEach((dot, i) => {
      dot.setAttribute('data-filled', i < done ? 'true' : 'false');
    });
  });
}

function renderPlanetComplete(state: NoriveProgress): void {
  document.querySelectorAll<HTMLElement>('[data-planet-id]').forEach((planet) => {
    const hbId = planet.getAttribute('data-planet-id') ?? '';
    const slugAttr = planet.getAttribute('data-planet-slugs') ?? '[]';
    try {
      const slugs = JSON.parse(slugAttr) as string[];
      const complete = isHbComplete(state, slugs);
      const body = planet.querySelector<HTMLElement>('.planet-body');
      if (body) body.setAttribute('data-complete', complete ? 'true' : 'false');
    } catch { /* ignore */ }
  });
}

function renderPhasenLeiste(slug: string, state: NoriveProgress): void {
  const t = state.themen[slug] ?? {};
  const map: Record<string, boolean> = {
    verstehen: !!t.verstehen,
    merken: !!t.merken,
    anwenden: !!t.anwenden,
    pruefen: !!t.pruefen,
  };
  Object.entries(map).forEach(([phase, done]) => {
    const el = document.querySelector<HTMLElement>(`[data-phase-label="${phase}"]`);
    if (el) el.setAttribute('data-done', String(done));
  });
}

function renderWiederholungHinweis(slug: string, state: NoriveProgress, tage: number): void {
  const el = document.querySelector<HTMLElement>('[data-wiederholung-hinweis]');
  if (!el) return;
  const t = state.themen[slug] ?? {};
  if (t.pruefen === 'wiederholen') {
    el.textContent = `Dieses Thema erscheint in ${tage} Tagen automatisch wieder in deiner Übersicht.`;
  } else if (t.pruefen === 'geloest') {
    el.textContent = 'Als gelöst markiert.';
  } else {
    el.textContent = `Deine Einschätzung entscheidet, ob dieses Thema in ${tage} Tagen erneut vorgeschlagen wird.`;
  }
}

// ─── THEMA-SEITEN INTERAKTION ──────────────────────

function initThemaPage(): void {
  const root = document.querySelector<HTMLElement>('[data-thema-slug]');
  if (!root) return;
  const slug = root.getAttribute('data-thema-slug') ?? '';
  const tage = parseInt(root.getAttribute('data-wiederholung-tage') ?? '4', 10);

  let state = loadProgress();
  state = updateStreak(state);
  state.themen[slug] = state.themen[slug] ?? {};
  saveProgress(state);

  function persist(): void {
    saveProgress(state);
    renderPhaseDots(state);
    renderPhasenLeiste(slug, state);
    renderPlanetProgress(state);
  }

  // Verstehen
  const verstehenBtn = document.querySelector<HTMLButtonElement>('[data-action="verstehen-bestaetigen"]');
  if (verstehenBtn) {
    if (state.themen[slug].verstehen) verstehenBtn.setAttribute('data-chosen', 'true');
    verstehenBtn.addEventListener('click', () => {
      state.themen[slug].verstehen = true;
      verstehenBtn.setAttribute('data-chosen', 'true');
      persist();
    });
  }

  // Merken
  const merkenBtn = document.querySelector<HTMLButtonElement>('[data-action="merken-bestaetigen"]');
  if (merkenBtn) {
    if (state.themen[slug].merken) merkenBtn.setAttribute('data-chosen', 'true');
    merkenBtn.addEventListener('click', () => {
      state.themen[slug].merken = true;
      merkenBtn.setAttribute('data-chosen', 'true');
      persist();
    });
  }

  // Anwenden — Textarea
  const textarea = document.querySelector<HTMLTextAreaElement>('[data-action="eigene-einschaetzung"]');
  if (textarea) {
    textarea.value = state.themen[slug].eigeneEinschaetzung ?? '';
    textarea.addEventListener('input', () => {
      state.themen[slug].eigeneEinschaetzung = textarea.value;
      saveProgress(state);
    });
  }

  const anwendenBtn = document.querySelector<HTMLButtonElement>('[data-action="anwenden-bestaetigen"]');
  if (anwendenBtn) {
    if (state.themen[slug].anwenden) anwendenBtn.setAttribute('data-chosen', 'true');
    anwendenBtn.addEventListener('click', () => {
      state.themen[slug].anwenden = true;
      anwendenBtn.setAttribute('data-chosen', 'true');
      persist();
    });
  }

  // Prüfen — Selbstbewertung
  document.querySelectorAll<HTMLButtonElement>('[data-action="pruefen-einschaetzung"]').forEach((btn) => {
    const wert = btn.getAttribute('data-wert') as Pruefen;
    if (state.themen[slug].pruefen === wert) btn.setAttribute('data-chosen', 'true');
    btn.addEventListener('click', () => {
      state.themen[slug].pruefen = wert;
      document.querySelectorAll<HTMLButtonElement>('[data-action="pruefen-einschaetzung"]')
        .forEach((b) => b.setAttribute('data-chosen', b === btn ? 'true' : 'false'));
      if (wert === 'wiederholen') {
        state.themen[slug].wiederholungFaelligAm = Date.now() + tage * 86400000;
      } else {
        state.themen[slug].wiederholungFaelligAm = null;
      }
      persist();
      renderWiederholungHinweis(slug, state, tage);
    });
  });

  renderPhasenLeiste(slug, state);
  renderWiederholungHinweis(slug, state, tage);
}

// ─── RESET ────────────────────────────────────────

function initReset(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-action="fortschritt-zuruecksetzen"]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('Gesamten Lernfortschritt wirklich zurücksetzen?')) {
      localStorage.removeItem(STORAGE_KEY);
      const fresh = { ...DEFAULT_PROGRESS };
      renderPhaseDots(fresh);
      renderStreakDisplay(fresh);
      renderPlanetComplete(fresh);
    }
  });
}

// ─── INIT ─────────────────────────────────────────

function init(): void {
  const state = loadProgress();
  renderStreakDisplay(state);
  renderPhaseDots(state);
  renderPlanetComplete(state);
  renderPlanetProgress(state);
  initThemaPage();
  initReset();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Phase 2: Nach einem Server-Sync (norive-sync.ts) steht ein neuer Stand im
// localStorage — Anzeigen neu rendern, damit Phasen-Punkte/Streak/Fortschritt
// ohne Reload stimmen.
window.addEventListener('norive:synced', () => {
  const state = loadProgress();
  renderStreakDisplay(state);
  renderPhaseDots(state);
  renderPlanetComplete(state);
  renderPlanetProgress(state);
});

/**
 * MODULE ENGINE — interaktive Werkzeuge der Phase „Anwenden".
 *
 * Auf der Lernseite steht ein Mount-Punkt `#modul-mount[data-werkzeug][data-slug]`.
 * Diese Engine mountet das passende Modul, versorgt es mit dem Kompass-Unternehmen
 * und einem ggf. bereits gespeicherten Artefakt (zum Wiederherstellen). Jedes
 * Modul erzeugt beim Speichern ein Artefakt — bezogen auf das Kompass-Unternehmen —
 * das über norive-progress.ts persistiert/synchronisiert wird und später das
 * Präsentations-Deck speist.
 *
 * Trennung: Die Engine SCHREIBT den Fortschritt nicht selbst, sie meldet nur per
 * Event `norive:artefakt-speichern`. norive-progress.ts bleibt einziger Schreiber.
 */

const PROGRESS_KEY = 'norive-progress-v2';
const KOMPASS_KEY = 'norive-kompass-v1';

interface Kompass {
  name?: string;
  branche?: string;
  rechtsform?: string;
  groesse?: string;
}

interface ModulKontext {
  mount: HTMLElement;
  slug: string;
  kompass: Kompass | null;
  firma: string;                       // Anzeigename des Kompass-Unternehmens
  savedDaten: unknown;                 // zuvor gespeichertes Artefakt (oder null)
  save: (titel: string, daten: unknown) => void;
  toast: (msg: string) => void;
}

type ModulFn = (ctx: ModulKontext) => void;

// ── Hilfen ────────────────────────────────────────────────
function readKompass(): Kompass | null {
  try { return JSON.parse(localStorage.getItem(KOMPASS_KEY) || 'null'); } catch { return null; }
}
function readSavedArtefakt(slug: string): unknown {
  try {
    const st = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return st?.themen?.[slug]?.artefakt?.daten ?? null;
  } catch { return null; }
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

// ── Toast (Feedback beim Speichern) ───────────────────────
function showToast(msg: string): void {
  let t = document.getElementById('titan-toast');
  if (!t) {
    t = el('div', 'titan-toast');
    t.id = 'titan-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.setAttribute('data-show', 'true');
  window.clearTimeout((t as any)._h);
  (t as any)._h = window.setTimeout(() => t!.setAttribute('data-show', 'false'), 3200);
}

// ═══════════════════════════════════════════════════════════
// MODULE
// ═══════════════════════════════════════════════════════════

// SMART-Ziel-Prüfer (Familie: Checker/Formular) ─────────────
const smartModul: ModulFn = (ctx) => {
  const KRIT = [
    ['spezifisch', 'Spezifisch', 'Konkret und eindeutig formuliert?'],
    ['messbar', 'Messbar', 'Woran misst du die Erreichung (Zahl/Kennzahl)?'],
    ['attraktiv', 'Attraktiv', 'Lohnend und akzeptiert für das Unternehmen?'],
    ['realistisch', 'Realistisch', 'Mit euren Mitteln erreichbar?'],
    ['terminiert', 'Terminiert', 'Bis wann (klarer Zeitpunkt)?'],
  ];
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Formuliere ein Marketingziel für <strong>${esc(ctx.firma)}</strong> und prüfe es gegen die fünf SMART-Kriterien.`));

  const ziel = el('textarea', 'tm-input tm-ziel');
  ziel.setAttribute('rows', '2');
  ziel.setAttribute('placeholder', 'z. B. „Den Online-Umsatz bis 31.12. um 15 % steigern."');
  (ziel as HTMLTextAreaElement).value = saved.ziel || '';
  const zl = el('label', 'tm-label', 'Dein Ziel');
  zl.appendChild(ziel);
  wrap.appendChild(zl);

  const grid = el('div', 'tm-krit');
  KRIT.forEach(([key, titel, hint]) => {
    const s = (saved.kriterien || {})[key] || {};
    const row = el('div', 'tm-krit-row');
    const cb = el('input', 'tm-check') as HTMLInputElement;
    cb.type = 'checkbox'; cb.checked = !!s.erfuellt; cb.id = `smart-${key}`;
    const head = el('label', 'tm-krit-head');
    head.setAttribute('for', `smart-${key}`);
    head.appendChild(cb);
    head.appendChild(el('span', 'tm-krit-titel', `${titel} <span class="tm-krit-hint">— ${hint}</span>`));
    const note = el('input', 'tm-input tm-note') as HTMLInputElement;
    note.type = 'text'; note.placeholder = 'Wie erfüllt?'; note.value = s.notiz || '';
    note.dataset.k = key; cb.dataset.k = key;
    row.appendChild(head); row.appendChild(note);
    grid.appendChild(row);
  });
  wrap.appendChild(grid);

  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => {
    const kriterien: Record<string, { erfuellt: boolean; notiz: string }> = {};
    grid.querySelectorAll('.tm-check').forEach((c) => {
      const k = (c as HTMLInputElement).dataset.k!;
      const note = grid.querySelector(`.tm-note[data-k="${k}"]`) as HTMLInputElement;
      kriterien[k] = { erfuellt: (c as HTMLInputElement).checked, notiz: note.value.trim() };
    });
    ctx.save(`SMART-Ziel — ${ctx.firma}`, { ziel: (ziel as HTMLTextAreaElement).value.trim(), kriterien });
  });
  wrap.appendChild(btn);
  ctx.mount.appendChild(wrap);
};

// SWOT-Matrix (Familie: Matrix/Canvas) ─────────────────────
const swotModul: ModulFn = (ctx) => {
  const FELDER = [
    ['staerken', 'Stärken', 'intern, positiv'],
    ['schwaechen', 'Schwächen', 'intern, negativ'],
    ['chancen', 'Chancen', 'extern, positiv'],
    ['risiken', 'Risiken', 'extern, negativ'],
  ];
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `SWOT-Analyse für <strong>${esc(ctx.firma)}</strong> — je eine Stichpunktzeile pro Aspekt.`));
  const grid = el('div', 'tm-swot');
  FELDER.forEach(([key, titel, sub]) => {
    const cell = el('div', `tm-swot-cell tm-swot-${key}`);
    cell.appendChild(el('p', 'tm-swot-titel', `${titel} <span class="tm-swot-sub">${sub}</span>`));
    const ta = el('textarea', 'tm-input') as HTMLTextAreaElement;
    ta.setAttribute('rows', '4');
    ta.placeholder = 'ein Punkt pro Zeile …';
    ta.value = (saved[key] || []).join('\n');
    ta.dataset.k = key;
    cell.appendChild(ta);
    grid.appendChild(cell);
  });
  wrap.appendChild(grid);
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => {
    const daten: Record<string, string[]> = {};
    grid.querySelectorAll('textarea').forEach((ta) => {
      daten[(ta as HTMLTextAreaElement).dataset.k!] = (ta as HTMLTextAreaElement).value.split('\n').map((s) => s.trim()).filter(Boolean);
    });
    ctx.save(`SWOT-Analyse — ${ctx.firma}`, daten);
  });
  wrap.appendChild(btn);
  ctx.mount.appendChild(wrap);
};

// Deckungsbeitrags-Rechner (Familie: Rechner) ──────────────
const dbModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Deckungsbeitrag & Break-even für ein Produkt von <strong>${esc(ctx.firma)}</strong>.`));
  const FELDER: [string, string, string][] = [
    ['preis', 'Preis / Stück (€)', saved.preis ?? ''],
    ['vark', 'Variable Kosten / Stück (€)', saved.vark ?? ''],
    ['fixk', 'Fixkosten gesamt (€)', saved.fixk ?? ''],
    ['menge', 'Menge (Stück)', saved.menge ?? ''],
  ];
  const inputs: Record<string, HTMLInputElement> = {};
  const form = el('div', 'tm-form');
  FELDER.forEach(([k, label, val]) => {
    const l = el('label', 'tm-label', label);
    const inp = el('input', 'tm-input tm-num') as HTMLInputElement;
    inp.type = 'number'; inp.inputMode = 'decimal'; inp.value = String(val);
    inputs[k] = inp; l.appendChild(inp); form.appendChild(l);
  });
  wrap.appendChild(form);

  const out = el('div', 'tm-out');
  wrap.appendChild(out);
  const fmt = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  function recalc(): void {
    const p = +inputs.preis.value, v = +inputs.vark.value, f = +inputs.fixk.value, m = +inputs.menge.value;
    const dbStk = p - v;
    const dbGes = dbStk * m;
    const gewinn = dbGes - f;
    const be = dbStk > 0 ? f / dbStk : NaN;
    out.innerHTML = `
      <div class="tm-out-row"><span>Deckungsbeitrag / Stück</span><b>${isFinite(dbStk) ? fmt(dbStk) + ' €' : '—'}</b></div>
      <div class="tm-out-row"><span>Deckungsbeitrag gesamt</span><b>${isFinite(dbGes) ? fmt(dbGes) + ' €' : '—'}</b></div>
      <div class="tm-out-row"><span>Break-even-Menge</span><b>${isFinite(be) ? fmt(Math.ceil(be)) + ' Stück' : '—'}</b></div>
      <div class="tm-out-row tm-out-total"><span>Gewinn / Verlust</span><b class="${gewinn >= 0 ? 'pos' : 'neg'}">${isFinite(gewinn) ? fmt(gewinn) + ' €' : '—'}</b></div>`;
  }
  Object.values(inputs).forEach((i) => i.addEventListener('input', recalc));
  recalc();

  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => {
    const daten = {
      preis: +inputs.preis.value, vark: +inputs.vark.value, fixk: +inputs.fixk.value, menge: +inputs.menge.value,
      dbStk: +inputs.preis.value - +inputs.vark.value,
    };
    ctx.save(`Deckungsbeitrag — ${ctx.firma}`, daten);
  });
  wrap.appendChild(btn);
  ctx.mount.appendChild(wrap);
};

const REGISTRY: Record<string, ModulFn> = {
  smart: smartModul,
  swot: swotModul,
  deckungsbeitrag: dbModul,
};

// ── Mount ─────────────────────────────────────────────────
function mountModule(): void {
  const mount = document.getElementById('modul-mount');
  if (!mount || mount.dataset.mounted === 'true') return;
  const werkzeug = mount.dataset.werkzeug || '';
  const slug = mount.dataset.slug || '';
  const fn = REGISTRY[werkzeug];
  mount.dataset.mounted = 'true';
  mount.replaceChildren();

  const kompass = readKompass();
  const firma = kompass?.name || 'dein Kompass-Unternehmen';

  if (!fn) {
    // Werkzeug definiert, aber noch nicht implementiert → ehrlicher Platzhalter
    mount.appendChild(el('p', 'tm-soon', `Interaktives Modul „${esc(werkzeug)}" ist in Vorbereitung. Nutze bis dahin das Textfeld unten.`));
    return;
  }
  if (!kompass?.name) {
    mount.appendChild(el('p', 'tm-hinweis', '◆ Richte zuerst dein Kompass-Unternehmen ein (Mein Bereich), damit dieses Werkzeug auf deine Firma zugeschnitten arbeitet. Du kannst es aber auch schon jetzt ausfüllen.'));
  }

  fn({
    mount, slug, kompass, firma,
    savedDaten: readSavedArtefakt(slug),
    save: (titel, daten) => {
      window.dispatchEvent(new CustomEvent('norive:artefakt-speichern', { detail: { slug, modul: werkzeug, titel, daten } }));
    },
    toast: showToast,
  });
}

// Nach dem Speichern: Feedback + „gespeichert"-Zustand am Button.
window.addEventListener('norive:artefakt-gespeichert', () => {
  showToast('✓ Artefakt gespeichert — fließt in dein Präsentations-Deck');
  const btn = document.querySelector('#modul-mount .tm-save');
  if (btn) { btn.setAttribute('data-saved', 'true'); btn.innerHTML = '✓ Gespeichert — aktualisieren'; }
});

document.addEventListener('astro:page-load', mountModule);
if (document.readyState !== 'loading') mountModule();
else document.addEventListener('DOMContentLoaded', mountModule);

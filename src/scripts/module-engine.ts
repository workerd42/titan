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

import { showToast } from './toast';

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
  wrap.appendChild(el('div', 'tm-formel',
    `<b>So rechnet es:</b> Deckungsbeitrag/Stück = Preis − variable Kosten. `
    + `Break-even-Menge = Fixkosten ÷ DB/Stück (ab hier trägt jedes Stück zum Gewinn bei). `
    + `Gewinn = DB gesamt − Fixkosten.`));
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

// Marktkennzahlen-Rechner (Familie: Rechner) ──────────────
const marktanteilModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Marktanteil von <strong>${esc(ctx.firma)}</strong> im relevanten Markt.`));
  wrap.appendChild(el('div', 'tm-formel', `<b>So rechnet es:</b> Marktanteil = eigener Umsatz ÷ Marktvolumen. Relativer Marktanteil = eigener Umsatz ÷ Umsatz des stärksten Wettbewerbers (> 1 = Marktführer).`));
  const FELDER: [string, string, any][] = [
    ['eigen', 'Eigener Umsatz (€)', saved.eigen ?? ''],
    ['markt', 'Marktvolumen gesamt (€)', saved.markt ?? ''],
    ['wettb', 'Umsatz stärkster Wettbewerber (€)', saved.wettb ?? ''],
  ];
  const inputs: Record<string, HTMLInputElement> = {};
  const form = el('div', 'tm-form');
  FELDER.forEach(([k, label, val]) => {
    const l = el('label', 'tm-label', label);
    const inp = el('input', 'tm-input tm-num') as HTMLInputElement;
    inp.type = 'number'; inp.value = String(val); inputs[k] = inp; l.appendChild(inp); form.appendChild(l);
  });
  wrap.appendChild(form);
  const out = el('div', 'tm-out'); wrap.appendChild(out);
  const f = (n: number, d = 1) => isFinite(n) ? n.toLocaleString('de-DE', { maximumFractionDigits: d }) : '—';
  function recalc(): void {
    const e = +inputs.eigen.value, m = +inputs.markt.value, w = +inputs.wettb.value;
    const anteil = m > 0 ? (e / m) * 100 : NaN;
    const rel = w > 0 ? e / w : NaN;
    out.innerHTML = `
      <div class="tm-out-row"><span>Marktanteil</span><b>${f(anteil)} %</b></div>
      <div class="tm-out-row"><span>Relativer Marktanteil</span><b>${f(rel, 2)}${isFinite(rel) ? (rel >= 1 ? ' · Marktführer' : '') : ''}</b></div>`;
  }
  Object.values(inputs).forEach((i) => i.addEventListener('input', recalc)); recalc();
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => ctx.save(`Marktanteil — ${ctx.firma}`, { eigen: +inputs.eigen.value, markt: +inputs.markt.value, wettb: +inputs.wettb.value }));
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// Preis-Rechner / Zuschlagskalkulation (Familie: Rechner) ──
const preisModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Angebotspreis eines Produkts von <strong>${esc(ctx.firma)}</strong> per Zuschlagskalkulation.`));
  wrap.appendChild(el('div', 'tm-formel', `<b>So rechnet es:</b> Selbstkosten + Gewinnzuschlag = Barverkaufspreis. Barverkaufspreis „im Hundert" um Skonto & Rabatt hochgerechnet = Listenverkaufspreis (Angebotspreis).`));
  const FELDER: [string, string, any][] = [
    ['sk', 'Selbstkosten / Stück (€)', saved.sk ?? ''],
    ['gewinn', 'Gewinnzuschlag (%)', saved.gewinn ?? ''],
    ['skonto', 'Skonto (%)', saved.skonto ?? ''],
    ['rabatt', 'Rabatt (%)', saved.rabatt ?? ''],
  ];
  const inputs: Record<string, HTMLInputElement> = {};
  const form = el('div', 'tm-form');
  FELDER.forEach(([k, label, val]) => {
    const l = el('label', 'tm-label', label);
    const inp = el('input', 'tm-input tm-num') as HTMLInputElement;
    inp.type = 'number'; inp.value = String(val); inputs[k] = inp; l.appendChild(inp); form.appendChild(l);
  });
  wrap.appendChild(form);
  const out = el('div', 'tm-out'); wrap.appendChild(out);
  const f = (n: number) => isFinite(n) ? n.toLocaleString('de-DE', { maximumFractionDigits: 2 }) : '—';
  function recalc(): void {
    const sk = +inputs.sk.value, g = +inputs.gewinn.value, sk2 = +inputs.skonto.value, r = +inputs.rabatt.value;
    const bar = sk * (1 + g / 100);
    const ziel = sk2 < 100 ? bar / (1 - sk2 / 100) : NaN;   // Skonto „im Hundert"
    const liste = r < 100 ? ziel / (1 - r / 100) : NaN;     // Rabatt „im Hundert"
    out.innerHTML = `
      <div class="tm-out-row"><span>Barverkaufspreis</span><b>${f(bar)} €</b></div>
      <div class="tm-out-row"><span>Zielverkaufspreis (nach Skonto)</span><b>${f(ziel)} €</b></div>
      <div class="tm-out-row tm-out-total"><span>Listenverkaufspreis (Angebot)</span><b>${f(liste)} €</b></div>`;
  }
  Object.values(inputs).forEach((i) => i.addEventListener('input', recalc)); recalc();
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => ctx.save(`Preiskalkulation — ${ctx.firma}`, { sk: +inputs.sk.value, gewinn: +inputs.gewinn.value, skonto: +inputs.skonto.value, rabatt: +inputs.rabatt.value }));
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// Vier-Stufen-Methode (Familie: Sequenzer/Leitfaden) ───────
const vierStufenModul: ModulFn = (ctx) => {
  const STUFEN = [
    ['Vorbereiten', 'Arbeitsplatz, Material, Auszubildende einstimmen'],
    ['Vormachen & Erklären', 'Ausbilder zeigt und begründet jeden Schritt'],
    ['Nachmachen lassen', 'Auszubildende führen aus und erklären dabei'],
    ['Üben & Abschluss', 'Selbstständig üben, Feedback, Erfolgskontrolle'],
  ];
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Unterweisungsplan nach der Vier-Stufen-Methode für eine Tätigkeit bei <strong>${esc(ctx.firma)}</strong>.`));
  const inp = el('input', 'tm-input') as HTMLInputElement;
  inp.type = 'text'; inp.placeholder = 'z. B. „Kundenreklamation bearbeiten"'; inp.value = saved.taetigkeit || '';
  const tl = el('label', 'tm-label', 'Tätigkeit / Lernziel'); tl.appendChild(inp); wrap.appendChild(tl);
  const list = el('div', 'tm-stufen');
  STUFEN.forEach(([titel, hint], i) => {
    const s = (saved.schritte || [])[i] || {};
    const row = el('div', 'tm-stufe');
    row.appendChild(el('div', 'tm-stufe-num', String(i + 1)));
    const col = el('div', 'tm-stufe-col');
    col.appendChild(el('p', 'tm-stufe-titel', `${titel} <span class="tm-krit-hint">— ${hint}</span>`));
    const ta = el('textarea', 'tm-input') as HTMLTextAreaElement;
    ta.setAttribute('rows', '2'); ta.placeholder = 'Wie setzt du diese Stufe konkret um?'; ta.value = s.notiz || '';
    ta.dataset.i = String(i); col.appendChild(ta); row.appendChild(col); list.appendChild(row);
  });
  wrap.appendChild(list);
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => {
    const schritte = STUFEN.map(([titel], i) => ({ titel, notiz: (list.querySelector(`textarea[data-i="${i}"]`) as HTMLTextAreaElement).value.trim() }));
    ctx.save(`Vier-Stufen-Unterweisung — ${ctx.firma}`, { taetigkeit: inp.value.trim(), schritte });
  });
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// Nutzwertanalyse / Scoring (Familie: Rechner/Matrix) ──────
const scoringModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Nutzwertanalyse für eine Entscheidung bei <strong>${esc(ctx.firma)}</strong> — zwei Alternativen, gewichtete Kriterien (Bewertung 1–5).`));
  const altA = el('input', 'tm-input') as HTMLInputElement; altA.type = 'text'; altA.placeholder = 'Alternative A'; altA.value = (saved.alternativen || [])[0] || '';
  const altB = el('input', 'tm-input') as HTMLInputElement; altB.type = 'text'; altB.placeholder = 'Alternative B'; altB.value = (saved.alternativen || [])[1] || '';
  const altRow = el('div', 'tm-form'); const la = el('label', 'tm-label', 'Alternative A'); la.appendChild(altA); const lb = el('label', 'tm-label', 'Alternative B'); lb.appendChild(altB); altRow.appendChild(la); altRow.appendChild(lb);
  wrap.appendChild(altRow);
  const savedK = saved.kriterien || [{}, {}, {}];
  const table = el('div', 'tm-score');
  table.appendChild(el('div', 'tm-score-head', `<span>Kriterium</span><span>Gewicht %</span><span>A (1–5)</span><span>B (1–5)</span>`));
  for (let i = 0; i < 3; i++) {
    const k = savedK[i] || {};
    const row = el('div', 'tm-score-row');
    const mk = (cls: string, ph: string, val: any, type = 'number') => { const x = el('input', `tm-input ${cls}`) as HTMLInputElement; x.type = type; x.placeholder = ph; x.value = val ?? ''; x.dataset.i = String(i); return x; };
    row.appendChild(mk('sc-name', 'z. B. Kosten', k.name, 'text'));
    row.appendChild(mk('sc-w tm-num', '40', k.gewicht));
    row.appendChild(mk('sc-a tm-num', '4', k.a));
    row.appendChild(mk('sc-b tm-num', '3', k.b));
    table.appendChild(row);
  }
  wrap.appendChild(table);
  const out = el('div', 'tm-out'); wrap.appendChild(out);
  function read() {
    const kriterien = [] as any[];
    table.querySelectorAll('.tm-score-row').forEach((r, i) => {
      kriterien.push({
        name: (r.querySelector('.sc-name') as HTMLInputElement).value.trim(),
        gewicht: +(r.querySelector('.sc-w') as HTMLInputElement).value,
        a: +(r.querySelector('.sc-a') as HTMLInputElement).value,
        b: +(r.querySelector('.sc-b') as HTMLInputElement).value,
      });
    });
    return kriterien;
  }
  function recalc() {
    const kr = read();
    let sa = 0, sb = 0, gw = 0;
    kr.forEach((k) => { const g = k.gewicht || 0; gw += g; sa += (k.a || 0) * g; sb += (k.b || 0) * g; });
    const na = gw > 0 ? sa / gw : NaN, nb = gw > 0 ? sb / gw : NaN;
    const f = (n: number) => isFinite(n) ? n.toLocaleString('de-DE', { maximumFractionDigits: 2 }) : '—';
    const sieger = !isFinite(na) ? '' : na === nb ? 'Gleichstand' : (na > nb ? (altA.value || 'A') : (altB.value || 'B'));
    out.innerHTML = `
      <div class="tm-out-row"><span>Nutzwert ${esc(altA.value || 'A')}</span><b>${f(na)}</b></div>
      <div class="tm-out-row"><span>Nutzwert ${esc(altB.value || 'B')}</span><b>${f(nb)}</b></div>
      <div class="tm-out-row tm-out-total"><span>Empfehlung</span><b class="pos">${esc(sieger)}</b></div>`;
  }
  wrap.querySelectorAll('input').forEach((i) => i.addEventListener('input', recalc)); recalc();
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => ctx.save(`Nutzwertanalyse — ${ctx.firma}`, { alternativen: [altA.value.trim(), altB.value.trim()], kriterien: read() }));
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// Break-even / Gewinnschwelle (Familie: Rechner) ──────────
const breakevenModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Gewinnschwelle (Break-even) für ein Produkt von <strong>${esc(ctx.firma)}</strong> — ab welcher Menge lohnt es sich?`));
  wrap.appendChild(el('div', 'tm-formel',
    `<b>So rechnet es:</b> Deckungsbeitrag/Stück = Preis − variable Kosten. `
    + `Break-even-Menge = Fixkosten ÷ DB/Stück · Break-even-Umsatz = Menge × Preis. `
    + `Menge für Zielgewinn = (Fixkosten + Zielgewinn) ÷ DB/Stück.`));
  const FELDER: [string, string, any][] = [
    ['preis', 'Preis / Stück (€)', saved.preis ?? ''],
    ['vark', 'Variable Kosten / Stück (€)', saved.vark ?? ''],
    ['fixk', 'Fixkosten gesamt (€)', saved.fixk ?? ''],
    ['ziel', 'Zielgewinn (€, optional)', saved.ziel ?? ''],
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
  const out = el('div', 'tm-out'); wrap.appendChild(out);
  const fmt = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  function recalc(): void {
    const p = +inputs.preis.value, v = +inputs.vark.value, f = +inputs.fixk.value, z = +inputs.ziel.value || 0;
    const db = p - v;
    const beM = db > 0 ? f / db : NaN;
    const beU = isFinite(beM) ? beM * p : NaN;
    const zielM = db > 0 ? (f + z) / db : NaN;
    out.innerHTML = `
      <div class="tm-out-row"><span>Deckungsbeitrag / Stück</span><b>${isFinite(db) ? fmt(db) + ' €' : '—'}</b></div>
      <div class="tm-out-row"><span>Break-even-Menge</span><b>${isFinite(beM) ? fmt(Math.ceil(beM)) + ' Stück' : '—'}</b></div>
      <div class="tm-out-row"><span>Break-even-Umsatz</span><b>${isFinite(beU) ? fmt(beU) + ' €' : '—'}</b></div>
      <div class="tm-out-row tm-out-total"><span>Menge für Zielgewinn</span><b class="${z > 0 ? 'pos' : ''}">${isFinite(zielM) && z > 0 ? fmt(Math.ceil(zielM)) + ' Stück' : '—'}</b></div>`;
  }
  Object.values(inputs).forEach((i) => i.addEventListener('input', recalc));
  recalc();
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => ctx.save(`Break-even — ${ctx.firma}`, { preis: +inputs.preis.value, vark: +inputs.vark.value, fixk: +inputs.fixk.value, ziel: +inputs.ziel.value }));
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// BCG-/Portfolio-Matrix (Familie: Matrix) ──────────────────
const portfolioModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Ordne die Produkte/Geschäftsfelder von <strong>${esc(ctx.firma)}</strong> in die BCG-Matrix ein — die Einordnung passiert automatisch.`));
  wrap.appendChild(el('div', 'tm-formel',
    `<b>So funktioniert es:</b> Zwei Achsen — <b>Marktwachstum</b> (Attraktivität) und <b>relativer Marktanteil</b> `
    + `(eigener Umsatz ÷ Umsatz des stärksten Wettbewerbers). Schwellen: Wachstum ≥ 10 % = hoch · `
    + `relativer Marktanteil ≥ 1,0 = hoch. Daraus ergeben sich vier Felder mit je einer Normstrategie.`));

  const savedP = saved.produkte || [{}, {}, {}, {}];
  const table = el('div', 'tm-bcg-input');
  table.appendChild(el('div', 'tm-bcg-head', `<span>Produkt / Geschäftsfeld</span><span>Marktwachstum %</span><span>rel. Marktanteil</span>`));
  for (let i = 0; i < 4; i++) {
    const p = savedP[i] || {};
    const row = el('div', 'tm-bcg-row');
    const mk = (cls: string, ph: string, val: any, type = 'number') => {
      const x = el('input', `tm-input ${cls}`) as HTMLInputElement;
      x.type = type; if (type === 'number') x.inputMode = 'decimal';
      x.placeholder = ph; x.value = val ?? ''; x.dataset.i = String(i); return x;
    };
    row.appendChild(mk('bc-name', 'z. B. Produkt A', p.name, 'text'));
    row.appendChild(mk('bc-w tm-num', '12', p.wachstum));
    row.appendChild(mk('bc-m tm-num', '1,5', p.anteil));
    table.appendChild(row);
  }
  wrap.appendChild(table);

  const matrix = el('div', 'tm-bcg'); wrap.appendChild(matrix);
  const FELDER: Record<string, { titel: string; sub: string; strat: string }> = {
    star:    { titel: 'Stars', sub: 'Wachstum hoch · Anteil hoch', strat: 'Investieren — Wachstum finanzieren' },
    frage:   { titel: 'Fragezeichen', sub: 'Wachstum hoch · Anteil niedrig', strat: 'Selektiv fördern oder aufgeben' },
    cashcow: { titel: 'Cash Cows', sub: 'Wachstum niedrig · Anteil hoch', strat: 'Abschöpfen — Mittel für Stars' },
    hund:    { titel: 'Arme Hunde', sub: 'Wachstum niedrig · Anteil niedrig', strat: 'Desinvestieren / eliminieren' },
  };
  const classify = (w: number, m: number): string => {
    const hiW = w >= 10, hiM = m >= 1;
    return hiW && hiM ? 'star' : hiW ? 'frage' : hiM ? 'cashcow' : 'hund';
  };
  function read(): { name: string; wachstum: number; anteil: number }[] {
    const arr: { name: string; wachstum: number; anteil: number }[] = [];
    table.querySelectorAll('.tm-bcg-row').forEach((r) => {
      arr.push({
        name: (r.querySelector('.bc-name') as HTMLInputElement).value.trim(),
        wachstum: +(r.querySelector('.bc-w') as HTMLInputElement).value,
        anteil: +(r.querySelector('.bc-m') as HTMLInputElement).value,
      });
    });
    return arr;
  }
  function recalc(): void {
    const prods = read();
    matrix.replaceChildren();
    (['star', 'frage', 'cashcow', 'hund'] as const).forEach((key) => {
      const f = FELDER[key];
      const cell = el('div', `tm-bcg-cell tm-bcg-${key}`);
      cell.appendChild(el('p', 'tm-bcg-titel', `${f.titel} <span class="tm-swot-sub">${f.sub}</span>`));
      const chips = el('div', 'tm-bcg-chips');
      prods.forEach((p) => {
        if (p.name && isFinite(p.wachstum) && isFinite(p.anteil) && classify(p.wachstum, p.anteil) === key) {
          chips.appendChild(el('span', 'tm-bcg-chip', esc(p.name)));
        }
      });
      cell.appendChild(chips);
      cell.appendChild(el('p', 'tm-bcg-strat', f.strat));
      matrix.appendChild(cell);
    });
  }
  table.querySelectorAll('input').forEach((i) => i.addEventListener('input', recalc));
  recalc();
  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => ctx.save(`BCG-Portfolio — ${ctx.firma}`, { produkte: read() }));
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// Statistik-Rechner (Familie: Rechner) — Mittelwerte & Streuung ────
const statistikModul: ModulFn = (ctx) => {
  const saved = (ctx.savedDaten as any) || {};
  const wrap = el('div', 'tm');
  wrap.appendChild(el('p', 'tm-lead', `Datenreihe aus dem Umfeld von <strong>${esc(ctx.firma)}</strong> auswerten — z. B. Absatzzahlen oder Bewertungen (Dezimaltrennung mit Punkt).`));
  const inp = el('input', 'tm-input') as HTMLInputElement;
  inp.type = 'text';
  inp.placeholder = 'z. B. 12, 15, 15, 18, 22, 40';
  inp.value = saved.reihe || '';
  const lab = el('label', 'tm-label', 'Werte (durch Komma getrennt)'); lab.appendChild(inp);
  const form = el('div', 'tm-form'); form.appendChild(lab); wrap.appendChild(form);
  const out = el('div', 'tm-out'); wrap.appendChild(out);

  const f = (n: number) => isFinite(n) ? n.toLocaleString('de-DE', { maximumFractionDigits: 2 }) : '—';

  function recalc() {
    const werte = inp.value.split(/[,;\s]+/).map(Number).filter((n) => isFinite(n));
    if (werte.length < 2) {
      out.innerHTML = `<div class="tm-out-row"><span>Bitte mindestens zwei Werte eingeben.</span><b>—</b></div>`;
      return;
    }
    const n = werte.length;
    const mean = werte.reduce((a, b) => a + b, 0) / n;
    const sorted = [...werte].sort((a, b) => a - b);
    const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    // Modalwert (häufigster Wert)
    const cnt = new Map<number, number>();
    werte.forEach((v) => cnt.set(v, (cnt.get(v) || 0) + 1));
    let modal = werte[0], best = 0, mehrere = false;
    cnt.forEach((c, v) => { if (c > best) { best = c; modal = v; mehrere = false; } else if (c === best && v !== modal) mehrere = true; });
    const modalTxt = best <= 1 ? 'kein (alle einmalig)' : (mehrere ? `${f(modal)} (mehrdeutig)` : f(modal));
    const spannweite = sorted[n - 1] - sorted[0];
    const std = Math.sqrt(werte.reduce((a, v) => a + (v - mean) ** 2, 0) / n);
    out.innerHTML = `
      <div class="tm-out-row"><span>Anzahl n</span><b>${n}</b></div>
      <div class="tm-out-row"><span>Arithmetisches Mittel</span><b>${f(mean)}</b></div>
      <div class="tm-out-row"><span>Median (Zentralwert)</span><b>${f(median)}</b></div>
      <div class="tm-out-row"><span>Modalwert</span><b>${modalTxt}</b></div>
      <div class="tm-out-row"><span>Spannweite</span><b>${f(spannweite)}</b></div>
      <div class="tm-out-row tm-out-total"><span>Standardabweichung σ</span><b>${f(std)}</b></div>`;
  }
  inp.addEventListener('input', recalc); recalc();

  const btn = el('button', 'tm-save', 'Als Artefakt speichern <span aria-hidden="true">→</span>') as HTMLButtonElement;
  btn.type = 'button';
  btn.addEventListener('click', () => ctx.save(`Statistische Auswertung — ${ctx.firma}`, { reihe: inp.value.trim() }));
  wrap.appendChild(btn); ctx.mount.appendChild(wrap);
};

// ── Mini-Kurs-Kopf: „Was ist das? · Wann? · Beispiel" pro Werkzeug ──
// Macht aus dem nackten Formular eine geführte Lektion (Konzept + Worked Example),
// bevor der/die Lernende es frei auf die Star-Company anwendet. Statischer,
// vertrauenswürdiger Autoreninhalt (innerHTML mit eigenen <b> ok).
const MODUL_INFO: Record<string, { konzept: string; wann: string; beispiel: string }> = {
  swot: {
    konzept: 'Die SWOT-Analyse stellt <b>interne</b> Stärken/Schwächen den <b>externen</b> Chancen/Risiken gegenüber — ein ehrliches Gesamtbild der Ausgangslage.',
    wann: 'Vor jeder Strategie-Entscheidung, um die eigene Position zu bestimmen.',
    beispiel: 'Eine Bäckerei: <b>Stärke</b> frische Handwerksware · <b>Schwäche</b> nur eine Filiale · <b>Chance</b> Bio-Trend · <b>Risiko</b> Discounter nebenan.',
  },
  smart: {
    konzept: 'SMART macht aus einem vagen Wunsch ein <b>überprüfbares Ziel</b>: Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert.',
    wann: 'Immer wenn du ein Marketingziel formulierst, das später bewertbar sein soll.',
    beispiel: '„Mehr Umsatz" → „Den Online-Umsatz bis 31.12. um 15 % steigern."',
  },
  deckungsbeitrag: {
    konzept: 'Der Deckungsbeitrag zeigt, was ein Produkt nach Abzug der <b>variablen Kosten</b> zur Deckung der Fixkosten beiträgt.',
    wann: 'Wenn du wissen willst, ob und ab wann ein Produkt Geld verdient.',
    beispiel: 'Preis 50 € − variable Kosten 30 € = 20 € DB/Stück; bei 10.000 € Fixkosten trägt ab 500 Stück jedes weitere zum Gewinn bei.',
  },
  marktanteil: {
    konzept: 'Der Marktanteil setzt den <b>eigenen Umsatz</b> ins Verhältnis zum Gesamtmarkt (absolut) bzw. zum stärksten Wettbewerber (relativ).',
    wann: 'Zur Standortbestimmung im Wettbewerb und für Ziele wie „Marktführerschaft".',
    beispiel: '18 Mio. € Umsatz bei 120 Mio. € Marktvolumen = 15 % Marktanteil.',
  },
  preisberechnung: {
    konzept: 'Die Zuschlagskalkulation baut den Angebotspreis Schritt für Schritt aus den <b>Selbstkosten</b> + Gewinn + Rabatt/Skonto auf.',
    wann: 'Wenn du einen kostendeckenden, marktfähigen Angebotspreis brauchst.',
    beispiel: '80 € Selbstkosten + 20 % Gewinn = 96 € Barpreis, hochgerechnet um Skonto/Rabatt zum Listenpreis.',
  },
  'vier-stufen': {
    konzept: 'Die Vier-Stufen-Methode ist die klassische Unterweisung: Vorbereiten → Vormachen → Nachmachen → Üben.',
    wann: 'Wenn du eine:n Auszubildende:n eine konkrete Tätigkeit anlernst.',
    beispiel: 'Eine Reklamation bearbeiten: erst erklären, dann vormachen, dann selbst machen lassen, dann festigen.',
  },
  scoring: {
    konzept: 'Die Nutzwertanalyse vergleicht Alternativen anhand <b>gewichteter Kriterien</b> — die höchste Punktsumme gewinnt.',
    wann: 'Bei Entscheidungen mit mehreren Kriterien (Lieferant, Standort, Agentur …).',
    beispiel: 'Agentur A vs. B nach Preis (40 %), Qualität (40 %), Nähe (20 %) bewerten.',
  },
  portfolio: {
    konzept: 'Die BCG-Matrix ordnet Produkte nach <b>Marktwachstum</b> und <b>relativem Marktanteil</b> in Stars, Fragezeichen, Cash Cows und Arme Hunde.',
    wann: 'Um ein Produktportfolio zu steuern: investieren, abschöpfen oder aufgeben.',
    beispiel: 'Wachsendes Produkt mit hohem Anteil = Star (investieren); schrumpfendes mit niedrigem Anteil = Armer Hund (aufgeben).',
  },
  breakeven: {
    konzept: 'Der Break-even (Gewinnschwelle) ist die Menge, ab der die <b>Deckungsbeiträge die Fixkosten</b> genau decken — ab da beginnt der Gewinn.',
    wann: 'Um zu prüfen, ab welcher Absatzmenge sich ein Produkt lohnt.',
    beispiel: '10.000 € Fixkosten ÷ 20 € DB/Stück = 500 Stück Break-even.',
  },
  statistik: {
    konzept: 'Der Statistik-Rechner verdichtet eine Datenreihe zu <b>Mittelwerten</b> (arithmetisches Mittel, Median, Modalwert) und <b>Streuungsmaßen</b> (Spannweite, Standardabweichung).',
    wann: 'Wenn du Zahlenreihen (Absatz, Preise, Bewertungen) auf einen Blick beurteilen willst.',
    beispiel: 'Reihe 12, 15, 15, 18, 22, 40 → Mittel 20,3 · Median 16,5 · Modalwert 15 · Spannweite 28.',
  },
};

const REGISTRY: Record<string, ModulFn> = {
  smart: smartModul,
  swot: swotModul,
  deckungsbeitrag: dbModul,
  marktanteil: marktanteilModul,
  preisberechnung: preisModul,
  'vier-stufen': vierStufenModul,
  scoring: scoringModul,
  breakeven: breakevenModul,
  portfolio: portfolioModul,
  statistik: statistikModul,
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
  const firma = kompass?.name || 'deine Star-Company';

  if (!fn) {
    // Werkzeug definiert, aber noch nicht implementiert → ehrlicher Platzhalter
    mount.appendChild(el('p', 'tm-soon', `Interaktives Modul „${esc(werkzeug)}" ist in Vorbereitung. Nutze bis dahin das Textfeld unten.`));
    return;
  }
  // Mini-Kurs-Kopf: Konzept + Worked Example VOR dem Werkzeug (falls hinterlegt).
  const info = MODUL_INFO[werkzeug];
  if (info) {
    const box = el('div', 'tm-konzept');
    box.innerHTML =
      `<p class="tm-konzept-label">Was ist das?</p>`
      + `<p class="tm-konzept-text">${info.konzept}</p>`
      + `<p class="tm-konzept-row"><span class="tm-konzept-tag">Wann</span><span>${info.wann}</span></p>`
      + `<p class="tm-konzept-row"><span class="tm-konzept-tag">Beispiel</span><span>${info.beispiel}</span></p>`
      + `<p class="tm-konzept-cta">Jetzt selbst — auf deine Star-Company angewendet:</p>`;
    mount.appendChild(box);
  }

  if (!kompass?.name) {
    mount.appendChild(el('p', 'tm-hinweis', '◆ Richte zuerst deine Star-Company ein (Mein Bereich), damit dieses Werkzeug auf deine Firma zugeschnitten arbeitet. Du kannst es aber auch schon jetzt ausfüllen.'));
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

// Nach dem Speichern: „gespeichert"-Zustand am Button (Toast kommt aus
// norive-progress.ts, inkl. Prozentanzeige — kein doppeltes Toast hier).
window.addEventListener('norive:artefakt-gespeichert', () => {
  const btn = document.querySelector('#modul-mount .tm-save');
  if (btn) { btn.setAttribute('data-saved', 'true'); btn.innerHTML = '✓ Gespeichert — aktualisieren'; }
});

document.addEventListener('astro:page-load', mountModule);
if (document.readyState !== 'loading') mountModule();
else document.addEventListener('DOMContentLoaded', mountModule);

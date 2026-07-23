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

const REGISTRY: Record<string, ModulFn> = {
  smart: smartModul,
  swot: swotModul,
  deckungsbeitrag: dbModul,
  marktanteil: marktanteilModul,
  preisberechnung: preisModul,
  'vier-stufen': vierStufenModul,
  scoring: scoringModul,
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

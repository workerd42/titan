/**
 * chart.ts — gekapseltes Chart-Utility (Chart.js v4) gemäß
 * docs/technik/chart-integration.md.
 *
 * Guardrails an EINER Stelle:
 *  - Tree-shaking: nur die benötigten Controller/Elemente registriert.
 *  - Theme-aware: Farben aus Norive-Tokens gelesen; bei Hell/Dunkel-Umschalter
 *    (data-theme am <html>) automatisch nachgezogen.
 *  - Kosmos-Ruhe: sanfte Animation, `prefers-reduced-motion` → aus.
 *  - Barrierefreiheit: Aufrufer liefert eine visuell versteckte Datentabelle;
 *    das Canvas bekommt role="img" + aria-label.
 *  - Kein Speicherleck: `destroyChartsIn()` (auch als window-Hook ohne Import
 *    nutzbar) + globaler Cleanup vor jedem ClientRouter-Seitenwechsel.
 *
 * LAZY geladen (dynamischer import) — Chart.js landet in einem eigenen Chunk,
 * nicht im Haupt-Bundle.
 */
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const live = new Set<Chart>();

function token(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
function palette() {
  return {
    accent: token('--accent', '#6E5035'),
    text: token('--text', '#1C1917'),
    muted: token('--text-muted', '#5E5450'),
    border: token('--border', 'rgba(28,25,23,0.14)'),
  };
}
const reduce = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface HistoSpec { labels: string[]; values: number[]; label?: string }

/** Balken-/Histogramm-Diagramm. Instanz wird am Canvas hinterlegt (für Cleanup). */
export function makeHistogram(canvas: HTMLCanvasElement, spec: HistoSpec): Chart {
  const p = palette();
  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: spec.labels,
      datasets: [{ label: spec.label ?? 'Häufigkeit', data: spec.values, backgroundColor: p.accent, borderWidth: 0, borderRadius: 3, maxBarThickness: 48 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduce() ? false : { duration: 550, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: p.text, titleColor: '#fff', bodyColor: '#fff', displayColors: false, padding: 8 },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: p.muted, font: { size: 10 } }, border: { color: p.border } },
        y: { beginAtZero: true, ticks: { precision: 0, color: p.muted, font: { size: 10 } }, grid: { color: p.border }, border: { display: false } },
      },
    },
  });
  (canvas as unknown as { __chart?: Chart }).__chart = chart;
  live.add(chart);
  return chart;
}

/** Farben aller lebenden Charts an das aktuelle Theme anpassen. */
function recolor(): void {
  const p = palette();
  live.forEach((c) => {
    const ds = c.data.datasets[0] as { backgroundColor?: string } | undefined;
    if (ds) ds.backgroundColor = p.accent;
    const sc = c.options.scales as Record<string, { ticks?: { color?: string }; grid?: { color?: string }; border?: { color?: string } }> | undefined;
    if (sc?.x?.ticks) sc.x.ticks.color = p.muted;
    if (sc?.x?.border) sc.x.border.color = p.border;
    if (sc?.y?.ticks) sc.y.ticks.color = p.muted;
    if (sc?.y?.grid) sc.y.grid.color = p.border;
    c.update('none');
  });
}

/** Alle Charts innerhalb eines Containers sauber zerstören (verhindert Leaks). */
export function destroyChartsIn(root: ParentNode): void {
  root.querySelectorAll('canvas').forEach((cv) => {
    const holder = cv as unknown as { __chart?: Chart | null };
    if (holder.__chart) { live.delete(holder.__chart); holder.__chart.destroy(); holder.__chart = null; }
  });
}

// Theme-Wechsel (data-theme am <html>) → Farben nachziehen.
new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// Cleanup-Hook OHNE Import nutzbar (module-engine ruft window.__titanDestroyChartsIn?.(el)).
(window as unknown as { __titanDestroyChartsIn?: (r: ParentNode) => void }).__titanDestroyChartsIn = destroyChartsIn;

// ClientRouter: vor jedem Seiten-Swap alle Charts zerstören.
document.addEventListener('astro:before-swap', () => destroyChartsIn(document));

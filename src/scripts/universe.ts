/**
 * NORIVE UNIVERSE — Orbital Animation
 * Animiert 4 Planeten auf elliptischen Bahnen um ein Zentrum.
 * Nutzt CSS left/top statt transform um den absolut-positionierten
 * Wrapper korrekt zu setzen.
 * prefers-reduced-motion: Planeten bleiben auf ihren Startpositionen.
 * Version: 1.0 · 2026
 */

interface PlanetConfig {
  id: string;
  orbitRadius: number;
  periodSeconds: number;
  startAngle: number;
}

// Orbit-Radien in px — entsprechen den Ringen in Universe.astro
const PLANETS: PlanetConfig[] = [
  { id: 'hb1', orbitRadius: 220, periodSeconds: 120, startAngle: 0 },
  { id: 'hb2', orbitRadius: 170, periodSeconds: 90,  startAngle: Math.PI * 0.5 },
  { id: 'hb3', orbitRadius: 127, periodSeconds: 75,  startAngle: Math.PI },
  { id: 'hb4', orbitRadius: 92,  periodSeconds: 60,  startAngle: Math.PI * 1.5 },
];

let startTime: number | null = null;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getCenter(): { x: number; y: number } {
  const wrap = document.querySelector<HTMLElement>('.universe-wrap');
  if (!wrap) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const rect = wrap.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function positionPlanets(elapsed: number): void {
  const { x: cx, y: cy } = getCenter();
  const wrap = document.querySelector<HTMLElement>('.universe-wrap');

  PLANETS.forEach((cfg) => {
    const el = document.querySelector<HTMLElement>(`[data-planet-wrapper="${cfg.id}"]`);
    if (!el || !wrap) return;

    const angle = cfg.startAngle + (reduced ? 0 : (2 * Math.PI * elapsed) / cfg.periodSeconds);
    const wrapRect = wrap.getBoundingClientRect();

    // Position relativ zur Mitte des Universum-Wraps
    const px = wrapRect.width / 2 + cfg.orbitRadius * Math.cos(angle);
    const py = wrapRect.height / 2 + cfg.orbitRadius * Math.sin(angle);

    el.style.position = 'absolute';
    el.style.left = `${px}px`;
    el.style.top = `${py}px`;
  });
}

function tick(ts: number): void {
  if (startTime === null) startTime = ts;
  const elapsed = (ts - startTime) / 1000;
  positionPlanets(elapsed);
  if (!reduced) requestAnimationFrame(tick);
}

function init(): void {
  // Sofort auf Startposition setzen (verhindert Flackern)
  positionPlanets(0);

  if (!reduced) {
    requestAnimationFrame(tick);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

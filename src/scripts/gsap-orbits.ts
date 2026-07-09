/**
 * NORIVE ORBITAL DRAG SYSTEM v5
 * - Drag-Only: kein Auto-Orbit
 * - Single document listener: kein Memory Leak
 * - introAnimation: nur opacity (kein scale-Konflikt mit transform)
 * - positionOnOrbit: setzt alle inline-styles konsistent
 */
import { gsap } from 'gsap';

export interface OrbitDef { rx: number; ry: number; }
export interface BodyDef  { el: HTMLElement; orbitIndex: number; startAngle: number; }

const DRAG_THRESHOLD_MOUSE = 6;
const DRAG_THRESHOLD_TOUCH = 10;

let drag: {
  el: HTMLElement; orbit: OrbitDef; container: HTMLElement;
  moved: boolean; startX: number; startY: number;
  threshold: number; onRelease: (wasDragged: boolean) => void;
} | null = null;

let listenersAttached = false;

function angleFromPointer(container: HTMLElement, orbit: OrbitDef, cx: number, cy: number): number {
  const r   = container.getBoundingClientRect();
  const ox  = r.left + r.width  / 2;
  const oy  = r.top  + r.height / 2;
  const rxP = (orbit.rx / 100) * r.width;
  const ryP = (orbit.ry / 100) * r.height;
  return Math.atan2((cy - oy) / ryP, (cx - ox) / rxP);
}

export function positionOnOrbit(
  container: HTMLElement, el: HTMLElement, orbit: OrbitDef, angle: number
): void {
  const x     = 50 + orbit.rx * Math.cos(angle);
  const y     = 50 + orbit.ry * Math.sin(angle);
  const depth = (Math.sin(angle) + 1) / 2;

  el.style.left      = `${x}%`;
  el.style.top       = `${y}%`;
  el.style.transform = `translate(-50%, -50%) scale(${0.68 + 0.32 * depth})`;
  el.style.zIndex    = String(Math.floor(depth * 40) + 1);
  el.style.opacity   = String(0.60 + 0.40 * depth);
  el.dataset.currentAngle = String(angle);
}

function attachGlobalListeners(): void {
  if (listenersAttached) return;
  listenersAttached = true;

  document.addEventListener('mousemove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > drag.threshold) drag.moved = true;
    if (drag.moved) {
      positionOnOrbit(drag.container, drag.el, drag.orbit,
        angleFromPointer(drag.container, drag.orbit, e.clientX, e.clientY));
      drag.el.style.cursor = 'grabbing';
    }
  });

  document.addEventListener('mouseup', () => {
    if (!drag) return;
    drag.el.style.cursor = 'grab';
    drag.onRelease(drag.moved);
    drag = null;
  });

  document.addEventListener('touchmove', (e) => {
    if (!drag) return;
    e.preventDefault();
    const t  = e.touches[0];
    const dx = t.clientX - drag.startX, dy = t.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > drag.threshold) drag.moved = true;
    if (drag.moved) {
      positionOnOrbit(drag.container, drag.el, drag.orbit,
        angleFromPointer(drag.container, drag.el, t.clientX, t.clientY));
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!drag) return;
    drag.onRelease(drag.moved);
    drag = null;
  });
}

export function makeDraggable(
  container: HTMLElement, body: BodyDef, orbit: OrbitDef,
  onRelease: (wasDragged: boolean) => void
): void {
  attachGlobalListeners();
  const el = body.el;
  el.style.cursor = 'grab';

  // Native <a href>-Navigation IMMER unterdrücken: Im 3-State-System navigiert
  // niemals der direkte Klick auf ein Orbit-Objekt — nur der CTA-Button im
  // FocusPanel darf navigieren. Ohne dies würde ein Klick ohne Drag zwar
  // focusIn() auslösen, ABER GLEICHZEITIG die Browser-Standardnavigation des
  // <a>-Tags ausführen (click-Event, nicht mousedown!) und STATE 2 komplett
  // überspringen.
  el.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  const wrapped = (wasDragged: boolean) => {
    onRelease(wasDragged);
  };

  el.addEventListener('mousedown', (e) => {
    e.preventDefault();
    drag = { el, orbit, container, moved: false, startX: e.clientX, startY: e.clientY,
              threshold: DRAG_THRESHOLD_MOUSE, onRelease: wrapped };
  });

  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    drag = { el, orbit, container, moved: false, startX: t.clientX, startY: t.clientY,
              threshold: DRAG_THRESHOLD_TOUCH, onRelease: wrapped };
  }, { passive: false });
}

export function initDraggableOrbits(
  container: HTMLElement, orbits: OrbitDef[], bodies: BodyDef[],
  onRelease: (body: BodyDef, wasDragged: boolean) => void
): void {
  bodies.forEach(body => {
    const orbit = orbits[body.orbitIndex];
    if (!orbit) return;
    positionOnOrbit(container, body.el, orbit, body.startAngle);
    makeDraggable(container, body, orbit, (wasDragged) => onRelease(body, wasDragged));
  });
}

/** Nur opacity-Animation — kein scale-Konflikt mit positionOnOrbit-Transform */
export function introAnimation(bodies: BodyDef[], centralEl: HTMLElement | null): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (centralEl) {
    gsap.to(centralEl, { scale: 1.06, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  bodies.forEach((body, i) => {
    // Kurz auf 0 setzen, dann einblenden
    gsap.set(body.el, { opacity: 0 });
    gsap.to(body.el, {
      opacity: 0.60 + 0.40 * ((Math.sin(body.startAngle) + 1) / 2),
      duration: 0.65,
      delay: 0.1 + i * 0.08,
      ease: 'power2.out',
    });
  });
}

export function responsivePlanetSize(basePx: number): number {
  const vw = window.innerWidth;
  if (vw < 480)  return Math.round(basePx * 0.55);
  if (vw < 768)  return Math.round(basePx * 0.72);
  if (vw < 1024) return Math.round(basePx * 0.88);
  return basePx;
}

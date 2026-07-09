/**
 * TITAN — 3-STATE GSAP FOCUS CONTROLLER (v2)
 *
 * STATE 1: SYSTEM OVERVIEW  — Orbits/statische Objekte sichtbar, Drag aktiv
 * STATE 2: FOCUS & PREVIEW  — System zoomt weg (scale 2, opacity 0),
 *                             Objekt wandert als Hero-Kugel nach RECHTS,
 *                             typografisches Detail-Panel links blendet ein.
 *                             Navigation NUR über CTA-Button.
 * STATE 3: REVERSE          — Timeline rückwärts, zurück zu STATE 1.
 *
 * v2: Snapshot-basierte Rückkehr-Position statt Orbit-Neuberechnung.
 * Der Controller liest bei focusIn() die aktuellen Inline-Styles des
 * Objekts (gesetzt vom jeweiligen Positionierungs-Script — Orbit-Drag
 * ODER eine statisch zentrierte Position) und stellt bei focusOut()
 * exakt diesen Zustand wieder her. Dadurch ist der Controller unabhängig
 * von Orbit-Geometrie nutzbar — für Universum-, Galaxie- UND Planeten-
 * Ebene gleichermaßen, auch bei nur einem einzigen Objekt ohne Orbit.
 *
 * Norive Design System · Version 2.0 · 2026
 */
import { gsap } from 'gsap';

export interface FocusPanelData {
  eyebrow: string;
  titel: string;
  beschr: string;
  href: string;
  ctaText: string;
}

interface StyleSnapshot {
  left: string;
  top: string;
  width: string;
  height: string;
  transform: string;
  opacity: string;
  zIndex: string;
}

export interface FocusControllerOpts {
  stage: HTMLElement;
  /** Alle fokussierbaren Objekte (.universum-planet / .hf-planet / .theme-planet) */
  planets: HTMLElement[];
  /** System-Teile die beim Fokus wegzoomen (orbit-svg, central, intro) */
  systemParts: (HTMLElement | null)[];
  /** Extrahiert Panel-Daten aus dem geklickten Element */
  getData: (el: HTMLElement) => FocusPanelData;
  /** Hero-Kugel-Größe in px, abhängig vom Viewport */
  heroSize?: () => number;
}

export interface FocusController {
  focusIn: (el: HTMLElement) => void;
  focusOut: () => void;
  isActive: () => boolean;
  destroy: () => void;
}

const snapshots = new WeakMap<HTMLElement, StyleSnapshot>();

function snapshot(el: HTMLElement): StyleSnapshot {
  return {
    left: el.style.left, top: el.style.top,
    width: el.style.width, height: el.style.height,
    transform: el.style.transform, opacity: el.style.opacity,
    zIndex: el.style.zIndex,
  };
}

/** Zieldeckkraft eines Objekts in STATE 1 — respektiert Orbit-Tiefe falls vorhanden. */
function restingOpacity(el: HTMLElement): number {
  if (el.dataset.start === undefined) return 1;
  const angle = parseFloat(el.dataset.currentAngle ?? el.dataset.start ?? '0');
  return 0.60 + 0.40 * ((Math.sin(angle) + 1) / 2);
}

export function createFocusController(opts: FocusControllerOpts): FocusController {
  const panel    = document.getElementById('focus-panel');
  const inner    = panel?.querySelector<HTMLElement>('.fp-inner') ?? null;
  const backBtn  = document.getElementById('fp-back');
  const eyebrow  = document.getElementById('fp-eyebrow');
  const titelEl  = document.getElementById('fp-titel');
  const beschrEl = document.getElementById('fp-beschr');
  const cta      = document.getElementById('fp-cta') as HTMLAnchorElement | null;
  const ctaText  = document.getElementById('fp-cta-text');

  let active: HTMLElement | null = null;
  let tl: gsap.core.Timeline | null = null;

  const heroSize = opts.heroSize ?? (() => Math.min(300, window.innerWidth * 0.26));
  const systemParts = opts.systemParts.filter(Boolean) as HTMLElement[];

  /** Hero-Zielposition: rechte Bildhälfte, vertikal zentriert — als % der Stage */
  function heroTarget(): { left: number; top: number } {
    const r = opts.stage.getBoundingClientRect();
    const x = window.innerWidth  * 0.70;
    const y = window.innerHeight * 0.50;
    return {
      left: ((x - r.left) / r.width)  * 100,
      top:  ((y - r.top)  / r.height) * 100,
    };
  }

  // ── STATE 1 → 2 ─────────────────────────────────────────────
  function focusIn(el: HTMLElement): void {
    if (active || !panel || !inner) return;
    active = el;

    // Rückkehr-Snapshot des aktuellen Zustands sichern (orbit- oder statisch-positioniert)
    snapshots.set(el, snapshot(el));

    // Panel-Inhalte setzen
    const d = opts.getData(el);
    if (eyebrow)  eyebrow.textContent  = d.eyebrow;
    if (titelEl)  titelEl.textContent  = d.titel;
    if (beschrEl) beschrEl.textContent = d.beschr;
    if (cta)      cta.href             = d.href;
    if (ctaText)  ctaText.textContent  = d.ctaText;

    const others = opts.planets.filter(p => p !== el);
    const { left, top } = heroTarget();
    const size = heroSize();

    el.style.zIndex = '60';
    el.style.pointerEvents = 'none';
    others.forEach(p => { p.style.pointerEvents = 'none'; });

    tl?.kill();
    tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // 1) Restsystem: Kamera-Wegzoom (scale 2 + fade)
    if (others.length) tl.to(others, { opacity: 0, duration: 0.32, ease: 'power2.in' }, 0);
    tl.to(systemParts, {
      opacity: 0, scale: 2, transformOrigin: '50% 50%',
      duration: 0.6, ease: 'power2.inOut',
    }, 0);

    // 2) Hero-Kugel wandert nach rechts + wächst
    tl.to(el, {
      left: `${left}%`, top: `${top}%`,
      width: `${size}px`, height: `${size}px`,
      duration: 0.65, ease: 'power3.inOut',
      onUpdate() {
        el.style.transform = 'translate(-50%, -50%)';
        el.style.opacity   = '1';
      },
    }, 0.08);

    // 3) Panel links einblenden
    tl.add(() => {
      panel.style.pointerEvents = 'auto';
      panel.removeAttribute('data-hidden');
    }, 0.3);
    tl.fromTo(inner,
      { opacity: 0, x: -36 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
      0.35
    );
  }

  // ── STATE 2 → 1 (REVERSE) ───────────────────────────────────
  function focusOut(): void {
    if (!active || !panel || !inner) return;
    const el = active;
    active = null;

    const snap = snapshots.get(el);
    snapshots.delete(el);
    const others = opts.planets.filter(p => p !== el);

    tl?.kill();
    tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // 1) Panel ausblenden
    tl.to(inner, { opacity: 0, x: -28, duration: 0.28, ease: 'power2.in' }, 0);
    tl.add(() => {
      panel.style.pointerEvents = 'none';
      panel.setAttribute('data-hidden', '');
    }, 0.28);

    // 2) Hero-Kugel zurück auf exakt gesicherte Ausgangsposition
    if (snap) {
      // Scale/Rotation-Anteil des Transforms sofort übernehmen — nur
      // Position/Größe/Opacity werden sichtbar animiert (analog STATE 1→2).
      tl.add(() => { el.style.transform = snap.transform; }, 0.12);
      tl.to(el, {
        left: snap.left, top: snap.top,
        width: snap.width, height: snap.height,
        opacity: parseFloat(snap.opacity || '1'),
        duration: 0.55, ease: 'power2.inOut',
        onComplete() {
          el.style.zIndex        = snap.zIndex;
          el.style.pointerEvents = '';
        },
      }, 0.12);
    }

    // 3) System zurückzoomen
    tl.to(systemParts, {
      opacity: 1, scale: 1,
      duration: 0.55, ease: 'power2.out',
    }, 0.2);

    // 4) Andere Objekte auf ihre Orbit-Tiefe-Deckkraft zurückblenden
    others.forEach(p => {
      gsap.to(p, {
        opacity: restingOpacity(p), duration: 0.4, ease: 'power2.out', delay: 0.3,
        onComplete: () => { p.style.pointerEvents = ''; },
      });
    });
  }

  // ── EVENTS ──────────────────────────────────────────────────
  const onBack = () => focusOut();
  const onKey  = (e: KeyboardEvent) => { if (e.key === 'Escape' && active) focusOut(); };
  backBtn?.addEventListener('click', onBack);
  document.addEventListener('keydown', onKey);

  return {
    focusIn,
    focusOut,
    isActive: () => !!active,
    destroy() {
      tl?.kill();
      backBtn?.removeEventListener('click', onBack);
      document.removeEventListener('keydown', onKey);
      if (panel) { panel.style.pointerEvents = 'none'; panel.setAttribute('data-hidden', ''); }
      active = null;
    },
  };
}

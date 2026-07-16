/**
 * TITAN CAROUSEL ENGINE
 * Ersetzt das elliptische Drag-Orbit-System (gsap-orbits.ts) durch ein
 * Index-Modell: eine flache, geordnete Liste pro Stage, ein centerIndex.
 *
 * Zwei Modi:
 * - 'linear' (Seite 3, Planeten): Items reihen sich mit abnehmendem Abstand
 *   links/rechts bzw. oben/unten auf, endet an den Rändern der Liste.
 * - 'ring' (Seite 1+2, Universum/Galaxie): Items sitzen auf einer Ellipse und
 *   rotieren endlos um einen festen Mittelpunkt (wo die Caption sitzt) —
 *   das ausgewählte Item ist immer vorne-unten (größer, opak), der Rest
 *   rotiert nach hinten/oben (kleiner, blasser), volle Umdrehung = zurück
 *   zum Start.
 *
 * Beide Modi teilen sich Tastatur/Klick/Swipe-Steuerung (Tap oder ein
 * Schritt Swipe — kein freies Ziehen).
 */
import { gsap } from 'gsap';

export type Orientation = 'horizontal' | 'vertical';
export type CarouselMode = 'linear' | 'ring';

export interface RingGeometry {
  /** Radien als Anteil der Containergröße — echte 3D-Tiefe (rz) statt manueller scale(). */
  rxRatio?: number; ryRatio?: number; rzRatio?: number;
}

export interface CarouselOpts {
  /** Enthält die Items, definiert die Ziehfläche (pointer-Events). */
  container: HTMLElement;
  items: HTMLElement[];
  orientation: Orientation;
  mode?: CarouselMode;
  ring?: RingGeometry;
  startIndex?: number;
  /** Nur 'linear': wie viele Nachbarn je Seite sichtbar bleiben (Rest opacity:0). */
  maxVisible?: number;
  /** Einmaliger Bedienhinweis beim allerersten Besuch (siehe HINT_STORAGE_KEY). */
  showHint?: boolean;
  onCenterChange: (index: number, el: HTMLElement) => void;
}

export interface CarouselController {
  goTo(index: number): void;
  next(): void;
  prev(): void;
  getCenterIndex(): number;
  destroy(): void;
}

const BASE_STEP_RATIO = 0.24; // 'linear': Basisabstand zum ersten Nachbarn, relativ zur Containergröße
const DECAY = 0.72;           // 'linear': geometrische Abnahme des Abstands je weiterem Nachbarn
const SWIPE_THRESHOLD_PX = 60;
const SWIPE_VELOCITY_PX_MS = 0.5;

const RING_DEFAULTS: Required<RingGeometry> = { rxRatio: 0.30, ryRatio: 0.24, rzRatio: 0.42 };

function reduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Geschlossene Form der geometrischen Reihe — funktioniert auch für fraktionale Offsets (Drag-Preview). */
function linearDistanceFor(absOffset: number, baseStep: number): number {
  if (absOffset === 0) return 0;
  return (baseStep * (1 - Math.pow(DECAY, absOffset))) / (1 - DECAY);
}

function linearTransformFor(offset: number, maxVisible: number, baseStep: number) {
  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : Math.sign(offset);
  const dist = linearDistanceFor(abs, baseStep) * sign;
  // Seite 3 (Premium-Look): das ausgewählte Item steht prominent groß in der
  // Mitte, die direkten Nachbarn (mit maxVisible=1 sind nur diese sichtbar)
  // sind deutlich kleiner UND blasser — dadurch mehr Luft und klare Hierarchie.
  const scale = Math.max(0.5, 1.45 - 0.7 * abs);
  const visible = abs <= maxVisible + 0.5; // +0.5 Toleranz für Drag-Zwischenwerte
  const opacity = visible ? Math.max(0.1, 1 - 0.55 * abs) : 0;
  const zIndex = Math.round(100 - abs * 10);
  return { dist, scale, opacity, zIndex };
}

interface RingRadiiPx { rx: number; ry: number; rz: number; }

function computeRingRadii(container: HTMLElement, geo: Required<RingGeometry>): RingRadiiPx {
  const r = container.getBoundingClientRect();
  return {
    rx: r.width * geo.rxRatio,
    ry: r.height * geo.ryRatio,
    rz: r.width * geo.rzRatio,
  };
}

/**
 * Ring-Position: offset=0 liegt immer vorne-unten (angle=π/2). Jedes weitere
 * Item rückt um 2π/N auf der Ellipse weiter — nach einer vollen Umdrehung
 * (offset=N) ist man wieder am Ausgangspunkt, daher braucht `next()`/`prev()`
 * keine Sonderbehandlung für den Umlauf, nur `goTo()` muss den Index modulo N
 * normalisieren.
 *
 * Echte 3D-Tiefe: x/y/z sind reale px-Verschiebungen (translate3d), keine
 * manuelle scale()-Annäherung — der Browser berechnet die scheinbare Größe
 * über die `perspective` des Containers. sin(angle) treibt sowohl die
 * Vertikal- als auch die Tiefenverschiebung gemeinsam (ein leicht gekippter
 * Ring), damit "vorne" zugleich unten UND am nächsten an der Kamera liegt.
 */
function ringTransformFor(offset: number, count: number, radii: RingRadiiPx) {
  const angle = Math.PI / 2 + offset * ((2 * Math.PI) / count);
  const x = radii.rx * Math.cos(angle);
  const y = radii.ry * Math.sin(angle);
  const z = radii.rz * Math.sin(angle);
  const depth = (Math.sin(angle) + 1) / 2; // 0 hinten/oben .. 1 vorne/unten — nur für Opacity/z-index
  const opacity = Math.min(1, Math.max(0.15, 0.15 + 0.85 * depth));
  const zIndex = Math.round(depth * 100);
  return { x, y, z, opacity, zIndex };
}

function normalizeRingIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

const HINT_STORAGE_KEY = 'titan-carousel-hint-seen';

/**
 * Einmaliger Bedienhinweis für Erstbesucher — Pfeile/Wischen/Klick sind sonst
 * nirgendwo erklärt. Verschwindet nach der ersten echten Interaktion oder
 * nach 4s von selbst, und wird danach nie wieder gezeigt (localStorage-Flag,
 * gilt seitenübergreifend für alle drei Karussells).
 */
function maybeShowHint(mountEl: HTMLElement): (() => void) {
  if (localStorage.getItem(HINT_STORAGE_KEY)) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    localStorage.setItem(HINT_STORAGE_KEY, '1');
    return () => {};
  }

  const hint = document.createElement('div');
  hint.className = 'carousel-hint';
  hint.setAttribute('role', 'status');
  hint.textContent = 'Pfeiltasten, Wischen oder Klick zum Navigieren';
  mountEl.appendChild(hint);
  requestAnimationFrame(() => hint.classList.add('is-visible'));

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    hint.classList.remove('is-visible');
    setTimeout(() => hint.remove(), 400);
    localStorage.setItem(HINT_STORAGE_KEY, '1');
  }
  const timer = setTimeout(dismiss, 6000);
  return () => { clearTimeout(timer); dismiss(); };
}

export function initCarousel(opts: CarouselOpts): CarouselController {
  const { container, items, orientation, onCenterChange } = opts;
  const mode = opts.mode ?? 'linear';
  const maxVisible = opts.maxVisible ?? 2;
  const ringGeo = { ...RING_DEFAULTS, ...opts.ring };
  const count = items.length;

  let centerIndex = mode === 'ring'
    ? normalizeRingIndex(opts.startIndex ?? 0, count)
    : Math.min(Math.max(opts.startIndex ?? 0, 0), count - 1);

  const dismissHint = (opts.showHint && count > 1 && container.parentElement)
    ? maybeShowHint(container.parentElement)
    : () => {};

  let baseStep = 0;
  function computeBaseStep(): void {
    const r = container.getBoundingClientRect();
    const size = orientation === 'horizontal' ? r.width : r.height;
    baseStep = size * BASE_STEP_RATIO;
  }
  computeBaseStep();

  let ringRadii = mode === 'ring' ? computeRingRadii(container, ringGeo) : null;
  if (mode === 'ring') {
    // Anker etwas oberhalb der Mitte — bei top:50% verschwand das vorderste,
    // größte Element (Anker + positiver y-Versatz) unten aus dem sichtbaren
    // Bereich der Stage (overflow:hidden). top:35% gibt genug Puffer nach unten.
    gsap.set(items, { left: '50%', top: '35%' });
  }

  /** Setzt/animiert alle Items relativ zu einem (ggf. fraktionalen) virtuellen Center. */
  function render(virtualCenter: number, animate: boolean): void {
    items.forEach((el, i) => {
      if (mode === 'ring' && ringRadii) {
        const { x, y, z, opacity, zIndex } = ringTransformFor(i - virtualCenter, count, ringRadii);
        const transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`;
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = opacity < 0.2 ? 'none' : '';

        if (animate && !reduceMotion()) {
          gsap.to(el, { transform, opacity, duration: 0.55, ease: 'power3.inOut', overwrite: 'auto' });
        } else {
          gsap.set(el, { transform, opacity });
        }
        return;
      }

      const { dist, scale, opacity, zIndex } = linearTransformFor(i - virtualCenter, maxVisible, baseStep);
      const transform = orientation === 'horizontal'
        ? `translate(calc(-50% + ${dist}px), -50%) scale(${scale})`
        : `translate(-50%, calc(-50% + ${dist}px)) scale(${scale})`;

      el.style.zIndex = String(zIndex);
      el.style.pointerEvents = opacity < 0.05 ? 'none' : '';

      if (animate && !reduceMotion()) {
        gsap.to(el, { transform, opacity, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      } else {
        gsap.set(el, { transform, opacity });
      }
    });
  }

  function goTo(index: number): void {
    dismissHint();
    const target = mode === 'ring' ? normalizeRingIndex(index, count) : Math.min(Math.max(index, 0), count - 1);
    // Im Ring-Modus den kürzeren Rotationsweg wählen (z. B. von letztem zu
    // erstem Item eine Position vor statt (N-1) Positionen zurück).
    let renderTarget = target;
    if (mode === 'ring') {
      let delta = target - centerIndex;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      renderTarget = centerIndex + delta;
    }
    render(renderTarget, true);
    if (target !== centerIndex) {
      centerIndex = target;
      onCenterChange(centerIndex, items[centerIndex]);
    }
  }

  function next(): void { goTo(centerIndex + 1); }
  function prev(): void { goTo(centerIndex - 1); }

  // ── Tastatur ──
  const onKeydown = (e: KeyboardEvent) => {
    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    } else {
      if (e.key === 'ArrowDown') next();
      else if (e.key === 'ArrowUp') prev();
    }
  };
  container.addEventListener('keydown', onKeydown);

  // ── Ziehen/Tippen: 1:1-Tracking während der Geste, Entscheidung bei Loslassen ──
  // Tap-vs-Swipe wird vollständig hier entschieden (nicht über das native
  // 'click'-Event) — setPointerCapture kann je nach Browser dazu führen, dass
  // 'click' gar nicht mehr am ursprünglichen Item ankommt. Navigation der
  // <a>-Items wird ebenfalls hier unterdrückt (Modell B+: nur der CTA in der
  // Caption darf navigieren).
  let dragging = false;
  let dragStartPos = 0;
  let dragStartTime = 0;
  let dragStartCenter = 0;
  let dragStartTargetIndex: number | null = null;

  function pointerPos(e: PointerEvent): number {
    return orientation === 'horizontal' ? e.clientX : e.clientY;
  }

  function itemIndexFromTarget(target: EventTarget | null): number | null {
    if (!(target instanceof Node)) return null;
    const i = items.findIndex(el => el.contains(target));
    return i === -1 ? null : i;
  }

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    dragging = true;
    dragStartPos = pointerPos(e);
    dragStartTime = performance.now();
    dragStartCenter = centerIndex;
    dragStartTargetIndex = itemIndexFromTarget(e.target);
    computeBaseStep();
    container.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const delta = pointerPos(e) - dragStartPos;
    const virtual = dragStartCenter - delta / baseStep;
    if (mode === 'ring') {
      render(virtual, false); // periodische Ellipse braucht kein Clamping — sie umläuft von selbst
      return;
    }
    const min = 0, max = count - 1;
    const clampedVirtual = virtual < min ? min + (virtual - min) * 0.3
      : virtual > max ? max + (virtual - max) * 0.3
      : virtual;
    render(clampedVirtual, false);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    dragging = false;
    const delta = pointerPos(e) - dragStartPos;
    const elapsed = Math.max(1, performance.now() - dragStartTime);
    const velocity = Math.abs(delta) / elapsed;
    const crossed = Math.abs(delta) > SWIPE_THRESHOLD_PX || velocity > SWIPE_VELOCITY_PX_MS;

    if (crossed) {
      goTo(dragStartCenter + (delta < 0 ? 1 : -1));
    } else if (dragStartTargetIndex !== null && dragStartTargetIndex !== centerIndex) {
      // Tap auf ein Nicht-Center-Item → zentrieren (kein Zoom-Schritt, Modell B+)
      goTo(dragStartTargetIndex);
    } else {
      // Tap auf das bereits zentrierte Item oder auf leere Fläche → No-Op-Refresh
      goTo(dragStartCenter);
    }
  };

  // Klick-Navigation der <a>-Items immer unterdrücken (Sicherheitsnetz zusätzlich
  // zu preventDefault in pointerdown/pointerup — Navigation nur über CTA).
  // Bewusst KEIN stopPropagation(): Konzept-/Mein-Bereich-Panels schließen sich
  // per document-Klick-außerhalb-Listener — stopPropagation würde diesen Klick
  // nie dort ankommen lassen und die Panels ließen sich nicht mehr per Klick
  // auf die Karussell-Fläche schließen.
  const onClickCapture = (e: MouseEvent) => { e.preventDefault(); };
  container.addEventListener('click', onClickCapture, true);

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerup', onPointerUp);
  container.addEventListener('pointercancel', onPointerUp);

  // ── Reflow bei Größenänderung / Orientierungswechsel (#1) ──
  // Ring-Radien (rx/ry/rz) UND Basisschritt hängen an der Containergröße. Ohne
  // Neuberechnung driftet das ausgewählte Item nach Fenster-Resize oder Tablet-
  // Drehung aus der Idealposition (unten-mittig, angeschnitten). Per rAF
  // gebündelt, damit ein Resize-Sturm keinen Layout-Thrash erzeugt.
  let reflowRaf = 0;
  const onReflow = () => {
    cancelAnimationFrame(reflowRaf);
    reflowRaf = requestAnimationFrame(() => {
      computeBaseStep();
      if (mode === 'ring') ringRadii = computeRingRadii(container, ringGeo);
      render(centerIndex, false);
    });
  };
  const resizeObserver = new ResizeObserver(onReflow);
  resizeObserver.observe(container);
  window.addEventListener('orientationchange', onReflow);

  // ── Initiale Positionierung (kein Flash, kein Tween) ──
  render(centerIndex, false);
  onCenterChange(centerIndex, items[centerIndex]);

  return {
    goTo,
    next,
    prev,
    getCenterIndex: () => centerIndex,
    destroy() {
      container.removeEventListener('click', onClickCapture, true);
      container.removeEventListener('keydown', onKeydown);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', onReflow);
      cancelAnimationFrame(reflowRaf);
      gsap.killTweensOf(items);
    },
  };
}

/** Verdrahtet die Positions-Punkte einer CarouselStage (Klick → goTo). */
export function wireDots(stageId: string, controller: CarouselController): void {
  const dotsContainer = document.getElementById(`${stageId}-dots`);
  if (!dotsContainer) return;
  dotsContainer.querySelectorAll<HTMLElement>('.carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => controller.goTo(i));
  });
}

/** Aktualisiert die aktive Positions-Punkt-Anzeige nach einem Center-Wechsel. */
export function updateDots(stageId: string, activeIndex: number): void {
  const dotsContainer = document.getElementById(`${stageId}-dots`);
  if (!dotsContainer) return;
  dotsContainer.querySelectorAll<HTMLElement>('.carousel-dot').forEach((dot, i) => {
    dot.dataset.active = String(i === activeIndex);
  });
}

export function responsivePlanetSize(basePx: number): number {
  const vw = window.innerWidth;
  if (vw < 480) return Math.round(basePx * 0.55);
  if (vw < 768) return Math.round(basePx * 0.72);
  if (vw < 1024) return Math.round(basePx * 0.88);
  return basePx;
}

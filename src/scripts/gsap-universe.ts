/**
 * NORIVE GSAP UNIVERSE
 * Animationen für Universum und Planeten.
 * Wichtig: KEINE e.preventDefault() auf Links — native Navigation bleibt erhalten.
 * GSAP ergänzt nur visuelle Effekte, blockiert aber niemals die Navigation.
 * Version: 1.1 · 2026
 */

import { gsap } from 'gsap';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── PLANET-LERNSEITE ──────────────────────────────────────

export function initPlanetEntry(): void {
  const content = document.querySelector<HTMLElement>('.thema-wrap');
  if (!content || reduced) return;

  gsap.from(content, { opacity: 0, y: 18, duration: 0.65, ease: 'power3.out', delay: 0.08 });

  // Scroll-Reveal für Phasen
  const phasen = document.querySelectorAll<HTMLElement>('.lern-phase');
  if (!phasen.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          gsap.to(e.target, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );

  phasen.forEach((phase, i) => {
    if (i > 0) {
      gsap.set(phase, { opacity: 0, y: 24 });
      obs.observe(phase);
    }
  });
}

// ── STERNFELD ─────────────────────────────────────────────

export function initGSAPStarfield(): void {
  const canvas = document.getElementById('starfield-canvas') as HTMLCanvasElement | null;
  if (!canvas || reduced) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;

  const resize = () => {
    canvas.width  = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
  };
  resize();

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  const COUNT = 1600;
  const stars = Array.from({ length: COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.3 + Math.random() * 1.35,
    opacity: 0.1 + Math.random() * 0.55,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(218,208,190,${s.opacity})`;
      ctx.fill();
    });
  };

  draw();

  const twinkle = () => {
    const s = stars[Math.floor(Math.random() * COUNT)];
    const orig = s.opacity;
    gsap.to(s, {
      opacity: Math.random() * 0.55 + 0.05,
      duration: 1.4 + Math.random() * 1.8,
      ease: 'sine.inOut',
      onUpdate: draw,
      onComplete: () => gsap.to(s, {
        opacity: orig,
        duration: 1 + Math.random() * 1.8,
        ease: 'sine.inOut',
        onUpdate: draw,
      }),
    });
  };

  gsap.ticker.add(() => { if (Math.random() < 0.07) twinkle(); });
}

// ── INIT ──────────────────────────────────────────────────

export function initUniverseAnimations(): void {
  initGSAPStarfield();
  initPlanetEntry();
}

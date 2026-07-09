/**
 * NORIVE GSAP UNIVERSE
 * Animationen für Universum und Planeten.
 * Wichtig: KEINE e.preventDefault() auf Links — native Navigation bleibt erhalten.
 * GSAP ergänzt nur visuelle Effekte, blockiert aber niemals die Navigation.
 * Version: 1.1 · 2026
 */

import { gsap } from 'gsap';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── STARTSEITE: Universum-Globen ───────────────────────────

export function initUniversumGloben(): void {
  const globen = document.querySelectorAll<HTMLAnchorElement>('.universum-link');
  if (!globen.length) return;

  if (reduced) {
    gsap.set(globen, { opacity: 1 });
    return;
  }

  // Intro: Globen einschweben (NACH CSS-Sichtbarkeit, nur Enhancement)
  gsap.set(globen, { opacity: 0, y: 30, scale: 0.88 });
  gsap.to(globen, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.0,
    ease: 'power3.out',
    stagger: 0.15,
    delay: 0.2,
  });

  // Ringe rotieren
  document.querySelectorAll<SVGElement>('.u-ring-outer').forEach((r) => {
    gsap.to(r, { rotation: 360, duration: 80, repeat: -1, ease: 'none', transformOrigin: 'center center' });
  });
  document.querySelectorAll<SVGElement>('.u-ring-mid').forEach((r) => {
    gsap.to(r, { rotation: -360, duration: 55, repeat: -1, ease: 'none', transformOrigin: 'center center' });
  });
  document.querySelectorAll<SVGElement>('.u-ring-inner').forEach((r) => {
    gsap.to(r, { rotation: 360, duration: 38, repeat: -1, ease: 'none', transformOrigin: 'center center' });
  });

  // Mini-Planeten pulsieren
  document.querySelectorAll<SVGElement>('.u-mini-planet').forEach((dot, i) => {
    gsap.to(dot, {
      opacity: 0.15,
      duration: 1.6 + i * 0.25,
      repeat: -1, yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.12,
    });
  });

  // Hover-Effekte (KEIN preventDefault, native Navigation bleibt)
  globen.forEach((glob) => {
    const svg = glob.querySelector<SVGElement>('.universum-svg');
    const center = glob.querySelector<SVGCircleElement>('.u-center-dot');

    glob.addEventListener('mouseenter', () => {
      if (!svg) return;
      gsap.to(svg, {
        scale: 1.08,
        duration: 0.4,
        ease: 'back.out(1.4)',
        filter: 'drop-shadow(0 0 24px rgba(196,168,130,0.48)) drop-shadow(0 0 56px rgba(196,168,130,0.18))',
      });
      if (center) gsap.to(center, { attr: { r: 6.5 }, duration: 0.3, ease: 'power2.out' });
    });

    glob.addEventListener('mouseleave', () => {
      if (!svg) return;
      gsap.to(svg, { scale: 1, duration: 0.45, ease: 'power2.inOut', filter: 'none' });
      if (center) gsap.to(center, { attr: { r: 4 }, duration: 0.3 });
    });

    // Visuelles Feedback beim Klick — KEIN preventDefault
    glob.addEventListener('click', () => {
      if (!svg) return;
      gsap.to(svg, { scale: 1.15, duration: 0.15, ease: 'power1.out' });
    });
  });
}

// ── UNIVERSUM-INNENANSICHT: Planeten ──────────────────────

export function initPlanetField(): void {
  const planeten = document.querySelectorAll<HTMLAnchorElement>('.thema-planet');
  if (!planeten.length) return;

  if (reduced) return; // Planeten bleiben sichtbar, kein GSAP

  // Einflug-Animation — Planeten sind im CSS bereits sichtbar (kein opacity:0 als Default)
  // GSAP animiert von scale:0.5, damit es einen schönen Einflug gibt
  gsap.from(planeten, {
    scale: 0.4,
    opacity: 0,
    duration: 0.65,
    ease: 'back.out(1.5)',
    stagger: { amount: 1.0, from: 'center' },
    delay: 0.15,
    clearProps: 'all', // Wichtig: danach keine GSAP-overrides auf transform
  });

  // Float-Animation
  planeten.forEach((planet, i) => {
    const amplitude = 5 + (i % 3) * 3;
    const duration  = 3.2 + (i % 5) * 0.7;
    gsap.to(planet, {
      y: `-=${amplitude}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.12,
    });
  });

  // Hover (KEIN preventDefault, native Navigation bleibt)
  planeten.forEach((planet) => {
    const svg = planet.querySelector<SVGElement>('.planet-svg');
    if (!svg) return;

    planet.addEventListener('mouseenter', () => {
      gsap.killTweensOf(planet, 'y');
      gsap.to(svg, {
        scale: 1.18,
        filter: 'drop-shadow(0 0 14px rgba(196,168,130,0.6)) drop-shadow(0 0 36px rgba(196,168,130,0.24))',
        duration: 0.3,
        ease: 'back.out(1.5)',
      });
    });

    planet.addEventListener('mouseleave', () => {
      gsap.to(svg, {
        scale: 1,
        filter: 'none',
        duration: 0.38,
        ease: 'power2.inOut',
        onComplete: () => {
          // Float wieder aufnehmen
          const i = [...planeten].indexOf(planet);
          gsap.to(planet, {
            y: `-=${5 + (i % 3) * 3}`,
            duration: 3.2 + (i % 5) * 0.7,
            repeat: -1, yoyo: true, ease: 'sine.inOut',
          });
        },
      });
    });
  });
}

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
  initUniversumGloben();
  initPlanetField();
  initPlanetEntry();
}

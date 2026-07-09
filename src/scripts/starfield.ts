/**
 * NORIVE STARFIELD
 * Canvas-based warm-toned star animation for the universe view.
 * Fully respects prefers-reduced-motion.
 * Version: 1.0 · 2026
 */

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
  opacityDir: number;
  twinkleSpeed: number;
}

const STAR_COUNT = 1600;
const TWINKLE_CHANCE = 0.004; // probability per frame to start twinkling

// Norive warm palette — never pure white or blue
const STAR_OPACITY_MIN = 0.15;
const STAR_OPACITY_MAX = 0.75;
const STAR_RADIUS_MIN = 0.4;
const STAR_RADIUS_MAX = 1.8;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let stars: Star[] = [];
let animId: number | null = null;
let dpr = 1;

function init(): void {
  canvas = document.getElementById('starfield-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  dpr = window.devicePixelRatio || 1;
  resize();
  generateStars();
  animate();

  window.addEventListener('resize', debounce(resize, 200));
}

function resize(): void {
  if (!canvas || !ctx) return;
  dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.scale(dpr, dpr);
  generateStars();
}

function generateStars(): void {
  if (!canvas) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  stars = Array.from({ length: STAR_COUNT }, () => {
    const opacity = STAR_OPACITY_MIN + Math.random() * (STAR_OPACITY_MAX - STAR_OPACITY_MIN);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      radius: STAR_RADIUS_MIN + Math.random() * (STAR_RADIUS_MAX - STAR_RADIUS_MIN),
      baseOpacity: opacity,
      opacity,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      twinkleSpeed: 0.003 + Math.random() * 0.006,
    };
  });
}

function drawStars(): void {
  if (!ctx || !canvas) return;
  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  stars.forEach((star) => {
    // Subtle twinkle
    if (Math.random() < TWINKLE_CHANCE) {
      star.opacityDir *= -1;
    }
    star.opacity += star.opacityDir * star.twinkleSpeed;
    if (star.opacity > STAR_OPACITY_MAX) { star.opacity = STAR_OPACITY_MAX; star.opacityDir = -1; }
    if (star.opacity < STAR_OPACITY_MIN) { star.opacity = STAR_OPACITY_MIN; star.opacityDir = 1; }

    ctx!.beginPath();
    ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    // Warm sand tones from Norive palette
    ctx!.fillStyle = `rgba(220, 210, 195, ${star.opacity})`;
    ctx!.fill();
  });
}

function animate(): void {
  drawStars();
  animId = requestAnimationFrame(animate);
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * CAROUSEL CAPTION SYNC
 * Ersetzt die 3-State-Zoom-Choreografie (gsap-focus.ts) durch einen
 * einzigen Schritt: sobald das Karussell ein neues Center-Item meldet,
 * werden Eyebrow/Titel/Beschreibung/CTA aus dessen data-*-Attributen
 * gelesen und per kurzem Crossfade eingeblendet. Kein Snapshot/Restore,
 * kein zweiter verlassbarer Zustand — Navigation passiert ausschließlich
 * über den CTA-Link.
 */
import { gsap } from 'gsap';

export interface CaptionEls {
  root: HTMLElement;
  eyebrow: HTMLElement | null;
  titel: HTMLElement | null;
  beschr: HTMLElement | null;
  cta: HTMLAnchorElement | null;
  ctaText: HTMLElement | null;
}

export interface CaptionData {
  eyebrow: string;
  titel: string;
  beschr: string;
  href: string;
  ctaText: string;
}

export interface CaptionSync {
  sync(el: HTMLElement): void;
  destroy(): void;
}

export function createCaptionSync(
  els: CaptionEls,
  getData: (el: HTMLElement) => CaptionData,
): CaptionSync {
  let tl: gsap.core.Timeline | null = null;

  function apply(d: CaptionData): void {
    if (els.eyebrow) els.eyebrow.textContent = d.eyebrow;
    if (els.titel) els.titel.textContent = d.titel;
    if (els.beschr) els.beschr.textContent = d.beschr;
    if (els.ctaText) els.ctaText.textContent = d.ctaText;

    if (els.cta) {
      const disabled = !d.href;
      els.cta.classList.toggle('is-disabled', disabled);
      els.cta.setAttribute('aria-disabled', String(disabled));
      if (disabled) els.cta.removeAttribute('href');
      else els.cta.href = d.href;
    }
  }

  function sync(el: HTMLElement): void {
    const d = getData(el);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(d);
      gsap.set(els.root, { opacity: 1, y: 0 });
      return;
    }

    // Ruhig/organisch (Kosmos-Gefühl): sanftes Aus- und Einblenden.
    tl?.kill();
    tl = gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(els.root, { opacity: 0, y: 10, duration: 0.28, ease: 'sine.in' })
      .add(() => apply(d))
      .to(els.root, { opacity: 1, y: 0, duration: 0.5, ease: 'sine.out' });
  }

  return {
    sync,
    destroy() { tl?.kill(); },
  };
}

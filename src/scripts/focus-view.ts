/**
 * FOCUS VIEW — Steuerung des Zoom-Zwischenschritts (siehe FocusView.astro).
 *
 * openFocus() klont die aktuell zentrierte Kugel, setzt sie vergrößert rechts
 * ein und füllt die Info links; „Weiter" (Anchor) navigiert, „Zurück"/ESC/
 * Backdrop schließen. Bewusst wiederverwendbar für Seite 1/2/3 — jede Seite
 * ruft openFocus mit ihren Daten auf.
 */

export interface FocusData {
  eyebrow: string;
  titel: string;
  beschr: string;
  meta: string;
  href: string;
  weiterText: string;
}

function reduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setText(id: string, value: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/** Öffnet den Fokus-Zustand mit einer Kopie der übergebenen Kugel. */
export function openFocus(globeEl: HTMLElement, d: FocusData): void {
  const fv = document.getElementById('focus-view');
  const mount = document.getElementById('fv-globe-mount');
  if (!fv || !mount) return;

  setText('fv-eyebrow', d.eyebrow);
  setText('fv-titel', d.titel);
  setText('fv-beschr', d.beschr);
  setText('fv-meta', d.meta);
  setText('fv-weiter-text', d.weiterText);

  const weiter = document.getElementById('fv-weiter') as HTMLAnchorElement | null;
  if (weiter) weiter.href = d.href;

  // Kugel klonen und einsetzen (SVG-Gradient-IDs bleiben gültig, da die
  // Definition identisch ist; Klicks auf den Klon werden per CSS deaktiviert).
  mount.replaceChildren();
  const clone = globeEl.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.removeAttribute('href');
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('tabindex', '-1');
  clone.classList.add('fv-globe');
  mount.appendChild(clone);

  fv.removeAttribute('hidden');
  if (reduceMotion()) {
    fv.classList.add('is-open');
  } else {
    requestAnimationFrame(() => requestAnimationFrame(() => fv.classList.add('is-open')));
  }
  document.getElementById('fv-zurueck')?.focus();
}

export function closeFocus(): void {
  const fv = document.getElementById('focus-view');
  if (!fv || fv.hasAttribute('hidden')) return;
  fv.classList.remove('is-open');
  const finish = () => {
    fv.setAttribute('hidden', '');
    document.getElementById('fv-globe-mount')?.replaceChildren();
  };
  if (reduceMotion()) finish();
  else setTimeout(finish, 320);
}

export function isFocusOpen(): boolean {
  const fv = document.getElementById('focus-view');
  return !!fv && !fv.hasAttribute('hidden');
}

/** Pro Seite (astro:page-load) neu verdrahten — Buttons werden ersetzt. */
export function initFocusView(): void {
  document.getElementById('fv-zurueck')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeFocus();
  });
  // Klick auf den Backdrop (Overlay selbst, nicht der Inhalt) schließt.
  document.getElementById('focus-view')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeFocus();
  });
  // „Weiter" ist ein Anchor und navigiert selbst (ClientRouter).
}

// ── EINMALIG (Modul-Top-Level, überlebt Navigation): ESC schließt ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isFocusOpen()) closeFocus();
});

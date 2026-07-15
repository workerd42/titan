/**
 * NORIVE SYNC — Local-First-Brücke zum Account (Phase 2 Fundament).
 *
 * Prinzip: localStorage bleibt die schnelle Arbeitskopie und funktioniert
 * unverändert OHNE Login (anonymes Lernen). Nur WENN eine Session besteht,
 * wird der Stand zusätzlich mit dem Server abgeglichen.
 *
 * Ablauf bei aktiver Session:
 *  1. Beim Laden einmalig PUSH des lokalen Stands → Server merged autoritativ
 *     (Union) → gemergtes Ergebnis zurück in localStorage schreiben.
 *     Das deckt beide Fälle ab: frisch eingeloggt (lokaler Stand wandert in
 *     den Account) und neues Gerät (Server-Stand kommt herunter).
 *  2. Danach bei jeder Änderung (Events aus norive-progress.ts / kompass.ts)
 *     entprellt erneut pushen.
 */
const PROGRESS_KEY = 'norive-progress-v2';
const KOMPASS_KEY = 'norive-kompass-v1';
const DEBOUNCE_MS = 1200;

function readLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage voll/blockiert — Seite bleibt nutzbar */
  }
}

let hasSession = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let syncing = false;

async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/get-session', { headers: { Accept: 'application/json' } });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.user);
  } catch {
    return false;
  }
}

/** Push lokal → Server, gemergtes Ergebnis zurück in localStorage. */
async function pushAndAdopt(): Promise<void> {
  if (!hasSession || syncing) return;
  syncing = true;
  try {
    const res = await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        progress: readLS(PROGRESS_KEY),
        kompass: readLS(KOMPASS_KEY),
      }),
    });
    if (res.status === 401) {
      // Session abgelaufen → still zurück in den anonymen Modus.
      hasSession = false;
      return;
    }
    if (!res.ok) return;

    const { progress, kompass } = await res.json();
    if (progress) writeLS(PROGRESS_KEY, progress);
    if (kompass) writeLS(KOMPASS_KEY, kompass);

    // Bewusst ein EIGENES Event: 'norive:kompass-updated' bedeutet "der Nutzer
    // hat seinen Kompass bearbeitet" und öffnet deshalb "Mein Bereich" — das
    // darf ein Server-Sync nicht auslösen (Panel würde bei jedem Login
    // aufspringen). 'norive:synced' heißt nur: "Daten kamen vom Server, bitte
    // neu rendern". Verhindert nebenbei eine Push-Schleife, da der Sync auf
    // sein eigenes Event nicht hört.
    if (progress || kompass) {
      window.dispatchEvent(new CustomEvent('norive:synced'));
    }
  } catch {
    /* offline o.ä. — lokal weiterarbeiten, nächster Push versucht es erneut */
  } finally {
    syncing = false;
  }
}

function schedulePush(): void {
  if (!hasSession) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(pushAndAdopt, DEBOUNCE_MS);
}

async function initSync(): Promise<void> {
  hasSession = await checkSession();
  document.documentElement.dataset.session = hasSession ? 'in' : 'out';
  if (!hasSession) return;
  await pushAndAdopt();
}

// Änderungen am Lernstand → entprellt synchronisieren.
// (Die Events feuern aus norive-progress.ts bzw. kompass.ts.)
window.addEventListener('norive:progress-updated', schedulePush);
window.addEventListener('norive:kompass-updated', schedulePush);

document.addEventListener('astro:page-load', initSync);
if (document.readyState !== 'loading') initSync();

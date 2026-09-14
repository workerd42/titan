/**
 * Toast — kurze, deutliche Rückmeldung nach einer Aktion (Phase abgeschlossen,
 * Artefakt gespeichert). Ruhig ein-/ausblendend (Kosmos-Timing). Styles in
 * styles/modules.css (.zendify-toast).
 */
export function showToast(msg: string): void {
  let t = document.getElementById('zendify-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'zendify-toast';
    t.id = 'zendify-toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.setAttribute('data-show', 'true');
  const anyT = t as HTMLElement & { _h?: number };
  window.clearTimeout(anyT._h);
  anyT._h = window.setTimeout(() => t!.setAttribute('data-show', 'false'), 3200);
}

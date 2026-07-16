/**
 * Toast — kurze, deutliche Rückmeldung nach einer Aktion (Phase abgeschlossen,
 * Artefakt gespeichert). Ruhig ein-/ausblendend (Kosmos-Timing). Styles in
 * styles/modules.css (.titan-toast).
 */
export function showToast(msg: string): void {
  let t = document.getElementById('titan-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'titan-toast';
    t.id = 'titan-toast';
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

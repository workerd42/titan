/**
 * NORIVE KOMPASS-UNTERNEHMEN
 * Onboarding-Daten des persönlichen Unternehmens-Zwillings.
 * localStorage-basiert für Phase 1. Phase 2: Payload CMS / Auth.
 * Version: 1.0 · 2026
 */

const KOMPASS_KEY = 'norive-kompass-v1';

export interface KompassUnternehmen {
  name: string;
  branche: string;
  brancheKategorie: 'handel' | 'industrie' | 'dienstleistung' | 'handwerk' | 'sonstiges';
  groesse: 'mikro' | 'klein' | 'mittel' | 'gross';
  mitarbeiter: string;
  umsatz: string;
  rechtsform: string;
  organisationsstruktur: string;
  ausbildungsberufe: string;
  zielgruppen: string;
  besonderheiten: string;
  erstellt: string;
}

export const BRANCHE_OPTIONS = [
  { value: 'handel', label: 'Handel & E-Commerce' },
  { value: 'industrie', label: 'Industrie & Produktion' },
  { value: 'dienstleistung', label: 'Dienstleistung & Beratung' },
  { value: 'handwerk', label: 'Handwerk & Gewerbe' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

export const GROESSE_OPTIONS = [
  { value: 'mikro', label: 'Kleinstunternehmen (< 10 MA)' },
  { value: 'klein', label: 'Kleinunternehmen (10–49 MA)' },
  { value: 'mittel', label: 'Mittelstand (50–249 MA)' },
  { value: 'gross', label: 'Großunternehmen (250+ MA)' },
];

export const RECHTSFORM_OPTIONS = [
  'GmbH', 'GmbH & Co. KG', 'AG', 'KG', 'OHG', 'e.K.', 'GbR', 'Einzelunternehmen'
];

export function loadKompass(): KompassUnternehmen | null {
  try {
    const raw = localStorage.getItem(KOMPASS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveKompass(data: KompassUnternehmen): void {
  try {
    localStorage.setItem(KOMPASS_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function clearKompass(): void {
  localStorage.removeItem(KOMPASS_KEY);
}

export function isOnboardingComplete(): boolean {
  const k = loadKompass();
  return !!(k?.name && k?.branche);
}

// Client-seitiger Event-Bus für Updates zwischen Komponenten
export function dispatchKompassUpdate(): void {
  window.dispatchEvent(new CustomEvent('norive:kompass-updated'));
}

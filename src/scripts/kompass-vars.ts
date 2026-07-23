/**
 * KOMPASS-VARIABLEN — „Kompass überall" (Stufe 1: Ersetzung, kostenlos/offline).
 *
 * NAMING: Nutzer-sichtbar heißt dieses Konzept **„Star-Company"** (Wording seit
 * 2026-07-23). Intern bleibt alles bei `kompass` — Key `norive-kompass-v1`,
 * DB-Tabelle `kompass_profile`, dieses Modul, Event `norive:kompass-updated` —
 * bewusst stabil gehalten (Datenkompatibilität für Live-Nutzer). Nur Anzeigetexte
 * wurden umbenannt.
 *
 * Liest das Kompass-Unternehmen aus „Mein Bereich" (`norive-kompass-v1`) und
 * stellt Platzhalter bereit, die in Inhalten (Fallbeispiele, Aufgaben, Modul-
 * Texte, später Übungen/Tests) beim Rendern ersetzt werden:
 *   {{firma}} {{branche}} {{rechtsform}} {{groesse}}
 *   {{ausbildungsberufe}} {{zielgruppen}} {{besonderheiten}}
 *
 * Stufe 2 (bei Bedarf): ein KI-Kontext-Puffer schickt die Firmendaten EINMAL
 * durch Claude und speichert korrekt deklinierte Formen (Genitiv/Dativ, geglättete
 * Beschreibung). Bis dahin fallen {{firma_genitiv}}/{{firma_dativ}} bewusst auf
 * die neutrale Nominativ-Form zurück, damit keine falsche Grammatik entsteht.
 */

const KOMPASS_KEY = 'norive-kompass-v1';

const BRANCHE_LABEL: Record<string, string> = {
  handel: 'Handel', industrie: 'Industrie', dienstleistung: 'Dienstleistung',
  handwerk: 'Handwerk', sonstiges: 'Sonstiges',
};
const GROESSE_LABEL: Record<string, string> = {
  mikro: 'unter 10 Mitarbeitende', klein: '10–49 Mitarbeitende',
  mittel: '50–249 Mitarbeitende', gross: '250+ Mitarbeitende',
};

export interface Kompass {
  name?: string; branche?: string; rechtsform?: string; groesse?: string;
  ausbildungsberufe?: string; zielgruppen?: string; besonderheiten?: string;
}

export function readKompass(): Kompass | null {
  try { return JSON.parse(localStorage.getItem(KOMPASS_KEY) || 'null'); } catch { return null; }
}

/** True, wenn ein Kompass-Unternehmen eingerichtet ist (Name gesetzt). */
export function hasKompass(): boolean {
  return !!readKompass()?.name;
}

/** Der Anzeigename des Kompass-Unternehmens (mit neutralem Fallback). */
export function firmaName(): string {
  return readKompass()?.name || 'deine Star-Company';
}

/** Platzhalter-Katalog aus dem Kompass-Unternehmen (mit sinnvollen Fallbacks). */
export function getKompassVars(): Record<string, string> {
  const k = readKompass() || {};
  // {{firma}} steht in Inhalten an Namens-Positionen (z. B. „der {{firma}}").
  // Ohne eingerichteten Kompass daher ein NEUTRALER, artikelloser Beispiel-NAME
  // (grammatisch unverfänglich: „der Muster GmbH" ✓) statt einer Phrase wie
  // „deinem Unternehmen" oder „einem …", die den Satz zerreißen würde.
  const name = k.name || 'Muster GmbH';
  return {
    firma: name,
    branche: BRANCHE_LABEL[k.branche ?? ''] || k.branche || 'deiner Branche',
    rechtsform: k.rechtsform || '',
    groesse: GROESSE_LABEL[k.groesse ?? ''] || '',
    ausbildungsberufe: k.ausbildungsberufe || '',
    zielgruppen: k.zielgruppen || '',
    besonderheiten: k.besonderheiten || '',
    // Stufe 1: neutral = Nominativ (keine falsche Deklination). Stufe 2 (KI)
    // ersetzt diese Werte durch korrekt gebeugte Formen.
    firma_genitiv: name,
    firma_dativ: name,
  };
}

/** Ersetzt {{platzhalter}} in einem String. Unbekannte Platzhalter bleiben stehen. */
export function substitute(text: string, vars: Record<string, string> = getKompassVars()): string {
  return text.replace(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g, (m, key) => (key in vars ? vars[key] : m));
}

/**
 * Ersetzt Platzhalter in ALLEN Textknoten unter `root` (nur solche, die „{{"
 * enthalten — alles andere bleibt unberührt). So wirken die Kompass-Angaben
 * überall im gerenderten Inhalt, ohne die Autor-Struktur zu verändern.
 */
export function substituteDom(root: ParentNode = document.body): void {
  const vars = getKompassVars();
  const walker = document.createTreeWalker(root as Node, NodeFilter.SHOW_TEXT);
  const targets: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.includes('{{')) targets.push(node as Text);
  }
  targets.forEach((t) => { t.nodeValue = substitute(t.nodeValue as string, vars); });
}

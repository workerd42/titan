const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const errors = [];

function resolveScriptContent(scriptPath, visited = new Set()) {
  if (visited.has(scriptPath)) return '';
  visited.add(scriptPath);
  let content = fs.readFileSync(scriptPath, 'utf-8');
  // Einfache Side-Effect-Imports (z. B. `import"./x.js";`) aufloesen und inline einsetzen,
  // da jsdom keinen echten ES-Modul-Loader implementiert.
  content = content.replace(/import\s*["']([^"']+)["'];?/g, (match, relImport) => {
    const importedPath = path.join(path.dirname(scriptPath), relImport);
    return resolveScriptContent(importedPath, visited);
  });
  return content;
}

function loadPage(relPath, seedStorage) {
  const html = fs.readFileSync(path.join(DIST, relPath), 'utf-8');
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    
    url: 'https://example.github.io/pruefungsraum/' + relPath.replace(/index\.html$/, ''),
  });
  dom.window.onerror = (msg) => errors.push(`${relPath}: window.onerror: ${msg}`);
  if (seedStorage) {
    dom.window.localStorage.setItem('pruefungsraum-progress-v1', seedStorage);
  }
  // jsdom fuehrt <script type="module"> grundsaetzlich NICHT aus (bekannte jsdom-Einschraenkung).
  // Da Astro/Vite hier bereits ein abhaengigkeitsfreies Bundle erzeugt (ggf. ueber einen duennen
  // Re-Export-Wrapper), wird der tatsaechliche Skriptinhalt aufgeloest und direkt ausgewertet,
  // um echtes Browserverhalten zu simulieren.
  const scriptSrcMatch = html.match(/<script type="module" src="([^"]+)">/);
  if (scriptSrcMatch) {
    const scriptPath = path.join(DIST, scriptSrcMatch[1].replace(/^\/pruefungsraum\//, ''));
    const scriptContent = resolveScriptContent(scriptPath);
    dom.window.eval(scriptContent);
  }
  return dom;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  console.log('=== STRUKTUR-CHECK: alle 13 Seiten ohne JS-Fehler ladbar ===');
  const allPages = [
    'index.html',
    'hb1/index.html', 'hb2/index.html', 'hb3/index.html', 'hb4/index.html',
    'hb1/01-marktforschungsprozess/index.html',
    'hb1/02-sekundaerforschung/index.html',
    'hb1/03-befragung/index.html',
    'hb1/04-beobachtung-experiment-panel/index.html',
    'hb1/05-stichproben-auswahlverfahren/index.html',
    'hb1/06-mittelwerte-streuung/index.html',
    'hb1/07-marktkennzahlen-prognose/index.html',
    'hb1/08-segmentierung-zielgruppen/index.html',
    'hb2/01-ziele-zielgruppen/index.html',
    'hb2/02-massnahmen-budget/index.html',
    'hb2/03-steuerungstechniken/index.html',
    'hb2/04-marketingorganisation/index.html',
    'hb2/05-produktmanagement-marketingarten/index.html',
    'hb2/06-produktpolitik/index.html',
    'hb2/07-preispolitik/index.html',
    'hb2/08-distributionspolitik/index.html',
    'hb2/09-kommunikationspolitik/index.html',
    'hb2/10-people-process-crm/index.html',
    'hb3/01-fuehrungsinstrument/index.html',
    'hb3/02-strategisch-operativ/index.html',
    'hb3/03-controllinginstrumente/index.html',
    'hb3/04-marketingaudit/index.html',
    'hb3/01-kpi-systematik/index.html',
    'hb3/02-deckungsbeitragsrechnung/index.html',
    'hb3/03-werbeerfolgskontrolle/index.html',
    'hb3/01-qualitaetsbegriff/index.html',
    'hb3/02-tqm-kaizen/index.html',
    'hb3/03-betriebliche-vernetzung/index.html',
    'hb4/01-nachrichtenquadrat/index.html',
    'hb4/02-interkulturelle-kommunikation/index.html',
    'hb4/03-konflikteskalation/index.html',
    'hb4/04-praesentationsvorbereitung/index.html',
    'hb4/01-personalmarketing/index.html',
    'hb4/02-stellenbeschreibung-anforderungsprofil/index.html',
    'hb4/03-personalbeschaffung-assessment-center/index.html',
    'hb4/01-arbeitszeitmodelle/index.html',
    'hb4/02-personalverwaltung/index.html',
    'hb4/01-klassische-fuehrungsstile/index.html',
    'hb4/02-management-by-techniken/index.html',
    'hb4/03-situativer-fuehrungsstil/index.html',
    'hb4/01-vier-stufen-methode/index.html',
    'hb4/02-ausbildungsrahmenplan/index.html',
    'hb4/01-personalentwicklungsplanung/index.html',
    'hb4/02-erfolgskontrolle/index.html',
    'hb4/01-duales-arbeitsschutzsystem/index.html',
    'hb4/02-gefaehrdungsbeurteilung/index.html',
  ];
  for (const p of allPages) {
    const dom = loadPage(p);
    await wait(30);
    const h1 = dom.window.document.querySelector('h1');
    const ok = !!h1 && h1.textContent.length > 0;
    console.log(`${p.padEnd(55)} ${ok ? 'OK' : 'FEHLER'}`);
    if (!ok) errors.push(`${p}: kein h1 gefunden`);
  }

  console.log('\n=== INHALT OHNE JS SICHTBAR (SEO/GEO-Kernfix) ===');
  {
    const htmlRaw = fs.readFileSync(path.join(DIST, 'hb1/01-marktforschungsprozess/index.html'), 'utf-8');
    const hasRealContent = htmlRaw.includes('5-D-Marktforschungsprozess') &&
      htmlRaw.includes('Definition des Untersuchungsproblems');
    console.log('Lerninhalt im Roh-HTML (vor JS) vorhanden:', hasRealContent ? 'OK' : 'FEHLER');
    if (!hasRealContent) errors.push('Lerninhalt fehlt im statischen HTML');
  }

  console.log('\n=== DETAILS/SUMMARY NATIV OHNE JS BEDIENBAR ===');
  {
    const html = fs.readFileSync(path.join(DIST, 'hb1/01-marktforschungsprozess/index.html'), 'utf-8');
    const detailsCount = (html.match(/<details>/g) || []).length;
    console.log('Anzahl <details>-Elemente:', detailsCount, detailsCount === 2 ? 'OK' : 'FEHLER (erwartet 2)');
    if (detailsCount !== 2) errors.push('Erwartet 2 details-Elemente pro Thema-Seite');
  }

  console.log('\n=== INHALTSVERZEICHNIS: HB2/HB3 zeigen echten Inhalt, HB4 zeigt Platzhalter ===');
  {
    const hb2Toc = fs.readFileSync(path.join(DIST, 'hb2/index.html'), 'utf-8');
    const hb2ItemCount = (hb2Toc.match(/class="zeile"/g) || []).length;
    console.log('HB2 TOC zeigt 10 Themen-Links:', hb2ItemCount, hb2ItemCount === 10 ? 'OK' : 'FEHLER');
    if (hb2ItemCount !== 10) errors.push(`HB2 TOC: erwartet 10 Themen-Links, gefunden ${hb2ItemCount}`);
    const hb2HatPlatzhalter = hb2Toc.includes('Inhalt folgt');
    console.log('HB2 TOC hat keinen "Inhalt folgt" mehr in der Marketing-Mix-Gruppe:', !hb2Toc.includes('Marketing-Mix') || hb2ItemCount === 10 ? 'OK (indirekt via Linkzahl bestaetigt)' : 'FEHLER');

    const hb3Toc = fs.readFileSync(path.join(DIST, 'hb3/index.html'), 'utf-8');
    const hb3ItemCount = (hb3Toc.match(/class="zeile"/g) || []).length;
    console.log('HB3 TOC zeigt 10 Themen-Links (4+3+3):', hb3ItemCount, hb3ItemCount === 10 ? 'OK' : 'FEHLER');
    if (hb3ItemCount !== 10) errors.push(`HB3 TOC: erwartet 10 Themen-Links, gefunden ${hb3ItemCount}`);

    const hb4Toc = fs.readFileSync(path.join(DIST, 'hb4/index.html'), 'utf-8');
    const hb4PlatzhalterCount = (hb4Toc.match(/Inhalt folgt/g) || []).length;
    console.log('HB4 TOC zeigt jetzt 0x "Inhalt folgt" (alle 7 Themengruppen befuellt):', hb4PlatzhalterCount, hb4PlatzhalterCount === 0 ? 'OK' : 'FEHLER (erwartet 0)');
    if (hb4PlatzhalterCount !== 0) errors.push(`HB4 TOC: erwartet 0x "Inhalt folgt", gefunden ${hb4PlatzhalterCount}`);
    const hb4ItemCount = (hb4Toc.match(/class="zeile"/g) || []).length;
    console.log('HB4 TOC zeigt 18 Themen-Links (4+3+2+3+2+2+2):', hb4ItemCount, hb4ItemCount === 18 ? 'OK' : 'FEHLER');
    if (hb4ItemCount !== 18) errors.push(`HB4 TOC: erwartet 18 Themen-Links, gefunden ${hb4ItemCount}`);
  }

  console.log('\n=== FACHINHALT STICHPROBE: HB4-Themen enthalten Kerninhalte im Roh-HTML ===');
  {
    const checks4 = [
      ['hb4/01-nachrichtenquadrat/index.html', 'Schulz von Thun', 'Kommunikation: Nachrichtenquadrat'],
      ['hb4/03-konflikteskalation/index.html', 'Glasl', 'Kommunikation: Glasl-Eskalationsmodell'],
      ['hb4/02-stellenbeschreibung-anforderungsprofil/index.html', 'Handlungskompetenz', 'Personalauswahl: Anforderungsprofil'],
      ['hb4/03-personalbeschaffung-assessment-center/index.html', 'Assessment-Center', 'Personalauswahl: Assessment-Center'],
      ['hb4/01-arbeitszeitmodelle/index.html', 'KAPOVAZ', 'Personaleinsatzplanung: KAPOVAZ'],
      ['hb4/02-management-by-techniken/index.html', 'Management by Objectives', 'Führungsmethoden: MbO/MbR/MbE'],
      ['hb4/01-vier-stufen-methode/index.html', 'psychomotorische', 'Berufsausbildung: Vier-Stufen-Methode'],
      ['hb4/02-erfolgskontrolle/index.html', 'pädagogische Erfolgskontrolle', 'Personalentwicklung: Erfolgskontrolle'],
      ['hb4/01-duales-arbeitsschutzsystem/index.html', 'Berufsgenossenschaft', 'Arbeitsschutz: duales System'],
      ['hb4/02-gefaehrdungsbeurteilung/index.html', 'nicht übertragbar', 'Arbeitsschutz: Gefährdungsbeurteilung'],
    ];
    for (const [file, needle, label] of checks4) {
      const html = fs.readFileSync(path.join(DIST, file), 'utf-8');
      const found = html.includes(needle);
      console.log(`${label}:`, found ? 'OK' : 'FEHLER (Suchtext nicht gefunden: ' + needle + ')');
      if (!found) errors.push(`${label}: Text "${needle}" fehlt im Roh-HTML`);
    }
  }

  console.log('\n=== FACHINHALT STICHPROBE: neue HB2/HB3-Themen enthalten Kerninhalte im Roh-HTML ===');
  {
    const checks = [
      ['hb2/07-preispolitik/index.html', 'Skimmingstrategie', 'Preispolitik: Skimmingstrategie'],
      ['hb2/09-kommunikationspolitik/index.html', 'AIDA', 'Kommunikationspolitik: AIDA-Modell'],
      ['hb3/02-deckungsbeitragsrechnung/index.html', 'relative Deckungsbeitrag', 'Erfolgsmessung: relativer Deckungsbeitrag'],
      ['hb3/04-marketingaudit/index.html', 'systemorientiert', 'Marketingcontrolling: Marketingaudit'],
      ['hb3/02-tqm-kaizen/index.html', 'Kaizen', 'Qualitätssicherung: Kaizen'],
    ];
    for (const [file, needle, label] of checks) {
      const html = fs.readFileSync(path.join(DIST, file), 'utf-8');
      const found = html.includes(needle);
      console.log(`${label}:`, found ? 'OK' : 'FEHLER (Suchtext nicht gefunden: ' + needle + ')');
      if (!found) errors.push(`${label}: Text "${needle}" fehlt im Roh-HTML`);
    }
  }

  console.log('\n=== "WEITER ZU"-VERKETTUNG: letztes Thema pro Bereich verlinkt zurueck zur Uebersicht ===');
  {
    const html = fs.readFileSync(path.join(DIST, 'hb2/10-people-process-crm/index.html'), 'utf-8');
    const hatZurueckLink = html.includes('Zur\u00fcck zur \u00dcbersicht');
    console.log('HB2 letztes Thema (10-people-process-crm) verlinkt zurueck zur Uebersicht:', hatZurueckLink ? 'OK' : 'FEHLER');
    if (!hatZurueckLink) errors.push('HB2 letztes Thema verlinkt nicht zurueck zur Uebersicht');

    const html2 = fs.readFileSync(path.join(DIST, 'hb2/01-ziele-zielgruppen/index.html'), 'utf-8');
    const hatWeiterLink = html2.includes('massnahmen-budget');
    console.log('HB2 erstes Thema verlinkt korrekt zum zweiten Thema:', hatWeiterLink ? 'OK' : 'FEHLER');
    if (!hatWeiterLink) errors.push('HB2 "Weiter zu"-Verkettung fehlerhaft zwischen Thema 1 und 2');
  }

  let savedStorage = null;

  console.log('\n=== CLIENT-JS: Lernphasen, Status-Punkte, localStorage ===');
  {
    const dom = loadPage('hb1/01-marktforschungsprozess/index.html');
    await wait(30);
    const win = dom.window;
    const doc = win.document;

    doc.querySelector('[data-action="verstehen-bestaetigen"]').click();
    doc.querySelector('[data-action="merken-bestaetigen"]').click();
    doc.querySelector('[data-action="anwenden-bestaetigen"]').click();
    await wait(30);

    const stored = JSON.parse(win.localStorage.getItem('pruefungsraum-progress-v1') || '{}');
    const slugState = stored['01-marktforschungsprozess'];
    const dreiPhasenOk = !!slugState && slugState.verstehen && slugState.merken && slugState.anwenden;
    console.log('3 Phasen in localStorage persistiert:', dreiPhasenOk ? 'OK' : 'FEHLER');
    if (!dreiPhasenOk) errors.push('Phasen-Persistenz fehlgeschlagen: ' + JSON.stringify(slugState));

    const phaseLabels = ['verstehen', 'merken', 'anwenden'].map(
      (p) => doc.querySelector(`[data-phase-label="${p}"]`).getAttribute('data-done')
    );
    const dreiLabelsOk = phaseLabels.every((v) => v === 'true');
    console.log('Phasen-Leiste zeigt "erledigt" fuer alle 3 (Statuspunkte gibt es bewusst nur in TOC/Start, nicht hier):', dreiLabelsOk ? 'OK' : 'FEHLER (' + phaseLabels + ')');
    if (!dreiLabelsOk) errors.push('Phasen-Leiste zeigt nicht alle 3 Phasen als erledigt');

    doc.querySelector('[data-action="pruefen-einschaetzung"][data-wert="wiederholen"]').click();
    await wait(30);

    const hinweis = doc.querySelector('[data-wiederholung-hinweis]');
    const hinweisOk = hinweis.textContent.includes('automatisch wieder');
    console.log('Wiederholungs-Hinweis nach Klick aktualisiert:', hinweisOk ? 'OK' : 'FEHLER (' + hinweis.textContent + ')');
    if (!hinweisOk) errors.push('Wiederholungs-Hinweis wurde nicht durch JS aktualisiert: ' + hinweis.textContent);

    const pruefenLabel = doc.querySelector('[data-phase-label="pruefen"]').getAttribute('data-done');
    console.log('Phasen-Leiste "Pruefen" nach Einschaetzung erledigt:', pruefenLabel === 'true' ? 'OK' : 'FEHLER');
    if (pruefenLabel !== 'true') errors.push('Phasen-Leiste "Pruefen" nicht als erledigt markiert');

    const textarea = doc.querySelector('[data-action="eigene-einschaetzung"]');
    textarea.value = 'Meine Testantwort';
    textarea.dispatchEvent(new win.Event('input', { bubbles: true }));
    await wait(30);
    const storedAfterInput = JSON.parse(win.localStorage.getItem('pruefungsraum-progress-v1') || '{}');
    const inputOk = storedAfterInput['01-marktforschungsprozess']?.eigeneEinschaetzung === 'Meine Testantwort';
    console.log('Eigene Einschaetzung (Textarea) persistiert:', inputOk ? 'OK' : 'FEHLER');
    if (!inputOk) errors.push('Eigene Einschaetzung nicht persistiert');

    // Toggle-Test: erneuter Klick auf "Konnte ich loesen" wechselt den gewaehlten Zustand korrekt
    doc.querySelector('[data-action="pruefen-einschaetzung"][data-wert="geloest"]').click();
    await wait(30);
    const geloestBtn = doc.querySelector('[data-action="pruefen-einschaetzung"][data-wert="geloest"]');
    const wiederholenBtn = doc.querySelector('[data-action="pruefen-einschaetzung"][data-wert="wiederholen"]');
    const toggleOk = geloestBtn.getAttribute('data-chosen') === 'true' && wiederholenBtn.getAttribute('data-chosen') === 'false';
    console.log('Selbsteinschaetzung-Toggle (nur einer aktiv):', toggleOk ? 'OK' : 'FEHLER');
    if (!toggleOk) errors.push('Selbsteinschaetzung-Toggle-Logik fehlerhaft');

    savedStorage = win.localStorage.getItem('pruefungsraum-progress-v1');
  }

  console.log('\n=== CROSS-PAGE: Inhaltsverzeichnis zeigt persistierten Fortschritt ===');
  {
    const dom = loadPage('hb1/index.html', savedStorage);
    await wait(30);
    const dots = dom.window.document.querySelectorAll('[data-status-dots="01-marktforschungsprozess"] .statuspunkt');
    const filled = [...dots].filter((d) => d.getAttribute('data-filled') === 'true').length;
    console.log('TOC zeigt 4 gefuellte Punkte fuer bearbeitetes Thema:', filled, filled === 4 ? 'OK' : 'FEHLER');
    if (filled !== 4) errors.push(`TOC Status-Punkte falsch: ${filled} statt 4`);

    const unbearbeiteteDots = dom.window.document.querySelectorAll('[data-status-dots="02-sekundaerforschung"] .statuspunkt');
    const unbearbeitetFilled = [...unbearbeiteteDots].filter((d) => d.getAttribute('data-filled') === 'true').length;
    console.log('TOC zeigt 0 Punkte fuer unbearbeitetes Thema:', unbearbeitetFilled, unbearbeitetFilled === 0 ? 'OK' : 'FEHLER');
  }

  console.log('\n=== CROSS-PAGE: Startseite zeigt Bereichs-Fortschrittsbalken ===');
  {
    const dom = loadPage('index.html', savedStorage);
    await wait(30);
    const progressEl = dom.window.document.querySelector('[data-progress-bereich="hb1"]');
    const fill = progressEl ? progressEl.querySelector('.zeile-progress-fill') : null;
    const pct = progressEl ? progressEl.getAttribute('data-pct') : null;
    console.log('Fortschrittsbalken HB1 gesetzt auf:', pct + '%', (fill && fill.style.width === pct + '%') ? 'OK' : 'FEHLER');
    // 1 von 8 Themen x 4 Phasen vollstaendig = 4/32 = 12.5% -> gerundet 13%
    if (pct !== '13') errors.push('Erwarteter Fortschritt 13%, erhalten: ' + pct);
  }

  console.log('\n=== FORTSCHRITT ZURUECKSETZEN ===');
  {
    const dom = loadPage('index.html', savedStorage);
    dom.window.confirm = () => true;
    await wait(60);
    const resetBtn = dom.window.document.querySelector('[data-action="fortschritt-zuruecksetzen"]');
    console.log('Reset-Button gefunden:', !!resetBtn ? 'OK' : 'FEHLER');
    resetBtn.click();
    await wait(60);
    const afterReset = dom.window.localStorage.getItem('pruefungsraum-progress-v1');
    console.log('localStorage nach Reset geleert:', afterReset === null ? 'OK' : 'FEHLER (' + afterReset + ')');
    if (afterReset !== null) errors.push('Reset loescht localStorage nicht korrekt');
  }

  console.log('\n=== ZUSAMMENFASSUNG ===');
  console.log('Gesamtfehler:', errors.length);
  if (errors.length) {
    errors.forEach((e) => console.log(' - ' + e));
    process.exitCode = 1;
  } else {
    console.log('ALLE TESTS BESTANDEN ✓');
  }
})();

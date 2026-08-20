# Chart.js — Integrations-Konzept (Entscheidung)

> Stand 2026-08-20. Kurzentscheidung + Guardrails, **bevor** Charts gebaut werden.
> Kein Prototyp jetzt — dieses Dokument ist die Leitplanke für später.

## Entscheidung
**Chart.js (v4, MIT) wird eingeführt — chirurgisch, gekapselt, lazy-geladen** für
echte **Datenreihen-Diagramme**. Kein Allzweck-Ersatz für die bestehenden
bespoke SVG/CSS-Visuals. Passt zum realen Stack (Astro-Hybrid · Vanilla TS ·
self-hosted EU/DE · strikte CSP): als npm-Dependency von Vite gebündelt →
ausgeliefert von `'self'`, kein CDN, kein externer Call, kein `eval` (CSP-konform).

## Wo einsetzen — und wo NICHT
**Ja (Datenreihen):** `statistik`-Werkzeug (Histogramm) · `breakeven`/`deckungsbeitrag`
(Kosten-/Erlös-Linien + Gewinnschwelle) · Cockpit-Trend (später, wenn Zeitreihen da
sind) · Umsatzprognose-Artefakt.
**Nein (bleibt bespoke SVG/CSS):** BCG-/Portfolio-Matrix (`portfolio`),
Fortschritts-Ring, Phasen-Dots, Balken in Cockpit/Panel — on-brand, 0 KB, a11y-/
theme-nativ; Chart.js wäre dort Overkill.

## Kapselung — ein Wrapper `src/scripts/chart.ts`
Ein zentrales Utility, das die Guardrails an EINER Stelle erfüllt; Module rufen nur
`makeChart(canvas, spec)` und `destroy()` auf.
- **Tree-shaking:** nur benötigte Controller/Elemente registrieren (kein
  `...registerables`) → kleiner Bundle.
- **Lazy:** `const { makeChart } = await import('../scripts/chart')` erst dort, wo ein
  Chart gebraucht wird (Modul-/Cockpit-Seite) — nicht global (~60 KB gzip).
- **Theme-aware:** Farben zur Laufzeit aus Norive-Tokens lesen (`getComputedStyle`
  auf `--accent`/`--text`/`--border`) und **beim Hell/Dunkel-Umschalter neu setzen**
  (Titan hat den Toggle) — sonst wirkt der Chart „fremd".
- **Kosmos-Ruhe:** langsame, weiche Animation; **`prefers-reduced-motion` → Animation
  aus** (`animation: false`).
- **Barrierefreiheit (WCAG 2.2, 0 axe):** Canvas ist für Screenreader opak → der
  Wrapper rendert **immer eine visuell versteckte Datentabelle** (+ `aria-label`) als
  Textalternative neben dem `<canvas>`.
- **Kein Speicherleck:** `module-engine` re-mountet bei jeder ClientRouter-Navigation
  (`astro:page-load`) → Chart-Instanz beim Unmount **`chart.destroy()`** (analog zum
  `artefaktHandler`-Cleanup in `norive-progress.ts`).

## Rollout-Reihenfolge
1. **Proof: Histogramm im `statistik`-Werkzeug** — kleiner Umfang, testet alle
   Guardrails an einer Stelle.
2. Break-even-/DB-Diagramm.
3. Cockpit-Trend (setzt Zeitreihen-Daten voraus → mit Cockpit-Ausbau).

## Verworfene Alternativen (kurz)
Bespoke SVG (behalten für Einfaches) · uPlot (winzig, aber roher Look, mehr
Eigenarbeit) · D3/ECharts (mächtiger, aber Overkill/schwerer). Chart.js = pragmatischer
Mittelweg.

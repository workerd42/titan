# TITAN — Norive Design System v2

> Quelle: [Notion — Norive Design System v2](https://app.notion.com/p/39895f8eb37681b3a233fbec0b9c08dd) (Stand: 2026-07-09)

## 1. Markenidentität & Ästhetik

Das Norive Design System verbindet **buchartige Tiefe** (Cormorant Garamond, Warm Linen) mit **präziser Sci-Fi-Technik** (DM Mono, SVG-Galaxien). Es erzeugt die Anmutung eines interaktiven, edlen Strategie-Cockpits.

## 2. Typografie-System (Die 3-Säulen-Hierarchie)

Um den Ermüdungseffekt beim Lesen langer IHK-Theorietexte zu vermeiden, ist die Typografie streng nach Verwendungszweck dreigeteilt:

| Rolle | Schriftart | Styles/Weights | Verwendung |
|---|---|---|---|
| `--font-serif` | Cormorant Garamond | 300 / 400 / 600 | Hauptüberschriften (H1–H3), Hero-Titles, Merksätze (Phase 2), Markenidentität |
| `--font-sans` | Plus Jakarta Sans *(neu, noch nicht im Code)* | 400 / 500 / 600 | Fließtext, Prosa in Phase 1 & Phase 3, Formulare, Textareas, Musterlösungen |
| `--font-mono` | DM Mono | 300 / 400 | UI-Labels, Navigation, Metadaten, Formeln/LaTeX, Modul-Codes, Buttons |

> **Fluid Typography Rule:** Alle Textgrößen skalieren fließend über `clamp()` relativ zur Viewport-Breite.

> **Hinweis:** Aktuell verwendet der Code (`package.json`) nur `@fontsource/cormorant-garamond` und `@fontsource/dm-mono` — Plus Jakarta Sans ist laut dieser Notion-Seite geplant, aber noch nicht integriert.

## 3. Farbpalette & Surface Tokens

### A. Core Theme Tokens

```css
:root {
  /* Primär- & Akzentfarben */
  --accent-light: #6E5035;       /* Muted Amber-Brown auf hellem Hintergrund */
  --accent-dark:  #C4A882;       /* Warm Amber Accent auf dunklem Hintergrund */

  /* Surface & Stage Backgrounds */
  --bg-stage-light: #EDE8DF;    /* Warm Linen — Hauptbühne Lernseiten & Orbitals */
  --bg-surface-light: #F6F3EC;  /* Cream — Karten & Inhalts-Container auf der Stage */
  --bg-panel-dark:   #1C1815;    /* Deep Espresso/Obsidian — Slide-in Panels */
  --bg-surface-dark: #2A2420;    /* Card Surface in Dark Panels */

  /* Textfarben (WCAG AAA/AA konform) */
  --text-main-light:  #1C1917;   /* Off-Black für maximale Lesbarkeit im Fließtext */
  --text-muted-light: #6E5035;   /* Subtitles & Sekundärtext */
  --text-main-dark:   #EDE8DF;   /* Warm Linen Text im Panel */
  --text-muted-dark:  #A89B8C;   /* Muted Panel Details */
}
```

### B. Barrierefreie Phasen-Farben (4-Phasen-Kompetenzreise)

Damit die Phasenfarben auf `--bg-stage-light` (#EDE8DF) gut lesbar sind und gleichzeitig als Akzent-Badges strahlen, nutzen wir zweistufige Tokens:

```css
:root {
  /* Phase 1: VERSTEHEN (Blaugrau) */
  --phase-1-bg:    #E2E7F0;
  --phase-1-text:  #2D4263;
  --phase-1-border:#6E7EA0;

  /* Phase 2: MERKEN (Warm Amber) */
  --phase-2-bg:    #F7F1E5;
  --phase-2-text:  #7A5C2E;
  --phase-2-border:#C4A882;

  /* Phase 3: ANWENDEN (Waldgrün) */
  --phase-3-bg:    #E4EFE7;
  --phase-3-text:  #244B30;
  --phase-3-border:#5A8A6A;

  /* Phase 4: PRÜFEN (Gold) */
  --phase-4-bg:    #F5F0E6;
  --phase-4-text:  #5C4B28;
  --phase-4-border:#8A7650;
}
```

## 4. Kugel-Visualisierung & Karussell-Tiefe

> **Aktualisierung 2026-07-14:** Die ursprünglich geplanten dekorativen SVG-Galaxien (M51/M104/M101/NGC1300) wurden nie produktiv genutzt und im Frontend-Rework entfernt. Jede Ebene rendert stattdessen eine **radial-gradient-Kugel** (`UniversumGlobe`/`GalaxieGlobe`/`Planet`), positioniert von der Karussell-Engine.

### Technical Render Specs

- **Kugel:** `radialGradient` (Highlight → Basis → dunkler Rand) + Atmosphären-/Rim-Gradient; dezenter Hover-Glow via `drop-shadow`.
- **Tiefe (Karussell `ring`-Modus, Seite 1+2):** echte CSS-3D-`perspective` (1300px) + `translate3d(x, y, z)` — die scheinbare Größe berechnet der Browser aus der Kameregeometrie, keine manuelle Scale-Formel mehr. Opazität/z-Index fallen mit dem Winkel ab (vorne = opak/vorn, hinten = blass/hinten).
- **Tiefe (Karussell `linear`-Modus, Seite 3):** Skalierung `clamp(1.4 − 0.22·|offset|)`, Opazität fällt mit Abstand zum Zentrum; Rand-Fade via CSS-`mask-image`.

## 5. UI-Interaktions- & Motion-Rules

> **Leitprinzip Motion (festgelegt 2026-07-16): Kosmos-Gefühl.** ALLE Animationen sollen **ruhig, organisch und harmonisch** wirken — langsam, mit weichem Ein-/Ausschwingen (`sine.inOut`, `power2.inOut` bzw. `--ease-titan`), nie schnell/hart/„poppig". Weniger, aber sanfter — nicht mehr Effekte. `prefers-reduced-motion` immer respektieren. Richtwerte nach diesem Feedback: Karussell-Rotation ~0.85 s, Linear-Karussell ~0.7 s, Caption-Crossfade 0.28 s aus / 0.5 s ein, Speed-Dial 0.4 s.

### A. Timing & Easing

```css
:root {
  --ease-titan: cubic-bezier(0.16, 1, 0.3, 1); /* Seidig weicher Power3.out-Smooth */
  --dur-fast:   0.25s; /* Micro-Interactions, Button Hover, Tooltips */
  --dur-mid:    0.45s; /* Panel Slide-ins, Tab-Switches */
  --dur-slow:   0.75s; /* View-Transitions, Orbit-Zoom, Galaxie-Eintritt */
}
```

### B. Panel- & Backdrop-Verhalten

1. **Verankerte Toggles:**
   - Konzept-Panel Toggle: rechts positioniert, `bottom: calc(50vh + 8px)`.
   - Mein-Bereich-Panel Toggle: rechts positioniert, `top: calc(50vh + 8px)`.
2. **Backdrop-Blur Effect:** Sobald ein Panel reinslidet (`#1C1815`), erhält die dahinterliegende Orbit-Stage (`--bg-stage-light`) dynamisch eine leichte Unschärfe, um die Tiefe zu verstärken:
   ```css
   .space-stage.panel-open {
     filter: blur(5px) saturate(85%);
     transition: filter var(--dur-mid) var(--ease-titan);
     pointer-events: none;
   }
   ```
3. **Mutual Exclusion & Dismissal:**
   - Es kann maximal 1 Panel gleichzeitig geöffnet sein.
   - Das Öffnen eines Panels schließt ein anderes automatisch.
   - `ESC`-Taste oder Klick außerhalb schließt alle Panels augenblicklich.

## 6. Layout-Dualismus (Theme Switching)

- **`SpaceLayout`** (Startseite & HF-Orbits): Dark Obsidian/Espresso Panels auf Warm Linen Stage. Konzentriert, magisch, fokussiert auf Raumgefühl.
- **`PlanetLayout`** (Die 4-Phasen-Lernseite): Warm Linen Light Theme mit klar getrennten Surface-Cards für fokussiertes Lesen, Ausfüllen und Arbeiten.

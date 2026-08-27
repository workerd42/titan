# Öffentliche Marketing-Seiten (Landingpage & Fachrichtungen)

Stand: 2026-08-25 · Autor: Titan Dev

Öffentlicher, immersiver Vor-Login-Auftritt (B2B-first) für Titan als **Learning
Experience Platform (LXP)** — allgemein für **alle IHK-Fachwirt-Richtungen**, nicht
Marketing-spezifisch. Wird **im Code, Section für Section, nach Absprache** gebaut.

## Routen & Zugang
| Route | Datei | Zweck |
|---|---|---|
| `/willkommen` | `src/pages/willkommen.astro` | Haupt-Landingpage (Hero + Sections) |
| `/fachrichtungen` | `src/pages/fachrichtungen.astro` | Übersicht ALLER 38 Fachwirt-Richtungen |
| `/so-funktionierts` | `src/pages/so-funktionierts.astro` | Erklärseite (Ablauf/Didaktik, 4 Phasen im Detail) |

- Alle `prerender = false`, **öffentlich** via Allowlist in `src/middleware.ts`
  (`OEFFENTLICHE_PFADE` enthält `/willkommen`, `/fachrichtungen`, `/so-funktionierts`).
- Verifikation: liefern **200 ohne Login**; gegatete Seiten weiterhin 302 → `/konto`.

## Designsystem (landing-lokal, nicht global)
Bewusst eigener, immersiver Stil (Referenz: orizon.co) — getrennt von den globalen
Norive-Tokens, damit die App unberührt bleibt. Palette **Kosmos-Blau + Gold auf Hell**:

- `--navy #1B2A4A`, `--gold #C4A882`, `--ink #14181F`, `--ink-muted #5A6172`,
  `--bg #EFEDE7`, `--surface #FFFFFF`, `--line rgba(20,24,31,0.10)`.
- Dunkle Cards: Radial-Gradient `#33569E → #1B2A4A` + Gold-Glow.

### Fonts (self-hosted, CSP-konform)
`public/fonts/` (latin-Subset, deckt DE-Umlaute + ß):
- **Space Grotesk** (500/700) → Display/Headlines (`--display`)
- **Inter** (400/500/600) → Body/UI (`--body`)

Bezugsquelle einmalig via Google-Fonts-CSS (woff2), danach lokal ausgeliefert — kein
externer CDN (CSP `font-src 'self'`). `@font-face` je Seite scoped dekliniert.

### Assets
- Hero-Bild: `public/willkommen/hero-earth.jpg` — NASA **Blue Marble 2012**
  (`GSFC_20171208_Archive_e001386`, Public Domain), auf 2560² skaliert.
  Einbindung als aufsteigende Erde unten-mittig via `mix-blend-mode: screen`.

## Aufbau `/willkommen`
1. **Hero (Vollbild):** Blue-Marble-Erde, Wortmarke + **Burger** (kreisförmiges
   Overlay, per X/Esc/Klick schließbar), **Glasmorph-Textkarte** (`fit-content`,
   cross-device) mit Badge, Headline „Vom Wissen zur **Wirkung**.", LXP-Subline;
   CTAs („Demo anfragen" / „So funktioniert's") frei unten rechts.
2. **Section 1 „So funktioniert's":** 4-Phasen-Reise (Verstehen → Merken → Anwenden
   → Prüfen) als dunkle Navy-Gold-Cards mit SVG-Grafik, Icon unten.
3. **Trennstrich** (`.lp-divider`) markiert das Section-Ende.
4. **Section 2 „Fachrichtungen":** **fortlaufendes Endlos-Karussell** (full-bleed,
   orizon-Muster) mit 12 Richtungen (Navy-Gold-Cards, **Höhe wie Section 1 = 336px**);
   Karten per JS dupliziert für nahtlosen Loop, Hover pausiert, Kanten-Fade,
   **„Alle ansehen ↗"** → `/fachrichtungen`.
5. **Section 3 „Angebot" (B2B & B2C):** **Scroll-Cross-Fade** — Text mittig (gepinnt),
   beim Scrollen erscheinen die zwei **Info-Cards im Navy-Gold-Schema** (Bildungsträger /
   Prüflinge). CTAs: „Demo anfragen" = mailto, „So funktioniert's" → `/so-funktionierts`.
6. **Section 4 „Warum Titan":** **„Karten-austeilen"** — drei Cards liegen aufeinander
   (Card 1 oben), beim Scrollen wischt die oberste nach oben weg (rAF, gepinnt).
   Layout je Card wie orizon (Headline links, Grafik rechts, zwei Sub-Spalten);
   **Card 1/2/3 visuell unterschiedlich** (Blau / Indigo / Petrol), Gold verbindet.

Trenner (`.lp-divider`) mit **symmetrischen Abständen** zwischen allen Sections.

### Interaktion & Bewegung
- **GSAP** (bereits im Stack): Hero-Entrance (gestaffelt), Parallax des Erd-Wraps,
  Badge-Fall, Burger-Overlay, Scroll-Reveals (IntersectionObserver + GSAP,
  Inline-Transform wird nach Reveal geräumt → Hover funktioniert).
- **orizon-artiger Cursor** (nachlaufender Punkt, `mix-blend-mode: difference`,
  vergrößert über Links/Buttons) — auf **beiden** Seiten (`/willkommen` +
  `/fachrichtungen`), nur Zeiger-Geräte.
- Barrierefreiheit: sichtbarer Fokus, aria an Bedienelementen, `prefers-reduced-
  motion` schaltet Bewegung/Cursor ab. Galerie scrollt nur im eigenen Container
  (kein horizontaler Body-Scroll).

## Datenquelle Fachrichtungen (38, DQR 6 / Bachelor Professional)
Vom Betreiber gelieferte Tabelle der **38 bundeseinheitlich geregelten IHK-Fachwirte**
(alle DQR-Niveau 6, Titel „Bachelor Professional"). Datenarray in
`src/pages/fachrichtungen.astro` (`FACHRICHTUNGEN`: `name`, `branche`, `status`).
**Status:** aktuell nur **Fachwirt/in für Marketing = live**, alle übrigen 37 = „in
Vorbereitung" (ehrlich, kein Vortäuschen). Karussell auf `/willkommen` zeigt eine
kuratierte Auswahl von 12; `/fachrichtungen` listet alle 38 mit **Live-Suche**
(Name/Branche) und **einheitlicher Card-Größe**.

## CTAs (v1)
- **„Demo anfragen"** (Hero, Burger, B2B-Card) = **`mailto:`** an `KONTAKT_EMAIL`
  (`willkommen.astro`) — aktuell **vorläufige Adresse `service@norive.de`**;
  echtes Formular später via Brevo.
- **„So funktioniert's"** (B2C-Card) → Erklärseite `/so-funktionierts`.
  Hero-Ghost „So funktioniert's" bleibt Anker `#wie` (Section 1).

## Offen / Roadmap
- Weitere Sections: **Vertrauen** (KI niedrigrisiko, EU/DSGVO, erfahrene Fachdozenten) ·
  **CTA-Band** · **Footer** (Impressum · Datenschutz · Login) · optional FAQ.
- `impressum.astro` / `datenschutz.astro` noch anzulegen (Allowlist bereits gesetzt).
- Keine erfundenen Referenzen/Testimonials; Social-Media-Bereich später.
- Erledigt: Hero · Section 1–4 · /fachrichtungen (38) · /so-funktionierts · mailto-CTA.

## Doku-Parität
Diese Datei ist die Quelle für den Notion-Abgleich (docs Repo ↔ Notion). Bei
Änderungen an den Marketing-Seiten hier nachziehen.

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
| `/impressum` | `src/pages/impressum.astro` | Impressum — **Gerüst mit Platzhaltern** (keine erfundenen Rechtsdaten) |
| `/datenschutz` | `src/pages/datenschutz.astro` | Datenschutz — **Gerüst mit Platzhaltern** |

- Alle `prerender = false`, **öffentlich** via Allowlist in `src/middleware.ts`
  (`OEFFENTLICHE_PFADE` enthält `/willkommen`, `/fachrichtungen`, `/so-funktionierts`).
- Verifikation: liefern **200 ohne Login**; gegatete Seiten weiterhin 302 → `/konto`.

## Designsystem (landing-lokal, nicht global)
Bewusst eigener, immersiver Stil (Referenz: orizon.co) — getrennt von den globalen
Norive-Tokens, damit die App unberührt bleibt. Palette **Kosmos-Blau + Gold auf Hell**:

- `--navy #1B2A4A`, `--gold #C4A882`, `--ink #14181F`, `--ink-muted #5A6172`,
  `--bg #EFEDE7`, `--surface #FFFFFF`, `--line rgba(20,24,31,0.10)`.
- **Dunkle Card-Triade** (Geometrie `radial-gradient(120% 130% at 14% 8%)`, Gold-Glow):
  Blau `#2E4C8C → #13213E` · Indigo `#4A3F86 → #191536` · Petrol `#256E79 → #0F2930`.
- **Verteilung:** S1 Blau · S2 Karussell im **Blau/Indigo/Petrol-Dreier-Rhythmus** ·
  S3 Indigo · S4 alle drei (Card 1/2/3) · S5 Petrol-Band · CTA Navy · **Footer tiefes
  Indigo** (`#241E48 → #100C24`).

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
   Layout je Card wie orizon: **oben** Headline + Grafik, **unten** zwei gestapelte
   Texte + zweite Grafik daneben (**Card 2 gespiegelt** — Bild links, Text rechts);
   **Card 1/2/3 visuell unterschiedlich** (Blau / Indigo / Petrol), Gold verbindet.
   Cards füllen die **volle Screenhöhe**; der **Section-Kopf** (Eyebrow/Headline/
   Subtitle) steckt in **Card 1**. In Card 1 zeichnet sich der **rote Faden**
   (Pfad-Linie) langsam animiert nach.
7. **Section 5 „Vertrauen":** volles **Petrol-Band** (Farbschema von Card 3, heller
   Text), 4 Icon-Kachel-Punkte — EU/DE-Hosting & DSGVO · verantwortungsvolle/
   niedrigrisiko KI · didaktisch fundiert (erfahrene Fachdozenten, ohne Namen) ·
   Barrierefreiheit (WCAG 2.2 AA).
8. **CTA-Band:** zentriertes Navy-Gold-Panel auf hellem Grund — „Demo anfragen"
   (mailto) + „Zum Angebot".
9. **Footer:** dunkles Navy (`#0E1626`) — Wortmarke + Tagline, Nav (Plattform /
   Rechtliches / Zugang), reservierter „Referenzen & Social — folgt", EU/DE-Hinweis, ©.

**Einheitlicher Abstands-Rhythmus:** jeder Section-Übergang misst
`clamp(84px, 10vw, 148px)`; die Trenner (`.lp-divider`) sitzen mittig mit je der
Hälfte (`clamp(42px, 5vw, 74px)`), Sektionen haben an Trenner-Seiten 0 Padding.

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
- **Impressum/Datenschutz** sind **Gerüste** — Betreiber muss die `[…]`-Platzhalter
  rechtsverbindlich ausfüllen (keine erfundenen Rechtsdaten im Repo).
- **Kontakt-Mail** `service@norive.de` ist vorläufig; echtes Kontaktformular später via Brevo.
- Keine erfundenen Referenzen/Testimonials; Social-Media-Bereich später (Footer-Platzhalter steht).
- Optional: FAQ, Go-Live-Indexierung (BaseLayout `noindex` derzeit global).
- **Erledigt:** Hero · Section 1–5 · CTA-Band · Footer · /fachrichtungen (38, Suche) ·
  /so-funktionierts · /impressum · /datenschutz · mailto-CTA · einheitliche Abstände.

## Doku-Parität
Diese Datei ist die Quelle für den Notion-Abgleich (docs Repo ↔ Notion). Bei
Änderungen an den Marketing-Seiten hier nachziehen.

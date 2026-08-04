# Titan — Lernbereich- & Navigations-Redesign (Konzept / SSOT)

> Stand 2026-08-04. Entstanden aus einer kritischen Grundsatz-Prüfung: Navigation
> zu versteckt, Lernbereich fragmentiert (5 parallele Modi statt einer Reise),
> USP nur zu ⅓ real (15/46 Planeten mit Werkzeug). Dieses Dokument ist die
> gemeinsame Grundlage, **bevor** gebaut wird — „Fundament zuerst".

## Nordstern (unverändert)
„Fachwirt trifft begründete Entscheidung." Roter Faden **Star-Company**: einmal
beschreiben → am Planeten mit Werkzeugen bearbeiten → Artefakt → fertige
IHK-Präsentation. Ruhige Kosmos-Ästhetik bleibt Identität.

## Getroffene Grundsatz-Entscheidungen
1. **Kosmos WIRD der Pfad.** Die Planeten werden zu einem klaren Knotenpunkt-Pfad
   im Kosmos-Look („du bist hier → als Nächstes X"); Konvention (geführter Pfad)
   wird in die Marke integriert, kein zweites konkurrierendes Interface.
2. **Hybride Führung (kein hartes Gating).** Es gibt einen klar **empfohlenen
   nächsten Schritt** + Fortschritts-Sog, aber Erwachsene dürfen jederzeit gezielt
   zu jedem Thema springen (Prüfungsvorbereitung). „Empfohlen", nicht „gesperrt".

## Zielbild A — Geführte Navigation / Informationsarchitektur
Heute: einziger Zugang zu Lernbereich/Deck/Admin/Cockpit ist ein FAB-Modal. Neu:
- **Rollen-bewusstes Zuhause nach Login** statt direkt ins Karussell zu werfen:
  ein schlanker Einstieg „Weiterlernen (nächster empfohlener Schritt) · Deck ·
  [Cockpit] · [Admin]". Lerner sehen den Lernpfad; Dozent/Admin sehen zusätzlich
  ihre Werkzeuge **sichtbar** (nicht in einem Modal versteckt).
- **Persistente, dezente Navigation** (Kosmos-konform) mit den Kernzielen:
  Lernpfad · Präsentations-Deck · Mein Bereich · rollenabhängig Cockpit/Admin.
- FAB/„Mein Bereich" bleibt für Konto/Star-Company/Feineinstellungen, ist aber
  nicht mehr der **einzige** Weg zu Kernzielen.

## Zielbild B — Kosmos als Lernpfad (Knotenpunkte)
- Planeten eines Handlungsbereichs bilden einen **sichtbaren Pfad** mit Zuständen:
  erledigt · aktuell/empfohlen · offen. Der „empfohlene nächste" Planet ist
  hervorgehoben (Sog), alle bleiben anklickbar (Hybrid).
- Fortschritt je Planet aus dem bestehenden `norive-progress` (4 Phasen).
- Ästhetik bleibt Kosmos; der Pfad ersetzt das „Karten ohne Richtung"-Gefühl.

## Zielbild C — 3-Zonen-Kapitel-Layout (löst die Modi-Fragmentierung)
Statt 5 vorgeschalteter Modi **eine Kapitel-Ansicht** in drei Zonen. Leitziel:
**Fokus maximieren, kognitive Last senken** — der Nutzer weiß jederzeit *wo er
steht, was als Nächstes kommt und warum*.

**Zone A — Linke Sidebar (Orientierung & Lernpfad):**
- Vertikaler Lernbaum mit Status je Einheit: **erledigt** (Häkchen) · **aktiv**
  (hervorgehoben, dezenter Puls) · **offen** · optional **empfohlen**.
- **Mini-/Kompaktmodus:** per Klick zu einer Icon-Leiste einklappbar → 100 % Fokus
  auf den Inhalt.
- Sprung zu bereits erledigten Einheiten jederzeit möglich (Hybrid).

**Zone B — Hauptbereich (kognitiver Anker):**
- **Karten statt Endlos-Scroll:** jede Lektion = eine klar abgegrenzte Karte/ein
  Screen-Abschnitt (Microlearning, ~5 Min).
- **Progress-Bar oben:** zeigt exakt „Schritt 3 von 5" innerhalb der Lektion.
- **Typografie/Struktur:** große Lesbarkeit, kurze Absätze (3–4 Zeilen),
  Kernbegriffe fett; viel Whitespace.
- Die Reise **Verstehen → Merken → Anwenden → Prüfen** wird zum **Karten-Fluss**;
  Lernzettel/Übung(MC)/IHK-Test sind **Stationen dieser einen Reise**, nicht Tabs.
- **Genau ein primärer Folge-Button** je Karte („Verstanden & Weiter").

**Zone C — Rechte Sidebar (Interaktion & Assistenz):**
- Kontextuelle, **nicht-statische** Werkzeuge: interaktiver Rechner/Widget, MC-Frage,
  Live-Vorschau — passend zur aktuellen Karte.
- **Aufklappbarer KI-Tutor** („Das genauer erklären") strikt zum aktuellen
  Screen-Inhalt → **Phase 3 (KI)**; Andockpunkt jetzt reservieren.

## User Flow — die Lernschleife (Habit Loop)
Jede Lektion folgt derselben Schleife (schafft Vertrautheit + Momentum):
1. **Einstieg / Kontext:** prägnante **Lernziel-Karte** — „In ~5 Min lernst du X
   und kannst danach Y." Setzt Erwartung + Motivation.
2. **Wissensvermittlung (scaffolded):** kurze Häppchen, **direkt gekoppelt** an eine
   interaktive Komponente (z. B. Regler verstellen → Wirkung sofort sehen).
3. **Formative Überprüfung:** **Mikro-Quizzes zwischendurch** statt eines langen
   Tests am Ende.
4. **Instant Feedback:** bei falsch → **konstruktiver Hinweis** (nicht nur „falsch");
   bei richtig → ruhige visuelle Bestätigung.
5. **Abschluss & Momentum:** kurzer **Belohnungs-Screen** (Fortschritt, Streak/Punkte)
   + prominenter **„Nächste Lektion starten"**.

## UI/UX-Regeln & Micro-Interactions (verbindlich, Kosmos-konform)
- **Signalfarben sparsam:** Primärfarbe nur für die Haupt-Aktion, Grün = Erfolg,
  Gelb = Hinweis; Rest neutral (Norive-Tokens, Hell/Dunkel). Kein Kitsch.
- **Whitespace** großzügig um Text/Widgets → Konzentration.
- **Sanfte Übergänge:** richtige Antwort → weiches Gleiten zur nächsten Karte
  (ruhig/organisch, `prefers-reduced-motion` respektieren).
- **Tactile Feedback:** dezentes Einfedern von Buttons beim Klick („Substanz").
- **No Dead Ends:** kein leerer Screen/Sackgasse — **jede** Ansicht hat genau eine
  primäre Folgeaktion (Primary CTA). *(Löst zugleich das heutige „31 Planeten ohne
  Werkzeug wirken leer".)*

## ⚠️ Offener Widerspruch (deine Entscheidung)
Die Detailspezifikation nennt **„Sperre / Schloss = Mastery-Freischaltung"** —
das steht im Konflikt zur getroffenen **hybriden Führung (frei springbar, kein
hartes Gating)**. Beides gleichzeitig geht nicht sauber. Zu klären (siehe Rückfrage):
soft (empfohlen/optional, keine echten Schlösser) · Soft-Lock mit Ein-Klick-Override ·
oder doch echtes Gating (revidiert die Hybrid-Entscheidung).

## Framework-Abgleich (dein Maßstab → wie adressiert / Stufe)
| Prinzip | Umsetzung im Redesign | Stufe |
|---|---|---|
| Klarer visueller Pfad | Zielbild B (Kosmos-Pfad) + Lernbaum links | jetzt |
| 3-Zonen-Layout | Zielbild C | jetzt |
| Interaktive Widgets | vorhanden — **Abdeckung 15→46 Planeten ausrollen** (USP real machen) | jetzt (Stufe A) |
| Immediate Feedback (warum) | MC/IHK vorhanden; im Fluss klarer inszeniert | jetzt |
| Chunking/Microlearning | Mitte-Zone in Häppchen statt Modus-Blöcke | jetzt |
| Streak/Momentum | vorhanden — im Pfad sichtbar inszenieren | jetzt |
| Aktives Handeln vor Konsum | Anwenden-Werkzeug rückt in den Mittelpunkt | jetzt |
| Hybride Führung (empfohlen, frei) | „empfohlener nächster Schritt" + frei springbar | jetzt |
| Adaptive Pfade / Einstiegstest | **bewusst später** (nach dem Fundament) | Phase 3 |
| KI-Lernassistent (rechte Zone) | Andockpunkt reserviert | Phase 3 (KI) |

## Vorgeschlagene Bau-Reihenfolge (reversibel, je Stufe verifizierbar)
1. **Navigation/IA-Fundament:** rollenbewusster Einstieg + persistente Kern-Navigation
   (Lernpfad/Deck/Cockpit/Admin sichtbar). Kleinster Schritt, sofort spürbar.
2. **Kosmos-Pfad:** HB-Übersicht als Knotenpunkt-Pfad mit Zuständen + „empfohlen".
3. **3-Zonen-Kapitel:** Lernseite von Modus-Wahl auf 3-Zonen-Fluss umbauen
   (Modi werden Stationen). Alten Stand hinter Flag/reversibel halten.
4. **Werkzeug-Abdeckung ausrollen** (weitere Planeten bekommen ein Werkzeug) —
   macht den USP flächendeckend real.
5. **Feinschliff Motivation** (Streak/Momentum im Pfad) + Microlearning-Schnitt.

## Bewusst NICHT jetzt
Adaptivität/Einstiegstest, KI-Assistent/Freitext-Feedback (Phase 3), hartes
Mastery-Gating. Erst das strukturelle Fundament, dann Intelligenz obendrauf.

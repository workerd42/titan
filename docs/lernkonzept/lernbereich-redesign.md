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
Statt 5 vorgeschalteter Modi **eine Kapitel-Ansicht** in drei Zonen:
- **Links — Lernbaum & Fortschritt:** Kapitel des HB, „du bist hier", Sprung zu
  erledigten Modulen, Mini-Fortschritt. (Die heutige Modus-Wahl entfällt als
  Hürde.)
- **Mitte — Lern-Hub:** die Reise **Verstehen → Merken → Anwenden → Prüfen** als
  durchgehender Fluss in verdaulichen Häppchen (Microlearning), mit dem
  **interaktiven Werkzeug** als Herzstück der Anwenden-Phase. Lernzettel/Übung
  (MC)/IHK-Test sind **Stationen dieser einen Reise**, nicht konkurrierende Tabs.
- **Rechts/Unten — Hilfe & Feedback:** Notizen, sofortiges Quiz-Feedback (warum
  richtig/falsch, schon vorhanden), später der **KI-Lernassistent** (Phase 3).

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

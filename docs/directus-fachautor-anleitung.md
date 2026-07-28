# Titan — Fachautor-Kurzanleitung (Directus)

> Für **Redakteur:innen/Fachautor:innen**, die Lerninhalte pflegen. Keine Technik nötig —
> reines Ausfüllen von Formularen. Technischer Hintergrund: [directus-setup.md](directus-setup.md).

## Anmelden

- **Adresse:** http://localhost:8055 (lokal) — die Produktions-Adresse folgt später.
- **Anmeldung:** mit deiner E-Mail + Passwort. Beim ersten Login das Passwort ändern
  (oben rechts → Profil).
- Nach dem Login links **„Themen"** wählen.

## Ein Thema anlegen oder bearbeiten

Klicke auf ein bestehendes Thema oder oben rechts auf **„+"** für ein neues. Das Formular ist
in die **Lern-Phasen** gegliedert (aufklappbar):

| Gruppe | Was hier rein gehört |
|---|---|
| **Identität & Einordnung** | Slug (URL-Name), Titel, Handlungsbereich, Themengruppe, Reihenfolge, Beschreibung, **Status** |
| **Verstehen** | Haupttext (Markdown), Definitionen, Formeln, Zusammenfassung, Rechtsgrundlagen, Werkzeug |
| **Merken** | Merksatz, Begriffe (Karteikarten) |
| **Anwenden — Fallbeispiel** | Situation, Aufgabe, Musterlösung |
| **Prüfen** | Frage, Lösungsweg |
| **Wiederholung** | nach wie vielen Tagen wiederholen (Standard 4) |

**Pflichtfelder** sind mit einem roten `*` markiert — ohne sie lässt sich das Thema nicht sinnvoll
veröffentlichen. Unter jedem Feld steht ein grauer **Hinweistext**.

### Listen (Begriffe, Definitionen, Formeln, Rechtsgrundlagen)

Kein JSON mehr — einfach auf **„… hinzufügen"** klicken, die Unterfelder ausfüllen, bei Bedarf
weitere Einträge anlegen oder per Ziehgriff sortieren.

### Haupttext (Markdown)

Der Editor bietet eine Werkzeugleiste (fett, Listen, Tabelle, Link, Bild). Über **„Vorschau"**
siehst du das Ergebnis. Kein HTML nötig.

## Veröffentlichen — die zwei Stufen

Das Feld **Status** steuert, ob ein Thema live geht:

- **In Bearbeitung** — Entwurf. Wird **nicht** auf der Lernplattform angezeigt. Ideal zum
  Vorbereiten, unfertig lassen, mit Kolleg:innen abstimmen.
- **Publikation-Frei** — freigegeben. Wird beim **nächsten Build** von Titan live gezogen.

> Titan zieht **nur** Themen mit Status „Publikation-Frei". Solange etwas „In Bearbeitung" ist,
> sieht es niemand außer im Redaktionssystem.

## Wichtig: Rechtsgrundlagen (Urheberrecht)

Bei **Rechtsgrundlagen** (Gesetze) **keine wörtlichen Gesetzestexte** kopieren. Stattdessen:
**eigene Erklärung + Anwendungsbeispiel + Link zur amtlichen Quelle**
(z. B. gesetze-im-internet.de). Details: [content-richtlinien.md](content-richtlinien.md).

## Nach dem Speichern

Directus speichert sofort. Damit die Änderung **auf der Lernplattform** erscheint, muss Titan neu
gebaut/synchronisiert werden (aktuell manuell; später automatisch per Webhook —
[directus-setup.md](directus-setup.md) „Auto-Deploy"). Zur Kontrolle gibt es die
**Redaktions-Vorschau** unter `/cms-vorschau/<slug>` (nach Titan-Login).

# Titan — Prozessbeschreibung (Wie alles zusammenspielt)

> Zweck: ein gemeinsames Verständnis, **wie Titan funktioniert** — für Team,
> Partner, Dozenten und Investoren. Verweise: [produktvision.md](produktvision.md) ·
> [rollen-rechte.md](rollen-rechte.md) · [ki-governance.md](ki-governance.md) ·
> [architektur.md](architektur.md).

## 1. Der rote Faden (das Herzstück)

Titan führt Lernende von der Theorie bis zur **fertigen IHK-Präsentation** —
entlang **eines** durchgehenden Fadens:

```
 Kompass-Unternehmen  →  Werkzeuge (Phase „Anwenden")  →  Artefakte  →  Deck  →  IHK-Präsentation
 (eigenes fiktives        SWOT, Deckungsbeitrag,           (Folien)      (Sammlung)   (druckfertig)
  Unternehmen, 1× erstellt) Nutzwertanalyse …
```

Statt abstrakt zu pauken, **wendet** der Lerner jedes Werkzeug auf sein **eigenes
Unternehmen** an. Jede Anwendung erzeugt ein **Artefakt** (Folie), das automatisch
ins **Präsentations-Deck** wandert. Am Ende steht ein prüfungsfertiges Deck —
das eigentliche Prüfungsergebnis entsteht als **Nebenprodukt des Lernens**.

## 2. Lern-Prozess je Kapitel (4 Phasen)

```
 ① Verstehen   →  ② Merken      →  ③ Anwenden          →  ④ Prüfen
 Theorie/          Prüfungsanker    Werkzeug am eigenen     IHK-Frage im
 Definitionen      (Must-know)      Unternehmen → Artefakt   Prüfungsmodus
```

Zusätzlich wählbar je Kapitel: **Entdecken · Interaktive Module · Übungsbereich ·
IHK-Test · Lernzettel** (die fünf Modi).

## 3. Zugangs- & Onboarding-Prozess

```
 Einladung (invite-only)  →  Account (Admin legt an)  →  Login (/konto)
   →  Kompass-Unternehmen anlegen (Aha-Moment)  →  Lernen  →  Deck wächst mit
```

- **Kein offener Self-Signup** — Accounts entstehen im Admin-Panel bzw. (B2B) durch
  den Org-Admin. Inhalte sind **serverseitig hinter Login** ([rollen-rechte.md](rollen-rechte.md)).
- **Local-First:** Fortschritt liegt sofort lokal; mit Konto wird er
  geräteübergreifend synchronisiert.

## 4. Wer macht was (Rollen im Prozess)

| Rolle | Aufgabe im Prozess |
|---|---|
| **Lerner** | lernt, baut Kompass-Unternehmen, erzeugt Artefakte, bereitet Präsentation vor |
| **Dozent** | liefert fachlichen **Master**, begleitet Lerner, sieht Fortschritt (Cockpit 🔜) |
| **Org-Admin** (Bildungsträger) | provisioniert Lerner der Organisation, verwaltet Kurse 🔜 |
| **Platform-Admin** | Betrieb, Nutzer-/Rollenverwaltung, Content-Freigabe |
| **Fachautor** | pflegt/aktualisiert Inhalte (geplant über Directus) |

Details: [rollen-rechte.md](rollen-rechte.md).

## 5. Content-Prozess (Skalierung)

```
 Dozenten-Master  →  Content-Pack (je Fachwirt)  →  Redaktion (Directus, geplant)  →  Ausrollen
 (autoritative        Kern adaptierbar; nur           EU-gehostet, getrennt von        ohne Code-
  Inhalte)            Spezialisierungen je Fachwirt    der Lerner-Anmeldung             Änderung
```

Die strikte Trennung **Engine (Software) ↔ Content-Packs (IHK-Inhalte)** macht neue
Fachwirte (und später andere Zielgruppen) ohne Code-Änderung ausrollbar.

## 6. KI-Prozess (geplant, niedrigrisiko)

```
 Dozenten-Master  →  n8n-Agent (fiktives Rollenprofil, gebundener Kontext)
   →  (1) erzeugt Aufgaben-/Fallvarianten
      (2) gibt zu Freitext-Lösungen FORMATIVES Feedback (keine Note)
   →  Lerner nutzt es als Lernhilfe (überstimmbar); Bewertung bleibt beim Menschen
```

Verbindlicher Rahmen (Transparenz, keine Benotung, keine Personendaten, EU-Hosting):
[ki-governance.md](ki-governance.md).

## 7. Betriebs- & Absicherungs-Prozess

- **Deploy:** lokal push → VPS `./deploy.sh` (git pull + `docker compose up -d
  --build`; Migrationen laufen automatisch). Details: [deployment.md](deployment.md).
- **Backup:** verschlüsselt, EU/DE (Off-site Hetzner geplant).
- **Nach jeder Sitzung:** committen/pushen + Stand ins Gedächtnis + **Doku-Abgleich
  VSCode ↔ Notion ↔ GitHub**.

## 8. Geschäftsprozess (kurz)

```
 Bildungsträger lizenziert Kurs (800 €/Monat je Kohorte)  →  Dozent setzt Titan im Kurs ein
   →  Lerner bestehen besser + haben fertige Präsentation  →  Referenz  →  weitere Träger
```

Details: [businessplan.md](businessplan.md), [marketing-konzept.md](marketing-konzept.md).

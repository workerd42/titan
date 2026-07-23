# Lastenheft — Titan (The Competence Engine)

> Anforderungen an das Produkt (was es leisten muss, nicht wie).
> **Status je Anforderung:** ✅ umgesetzt · ◐ teilweise · 🔜 geplant.
> Verweise: [produktvision.md](produktvision.md) · [architektur.md](architektur.md) ·
> [ki-governance.md](ki-governance.md) · [businessplan.md](businessplan.md) ·
> [roadmap.md](roadmap.md).

---

## 1. Zielbestimmung

Titan ist eine webbasierte Lernplattform, die angehende **IHK-Fachwirte** von der
Theorie bis zur **prüfungsfertigen Präsentation** begleitet. Kern ist das Lernen
durch Anwenden am eigenen fiktiven „Star-Company" (roter Faden:
Star-Company → Artefakte → IHK-Präsentation).

**Musskriterien (Kern):** geschützter Zugang mit Rollen; geführte Lernkapitel
(4 Phasen); interaktive Werkzeuge, die Artefakte erzeugen; Sammlung der Artefakte
zu einem Präsentations-Deck; Fortschritts-Speicherung pro Konto; Betrieb
DSGVO-konform in EU/Deutschland.

**Abgrenzung (nicht Teil des Produkts):** keine automatisierte Benotung/Bewertung
von Lernenden durch KI (siehe [ki-governance.md](ki-governance.md)); keine
Terminverwaltung/Abrechnung von Lehrgängen; kein Ersatz für die IHK-Prüfung selbst.

---

## 2. Zielgruppen & Rollen

- **Lerner** (`lerner`) — Prüfling; nutzt Lerninhalte, Star-Company, Deck. ✅
- **Dozent** (`dozent`) — begleitet zugeordnete Lerner; Fortschritts-Einsicht. ◐ (Rolle vorhanden, Cockpit 🔜)
- **Org-Admin** (`org-admin`) — verwaltet Lerner einer Organisation/eines Trägers. ◐ (Rolle vorhanden, Org-Funktionen 🔜)
- **Plattform-Admin** (`platform-admin`) — Betreiber; volle Nutzer-/Rollenverwaltung. ✅

---

## 3. Produktumgebung

- **Client:** moderne Webbrowser (Desktop + Mobil), inkl. barrierefreier Bedienung. ✅
- **Server:** Node-Anwendung (Astro-Hybrid) + PostgreSQL, containerisiert. ✅
- **Betrieb:** self-hosted auf VPS in **EU/Deutschland**; alle datenverarbeitenden
  Dienste EU/DE. ✅

---

## 4. Funktionale Anforderungen

### 4.1 Zugang, Konten & Rollen
- **/LF010/** Der Zugang zu allen Lerninhalten erfolgt **nur nach Anmeldung**
  (serverseitiges Login-Gate). ✅
- **/LF011/** Registrierung ist **invite-only**; Konten werden im Admin-Panel
  angelegt. ✅
- **/LF012/** Rollen `platform-admin`/`org-admin`/`dozent`/`lerner`; im Admin-Panel
  änderbar. ✅
- **/LF013/** Nutzer sperren/entsperren. ✅
- **/LF014/** Sichere Authentifizierung (gehashte Passwörter, Session-Cookies,
  CSRF-Schutz) über eine etablierte Auth-Bibliothek. ✅
- **/LF015/** Erst-Admin-Bootstrap ohne offene Registrierung. ✅

### 4.2 Lernbereich
- **/LF020/** Hierarchische Navigation Universum → Handlungsfeld → Kapitel
  (Karussell-/Kosmos-UI). ✅
- **/LF021/** Fünf Nutzungsmodi je Kapitel: **Entdecken, Interaktive Module,
  Übungsbereich, IHK-Test, Lernzettel**. ◐ (Modus-Auswahl + Entdecken/Module/
  Lernzettel ✅; Übung/IHK-Test-Inhalte 🔜)
- **/LF022/** Modus-Auswahl merkt sich die Wahl (keine Wiederholung je Kapitel). ✅
- **/LF023/** 4-Phasen-Methodik je Kapitel: Verstehen → Merken → Anwenden →
  Prüfen. ✅
- **/LF024/** Lesemodus/Barrierefreiheit für alle Phasen. ✅
- **/LF025/** Volltextsuche über alle Ebenen (Command-Palette). ✅
- **/LF026/** Lernzettel-Modus mit Begriffen/Karteikarten (Vorder-/Rückseite). ✅
- **/LF027/** Position im Karussell/Kapitel wird über Navigation hinweg
  wiederhergestellt. ✅

### 4.3 Star-Company
- **/LF030/** Der Lerner konfiguriert einmalig sein fiktives Unternehmen
  (Name, Branche, Rechtsform, Größe …). ✅
- **/LF031/** Star-Company-Daten werden überall per Ersatzvariablen (`{{platzhalter}}`)
  eingesetzt (offline, ohne KI). ✅
- **/LF032/** Star-Company ist jederzeit über „Mein Bereich" einseh-/bearbeitbar. ✅

### 4.4 Interaktive Werkzeuge & Artefakte
- **/LF040/** Werkzeuge in Phase „Anwenden" (SWOT, Deckungsbeitrag,
  Nutzwertanalyse, Marketing-Mix …), je Kapitel passend zugeordnet. ◐ (Kern-Set ✅,
  weiterer Katalog 🔜)
- **/LF041/** Jedes abgeschlossene Werkzeug erzeugt ein **Artefakt** (Folie) für
  das Präsentations-Deck. ✅
- **/LF042/** Werkzeuge arbeiten mit den Star-Company-Daten (personalisiert). ✅

### 4.5 Präsentations-Deck
- **/LF050/** Alle erzeugten Artefakte werden zu einem **IHK-Präsentations-Deck**
  gesammelt und sind abrufbar. ✅
- **/LF051/** Deck ist druck-/exportierbar (PDF). ✅
- **/LF052/** Leitfaden fürs Fachgespräch (KI-gestützt). 🔜

### 4.6 Fortschritt & Synchronisation
- **/LF060/** Fortschritt & Star-Company werden **lokal** gespeichert (Local-First,
  offline nutzbar). ✅
- **/LF061/** Bei aktivem Konto Synchronisation auf den Server, geräteübergreifend
  (Merge-Regel: erledigt, wenn lokal ODER server erledigt). ✅
- **/LF062/** Lernstreak/Wiederholung; Wiederholungsabstände am Prüfungsdatum
  ausgerichtet (Spaced Repetition). ◐

### 4.7 Verwaltung (Admin-Panel)
- **/LF070/** Nutzer auflisten, anlegen, Rolle ändern, sperren — nur für
  `platform-admin`. ✅
- **/LF071/** Zweischichtiger Schutz: Seiten-Gate + serverseitige API-Autorisierung. ✅

### 4.8 Dozenten-Cockpit & Organisationen (B2B)
- **/LF080/** Dozent sieht den Fortschritt der ihm zugeordneten Lerner. 🔜
- **/LF081/** Organisation/Bildungsträger registriert sich; Org-Admin legt Lerner
  an / lädt per E-Mail ein; Lerner sind der Organisation zugeordnet. 🔜
- **/LF082/** Lizenz-/Platzverwaltung pro Kurs (Abrechnungsgrundlage
  800 €/Monat je Kurs). 🔜
- **/LF083/** Transaktionale E-Mails (Einladung, Passwort-Reset) über EU-Anbieter. 🔜

### 4.9 KI-Schicht (geplant — niedrigrisiko)
- **/LF090/** KI erzeugt **Aufgaben-/Fallvarianten** aus dem Dozenten-Master **und
  gibt formatives, inhaltliches Feedback** zu Freitext-Falllösungen — **ohne
  Note/Score**, ohne prüfungsrelevante Entscheidung. 🔜
  → Rahmen verbindlich in [ki-governance.md](ki-governance.md).
- **/LF091/** n8n-Agenten mit fiktivem Rollenprofil + gebundenem Master
  (Halluzinations-Vermeidung); keine personenbezogenen Daten. 🔜
- **/LF092/** KI-generierte Inhalte werden **als solche gekennzeichnet** und sind
  auf den Master rückführbar (Transparenz Art. 50). 🔜
- **/LF093/** Grammatik-/Kontext-Puffer: Star-Company-Daten einmalig zu einem
  deklinierten Kontext-JSON verarbeiten. 🔜

### 4.10 Redaktion / Content
- **/LF100/** Fachautor:innen pflegen Inhalte über ein Redaktionssystem
  (Directus, EU-gehostet), getrennt von der Lerner-Anmeldung. 🔜
- **/LF101/** Trennung **Engine ↔ Content-Packs** → neue Fachwirte ohne
  Code-Änderung ausrollbar. ✅

---

## 5. Nichtfunktionale Anforderungen

### 5.1 Sicherheit & Datenschutz
- **/NF010/** DSGVO-konform; nur technisch notwendiges Session-Cookie (kein
  Tracking → kein Cookie-Banner nötig). ✅
- **/NF011/** Alle datenverarbeitenden Dienste in **EU/Deutschland**. ✅
- **/NF012/** Inhalte serverseitig geschützt (kein Ausliefern an nicht
  angemeldete Nutzer). ✅
- **/NF013/** Secrets nie im Repository; strikte Content-Security-Policy. ✅

### 5.2 Rechtskonformität (EU AI Act)
- **/NF020/** KI-Einsatz bleibt **außerhalb Hochrisiko** (keine Bewertung/
  Zugangsentscheidung durch KI); Transparenzpflichten erfüllt. 🔜/Design
  → [ki-governance.md](ki-governance.md).

### 5.3 Barrierefreiheit
- **/NF030/** WCAG 2.1 AA; verifiziert (0 axe-Verstöße). ✅
- **/NF031/** Tastatur-/Screenreader-Bedienung, Fokus-Sichtbarkeit,
  `prefers-reduced-motion` respektiert. ✅

### 5.4 UX & Design
- **/NF040/** Ruhiges, organisches „Kosmos"-Erlebnis; Animationen langsam/weich
  (siehe [design-system.md](design-system.md)). ✅
- **/NF041/** Responsive (Desktop + Mobil; auch Ultrawide). ✅
- **/NF042/** Schnelle Auslieferung (statische Inhalte vorgerendert, wo möglich). ◐
  (durch das Login-Gate sind Lernseiten on-demand; Optimierung möglich)

### 5.5 Skalierbarkeit, Verfügbarkeit, Betrieb
- **/NF050/** Engine/Content-Trennung für fachübergreifende Skalierung. ✅
- **/NF051/** Automatisierte, verschlüsselte Backups; Off-site-Backup (EU/DE). ◐
  (lokal ✅; Off-site Hetzner 🔜)
- **/NF052/** Externes Monitoring (EU/DE). 🔜
- **/NF053/** Wiederholbares Deployment (Container, automatische Migrationen). ✅

---

## 6. Abnahmekriterien (Auszug)

- Nicht angemeldete Zugriffe auf Lerninhalte werden **serverseitig** auf die
  Anmeldung umgeleitet. ✅ (verifiziert)
- Rollenwechsel/Sperren wirken sofort und sind gegen Missbrauch serverseitig
  abgesichert. ✅ (verifiziert)
- Ein abgeschlossenes Werkzeug erscheint als Artefakt im Deck. ✅
- Fortschritt eines eingeloggten Nutzers ist auf einem zweiten Gerät sichtbar. ✅
- Barrierefreiheit: 0 automatisiert erkennbare Verstöße (axe). ✅
- KI-Livegang erst nach juristischer Bestätigung der Einstufung/DPIA. 🔜 (Gate)

---

## 7. Randbedingungen

- **EU/Deutschland-Grundsatz** für alle Dienste mit Datenkontakt (bindend).
- **Invite-only** bis zur bewussten Öffnung (Marketing/Paywall als spätere Schicht).
- **SEO bewusst aus** (`noindex`) im Prototyp-Zustand.
- Kern-Auth/Sicherheit ausschließlich über etablierte Bibliothek, nichts
  Sicherheitskritisches selbst gebaut.

---

*Dieses Lastenheft wird mit dem Ausbau (Dozenten-Cockpit, B2B-Organisationen,
KI-Schicht, Redaktionssystem) fortgeschrieben; Status-Tags entsprechend
aktualisieren.*

# Titan — Prüfungs-Blaupause (Fachwirt für Marketing)

> Fundament für die Übungs-/Test-Modi. Basiert auf der **programmatischen Analyse von 13 echten
> IHK-Prüfungen** (`docs/quellen/Prüfungen/`, FWfM 2017–2025, ~970.000 Zeichen).
>
> ⚠️ **Urheberrecht:** Analysiert werden **Format, Struktur und Operator-Häufigkeit** (Fakten über
> die Prüfung) — **kein** Prüfungstext wird reproduziert. Alle Titan-Aufgaben entstehen in
> **eigenem Wording** (siehe [content-richtlinien.md](content-richtlinien.md)).

---

## 1. Anatomie einer Prüfung

- **100 Punkte** gesamt, schriftlich, Freitext (keine MC im Original).
- **2 „Betriebliche Situationsbeschreibungen; abgeleitete Aufgabenstellung"** — je ein
  Unternehmens-Szenario (fiktive Firma) mit **mehreren Teilaufgaben** (Aufgabe 1 … 7+).
- **Alle Handlungsbereiche** werden über die zwei Fälle abgedeckt.
- Jede Teilaufgabe = **Operator + geforderte Anzahl + Punktwert**
  (z. B. „Erläutern Sie *drei* Analysemethoden …" · 6 Punkte).
- Punktvergabe je Teilaufgabe: überwiegend **2 / 3 / 4 / 6** Punkte (bis 12).
- Zu jeder Aufgabe gibt es offizielle **Lösungshinweise** (Musterlösung).

## 2. Die Aufgabentypen — IHK-Operatoren (Häufigkeit über 13 Prüfungen)

| Operator | Häufigkeit | Was er verlangt | Titan-Modus |
|----------|-----------:|-----------------|-------------|
| **Erläutern** | 136 | Sachverhalt **verständlich ausführen** (nicht nur nennen) | Freitext → KI-Feedback |
| **Beschreiben** | 49 | Merkmale/Abläufe **darstellen** | Freitext / MC-Basis |
| **Begründen** | 35 | Aussage mit **Argumenten stützen** | Freitext → KI-Feedback |
| **Entwickeln** | 28 | Konzept/Maßnahme **erarbeiten** | Freitext → KI-Feedback |
| **Nennen** | 27 | Fakten **auflisten** | **MC / Kurzabfrage** |
| **Empfehlen** | 26 | begründete **Handlungsempfehlung** | Freitext → KI-Feedback |
| **Prüfen** | 23 | auf Kriterien **untersuchen** | Freitext |
| **Ermitteln / Berechnen** | 29 | **quantitativ** rechnen | **Werkzeug / Rechenaufgabe** |
| **Definieren** | 19 | Begriff **exakt bestimmen** | **MC / Lernzettel** |
| **Skizzieren / Erklären / Beurteilen** | 42 | umreißen / erklären / bewerten | Freitext |

**Kern-Erkenntnis:** Die Prüfung ist **überwiegend Freitext-Erläuterung/Begründung/Empfehlung**.
Reines Faktenwissen (nennen/definieren) ist die Minderheit. → Konsequenzen für die Modi (unten).

## 3. Was das für die Titan-Modi bedeutet

| Modus | Deckt ab | Baubar |
|-------|----------|--------|
| **Lernzettel** | definieren/nennen (Fakten-Retrieval) | ✅ (Schritt 1) |
| **Werkzeuge (Mini-Kurs)** | ermitteln/berechnen + Methodenverständnis | ✅ (Schritt 2, 10 Werkzeuge) |
| **Übungsbereich MC** | nennen/definieren/beschreiben als **Recall-Training** — die *Basis*, nicht die Prüfung selbst | 🔧 Schritt 4 (Content + Modell) |
| **IHK-Test-Format** | die **echte Struktur**: Situation → Teilaufgaben (Operator + Anzahl + Punkte) → Musterlösung-Selbstvergleich | 🔧 Schritt 5 |
| **KI-Feedback** | die **eigentliche Prüfungskompetenz** (erläutern/begründen/empfehlen als Freitext) | ⬜ Schritt 6 (Phase 3) |

**Ehrliche Einordnung:** MC ist der **Aufwärmer** (Fakten sitzen), nicht die Prüfung. Das
IHK-Test-Format bildet die **Struktur** nach (Selbstvergleich mit Musterlösung). Die **Bewertung
von Freitext** — das Herz der echten Prüfung — braucht **KI (Schritt 6)**. Diese Reihenfolge ist
bewusst: erst Fakten & Struktur ohne KI, dann die teure KI-Schicht obendrauf.

## 4. Zusätzliche Design-Empfehlung: Operatoren explizit lehren

Weil **„erläutern" ≠ „nennen" ≠ „begründen"** über Bestehen/Durchfallen entscheidet (viele
Kandidaten „nennen" nur, wo „erläutert" verlangt ist), sollte Titan die **IHK-Operatoren
explizit** vermitteln — als kleine Referenz + als sichtbaren Hinweis an jeder Übungs-/Testaufgabe
(„Dieser Operator verlangt: …"). Hoher, prüfungsspezifischer Mehrwert, geringer Aufwand.

## 5. Ziel-Datenmodell (für Schritt 4 & 5)

Ergänzend zum bestehenden `pruefungsfrage`-Feld:
- **`mcFragen`** (Array): `{ frage, optionen[4], richtigeAntwort, erklaerung, operator }` — für den Übungsbereich.
- **`pruefungsaufgabe`** (reicher als heute): `{ situation, teilaufgaben: [{ operator, anzahl, aufgabe, punkte, loesungshinweis }] }` — bildet die echte Situationsaufgabe nach.

Beides in **eigenem Titan-Wording**, Struktur/Niveau an der Blaupause orientiert. Inhaltlich zuerst
1–2 Themen als Muster, dann skalieren (später KI-gestützt generierbar).

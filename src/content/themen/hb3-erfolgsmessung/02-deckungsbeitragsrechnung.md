---
title: "Deckungsbeitragsrechnung im Marketingcontrolling"
handlungsbereich: "hb3"
themengruppe: "Erfolgsmessung"
order: 2
description: "Absoluter und relativer Deckungsbeitrag als Instrument der Teilkostenrechnung, insbesondere zur Optimierung des Produktionsprogramms bei Kapazitätsengpässen."

definitionen:
  - begriff: "Deckungsbeitrag (DB)"
    definition: "Differenz zwischen Umsatzerlösen und variablen Kosten eines Produkts. Zeigt, wie viel ein Produkt zur Deckung der Fixkosten und zum Gewinn beiträgt."
  - begriff: "Variable Kosten"
    definition: "Kosten, die sich proportional zur Produktionsmenge verändern, z. B. Materialkosten, Fertigungslöhne."
  - begriff: "Fixkosten"
    definition: "Kosten, die unabhängig von der Produktionsmenge anfallen, z. B. Miete, Gehälter der Verwaltung."
  - begriff: "Kapazitätsengpass"
    definition: "Engpassfaktor, der die maximale Produktionsmenge begrenzt, z. B. Maschinenstunden, Regalfläche, Arbeitsstunden."
  - begriff: "Relativer Deckungsbeitrag"
    definition: "Deckungsbeitrag je Einheit des Engpassfaktors (z. B. € pro Maschinenstunde). Entscheidungsgrundlage bei Kapazitätsbeschränkungen."

formeln:
  - name: "Absoluter Deckungsbeitrag"
    formel: "DB = Verkaufspreis − variable Kosten"
    erklaerung: "Berechnet den Beitrag eines Produkts zur Deckung der Fixkosten. Positiver DB bedeutet: Das Produkt erwirtschaftet mehr als seine variablen Kosten."
    einheit: "€ pro Stück"
  - name: "Deckungsbeitrag gesamt"
    formel: "DB gesamt = DB pro Stück × Absatzmenge"
    erklaerung: "Gesamter Deckungsbeitrag aller verkauften Einheiten eines Produkts."
    einheit: "€"
  - name: "Relativer Deckungsbeitrag"
    formel: "DB relativ = DB pro Stück ÷ Engpassverbrauch pro Stück"
    erklaerung: "Gibt an, wie viel Deckungsbeitrag pro Einheit des knappen Faktors erzielt wird. Bei Engpässen ist dieser Wert entscheidend, nicht der absolute DB."
    einheit: "€ pro Engpasseinheit (z. B. €/Maschinenstunde)"
  - name: "Gewinn"
    formel: "Gewinn = Gesamtdeckungsbeitrag − Gesamtfixkosten"
    erklaerung: "Erst wenn der Gesamtdeckungsbeitrag die Fixkosten übersteigt, entsteht ein Gewinn."
    einheit: "€"

rechenbeispiel:
  aufgabe: "Die FORMWERK Spritzguss GmbH produziert Produkt A (DB 18 €/Stück, 30 Min. Maschinenzeit) und Produkt B (DB 12 €/Stück, 10 Min. Maschinenzeit). Die Maschine läuft maximal 800 Stunden pro Monat. Welches Produkt soll bei einem Maschinenengpass bevorzugt produziert werden?"
  schritte:
    - schritt: 1
      beschreibung: "Relativen DB für Produkt A berechnen"
      berechnung: "DB relativ A = 18 € ÷ 0,5 h"
      ergebnis: "= 36 €/Maschinenstunde"
    - schritt: 2
      beschreibung: "Relativen DB für Produkt B berechnen"
      berechnung: "DB relativ B = 12 € ÷ 0,167 h (10 Min)"
      ergebnis: "= 71,86 €/Maschinenstunde"
    - schritt: 3
      beschreibung: "Vergleich und Entscheidung"
      berechnung: "B: 71,86 €/h > A: 36,00 €/h"
      ergebnis: "Produkt B bevorzugen!"
  fazit: "Obwohl Produkt A den höheren absoluten DB pro Stück hat, ist Produkt B bei einem Maschinenengpass wirtschaftlich überlegen — es erwirtschaftet fast doppelt so viel pro knapper Maschinenstunde."

zusammenfassung:
  - "Der Deckungsbeitrag zeigt, wie viel ein Produkt zur Fixkostendeckung beiträgt: DB = Verkaufspreis − variable Kosten"
  - "Bei FREIER Kapazität entscheidet der ABSOLUTE Deckungsbeitrag pro Stück"
  - "Bei ENGPASS entscheidet der RELATIVE Deckungsbeitrag (DB ÷ Engpassverbrauch)"
  - "Erst wenn die Summe aller DB die Fixkosten übersteigt, entsteht Gewinn"
  - "Klassischer Prüfungsfehler: Engpassprodukt nur nach absolutem DB auswählen — immer relativen DB berechnen!"

werkzeug: "deckungsbeitrag"

merksatz: |
  Bei freier Kapazität zählt der absolute Deckungsbeitrag, bei einem Engpass zählt der Deckungsbeitrag pro Engpassstunde.

fallbeispiel:
  situation: |
    Die FORMWERK Spritzguss GmbH produziert zwei Kunststoffteile. Teil A erzielt einen
    Deckungsbeitrag von 18 € pro Stück, Teil B von 12 € pro Stück. Die Produktionsanlage
    ist aktuell nicht ausgelastet.
  aufgabe: |
    Welches Produkt sollte bei freier Kapazität bevorzugt gefördert werden, und ändert
    sich diese Empfehlung, wenn die Anlage zum Engpass wird?
  musterloesung: |
    Bei freier Kapazität ist der absolute DB entscheidend → Teil A (18 €). Wird die Anlage
    zum Engpass, muss der relative DB berechnet werden. Teil B benötigt nur 10 statt
    30 Minuten pro Stück → relativer DB Teil B = 72 €/h vs. Teil A = 36 €/h. Bei Engpass
    daher Teil B bevorzugen.

pruefungsfrage:
  frage: |
    Ein Unternehmen produziert Produkt X (Preis 50 €, variable Kosten 32 €, 2 Maschinenstunden)
    und Produkt Y (Preis 40 €, variable Kosten 25 €, 1 Maschinenstunde). Die Fixkosten
    betragen 60.000 € pro Monat.
    a) Berechnen Sie den absoluten DB beider Produkte.
    b) Berechnen Sie den relativen DB. Welches Produkt soll bei Maschinenengpass
    bevorzugt werden?
    c) Ab welcher Gesamtmenge (nur Produkt Y) werden die Fixkosten gedeckt (Break-Even)?
  loesungsweg:
    - |
      a) DB Produkt X = 50 − 32 = 18 € | DB Produkt Y = 40 − 25 = 15 €
    - |
      b) rel. DB X = 18 ÷ 2 = 9 €/h | rel. DB Y = 15 ÷ 1 = 15 €/h → Produkt Y
      bevorzugen, da 15 €/h > 9 €/h
    - |
      Break-Even Y: 60.000 ÷ 15 = 4.000 Stück. Ab 4.001 Stück erzielt das
      Unternehmen Gewinn.

wiederholungTage: 5
---

Die Deckungsbeitragsrechnung ist ein zentrales Instrument der **Teilkostenrechnung** — im Gegensatz zur Vollkostenrechnung werden die Fixkosten nicht auf einzelne Produkte verteilt, sondern als Gesamtblock behandelt. Das macht die Methode deutlich aussagekräftiger für kurzfristige Entscheidungen.

## Grundprinzip

Jedes Produkt muss zunächst seine **eigenen variablen Kosten** decken. Was darüber hinausgeht, ist der **Deckungsbeitrag** — der Betrag, der zur Deckung der Fixkosten und letztlich zum Gewinn beiträgt.

| Kategorie | Beschreibung |
|---|---|
| Variable Kosten | ändern sich mit der Menge (Material, Fertigungslöhne) |
| Fixkosten | bleiben konstant (Miete, Verwaltung, Abschreibungen) |
| Deckungsbeitrag | Umsatz minus variable Kosten |

## Entscheidungslogik

Die häufigste Prüfungsfalle ist die falsche Anwendung der DB-Logik bei Engpässen:

**Ohne Engpass:** Das Produkt mit dem **höchsten absoluten DB** pro Stück wird bevorzugt.

**Mit Engpass:** Das Produkt mit dem **höchsten relativen DB** (DB pro Engpasseinheit) wird bevorzugt — auch wenn der absolute DB niedriger ist.

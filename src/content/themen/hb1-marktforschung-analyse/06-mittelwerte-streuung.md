---
title: "Statistische Maßzahlen: Mittelwerte & Streuung"
handlungsbereich: "hb1"
themengruppe: "Marktforschung & Analyse"
order: 6
description: "Skalenarten, Häufigkeiten, Mittelwerte (Median, Modalwert, arithmetisches und geometrisches Mittel) und Streuungsmaße."
werkzeug: "statistik"
merksatz: "Der Median teilt die Reihe, das arithmetische Mittel rechnet sie zusammen, das geometrische Mittel beschreibt ihr Wachstum."
definitionen:
  - begriff: "Skalenart"
    definition: "Messniveau eines Merkmals: nominal (reine Eigenschaft ohne Rangfolge), ordinal (Rangfolge ohne gleiche Abstände) oder metrisch (Abstände und Verhältnisse messbar)."
  - begriff: "Median (Zentralwert)"
    definition: "Der mittlere Wert einer der Größe nach geordneten Reihe; robust gegenüber Extremwerten."
  - begriff: "Modalwert"
    definition: "Der am häufigsten vorkommende Wert einer Verteilung; sinnvoll, wenn der ‚typische Fall‘ gefragt ist."
  - begriff: "Gewogenes arithmetisches Mittel"
    definition: "Summe aller Werte, jeweils mit ihrer Häufigkeit gewichtet, geteilt durch die Gesamtzahl; korrekt bei Häufigkeitstabellen."
  - begriff: "Geometrisches Mittel"
    definition: "Der einzig korrekte Mittelwert zur Verdichtung von Wachstumsraten (z. B. durchschnittliches jährliches Umsatzwachstum)."
  - begriff: "Standardabweichung"
    definition: "Streuungsmaß, das angibt, wie eng die Einzelwerte um den Mittelwert liegen; je kleiner, desto repräsentativer der Mittelwert."
mcFragen:
  - frage: "Welcher Mittelwert ist korrekt, um eine durchschnittliche jährliche Wachstumsrate zu bestimmen?"
    optionen:
      - "Das arithmetische Mittel"
      - "Der Median"
      - "Das geometrische Mittel"
      - "Der Modalwert"
    richtige: 2
    erklaerung: "Wachstumsraten sind ein multiplikativer Prozess; nur das geometrische Mittel (n-te Wurzel aus dem Produkt der Wachstumsfaktoren) verdichtet sie korrekt. Das arithmetische Mittel überschätzt."
    operator: "auswählen"
  - frage: "Ein Merkmal ‚Schulnote‘ (1–6) besitzt welche Skalenart?"
    optionen:
      - "Nominalskala"
      - "Ordinalskala"
      - "Metrische (Verhältnis-)Skala"
      - "Absolutskala"
    richtige: 1
    erklaerung: "Noten haben eine natürliche Rangfolge, aber keine garantiert gleichen Abstände (der Sprung von 1 auf 2 ist nicht zwingend gleich dem von 4 auf 5) → ordinalskaliert."
    operator: "einordnen"
  - frage: "Warum reicht ein Mittelwert allein oft nicht aus?"
    optionen:
      - "Weil er nur bei metrischen Daten berechenbar ist."
      - "Weil er nichts über die Streuung der Einzelwerte aussagt."
      - "Weil er immer durch Extremwerte verfälscht wird."
      - "Weil er rechnerisch zu aufwendig ist."
    richtige: 1
    erklaerung: "Zwei Datensätze mit gleichem Mittelwert können völlig unterschiedlich streuen. Erst ein Streuungsmaß (z. B. Standardabweichung) zeigt die Homogenität."
    operator: "beurteilen"
  - frage: "Welcher Mittelwert ist gegenüber Extremwerten besonders robust?"
    optionen:
      - "Das arithmetische Mittel"
      - "Der Median"
      - "Das geometrische Mittel"
      - "Die Spannweite"
    richtige: 1
    erklaerung: "Der Median (mittlerer Wert der geordneten Reihe) reagiert kaum auf Ausreißer – deshalb wird z. B. das Medianeinkommen berichtet. Die Spannweite ist kein Mittelwert, sondern ein Streuungsmaß."
    operator: "benennen"
fallbeispiel:
  situation: |
    Die Personalabteilung der {{firma}} hat die Bruttostundenlöhne
    von 180 Lohnempfängern in sechs Lohngruppen erfasst und möchte einen
    Vergleichswert für Tarifverhandlungen ermitteln.
  aufgabe: |
    Welcher Mittelwert ist hier sachlich richtig zu berechnen, und warum nicht
    einfach der Modalwert?
  musterloesung: |
    Da die Löhne in einer Häufigkeitstabelle (Lohnhöhe mit Anzahl der Beschäftigten
    je Gruppe) vorliegen, ist der gewogene arithmetische Mittelwert zu berechnen:
    Jede Lohnhöhe wird mit der Anzahl der zugehörigen Beschäftigten gewichtet, die
    Summe durch die Gesamtzahl der Beschäftigten geteilt. Der Modalwert (häufigster
    Lohn) wäre hier irreführend, da er nur die größte Gruppe abbildet und nicht alle
    180 Werte einbezieht – für Tarifverhandlungen zählt aber der repräsentative
    Durchschnitt über alle Beschäftigten.
pruefungsfrage:
  frage: |
    Die {{firma}} ist zusätzlich von 2019 bis 2024 jährlich
    gewachsen, allerdings mit schwankenden Raten. Der Umsatz stieg von 40,0 Mio. €
    auf 53,6 Mio. €.
    a) Welcher Mittelwert ist geeignet, um die durchschnittliche jährliche
    Wachstumsrate zu bestimmen? Begründen Sie.
    b) Nennen Sie zwei Skalenarten, denen die Merkmale „Lohngruppe" (1 bis 6) und
    „Bruttostundenlohn in €" jeweils zuzuordnen sind, und begründen Sie kurz.
    c) Welches Streuungsmaß würden Sie zusätzlich zum Mittelwert angeben, um die
    Homogenität der Löhne zu beurteilen, und warum reicht der Mittelwert allein
    nicht aus?
  loesungsweg:
    - |
      a) Der geometrische Mittelwert, da es sich um die Verdichtung eines Wachstumsprozesses (Veränderungsraten) und nicht um die Verdichtung einzelner Größen handelt. Berechnung über den Wachstumsfaktor pro Jahr, n-te Wurzel aus dem Produkt aller Wachstumsfaktoren.
    - |
      b) „Lohngruppe" ist ordinalskaliert (natürliche Rangfolge 1 bis 6, aber die Abstände zwischen den Gruppen sind nicht notwendigerweise gleich groß). „Bruttostundenlohn in €" ist metrisch (verhältnis-)skaliert, da ein absoluter Nullpunkt existiert und Verhältnisse gebildet werden können (10 €/Std. ist doppelt so viel wie 5 €/Std.).
    - |
      c) Die Standardabweichung, da sie angibt, wie eng die Einzelwerte um den Mittelwert streuen. Der Mittelwert allein zeigt nur die zentrale Tendenz, sagt aber nichts darüber aus, ob die Löhne nah beieinanderliegen oder stark auseinanderdriften – zwei Belegschaften mit gleichem Durchschnittslohn können völlig unterschiedlich homogen bezahlt sein.
wiederholungTage: 5
pruefungsaufgabe:
  situation: "Die Personalabteilung der {{firma}} hat die Bruttostundenlöhne\nvon 180 Lohnempfängern in sechs Lohngruppen erfasst und möchte einen\nVergleichswert für Tarifverhandlungen ermitteln.\n"
  teilaufgaben:
    - operator: "berechnen"
      aufgabe: "Welcher Mittelwert ist hier sachlich richtig zu berechnen, und warum nicht\neinfach der Modalwert?\n"
      punkte: 8
      loesungshinweis: "Da die Löhne in einer Häufigkeitstabelle (Lohnhöhe mit Anzahl der Beschäftigten\nje Gruppe) vorliegen, ist der gewogene arithmetische Mittelwert zu berechnen:\nJede Lohnhöhe wird mit der Anzahl der zugehörigen Beschäftigten gewichtet, die\nSumme durch die Gesamtzahl der Beschäftigten geteilt. Der Modalwert (häufigster\nLohn) wäre hier irreführend, da er nur die größte Gruppe abbildet und nicht alle\n180 Werte einbezieht – für Tarifverhandlungen zählt aber der repräsentative\nDurchschnitt über alle Beschäftigten.\n"
    - operator: "nennen"
      aufgabe: "Die {{firma}} ist zusätzlich von 2019 bis 2024 jährlich\ngewachsen, allerdings mit schwankenden Raten. Der Umsatz stieg von 40,0 Mio. €\nauf 53,6 Mio. €.\na) Welcher Mittelwert ist geeignet, um die durchschnittliche jährliche\nWachstumsrate zu bestimmen? Begründen Sie.\nb) Nennen Sie zwei Skalenarten, denen die Merkmale „Lohngruppe\" (1 bis 6) und\n„Bruttostundenlohn in €\" jeweils zuzuordnen sind, und begründen Sie kurz.\nc) Welches Streuungsmaß würden Sie zusätzlich zum Mittelwert angeben, um die\nHomogenität der Löhne zu beurteilen, und warum reicht der Mittelwert allein\nnicht aus?\n"
      punkte: 7
      loesungshinweis: "a) Der geometrische Mittelwert, da es sich um die Verdichtung eines Wachstumsprozesses (Veränderungsraten) und nicht um die Verdichtung einzelner Größen handelt. Berechnung über den Wachstumsfaktor pro Jahr, n-te Wurzel aus dem Produkt aller Wachstumsfaktoren.\n · b) „Lohngruppe\" ist ordinalskaliert (natürliche Rangfolge 1 bis 6, aber die Abstände zwischen den Gruppen sind nicht notwendigerweise gleich groß). „Bruttostundenlohn in €\" ist metrisch (verhältnis-)skaliert, da ein absoluter Nullpunkt existiert und Verhältnisse gebildet werden können (10 €/Std. ist doppelt so viel wie 5 €/Std.).\n · c) Die Standardabweichung, da sie angibt, wie eng die Einzelwerte um den Mittelwert streuen. Der Mittelwert allein zeigt nur die zentrale Tendenz, sagt aber nichts darüber aus, ob die Löhne nah beieinanderliegen oder stark auseinanderdriften – zwei Belegschaften mit gleichem Durchschnittslohn können völlig unterschiedlich homogen bezahlt sein.\n"
---

Bevor Daten verdichtet werden können, muss die **Skalenart** des Merkmals bekannt sein: Nominalskalen erfassen reine Eigenschaften ohne Rangfolge (z. B. Pkw-Marke), Ordinalskalen erfassen eine Rangfolge ohne messbare Abstände (z. B. Schulnoten), metrische Skalen erlauben Abstände und Verhältnisse (z. B. Umsatz, Alter).

Aus der ungeordneten **Urliste** werden zunächst **Häufigkeiten** gebildet (absolut, relativ, kumuliert) – das schafft Übersicht, ist aber noch keine Verdichtung auf einen einzigen Vergleichswert. Dafür gibt es **Mittelwerte**:

- **Zentralwert (Median)** – der mittlere Wert einer geordneten Reihe; robust gegenüber Extremwerten, daher z. B. Basis des Medianeinkommens
- **Modalwert** – der häufigste Wert; sinnvoll bei technischen Messungen oder wenn „der typische Fall" gefragt ist
- **Arithmetisches Mittel** – Summe der Werte geteilt durch ihre Anzahl; bei Häufigkeitstabellen als *gewogenes* arithmetisches Mittel (jeder Wert mit seiner Häufigkeit gewichtet)
- **Geometrisches Mittel** – einzig korrekter Mittelwert für **Wachstumsraten** (z. B. durchschnittliches jährliches Umsatzwachstum); das arithmetische Mittel würde Wachstumsraten falsch verdichten

Ein Mittelwert allein kann täuschen. Deshalb ergänzt man **Streuungsmaße**:

| Maß | Aussage |
|---|---|
| Spannweite | Differenz zwischen größtem und kleinstem Wert |
| Mittlerer Quartilsabstand | Differenz zwischen 3. und 1. Quartil, robust gegenüber Extremwerten |
| Standardabweichung | Wie eng gruppieren sich die Werte um den Mittelwert? Je kleiner, desto repräsentativer der Mittelwert |

---
title: "Marktkennzahlen & Prognosetechniken"
handlungsbereich: "hb1"
themengruppe: "Marktforschung & Analyse"
order: 7
description: "Marktvolumen, absoluter und relativer Marktanteil, Sättigungsgrad sowie qualitative und quantitative Prognoseverfahren."

definitionen:
  - begriff: "Marktvolumen"
    definition: "Tatsächlich realisierter Gesamtabsatz (mengenmäßig oder wertmäßig) auf einem definierten Markt in einer bestimmten Periode. Formel: Inlandsproduktion − Exporte + Importe."
  - begriff: "Marktpotenzial"
    definition: "Maximale Aufnahmefähigkeit eines Marktes. Theoretischer Höchstwert, der nur bei vollständiger Marktausschöpfung erreicht würde."
  - begriff: "Absoluter Marktanteil"
    definition: "Anteil eines Unternehmens am Gesamtmarktvolumen in Prozent. Zeigt die Stellung eines Unternehmens auf dem Markt."
  - begriff: "Relativer Marktanteil"
    definition: "Marktanteil des eigenen Unternehmens im Verhältnis zum stärksten Wettbewerber. Basis der BCG-Portfolio-Analyse."
  - begriff: "Sättigungsgrad"
    definition: "Verhältnis von Marktvolumen zu Marktpotenzial in Prozent. Zeigt, wie weit ein Markt bereits ausgeschöpft ist."
  - begriff: "Trendprognose"
    definition: "Quantitative Methode zur Vorhersage zukünftiger Werte auf Basis historischer Zeitreihendaten und der Methode der kleinsten Quadrate."

formeln:
  - name: "Marktvolumen"
    formel: "MV = Inlandsproduktion − Exporte + Importe"
    erklaerung: "Gibt den tatsächlich abgesetzten Gesamtmarkt an. Alternativ: Inlandsabsatz + Importe (wenn Exportdaten fehlen)."
    einheit: "Mengeneinheiten oder €"
  - name: "Absoluter Marktanteil"
    formel: "MA (%) = (Inlandsumsatz Unternehmen A ÷ Marktvolumen) × 100"
    erklaerung: "Prozentualer Anteil am Gesamtmarkt. Wichtig: Nur Inlandsumsatz verwenden, nicht Gesamtumsatz."
    einheit: "%"
  - name: "Relativer Marktanteil"
    formel: "MA relativ = Marktanteil A ÷ Marktanteil größter Wettbewerber × 100"
    erklaerung: "Wert > 100: Marktführer. Wert < 100: Unterlegener. Wird in der BCG-Matrix auf der X-Achse abgebildet."
    einheit: "Index (kein %)"
  - name: "Sättigungsgrad"
    formel: "S (%) = (Marktvolumen ÷ Marktpotenzial) × 100"
    erklaerung: "100 % = vollständig gesättigter Markt. Je höher der Wert, desto schwieriger das Wachstum."
    einheit: "%"
  - name: "Trendgerade (Methode kleinste Quadrate)"
    formel: "yt = a + b × t"
    erklaerung: "a = Achsenabschnitt (Startwert), b = Steigung pro Periode, t = Zeitwert. a und b werden über ein Gleichungssystem aus den Historiedaten berechnet."
    einheit: "Umsatz in €, Absatz in Stück etc."

rechenbeispiel:
  aufgabe: "Die VENTO Klimatechnik GmbH erzielte 2024 einen Inlandsumsatz von 18 Mio. €. Das Marktvolumen für Klimageräte beträgt 120 Mio. €. Der größte Wettbewerber hat einen Marktanteil von 30 %."
  schritte:
    - schritt: 1
      beschreibung: "Absoluten Marktanteil berechnen"
      berechnung: "MA = (18 ÷ 120) × 100"
      ergebnis: "= 15 %"
    - schritt: 2
      beschreibung: "Relativen Marktanteil berechnen"
      berechnung: "MA relativ = 15 ÷ 30 × 100"
      ergebnis: "= 50 (VENTO ist halb so stark wie der Marktführer)"
    - schritt: 3
      beschreibung: "Interpretation"
      berechnung: "Relativer MA < 100 → kein Marktführer"
      ergebnis: "VENTO hält 15 % des Marktes, ist aber nur halb so stark wie der Marktführer"
  fazit: "Ein relativer Marktanteil von 50 bedeutet: VENTO muss seinen Umsatz verdoppeln, um Marktführer zu werden. In der BCG-Matrix je nach Marktwachstum als 'Question Mark' oder 'Star' einzustufen."

zusammenfassung:
  - "Marktvolumen = Inlandsproduktion − Exporte + Importe (realisierter Markt)"
  - "Absoluter Marktanteil zeigt die eigene Stellung auf dem Markt in %"
  - "Relativer Marktanteil vergleicht mit dem stärksten Wettbewerber — Basis der BCG-Matrix"
  - "Trendprognose: nur für 3–4 Jahre sinnvoll (Ceteris-paribus-Annahme!)"
  - "Qualitative Prognosen (Szenario, Delphi): für Zeiträume > 5 Jahre und bei vielen Einflussvariablen"

werkzeug: "marktanteil"

merksatz: |
  Das Marktvolumen beschreibt die Gegenwart, der Trend nur die nächsten drei bis vier Jahre – länger lügt die Gerade.

fallbeispiel:
  situation: |
    Die VENTO Klimatechnik GmbH hat 2024 einen Inlandsumsatz von 18 Mio. € erzielt.
    Das gesamte Marktvolumen betrug 120 Mio. €. Der größte Wettbewerber kommt auf 30 %.
  aufgabe: |
    Berechnen Sie den absoluten und den relativen Marktanteil der VENTO Klimatechnik
    GmbH und interpretieren Sie das Ergebnis.
  musterloesung: |
    Absoluter MA = 18 ÷ 120 × 100 = 15 %. Relativer MA = 15 ÷ 30 × 100 = 50.
    VENTO ist kein Marktführer und nur halb so stark. In der BCG-Matrix je nach
    Marktwachstum als Question Mark oder schwacher Star positioniert.

pruefungsfrage:
  frage: |
    Die Geschäftsführung der VENTO Klimatechnik GmbH möchte den Umsatz für die
    nächsten drei Jahre prognostizieren.
    a) Erläutern Sie den Unterschied zwischen qualitativen und quantitativen Prognoseverfahren.
    b) Nennen Sie die wichtigste Einschränkung einer linearen Trendprognose.
    c) Welches qualitative Verfahren eignet sich für einen Planungshorizont von 10–15 Jahren?
  loesungsweg:
    - |
      a) Qualitative Prognosen: verbale Einschätzungen ohne genaue Zahlenwerte, z. B.
      Szenariotechnik und Delphi. Quantitative Prognosen: mathematisch berechnete
      Zahlenwerte, z. B. lineare Trendprognose, Regression.
    - |
      b) Bei der Trendprognose wird unterstellt, dass alle Einflussfaktoren der
      Vergangenheit unverändert in dieselbe Richtung wirken (Ceteris-paribus-Annahme).
      Das ist selten länger als 3–4 Jahre zutreffend.
    - |
      c) Die Szenariotechnik (Planungshorizont 10–15 Jahre). Sie liefert mehrere
      alternative Zukunftsbilder (best/wahrscheinlich/worst case) statt einer
      einzelnen Linie.

wiederholungTage: 5
---

Zur Charakterisierung eines Marktes und als Entscheidungsgrundlage dienen quantitative Kennzahlen. Für Prognosen stehen qualitative und quantitative Verfahren zur Verfügung.

## Marktstruktur verstehen

Bevor Kennzahlen berechnet werden können, muss der Markt sachlich, zeitlich und räumlich klar abgegrenzt sein. Ein Fehler in der Abgrenzung verfälscht alle nachfolgenden Berechnungen.

| Kennzahl | Frage die sie beantwortet |
|---|---|
| Marktvolumen | Wie groß ist der Markt tatsächlich? |
| Marktpotenzial | Wie groß könnte der Markt maximal sein? |
| Absoluter Marktanteil | Wie stark ist unser Unternehmen auf dem Markt? |
| Relativer Marktanteil | Wie stark sind wir im Vergleich zum Marktführer? |
| Sättigungsgrad | Wie ausgeschöpft ist der Markt bereits? |

## Prognosen richtig einsetzen

Kein Prognoseverfahren ist für alle Situationen geeignet. Die Wahl hängt vom Zeithorizont und der Komplexität der Einflussfaktoren ab:

- **Bis 4 Jahre, stabile Faktoren** → Trendprognose (quantitativ)
- **5–10 Jahre, mehrere Faktoren** → Regression (quantitativ)
- **10–15 Jahre, hohe Unsicherheit** → Szenariotechnik oder Delphi (qualitativ)

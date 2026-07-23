# Finanz- & Kostenplan — Titan

> Granularer Kosten-Detailplan, ergänzend zum Finanzteil im
> [businessplan.md](businessplan.md) (Umsatzsäulen, Kapitalbedarf ~200 k,
> 24-Monats-Umsatzprognose, Break-even). Dieses Dokument vertieft **Betriebskosten
> und KI-API-Kosten** — die für Förderanträge (z. B. Start?Zuschuss! Bayern) und
> die Preiskalkulation entscheidenden Größen.

---

## 1. KI-API-Kosten (Anthropic Claude) — Übersicht

> **Preisbasis (Stand 2026-07, Anthropic, pro 1 Mio. Tokens):** Sonnet 5 **$3
> Input / $15 Output** (Intro bis 31.08.2026: $2/$10), Haiku 4.5 $1/$5, Opus 4.8
> $5/$25. Abgerechnet in USD; hier konservativ **1 $ ≈ 1 €** gerechnet.
> Token-Mengen sind **fundierte Schätzungen** — vor Livegang mit echten Prompts
> per `count_tokens` gegenprüfen.

**Kosten je KI-Aktion (Modell Sonnet 5, ohne Prompt-Caching — Worst Case):**

| KI-Aktion | Wann | Modell | Input Tok | Output Tok | Kosten/Aufruf |
|---|---|---|---|---|---|
| **Star-Company-Kontext-JSON** (Deklination) | 1× je Nutzer | Sonnet 5 | ~500 | ~300 | **~0,006 €** |
| **Fallaufgaben-Variante** erzeugen | je Generierung | Sonnet 5 | ~1.500 | ~800 | **~0,017 €** |
| **Formatives Feedback** (Freitext-Lösung) | je Antwort | Sonnet 5 | ~2.000 | ~500 | **~0,014 €** |

**Kosten je aktivem Lerner und Monat (Beispiel-Nutzungsprofile):**

| Nutzung | Varianten/Mon | Feedbacks/Mon | ≈ Kosten/Lerner/Monat |
|---|---|---|---|
| **leicht** | 10 | 10 | **~0,31 €** |
| **mittel** | 30 | 30 | **~0,94 €** |
| **intensiv** | 80 | 80 | **~2,50 €** |

💡 **Mit Prompt-Caching** (der Dozenten-Master + System-Prompt werden gecacht,
Cache-Read ≈ 0,1× Input-Preis) sinken die Input-Kosten um grob 60–80 % → real
noch deutlich niedriger als oben.

**Einordnung des Budgets:** Bei **~0,94 €/Lerner (mittel)** deckt ein
KI-Budget von **~100 €/Monat rund 100 aktive Lerner** ab — passt zum im
Businessplan angesetzten KI-Posten in der Prototyp-/Frühphase.

### 1.1 „API-Kostenfalle" — Gegenmaßnahme (Kontingent)

Risiko (aus externer Analyse bestätigt): Vielnutzer treiben die KI-Kosten, während
das Abo fix ist. **Gegenmaßnahme:** **KI-Kontingent pro Abo** (z. B. „**X
KI-Aktionen/Monat inklusive**", darüber gedrosselt oder nachbuchbar). Damit bleibt
die Marge geschützt:

- **B2C** (24 €/Monat) − ~1–2,50 € KI = **>90 % Marge** bleibt.
- **B2B** (800 €/Kurs ÷ ~12 = ~65 €/Platz) − ~1–2,50 € KI = ebenfalls unkritisch.
- Günstigeres Modell (Haiku 4.5) für einfache Aktionen (Star-Company-JSON, simple
  Varianten) senkt die Kosten weiter; Sonnet 5 nur wo Qualität nötig ist
  (Feedback), Opus 4.8 nur für Sonderfälle.

📝 *Konkretes Inklusiv-Kontingent + Drossel-/Nachbuch-Logik festlegen.*

---

## 2. Laufende Betriebskosten (monatlich)

| Position | ca. €/Monat | Art |
|---|---|---|
| VPS (IONOS VPS 4-4-120) | ~12 | fix |
| Off-site-Backup (Hetzner Storage Box 1 TB) | ~4 | fix |
| Domain | ~2 | fix |
| Transaktionsmail (Brevo, Free-Tier → später paid) | 0 | fix |
| Monitoring (Free-Tier) | 0 | fix |
| **KI (Anthropic Claude, nutzungsabhängig)** | **~100** (Frühphase) | variabel |
| Zahlungsabwicklung (z. B. Stripe ~1,5 % + 0,25 €/Tx) | umsatzabhängig | variabel |
| **Summe Betrieb (Frühphase)** | **~120 €/Monat** | |

Skaliert mit Wachstum: KI wächst mit aktiven Lernern (siehe §1, gedeckelt per
Kontingent), Zahlungsgebühren mit Umsatz; höherer Server-/DB-Bedarf erst bei
vielen Gleichzeitig-Nutzern. **Content-Honorare** (Fachautoren) und **Marketing/
Ads** sind projekt-/wachstumsbezogen und im Kapitalbedarf des
[businessplan.md](businessplan.md) budgetiert (Gründerentnahme ~96 k, Content ~40 k,
Dev/Ops ~18 k, Design ~10 k, Marketing ~16 k, KI-/Infra-Betrieb ~6 k,
Gründung/Recht ~7 k, Puffer ~7 k → ~200 k).

---

## 3. Verweise

- **Umsatz, Preise, Kapitalbedarf, Umsatzprognose, Break-even:**
  [businessplan.md](businessplan.md) → Finanzen.
- **KI-Rahmen (niedrigrisiko, Kontingent-Logik unterstützt Datensparsamkeit):**
  [ki-governance.md](ki-governance.md).

*Alle Annahmen als solche gekennzeichnet; Token-Mengen und Anbieterpreise vor
Finalisierung gegenprüfen.*

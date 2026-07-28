# Titan — Phase 3 (KI): Plan zu Kosten, Risiken & Umsetzung

> **Zweck:** Bevor eine Zeile KI-Code entsteht — ein klarer, strukturierter Plan, damit
> wir nicht „ins offene Messer laufen". Bezug: [pbl-konzept-pitch.md](pbl-konzept-pitch.md),
> [ki-governance.md](ki-governance.md), [gesamtkonzept-lernprozess.md](gesamtkonzept-lernprozess.md) §6,
> [roadmap.md](roadmap.md) Phase 3.
>
> Preise: Stand der Claude-Modell-Tabelle 2026-06 (vor Umsetzung final gegenprüfen).

---

## 1. Prinzipien (nicht verhandelbar)

- **Formatives Feedback OHNE Note** — die KI berät und stützt, sie benotet und blockiert nie
  (Governance). Der Fortschritt bleibt in Nutzerhand.
- **Scaffolded PBL** — erst Schema (Verstehen/Merken), dann KI-gestützte Anwendung; Frustrations-Ventil.
- **EU-Souveränität als Pfad** — Start pragmatisch mit Anthropic; DSGVO-Härtung über Langdock (DE-Gateway);
  Perspektive Soofi (DE-Open-Source), sobald qualitativ tragfähig.
- **Kostenkontrolle by design** — hartes Kosten-Gate pro Nutzer/Monat, bevor irgendein Call live geht.
- **Graceful Degradation** — fällt die KI aus, bleibt die App voll nutzbar (Local-First; Werkzeuge,
  Musterlösungen, Übungen funktionieren ohne KI).

## 2. Die drei KI-Bausteine (Was + Reihenfolge)

| # | Baustein | Lern-Phase | Komplexität | Reihenfolge |
|---|----------|-----------|-------------|-------------|
| **A** | **Formatives Feedback** zu Freitext-Lösungen (ein Rück­meldung, keine Note) | Anwenden | niedrig | **zuerst** |
| **B** | **Fachgespräch-Simulator** (Sokratischer Tutor, mehrstufig) | Anwenden/Prüfen | hoch | danach |
| **C** | **Fall-Recast / Varianz** (Star-Company-Stufe 2: Aufgabe auf Branche/Größe umschreiben) | Anwenden | mittel | zuletzt |

**Begründung:** A ist ein Single-Shot-Call (Prompt rein, Feedback raus) — ideal zum Lernen der
Pipeline, Kosten, Guardrails. B ist Multi-Turn + State-Machine (der eigentliche PBL-Kern). C erzeugt
Content und braucht Qualitätssicherung (Agenten-QA).

## 3. Kosten — Varianten + Empfehlung

**Modell-Preise (pro 1 Mio. Token, Input/Output):**

| Modell | Input | Output | Rolle |
|--------|-------|--------|-------|
| Claude Haiku 4.5 | $1 | $5 | günstig, schnell — einfaches Feedback |
| **Claude Sonnet 5** | **$3** | **$15** | **Empfehlung** — bestes Preis/Qualität für Feedback + Fachgespräch |
| Claude Opus 4.8 | $5 | $25 | nur wo maximale Qualität nötig |

**Hebel: Prompt-Caching.** Der große statische Kontext (System-Prompt + Fall + Musterlösung +
Star-Company) wird **gecacht** → Folge-Reads ~0,1×. Bei Multi-Turn-Fachgesprächen der entscheidende
Kostenfaktor.

**Kosten pro Interaktion (grobe Richtwerte, mit Caching):**

| Interaktion | niedrig (Haiku) | mittel (Sonnet 5) ⟵ empfohlen | hoch (Opus) |
|-------------|-----------------|-------------------------------|-------------|
| **Ein Feedback** (Baustein A) | ~0,3 ct | ~1,5 ct | ~4 ct |
| **Ein Fachgespräch** (~8 Züge, B) | ~1–2 ct | ~6 ct | ~20 ct |
| **Ein Fall-Recast** (C) | ~0,5 ct | ~2 ct | ~6 ct |

**Monatliche Hochrechnung — „Heavy User" (Sonnet 5, mit Caching):**
- 50 Feedbacks (~0,75 €) + 20 Fachgespräche (~1,20 €) + 15 Recasts (~0,30 €) ≈ **~2–3 € / Nutzer / Monat.**
- Bei **24 € Abo** → gesunde Marge; selbst 5× Nutzung bleibt unter ~15 €.

**Empfehlung:** Start mit **Sonnet 5** + aggressives Prompt-Caching. Einfaches Feedback ggf. auf
**Haiku 4.5** (noch günstiger). Opus nur selektiv.

## 4. Risiken & Leitplanken

| Risiko | Wahrscheinlichkeit / Schaden | Leitplanke |
|--------|------------------------------|------------|
| **Kostenexplosion** (Missbrauch, Bug-Schleifen) | mittel / hoch | **Hartes Kosten-Gate** pro Nutzer/Monat (Zähler in DB), Rate-Limit, Max-Tokens, Timeout. Kein Call ohne Gate. |
| **Falsches/halluziniertes Feedback** | mittel / hoch | Kontext-Injektion der **Musterlösung**; Tutor stellt Fragen statt Fakten zu behaupten; **kein harter Gatekeeper**; „Melde-Button" für schlechtes Feedback. |
| **DSGVO / Datentransfer USA** | niedrig (nur fiktive Firmendaten) / mittel | Nur **fiktionale** Star-Company-Angaben; keine echten Personendaten; **Langdock (EU, Zero-Retention)** als DSGVO-Gateway ab Skalierung. |
| **Kontingent/Marge kippt** | niedrig / mittel | Kalkuliertes Risiko (§3); Monitoring der realen Kosten je Nutzer; Modell-Downgrade-Schalter (Sonnet→Haiku). |
| **Anbieter-Abhängigkeit** | niedrig / mittel | Abstraktionsschicht (ein `ki-client`), damit Anthropic↔Langdock↔Soofi tauschbar; **Blind-Vergleich Soofi vs. Claude** vor Umstieg. |
| **Prompt-Injection** (Nutzer manipuliert Tutor) | mittel / niedrig | Nutzereingabe strikt als Daten kennzeichnen; System-Prompt-Härtung; keine Tool-/DB-Rechte im Tutor-Call. |
| **Latenz/Ausfall** | mittel / niedrig | **Streaming** (gefühlte Schnelligkeit); Timeout + Fallback auf Musterlösung; App bleibt ohne KI nutzbar. |
| **EU-AI-Act** | — | Titan = **niedriges Risiko** (Lern-Assistenz, keine verbotene/Hochrisiko-Nutzung); Transparenzpflicht „KI-generiert" erfüllen. Kein EU-Modell-Zwang. |

## 5. Umsetzungs-Architektur (zwei Optionen)

**Kern-Datenfluss (beide Optionen gleich):**
```
Nutzer-Eingabe ─► Kontext bauen (XML): System-Prompt + Fall + Musterlösung + Star-Company + Verlauf
              ─► Claude (Sonnet 5, Streaming, Prompt-Caching)
              ─► Dual-Output:  JSON (Backend: Kompetenzsignale, Phasenstand — advisorisch)
                               Text (UI: Frage/Feedback an den Lernenden)
              ─► Kosten-Zähler + Guardrails
```

| | **Option 1: Direkt (Astro-API + Anthropic-SDK)** | **Option 2: n8n-Orchestrierung** |
|--|--------------------------------------------------|----------------------------------|
| Aufwand | gering, alles im vorhandenen Stack | höher (n8n aufsetzen/betreiben) |
| Kontrolle | im Code (Kosten-Gate, State-Machine) | visuell, aber weitere Infrastruktur |
| Empfehlung | **Baustein A + B** hier starten | erst für **Agenten-Teams/Recast (C)** sinnvoll |

**Empfehlung:** **Direkt** starten (Option 1) — schnell, wenig bewegliche Teile, volle Kostenkontrolle
im Code. n8n später gezielt für die Content-/Varianz-Agenten (C), wenn Agenten-Teams mit Personas
gebraucht werden. (n8n-Instanz auf dem VPS ist vorhanden, aber noch nicht konfiguriert.)

## 6. Stufenplan (Meilensteine, jeder für sich verifizierbar)

- **M0 — Fundament:** `ki-client`-Abstraktion, API-Key sicher (Env, nie im Repo), **Kosten-Gate + Zähler
  in DB**, Feature-Flag. *Verifizieren: Gate blockt bei Limit, Kosten werden gezählt.*
- **M1 — Feedback-MVP (A):** ein Thema, ein „Feedback anfordern"-Button auf die Freitext-Lösung.
  *Verifizieren: sinnvolles, musterlösungs-gestütztes Feedback; Kosten real gemessen; Melde-Button.*
- **M2 — Blind-Vergleich:** dieselben Eingaben durch **Soofi vs. Claude** → Qualität vergleichen,
  bevor EU-Umstieg entschieden wird.
- **M3 — Fachgespräch-Simulator (B):** State-Machine (erfassen→analysieren→entscheiden→begründen),
  Sokratische Fragen, **Frustrations-Ventil** (mehrstufiges Scaffolding).
- **M4 — Fall-Recast (C):** Star-Company-Stufe 2; ggf. n8n-Agenten; Agenten-QA.

## 7. Entscheidungen, die JETZT anstehen (Voraussetzung für M0)

1. **Architektur:** Direkt (Astro-API) starten? → Empfehlung **ja**.
2. **Startmodell:** Sonnet 5 (mit Caching)? Einfaches Feedback auf Haiku? → Empfehlung **Sonnet 5**.
3. **Kosten-Obergrenze** pro Nutzer/Monat (hartes Gate) — welcher Betrag? (Vorschlag: **5 €**, großzügig,
   trotzdem sicher unter Abo-Marge.)
4. **Langdock:** Von Anfang an, oder erst ab X aktiven Nutzern? → Empfehlung **erst ab Skalierung**
   (Start direkt Anthropic, Abstraktion macht Umstieg billig).
5. **Reihenfolge bestätigen:** A → (Blind-Test) → B → C.

> Nichts davon ist unumkehrbar: Die `ki-client`-Abstraktion + das Feature-Flag halten die
> Architektur konform und den Ausstieg jederzeit offen.

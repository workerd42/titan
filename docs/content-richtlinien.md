# Titan — Content-Richtlinien

> Verbindliche Regeln für die redaktionelle Aufbereitung der Lerninhalte. Ergänzt
> [interaktive-module.md](interaktive-module.md) (interaktive Werkzeuge) um die
> **inhaltlichen** Leitplanken. Repo-Gegenstück zum Notion-Sprint-Backlog
> (US-08.2). Maßgeblich ist dieses Repo; Notion spiegelt.

---

## 1. Rechts- & Gesetzesinhalte: erklären statt zitieren (Gesetzes-Erklärer)

**Prinzip:** Gesetzestexte werden **nicht pauschal kopiert**. Zu jeder relevanten
Norm liefern wir eine **eigene Erklärung + ein Anwendungsbeispiel im
Prüfungskontext** und **verlinken den amtlichen Wortlaut**.

**Format je Norm:**

> **§ X [Gesetz] — eigene Erklärung + Anwendungsbeispiel** + Link zur amtlichen
> Quelle ([gesetze-im-internet.de](https://www.gesetze-im-internet.de)).

**Warum:**
- **Didaktischer Mehrwert = Verkaufsargument.** Der Lernende versteht, *wie* die
  Norm in der IHK-Prüfung angewendet wird — nicht nur, *dass* es sie gibt.
- **Roter Faden:** Das Anwendungsbeispiel bezieht sich möglichst auf das
  **Kompass-Unternehmen** des Lernenden ([produktvision.md](produktvision.md)).
- **Rechtlich robust.** Amtliche Gesetzestexte sind zwar nach **§ 5 UrhG
  gemeinfrei** (ein Verbatim-Zitat wäre also nicht per se verboten) — Treiber ist
  hier der **Mehrwert + Konsistenz**, nicht bloß das Urheberrecht. **Verlags­kom­men­tierungen
  und aufbereitete Fassungen sind dagegen geschützt → niemals daraus übernehmen.**

**Wo besonders relevant:** paragraphenlastige Themen, v. a. **HB4**
(BetrVG, ArbSchG § 5/§ 13, AGG, KSchG, ArbZG) sowie DSGVO-Bezüge.

### Umsetzung im Code (bereits gebaut)

Optionales Frontmatter-Feld `gesetze` in den Themen-Markdown-Dateien
([src/content.config.ts](../src/content.config.ts)); gerendert als ausklappbare
**§-Karten** (native `<details>` → zero-JS, tastaturbedienbar, `prefers-reduced-motion`-safe,
Norive-Tokens hell/dunkel) in der Phase „Verstehen".

```yaml
gesetze:
  - norm: "§ 5 ArbSchG"                      # Kurz-Zitat der Norm
    titel: "Gefährdungsbeurteilung"          # Kurztitel
    erklaerung: |                            # eigene Worte, KEIN Gesetzeszitat
      Der Arbeitgeber muss die mit der Arbeit verbundenen Gefährdungen ermitteln …
    anwendung: |                             # Anwendungsbeispiel, möglichst am Kompass-Unternehmen
      In der IHK-Prüfung wird nach der gesetzlichen Grundlage gefragt — § 5 ArbSchG …
    quelle: "https://www.gesetze-im-internet.de/arbschg/__5.html"  # amtliche Fassung
```

**Referenz-Beispiel im Repo:**
[src/content/themen/hb4-arbeitsschutz/02-gefaehrdungsbeurteilung.md](../src/content/themen/hb4-arbeitsschutz/02-gefaehrdungsbeurteilung.md)
(§ 5 + § 13 ArbSchG).

📝 *Offen (Rollout):* Feld auf die übrigen paragraphenlastigen Themen anwenden;
im Redaktionssystem (Directus, Roadmap 2.6) als eigenen Feldtyp vorsehen, damit
Fachautor:innen es strukturiert liefern.

---

## 2. Quellen & Urheberrecht (allgemein)

- **IHK-/AkA-Prüfungsaufgaben** sind geschützt → **nicht verbatim** übernehmen,
  nur als Analyse-Input für **eigene** Aufgaben im selben Stil
  (siehe [interaktive-module.md](interaktive-module.md), Prüfungs-Module).
- **Lehrbücher/Verlagswerke** (`docs/quellen/`, gitignored) sind Recherchequelle,
  kein Kopiervorlagen-Fundus — Inhalte in **eigener Formulierung**.
- Im Zweifel: eigener Text + Quellenverweis statt Übernahme.

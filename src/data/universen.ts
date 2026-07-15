/**
 * Universen — oberste Hierarchieebene: Universum → Galaxie (HF) → Planet (Thema)
 *
 * Aktuell existiert ein Universum (Fachwirt Marketing). Die Struktur ist
 * bewusst als Array angelegt, damit künftige IHK-Zertifizierungen
 * (Fachwirt Einzelhandel, Industriefachwirt, ...) als weitere Einträge
 * ergänzt werden können, ohne dass Routing, Komponenten oder das
 * 3-State-Zoom-System verändert werden müssen.
 */

export interface Universum {
  /** URL-Segment, z. B. "fachwirt-marketing" */
  id: string;
  nummer: number;
  titel: string;
  eyebrow: string;
  beschreibung: string;
  /** Zentralkörper- und Sphärenfarben (Norive-Warmton-System) */
  color: { highlight: string; base: string; rim: string; atmo: string };
  /** Platzhalter ohne eigene Handlungsfelder/Inhalte — im Karussell sichtbar,
   *  aber nicht anwählbar (siehe [universum]/index.astro Guard). */
  comingSoon?: boolean;
}

export const UNIVERSEN: Universum[] = [
  {
    id: 'fachwirt-marketing',
    nummer: 1,
    titel: 'Fachwirt für Marketing',
    eyebrow: 'IHK-Weiterbildung',
    beschreibung:
      'Die vollständige Prüfungsvorbereitung für die IHK-Fortbildungsprüfung Geprüfte/r Fachwirt/in für Marketing — vier Handlungsfelder, fachlich exakt und praxisnah.',
    color: {
      highlight: '#F0D880', base: '#C48830',
      rim: 'rgba(240,200,100,0.5)', atmo: 'rgba(196,150,60,0.28)',
    },
  },
  {
    id: 'fachwirt-vertrieb',
    nummer: 2,
    titel: 'Fachwirt für Vertrieb',
    eyebrow: 'IHK-Weiterbildung',
    beschreibung: 'In Vorbereitung — folgt als nächstes Universum.',
    color: {
      highlight: '#7AC0E8', base: '#2E5A78',
      rim: 'rgba(122,192,232,0.5)', atmo: 'rgba(80,140,220,0.24)',
    },
    comingSoon: true,
  },
  {
    id: 'industriefachwirt',
    nummer: 3,
    titel: 'Industriefachwirt',
    eyebrow: 'IHK-Weiterbildung',
    beschreibung: 'In Vorbereitung.',
    color: {
      highlight: '#7AC898', base: '#2A5A38',
      rim: 'rgba(122,200,152,0.5)', atmo: 'rgba(60,180,100,0.22)',
    },
    comingSoon: true,
  },
];

export function getUniversum(id: string): Universum | undefined {
  return UNIVERSEN.find((u) => u.id === id);
}

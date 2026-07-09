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
];

export function getUniversum(id: string): Universum | undefined {
  return UNIVERSEN.find((u) => u.id === id);
}

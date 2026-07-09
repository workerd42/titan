export interface Themengruppe {
  name: string;
}

export interface Handlungsbereich {
  id: 'hb1' | 'hb2' | 'hb3' | 'hb4';
  nummer: number;
  titel: string;
  beschreibung: string;          // Für Info-Panel beim Galaxie-Klick
  themengruppen: Themengruppe[];
  /** Zugehöriges Universum (URL-Segment aus data/universen.ts) */
  universumId: string;
}

export const BEREICHE: Handlungsbereich[] = [
  {
    id: 'hb1',
    universumId: 'fachwirt-marketing',
    nummer: 1,
    titel: 'Marketingstrategien entwickeln',
    beschreibung: 'Du entwickelst auf Basis fundierter Marktanalysen tragfähige Marketingstrategien. Du lernst Märkte zu segmentieren, Zielgruppen zu definieren und Positionierungen strategisch abzuleiten — prüfungsrelevant und praxisnah.',
    themengruppen: [
      { name: 'Marktforschung & Analyse' },
      { name: 'Strategieableitung' },
      { name: 'Implementierung' },
    ],
  },
  {
    id: 'hb2',
    universumId: 'fachwirt-marketing',
    nummer: 2,
    titel: 'Marketingkonzepte und -projekte planen und umsetzen',
    beschreibung: 'Du planst, koordinierst und steuerst Marketingprojekte von der Konzeptentwicklung bis zur Umsetzung. Der vollständige Marketing-Mix, Budgetplanung und die Arbeit mit agilen und klassischen Projektmethoden stehen im Mittelpunkt.',
    themengruppen: [
      { name: 'Marketing-Mix' },
      { name: 'Projektmanagement' },
      { name: 'Optimierung' },
    ],
  },
  {
    id: 'hb3',
    universumId: 'fachwirt-marketing',
    nummer: 3,
    titel: 'Marketingprozesse analysieren, bewerten und weiterentwickeln',
    beschreibung: 'Du misst, bewertest und optimierst Marketingprozesse mithilfe betriebswirtschaftlicher Kennzahlen. Deckungsbeitragsrechnung, Marketingcontrolling und Qualitätssicherung befähigen dich, fundierte Entscheidungen zu treffen.',
    themengruppen: [
      { name: 'Marketingcontrolling' },
      { name: 'Erfolgsmessung' },
      { name: 'Qualitätssicherung' },
    ],
  },
  {
    id: 'hb4',
    universumId: 'fachwirt-marketing',
    nummer: 4,
    titel: 'Kommunikation, Führung und Zusammenarbeit',
    beschreibung: 'Du entwickelst Kompetenzen in Führung, Personalmanagement und Kommunikation. Ausbildereignung, Konfliktmanagement, Arbeitsschutz und situationsgerechte Gesprächsführung qualifizieren dich als vollständige Führungskraft.',
    themengruppen: [
      { name: 'Situationsgerechte Kommunikation' },
      { name: 'Personalauswahl & Rekrutierung' },
      { name: 'Personaleinsatzplanung' },
      { name: 'Führungsmethoden' },
      { name: 'Berufsausbildung' },
      { name: 'Personalentwicklung' },
      { name: 'Arbeitsschutz' },
    ],
  },
];

export function getBereich(id: string): Handlungsbereich | undefined {
  return BEREICHE.find((b) => b.id === id);
}

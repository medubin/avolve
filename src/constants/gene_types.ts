import BodyType from './body_type'
import Color from './color'

export interface GeneTypeInfo {
  id: number
  name: string
  color: string
  displayColor: string // Color for UI display
}

// Centralized gene type mapping - ADD NEW GENES HERE
export const GENE_TYPES: GeneTypeInfo[] = [
  { id: BodyType.DEAD, name: 'DEAD', color: Color.DEAD, displayColor: '#5C3317' },
  { id: BodyType.DEAD_BARK, name: 'DEAD_BARK', color: Color.DEAD_BARK, displayColor: '#2E3A19' },
  { id: BodyType.GREEN, name: 'GREEN', color: Color.GREEN, displayColor: '#00FF00' },
  { id: BodyType.BLUE, name: 'BLUE', color: Color.BLUE, displayColor: '#0000FF' },
  { id: BodyType.MAROON, name: 'MAROON', color: Color.MAROON, displayColor: '#800000' },
  { id: BodyType.RED, name: 'RED', color: Color.RED, displayColor: '#FF0000' },
  { id: BodyType.CYAN, name: 'CYAN', color: Color.CYAN, displayColor: '#00FFFF' },
  { id: BodyType.GRAY, name: 'GRAY', color: Color.GRAY, displayColor: '#808080' },
  { id: BodyType.YELLOW, name: 'YELLOW', color: Color.YELLOW, displayColor: '#FFFF00' },
  { id: BodyType.ORANGE, name: 'ORANGE', color: Color.ORANGE, displayColor: '#FFA500' },
  { id: BodyType.TEAL, name: 'TEAL', color: Color.TEAL, displayColor: '#008080' },
  { id: BodyType.BARK, name: 'BARK', color: Color.BARK, displayColor: '#8B4513' },
  { id: BodyType.SKY, name: 'SKY', color: Color.SKY, displayColor: '#87CEEB' },
  { id: BodyType.INDIGO, name: 'INDIGO', color: Color.INDIGO, displayColor: '#4B0082' },
  { id: BodyType.WHITE, name: 'WHITE', color: Color.WHITE, displayColor: '#FFFFFF' },
  { id: BodyType.PINK, name: 'PINK', color: Color.PINK, displayColor: '#FFC0CB' },
  { id: BodyType.MAHOGANY, name: 'MAHOGANY', color: Color.MAHOGANY, displayColor: '#C04000' },
  { id: BodyType.OCHRE, name: 'OCHRE', color: Color.OCHRE, displayColor: '#CC7722' },
  { id: BodyType.VIOLET, name: 'VIOLET', color: Color.VIOLET, displayColor: '#8A2BE2' },
  { id: BodyType.TURQUOISE, name: 'TURQUOISE', color: Color.TURQUOISE, displayColor: '#00CED1' },
  { id: BodyType.STEEL, name: 'STEEL', color: Color.STEEL, displayColor: '#708090' },
  { id: BodyType.BURGUNDY, name: 'BURGUNDY', color: Color.BURGUNDY, displayColor: '#800020' },
]

// Utility functions
export const getGeneTypeById = (id: number): GeneTypeInfo | undefined => 
  GENE_TYPES.find(gene => gene.id === id)

export const getGeneTypeName = (id: number): string => 
  getGeneTypeById(id)?.name || 'UNKNOWN'

export const getGeneTypeColor = (id: number): string => 
  getGeneTypeById(id)?.color || Color.GRAY

export const getGeneTypeDisplayColor = (id: number): string => 
  getGeneTypeById(id)?.displayColor || '#CCCCCC'

// Dynamic ranges for gene generation
export const PLAYABLE_GENE_TYPES = GENE_TYPES.filter(g => g.id >= BodyType.GREEN) // Exclude DEAD types

// Type name mapping for easy lookup
export const GENE_TYPE_NAMES: {[key: number]: string} = 
  Object.fromEntries(GENE_TYPES.map(gene => [gene.id, gene.name]))

// Display color mapping for UI
export const GENE_DISPLAY_COLORS: {[key: string]: string} = 
  Object.fromEntries(GENE_TYPES.map(gene => [gene.name, gene.displayColor]))
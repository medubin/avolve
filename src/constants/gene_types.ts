import BodyType from './body_type'
import Color from './color'

export interface GeneTypeInfo {
  id: number
  name: string
  color: string
  displayColor: string // Color for UI display
  respirationCost: number // Required field - energy cost per tick for this gene type
  
  // Movement traits
  movementSpeed?: number // Speed for movement (0 = no movement)
  movementType?: 'fast' | 'slow' | 'none' // Movement category
  
  // Energy traits
  photosynthesis?: number // Energy production rate (0 = none)
  energyAbsorption?: number // Energy drain on contact (0 = none)
  energyAbsorptionEfficiency?: number // Percentage of absorbed energy retained
  
  // Behavioral traits
  collisionBehavior?: 'flee' | 'kill' | 'absorb' | 'coop' | 'infect' | 'harden' | 'stick' | 'attract' | 'none'
  collisionTargets?: number[] // Which body types this gene interacts with
  
  // Special abilities
  fleeFromAll?: boolean // Like TEAL  
  contactsAll?: boolean // Like SKY
  
  // Reproduction modifiers
  reproductionBonus?: number // Multiplier for reproduction (YELLOW)
  
  // Magnetic/physics traits
  magneticAttraction?: boolean // Creates attraction field (TURQUOISE)
  orbitalForce?: boolean // Creates orbital mechanics
}

// Centralized gene type mapping - ADD NEW GENES HERE
export const GENE_TYPES: GeneTypeInfo[] = [
  // Dead types
  { 
    id: BodyType.DEAD, name: 'DEAD', color: Color.DEAD, displayColor: '#5C3317',
    respirationCost: 1.0, collisionBehavior: 'none'
  },
  { 
    id: BodyType.DEAD_BARK, name: 'DEAD_BARK', color: Color.DEAD_BARK, displayColor: '#2E3A19',
    respirationCost: 1.0, collisionBehavior: 'none'
  },
  
  // Green Spectrum - Energy Production
  { 
    id: BodyType.GREEN, name: 'GREEN', color: Color.GREEN, displayColor: '#00FF00',
    respirationCost: 1.0, photosynthesis: 1.0, collisionBehavior: 'none'
  },
  { 
    id: BodyType.BARK, name: 'BARK', color: Color.BARK, displayColor: '#8B4513',
    respirationCost: 1.0, photosynthesis: 0.8, collisionBehavior: 'harden',
    collisionTargets: [BodyType.MAROON, BodyType.MAHOGANY, BodyType.PINK]
  },
  
  // Blue Spectrum - Movement Domain  
  { 
    id: BodyType.BLUE, name: 'BLUE', color: Color.BLUE, displayColor: '#0000FF',
    respirationCost: 0.4, collisionBehavior: 'flee', contactsAll: true
  },
  { 
    id: BodyType.CYAN, name: 'CYAN', color: Color.CYAN, displayColor: '#00FFFF',
    respirationCost: 0.4, movementSpeed: 10, movementType: 'fast', collisionBehavior: 'none'
  },
  { 
    id: BodyType.SKY, name: 'SKY', color: Color.SKY, displayColor: '#87CEEB',
    respirationCost: 0.6, movementSpeed: 2, movementType: 'slow', collisionBehavior: 'flee', contactsAll: true
  },
  { 
    id: BodyType.TEAL, name: 'TEAL', color: Color.TEAL, displayColor: '#008080',
    respirationCost: 0.6, collisionBehavior: 'flee', fleeFromAll: true
  },
  { 
    id: BodyType.TURQUOISE, name: 'TURQUOISE', color: Color.TURQUOISE, displayColor: '#00CED1',
    respirationCost: 0.7, magneticAttraction: true, orbitalForce: true, collisionBehavior: 'attract',
    collisionTargets: [BodyType.GREEN, BodyType.BLUE, BodyType.CYAN, BodyType.YELLOW, BodyType.RED, BodyType.MAROON, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE, BodyType.PINK, BodyType.OCHRE, BodyType.FOREST, BodyType.TURQUOISE]
  },
  // Movement AND Predation
  { 
  id: BodyType.INDIGO, name: 'INDIGO', color: Color.INDIGO, displayColor: '#4B0082',
  respirationCost: 1.0, movementSpeed: 3, movementType: 'slow', 
  collisionBehavior: 'absorb', energyAbsorption: 0.2, energyAbsorptionEfficiency: 1.0,
  collisionTargets: [BodyType.BLUE, BodyType.YELLOW, BodyType.CYAN, BodyType.DEAD, BodyType.TEAL, BodyType.GREEN, BodyType.FOREST, BodyType.SKY, BodyType.WHITE]
},
  
  // Red/Orange Spectrum - Predation
  { 
    id: BodyType.RED, name: 'RED', color: Color.RED, displayColor: '#FF0000',
    respirationCost: 1.0, collisionBehavior: 'absorb', energyAbsorption: 1.0, energyAbsorptionEfficiency: 0.9,
    collisionTargets: [BodyType.ORANGE, BodyType.MAROON, BodyType.PINK, BodyType.MAHOGANY, BodyType.OCHRE, BodyType.BURGUNDY, BodyType.INDIGO]
  },
  { 
    id: BodyType.ORANGE, name: 'ORANGE', color: Color.ORANGE, displayColor: '#FFA500',
    respirationCost: 1.0, collisionBehavior: 'absorb', energyAbsorption: 1.0, energyAbsorptionEfficiency: 0.9,
    collisionTargets: [BodyType.BLUE, BodyType.CYAN, BodyType.TEAL, BodyType.SKY, BodyType.INDIGO, BodyType.TURQUOISE, BodyType.YELLOW, BodyType.WHITE, BodyType.DEAD]
  },
  { 
    id: BodyType.MAROON, name: 'MAROON', color: Color.MAROON, displayColor: '#800000',
    respirationCost: 1.0, collisionBehavior: 'absorb', energyAbsorption: 1.0, energyAbsorptionEfficiency: 0.9,
    collisionTargets: [BodyType.DEAD, BodyType.GREEN, BodyType.FOREST, BodyType.BARK, BodyType.DEAD_BARK]
  },
  { 
    id: BodyType.PINK, name: 'PINK', color: Color.PINK, displayColor: '#FFC0CB',
    respirationCost: 1.0, collisionBehavior: 'absorb', energyAbsorption: 0.8, energyAbsorptionEfficiency: 0.7,
    collisionTargets: [BodyType.GREEN, BodyType.BARK, BodyType.YELLOW, BodyType.WHITE, BodyType.FOREST, BodyType.BLUE, BodyType.CYAN, BodyType.TEAL, BodyType.SKY, BodyType.TURQUOISE, BodyType.GRAY, BodyType.DEAD]
  },
  { 
    id: BodyType.MAHOGANY, name: 'MAHOGANY', color: Color.MAHOGANY, displayColor: '#C04000',
    respirationCost: 1.0, collisionBehavior: 'absorb', energyAbsorption: 1.0, energyAbsorptionEfficiency: 1.0,
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.BARK]
  },
  { 
    id: BodyType.OCHRE, name: 'OCHRE', color: Color.OCHRE, displayColor: '#CC7722',
    respirationCost: 0.3, collisionBehavior: 'absorb', energyAbsorption: 1.0, energyAbsorptionEfficiency: 1.0,
    collisionTargets: [BodyType.DEAD, BodyType.DEAD_BARK]
  },
  { 
    id: BodyType.BURGUNDY, name: 'BURGUNDY', color: Color.BURGUNDY, displayColor: '#800020',
    respirationCost: 0.5, collisionBehavior: 'stick', energyAbsorption: 0.15, energyAbsorptionEfficiency: 0.6,
    collisionTargets: [BodyType.GREEN, BodyType.BLUE, BodyType.CYAN, BodyType.YELLOW, BodyType.RED, BodyType.MAROON, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE, BodyType.PINK, BodyType.MAHOGANY, BodyType.OCHRE, BodyType.FOREST, BodyType.TURQUOISE, BodyType.GRAY]
  },
  
  // Special Mechanics
  { 
    id: BodyType.YELLOW, name: 'YELLOW', color: Color.YELLOW, displayColor: '#FFFF00',
    respirationCost: 1.0, reproductionBonus: 1.0, collisionBehavior: 'none'
  },
  { 
    id: BodyType.WHITE, name: 'WHITE', color: Color.WHITE, displayColor: '#FFFFFF',
    respirationCost: 1.0, collisionBehavior: 'infect',
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.RED, BodyType.MAROON, BodyType.BARK]
  },
  { 
    id: BodyType.GRAY, name: 'GRAY', color: Color.GRAY, displayColor: '#808080',
    respirationCost: 0.4, collisionBehavior: 'kill',
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.RED, BodyType.CYAN, BodyType.YELLOW, BodyType.MAROON, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE]
  },
  { 
    id: BodyType.FOREST, name: 'FOREST', color: Color.FOREST, displayColor: '#228B22',
    respirationCost: 1, photosynthesis: 0.7, collisionBehavior: 'coop',
    collisionTargets: [BodyType.GREEN, BodyType.BLUE, BodyType.CYAN, BodyType.YELLOW, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE, BodyType.PINK, BodyType.OCHRE, BodyType.FOREST]
  },
  { 
    id: BodyType.STEEL, name: 'STEEL', color: Color.STEEL, displayColor: '#708090',
    respirationCost: 0.3, collisionBehavior: 'none'
  },
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

// Trait lookup helpers
export const getGenePhotosynthesis = (id: number): number =>
  getGeneTypeById(id)?.photosynthesis || 0

export const getGeneMovementSpeed = (id: number): number =>
  getGeneTypeById(id)?.movementSpeed || 0

export const getGeneMovementType = (id: number): 'fast' | 'slow' | 'none' =>
  getGeneTypeById(id)?.movementType || 'none'

export const getGeneEnergyAbsorption = (id: number): number =>
  getGeneTypeById(id)?.energyAbsorption || 0

export const getGeneAbsorptionEfficiency = (id: number): number =>
  getGeneTypeById(id)?.energyAbsorptionEfficiency || 0

export const getGeneCollisionBehavior = (id: number): string =>
  getGeneTypeById(id)?.collisionBehavior || 'none'

export const getGeneCollisionTargets = (id: number): number[] =>
  getGeneTypeById(id)?.collisionTargets || []

export const getGeneReproductionBonus = (id: number): number =>
  getGeneTypeById(id)?.reproductionBonus || 0

export const doesGeneFleeFromAll = (id: number): boolean =>
  getGeneTypeById(id)?.fleeFromAll || false

export const doesGeneContactAll = (id: number): boolean =>
  getGeneTypeById(id)?.contactsAll || false

export const hasGeneMagneticAttraction = (id: number): boolean =>
  getGeneTypeById(id)?.magneticAttraction || false

export const getGeneRespirationCost = (id: number): number =>
  getGeneTypeById(id)?.respirationCost || 1.0
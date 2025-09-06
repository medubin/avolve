import BodyType from './body_type'
import Color from './color'

export interface GeneTypeInfo {
  id: number
  name: string
  color: string
  respirationCost: number // Required field - energy cost per tick for this gene type
  
  // Movement traits
  movementSpeed?: number // Speed for movement (0 = no movement)
  movementType?: 'fast' | 'slow' | 'none' // Movement category
  
  // Energy traits
  photosynthesis?: number // Energy production rate (0 = none)
  energyAbsorption?: number // Energy drain on contact (0 = none)
  energyAbsorptionEfficiency?: number // Percentage of absorbed energy retained
  
  // Behavioral traits
  collisionBehaviors?: ('absorb_energy' | 'share_energy' | 'enhance_photosynthesis' | 'kill' | 'physical_stick' | 'flee' | 'cause_flee' | 'attract' | 'infect' | 'harden' | 'heal')[]
  collisionTargets?: number[] // Which body types this gene interacts with
  fleeIntensity?: number // Flee force multiplier (default 1, higher = stronger flee)
  
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
    id: BodyType.DEAD, name: 'DEAD', color: Color.DEAD,
    respirationCost: 1.0, collisionBehaviors: []
  },
  { 
    id: BodyType.DEAD_BARK, name: 'DEAD_BARK', color: Color.DEAD_BARK,
    respirationCost: 1.0, collisionBehaviors: []
  },
  
  // Green Spectrum - Energy Production
  { 
    id: BodyType.GREEN, name: 'GREEN', color: Color.GREEN,
    respirationCost: 1.0, photosynthesis: 1.0, collisionBehaviors: []
  },
  { 
    id: BodyType.BARK, name: 'BARK', color: Color.BARK,
    respirationCost: 1.0, photosynthesis: 0.8, collisionBehaviors: ['harden'],
    collisionTargets: [BodyType.MAROON, BodyType.MAHOGANY, BodyType.PINK]
  },
  
  // Blue Spectrum - Movement Domain  
  { 
    id: BodyType.BLUE, name: 'BLUE', color: Color.BLUE,
    respirationCost: 0.4, collisionBehaviors: ['cause_flee']
  },
  { 
    id: BodyType.CYAN, name: 'CYAN', color: Color.CYAN,
    respirationCost: 0.4, movementSpeed: 10, movementType: 'fast', collisionBehaviors: []
  },
  { 
    id: BodyType.SKY, name: 'SKY', color: Color.SKY,
    respirationCost: 0.6, movementSpeed: 2, movementType: 'slow', collisionBehaviors: ['cause_flee'], fleeIntensity: 2
  },
  { 
    id: BodyType.TEAL, name: 'TEAL', color: Color.TEAL,
    respirationCost: 0.6, collisionBehaviors: ['flee'], fleeIntensity: 3
  },
  { 
    id: BodyType.TURQUOISE, name: 'TURQUOISE', color: Color.TURQUOISE,
    respirationCost: 0.7, magneticAttraction: true, orbitalForce: true, collisionBehaviors: ['attract'],
    collisionTargets: [BodyType.GREEN, BodyType.BLUE, BodyType.CYAN, BodyType.YELLOW, BodyType.RED, BodyType.MAROON, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE, BodyType.PINK, BodyType.OCHRE, BodyType.FOREST, BodyType.TURQUOISE]
  },
  // Movement AND Predation
  { 
  id: BodyType.INDIGO, name: 'INDIGO', color: Color.INDIGO,
  respirationCost: 1.0, movementSpeed: 3, movementType: 'slow', 
  collisionBehaviors: ['absorb_energy'], energyAbsorption: 0.2, energyAbsorptionEfficiency: 1.0,
  collisionTargets: [BodyType.BLUE, BodyType.YELLOW, BodyType.CYAN, BodyType.DEAD, BodyType.TEAL, BodyType.GREEN, BodyType.FOREST, BodyType.SKY, BodyType.WHITE]
},
  
  // Red/Orange Spectrum - Predation
  { 
    id: BodyType.RED, name: 'RED', color: Color.RED,
    respirationCost: 1.0, collisionBehaviors: ['absorb_energy'], energyAbsorption: 1.0, energyAbsorptionEfficiency: 0.9,
    collisionTargets: [BodyType.ORANGE, BodyType.MAROON, BodyType.PINK, BodyType.MAHOGANY, BodyType.OCHRE, BodyType.BURGUNDY, BodyType.INDIGO]
  },
  { 
    id: BodyType.ORANGE, name: 'ORANGE', color: Color.ORANGE,
    respirationCost: 1.0, collisionBehaviors: ['absorb_energy'], energyAbsorption: 1.0, energyAbsorptionEfficiency: 0.9,
    collisionTargets: [BodyType.BLUE, BodyType.CYAN, BodyType.TEAL, BodyType.SKY, BodyType.INDIGO, BodyType.TURQUOISE, BodyType.YELLOW, BodyType.WHITE, BodyType.DEAD]
  },
  { 
    id: BodyType.MAROON, name: 'MAROON', color: Color.MAROON,
    respirationCost: 1.0, collisionBehaviors: ['absorb_energy'], energyAbsorption: 1.0, energyAbsorptionEfficiency: 0.9,
    collisionTargets: [BodyType.DEAD, BodyType.GREEN, BodyType.FOREST, BodyType.BARK, BodyType.DEAD_BARK]
  },
  { 
    id: BodyType.PINK, name: 'PINK', color: Color.PINK,
    respirationCost: 1.0, collisionBehaviors: ['absorb_energy'], energyAbsorption: 0.8, energyAbsorptionEfficiency: 0.7,
    collisionTargets: [BodyType.GREEN, BodyType.BARK, BodyType.YELLOW, BodyType.WHITE, BodyType.FOREST, BodyType.BLUE, BodyType.CYAN, BodyType.TEAL, BodyType.SKY, BodyType.TURQUOISE, BodyType.GRAY, BodyType.DEAD]
  },
  { 
    id: BodyType.MAHOGANY, name: 'MAHOGANY', color: Color.MAHOGANY,
    respirationCost: 1.0, collisionBehaviors: ['absorb_energy'], energyAbsorption: 1.0, energyAbsorptionEfficiency: 1.0,
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.BARK]
  },
  { 
    id: BodyType.OCHRE, name: 'OCHRE', color: Color.OCHRE,
    respirationCost: 0.3, collisionBehaviors: ['absorb_energy'], energyAbsorption: 1.0, energyAbsorptionEfficiency: 1.0,
    collisionTargets: [BodyType.DEAD, BodyType.DEAD_BARK]
  },
  { 
    id: BodyType.BURGUNDY, name: 'BURGUNDY', color: Color.BURGUNDY,
    respirationCost: 0.5, collisionBehaviors: ['absorb_energy','physical_stick'], energyAbsorption: 0.15, energyAbsorptionEfficiency: 0.6,
    collisionTargets: [BodyType.GREEN, BodyType.BLUE, BodyType.CYAN, BodyType.YELLOW, BodyType.RED, BodyType.MAROON, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE, BodyType.PINK, BodyType.MAHOGANY, BodyType.OCHRE, BodyType.FOREST, BodyType.TURQUOISE, BodyType.GRAY]
  },
  
  // Special Mechanics
  { 
    id: BodyType.YELLOW, name: 'YELLOW', color: Color.YELLOW,
    respirationCost: 1.0, reproductionBonus: 1.0, collisionBehaviors: []
  },
  { 
    id: BodyType.WHITE, name: 'WHITE', color: Color.WHITE,
    respirationCost: 1.0, collisionBehaviors: ['infect'],
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.RED, BodyType.MAROON, BodyType.BARK]
  },
  { 
    id: BodyType.GRAY, name: 'GRAY', color: Color.GRAY,
    respirationCost: 0.4, collisionBehaviors: ['kill'],
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.RED, BodyType.CYAN, BodyType.YELLOW, BodyType.MAROON, BodyType.ORANGE, BodyType.TEAL, BodyType.BARK, BodyType.SKY, BodyType.INDIGO, BodyType.WHITE]
  },
  { 
    id: BodyType.FOREST, name: 'FOREST', color: Color.FOREST,
    respirationCost: 1, photosynthesis: 0.7, collisionBehaviors: ['share_energy','enhance_photosynthesis'],
    collisionTargets: [BodyType.GREEN, BodyType.FOREST, BodyType.BARK]
  },
  { 
    id: BodyType.STEEL, name: 'STEEL', color: Color.STEEL,
    respirationCost: 0.3, collisionBehaviors: []
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
  getGeneTypeById(id)?.color || '#CCCCCC'

// Dynamic ranges for gene generation
export const PLAYABLE_GENE_TYPES = GENE_TYPES.filter(g => g.id >= BodyType.GREEN) // Exclude DEAD types

// Type name mapping for easy lookup
export const GENE_TYPE_NAMES: {[key: number]: string} = 
  Object.fromEntries(GENE_TYPES.map(gene => [gene.id, gene.name]))

// Display color mapping for UI
export const GENE_DISPLAY_COLORS: {[key: string]: string} = 
  Object.fromEntries(GENE_TYPES.map(gene => [gene.name, gene.color]))

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

export const getGeneCollisionBehaviors = (id: number): string[] =>
  getGeneTypeById(id)?.collisionBehaviors || []

export const getGeneCollisionTargets = (id: number): number[] =>
  getGeneTypeById(id)?.collisionTargets || []

export const getGeneReproductionBonus = (id: number): number =>
  getGeneTypeById(id)?.reproductionBonus || 0

export const getGeneFleeIntensity = (id: number): number =>
  getGeneTypeById(id)?.fleeIntensity || 1

export const hasGeneMagneticAttraction = (id: number): boolean =>
  getGeneTypeById(id)?.magneticAttraction || false

export const getGeneRespirationCost = (id: number): number =>
  getGeneTypeById(id)?.respirationCost || 1.0
import Organisms from './organisms'
import World from './world'
import WorldParameters from '../parameters/world_parameters'

export default class Database {
  public organisms : Organisms
  public world : World
  public geneFrequencies : {[key: number]: number}

  constructor() {
    this.organisms = new Organisms()
    this.world = new World(WorldParameters.CO2)
    this.geneFrequencies = {}
    // Initialize all body types to 0
    for (let i = 0; i <= 20; i++) {
      this.geneFrequencies[i] = 0
    }
  }

  public updateGeneFrequencies(organism: any, increment: boolean) {
    const multiplier = increment ? 1 : -1
    for (const body of organism.body.bodies) {
      const bodyType = parseInt(body.label.split(':')[1], 10)
      this.geneFrequencies[bodyType] += multiplier
    }
  }

  public getSortedGeneFrequencies(): Array<{type: number, count: number, name: string}> {
    const typeNames: {[key: number]: string} = {
      0: 'DEAD', 1: 'DEAD_BARK', 2: 'GREEN', 3: 'BLUE', 4: 'MAROON', 
      5: 'RED', 6: 'CYAN', 7: 'GRAY', 8: 'YELLOW', 9: 'ORANGE', 
      10: 'TEAL', 11: 'BARK', 12: 'SKY', 13: 'INDIGO', 14: 'WHITE',
      15: 'PINK', 16: 'MAHOGANY', 17: 'OCHRE', 18: 'VIOLET', 
      19: 'TURQUOISE', 20: 'STEEL'
    }
    
    return Object.entries(this.geneFrequencies)
      .map(([type, count]) => ({
        type: parseInt(type),
        count: count as number,
        name: typeNames[parseInt(type)] || 'UNKNOWN'
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
  }
}

import { GENE_TYPE_NAMES, GENE_TYPES } from "../constants/gene_types"
import Organism from "../organisms/organism"

export default class Frequency {
  public geneFrequencies : {[key: number]: number}
  public historicalGeneFrequencies : {[key: number]: number}

  constructor() {
    this.geneFrequencies = {}
    this.historicalGeneFrequencies = {}
        // Initialize all gene types to 0 (dynamic based on GENE_TYPES array)
    for (const geneType of GENE_TYPES) {
      this.geneFrequencies[geneType.id] = 0
      this.historicalGeneFrequencies[geneType.id] = 0
    }
  }

  public updateGeneFrequencies(organism: Organism, increment: boolean) {
    const multiplier = increment ? 1 : -1
    for (const body of organism.body.bodies) {
      const bodyType = parseInt(body.label.split(':')[1], 10)
      this.geneFrequencies[bodyType] += multiplier
      
      // Only increment historical totals when organisms are born (never decrement)
      if (increment) {
        this.historicalGeneFrequencies[bodyType] += 1
      }
    }
  }

  public getSortedHistoricalGeneFrequencies(): Array<{type: number, count: number, name: string}> {
    return Object.entries(this.historicalGeneFrequencies)
      .map(([type, count]) => ({
        type: parseInt(type),
        count: count as number,
        name: GENE_TYPE_NAMES[parseInt(type)] || 'UNKNOWN'
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
  }

  public getSortedGeneFrequencies(): Array<{type: number, count: number, name: string}> {
    return Object.entries(this.geneFrequencies)
      .map(([type, count]) => ({
        type: parseInt(type),
        count: count as number,
        name: GENE_TYPE_NAMES[parseInt(type)] || 'UNKNOWN'
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
  }
}

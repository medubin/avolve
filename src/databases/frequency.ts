import { GENE_DISPLAY_COLORS, GENE_TYPE_NAMES, GENE_TYPES } from "../constants/gene_types"
import Organism from "../organisms/organism"

export default class Frequency {
  public geneFrequencies : {[key: number]: number}
  public historicalGeneFrequencies : {[key: number]: number}
  private historicalData: {tick: number, frequencies: {[key: string]: number}}[] = []

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
    const genes = organism.getGeneFrequency()
    for (const gene of genes) {
      if (organism.isAlive) {
        this.geneFrequencies[gene] += multiplier
      }
      else {
        this.geneFrequencies[0] += multiplier
      }
      
      // Only increment historical totals when organisms are born (never decrement)
      if (increment) {
          this.historicalGeneFrequencies[gene] += 1
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

  public updateHistoricalGraph(tickNumber: number) {
  // Sample data every 100 ticks to keep graph manageable, plus collect initial data points
  const shouldCollect = tickNumber % 100 === 0 || 
                        tickNumber === 1 || 
                        tickNumber === 50
  
  if (shouldCollect) {
    const currentFreqs = this.getSortedGeneFrequencies()
    const freqMap: {[key: string]: number} = {}
    currentFreqs.forEach(item => {
      freqMap[item.name] = item.count
    })
    
    
    this.historicalData.push({
      tick: tickNumber,
      frequencies: freqMap
    })
    
    // Keep only last 1000 data points (100,000 ticks of history)
    if (this.historicalData.length > 1000) {
      this.historicalData.shift()
    }
  }
}

    public drawHistoryGraph() {
    const canvas = document.getElementById('history-graph') as HTMLCanvasElement
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (this.historicalData.length < 2) {
      ctx.fillStyle = '#CCCCCC'
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Collecting data...', canvas.width / 2, canvas.height / 2)
      ctx.fillText(`${this.historicalData.length} data points`, canvas.width / 2, canvas.height / 2 + 20)
      return
    }
    
    // Get all genes that have appeared in the data for graphing
    const latestFreqs = this.historicalData[this.historicalData.length - 1]?.frequencies || {}
    const allGenesSet = new Set<string>()
    
    // Collect all gene names that have appeared throughout history
    this.historicalData.forEach(data => {
      Object.keys(data.frequencies).forEach(geneName => {
        if (data.frequencies[geneName] > 0) {
          allGenesSet.add(geneName)
        }
      })
    })
    
    // Convert to array and sort by current frequency (highest first)
    const allGenes = Array.from(allGenesSet)
      .sort((a, b) => (latestFreqs[b] || 0) - (latestFreqs[a] || 0))
    
    // Find max value for scaling
    let maxValue = 0
    this.historicalData.forEach(data => {
      allGenes.forEach(gene => {
        if (data.frequencies[gene] && data.frequencies[gene] > maxValue) {
          maxValue = data.frequencies[gene]
        }
      })
    })
    
    if (maxValue === 0) {
      ctx.fillStyle = '#CCCCCC'
      ctx.font = '16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2)
      return
    }
    
    // Draw grid lines
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = (canvas.height / 10) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    
    // Draw vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (canvas.width / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    // Draw lines for each gene
    allGenes.forEach((gene, index) => {
      if (!GENE_DISPLAY_COLORS[gene]) return
      
      ctx.strokeStyle = GENE_DISPLAY_COLORS[gene]
      ctx.lineWidth = 2
      ctx.beginPath()
      
      let isFirstPoint = true
      let hasData = false
      
      this.historicalData.forEach((data, dataIndex) => {
        const x = (canvas.width / (this.historicalData.length - 1)) * dataIndex
        const value = data.frequencies[gene] || 0
        const y = canvas.height - (value / maxValue) * canvas.height
        
        if (value > 0) hasData = true
        
        if (isFirstPoint) {
          ctx.moveTo(x, y)
          isFirstPoint = false
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      if (hasData) {
        ctx.stroke()
        
        // Draw gene name and current value (only show first 10 to avoid overcrowding)
        if (index < 10) {
          ctx.fillStyle = GENE_DISPLAY_COLORS[gene]
          ctx.font = '10px monospace'
          ctx.textAlign = 'left'
          const currentValue = latestFreqs[gene] || 0
          ctx.fillText(`${gene}: ${currentValue}`, 5, 15 + index * 12)
        }
      }
    })
  }

  
}

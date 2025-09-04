import * as Matter from 'matter-js'
import Organism from './organisms/organism'
import Database from './databases/database'
import Genome from './organisms/genome'
import Camera from './services/camera'
import Keyboard from './services/keyboard'
import World from './parameters/world_parameters'
import { rng } from './utilities/random'
import { resolveCollision } from './utilities/collision_interaction'
import WorldDisplay from './services/world_display'
import {  GENE_DISPLAY_COLORS } from './constants/gene_types'

// create an engine
const engine = Matter.Engine.create()
engine.world.gravity.y = 0

Matter.World.add(engine.world, [
  // top
  Matter.Bodies.rectangle(World.WIDTH / 2, 0, World.WIDTH, World.WALL, { isStatic: true }),
  // bottom
  Matter.Bodies.rectangle(World.WIDTH / 2, World.HEIGHT, World.WIDTH, World.WALL,
                          { isStatic: true }),
  // left
  Matter.Bodies.rectangle(0, World.HEIGHT / 2, World.WALL, World.HEIGHT, { isStatic: true }),
  // right
  Matter.Bodies.rectangle(World.WIDTH, World.HEIGHT / 2, World.WALL, World.HEIGHT,
                          { isStatic: true }),
])

// create a renderer
const render = Matter.Render.create({
  engine,
  element: document.getElementById('avolve'),
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    hasBounds: true,
    wireframes: false,
  },
})

const camera = new Camera(render)
const keyboard = new Keyboard(camera)
keyboard.attachKeys()

const database = new Database()

// Organism selection system
let selectedOrganism: Organism | null = null

// Add mouse click handler
render.canvas.addEventListener('click', (event) => {
  const rect = render.canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  // Convert screen coordinates to world coordinates
  const worldX = mouseX + render.bounds.min.x
  const worldY = mouseY + render.bounds.min.y
  
  // Find organism at click position
  const clickedOrganism = findOrganismAtPosition(worldX, worldY, database)
  
  if (clickedOrganism) {
    // Clear previous selection
    if (selectedOrganism) {
      clearHighlight(selectedOrganism)
    }
    
    // Select new organism
    selectedOrganism = clickedOrganism
    highlightOrganism(selectedOrganism)
    selectedOrganism.displayOrganismInfo()
  } else {
    // Clear selection if clicking empty space
    if (selectedOrganism) {
      clearHighlight(selectedOrganism)
      selectedOrganism = null
      clearOrganismInfo()
    }
  }
})

function findOrganismAtPosition(x: number, y: number, database: Database) {
  const organisms = database.organisms.organisms
  
  for (const uuid in organisms) {
    const organism = organisms[uuid]
    
    // Check each body part of the organism (works for both alive and dead)
    for (const body of organism.body.bodies) {
      const distance = Math.sqrt(
        Math.pow(body.position.x - x, 2) + Math.pow(body.position.y - y, 2)
      )
      
      // If click is within body radius, select this organism
      if (distance <= body.circleRadius || distance <= 15) { // Fallback radius for non-circles
        return organism
      }
    }
  }
  
  return null
}

function highlightOrganism(organism: Organism) {
  // Add thick outline while keeping original color
  for (const body of organism.body.bodies) {
    body.render.lineWidth = 4 // Thick border for selection
    // Keep the original color - no need to change strokeStyle
  }
}

function clearHighlight(organism: Organism) {
  // Reset to original line width
  for (const body of organism.body.bodies) {
    body.render.lineWidth = 1 // Reset to thin border
    // Color stays the same - no need to restore
  }
}

function clearOrganismInfo() {
  const infoElement = document.getElementById('organism-info')
  if (infoElement) {
    infoElement.remove()
  }
}

const worldDisplay = new WorldDisplay(database)

// Create gene frequency display
function createGeneFrequencyDisplay() {
  const display = document.createElement('div')
  display.id = 'gene-frequency-display'
  display.style.position = 'fixed'
  display.style.left = '10px'
  display.style.top = '10px'
  display.style.background = 'rgba(0,0,0,0.8)'
  display.style.color = 'white'
  display.style.padding = '10px'
  display.style.borderRadius = '5px'
  display.style.fontFamily = 'monospace'
  display.style.fontSize = '12px'
  display.style.zIndex = '1000'
  display.style.minWidth = '150px'
  display.style.maxHeight = '80vh'
  display.style.overflowY = 'auto'
  display.style.cursor = 'pointer'
  display.title = 'Click to toggle between Current and Historical view'
  document.body.appendChild(display)
}

function updateGeneFrequencyDisplay() {
  const display = document.getElementById('gene-frequency-display')
  if (!display) return
  
  // Show text views (current or historical)
  const frequencies = viewMode === 'historical' ? database.frequency.getSortedHistoricalGeneFrequencies() : database.frequency.getSortedGeneFrequencies()
  const totalGenes = frequencies.reduce((sum, item) => sum + item.count, 0)
  
  const viewType = viewMode === 'historical' ? 'Historical' : 'Current'
  const icon = viewMode === 'historical' ? '📈' : '📊'
  let html = `<strong>${icon} ${viewType} Gene Frequencies</strong><br>`
  html += '<small style="color: #CCCCCC">Click to toggle | Press G for graph</small><br><br>'
  
  frequencies.forEach(item => {
    const percentage = ((item.count / totalGenes) * 100).toFixed(1)
    const color = GENE_DISPLAY_COLORS[item.name] || '#CCCCCC'
    html += `<span style="color: ${color}">●</span> ${item.name}: ${item.count}`
    
    if (viewMode === 'current') {
      html += ` (${percentage}%)`
    }
    html += '<br>'
  })
  
  if (frequencies.length === 0) {
    html += '<em>No data available</em>'
  }
  
  display.innerHTML = html
}

createGeneFrequencyDisplay()

// Create separate graph display for G key - bottom left, always visible when toggled
function createGraphDisplay() {
  const display = document.createElement('div')
  display.id = 'graph-display'
  display.style.position = 'fixed'
  display.style.left = '10px'
  display.style.bottom = '10px'
  display.style.background = 'rgba(0,0,0,0.9)'
  display.style.color = 'white'
  display.style.padding = '15px'
  display.style.borderRadius = '5px'
  display.style.fontFamily = 'monospace'
  display.style.fontSize = '12px'
  display.style.zIndex = '1500'
  display.style.display = 'none'
  
  let html = '<strong>📊 Gene Frequency Graph</strong><br>'
  html += '<small style="color: #CCCCCC">Press G to close</small><br><br>'
  html += '<canvas id="history-graph" width="380" height="200" style="background: rgba(0,0,0,0.3); border: 1px solid #555;"></canvas>'
  
  display.innerHTML = html
  document.body.appendChild(display)
}

let graphVisible = false

function toggleGraphDisplay() {
  const display = document.getElementById('graph-display')
  if (!display) {
    createGraphDisplay()
  }
  
  const actualDisplay = document.getElementById('graph-display')!
  
  if (!graphVisible) {
    actualDisplay.style.display = 'block'
    graphVisible = true
    drawHistoryGraph() // Initial draw
  } else {
    actualDisplay.style.display = 'none'
    graphVisible = false
  }
}

function drawHistoryGraph() {
  const canvas = document.getElementById('history-graph') as HTMLCanvasElement
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  if (historicalData.length < 2) {
    ctx.fillStyle = '#CCCCCC'
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Collecting data...', canvas.width / 2, canvas.height / 2)
    ctx.fillText(`${historicalData.length} data points`, canvas.width / 2, canvas.height / 2 + 20)
    return
  }
  
  // Get all genes that have appeared in the data for graphing
  const latestFreqs = historicalData[historicalData.length - 1]?.frequencies || {}
  const allGenesSet = new Set<string>()
  
  // Collect all gene names that have appeared throughout history
  historicalData.forEach(data => {
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
  historicalData.forEach(data => {
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
    
    historicalData.forEach((data, dataIndex) => {
      const x = (canvas.width / (historicalData.length - 1)) * dataIndex
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

// Add keyboard handler for G key
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'g') {
    toggleGraphDisplay()
  }
})


// Store historical data for graphing
const historicalData: {tick: number, frequencies: {[key: string]: number}}[] = []

function updateHistoricalGraph() {
  // Sample data every 100 ticks to keep graph manageable, plus collect initial data points
  const shouldCollect = database.world.tickNumber % 100 === 0 || 
                        database.world.tickNumber === 1 || 
                        database.world.tickNumber === 50
  
  if (shouldCollect) {
    const currentFreqs = database.frequency.getSortedGeneFrequencies()
    const freqMap: {[key: string]: number} = {}
    currentFreqs.forEach(item => {
      freqMap[item.name] = item.count
    })
    
    
    historicalData.push({
      tick: database.world.tickNumber,
      frequencies: freqMap
    })
    
    // Keep only last 1000 data points (100,000 ticks of history)
    if (historicalData.length > 1000) {
      historicalData.shift()
    }
  }
}

// Toggle between current and historical view
let viewMode = 'current' // 'current', 'historical'
document.getElementById('gene-frequency-display')?.addEventListener('click', () => {
  viewMode = viewMode === 'current' ? 'historical' : 'current'
  updateGeneFrequencyDisplay()
})

for (let i = 0; i < World.STARTING_ORGANISMS; i += 1) {
  const x = rng(50, World.WIDTH - 50)
  const y = rng(50, World.HEIGHT - 50)
  // Create organism with temporary energy, then set it to 50% of reproduction threshold
  const organism = new Organism(x, y, engine.world, Genome.random(), 1000, null, database)
  organism.energy = organism.reproduceAt * 0.5
  database.organisms.addOrganism(organism, database)
  database.world.consumeCO2(organism.energy)
}
// create a runner
const runner = Matter.Runner.create()

Matter.Events.on(engine, 'beforeUpdate', (_) => {
  const organisms = database.organisms.organisms
  for (const uuid in organisms) {
    organisms[uuid].update()
  }
  camera.scrollX()
  camera.scrollY()
  database.world.tickNumber += 1
  worldDisplay.tick()
  updateGeneFrequencyDisplay()
  updateHistoricalGraph()
  
  // Update graph in real-time if visible
  if (graphVisible) {
    drawHistoryGraph()
  }
  
  // Update selected organism info in real-time (works for both alive and dead)
  if (selectedOrganism) {
    selectedOrganism.displayOrganismInfo()
  }
})

Matter.Events.on(engine, 'collisionActive', collisionResolver)
Matter.Events.on(engine, 'collisionStart', collisionResolver)

function collisionResolver(event : any) {
  resolveCollision(event, database)
}

// run the renderer
Matter.Render.run(render)

// run the engine
Matter.Runner.run(runner, engine)

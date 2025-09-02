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
let selectedOrganism: any = null

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
    displayOrganismInfo(selectedOrganism)
  } else {
    // Clear selection if clicking empty space
    if (selectedOrganism) {
      clearHighlight(selectedOrganism)
      selectedOrganism = null
      clearOrganismInfo()
    }
  }
})

function findOrganismAtPosition(x: number, y: number, database: any) {
  const organisms = database.organisms.organisms
  
  for (const uuid in organisms) {
    const organism = organisms[uuid]
    
    // Check each body part of the organism
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

function highlightOrganism(organism: any) {
  // Add thick outline while keeping original color
  for (const body of organism.body.bodies) {
    body.render.lineWidth = 4 // Thick border for selection
    // Keep the original color - no need to change strokeStyle
  }
}

function clearHighlight(organism: any) {
  // Reset to original line width
  for (const body of organism.body.bodies) {
    body.render.lineWidth = 1 // Reset to thin border
    // Color stays the same - no need to restore
  }
}

function displayOrganismInfo(organism: any) {
  const infoElement = document.getElementById('organism-info')
  if (!infoElement) {
    // Create info display element
    const info = document.createElement('div')
    info.id = 'organism-info'
    info.style.position = 'fixed'
    info.style.top = '10px'
    info.style.right = '10px'
    info.style.background = 'rgba(0,0,0,0.8)'
    info.style.color = 'white'
    info.style.padding = '10px'
    info.style.borderRadius = '5px'
    info.style.fontFamily = 'monospace'
    info.style.fontSize = '12px'
    info.style.zIndex = '1000'
    info.style.minWidth = '200px'
    document.body.appendChild(info)
  }
  
  const info = document.getElementById('organism-info')!
  
  // Calculate some dynamic stats
  const energyPercent = Math.round((organism.energy / organism.reproduceAt) * 100)
  const agePercent = Math.round((organism.age / organism.maxAge) * 100)
  
  // Get body part composition
  const bodyTypes: {[key: string]: number} = {}
  for (const body of organism.body.bodies) {
    const bodyType = parseInt(body.label.split(':')[1], 10)
    const typeName = getBodyTypeName(bodyType)
    bodyTypes[typeName] = (bodyTypes[typeName] || 0) + 1
  }
  
  const bodyComposition = Object.entries(bodyTypes)
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ')
  
  info.innerHTML = `
    <strong>🔍 Organism #${organism.uuid}</strong><br>
    <strong>Energy:</strong> ${Math.round(organism.energy)} (${energyPercent}%)<br>
    <strong>Age:</strong> ${organism.age} / ${organism.maxAge} (${agePercent}%)<br>
    <strong>Status:</strong> ${organism.isAlive ? '💚 Alive' : '💀 Dead'}<br>
    <strong>Parent:</strong> #${organism.parentUuid || 'None'}<br>
    <strong>Body Parts:</strong> ${organism.body.bodies.length}<br>
    <strong>Colors:</strong> ${bodyComposition}<br>
  `
}

function getBodyTypeName(bodyType: number): string {
  const typeMap: {[key: number]: string} = {
    0: 'DEAD', 1: 'DEAD_BARK', 2: 'GREEN', 3: 'BLUE', 4: 'MAROON', 
    5: 'RED', 6: 'CYAN', 7: 'GRAY', 8: 'YELLOW', 9: 'ORANGE', 
    10: 'TEAL', 11: 'BARK', 12: 'SKY', 13: 'INDIGO', 14: 'WHITE',
    15: 'PINK', 16: 'MAHOGANY', 17: 'OCHRE', 18: 'VIOLET', 
    19: 'TURQUOISE', 20: 'STEEL'
  }
  return typeMap[bodyType] || 'UNKNOWN'
}

function clearOrganismInfo() {
  const infoElement = document.getElementById('organism-info')
  if (infoElement) {
    infoElement.remove()
  }
}

const worldDisplay = new WorldDisplay(database)

for (let i = 0; i < World.STARTING_ORGANISMS; i += 1) {
  const x = rng(50, World.WIDTH - 50)
  const y = rng(50, World.HEIGHT - 50)
  const organism = new Organism(x, y, engine.world, Genome.random(), 1000, null, database)
  database.organisms.addOrganism(organism)
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
  
  // Update selected organism info in real-time
  if (selectedOrganism && selectedOrganism.isAlive) {
    displayOrganismInfo(selectedOrganism)
  } else if (selectedOrganism && !selectedOrganism.isAlive) {
    // Clear selection if organism died
    clearHighlight(selectedOrganism)
    selectedOrganism = null
    clearOrganismInfo()
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

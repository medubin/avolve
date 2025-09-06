import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { rngFloat, rngBool } from '../utilities/random'
import Color from '../constants/color'
import { getGenePhotosynthesis, getGeneMovementSpeed, getGeneMovementType, getGeneReproductionBonus, hasGeneMagneticAttraction, getGeneRespirationCost, getGeneTypeName, getGeneTypeColor } from '../constants/gene_types'

export default class Organism {
  protected database : Database
  protected world : Matter.World
  protected genome : Genome
  protected moveables : Matter.Body[][]
  protected synthesizers : number
  protected bodySize : number
  public body : Matter.Composite
  public reproduceAt : number
  public energy : number
  public uuid : number
  public age : number
  public maxAge : number
  public isAlive : boolean
  public parentUuid : number
  public broodSize : number
  public totalChildren : number
  public generation : number
  public infection : Genome
  public photosynthesisMultiplier : number
  public immuneToInfection : boolean
  public activeTab : string = 'stats'

  constructor(
    x : number,
    y : number,
    world : Matter.World,
    genome : Genome,
    energy : number,
    parent : Organism,
    database : Database,
    ) {
    this.database = database
    this.world = world
    this.genome = genome
    this.energy = energy
    this.isAlive = true
    this.uuid = database.organisms.newUuid
    this.body = this.genome.createBody(x, y, this.uuid)
    Matter.World.add(world, this.body)
    this.parentUuid = parent ? parent.uuid : null
    this.generation = parent ? parent.generation + 1 : 0
    this.infection = null
    // CYAN, INDIGO
    this.moveables = [[], []]
    this.synthesizers = 0
    this.bodySize = 100
    this.photosynthesisMultiplier = 1.0
    this.immuneToInfection = false
    let yellowArea = 0
    for (const body of this.body.bodies) {
      const genotype : number = parseInt(body.label.split(':')[1], 10)
      
      // Movement assignment based on centralized traits
      const movementType = getGeneMovementType(genotype)
      if (movementType === 'fast') {
        this.moveables[0].push(body) // Fast movement (index 0)
      } else if (movementType === 'slow') {
        this.moveables[1].push(body) // Slow movement (index 1)
      }
      
      // Photosynthesis based on centralized traits
      const photosynthesis = getGenePhotosynthesis(genotype)
      if (photosynthesis > 0) {
        this.synthesizers += (body.area * photosynthesis)
      }
      
      // Reproduction bonus from YELLOW
      const reproductionBonus = getGeneReproductionBonus(genotype)
      if (reproductionBonus > 0) {
        yellowArea += body.area
      }
      
      // Infection immunity from YELLOW
      if (genotype === BodyType.YELLOW) {
        this.immuneToInfection = true
      }

      this.bodySize += body.area
    }
    this.reproduceAt = this.bodySize * 10
    this.reproduceAt = Math.max(this.reproduceAt - yellowArea, this.reproduceAt / 2)

    this.broodSize = 1 + Math.ceil(yellowArea * 5 / this.bodySize)
    this.totalChildren = 0

    this.age = 0
    this.maxAge = Math.sqrt(this.bodySize) * 150
  }

  public displayOrganismInfo() {
  let infoElement = document.getElementById('organism-info')
  const isNewPanel = !infoElement
  
  if (isNewPanel) {
    // Create info display element with tabs
    const info = document.createElement('div')
    info.id = 'organism-info'
    info.style.position = 'fixed'
    info.style.top = '10px'
    info.style.right = '10px'
    info.style.background = 'rgba(0,0,0,0.8)'
    info.style.color = 'white'
    info.style.borderRadius = '5px'
    info.style.fontFamily = 'monospace'
    info.style.fontSize = '12px'
    info.style.zIndex = '1000'
    info.style.minWidth = '250px'
    info.style.maxHeight = '80vh'
    info.style.overflowY = 'auto'
    
    // Create tab buttons
    const tabsContainer = document.createElement('div')
    tabsContainer.style.display = 'flex'
    tabsContainer.style.borderBottom = '1px solid #555'
    tabsContainer.style.marginBottom = '10px'
    
    const statsTab = document.createElement('button')
    statsTab.textContent = 'Stats'
    statsTab.id = 'stats-tab'
    statsTab.style.flex = '1'
    statsTab.style.padding = '8px'
    statsTab.style.background = 'rgba(255,255,255,0.2)'
    statsTab.style.color = 'white'
    statsTab.style.border = 'none'
    statsTab.style.cursor = 'pointer'
    statsTab.style.fontFamily = 'monospace'
    statsTab.style.fontSize = '12px'
    statsTab.onclick = () => this.switchTab('stats')
    
    const geneticsTab = document.createElement('button')
    geneticsTab.textContent = 'Genetics'
    geneticsTab.id = 'genetics-tab'
    geneticsTab.style.flex = '1'
    geneticsTab.style.padding = '8px'
    geneticsTab.style.background = 'rgba(255,255,255,0.1)'
    geneticsTab.style.color = '#aaa'
    geneticsTab.style.border = 'none'
    geneticsTab.style.cursor = 'pointer'
    geneticsTab.style.fontFamily = 'monospace'
    geneticsTab.style.fontSize = '12px'
    geneticsTab.onclick = () => this.switchTab('genetics')
    
    tabsContainer.appendChild(statsTab)
    tabsContainer.appendChild(geneticsTab)
    
    // Create content container
    const contentContainer = document.createElement('div')
    contentContainer.id = 'organism-content'
    contentContainer.style.padding = '0 10px 10px 10px'
    
    info.appendChild(tabsContainer)
    info.appendChild(contentContainer)
    document.body.appendChild(info)
    
    // Set default active tab only for new panels
    this.activeTab = 'stats'
    
    // Store current organism UUID to detect organism changes
    infoElement = info
    infoElement.setAttribute('data-organism-uuid', this.uuid.toString())
  } else {
    // Check if this is a different organism
    const currentUuid = infoElement.getAttribute('data-organism-uuid')
    if (currentUuid !== this.uuid.toString()) {
      // Different organism selected - reset to stats tab
      this.activeTab = 'stats'
      infoElement.setAttribute('data-organism-uuid', this.uuid.toString())
      this.updateTabStyles()
    }
  }
  
  // Update content based on active tab
  this.updateInfoContent()
}

public switchTab(tabName: string) {
  this.activeTab = tabName
  this.updateTabStyles()
  this.updateInfoContent()
}

private updateTabStyles() {
  const statsTab = document.getElementById('stats-tab')
  const geneticsTab = document.getElementById('genetics-tab')
  
  if (this.activeTab === 'stats') {
    if (statsTab) {
      statsTab.style.background = 'rgba(255,255,255,0.2)'
      statsTab.style.color = 'white'
    }
    if (geneticsTab) {
      geneticsTab.style.background = 'rgba(255,255,255,0.1)'
      geneticsTab.style.color = '#aaa'
    }
  } else {
    if (geneticsTab) {
      geneticsTab.style.background = 'rgba(255,255,255,0.2)'
      geneticsTab.style.color = 'white'
    }
    if (statsTab) {
      statsTab.style.background = 'rgba(255,255,255,0.1)'
      statsTab.style.color = '#aaa'
    }
  }
}

public updateInfoContent() {
  const contentContainer = document.getElementById('organism-content')
  if (!contentContainer) return
  
  if (this.activeTab === 'stats') {
    this.displayStatsContent(contentContainer)
  } else if (this.activeTab === 'genetics') {
    this.displayGeneticsContent(contentContainer)
  }
}

private displayStatsContent(container: HTMLElement) {
  // Calculate some dynamic stats
  const energyPercent = Math.round((this.energy / this.reproduceAt) * 100)
  const agePercent = Math.round((this.age / this.maxAge) * 100)
  
  // Format age to match world display (divide by 100)
  const ageInWorldUnits = (this.age / 100).toFixed(1)
  const maxAgeInWorldUnits = (this.maxAge / 100).toFixed(1)
  
  // Get body part composition
  const bodyTypes: {[key: string]: number} = {}
  for (const body of this.body.bodies) {
    const bodyType = parseInt(body.label.split(':')[1], 10)
    const typeName = getGeneTypeName(bodyType)
    bodyTypes[typeName] = (bodyTypes[typeName] || 0) + 1
  }
  
  const bodyComposition = Object.entries(bodyTypes)
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ')
  
  // Check infection status
  const infectionStatus = this.infection ? '🦠 Infected' : '✅ Healthy'
  
  // Get genome information
  const genomeGeneCount = this.genome.genes.length
  const symmetry = this.genome.symmetry
  
  // Different info display for alive vs dead organisms
  if (this.isAlive) {
    container.innerHTML = `
      <strong>🔍 Organism #${this.uuid}</strong><br>
      <strong>Energy:</strong> ${Math.round(this.energy)} (${energyPercent}%)<br>
      <strong>Age:</strong> ${ageInWorldUnits} / ${maxAgeInWorldUnits} (${agePercent}%)<br>
      <strong>Status:</strong> 💚 Alive<br>
      <strong>Body Size:</strong> ${Math.round(this.bodySize)}<br>
      <strong>Infection:</strong> ${infectionStatus}<br>
      <strong>Parent:</strong> #${this.parentUuid || 'None'}<br>
      <strong>Generation:</strong> ${this.generation}<br>
      <strong>Children:</strong> ${this.totalChildren}<br>
      <strong>Genes:</strong> ${genomeGeneCount} (${symmetry}x symmetry)<br>
      <strong>Body Parts:</strong> ${this.body.bodies.length}<br>
      <strong>Colors:</strong> ${bodyComposition}<br>
    `
  } else {
    const deathCause = this.energy <= 0 ? 'Energy depletion' : 'Old age'
    container.innerHTML = `
      <strong>💀 Dead Organism #${this.uuid}</strong><br>
      <strong>Death Cause:</strong> ${deathCause}<br>
      <strong>Final Energy:</strong> ${Math.round(this.energy)}<br>
      <strong>Death Age:</strong> ${ageInWorldUnits} / ${maxAgeInWorldUnits} (${agePercent}%)<br>
      <strong>Status:</strong> 💀 Dead<br>
      <strong>Body Size:</strong> ${Math.round(this.bodySize)}<br>
      <strong>Infection:</strong> ${infectionStatus}<br>
      <strong>Parent:</strong> #${this.parentUuid || 'None'}<br>
      <strong>Generation:</strong> ${this.generation}<br>
      <strong>Children:</strong> ${this.totalChildren}<br>
      <strong>Genes:</strong> ${genomeGeneCount} (${symmetry}x symmetry)<br>
      <strong>Body Parts:</strong> ${this.body.bodies.length}<br>
      <strong>Colors:</strong> ${bodyComposition}<br>
    `
  }
}

private displayGeneticsContent(container: HTMLElement) {
  const genomeGeneCount = this.genome.genes.length
  const symmetry = this.genome.symmetry
  
  let geneticsHtml = `
    <strong>🧬 Genetic Code #${this.uuid}</strong><br>
    <strong>Total Genes:</strong> ${genomeGeneCount}<br>
    <strong>Symmetry:</strong> ${symmetry}x<br>
    <strong>Total Body Parts:</strong> ${genomeGeneCount * symmetry}<br><br>
  `
  
  // Display each gene in detail
  this.genome.genes.forEach((gene, index) => {
    const typeName = getGeneTypeName(gene.type)
    const color = getGeneTypeColor(gene.type)
    
    geneticsHtml += `
      <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 3px;">
        <strong>Gene ${index + 1}:</strong> <span style="color: ${color}">●</span> ${typeName}<br>
        <strong>Position:</strong> (${gene.x.toFixed(1)}, ${gene.y.toFixed(1)})<br>
        <strong>Shape:</strong> ${gene.sides} sides<br>
        <strong>Size:</strong> radius=${gene.radius.toFixed(1)}, width=${gene.width.toFixed(1)}<br>
        <strong>Connection:</strong> ${gene.isBranch ? 'Branch to center' : 'Sequential'}<br>
        <strong>Length:</strong> ${gene.length ? gene.length.toFixed(1) : 'MISSING'}<br>
      </div>
    `
  })
  
  if (this.infection) {
    geneticsHtml += `<br><strong style="color: #ff6666;">🦠 INFECTION GENOME:</strong><br>`
    geneticsHtml += `<strong>Infection Genes:</strong> ${this.infection.genes.length}<br>`
    
    this.infection.genes.forEach((gene, index) => {
      const typeName = getGeneTypeName(gene.type)
      const color = getGeneTypeColor(gene.type)
      
      geneticsHtml += `
        <div style="margin-bottom: 8px; padding: 6px; background: rgba(255,100,100,0.1); border-radius: 3px;">
          <strong>Infection Gene ${index + 1}:</strong> <span style="color: ${color}">●</span> ${typeName}<br>
          <small>Pos: (${gene.x.toFixed(1)}, ${gene.y.toFixed(1)}), ${gene.sides} sides, R=${gene.radius.toFixed(1)}</small>
        </div>
      `
    })
  }
  
  container.innerHTML = geneticsHtml
}

  public update() {
    this.age += 1
    this.healthCheck()
    if (this.isAlive) {
      this.move()
      this.synthesize()
      this.respirate()
      this.reproduce()
      this.magneticAttraction()
    } else {
      this.respirate()
    }
  }

  public absorb(area : number, victim : Organism) {
    const energyDrain = victim.energy > area * 4 ? area * 4 : victim.energy

    victim.energy -= energyDrain
    this.energy += energyDrain * .9
    this.database.world.releaseCO2(energyDrain * .1)
  }

  public die() {
    if (!this.isAlive) {
      return
    }
    this.isAlive = false
    this.database.organisms.alive -= 1
    this.database.organisms.dead += 1
    
    // Update gene frequencies to reflect death
    const genes = this.getGeneFrequency()
    for (const gene of genes) {
      // Decrease count for the original gene type
      this.database.frequency.geneFrequencies[gene] -= 1
      // Increase count for DEAD type
      this.database.frequency.geneFrequencies[BodyType.DEAD] += 1
    }
    
    for (const body of this.body.bodies) {
      // Update visual appearance
      body.render.strokeStyle = Color.DEAD
      body.label = `${this.uuid}:${BodyType.DEAD}`
    }
  }

  public flee(body : Matter.Body, self : Matter.Vector, other : Matter.Vector, speed = 10) {
    const x = self.x - other.x
    const y = self.y - other.y
    const xRatio = x / (Math.abs(x) + Math.abs(y))
    const yRatio = y / (Math.abs(x) + Math.abs(y))
    const xVel = xRatio * speed
    const yVel = yRatio * speed
    Matter.Body.setVelocity(body, { x: xVel, y: yVel })
  }

  public stop(body : Matter.Body) {
    Matter.Body.setVelocity(body, { x: 0, y: 0  })
  }

  public harden(bark : Matter.Body) { 
    bark.label = `${this.uuid}:${BodyType.DEAD_BARK}`
    bark.render.strokeStyle = Color.DEAD_BARK
    this.synthesizers -= (bark.area * 0.8)
  }

  public infect(org : Organism) {
    org.infection = this.genome
    this.respirate()
  }

  protected healthCheck() {
    const criticalEnergyThreshold = this.reproduceAt * 0.1
    
    if (this.energy <= 0) {
      Matter.World.remove(this.world, this.body)
      this.database.world.releaseCO2(this.energy)
      this.database.organisms.deleteOrganism(this.uuid, this.database)
    } else if (this.energy <= criticalEnergyThreshold) {
      this.die()
    } else if (this.age > this.maxAge) {
      this.die()
    }
  }

  protected reproduce() {
    if (this.energy > this.reproduceAt) {
      const offspringEnergy = this.reproduceAt / (this.broodSize + 1)
      for (let i = 0; i < this.broodSize; i += 1) {
        const genome = this.infection && rngBool() ? this.infection : this.genome
        this.infection = null
        this.energy -= offspringEnergy
        this.database.organisms.addOrganism(
          new Organism(
            this.body.bodies[0].position.x + rngFloat(-10, 10),
            this.body.bodies[0].position.y + rngFloat(-10, 10),
            this.world,
            genome.replicate(),
            offspringEnergy,
            this,
            this.database), this.database)
        
        // Increment total children counter
        this.totalChildren += 1
      }
    }
  }

  protected synthesize() {
    const newEnergy = (this.synthesizers / 5) * this.database.world.co2Fraction * this.photosynthesisMultiplier
    this.database.world.consumeCO2(newEnergy)
    this.energy += newEnergy
    // Reset multiplier after each tick
    this.photosynthesisMultiplier = 1.0
  }

  protected respirate() {
    let energyLoss = 0
    
    // Calculate respiration cost based on each body part's gene type
    for (const body of this.body.bodies) {
      const genotype = parseInt(body.label.split(':')[1], 10)
      const respirationCost = getGeneRespirationCost(genotype)
      const bodyPartCost = (body.area * respirationCost) / 500
      
      if (this.isAlive) {
        energyLoss += bodyPartCost / (this.database.world.o2Fraction + 1)
      } else {
        energyLoss += bodyPartCost * 5 // Dead organisms respire faster
      }
    }
    
    // Cap energy loss to prevent going below zero
    const actualEnergyLoss = Math.min(energyLoss, this.energy)
    this.database.world.releaseCO2(actualEnergyLoss)
    this.energy -= actualEnergyLoss
  }

  protected move() : void {
    // Fast movement bodies (index 0)
    for (const moveable of this.moveables[0]) {
      const genotype = parseInt(moveable.label.split(':')[1], 10)
      const speed = getGeneMovementSpeed(genotype) || 10 // Default to 10 if not set
      this.moveBodyPart(moveable, speed)
    }
    // Slow movement bodies (index 1) 
    for (const moveable of this.moveables[1]) {
      const genotype = parseInt(moveable.label.split(':')[1], 10)
      const speed = getGeneMovementSpeed(genotype) || 3 // Default to 3 if not set
      this.moveBodyPart(moveable, speed)
    }
  }

  protected moveBodyPart(moveable : Matter.Body, speed : number) {
    const moves = Math.random()
    if (moves < .95) {
      return
    }
    const vx = rngFloat(-speed, speed)
    const vy = rngFloat(-speed, speed)
    Matter.Body.setVelocity(moveable, { x: vx, y: vy })
  }

  protected magneticAttraction() {
    // Find all body parts with magnetic attraction trait
    const magneticParts = this.body.bodies.filter(body => {
      const bodyType = parseInt(body.label.split(':')[1], 10)
      return hasGeneMagneticAttraction(bodyType)
    })

    if (magneticParts.length === 0) return

    // Get all organisms in the database
    const allOrganisms = this.database.organisms.organisms
    const attractionRadius = 60 // pixels - even smaller radius
    const baseForce = 0.001 // Extremely weak base force
    
    // Calculate attraction strength based on energy (more energy = stronger attraction)
    const attractionStrength = baseForce * (this.energy / 5000) // Much reduced energy scaling

    for (const magneticPart of magneticParts) {
      const magneticPos = magneticPart.position

      // Attract nearby organisms
      for (const uuid in allOrganisms) {
        const targetOrg = allOrganisms[uuid]
        
        // Don't attract self or dead organisms
        if (targetOrg.uuid === this.uuid || !targetOrg.isAlive) continue

        // Check each body part of the target organism
        for (const targetBody of targetOrg.body.bodies) {
          const distance = Matter.Vector.magnitude(
            Matter.Vector.sub(targetBody.position, magneticPos)
          )

          // Only attract within radius, with minimum distance to prevent extreme forces
          if (distance < attractionRadius && distance > 20) {
            // Calculate attraction force (stronger when closer, weaker when farther)
            const force = attractionStrength * (attractionRadius - distance) / attractionRadius
            
            // Cap the maximum force to prevent excessive speeds
            const maxForce = 0.01 // Much lower force cap
            const cappedForce = Math.min(force, maxForce)
            
            // Calculate direction vector from target to magnetic part
            const direction = Matter.Vector.normalise(
              Matter.Vector.sub(magneticPos, targetBody.position)
            )

            // Apply attraction force
            const attractionForce = Matter.Vector.mult(direction, cappedForce)
            Matter.Body.applyForce(targetBody, targetBody.position, attractionForce)
          }
        }
      }
      
      // Magnetic parts consume energy for magnetic field (higher cost to balance benefits)
      this.energy -= 0.2 * magneticParts.length
    }
  }

  public getGeneFrequency() : number[] {
    const geneFreqency: number[] = []
    for (const gene of this.genome.genes) {
      for (let i = 0; i < this.genome.symmetry; i++) {
        geneFreqency.push(gene.type)
      }
    }
    return geneFreqency
  }

  public highlightOrganism() {
    // Add thick outline while keeping original color
    for (const body of this.body.bodies) {
      body.render.lineWidth = 4 // Thick border for selection
      // Keep the original color - no need to change strokeStyle
    }
  }
  
  public clearHighlight() {
    // Reset to original line width
    for (const body of this.body.bodies) {
      body.render.lineWidth = 1 // Reset to thin border
      // Color stays the same - no need to restore
    }
  }
}

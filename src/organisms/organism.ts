import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { rngFloat, rngBool } from '../utilities/random'
import Color from '../constants/color'
import { getGenePhotosynthesis, getGeneMovementSpeed, getGeneMovementType, getGeneReproductionBonus, hasGeneMagneticAttraction, getGeneRespirationCost } from '../constants/gene_types'

export default class Organism {
  protected body : Matter.Composite
  protected database : Database
  protected world : Matter.World
  protected genome : Genome
  protected moveables : Matter.Body[][]
  protected synthesizers : number
  protected bodySize : number
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

      this.bodySize += body.area
    }
    this.reproduceAt = this.bodySize * 10
    this.reproduceAt = Math.max(this.reproduceAt - yellowArea, this.reproduceAt / 2)

    this.broodSize = 1 + Math.ceil(yellowArea * 5 / this.bodySize)
    this.totalChildren = 0

    this.age = 0
    this.maxAge = this.bodySize * 10
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
    for (const body of this.body.bodies) {
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
    const newEnergy = (this.synthesizers / 5) * this.database.world.co2Fraction
    this.database.world.consumeCO2(newEnergy)
    this.energy += newEnergy
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
    
    this.database.world.releaseCO2(energyLoss)
    this.energy -= energyLoss
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
}

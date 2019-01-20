import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { rngFloat, rngBool } from '../utilities/random'
import Color from '../constants/color'

export default class Organism {
  protected body : Matter.Composite
  protected database : Database
  protected world : Matter.World
  protected genome : Genome
  protected moveables : Matter.Body[][]
  protected synthesizers : number
  protected bodySize : number
  protected reproduceAt : number
  public energy : number
  public uuid : number
  public age : number
  public maxAge : number
  public isAlive : boolean
  public parentUuid : number
  public broodSize : number
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
    this.infection = null
    // CYAN, INDIGO
    this.moveables = [[], []]
    this.synthesizers = 0
    this.bodySize = 100
    let yellowArea = 0
    for (const body of this.body.bodies) {
      const genotype : number = parseInt(body.label.split(':')[1], 10)
      if (genotype === BodyType.CYAN) {
        this.moveables[0].push(body)
      } else if (genotype === BodyType.INDIGO) {
        this.moveables[1].push(body)
      } else if (genotype === BodyType.GREEN) {
        this.synthesizers += body.area
      } else if (genotype === BodyType.BARK) {
        this.synthesizers += (body.area * 0.8)
      } else if (genotype === BodyType.YELLOW) {
        yellowArea += body.area
      }

      this.bodySize += body.area
    }
    this.reproduceAt = this.bodySize * 10
    this.reproduceAt = Math.max(this.reproduceAt - yellowArea, this.reproduceAt / 2)

    this.broodSize = 1 + Math.ceil(yellowArea * 5 / this.bodySize)

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
    if (this.energy <= 0) {
      Matter.World.remove(this.world, this.body)
      this.database.world.releaseCO2(this.energy)
      this.database.organisms.deleteOrganism(this.uuid)
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
            this.database))
      }
    }
  }

  protected synthesize() {
    const newEnergy = (this.synthesizers / 5) * this.database.world.co2Fraction
    this.database.world.consumeCO2(newEnergy)
    this.energy += newEnergy
  }

  protected respirate() {
    let energyLoss = this.isAlive ? this.bodySize / 500 : this.bodySize / 100
    if (this.isAlive) {
      energyLoss = energyLoss / (this.database.world.o2Fraction + 1)
    }
    this.database.world.releaseCO2(energyLoss)
    this.energy -= energyLoss
  }

  protected move() : void {
    for (const moveable of this.moveables[0]) {
      this.moveBodyPart(moveable, 10)
    }
    for (const moveable of this.moveables[1]) {
      this.moveBodyPart(moveable, 3)
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
}

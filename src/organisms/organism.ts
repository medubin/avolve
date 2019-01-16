import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { rngFloat } from '../utilities/random'
import Color from '../constants/color'

export default class Organism {
  protected body : Matter.Composite
  protected database : Database
  protected world : Matter.World
  protected genome : Genome
  protected moveables : Matter.Body[]
  protected synthesizers : number
  protected bodySize : number
  protected reproduceAt : number
  protected energy : number
  public uuid : number
  public age : number
  public maxAge : number
  public isAlive : boolean
  public parentUuid : number
  public broodSize : number
  public repellent : number

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

    this.moveables = []
    this.synthesizers = 0
    this.bodySize = 100
    this.repellent = 0
    let yellowArea = 0
    for (const body of this.body.bodies) {
      const genotype : number = parseInt(body.label.split(':')[1], 10)
      if (genotype === BodyType.CYAN) {
        this.moveables.push(body)
      } else if (genotype === BodyType.GREEN) {
        this.synthesizers += body.area
      } else if (genotype === BodyType.YELLOW) {
        yellowArea += body.area
      } else if (genotype === BodyType.BLUE) {
        this.repellent += body.area
      }

      this.bodySize += body.area
    }
    this.reproduceAt = this.bodySize * 10
    this.reproduceAt = Math.max(this.reproduceAt - yellowArea, this.reproduceAt / 2)

    this.broodSize = 1 + Math.ceil(yellowArea * 5 / this.bodySize)

    this.age = 0
    this.maxAge = this.bodySize * 10
  }

  public update(database : Database) {
    this.age += 1
    this.healthCheck(database)
    if (this.isAlive) {
      this.move()
      this.synthesize(database)
      this.respirate(database)
      this.reproduce(database)
    } else {
      this.respirate(database)
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

  public reverse(vX : number, vY : number) {
    let x = -vX * (this.repellent / 10)
    let y = -vY * (this.repellent / 10)
    x = Math.abs(x) > 10 ? 10 * (x / Math.abs(x)) : x
    y = Math.abs(y) > 10 ? 10 * (y / Math.abs(y)) : y
    Matter.Body.setVelocity(this.body.bodies[0], { x, y })
  }

  protected healthCheck(database : Database) {
    if (this.energy <= 0) {
      Matter.World.remove(this.world, this.body)
      database.world.releaseCO2(this.energy)
      database.organisms.deleteOrganism(this.uuid)
    } else if (this.age > this.maxAge) {
      this.die()
    }
  }

  protected reproduce(database: Database) {
    if (this.energy > this.reproduceAt) {
      const offspringEnergy = this.reproduceAt / (this.broodSize + 1)
      for (let i = 0; i < this.broodSize; i += 1) {
        this.energy -= offspringEnergy
        database.organisms.addOrganism(
          new Organism(
            this.body.bodies[0].position.x + rngFloat(-10, 10),
            this.body.bodies[0].position.y + rngFloat(-10, 10),
            this.world,
            this.genome.replicate(),
            offspringEnergy,
            this,
            database))
      }
    }
  }

  protected synthesize(database : Database) {
    const newEnergy = (this.synthesizers / 5) * database.world.co2Fraction
    database.world.consumeCO2(newEnergy)
    this.energy += newEnergy
  }

  protected respirate(database : Database) {
    let energyLoss = this.isAlive ? this.bodySize / 500 : this.bodySize / 100
    if (this.isAlive) {
      energyLoss = energyLoss / (database.world.o2Fraction + 1)
    }
    database.world.releaseCO2(energyLoss)
    this.energy -= energyLoss
  }

  protected move() : void {
    for (const moveable of this.moveables) {
      const moves = Math.random()
      if (moves < .95) {
        continue
      }
      const vx = rngFloat(-10, 10)
      const vy = rngFloat(-10, 10)
      Matter.Body.setVelocity(moveable, { x: vx, y: vy })
    }
  }
}

import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { rngFloat } from '../utilities/random'

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

  constructor(
    x : number,
    y : number,
    world : Matter.World,
    genome : Genome,
    energy : number,
    database : Database,
    ) {
    this.database = database
    this.world = world
    this.genome = genome
    this.energy = energy
    this.uuid = database.organisms.newUuid
    this.body = this.genome.createBody(x, y, this.uuid)
    Matter.World.add(world, this.body)

    this.moveables = []
    this.synthesizers = 0
    this.bodySize = 0
    for (const idx in this.body.bodies) {
      const gene = this.genome.genes[idx]
      const body = this.body.bodies[idx]
      if (gene.type === BodyType.CYAN) {
        this.moveables.push(body)
      }
      if (gene.type === BodyType.GREEN) {
        this.synthesizers += body.area
      }
      this.bodySize += body.area
    }
    this.reproduceAt = this.bodySize * 10

    this.age = 0
    this.maxAge = this.bodySize * 10
  }

  public update(database : Database) {
    this.age += 1
    this.healthCheck(database)
    this.move()
    this.synthesize(database)
    this.respirate(database)
    this.reproduce(database)
  }

  public absorb(area : number, victim : Organism) {
    const energyDrain = victim.energy > area ? area : victim.energy

    victim.energy -= energyDrain
    this.energy += energyDrain * .9
    this.database.world.releaseCO2(energyDrain * .1)
  }

  protected healthCheck(database : Database) {
    if (this.energy <= 0 || this.age > this.maxAge) {
      Matter.World.remove(this.world, this.body)
      database.world.releaseCO2(this.energy)
      database.organisms.deleteOrganism(this.uuid)
    }
  }

  protected reproduce(database: Database) {
    if (this.energy > this.reproduceAt) {
      const offspringEnergy = this.reproduceAt / 2
      this.energy -= offspringEnergy
      database.organisms.addOrganism(
        new Organism(
          this.body.bodies[0].position.x + rngFloat(-2, 2),
          this.body.bodies[0].position.y + rngFloat(-2, 2),
          this.world,
          this.genome.replicate(),
          offspringEnergy,
          database))
    }
  }

  protected synthesize(database : Database) {
    const newEnergy = (this.synthesizers / 5) * database.world.fraction
    database.world.consumeCO2(newEnergy)
    this.energy += newEnergy
  }

  protected respirate(database : Database) {
    const energyLoss = this.bodySize / 100
    database.world.releaseCO2(energyLoss)
    this.energy -= energyLoss
  }

  protected move() : void {
    for (const moveable of this.moveables) {
      const moves = Math.random()
      if (moves < .99) {
        continue
      }
      const vx = (Math.random() - .5) * 10
      const vy = (Math.random() - .5) * 10
      Matter.Body.setVelocity(moveable, { x: vx, y: vy })
    }
  }
}

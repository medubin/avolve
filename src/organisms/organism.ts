import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'
import Database from '../databases/database'

export default class Organism {
  protected body : Matter.Composite
  protected world : Matter.World
  protected genome : Genome
  protected moveables : Matter.Body[]
  protected synthesizers : number
  protected bodySize : number
  protected reproduceAt : number
  protected energy : number
  public uuid : number

  constructor(x : number, y : number, world : Matter.World, genome : Genome) {
    this.world = world
    this.genome = genome
    this.body = this.genome.createBody(x, y)
    Matter.World.add(world, this.body)

    this.moveables = []
    this.synthesizers = 0
    this.bodySize = 0
    for (const body of this.body.bodies) {
      if (body.label === BodyType.CYAN.toString()) {
        this.moveables.push(body)
      }
      if (body.label === BodyType.GREEN.toString()) {
        this.synthesizers += body.area
      }
      this.bodySize += body.area
    }
    this.reproduceAt = this.bodySize * 10
    this.energy = this.bodySize
  }

  public update(database : Database) {
    this.move()
    this.synthesize()
    this.respirate()
    this.reproduce(database)
    this.healthCheck(database)
  }

  protected healthCheck(database : Database) {
    if (this.energy < 0) {
      Matter.World.remove(this.world, this.body)
      database.organisms.deleteOrganism(this.uuid)
    }
  }

  protected reproduce(database: Database) {
    if (this.energy > this.reproduceAt) {
      this.energy -= (this.reproduceAt / 2)
      database.organisms.addOrganism(
        new Organism(
          this.body.bodies[0].position.x,
          this.body.bodies[0].position.y,
          this.world,
          this.genome.replicate()))
    }
  }

  protected synthesize() {
    this.energy += this.synthesizers / 5
  }

  protected respirate() {
    this.energy -= this.bodySize / 10
  }

  protected move() : void {
    for (const moveable of this.moveables) {
      const moves = Math.random()
      if (moves < .99) {
        continue
      }
      const vx = (Math.random() - .5) * .5
      const vy = (Math.random() - .5) * .5
      Matter.Body.setVelocity(moveable, { x: vx, y: vy })
    }
  }
}

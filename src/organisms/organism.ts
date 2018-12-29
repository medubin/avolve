import * as Matter from 'matter-js'
import Genome from './genome'
import BodyType from '../constants/body_type'

export default class Organism {
  // public body : Matter.Body
  public body : Matter.Composite
  public genome : Genome
  public moveables : Matter.Body[]

  constructor(x : number, y : number, world : Matter.World) {
    this.genome = Genome.random()
    this.body = this.genome.createBody(x, y)
    Matter.World.add(world, this.body)

    this.moveables = []
    for (const body of this.body.bodies) {
      if (body.label === BodyType.CYAN.toString()) {
        this.moveables.push(body)
      }
    }
  }

  public move() : void {
    for (const moveable of this.moveables) {
      const moves = Math.random()
      if (moves < .99) {
        continue
      }
      const vx = (Math.random() - .5) * 1
      const vy = (Math.random() - .5) * 1
      Matter.Body.setVelocity(moveable, { x: vx, y: vy })
    }
  }
}

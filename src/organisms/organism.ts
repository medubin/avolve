import * as Matter from 'matter-js'

export default class Organism {
  public body : Matter.Body

  constructor(x : number, y : number, world : Matter.World) {
    this.body = Matter.Bodies.circle(x, y, 30)
    Matter.World.add(world, this.body)
  }
}

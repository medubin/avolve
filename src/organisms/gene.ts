import { rng } from '../utilities/random'
import * as Matter from 'matter-js'
import BodyType from '../constants/body_type'

export default class Gene {
  public type : number
  public x : number
  public y : number
  public sides : number
  public radius : number

  public static random() : Gene {
    const gene = new Gene()
    gene.type = rng(0, 1)
    gene.x = rng(-100, 100) / 10
    gene.y = rng(-100, 100) / 10
    gene.sides = rng(3, 9)
    gene.radius = rng(1, 100) / 10
    return gene
  }

  public createBodyPart(x : number, y : number) : Matter.Body {
    const options = {
      label: this.type.toString(),
      // frictionAir: 0.8,
      render: { strokeStyle: this.getBodyColor(this.type), fillStyle: 'transparent', lineWidth: 1 },
    }
    return  Matter.Bodies.polygon(x + this.x, y + this.y, this.sides, this.radius, options)
  }

  protected rng(min : number, max : number) : number {
    return Math.floor(Math.random() * (max - min) + min)
  }

  protected getBodyColor(bodyType : number) : string {
    switch (bodyType){
      case(BodyType.GREEN):
        return '#7CFC00'
      case(BodyType.BLUE):
        return '#0000CD'
      case(BodyType.RED):
        return '#FF0000'
      case(BodyType.CYAN):
        return '#00FFFF'
    }
  }
}

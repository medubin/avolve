import { rng, rngFloat } from '../utilities/random'
import * as Matter from 'matter-js'
import BodyType from '../constants/body_type'

export default class Gene {
  public type : number
  public x : number
  public y : number
  public sides : number
  public radius : number
  public isBranch : boolean
  public length : number

  public static random() : Gene {
    const gene = new Gene()
    gene.type = rng(1, 8)
    gene.x = rng(-100, 100) / 10
    gene.y = rng(-100, 100) / 10
    gene.sides = rng(3, 9)
    gene.radius = rngFloat(3, 15)
    gene.isBranch = Math.random() > .5
    gene.length = rngFloat(8, 12)
    return gene
  }

  public createBodyPart(x : number, y : number, uuid : number) : Matter.Body {
    const options = {
      label: `${uuid}:${this.type}`,
      // frictionAir: .01,
      render: { strokeStyle: this.getBodyColor(this.type), fillStyle: 'transparent', lineWidth: 1 },
    }
    const body = Matter.Bodies.polygon(x + this.x, y + this.y, this.sides, this.radius, options)
    body.friction = 1
    body.restitution = 0
    return body
  }

  public replicate(mutationRate : number = .05) : Gene {
    const gene = new Gene()
    gene.type = this.type
    gene.x = this.x
    gene.y = this.y
    gene.sides = this.sides
    gene.radius = this.radius
    gene.isBranch = this.isBranch
    if (Math.random() < mutationRate) {
      return this.mutate(gene)
    }
    return gene
  }

  protected mutate(gene : Gene) : Gene {
    const mutation = rng(0, 7)
    switch (mutation) {
      case(0):
        gene.type = rng(1, 8)
        return gene
      case(1):
        gene.x = rng(-100, 100) / 10
        return gene
      case(2):
        gene.y = rng(-100, 100) / 10
        return gene
      case(3):
        gene.sides = rng(3, 9)
        return gene
      case(4):
        gene.radius = rngFloat(3, 15)
        return gene
      case(5):
        gene.isBranch = Math.random() > .5
        return gene
      case(6):
        gene.length = rngFloat(8, 12)
        return gene
    }
  }

  protected getBodyColor(bodyType : number) : string {
    switch (bodyType){
      case(BodyType.GREEN):
        return '#7CFC00'
      case(BodyType.BLUE):
        return '#0000CD'
      case(BodyType.MAROON):
        return '#5D0F0D'
      case(BodyType.CYAN):
        return '#00FFFF'
      case(BodyType.GRAY):
        return '#808080'
      case(BodyType.YELLOW):
        return '#FFFF00'
      case(BodyType.RED):
        return '#FF0000'
    }
  }
}

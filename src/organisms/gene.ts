import { rng, rngFloat, rngBool } from '../utilities/random'
import * as Matter from 'matter-js'
import BodyType from '../constants/body_type'
import Color from '../constants/color'

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
    gene.type = rng(2, 16)
    gene.x = rng(-100, 100) / 10
    gene.y = rng(-100, 100) / 10
    gene.sides = rng(3, 9)
    gene.radius = rngFloat(3, 15)
    gene.isBranch = rngBool()
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

  public replicate(mutationRate : number = .1) : Gene {
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
        gene.type = rng(2, 16)
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
        gene.isBranch = rngBool()
        return gene
      case(6):
        gene.length = rngFloat(8, 12)
        return gene
    }
  }

  protected getBodyColor(bodyType : number) : string {
    switch (bodyType){
      case(BodyType.GREEN):
        return Color.GREEN
      case(BodyType.BLUE):
        return Color.BLUE
      case(BodyType.MAROON):
        return Color.MAROON
      case(BodyType.CYAN):
        return Color.CYAN
      case(BodyType.GRAY):
        return Color.GRAY
      case(BodyType.YELLOW):
        return Color.YELLOW
      case(BodyType.RED):
        return Color.RED
      case(BodyType.ORANGE):
        return Color.ORANGE
      case(BodyType.TEAL):
        return Color.TEAL
      case(BodyType.BARK):
        return Color.BARK
      case(BodyType.DEAD_BARK):
        return Color.DEAD_BARK
      case(BodyType.SKY):
        return Color.SKY
      case(BodyType.INDIGO):
        return Color.INDIGO
      case(BodyType.WHITE):
        return Color.WHITE
      case(BodyType.PINK):
        return Color.PINK
    }
  }
}

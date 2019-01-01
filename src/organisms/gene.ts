import { rng } from '../utilities/random'
import * as Matter from 'matter-js'
import BodyType from '../constants/body_type'

export default class Gene {
  public type : number
  public x : number
  public y : number
  public sides : number
  public radius : number
  public isBranch : boolean

  public static random() : Gene {
    const gene = new Gene()
    gene.type = rng(1, 5)
    gene.x = rng(-100, 100) / 10
    gene.y = rng(-100, 100) / 10
    gene.sides = rng(3, 9)
    gene.radius = rng(30, 100) / 10
    gene.isBranch = Math.random() > .5
    return gene
  }

  public createBodyPart(x : number, y : number, uuid : number) : Matter.Body {
    const options = {
      label: `${uuid}:${this.type}` ,
      // frictionAir: 0.8,
      render: { strokeStyle: this.getBodyColor(this.type), fillStyle: 'transparent', lineWidth: 1 },
    }
    return  Matter.Bodies.polygon(x + this.x, y + this.y, this.sides, this.radius, options)
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
    const mutation = rng(0, 6)
    switch (mutation) {
      case(0):
        gene.type = rng(0, 4)
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
        gene.radius = rng(30, 100) / 10
        return gene
      case(5):
        gene.isBranch = Math.random() > .5
        return gene
    }
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

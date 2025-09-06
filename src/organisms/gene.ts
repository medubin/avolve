import { rng, rngFloat, rngBool } from '../utilities/random'
import * as Matter from 'matter-js'
import Organism from '../parameters/organism_parameters'
import { PLAYABLE_GENE_TYPES, getGeneTypeColor } from '../constants/gene_types'

export default class Gene {
  public type : number
  public x : number
  public y : number
  public sides : number
  public radius : number
  public width : number
  public isBranch : boolean
  public length : number

  public static random() : Gene {
    const gene = new Gene()
    // Use dynamic range based on playable gene types (excludes DEAD types)
    const playableTypes = PLAYABLE_GENE_TYPES.map(g => g.id)
    const randomIndex = rng(0, playableTypes.length)
    gene.type = playableTypes[randomIndex]
    gene.x = rng(-100, 100) / 10
    gene.y = rng(-100, 100) / 10
    gene.sides = rng(2, 7)
    gene.radius = rngFloat(3, 15)
    gene.width = rngFloat(3, 15)
    gene.isBranch = rngBool()
    gene.length = rngFloat(8, 12)
    return gene
  }

  public createBodyPart(x : number, y : number, uuid : number) : Matter.Body {
    const options = {
      label: `${uuid}:${this.type}`,
      // frictionAir: .01,
      render: { strokeStyle: getGeneTypeColor(this.type), fillStyle: 'transparent', lineWidth: 1 },
    }
    
    let body: Matter.Body
    if (this.sides === 4) {
      // Use rectangle for 4-sided body parts
      body = Matter.Bodies.rectangle(x + this.x, y + this.y, this.width * 2, this.radius * 2, options)
    } else {
      // Use polygon for other sided body parts (circles for sides < 3)
      body = Matter.Bodies.polygon(x + this.x, y + this.y, this.sides, this.radius, options)
    }
    
    body.friction = 1
    body.restitution = 0
    return body
  }

  public replicate(mutationRate : number = Organism.MUTATION_RATE) : Gene {
    const gene = new Gene()
    gene.type = this.type
    gene.x = this.x
    gene.y = this.y
    gene.sides = this.sides
    gene.radius = this.radius
    gene.width = this.width
    gene.isBranch = this.isBranch
    gene.length = this.length
    if (Math.random() < mutationRate) {
      return this.mutate(gene)
    }
    return gene
  }

  protected mutate(gene : Gene) : Gene {
    if (rngBool()) {
        const playableTypes = PLAYABLE_GENE_TYPES.map(g => g.id)
        gene.type = playableTypes[rng(0, playableTypes.length)]
        return gene
    }
      if (rngBool()) {
        gene.x = rng(-100, 100) / 10
        return gene
      }
      if (rngBool()) {
        gene.y = rng(-100, 100) / 10
        return gene
      }
      if (rngBool()) {
        gene.sides = rng(2, 7)
        return gene
      }
      if (rngBool()) {
        gene.radius = rngFloat(3, 15)
        return gene
      }
      if (rngBool()) {
        gene.width = rngFloat(3, 15)
        return gene
      }
      if (rngBool()) {
        gene.isBranch = rngBool()
        return gene
      }
      if (rngBool()) {
        gene.length = rngFloat(8, 12)
        return gene
    }
  }
}

import Gene from './gene'
import { rng } from '../utilities/random'
import * as Matter from 'matter-js'

export default class Genome {
  public genes : Gene[]

  public static random() : Genome {
    const genome = new Genome()
    const genes = []
    for (let i = rng(1, 10); i > 0; i -= 1) {
      genes.push(Gene.random())
    }
    genome.genes = genes
    return genome
  }

  public replicate(mutationRate : number = .05) : Genome {
    const genome = new Genome()
    const newGenes = []
    for (const gene of this.genes) {
      newGenes.push(gene.replicate(mutationRate))
    }
    genome.genes = newGenes
    if (Math.random() < mutationRate) {
      return this.mutate(genome)
    }
    return genome
  }

  protected mutate(genome : Genome) : Genome {
    if (rng(0, 2) && genome.genes.length < 10) {
      // duplicate gene
      const dupe = rng(0, genome.genes.length)
      const target = rng(0, genome.genes.length)
      genome.genes.splice(target, 0, genome.genes[dupe])
    } else if (genome.genes.length > 1) {
      // delete gene
      genome.genes.splice(rng(0, genome.genes.length), 1)
    }
    console.log(genome)
    return genome
  }

  public createBody(x : number, y : number) : Matter.Composite {
    const composite = Matter.Composite.create()
    for (const gene of this.genes) {
      Matter.Composite.add(composite, gene.createBodyPart(x, y))
      if (composite.bodies.length > 1) {
        Matter.Composite.add(composite, Matter.Constraint.create({
          bodyA: composite.bodies[composite.bodies.length - 1],
          // bodyB: gene.isBranch ? composite.bodies[0] : composite.bodies[composite.bodies.length - 2],
          bodyB: composite.bodies[0],
          stiffness: .1,
          damping: .1,
          length: 10,
          render: { strokeStyle: '#000000', lineWidth: .5, visible: true },

        }))
      }
    }
    return composite
  }
}

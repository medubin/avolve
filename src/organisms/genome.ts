import Gene from './gene'
import { rng } from '../utilities/random'
import * as Matter from 'matter-js'

export default class Genome {
  public genes : Gene[]
  public symmetry : number

  public static random() : Genome {
    const genome = new Genome()
    const genes = []
    for (let i = rng(1, 6); i > 0; i -= 1) {
      genes.push(Gene.random())
    }
    genome.genes = genes
    genome.symmetry = rng(1, 4)
    return genome
  }

  public replicate(mutationRate : number = .1) : Genome {
    const genome = new Genome()
    const newGenes = []
    for (const gene of this.genes) {
      newGenes.push(gene.replicate(mutationRate))
    }
    genome.genes = newGenes
    genome.symmetry = this.symmetry
    if (Math.random() < mutationRate) {
      return this.mutate(genome)
    }
    return genome
  }

  protected mutate(genome : Genome) : Genome {
    const mutation = rng(0, 3)
    if (mutation === 0 && genome.genes.length < 10) {
      // duplicate gene
      const dupe = rng(0, genome.genes.length)
      const target = rng(0, genome.genes.length)
      genome.genes.splice(target, 0, genome.genes[dupe])
    } else if (mutation === 1 && genome.genes.length > 1) {
      // delete gene
      genome.genes.splice(rng(0, genome.genes.length), 1)
    } else {
      // change symmetry
      genome.symmetry = rng(1, 4)
    }
    return genome
  }

  public createBody(x : number, y : number, uuid : number) : Matter.Composite {
    const composite = Matter.Composite.create()
    for (let i = 0; i < this.symmetry; i += 1) {
      for (const gene of this.genes) {
        Matter.Composite.add(composite, gene.createBodyPart(x, y, uuid))
        if (composite.bodies.length > 1) {
          const length = composite.bodies.length
          Matter.Composite.add(composite, Matter.Constraint.create({
            bodyA: composite.bodies[length - 1],
            bodyB: gene.isBranch ? composite.bodies[0] : composite.bodies[length - 2],
            stiffness: .01,
            damping: .1,
            length: gene.length,
            render: { strokeStyle: '#000000', lineWidth: .5, visible: true },

          }))
        }
      }
    }
    return composite
  }
}

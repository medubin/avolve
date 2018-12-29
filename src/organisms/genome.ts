import Gene from './gene'
import { rng } from '../utilities/random'
import * as Matter from 'matter-js'

export default class Genome {
  protected genes : Gene[]

  public static random() : Genome {
    const genome = new Genome()
    const genes = []
    for (let i = rng(1, 10); i > 0; i -= 1) {
      genes.push(Gene.random())
    }
    genome.genes = genes
    return genome
  }

  public createBody(x : number, y : number) : Matter.Composite {
    const composite = Matter.Composite.create()
    for (const gene of this.genes) {
      Matter.Composite.add(composite, gene.createBodyPart(x, y))
    }
    const opts = {
      stiffness: .1,
      damping: .1,
      render: { strokeStyle: '#000000', lineWidth: .5, type: 'line' } }
    return Matter.Composites.chain(composite, 0.1, 0, -0.1, 0, opts)
  }
}

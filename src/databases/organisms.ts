import Organism from '../organisms/organism'
import PixiService from '../services/pixi_service'

export interface OrganismsInterface {
  [uuid : string]: Organism
}

export default class Organisms {
  protected _organisms : OrganismsInterface
  protected pixi : PixiService

  constructor(pixi : PixiService) {
    this.pixi = pixi
    this._organisms = {}
  }

  public getOrganism(uuid : string) : Organism {
    return this._organisms[uuid]
  }

  // public addOrganism(organism : Organism) : void {
//
  // }
}

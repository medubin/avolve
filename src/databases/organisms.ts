import Organism from '../organisms/organism'

export interface OrganismsInterface {
  [uuid : string]: Organism
}

export default class Organisms {
  protected maxUuid : number
  protected _organisms : OrganismsInterface

  constructor() {
    this.maxUuid = 0
    this._organisms = {}
  }

  public getOrganism(uuid : string) : Organism {
    return this._organisms[uuid]
  }

  public addOrganism(organism : Organism) {
    this.maxUuid += 1
    organism.uuid = this.maxUuid
    this._organisms[organism.uuid] = organism
  }

  public deleteOrganism(uuid : number) {
    delete this._organisms[uuid]
  }

  public get organisms() : OrganismsInterface {
    return this._organisms
  }
}

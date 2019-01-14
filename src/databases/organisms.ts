import Organism from '../organisms/organism'

export interface OrganismsInterface {
  [uuid : string]: Organism
}

export default class Organisms {
  protected maxUuid : number
  protected _organisms : OrganismsInterface
  public length : number
  public alive : number
  public dead : number

  constructor() {
    this.maxUuid = 0
    this._organisms = {}
    this.length = 0
    this.alive = 0
    this.dead = 0
  }

  public getOrganism(uuid : string) : Organism {
    return this._organisms[uuid]
  }

  public addOrganism(organism : Organism) {
    this._organisms[organism.uuid] = organism
    this.length += 1
    this.alive += 1
  }

  public deleteOrganism(uuid : number) {
    this._organisms[uuid].isAlive ? this.alive -= 1 : this.dead -= 1
    delete this._organisms[uuid]
    this.length -= 1
  }

  public get organisms() : OrganismsInterface {
    return this._organisms
  }

  public get newUuid() : number {
    this.maxUuid += 1
    return this.maxUuid
  }
}

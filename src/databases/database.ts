import Organisms from './organisms'
import World from './world'

export default class Database {
  public organisms : Organisms
  protected _world : World

  constructor() {
    this.organisms = new Organisms()
    this._world = new World(1000)
  }
}

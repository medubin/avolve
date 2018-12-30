import Organisms from './organisms'
import World from './world'

export default class Database {
  public organisms : Organisms
  public world : World

  constructor() {
    this.organisms = new Organisms()
    this.world = new World(100000)
  }
}

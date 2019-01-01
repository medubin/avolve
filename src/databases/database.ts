import Organisms from './organisms'
import World from './world'
import WorldParameters from '../parameters/world_parameters'

export default class Database {
  public organisms : Organisms
  public world : World

  constructor() {
    this.organisms = new Organisms()
    this.world = new World(WorldParameters.CO2)
  }
}

import Organisms from './organisms'
import World from './world'
import WorldParameters from '../parameters/world_parameters'
import Frequency from './frequency'

export default class Database {
  public organisms : Organisms
  public world : World
  public frequency : Frequency


  constructor() {
    this.organisms = new Organisms()
    this.world = new World(WorldParameters.CO2)
    this.frequency = new Frequency()
  }
}

import Organisms from './organisms'
import World from './world'
import PixiService from '../services/pixi_service'

export default class Database {
  protected _organisms : Organisms
  protected _world : World

  constructor(pixi : PixiService) {
    this._organisms = new Organisms(pixi)
    this._world = new World(1000)
  }
}

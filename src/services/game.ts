import PixiService from './pixi_service'
import Organism from '../organisms/organism'
import Database from '../databases/database'

export default class Game {
  protected pixi : PixiService
  protected database : Database
  protected intervalId : number

  constructor(pixi : PixiService, database : Database) {
    this.pixi = pixi
    this.database = database
  }

  gameLoop() {
    this.intervalId = setInterval(() => { this.tick() }, 1000 / 30)
  }

  tick() {
    this.testAddOrganism()
  }

  testAddOrganism() {
    const x = this.rng(0, 900)
    const y = this.rng(0, 900)
    const organism = new Organism(x, y)
    this.pixi.world.addChild(organism.sprite)
  }

  protected rng(min : number, max : number) : number {
    return Math.floor(Math.random() * (max - min) + min)
  }

}

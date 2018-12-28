import * as PIXI from 'pixi.js'

export default class PixiService {
  public app : PIXI.Application
  public world : PIXI.Container

  constructor() {
    this.app = new PIXI.Application({
      width: 800,         // default: 800
      height: 600,        // default: 600
      antialias: true,    // default: false
      transparent: false, // default: false
      resolution: 1,      // default: 1
      backgroundColor: 0x000000,
    })
    this.world = new PIXI.Container()
    this.app.stage.addChild(this.world)
  }
}

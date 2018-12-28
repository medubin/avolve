import PixiService from './pixi_service'

export default class Camera {
  protected pixi : PixiService
  public baseScale : number
  protected _x : number
  protected _y : number

  constructor(pixi : PixiService) {
    this.pixi = pixi
    this._x = 0
    this._y = 0
    this.pixi.app.renderer.view.style.position = 'absolute'
    this.pixi.app.renderer.view.style.display = 'block'
    this.pixi.app.renderer.autoResize = true
    this.pixi.app.stage.interactive = true
    this.scaleToWindow()
    this.scaleToWindow = this.scaleToWindow.bind(this)

    window.addEventListener('resize', this.scaleToWindow)
  }

  scaleToWindow() : void {
    this.pixi.app.renderer.resize(window.innerWidth, window.innerHeight)
    const wRatio = window.innerWidth / 1440
    const hRatio = window.innerHeight / 900
    this.baseScale = Math.max(wRatio, hRatio)
    this.scale()
    // this.centerCamera()
  }

  protected scale() : void {
    this.pixi.world.scale.x = this.baseScale
    this.pixi.world.scale.y = this.baseScale
  }

  protected centerCamera() {
    this.pixi.world.position.x = this.pixi.app.renderer.width / 2
    this.pixi.world.position.y = this.pixi.app.renderer.height / 2
  }

  public moveX(dX : number) : void {
    this._x += dX
    this.pixi.world.pivot.x = this._x
  }

  public moveY(dY : number) : void {
    this._y += dY
    this.pixi.world.pivot.y = this._y
  }
}

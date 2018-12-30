import * as Matter from 'matter-js'

export default class Camera {
  // public baseScale : number
  // protected _x : number
  // protected _y : number
  protected render : Matter.Render

  constructor(render : Matter.Render) {
    this.render = render
    // this._x = 0
    // this._y = 0
    // this.pixi.app.renderer.view.style.position = 'absolute'
    // this.pixi.app.renderer.view.style.display = 'block'
    // this.pixi.app.renderer.autoResize = true
    // this.pixi.app.stage.interactive = true
    // this.scaleToWindow()
    // this.scaleToWindow = this.scaleToWindow.bind(this)
    // window.addEventListener('resize', this.scaleToWindow)
  }

  // scaleToWindow() : void {
  //   this.pixi.app.renderer.resize(window.innerWidth, window.innerHeight)
  //   const wRatio = window.innerWidth / 1440
  //   const hRatio = window.innerHeight / 900
  //   this.baseScale = Math.max(wRatio, hRatio)
  //   this.scale()
  //   // this.centerCamera()
  // }

  // protected scale() : void {
  //   this.pixi.world.scale.x = this.baseScale
  //   this.pixi.world.scale.y = this.baseScale
  // }

  // protected centerCamera() {
  //   this.pixi.world.position.x = this.pixi.app.renderer.width / 2
  //   this.pixi.world.position.y = this.pixi.app.renderer.height / 2
  // }

  public moveX(dX : number) : void {
    const translate = { x : dX, y : 0 }
    Matter.Bounds.translate(this.render.bounds, translate)
  }

  public moveY(dY : number) : void {
    const translate = { x : 0, y : dY }
    Matter.Bounds.translate(this.render.bounds, translate)
  }
}

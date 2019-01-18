import * as Matter from 'matter-js'
import World from '../parameters/world_parameters'

export default class Camera {
  protected _scrollX : number
  protected _scrollY : number
  protected render : Matter.Render

  constructor(render : Matter.Render) {
    render.canvas.width = window.innerWidth
    render.canvas.height = window.innerHeight
    this.render = render
    this._scrollX = 0
    this._scrollY = 0
    this.scaleToWindow = this.scaleToWindow.bind(this)
    window.addEventListener('resize', this.scaleToWindow)
  }

  public scaleToWindow() {
    this.render.canvas.height = window.innerHeight
    this.render.canvas.width = window.innerWidth
  }

  public scrollX() {
    if (this._scrollX) {
      // @ts-ignore
      if (this._scrollX < 0 && this.render.bounds.min.x < -World.WALL / 2) {
        return
      }
      if (this._scrollX > 0 &&
        // @ts-ignore
        (this.render.bounds.min.x + this.render.canvas.width) > World.WIDTH + (World.WALL / 2)) {
        return
      }
      const translate = { x : this._scrollX, y : 0 }
      Matter.Bounds.translate(this.render.bounds, translate)
    }
  }

  public scrollY() {
    if (this._scrollY) {
      // @ts-ignore
      if (this._scrollY < 0 && this.render.bounds.min.y < -World.WALL / 2) {
        return
      }
      if (this._scrollY > 0 &&
        // @ts-ignore
        (this.render.bounds.min.y + this.render.canvas.height) > World.HEIGHT + (World.WALL / 2)) {
        return
      }
      const translate = { x : 0, y : this._scrollY }
      Matter.Bounds.translate(this.render.bounds, translate)
    }
  }

  public moveX(dX : number) : void {
    this._scrollX = dX
    this.scrollX()
  }

  public moveY(dY : number) : void {
    this._scrollY = dY
    this.scrollX()
  }
}

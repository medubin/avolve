import * as Matter from 'matter-js'
import World from '../parameters/world_parameters'

export default class Camera {
  protected _scrollX : number
  protected _scrollY : number
  protected render : Matter.Render

  constructor(render : Matter.Render) {
    this.render = render
    this._scrollX = 0
    this._scrollY = 0
  }

  public scrollX() {
    if (this._scrollX) {
      // @ts-ignore
      if (this._scrollX < 0 && this.render.bounds.min.x < 0) {
        return
      }
      // @ts-ignore
      if (this._scrollX > 0 && this.render.bounds.max.x > World.WIDTH) {
        return
      }
      const translate = { x : this._scrollX, y : 0 }
      Matter.Bounds.translate(this.render.bounds, translate)
    }
  }

  public scrollY() {
    if (this._scrollY) {
      // @ts-ignore
      if (this._scrollY < 0 && this.render.bounds.min.y < 0) {
        return
      }
      // @ts-ignore
      if (this._scrollY > 0 && this.render.bounds.max.y > World.HEIGHT) {
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

import * as Matter from 'matter-js'

export default class Camera {
  protected _scrollX : number
  protected _scrollY : number
  protected render : Matter.Render

  constructor(render : Matter.Render) {
    this.render = render
    this._scrollX = 0
    this._scrollY = 0
    this.scaleToWindow = this.scaleToWindow.bind(this)
    window.addEventListener('resize', this.scaleToWindow)
  }

  public scaleToWindow() {
    // TODO get this working
    this.render.canvas.height = window.innerHeight
    this.render.canvas.width = window.innerWidth
    // @ts-ignore
    // this.render.bounds.max.x = this.render.bounds.min.x + window.innerWidth
    // @ts-ignore
    // this.render.bounds.max.y = this.render.bounds.min.y + window.innerHeight

  }

  public scrollX() {
    if (this._scrollX) {
      // @ts-ignore
      if (this._scrollX < 0 && this.render.bounds.min.x < 0) {
        return
      }
      // @ts-ignore
      if (this._scrollX > 0 && this.render.bounds.max.x > 2000) {
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
      if (this._scrollY > 0 && this.render.bounds.max.y > 2000) {
        return
      }
      const translate = { x : 0, y : this._scrollY }
      Matter.Bounds.translate(this.render.bounds, translate)
    }
  }

  public moveX(dX : number) : void {
    this._scrollX = dX
  }

  public moveY(dY : number) : void {
    this._scrollY = dY
  }
}

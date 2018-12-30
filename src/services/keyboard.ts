import Camera from './camera'

export default class Keyboard {
  protected camera : Camera

  public left : any
  public up : any
  public right : any
  public down : any

  constructor(camera : Camera) {
    this.camera = camera
    this.left = this.keyboard(37)
    this.up = this.keyboard(38)
    this.right = this.keyboard(39)
    this.down = this.keyboard(40)
  }

  keyboard(keyCode : number) {
    const key : any = {}
    key.code = keyCode
    key.isDown = false
    key.isUp = true
    key.press = undefined
    key.release = undefined
    // The `downHandler`
    key.downHandler = (event : any) => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press()
        key.isDown = true
        key.isUp = false
        event.preventDefault()
      }
    }

    // The `upHandler`
    key.upHandler = (event : any) => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release()
        key.isDown = false
        key.isUp = true
        event.preventDefault()
      }
    }

    // Attach event listeners
    window.addEventListener(
      'keydown', key.downHandler.bind(key), false,
    )
    window.addEventListener(
      'keyup', key.upHandler.bind(key), false,
    )
    return key
  }

  attachKeys() {

    this.left.press = () => {
      this.camera.moveX(-10)
    }

    this.left.release = () => {
      if (!this.right.isDown) {
        this.camera.moveX(0)
      }
    }

    this.up.press = () => {
      this.camera.moveY(-10)
    }

    this.up.release = () => {
      if (!this.down.isDown) {
        this.camera.moveY(0)
      }
    }

    this.right.press = () => {
      this.camera.moveX(10)
    }

    this.right.release = () => {
      if (!this.left.isDown) {
        this.camera.moveX(0)
      }
    }

    this.down.press = () => {
      this.camera.moveY(10)
    }

    this.down.release = () => {
      if (!this.up.isDown) {
        this.camera.moveY(0)
      }
    }
  }

  // attachMouse()  : void {
  //   this.attachMouseMovement()
  //   this.attachMouseLeftClick()
  //   this.attachMouseRightClick()
  // }

  // attachMouseMovement() : void {
  //   this.pixi.app.stage.on('mousemove', () => {

    // })
  // }

  // attachMouseLeftClick() : void { // right now either click
  //   this.pixi.app.stage.on('mousedown', () => {
  //     this.websocketPublisher.publish(Spells.PRIMARY, CLIENT_UPDATE_TYPES.CAST)
  //   })
  //   this.pixi.app.stage.on('mouseup', () => {
  //     this.websocketPublisher.publish(Spells.NONE, CLIENT_UPDATE_TYPES.CAST)
  //   })
  // }

  // attachMouseRightClick() : void {
  //   this.pixi.app.stage.on('rightdown', () => {
  //     this.websocketPublisher.publish(Spells.SPECIAL, CLIENT_UPDATE_TYPES.CAST)
  //   })
  //   this.pixi.app.stage.on('rightup', () => {
  //     this.websocketPublisher.publish(Spells.NONE, CLIENT_UPDATE_TYPES.CAST)
  //   })
  // }
}

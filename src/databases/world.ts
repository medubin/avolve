export default class World {
  protected _total : number
  protected _co2 : number
  protected _o2 : number

  constructor(total : number) {
    this._total = total
    this._co2 = total
  }
}

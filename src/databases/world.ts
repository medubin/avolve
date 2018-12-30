export default class World {
  public total : number
  public co2 : number
  public o2 : number

  constructor(total : number) {
    this.total = total
    this.co2 = total
    this.o2 = 0
  }

  public get fraction() : number {
    return this.co2 / this.total
  }

  public consumeCO2(co2 : number) {
    this.co2 -= co2
    this.o2 += co2
  }

  public releaseCO2(co2 : number) {
    this.co2 += co2
    this.o2 -= co2
  }
}

import Database from '../databases/database'

export default class WorldDisplay {
  protected database : Database
  protected stats : HTMLElement
  protected organismCount : HTMLElement
  protected co2 : HTMLElement
  protected o2 : HTMLElement
  protected age : HTMLElement
  constructor(database : Database) {
    this.database = database
    this.stats = document.getElementById('stats')

    const organismText = document.createElement('span')
    organismText.innerText = 'Organisms: '
    this.organismCount = document.createElement('span')
    organismText.appendChild(this.organismCount)
    this.stats.appendChild(organismText)

    const co2Text = document.createElement('span')
    co2Text.innerText = 'CO2: '
    this.co2 = document.createElement('span')
    co2Text.appendChild(this.co2)
    this.stats.appendChild(co2Text)

    const o2Text = document.createElement('span')
    o2Text.innerText = 'O2: '
    this.o2 = document.createElement('span')
    o2Text.appendChild(this.o2)
    this.stats.appendChild(o2Text)

    const ageText = document.createElement('span')
    ageText.innerText = 'Age: '
    this.age = document.createElement('span')
    ageText.appendChild(this.age)
    this.stats.appendChild(ageText)
  }

  public tick() : void {
    if (this.database.world.tickNumber % 100 === 0) {
      this.organismCount.innerText = this.database.organisms.length.toString()
      this.co2.innerText = Math.floor(this.database.world.co2).toString()
      this.o2.innerText = Math.floor(this.database.world.o2).toString()
      this.age.innerText = (this.database.world.tickNumber / 100).toString()
    }
  }
}

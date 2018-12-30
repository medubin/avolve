import * as Matter from 'matter-js'
import Organism from './organisms/organism'
import Database from './databases/database'
import Genome from './organisms/genome'
import Camera from './services/camera'
import Keyboard from './services/keyboard'

// create an engine
const engine = Matter.Engine.create()
engine.world.gravity.y = 0

// create a renderer
const render = Matter.Render.create({
  engine,
  element: document.body,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
  },
})

render.options.hasBounds = true

const camera = new Camera(render)
const keyboard = new Keyboard(camera)
keyboard.attachKeys()

const database = new Database()

for (let i = 0; i < 1; i += 1) {
  for (let j = 0; j < 1; j += 1) {
    database.organisms.addOrganism(
      new Organism(i * 100 + 100, j * 100 + 100, engine.world, Genome.random()))
  }
}

// run the engine
Matter.Engine.run(engine)

Matter.Events.on(engine, 'beforeTick', (_) => {
  const organisms = database.organisms.organisms
  for (const uuid in organisms) {
    organisms[uuid].update(database)
  }
  console.log(database.world.co2)
})

// run the renderer
Matter.Render.run(render)

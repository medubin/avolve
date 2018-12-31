import * as Matter from 'matter-js'
import Organism from './organisms/organism'
import Database from './databases/database'
import Genome from './organisms/genome'
import Camera from './services/camera'
import Keyboard from './services/keyboard'
import BodyType from './constants/body_type'

// create an engine
const engine = Matter.Engine.create()
engine.world.gravity.y = 0

Matter.World.add(engine.world, [
  Matter.Bodies.rectangle(1000, 0, 2000, 50, { isStatic: true }),
  Matter.Bodies.rectangle(1000, 2000, 2000, 50, { isStatic: true }),
  Matter.Bodies.rectangle(0, 1000, 50, 2000, { isStatic: true }),
  Matter.Bodies.rectangle(2000, 1000, 50, 2000, { isStatic: true }),
])

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

for (let i = 0; i < 10; i += 1) {
  for (let j = 0; j < 10; j += 1) {
    database.organisms.addOrganism(
      new Organism(i * 100 + 100, j * 100 + 100, engine.world, Genome.random(), 1000, database))
  }
}

// run the engine
Matter.Engine.run(engine)

Matter.Events.on(engine, 'beforeTick', (_) => {
  const organisms = database.organisms.organisms
  for (const uuid in organisms) {
    organisms[uuid].update(database)
  }
  camera.scrollX()
  camera.scrollY()
})

Matter.Events.on(engine, 'collisionStart', (event) => {
  for (const pair of event.pairs) {
    const bodyA = pair.bodyA.label.split(':')
    const bodyB = pair.bodyB.label.split(':')
    if (bodyA[0] === bodyB[0]) {
      continue
    }
    const typeA = parseInt(bodyA[1], 10)
    const typeB = parseInt(bodyB[1], 10)
    if (typeA === BodyType.BLUE || typeB === BodyType.BLUE) {
      continue
    }
    if (typeA !== BodyType.RED && typeB !== BodyType.RED) {
      continue
    }
    if (typeA === BodyType.RED && typeB === BodyType.RED) {
      continue
    }

    const organismA = database.organisms.getOrganism(bodyA[0])
    const organismB = database.organisms.getOrganism(bodyB[0])
    if (!organismA || ! organismB) {
      continue
    }
    if (typeA === BodyType.RED) {
      organismA.absorb(pair.bodyA.area, organismB)
    } else if (typeB === BodyType.RED) {
      organismB.absorb(pair.bodyB.area, organismA)
    }
  }
})

// run the renderer
Matter.Render.run(render)

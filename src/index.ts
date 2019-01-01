import * as Matter from 'matter-js'
import Organism from './organisms/organism'
import Database from './databases/database'
import Genome from './organisms/genome'
import Camera from './services/camera'
import Keyboard from './services/keyboard'
import BodyType from './constants/body_type'
import World from './parameters/world_parameters'
import { rng } from './utilities/random'
import { collidesWith } from './utilities/collision_interaction'

// create an engine
const engine = Matter.Engine.create()
engine.world.gravity.y = 0

Matter.World.add(engine.world, [
  // top
  Matter.Bodies.rectangle(World.WIDTH / 2, 0, World.WIDTH, 50, { isStatic: true }),
  // bottom
  Matter.Bodies.rectangle(World.WIDTH / 2, World.HEIGHT, World.WIDTH, 50, { isStatic: true }),
  // left
  Matter.Bodies.rectangle(0, World.HEIGHT / 2, 50, World.HEIGHT, { isStatic: true }),
  // right
  Matter.Bodies.rectangle(World.WIDTH, World.HEIGHT / 2, 50, World.HEIGHT, { isStatic: true }),
])

// create a renderer
const render = Matter.Render.create({
  engine,
  element: document.body,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    hasBounds: true,
    wireframes: false,
  },
})

const camera = new Camera(render)
const keyboard = new Keyboard(camera)
keyboard.attachKeys()

const database = new Database()

for (let i = 0; i < World.STARTING_ORGANISMS; i += 1) {
  const x = rng(50, World.WIDTH - 50)
  const y = rng(50, World.HEIGHT - 50)
  const organism = new Organism(x, y, engine.world, Genome.random(), 1000, null, database)
  database.organisms.addOrganism(organism)
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

Matter.Events.on(engine, 'collisionActive', (event) => {
  for (const pair of event.pairs) {
    const bodyA = pair.bodyA.label.split(':')
    const bodyB = pair.bodyB.label.split(':')
    if (bodyA.length === 1 || bodyB.length === 1) {
      continue
    }

    if (bodyA[0] === bodyB[0]) {
      continue
    }
    const typeA = parseInt(bodyA[1], 10)
    const typeB = parseInt(bodyB[1], 10)

    const aCollidesB = collidesWith(typeA, typeB)
    const bCollidesA = collidesWith(typeB, typeA)

    if (!aCollidesB && !bCollidesA) {
      continue
    }

    const organismA = database.organisms.getOrganism(bodyA[0])
    const organismB = database.organisms.getOrganism(bodyB[0])
    if (!organismA || ! organismB) {
      continue
    }

    if (organismA.isAlive && organismB.isAlive) {
      // prevent parents from eating children and vice versa
      if (organismA.parentUuid === organismB.uuid || organismA.uuid === organismB.parentUuid) {
        continue
      }

        // prevent siblings from eating eachother
      if (organismA.parentUuid && organismA.parentUuid === organismB.parentUuid) {
        continue
      }
    }

    if (typeA === BodyType.GRAY) {
      organismB.die()
    } else if (typeB === BodyType.GRAY) {
      organismA.die()
    } else if (typeA === BodyType.RED) {
      organismA.absorb(pair.bodyA.area, organismB)
    } else if (typeB === BodyType.RED) {
      organismB.absorb(pair.bodyB.area, organismA)
    }
  }
})

// run the renderer
Matter.Render.run(render)

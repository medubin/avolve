import * as Matter from 'matter-js'
import Organism from './organisms/organism'

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

// create two boxes and a ground
// const boxA = Matter.Bodies.rectangle(400, 200, 80, 80)
// const boxB = Matter.Bodies.rectangle(450, 50, 80, 80)
// const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

// add all of the bodies to the world
// Matter.World.add(engine.world, [boxA, boxB, ground])

// const o1 = new Organism(10, 20, engine.world)
// const o2 = new Organism(90, 50, engine.world)
// const o3 = new Organism(300, 100, engine.world)
const organisms : Organism[] = []
for (let i = 0; i < 10; i += 1) {
  for (let j = 0; j < 10; j += 1) {
    organisms.push(new Organism(i * 100, j * 100, engine.world))
  }
}

// run the engine
// setInterval(() => { Matter.Engine.update(engine) }, 10)
Matter.Engine.run(engine)

Matter.Events.on(engine, 'beforeTick', (event) => {
  for (const organism of organisms) {
    // organism.move()
  }
})

// run the renderer
Matter.Render.run(render)

// import PixiService from './services/pixi_service'
// import Camera from './services/camera'
// import Game from './services/game'
// import Keyboard from './services/keyboard'
// import Database from './databases/database'

// const pixi = new PixiService()
// const database = new Database(pixi)
// const camera = new Camera(pixi)
// const keyboard = new Keyboard(pixi, camera)
// const game = new Game(pixi, database)

// keyboard.attachKeys()
// game.gameLoop()
// const thrive = document.getElementById('avolve')
// thrive.appendChild(pixi.app.view)
// document.addEventListener('contextmenu', event => event.preventDefault())

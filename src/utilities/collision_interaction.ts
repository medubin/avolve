import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { IEventCollision } from 'matter-js'

function collidesWith(type : number, target : number) {
  return COLLISION_CHECK[type].indexOf(target) !== -1
}

const DEAD = BodyType.DEAD
const GREEN = BodyType.GREEN
const BLUE = BodyType.BLUE
const RED = BodyType.RED
const CYAN = BodyType.CYAN
const GRAY = BodyType.GRAY
const YELLOW = BodyType.YELLOW
const MAROON = BodyType.MAROON
const ORANGE = BodyType.ORANGE
const ALL = [DEAD, GREEN, BLUE, RED, CYAN, GRAY, YELLOW, MAROON, ORANGE]

const COLLISION_CHECK : {[key : number]: number[]} = {
  [DEAD]: [],
  [GREEN]: [],
  [BLUE]: ALL,
  [MAROON]: [DEAD, GREEN],
  [CYAN]: [],
  [GRAY]: [GREEN, MAROON, CYAN, YELLOW, RED, ORANGE],
  [YELLOW]: [],
  [RED]: [MAROON, ORANGE],
  [ORANGE]: [BLUE, YELLOW, CYAN, DEAD],
}

export function resolveCollision(event : IEventCollision<any>, database : Database) {
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

    if (typeA === BodyType.BLUE) {
      const vX = pair.bodyA.velocity.x
      const vY = pair.bodyA.velocity.y
      organismA.reverse(vX, vY)
    } else if (typeB === BodyType.BLUE) {
      const vX = pair.bodyB.velocity.x
      const vY = pair.bodyB.velocity.y
      organismB.reverse(vX, vY)
    } else if (typeA === BodyType.GRAY) {
      organismB.die()
    } else if (typeB === BodyType.GRAY) {
      organismA.die()
    } else if (typeA === BodyType.RED) {
      organismA.absorb(pair.bodyA.area, organismB)
    } else if (typeB === BodyType.RED) {
      organismB.absorb(pair.bodyB.area, organismA)
    } else if (typeA === BodyType.MAROON) {
      organismA.absorb(pair.bodyA.area, organismB)
    } else if (typeB === BodyType.MAROON) {
      organismB.absorb(pair.bodyB.area, organismA)
    } else if (typeA === BodyType.ORANGE) {
      organismA.absorb(pair.bodyA.area, organismB)
    } else if (typeB === BodyType.ORANGE) {
      organismB.absorb(pair.bodyB.area, organismA)
    }
  }
}

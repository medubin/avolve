import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { IEventCollision, Body } from 'matter-js'
import Organism from '../organisms/organism'

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
const TEAL = BodyType.TEAL
const BARK = BodyType.BARK
const DEAD_BARK = BodyType.DEAD_BARK
const ALL = [DEAD, GREEN, BLUE, RED, CYAN, GRAY, YELLOW, MAROON, ORANGE, TEAL, BARK, DEAD_BARK]

const COLLISION_CHECK : {[key : number]: number[]} = {
  [DEAD]: [],
  [GREEN]: [],
  [BLUE]: ALL,
  [MAROON]: [DEAD, GREEN, BARK, DEAD_BARK],
  [CYAN]: [],
  [GRAY]: [GREEN, MAROON, CYAN, YELLOW, RED, ORANGE],
  [YELLOW]: [],
  [RED]: [MAROON, ORANGE],
  [ORANGE]: [BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, BARK],
  [TEAL]: ALL,
  [BARK]: [MAROON, ORANGE],
  [DEAD_BARK]: [],
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
      if (aCollidesB) {
        onContact(organismA, organismB, typeA, pair.bodyA, pair.bodyB)
      }

      if (bCollidesA) {
        onContact(organismB, organismA, typeB, pair.bodyB, pair.bodyA)
      }
    }
  }
}

function onContact(orgA : Organism, orgB : Organism, typeA : number, bodyA : Body, bodyB : Body) {
  if (typeA === BodyType.BLUE) {
    orgB.flee(bodyB.position, bodyA.position)
  } else if (typeA === BodyType.GRAY) {
    orgB.die()
  } else if (typeA === BodyType.RED) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === BodyType.MAROON) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === BodyType.ORANGE) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === BodyType.TEAL) {
    orgA.flee(bodyA.position, bodyB.position)
  } else if (typeA === BodyType.BARK) {
    orgA.harden(bodyA)
  }
}

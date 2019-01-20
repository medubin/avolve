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
const SKY = BodyType.SKY
const INDIGO = BodyType.INDIGO
const WHITE = BodyType.WHITE
const PINK = BodyType.PINK
const MAHOGANY = BodyType.MAHOGANY
const OCHRE = BodyType.OCHRE
const ALL = [
  DEAD, GREEN, BLUE, RED, CYAN, GRAY, YELLOW, MAROON, ORANGE, TEAL, BARK, DEAD_BARK, SKY, INDIGO,
  WHITE, PINK, MAHOGANY, OCHRE,
]

const COLLISION_CHECK : {[key : number]: number[]} = {
  [DEAD]: [],
  [GREEN]: [],
  [BLUE]: ALL,
  [MAROON]: [DEAD, GREEN, BARK, DEAD_BARK],
  [CYAN]: [],
  [GRAY]: [GREEN, RED, CYAN, YELLOW, MAROON, ORANGE, TEAL, BARK, SKY, INDIGO, WHITE],
  [YELLOW]: [],
  [RED]: [MAROON, ORANGE, PINK, INDIGO, OCHRE],
  [ORANGE]: [BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, SKY, WHITE],
  [TEAL]: ALL,
  [BARK]: [MAROON, MAHOGANY],
  [DEAD_BARK]: [],
  [SKY]: ALL,
  [INDIGO]: [BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, SKY, WHITE],
  [WHITE]: [GREEN, RED, MAROON, ORANGE, BARK],
  [PINK]: [DEAD, WHITE, GREEN],
  [OCHRE]: [DEAD, GREEN, BLUE, CYAN, YELLOW, TEAL, BARK, DEAD_BARK, SKY, INDIGO, WHITE],
  [MAHOGANY]: [DEAD, GREEN, BARK, DEAD_BARK],
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
  if (typeA === BLUE) {
    orgB.flee(bodyB, bodyB.position, bodyA.position)
  } else if (typeA === GRAY) {
    orgB.die()
  } else if (typeA === RED) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === MAROON) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === ORANGE) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === TEAL) {
    orgA.flee(bodyA, bodyA.position, bodyB.position)
  } else if (typeA === BARK) {
    orgA.harden(bodyA)
  } else if (typeA === INDIGO) {
    orgA.absorb(bodyA.area * .2, orgB)
  } else if (typeA === SKY) {
    orgA.flee(bodyA, bodyB.position, bodyA.position, 2)
  } else if (typeA === WHITE) {
    orgA.infect(orgB)
  } else if (typeA === PINK) {
    orgA.absorb(bodyA.area, orgB)
  } else if (typeA === MAHOGANY) {
    orgA.absorb(bodyA.area * .2, orgB)
  } else if (typeA === OCHRE) {
    orgA.absorb(bodyA.area * .2, orgB)
  }
}

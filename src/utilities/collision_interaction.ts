import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { IEventCollision, Body } from 'matter-js'
import * as Matter from 'matter-js'
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
const VIOLET = BodyType.VIOLET
const TURQUOISE = BodyType.TURQUOISE
const STEEL = BodyType.STEEL
const BURGUNDY = BodyType.BURGUNDY
const ALL = [
  DEAD, GREEN, BLUE, RED, CYAN, GRAY, YELLOW, MAROON, ORANGE, TEAL, BARK, DEAD_BARK, SKY, INDIGO,
  WHITE, PINK, MAHOGANY, OCHRE, VIOLET, TURQUOISE, STEEL, BURGUNDY,
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
  [VIOLET]: [GREEN, BLUE, CYAN, YELLOW, ORANGE, TEAL, BARK, SKY, INDIGO, WHITE, PINK, OCHRE, VIOLET],
  [TURQUOISE]: [GREEN, BLUE, CYAN, YELLOW, RED, MAROON, ORANGE, TEAL, BARK, SKY, INDIGO, WHITE, PINK, OCHRE, VIOLET, TURQUOISE],
  [STEEL]: [], // STEEL doesn't attack anything - pure defense
  [BURGUNDY]: [GREEN, BLUE, CYAN, YELLOW, RED, MAROON, ORANGE, TEAL, BARK, SKY, INDIGO, WHITE, PINK, OCHRE, VIOLET, TURQUOISE], // Parasitic - attacks most living things
}

export function resolveCollision(event : IEventCollision<any>, database : Database) {
  const world = event.source.world // Access the Matter.js world from the collision event
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
        onContact(organismA, organismB, typeA, pair.bodyA, pair.bodyB, database, world)
      }

      if (bCollidesA) {
        onContact(organismB, organismA, typeB, pair.bodyB, pair.bodyA, database, world)
      }
    }
  }
}

function onContact(orgA : Organism, orgB : Organism, typeA : number, bodyA : Body, bodyB : Body, database : Database, world : any) {
  const typeB = parseInt(bodyB.label.split(':')[1], 10)
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
  } else if (typeA === VIOLET) {
    // VIOLET healing behavior
    const healingAmount = bodyA.area * 0.3
    
    // Only heal if the target organism has less than 70% of its reproduction threshold
    if (orgB.energy < orgB.reproduceAt * 0.7) {
      // Transfer energy from VIOLET to the target organism
      if (orgA.energy > healingAmount * 2) { // Ensure VIOLET has enough energy
        orgA.energy -= healingAmount
        orgB.energy += healingAmount * 0.8 // 80% efficiency
        // Release 20% as CO2 (healing cost)
        database.world.releaseCO2(healingAmount * 0.2)
      }
    }
    
    // VIOLET organisms cooperate with each other (energy sharing)
    if (typeB === VIOLET && orgB.energy < orgA.energy * 0.8) {
      const shareAmount = (orgA.energy - orgB.energy) * 0.1
      orgA.energy -= shareAmount
      orgB.energy += shareAmount
    }
  } else if (typeA === TURQUOISE) {
    // TURQUOISE creates stronger orbital attraction on direct contact
    const orbitForce = bodyA.area * 0.01 // Extremely weak orbital force
    
    // Create circular orbital motion around the TURQUOISE organism
    const turquoisePos = bodyA.position
    const targetPos = bodyB.position
    
    // Calculate perpendicular force for orbital motion
    const toTarget = Matter.Vector.sub(targetPos, turquoisePos)
    const perpendicular = { x: -toTarget.y, y: toTarget.x }
    const normalizedPerp = Matter.Vector.normalise(perpendicular)
    
    // Apply orbital force (tangential to the radius)
    const orbitalForce = Matter.Vector.mult(normalizedPerp, orbitForce)
    Matter.Body.applyForce(bodyB, targetPos, orbitalForce)
    
    // TURQUOISE organisms can "lock" onto each other for enhanced photosynthesis
    if (typeB === TURQUOISE) {
      // Only boost photosynthesis occasionally to prevent reproduction explosion
      if (Math.random() < 0.01) { // 1% chance per collision frame
        const photosynthesisBoost = 2
        // Energy comes from CO2, not from nothing
        if (database.world.co2 >= photosynthesisBoost * 2) {
          database.world.consumeCO2(photosynthesisBoost * 2)
          orgA.energy += photosynthesisBoost
          orgB.energy += photosynthesisBoost
        }
      }
    }
    
    // Consume extra energy for contact-based orbital mechanics
    orgA.energy -= 1
  } else if (typeA === BURGUNDY) {
    // BURGUNDY parasitic behavior - slow energy drain + physical sticking
    const parasiteDrain = bodyA.area * 0.05 // Very slow drain (5% of body area)
    
    // Slow energy absorption
    if (orgB.energy > parasiteDrain) {
      orgB.energy -= parasiteDrain
      orgA.energy += parasiteDrain * 0.7 // 70% efficiency
      database.world.releaseCO2(parasiteDrain * 0.3) // 30% lost as CO2
    }
    
    // Physical sticking - create a constraint between BURGUNDY and target
    // Use a simpler approach: create temporary constraint with auto-cleanup
    const constraint = Matter.Constraint.create({
      bodyA: bodyA,
      bodyB: bodyB,
      length: Math.max(8, (bodyA.circleRadius || 10) + (bodyB.circleRadius || 10) - 5), // Close but not overlapping
      stiffness: 0.4, // Moderately flexible connection
      damping: 0.2,   // Damping to prevent oscillation
      render: { visible: false } // Hide constraint visually
    })
    
    // Add constraint to the Matter.js world
    Matter.World.add(world, constraint)
    
    // Set constraint to auto-remove after 2-4 seconds (prevents permanent attachment)
    setTimeout(() => {
      try {
        Matter.World.remove(world, constraint)
      } catch {
        // Constraint or world may no longer exist, ignore error
      }
    }, 2000 + Math.random() * 2000) // 2-4 second attachment
  }
}

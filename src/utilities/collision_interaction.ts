import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { IEventCollision, Body } from 'matter-js'
import * as Matter from 'matter-js'
import Organism from '../organisms/organism'
import { 
  getGeneCollisionBehavior, 
  getGeneCollisionTargets, 
  getGeneEnergyAbsorption, 
  getGeneAbsorptionEfficiency,
  doesGeneFleeFromAll,
  doesGeneContactAll 
} from '../constants/gene_types'

function collidesWith(type : number, target : number) {
  // Use trait-based collision checking
  const collisionTargets = getGeneCollisionTargets(type)
  return collisionTargets.includes(target)
}

// All collision logic is now trait-based and centralized in gene_types.ts

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
        onContact(organismA, organismB, typeA, pair.bodyA, pair.bodyB, database)
      }

      if (bCollidesA) {
        onContact(organismB, organismA, typeB, pair.bodyB, pair.bodyA, database)
      }
    }
  }
}

function onContact(orgA : Organism, orgB : Organism, typeA : number, bodyA : Body, bodyB : Body, database : Database) {
  const typeB = parseInt(bodyB.label.split(':')[1], 10)
  const behavior = getGeneCollisionBehavior(typeA)
  const absorption = getGeneEnergyAbsorption(typeA)
  const efficiency = getGeneAbsorptionEfficiency(typeA)

  switch (behavior) {
    case 'flee':
      if (doesGeneContactAll(typeA)) {
        // Like BLUE - makes others flee
        orgB.flee(bodyB, bodyB.position, bodyA.position)
      } else if (doesGeneFleeFromAll(typeA)) {
        // Like TEAL - flees from everything
        orgA.flee(bodyA, bodyA.position, bodyB.position)
      } else {
        // Like SKY - gentle flee
        orgA.flee(bodyA, bodyB.position, bodyA.position, 2)
      }
      break
      
    case 'kill':
      orgB.die()
      break
      
    case 'absorb':
      if (absorption > 0) {
        const energyDrain = bodyA.area * absorption
        orgA.absorb(energyDrain, orgB)
      }
      break
      
    case 'harden':
      orgA.harden(bodyA)
      break
      
    case 'infect':
      orgA.infect(orgB)
      break
      
    case 'heal':
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
      if (typeB === BodyType.VIOLET && orgB.energy < orgA.energy * 0.8) {
        const shareAmount = (orgA.energy - orgB.energy) * 0.1
        orgA.energy -= shareAmount
        orgB.energy += shareAmount
      }
      break
      
    case 'attract':
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
      if (typeB === BodyType.TURQUOISE) {
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
      break
      
    case 'stick':
      // BURGUNDY parasitic behavior - slow energy drain + sticky forces
      const parasiteDrain = bodyA.area * absorption
      
      // Slow energy absorption
      if (orgB.energy > parasiteDrain) {
        orgB.energy -= parasiteDrain
        orgA.energy += parasiteDrain * efficiency
        database.world.releaseCO2(parasiteDrain * (1 - efficiency))
      }
      
      // Physical sticking using attractive forces instead of constraints
      const stickingId = `burgundy_${orgA.uuid}_${orgB.uuid}_${bodyA.id}_${bodyB.id}`
      
      // Track sticking relationships to prevent multiple applications
      if (!(bodyA as any).burgundyStickTargets) {
        (bodyA as any).burgundyStickTargets = new Set()
      }
      
      if (!(bodyA as any).burgundyStickTargets.has(stickingId)) {
        // Apply strong attractive force to create sticking effect
        const stickForce = 0.3 // Strong force for sticking
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(bodyB.position, bodyA.position))
        
        if (distance > 5) { // Only apply if bodies are not extremely close
          const direction = Matter.Vector.normalise(Matter.Vector.sub(bodyB.position, bodyA.position))
          const attractiveForce = Matter.Vector.mult(direction, stickForce)
          
          // Apply attractive forces
          Matter.Body.applyForce(bodyA, bodyA.position, attractiveForce)
          Matter.Body.applyForce(bodyB, bodyB.position, Matter.Vector.mult(attractiveForce, -1))
        }
        
        // Track this sticking relationship
        (bodyA as any).burgundyStickTargets.add(stickingId)
        
        // Remove sticking after 2-4 seconds
        setTimeout(() => {
          if ((bodyA as any).burgundyStickTargets) {
            (bodyA as any).burgundyStickTargets.delete(stickingId)
          }
        }, 2000 + Math.random() * 2000)
      }
      break
      
    case 'none':
    default:
      // No collision behavior
      break
  }
}

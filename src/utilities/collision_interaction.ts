import BodyType from '../constants/body_type'
import Database from '../databases/database'
import { IEventCollision, Body } from 'matter-js'
import * as Matter from 'matter-js'
import Organism from '../organisms/organism'
import { 
  getGeneCollisionBehaviors, 
  getGeneCollisionTargets, 
  getGeneEnergyAbsorption, 
  getGeneAbsorptionEfficiency,
  getGeneFleeIntensity
} from '../constants/gene_types'

function showPredationIndicator(bodyPart: Body) {
  // Avoid multiple indicators on the same body part
  if ((bodyPart as any).predationIndicatorActive) {
    return
  }
  
  // Mark as active and store original fill style
  (bodyPart as any).predationIndicatorActive = true
  const originalFillStyle = bodyPart.render.fillStyle
  
  // Flash red interior only, keeping the original border color
  bodyPart.render.fillStyle = 'rgba(255, 0, 0, 0.6)'
  
  // Use requestAnimationFrame for better timing with the render cycle
  const startTime = performance.now()
  
  function restoreOriginal() {
    const elapsed = performance.now() - startTime
    
    if (elapsed >= 150) {
      // Restore original appearance
      if (bodyPart.render) {
        bodyPart.render.fillStyle = originalFillStyle
        delete (bodyPart as any).predationIndicatorActive
      }
    } else {
      requestAnimationFrame(restoreOriginal)
    }
  }
  
  requestAnimationFrame(restoreOriginal)
}

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

    // Check if organisms are related
    const areRelated = (organismA.parentUuid === organismB.uuid || 
                       organismA.uuid === organismB.parentUuid ||
                       (organismA.parentUuid && organismA.parentUuid === organismB.parentUuid))
    
    if (aCollidesB) {
      onContact(organismA, organismB, typeA, pair.bodyA, pair.bodyB, database, areRelated)
    }

    if (bCollidesA) {
      onContact(organismB, organismA, typeB, pair.bodyB, pair.bodyA, database, areRelated)
    }
  }
}

function onContact(orgA : Organism, orgB : Organism, typeA : number, bodyA : Body, bodyB : Body, database : Database, areRelated : boolean) {
  const typeB = parseInt(bodyB.label.split(':')[1], 10)
  const behaviors = getGeneCollisionBehaviors(typeA)
  const absorption = getGeneEnergyAbsorption(typeA)
  const efficiency = getGeneAbsorptionEfficiency(typeA)
  const fleeIntensity = getGeneFleeIntensity(typeA)

  // Process each behavior in the array
  behaviors.forEach(behavior => {
    switch (behavior) {
      case 'flee':
        // Organism flees from the target with configurable intensity
        orgA.flee(bodyA, bodyA.position, bodyB.position, fleeIntensity)
        break
        
      case 'cause_flee':
        // Makes target organism flee with configurable intensity
        orgB.flee(bodyB, bodyB.position, bodyA.position, fleeIntensity)
        break
        
      case 'kill':
        if (!areRelated) {
          orgB.die()
        }
        break
        
      case 'absorb_energy':
        if (!areRelated && absorption > 0) {
          const energyDrain = bodyA.area * absorption
          const actualEnergyDrain = Math.min(energyDrain, orgB.energy)
          orgB.energy -= actualEnergyDrain
          orgA.energy += actualEnergyDrain * efficiency
          database.world.releaseCO2(actualEnergyDrain * (1 - efficiency))
          showPredationIndicator(bodyB)
        }
        break
        
      case 'share_energy':
        const energyDifference = Math.abs(orgA.energy - orgB.energy)
        if (energyDifference > 100) {
          const shareAmount = energyDifference * 0.1
          if (orgA.energy > orgB.energy) {
            orgA.energy -= shareAmount
            orgB.energy += shareAmount
          } else {
            orgB.energy -= shareAmount
            orgA.energy += shareAmount
          }
        }
        break
        
      case 'enhance_photosynthesis':
        if (typeB === BodyType.FOREST || typeB === BodyType.GREEN || typeB === BodyType.BARK) {
          orgA.photosynthesisMultiplier = 3.0
        }
        break
        
      case 'harden':
        orgA.harden(bodyA)
        break
        
      case 'infect':
        if (!areRelated && !orgB.immuneToInfection) {
          orgA.infect(orgB)
        }
        break
        
      case 'heal':
        if (orgB.energy < orgB.reproduceAt * 0.8) {
          orgB.energy += 10
        }
        break
        
      case 'attract':
        const attractionForce = 0.8
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(bodyB.position, bodyA.position))
        
        if (distance > 10 && distance < 200) {
          const direction = Matter.Vector.normalise(Matter.Vector.sub(bodyB.position, bodyA.position))
          const force = Matter.Vector.mult(direction, attractionForce)
          
          Matter.Body.applyForce(bodyA, bodyA.position, force)
          Matter.Body.applyForce(bodyB, bodyB.position, Matter.Vector.mult(force, -1))
        }
        
        orgA.energy -= 1
        break
        
      case 'physical_stick':
        const stickingId = `stick_${orgA.uuid}_${orgB.uuid}_${bodyA.id}_${bodyB.id}`
        
        if (!(bodyA as any).stickTargets) {
          (bodyA as any).stickTargets = new Set()
        }
        
        if (!(bodyA as any).stickTargets.has(stickingId)) {
          const stickForce = 0.3
          const distance = Matter.Vector.magnitude(Matter.Vector.sub(bodyB.position, bodyA.position))
          
          if (distance > 5) {
            const direction = Matter.Vector.normalise(Matter.Vector.sub(bodyB.position, bodyA.position))
            const attractiveForce = Matter.Vector.mult(direction, stickForce)
            
            Matter.Body.applyForce(bodyA, bodyA.position, attractiveForce)
            Matter.Body.applyForce(bodyB, bodyB.position, Matter.Vector.mult(attractiveForce, -1))
          }
          
          (bodyA as any).stickTargets.add(stickingId)
          
          setTimeout(() => {
            if ((bodyA as any).stickTargets) {
              (bodyA as any).stickTargets.delete(stickingId)
            }
          }, 2000 + Math.random() * 2000)
        }
        break
        
      default:
        break
    }
  })
}
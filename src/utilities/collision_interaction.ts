import BodyType from '../constants/body_type'

export function collidesWith(type : number, target : number) {
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
const ALL = [DEAD, GREEN, BLUE, RED, CYAN, GRAY, YELLOW, MAROON]

const COLLISION_CHECK : {[key : number]: number[]} = {
  [DEAD]: [],
  [GREEN]: [],
  [BLUE]: ALL,
  [MAROON]: [DEAD, GREEN],
  [CYAN]: [],
  [GRAY]: [GREEN, MAROON, CYAN, YELLOW],
  [YELLOW]: [],
  [RED]: [MAROON],
}

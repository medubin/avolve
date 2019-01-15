// min inclusive, max exclusive. eg. rng(0,1) => 0 only
export function rng(min : number, max : number) : number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function rngFloat(min : number, max : number) : number {
  return Math.random() * (max - min) + min
}

export function rngBool() : boolean {
  return Math.random() >= 0.5
}

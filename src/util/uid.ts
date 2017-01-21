
let it = 0

export function createShortUID(): string {
  return ((++it * 1e14 + Date.now()) * Math.pow(36, 10)).toString(36)
}

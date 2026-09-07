const STAR_POSITIONS: Array<[number, number, number]> = [
  [6, 14, 1],
  [13, 62, 1],
  [19, 31, 2],
  [27, 78, 1],
  [33, 12, 1],
  [38, 47, 2],
  [44, 88, 1],
  [49, 22, 1],
  [55, 66, 2],
  [61, 8, 1],
  [66, 41, 1],
  [72, 74, 2],
  [78, 19, 1],
  [83, 55, 1],
  [88, 84, 2],
  [92, 33, 1],
  [96, 61, 1],
  [3, 44, 1],
  [23, 95, 1],
  [58, 96, 1],
  [71, 28, 1],
  [86, 6, 1],
]

export const starsBackgroundImage = STAR_POSITIONS.map(
  ([x, y, size]) =>
    `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,.85) 0%, rgba(255,255,255,0) 100%)`,
).join(',')

/** Placeholder tiles for DynamicFrameLayout - generated colored/labeled SVGs
 * so the grid has something to show without depending on real project
 * footage. Swap for real project videos or images before shipping. */
const FRAME_COLORS: Array<[string, string]> = [
  ['#29198f', '#b78cf5'],
  ['#6b2a9e', '#fe6ad8'],
  ['#056bab', '#48f7fa'],
  ['#cb4398', '#f9accc'],
  ['#0d0342', '#fff9ad'],
  ['#29198f', '#48f7fa'],
  ['#6b2a9e', '#b78cf5'],
  ['#056bab', '#f9accc'],
  ['#cb4398', '#fff9ad'],
]

function placeholderFrameImage(n: number, [bg, fg]: [string, string]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${bg}"/><text x="50%" y="50%" font-family="ui-monospace,monospace" font-size="28" fill="${fg}" text-anchor="middle" dominant-baseline="middle">Frame ${n}</text></svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export const dynamicFrameDemoFrames = FRAME_COLORS.map((colors, i) => ({
  id: i + 1,
  image: placeholderFrameImage(i + 1, colors),
  defaultPos: { x: (i * 4) % 12, y: Math.floor(i / 3) * 4, w: 4, h: 4 },
  mediaSize: 1,
}))

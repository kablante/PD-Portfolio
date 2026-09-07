import { useEffect, useRef } from 'react'

interface GrainCanvasProps {
  className?: string
}

/** Two-pass risograph grain (fine noise + coarse stipple dots), ported from
 * the KPop Carrd Figma export's GrainOverlay - that one rendered once at
 * viewport size for a page-wide texture; this scopes the same algorithm to
 * whatever element it's placed in (sized via ResizeObserver), so it can sit
 * inside a single card instead of covering the whole page. */
export function GrainCanvas({ className }: GrainCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function render() {
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      if (w === 0 || h === 0) return
      canvas!.width = w
      canvas!.height = h
      const img = ctx!.createImageData(w, h)
      const d = img.data

      // fine base noise
      for (let i = 0; i < d.length; i += 4) {
        const rand = Math.random()
        if (rand > 0.42) {
          d[i] = 255
          d[i + 1] = 255
          d[i + 2] = 255
          d[i + 3] = Math.floor(rand * 70)
        }
      }
      // coarse stipple pass - larger dot clusters
      for (let y = 0; y < h; y += 3) {
        for (let x = 0; x < w; x += 3) {
          if (Math.random() > 0.62) {
            for (let dy = 0; dy < 2; dy++) {
              for (let dx = 0; dx < 2; dx++) {
                const idx = ((y + dy) * w + (x + dx)) * 4
                if (idx < d.length) {
                  d[idx] = 255
                  d[idx + 1] = 255
                  d[idx + 2] = 255
                  d[idx + 3] = Math.floor(Math.random() * 110 + 30)
                }
              }
            }
          }
        }
      }
      ctx!.putImageData(img, 0, 0)
    }

    render()
    const observer = new ResizeObserver(render)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}

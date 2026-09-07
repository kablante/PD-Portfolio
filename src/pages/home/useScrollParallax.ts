import { type RefObject, useEffect } from 'react'

/** Per-block scroll parallax for the bento grid, so the separate cards drift
 * at different rates instead of moving as one flat frame (ported from the
 * KPop Carrd Figma export's data-parallax-speed convention - each card
 * carried its own speed rather than sharing one transform). Offset is
 * proportional to how far the element's center sits from the viewport
 * center, so cards rest at 0 when centered and separate as the page
 * scrolls. `rotationDeg` is folded into the same transform since each card
 * also has its own static lean. */
export function useScrollParallax(ref: RefObject<HTMLElement | null>, speed: number, rotationDeg: number) {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    function update() {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elCenter = rect.top + rect.height / 2
      const offset = (viewportCenter - elCenter) * speed
      el.style.transform = `translateY(${offset.toFixed(1)}px) rotate(${rotationDeg}deg)`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref, speed, rotationDeg])
}

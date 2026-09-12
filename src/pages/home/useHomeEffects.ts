import { type RefObject, useEffect, useState } from 'react'

const LANG_STORAGE_KEY = 'kb-lang'

export type Lang = 'en' | 'pt'

function readStoredLang(): Lang {
  try {
    return (localStorage.getItem(LANG_STORAGE_KEY) as Lang) || 'en'
  } catch {
    return 'en'
  }
}

/** Bilingual EN/PT toggle. Visibility of `[data-lang]` spans is handled by
 * kb-site.css reading `html[data-active-lang]` — this only owns the state. */
export function useLang() {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    setLangState(readStoredLang())
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-active-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  function setLang(next: Lang) {
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  return { lang, setLang }
}

const MAX_TILT_DEG = 10
// The card that sits on top of the resting pile (see .kb-project-card's
// nth-child z-index in kb-site.css - lowest index = leftmost = highest
// z-index) needs the bigger push on hover, since it's the one that would
// otherwise visually bury the hovered card; the back-of-pile side barely
// needs to move since it's already behind everything. FRONT/BACK name which
// side of the *pile* each constant belongs to, not left/right - see
// recomputeTargets for how that maps onto direction.
const FRONT_SPREAD_PCT = 33.9757 // Aave's flat constant for viewport >=1082px
const BACK_SPREAD_PCT = 5
const ROTATE_STEP_DEG = 2.5
const ACTIVE_SCALE = 1.025
const SPRING_OMEGA = 5 / 0.3 // duration 0.3s, bounce 0

interface Spring {
  x: number
  rot: number
  scale: number
  vx: number
  vrot: number
  vscale: number
}
interface Target {
  x: number
  rot: number
  scale: number
}

/** Pointer-tracked 3D tilt + holo glare (per card, CSS custom properties)
 * plus the Aave-style index-based spread on hover/focus (spring-animated
 * transform on the outer card element). Ported near-verbatim from site.js:
 * this is a frame-by-frame physics sim driven by direct DOM mutation, which
 * doesn't map cleanly onto React state without reintroducing per-frame
 * re-renders, so it stays imperative behind a ref. */
export function useCardSpreadEffects(rowRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    // Touch devices get the one-at-a-time carousel instead (see
    // useCardCarouselActive) - a tap can still synthesize mouseenter/
    // mousemove/mouseleave on many mobile browsers, which would set an
    // inline `transform` here that outranks the carousel's own
    // `transform:none` (see the max-width:700px rules in kb-site.css),
    // bringing back the desktop rotation/tilt/spread on a screen that's
    // meant to show flat, non-rotated cards.
    if (window.matchMedia?.('(pointer: coarse)').matches) return
    const row = rowRef.current
    if (!row) return
    const cards = Array.from(row.querySelectorAll<HTMLAnchorElement>('.kb-project-card'))
    if (!cards.length) return

    const tilts = cards.map((card) => card.querySelector<HTMLDivElement>('.kb-project-card__tilt'))

    // --- pointer tilt + glare ---
    const tiltCleanups: Array<() => void> = []
    cards.forEach((card, i) => {
      const tilt = tilts[i]
      if (!tilt) return
      function onMove(e: MouseEvent) {
        const rect = card.getBoundingClientRect()
        const relX = (e.clientX - rect.left) / rect.width
        const relY = (e.clientY - rect.top) / rect.height
        card.style.setProperty('--pointer-x', `${(relX * 100).toFixed(1)}%`)
        card.style.setProperty('--pointer-y', `${(relY * 100).toFixed(1)}%`)
        const tiltX = ((0.5 - relY) * MAX_TILT_DEG * 2).toFixed(2)
        const tiltY = ((relX - 0.5) * MAX_TILT_DEG * 2).toFixed(2)
        tilt!.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }
      function onLeave() {
        tilt!.style.transform = 'perspective(800px)'
      }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      tiltCleanups.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    // --- index-based spread, spring-animated ---
    const restRotation = cards.map(
      (card) => Number.parseFloat(getComputedStyle(card).getPropertyValue('--card-rot')) || 0,
    )
    const springs: Spring[] = cards.map((_, i) => ({
      x: 0,
      rot: restRotation[i],
      scale: 1,
      vx: 0,
      vrot: 0,
      vscale: 0,
    }))
    const targets: Target[] = cards.map((_, i) => ({ x: 0, rot: restRotation[i], scale: 1 }))
    let activeIndex: number | undefined
    let rafId: number | null = null
    let lastTime: number | null = null

    function recomputeTargets() {
      cards.forEach((_, i) => {
        if (activeIndex === undefined) {
          targets[i] = { x: 0, rot: restRotation[i], scale: 1 }
          return
        }
        const delta = i - activeIndex
        if (delta === 0) {
          targets[i] = { x: 0, rot: 0, scale: ACTIVE_SCALE }
          return
        }
        const distance = Math.abs(delta)
        if (delta < 0) {
          // Physically left of the active card, and - per the pile's
          // z-index - in front of it: the side that needs the big push.
          const wrapCorrection = delta === -(cards.length - 1) ? 0.25 : 1
          targets[i] = {
            x: (-FRONT_SPREAD_PCT / distance) * wrapCorrection,
            rot: restRotation[i] - ROTATE_STEP_DEG / distance,
            scale: 1,
          }
        } else {
          // Physically right of the active card, and behind it in the
          // pile: already covered by nothing, so only a small push.
          targets[i] = {
            x: BACK_SPREAD_PCT / distance,
            rot: restRotation[i] + ROTATE_STEP_DEG / distance,
            scale: 1,
          }
        }
      })
    }

    function step(now: number) {
      if (lastTime === null) lastTime = now
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now
      let settled = true

      cards.forEach((card, i) => {
        const s = springs[i]
        const t = targets[i]
        ;(['x', 'rot', 'scale'] as const).forEach((key) => {
          const vKey = `v${key}` as 'vx' | 'vrot' | 'vscale'
          const accel = -SPRING_OMEGA * SPRING_OMEGA * (s[key] - t[key]) - 2 * SPRING_OMEGA * s[vKey]
          s[vKey] += accel * dt
          s[key] += s[vKey] * dt
          const eps = key === 'scale' ? 0.0005 : 0.01
          if (Math.abs(s[key] - t[key]) > eps || Math.abs(s[vKey]) > eps) settled = false
        })
        const tiltWidth = tilts[i]?.offsetWidth ?? 0
        const px = (s.x / 100) * tiltWidth
        card.style.transform = `translateX(${px.toFixed(2)}px) rotate(${s.rot.toFixed(3)}deg) scale(${s.scale.toFixed(4)})`
      })

      if (!settled) {
        rafId = requestAnimationFrame(step)
      } else {
        rafId = null
        lastTime = null
      }
    }

    function kick() {
      recomputeTargets()
      if (rafId === null) {
        lastTime = null
        rafId = requestAnimationFrame(step)
      }
    }

    const spreadCleanups: Array<() => void> = []
    cards.forEach((card, i) => {
      function onEnter() {
        activeIndex = i
        kick()
      }
      function onLeave() {
        activeIndex = undefined
        kick()
      }
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
      card.addEventListener('focus', onEnter)
      card.addEventListener('blur', onLeave)
      spreadCleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mouseleave', onLeave)
        card.removeEventListener('focus', onEnter)
        card.removeEventListener('blur', onLeave)
      })
    })

    return () => {
      tiltCleanups.forEach((fn) => fn())
      spreadCleanups.forEach((fn) => fn())
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [rowRef])
}

/** Touch counterpart to useCardSpreadEffects: there's no cursor to hover
 * with, so instead whichever card sits nearest the row's horizontal center
 * as the user swipes gets marked `.kb-project-card--active` (see the
 * @media (max-width:700px) carousel rules in kb-site.css), which is what
 * reveals its title the same way :hover does on desktop. It also drives the
 * border-gradient ring's focal point (--pointer-x, the same custom property
 * the desktop pointer-tilt effect sets from the mouse) from each card's own
 * scroll position instead, so the glow sweeps across as it passes center,
 * and shows/hides the prev/next arrows so neither ever points at a card
 * that isn't there. */
export function useCardCarouselActive(rowRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!window.matchMedia?.('(pointer: coarse)').matches) return
    const row = rowRef.current
    if (!row) return
    const cards = Array.from(row.querySelectorAll<HTMLElement>('.kb-project-card'))
    if (!cards.length) return
    const container = row.closest<HTMLElement>('.kb-home-cards')
    const prevButton = container?.querySelector<HTMLElement>('.kb-cards-hint--prev')
    const nextButton = container?.querySelector<HTMLElement>('.kb-cards-hint--next')

    let rafId: number | null = null

    function updateActive() {
      rafId = null
      const rowRect = row!.getBoundingClientRect()
      const rowCenter = rowRect.left + rowRect.width / 2
      let closestIndex = 0
      let closestDist = Number.POSITIVE_INFINITY
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.left + rect.width / 2
        const dist = Math.abs(cardCenter - rowCenter)
        if (dist < closestDist) {
          closestDist = dist
          closestIndex = i
        }
        const pct = Math.max(0, Math.min(100, 50 + ((cardCenter - rowCenter) / rect.width) * 50))
        card.style.setProperty('--pointer-x', `${pct.toFixed(1)}%`)
      })
      cards.forEach((card, i) => card.classList.toggle('kb-project-card--active', i === closestIndex))
      if (prevButton) prevButton.style.display = closestIndex === 0 ? 'none' : ''
      if (nextButton) nextButton.style.display = closestIndex === cards.length - 1 ? 'none' : ''
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(updateActive)
    }

    updateActive()
    row.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      row.removeEventListener('scroll', onScroll)
    }
  }, [rowRef])
}

const SPOTLIGHT_RADIUS = 220
const SPOTLIGHT_BRIGHTNESS = 0.14
const SPOTLIGHT_COLOR = '#fe6ad8' // --kb-magenta

function hexToRgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

/** Site-wide cursor spotlight: a soft light patch following the mouse, like
 * a flashlight over the dark aurora background. A canvas overlay so it
 * applies without touching page markup. */
export function useCursorSpotlight() {
  useEffect(() => {
    if (window.matchMedia?.('(pointer: coarse)').matches) return

    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999',
    })
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      canvas.remove()
      return
    }

    let mouseX = -1000
    let mouseY = -1000
    let rafId: number | null = null
    const rgb = hexToRgb(SPOTLIGHT_COLOR)

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      schedule()
    }
    function draw() {
      rafId = null
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      if (mouseX !== -1000 && document.visibilityState === 'visible') {
        const gradient = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, SPOTLIGHT_RADIUS)
        gradient.addColorStop(0, `rgba(${rgb},${SPOTLIGHT_BRIGHTNESS})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx!.fillStyle = gradient
        ctx!.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
    // Redraws only when the mouse actually moves (still coalesced through
    // rAF so fast mousemove bursts collapse into one paint per frame),
    // instead of an infinite 60fps loop that keeps painting a static image.
    function schedule() {
      if (rafId === null) rafId = requestAnimationFrame(draw)
    }
    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      schedule()
    }
    function onLeave() {
      mouseX = -1000
      mouseY = -1000
      schedule()
    }
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') schedule()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.remove()
    }
  }, [])
}

/** Sitewide grain: a fixed, full-viewport canvas painted with fresh two-pass
 * noise (fine speckle + coarse stipple) on mount and on resize, layered via
 * mix-blend-mode:overlay for a subtle film-grain pass. Sits at z-index:9999,
 * above everything except the hero cards — see .kb-home-cards in kb-site.css
 * for how they outrank it. Replaces nothing — kb-aurora__grain's static CSS
 * texture is untouched.
 *
 * `enabled` (default true) lets a page opt out of this full-page overlay
 * while keeping the static texture on the fixed background — project pages
 * do this, since grain sitting on top of long-form reading content hurt
 * legibility more than it added atmosphere. */
export function useSiteGrain(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.id = 'kb-site-grain'
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999',
      mixBlendMode: 'overlay',
      opacity: '.4',
    })
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      canvas.remove()
      return
    }

    function render() {
      const w = window.innerWidth
      const h = window.innerHeight
      if (!w || !h) return
      canvas.width = w
      canvas.height = h
      const img = ctx!.createImageData(w, h)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const rand = Math.random()
        if (rand > 0.35) {
          d[i] = 255
          d[i + 1] = 255
          d[i + 2] = 255
          d[i + 3] = Math.floor(rand * 85)
        }
      }
      for (let y = 0; y < h; y += 3) {
        for (let x = 0; x < w; x += 3) {
          if (Math.random() > 0.55) {
            for (let dy = 0; dy < 2; dy++) {
              for (let dx = 0; dx < 2; dx++) {
                const idx = ((y + dy) * w + (x + dx)) * 4
                if (idx < d.length) {
                  d[idx] = 255
                  d[idx + 1] = 255
                  d[idx + 2] = 255
                  d[idx + 3] = Math.floor(Math.random() * 90 + 30)
                }
              }
            }
          }
        }
      }
      ctx!.putImageData(img, 0, 0)
    }

    render()
    window.addEventListener('resize', render)

    return () => {
      window.removeEventListener('resize', render)
      canvas.remove()
    }
  }, [enabled])
}

/** Mouse-driven depth parallax on the fixed aurora background: sets
 * --kb-px/--kb-py (-0.5..0.5) which kb-site.css's mesh/star layers read via
 * `translate`. Skipped on touch and reduced-motion. */
export function useAuroraParallax(bgRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    if (window.matchMedia?.('(pointer: coarse)').matches) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    function onMove(e: MouseEvent) {
      const px = e.clientX / window.innerWidth - 0.5
      const py = e.clientY / window.innerHeight - 0.5
      bg!.style.setProperty('--kb-px', px.toFixed(3))
      bg!.style.setProperty('--kb-py', py.toFixed(3))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [bgRef])
}

/** Scroll-scrubbed handoff from the hero wordmark to the Who section's
 * name: as the user scrolls through .kb-home-main (progress 0 -> 1), the
 * logo fades from opacity 1 to 0 while drifting down and shrinking
 * slightly, and .kb-who__h fades in from 0 to 1 the same amount — reads as
 * the logo dissolving into the name rather than two unrelated fades.
 * Scroll-driven (not a one-shot trigger), so it reverses cleanly on scroll
 * back up. Skipped entirely under prefers-reduced-motion: both stay at
 * their normal, fully-visible resting state. */
export function useLogoMorph() {
  useEffect(() => {
    const logo = document.querySelector<HTMLElement>('.kb-hero-lockup')
    const name = document.querySelector<HTMLElement>('.kb-who__h')
    const homeMain = document.querySelector<HTMLElement>('.kb-home-main')
    if (!logo || !name || !homeMain) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let rafId: number | null = null

    function render() {
      rafId = null
      const range = homeMain!.offsetHeight
      const progress = range > 0 ? Math.min(Math.max(window.scrollY / range, 0), 1) : 0
      logo!.style.opacity = String(1 - progress)
      logo!.style.transform = `translateY(${progress * 40}px) scale(${1 - progress * 0.15})`
      name!.style.opacity = String(progress)
      name!.style.transform = `translateY(${(1 - progress) * 16}px)`
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', render)
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', render)
      logo!.style.opacity = ''
      logo!.style.transform = ''
      name!.style.opacity = ''
      name!.style.transform = ''
    }
  }, [])
}

'use client'

// Adapted from the Hyperiux Vault "Stack Spread" component
// (https://vault.hyperiux.com). The original ships its own eight stock
// images and a fixed English headline; this version takes its cards (and
// their click targets) as a prop instead, and its centre copy as ReactNode
// so a caller can pass the site's own bilingual data-lang spans.

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Scroll progress where the cluster starts scattering and where it finishes.
const SCATTER_START = 0.12
const SCATTER_END = 0.9

const PARALLAX_X = 2.6
const PARALLAX_Y = 2.2
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 }
const parallaxDepth = (i: number, total: number) => (total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75)

const RESPONSIVE = {
  desktop: {
    scale: null as number | null,
    small: false,
    colX: null as number | null,
    card: null as { w: number; h: number } | null,
  },
  small: {
    scale: 0.72,
    small: true,
    colX: 22,
    card: { w: 40, h: 20 },
  },
}

function useResponsive() {
  const [r, setR] = useState(RESPONSIVE.desktop)
  useEffect(() => {
    // Touch vs. mouse, not raw width: a narrow but mouse-driven frame keeps
    // the desktop scatter + pointer parallax; only real touch devices drop
    // to the stacked column layout.
    const mq = window.matchMedia('(pointer: coarse)')
    const read = () => setR(mq.matches ? RESPONSIVE.small : RESPONSIVE.desktop)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  return r
}

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, PARALLAX_SPRING)
  const y = useSpring(rawY, PARALLAX_SPRING)

  useEffect(() => {
    if (!enabled) return

    if (!active) {
      rawX.set(0)
      rawY.set(0)
      return
    }

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1)
      rawY.set((event.clientY / window.innerHeight) * 2 - 1)
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [active, enabled, rawX, rawY])

  return { x, y }
}

export interface StackSpreadItem {
  src: string
  alt?: string
  /** Route to navigate to when this card is clicked. */
  href?: string
}

export interface StackSpreadTarget {
  x: number
  y: number
  rotate: number
  scale?: number
  w: number
  /** Ignored (height derives from `aspect` instead) once `aspect` is set. */
  h?: number
  /** width/height ratio (e.g. 16/9) - keeps the card sized to the image's
   * own real aspect ratio instead of `h`'s fixed vh, which was tuned for
   * the original demo's portrait stock photos and crops a landscape
   * screenshot into an arbitrary box. */
  aspect?: number
}

export interface StackSpreadCard {
  item: StackSpreadItem
  target: StackSpreadTarget
  /** final x/y (vw/vh) for tablet + mobile; falls back to `target` */
  targetSm?: { x: number; y: number }
  /** angle while clustered */
  stackRotate?: number
  /** offset while clustered (vw/vh) */
  stackOffset?: { x: number; y: number }
  /** paint order, higher on top */
  z?: number
}

function Card({
  card,
  progress,
  reduce,
  clusterRotation,
  scaleMul,
  isSmall,
  colX,
  fixedCard,
  stackScale,
  cardRadius,
  pointer,
  depth,
}: {
  card: StackSpreadCard
  progress: MotionValue<number>
  reduce: boolean | null
  clusterRotation: boolean
  /** uniform rest-scale for every card; null = use each card's own scale */
  scaleMul: number | null
  isSmall: boolean
  colX: number | null
  fixedCard: { w: number; h: number } | null
  /** scale of the cards while clustered, before the scatter */
  stackScale: number
  /** corner radius on each card, in px (desktop) */
  cardRadius: number
  pointer: { x: MotionValue<number>; y: MotionValue<number> }
  depth: number
}) {
  const { item, target } = card

  const flat = reduce === true
  const stackRotate = flat ? 0 : clusterRotation ? (card.stackRotate ?? 0) : 0
  const stackOffset = card.stackOffset ?? { x: 0, y: 0 }
  const restScale = scaleMul ?? target.scale ?? 1

  // final resting spot: column grid on small screens, scatter on desktop
  const sm = isSmall && card.targetSm ? card.targetSm : null
  const endX = sm ? (colX != null ? Math.sign(sm.x) * colX : sm.x) : target.x
  const endY = sm ? sm.y : target.y
  const endRotate = flat || isSmall ? 0 : target.rotate

  // -50% keeps card centred on its anchor
  const translate = useTransform([progress, pointer.x, pointer.y], ([p, px, py]: number[]) => {
    const tx = stackOffset.x + (endX - stackOffset.x) * p
    const ty = stackOffset.y + (endY - stackOffset.y) * p
    const drift = depth * p
    const dx = tx - px * PARALLAX_X * drift
    const dy = ty - py * PARALLAX_Y * drift
    return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`
  })
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate])
  const scale = useTransform(progress, [0, 1], [stackScale, restScale])

  const width = fixedCard ? fixedCard.w : target.w
  // aspect-ratio derives the height from the rendered width, so it stays
  // correct at every breakpoint - vh-based `h` would need its own mobile
  // override to keep the same ratio once the viewport's own shape changes.
  const height = target.aspect ? undefined : `${fixedCard ? fixedCard.h : (target.h ?? target.w)}vh`

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: `${width}vw`,
        height,
        aspectRatio: target.aspect,
        zIndex: card.z ?? 1,
        translate,
        rotate,
        scale,
      }}
    >
      <CardFace item={item} cardRadius={cardRadius} />
    </motion.div>
  )
}

function CardFace({ item, cardRadius }: { item: StackSpreadItem; cardRadius: number }) {
  const faceRef = useRef<HTMLDivElement>(null)

  // Same pointer-tracked glare + border-glow the Hero cards get on hover
  // (see .kb-project-card__glare/-ring in kb-site.css) - just without their
  // 3D pointer-tilt, which only reads right on a card meant to look like a
  // held photo, not a rectangular screenshot.
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = faceRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * 100
    const relY = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--pointer-x', `${relX.toFixed(1)}%`)
    el.style.setProperty('--pointer-y', `${relY.toFixed(1)}%`)
  }

  const face = (
    <div
      ref={faceRef}
      onMouseMove={onMove}
      className="kb-gallery-card relative h-full w-full overflow-hidden max-md:rounded-[4vw]"
      style={{ borderRadius: `${cardRadius}px` }}
    >
      <img
        src={item.src}
        alt={item.alt ?? ''}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="kb-gallery-card__glare" aria-hidden="true" />
      <span className="kb-gallery-card__glare-ring" aria-hidden="true" />
    </div>
  )

  if (!item.href) return face

  return (
    <Link to={item.href} className="block h-full w-full cursor-pointer" aria-label={item.alt}>
      {face}
    </Link>
  )
}

export interface StackSpreadProps {
  /** The scattering cards - back (z lowest) to front (z highest). */
  cards: StackSpreadCard[]
  /** Centre headline, e.g. a bilingual data-lang pair. */
  title?: ReactNode
  /** Centre subtitle, under the headline. */
  subtitle?: ReactNode
  /** scatter scroll distance, in vh */
  scrollLength?: number
  bgColor?: string
  /** fan the clustered stack (default) or start flat */
  clusterRotation?: boolean
  /** scale of the cards while clustered, before the scatter */
  stackScale?: number
  /** corner radius on each card, in px (desktop only — mobile keeps its responsive radius) */
  cardRadius?: number
  /** color of the centre headline and subtitle */
  textColor?: string
  /** scroll progress (0-1) where the centre text starts fading in */
  textFadeStart?: number
  /** show the "scroll to spread" hint at the bottom until the scatter begins */
  showScrollHint?: boolean
  scrollHint?: ReactNode
}

/** Scroll-driven stage: a clustered pile of cards fans out into a scatter as
 * the reader scrolls through it, each card resolving to its own resting spot
 * (a tidy two-column stack on touch devices, a wide scatter with cursor
 * parallax on desktop). Every card is a link to wherever `item.href` points. */
export default function StackSpread({
  cards,
  title,
  subtitle,
  scrollLength = 350,
  bgColor = 'transparent',
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 8,
  textColor = 'inherit',
  textFadeStart = 0.3,
  showScrollHint = true,
  scrollHint,
}: StackSpreadProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const {
    scale: scaleMul,
    small: isSmall,
    colX,
    card: fixedCard,
  } = useResponsive()

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })

  // hold, scatter, then settle
  const progress = useTransform(scrollYProgress, [0, SCATTER_START, SCATTER_END, 1], [0, 0, 1, 1])

  // centre text always fades in on scroll; the scale-in is dropped only when
  // reduced motion is confirmed (`true`), not on the null SSR value.
  const [spread, setSpread] = useState(false)
  useMotionValueEvent(progress, 'change', (p) => {
    setSpread((was) => (was ? p > 0.985 : p >= 0.999))
  })
  const parallaxEnabled = reduce !== true && !isSmall
  const pointer = usePointerParallax(spread, parallaxEnabled)

  const noScale = reduce === true
  const copyOpacity = useTransform(progress, [textFadeStart, textFadeStart + 0.35], [0, 1])
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.85, 1])

  // scroll hint: visible while clustered, gone by the time the scatter starts
  const hintOpacity = useTransform(progress, [0, SCATTER_START], [1, 0])

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: `${scrollLength}vh`, backgroundColor: bgColor }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {(title || subtitle) && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center max-md:px-8"
            style={{ opacity: copyOpacity, scale: noScale ? 1 : copyScale }}
          >
            {title && (
              <h2
                className="w-full whitespace-pre-line text-[4.5vw] font-normal leading-none! tracking-tight max-md:text-[10vw]"
                style={{ color: textColor, fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-[1.2vw] w-full max-w-[42ch] text-[1.15vw] leading-relaxed tracking-tight max-md:mt-3 max-md:text-[3.6vw]"
                style={{ color: textColor, opacity: 0.6, fontFamily: 'var(--font-body)' }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div className="absolute inset-0 z-10">
          {cards.map((card, i) => (
            <Card
              key={i}
              card={card}
              progress={progress}
              reduce={reduce}
              clusterRotation={clusterRotation}
              scaleMul={scaleMul}
              isSmall={isSmall}
              colX={colX}
              fixedCard={fixedCard}
              stackScale={stackScale}
              cardRadius={cardRadius}
              pointer={pointer}
              depth={parallaxEnabled ? parallaxDepth(i, cards.length) : 0}
            />
          ))}
        </div>

        {showScrollHint && scrollHint && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[3vh] z-20 flex flex-col items-center gap-[0.6vh] text-[0.8vw] font-medium uppercase tracking-[0.2em] max-md:bottom-6 max-md:gap-1 max-md:text-[2.8vw]"
            style={{ color: textColor, opacity: hintOpacity }}
          >
            {scrollHint}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce max-md:h-[4vw] max-md:w-[4vw]"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  )
}

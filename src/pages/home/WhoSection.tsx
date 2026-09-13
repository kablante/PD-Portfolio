import { Download } from 'lucide-react'
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { type MouseEvent, type ReactNode, type RefObject, useEffect, useRef, useState } from 'react'
import Sparkle from '@/components/shared/Sparkle'
import { asset } from '@/lib/asset'
import { SKILLS } from './skills'
import { SCROLL_RANGE } from './useHomeEffects'

const MAX_TILT_DEG = 10
// The portrait's resting tilt, also animate__rotateInDownLeft's end angle;
// PHOTO_ENTRANCE_ROTATE is that same entrance's start angle.
const PHOTO_REST_ROTATE = -4.2
const PHOTO_ENTRANCE_ROTATE = -45

/** Same pointer-tracked 3D tilt + holo glare as the Hero project cards (see
 * useCardSpreadEffects in useHomeEffects.ts) - reimplemented locally since
 * that hook drives a whole row's index-based spread physics, which the
 * portrait (a single static element) has no use for. Returns motion values
 * (rather than writing `element.style.transform` directly, the original
 * approach) so the tilt's rotateX/rotateY can compose with the portrait's
 * own animate__rotateInDownLeft entrance in WhoSection - both are plain
 * `style` values on the same `motion.figure` (this hook's gesture-driven
 * rotateX/rotateY, and the entrance's scroll-driven `rotate`/`opacity`),
 * and motion merges them into a single transform. Skipped on touch devices
 * for the same reason the Hero cards skip it there: a tap can still fire
 * mousemove/mouseleave on some mobile browsers, leaving the tilt stuck
 * mid-gesture instead of resetting like a real pointer leaving. */
function usePhotoTilt() {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  function onMove(event: MouseEvent<HTMLElement>) {
    if (window.matchMedia?.('(pointer: coarse)').matches) return
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width
    const relY = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--pointer-x', `${(relX * 100).toFixed(1)}%`)
    el.style.setProperty('--pointer-y', `${(relY * 100).toFixed(1)}%`)
    rotateX.set((0.5 - relY) * MAX_TILT_DEG * 2)
    rotateY.set((relX - 0.5) * MAX_TILT_DEG * 2)
  }

  function onLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return { rotateX, rotateY, onMove, onLeave }
}

/** A plain animate.css-style entrance (fade + translate, no rotation),
 * scrubbed by scroll position (see SCROLL_RANGE) instead of playing once on
 * view. `from` is the hidden/offset state (e.g. animate__fadeInBottomRight's
 * `{x:'100%', y:'100%'}`); the visible state is always the element's own
 * natural position, untouched. */
function useScrollEntrance(ref: RefObject<HTMLElement | null>, from: { x: string; y: string }) {
  const { scrollYProgress } = useScroll({ target: ref, offset: [...SCROLL_RANGE] })
  const x = useTransform(scrollYProgress, [0, 1], [from.x, '0%'])
  const y = useTransform(scrollYProgress, [0, 1], [from.y, '0%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  return { x, y, opacity }
}

/** The "text selection" look on the vibe-coded confession (see .kb-who__sel
 * in kb-site.css: a highlight bar plus drag-handle "grips" at each end,
 * styled to look like a real text selection). Those shapes are untouched -
 * this only adds a marker-style reveal scrubbed by scroll position (see
 * SCROLL_RANGE): the bar sweeps in from the left, the start grip fades in
 * over the reveal's first fifth, and the end grip rides the same sweep as
 * the bar - starting co-located with the start grip and sliding to the
 * bar's right edge as it grows - so the whole thing reads as a selection
 * being dragged out in step with the scroll, not a bar appearing under two
 * already-placed handles. */
function VibeCodedHighlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: [...SCROLL_RANGE] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const gripStartOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const gripEndLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const gripEndOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  return (
    <span className="kb-who__sel" ref={ref}>
      <motion.span className="kb-who__sel-marker" aria-hidden="true" style={{ scaleX }} />
      <span className="kb-who__sel-text">{children}</span>
      <motion.i
        className="kb-who__grip kb-who__grip--start"
        aria-hidden="true"
        style={{ opacity: gripStartOpacity }}
      />
      <motion.i
        className="kb-who__grip kb-who__grip--end"
        aria-hidden="true"
        style={{ left: gripEndLeft, opacity: gripEndOpacity }}
      />
    </span>
  )
}

/** The Who section - home's second screen, ported from the Bento Blob Lab
 * artifact and reskinned onto Katarina's own tokens/fonts.
 *
 * It is no longer a grid: each module is placed in percentages on a
 * fixed-ratio canvas (see .kb-who in kb-site.css), so the whole
 * arrangement scales as one picture rather than reflowing column by column.
 * That also means there is no per-card scroll parallax any more - the
 * modules are positioned absolutely, so a transform on each one would fight
 * the composition instead of adding depth. */

const TIMEZONE = 'America/Sao_Paulo'

function TimezoneClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <>
      {new Intl.DateTimeFormat('en-GB', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
      }).format(now)}
    </>
  )
}

export default function WhoSection() {
  const { rotateX, rotateY, onMove, onLeave } = usePhotoTilt()

  const photoRef = useRef<HTMLElement>(null)
  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: [...SCROLL_RANGE] })
  const photoRotate = useTransform(photoProgress, [0, 1], [PHOTO_ENTRANCE_ROTATE, PHOTO_REST_ROTATE])
  const photoOpacity = useTransform(photoProgress, [0, 1], [0, 1])

  const clockRef = useRef<HTMLDivElement>(null)
  const clock = useScrollEntrance(clockRef, { x: '-100%', y: '100%' })
  const railRef = useRef<HTMLDivElement>(null)
  const rail = useScrollEntrance(railRef, { x: '100%', y: '100%' })
  const actionsRef = useRef<HTMLDivElement>(null)
  const actions = useScrollEntrance(actionsRef, { x: '100%', y: '100%' })
  const bodyRef = useRef<HTMLDivElement>(null)
  const body = useScrollEntrance(bodyRef, { x: '0%', y: '100%' })

  return (
    <div className="kb-who">
      <motion.figure
        className="kb-who__photo"
        ref={photoRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          rotate: photoRotate,
          opacity: photoOpacity,
          transformPerspective: 800,
          transformOrigin: 'left bottom',
        }}
      >
        <div className="kb-who__slot">
          <span>
            <span data-lang="en">
              PORTRAIT
              <br />
              PLACEHOLDER · 3:4
            </span>
            <span data-lang="pt">
              RETRATO
              <br />
              PLACEHOLDER · 3:4
            </span>
          </span>
        </div>
        <span className="kb-who__photo-glare" aria-hidden="true" />
        <span className="kb-who__photo-glare-ring" aria-hidden="true" />
        <figcaption className="kb-who__handle">@katarinablante</figcaption>
      </motion.figure>

      <motion.div className="kb-who__clock" ref={clockRef} style={clock}>
        <span className="kb-who__time">
          <TimezoneClock />
        </span>
        <span className="kb-who__tz">GMT-3</span>
      </motion.div>

      <header className="kb-who__name">
        <span className="kb-who__eyebrow">
          <span data-lang="en">✦ Who?</span>
          <span data-lang="pt">✦ Quem?</span>
        </span>
        <h2 className="kb-who__h">Katarina Blante</h2>
        <div className="kb-who__meta">
          <span data-lang="en">she / her</span>
          <span data-lang="pt">ela / dela</span>
          <span className="kb-who__dot" aria-hidden="true" />
          <span data-lang="en">Brazilian</span>
          <span data-lang="pt">brasileira</span>
        </div>
      </header>

      <motion.div className="kb-who__rail" ref={railRef} style={rail}>
        <span className="kb-who__rail-label">
          <span data-lang="en">✦ skills &amp; toolkit</span>
          <span data-lang="pt">✦ ferramentas</span>
        </span>
        {SKILLS.map((skill) => (
          <span key={skill.label} className={`kb-who-tag kb-who-tag--${skill.hue}`}>
            {skill.label}
          </span>
        ))}
      </motion.div>

      <motion.div className="kb-who__actions" ref={actionsRef} style={actions}>
        <button
          type="button"
          className="kb-who-btn kb-who-btn--primary"
          onClick={() => window.open('https://www.linkedin.com/in/katarinablante/', '_blank')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
          </svg>
          LinkedIn
        </button>
        <a
          className="kb-who-btn kb-who-btn--ghost"
          href={asset('/assets/Katarina-Blante_Resume.pdf')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download aria-hidden="true" />
          <span data-lang="en">Download Resume</span>
          <span data-lang="pt">Baixar Currículo</span>
        </a>
      </motion.div>

      <div className="kb-who__aside">
        <p>
          <span data-lang="en">
            <VibeCodedHighlight> Full disclosure: I vibe-coded this site </VibeCodedHighlight>
            <br />
            Don't worry, the rest of my work goes through more than vibes!
          </span>
          <span data-lang="pt">
            <VibeCodedHighlight> Aviso: eu vibe-codei este site </VibeCodedHighlight>
            <br />
            Mas fica tranquilo, meu trabalho é mais do que seguir uma vibe!
          </span>
        </p>
      </div>

      <motion.div className="kb-who__body" ref={bodyRef} style={body}>
        <div className="kb-who__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <p>
          <span data-lang="en">
            I design B2B products with complex requirements and business rules. My most recent project was for a
            Silicon Valley hardware manufacturer, designed to coordinate data across production lines, builds, and
            equipment for multiple concurrent user roles. In real projects, there are no easy answers. That's where a
            designer doesn't lose to AI.
          </span>
          <span data-lang="pt">
            Desenho produtos B2B com regras de negócio e requisitos complexos. Meu projeto mais recente foi para uma fabricante de hardware do Vale do Silício, projetado para coordenar dados entre linhas de produção, builds e equipamentos, com múltiplos perfis de usuário simultâneos. Em projetos reais, não existem respostas fáceis. É aí que um designer não perde para a IA.
          </span>
        </p>
        <p>
          <span data-lang="en">
            I work closely with engineering: GitHub and AI-assisted tools are part of my day-to-day work. I don’t leave that to someone else. I’m also building a foundation in Product Management to frame problems more precisely and make better trade-off calls.
          </span>
          <span data-lang="pt">
            Trabalho junto com a engenharia: GitHub e ferramentas de IA fazem parte do meu dia a dia. Não deixo isso para outra pessoa. Agora também estou construindo uma base em Product Management para enquadrar problemas com mais precisão e tomar decisões melhores quando há trade-offs.
          </span>
        </p>
      </motion.div>

      <span className="kb-who__decor kb-who__pip kb-who__pip--a kb-confetti" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--b kb-confetti" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--c kb-confetti" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--d kb-confetti" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--e kb-confetti" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--f kb-confetti" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--g kb-confetti" aria-hidden="true" />
      <Sparkle className="kb-who__decor kb-who__spark kb-who__spark--a kb-confetti" />
      <Sparkle className="kb-who__decor kb-who__spark kb-who__spark--b kb-confetti" />
      <Sparkle className="kb-who__decor kb-who__spark kb-who__spark--c kb-confetti" />
      <span className="kb-who__decor kb-who__blob kb-confetti" aria-hidden="true" />
    </div>
  )
}

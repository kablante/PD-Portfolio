import { Download } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'
import { type MouseEvent, type ReactNode, useEffect, useState } from 'react'
import Sparkle from '@/components/shared/Sparkle'
import { asset } from '@/lib/asset'
import { SKILLS } from './skills'

// How much of an element must be in view before its whileInView reveal
// fires - shared so every entrance on this page triggers at the same
// "distance into the viewport" instead of each picking its own feel.
const REVEAL_VIEWPORT = { once: false, amount: 0.3 } as const
const REVEAL_TRANSITION = { duration: 0.5, ease: 'easeOut' } as const

const MAX_TILT_DEG = 3 // well below the Hero cards' own MAX_TILT_DEG (10) - the portrait's tilt reads more subtle by design
// The portrait's resting tilt, also animate__rotateInDownLeft's end angle;
// PHOTO_ENTRANCE_ROTATE is that same entrance's start angle. Kept modest
// (not the original -45) for the same reason useScrollEntrance's offsets
// are now small px, not 100% of the element's own size: a big rotation
// inflates the element's bounding box while hidden, which both delays and
// destabilizes its whileInView trigger (see useScrollEntrance's comment).
const PHOTO_REST_ROTATE = -4.2
const PHOTO_ENTRANCE_ROTATE = -16

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

/** A plain animate.css-style entrance (fade + translate, no rotation) that
 * plays once when the element scrolls into view and reverses if it scrolls
 * back out (whileInView, viewport.once:false) - not scrubbed continuously
 * against scroll position. `from` is a small, fixed-px offset (not a
 * percentage of the element's own size - a tall block like .kb-who__body
 * offset by 100% of its own height sits hundreds of pixels below its
 * resting spot while hidden, which both delays the reveal (viewport.amount
 * has to clear that much bigger displaced box, not just the real content)
 * and destabilizes it right at the trigger boundary, since the box's own
 * bounding rect swings by that same huge amount as it animates - reads as
 * the element trembling/re-triggering instead of settling once it's
 * roughly on screen). The visible state is always the element's own
 * natural position, untouched. Returns plain props to spread onto a
 * `motion` component. */
function useScrollEntrance(from: { x: number; y: number }) {
  const shouldReduceMotion = useReducedMotion()
  return {
    initial: shouldReduceMotion ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: from.x, y: from.y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: REVEAL_VIEWPORT,
    transition: REVEAL_TRANSITION,
  }
}

/** The "text selection" look on the vibe-coded confession (see .kb-who__sel
 * in kb-site.css: a highlight bar plus drag-handle "grips" at each end,
 * styled to look like a real text selection). Those shapes are untouched -
 * this only adds a marker-style reveal that plays once when scrolled into
 * view and reverses on scroll-out (whileInView): the bar sweeps in from the
 * left while both grips fade in alongside it, reading as a selection being
 * dragged out rather than a bar appearing under two already-placed
 * handles - just no longer scrubbed frame-by-frame against scroll
 * position, so the grips settle into place over a fixed duration instead
 * of tracking scrollYProgress exactly. */
function VibeCodedHighlight({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  // A single whileInView trigger on the outer .kb-who__sel (position:
  // relative, sized by its own text - .kb-who__sel-marker/-grip are
  // position:absolute overlays that don't affect that size) propagated to
  // the marker/grips via variants, rather than each of those three having
  // its own independent whileInView. The marker's scaleX especially would
  // otherwise be observing its own bounding box while that box grows from
  // zero width to full width - the same self-referential trigger problem
  // useScrollEntrance's comment describes, just via scale instead of an
  // offset.
  return (
    <motion.span className="kb-who__sel" initial="hidden" whileInView="visible" viewport={REVEAL_VIEWPORT}>
      <motion.span
        className="kb-who__sel-marker"
        aria-hidden="true"
        variants={{ hidden: { scaleX: shouldReduceMotion ? 1 : 0 }, visible: { scaleX: 1 } }}
        transition={REVEAL_TRANSITION}
      />
      <span className="kb-who__sel-text">{children}</span>
      <motion.i
        className="kb-who__grip kb-who__grip--start"
        aria-hidden="true"
        variants={{ hidden: { opacity: shouldReduceMotion ? 1 : 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
      />
      <motion.i
        className="kb-who__grip kb-who__grip--end"
        aria-hidden="true"
        variants={{
          hidden: { left: shouldReduceMotion ? '100%' : '0%', opacity: shouldReduceMotion ? 1 : 0 },
          visible: { left: '100%', opacity: 1 },
        }}
        transition={REVEAL_TRANSITION}
      />
    </motion.span>
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
  const shouldReduceMotion = useReducedMotion()

  const photoHidden = shouldReduceMotion
    ? { opacity: 1, rotate: PHOTO_REST_ROTATE }
    : { opacity: 0, rotate: PHOTO_ENTRANCE_ROTATE }

  const clock = useScrollEntrance({ x: -24, y: 24 })
  const rail = useScrollEntrance({ x: 24, y: 24 })
  const actions = useScrollEntrance({ x: 24, y: 24 })
  const body = useScrollEntrance({ x: 0, y: 24 })

  return (
    <div className="kb-who">
      <motion.figure
        className="kb-who__photo"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={photoHidden}
        whileInView={{ opacity: 1, rotate: PHOTO_REST_ROTATE }}
        viewport={REVEAL_VIEWPORT}
        transition={REVEAL_TRANSITION}
        style={{ transformOrigin: 'left bottom' }}
      >
        {/* The mouse-tilt rotateX/rotateY live on this inner wrapper, not on
            .kb-who__photo itself (see usePhotoTilt's comment): getBoundingClientRect
            reflects an element's own current transform, so measuring
            relX/relY off the very element being 3D-tilted feeds each
            mousemove frame a rect that already includes the previous
            frame's rotation - near the edges, where the tilt is largest,
            that loop snaps/jitters instead of settling. The outer figure
            (where onMove reads its rect from) only ever gets the
            scroll-driven `rotate`, which doesn't change on mousemove, so
            its rect stays a stable reference - exactly how the Hero
            project cards split .kb-project-card (stable, measured) from
            .kb-project-card__tilt (the one that actually rotates). */}
        <motion.div
          className="kb-who__photo-tilt"
          style={{ rotateX, rotateY, transformPerspective: 800, transformOrigin: 'left bottom' }}
        >
          <div className="kb-who__slot">
            <img className="kb-who__slot-img" src={asset('/assets/portrait.jpg')} alt="Katarina Blante" />
          </div>
          <span className="kb-who__photo-glare" aria-hidden="true" />
          <span className="kb-who__photo-glare-ring" aria-hidden="true" />
          <figcaption className="kb-who__handle">@katarinablante</figcaption>
        </motion.div>
      </motion.figure>

      <motion.div className="kb-who__clock" {...clock}>
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

      <motion.div className="kb-who__rail" {...rail}>
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

      <motion.div className="kb-who__actions" {...actions}>
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

      <motion.div className="kb-who__body" {...body}>
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

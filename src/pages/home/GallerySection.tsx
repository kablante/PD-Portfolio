import { motion, useScroll, useTransform } from 'motion/react'
import type { MouseEvent } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Confetti, { type ConfettiItem } from '@/components/shared/Confetti'
import { asset } from '@/lib/asset'
import { homeProjects } from './projects'
import { SCROLL_RANGE } from './useHomeEffects'

/** Same confetti as the Who and Hero sections (see Confetti.tsx), tucked
 * into the section's own padding gutter so it doesn't sit on top of the
 * grid's images. */
const GALLERY_CONFETTI: ConfettiItem[] = [
  { type: 'pip', left: '2.5%', top: '3%', size: 8, color: 'var(--kb-cyan)', opacity: 0.5 },
  { type: 'pip', left: '97%', top: '4%', size: 10, color: 'var(--kb-blush)', opacity: 0.45 },
  { type: 'pip', left: '3%', top: '97%', size: 9, color: 'var(--kb-magenta)', opacity: 0.42 },
  { type: 'spark', left: '96.5%', top: '95%', size: '2vw', color: 'var(--kb-lavender)', opacity: 0.7 },
]

const vnt = (slug: string) => homeProjects.find((p) => p.slug === slug)!
const boavista = homeProjects.find((p) => p.slug === 'boavista')!
const forShe = homeProjects.find((p) => p.slug === 'for-she')!

interface GalleryItem {
  src: string
  alt: string
  href: string
}

/** Every project's own cover shot, plus two of Side Projects' own case-study
 * screenshots since it has no header image of its own (see hideHeaderImage
 * in projects.ts). */
const ITEMS: GalleryItem[] = [
  {
    src: vnt('VNT-Station-branch').headerImage!,
    alt: vnt('VNT-Station-branch').title,
    href: '/projects/VNT-Station-branch',
  },
  {
    src: vnt('VNT-Help').headerImage!,
    alt: vnt('VNT-Help').title,
    href: '/projects/VNT-Help',
  },
  {
    src: boavista.headerImage!,
    alt: boavista.title,
    href: '/projects/boavista',
  },
  {
    src: forShe.headerImage!,
    alt: forShe.title,
    href: '/projects/for-she',
  },
  {
    src: asset('/assets/projects/side-projects/Fortal_City_-_Cover.png'),
    alt: 'Fortal City',
    href: '/projects/side-projects#fortal-city',
  },
  {
    src: asset('/assets/projects/side-projects/Mobills_Study_-_Cover.png'),
    alt: 'Mobills',
    href: '/projects/side-projects#mobills',
  },
]

// Same pointer-tracked glare + border-glow the Hero cards get on hover (see
// .kb-gallery-card__glare/-ring in kb-site.css).
function onCardPointerMove(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const relX = ((event.clientX - rect.left) / rect.width) * 100
  const relY = ((event.clientY - rect.top) / rect.height) * 100
  el.style.setProperty('--pointer-x', `${relX.toFixed(1)}%`)
  el.style.setProperty('--pointer-y', `${relY.toFixed(1)}%`)
}

/** Gallery — a plain grid of every project's own cover shot, each one a link
 * straight to that project page. */
export default function GallerySection() {
  // animate__fadeInDown, scroll-scrubbed exactly like the Who section's own
  // entrances (same SCROLL_RANGE, same technique - see useScrollEntrance in
  // WhoSection.tsx) rather than a one-shot, duration-based animation: the
  // heading drops in from above and fades in lockstep with scroll position,
  // reversing cleanly if the reader scrolls back up.
  const headingRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: headingProgress } = useScroll({ target: headingRef, offset: [...SCROLL_RANGE] })
  const headingY = useTransform(headingProgress, [0, 1], ['-100%', '0%'])
  const headingOpacity = useTransform(headingProgress, [0, 1], [0, 1])

  return (
    <section className="kb-gallery-section">
      <Confetti items={GALLERY_CONFETTI} />
      <motion.div className="kb-gallery-heading" ref={headingRef} style={{ y: headingY, opacity: headingOpacity }}>
        <span className="kb-gallery-heading__eyebrow">
          <span data-lang="en">case studies</span>
          <span data-lang="pt">estudos de caso</span>
        </span>
        <span className="kb-gallery-heading__title">
          <span data-lang="en">portfolio</span>
          <span data-lang="pt">portfólio</span>
        </span>
      </motion.div>
      <div className="kb-gallery-grid">
        {ITEMS.map((item, i) => (
          <Link
            key={i}
            to={item.href}
            className="kb-gallery-card"
            aria-label={item.alt}
            onMouseMove={onCardPointerMove}
          >
            <img src={item.src} alt={item.alt} loading="lazy" draggable={false} className="kb-gallery-card__img" />
            <span className="kb-gallery-card__glare" aria-hidden="true" />
            <span className="kb-gallery-card__glare-ring" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}

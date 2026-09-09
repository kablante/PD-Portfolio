import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import AuroraBackground from '@/components/shared/AuroraBackground'
import '@/styles/kb-tokens.css'
import '@/styles/kb-components.css'
import '@/styles/kb-site.css'
import LogoWordmark from './LogoWordmark'
import WhoSection from './WhoSection'
import { homeProjects, projectImageTransitionName } from './projects'
import {
  useCardCarouselActive,
  useCardSpreadEffects,
  useCursorSpotlight,
  useLang,
  useLogoMorph,
} from './useHomeEffects'

export default function Home() {
  const rowRef = useRef<HTMLDivElement>(null)
  const { lang, setLang } = useLang()

  useCardSpreadEffects(rowRef)
  useCardCarouselActive(rowRef)
  useCursorSpotlight()
  useLogoMorph()

  function handleShiftCarousel(direction: 1 | -1) {
    const row = rowRef.current
    if (!row) return
    const cards = Array.from(row.querySelectorAll<HTMLElement>('.kb-project-card'))
    const activeIndex = cards.findIndex((card) => card.classList.contains('kb-project-card--active'))
    const target = cards[activeIndex + direction]
    if (!target) return
    // scrollIntoView fights the row's own scroll-snap (the browser can
    // "correct" a smooth scrollIntoView back toward the nearest snap point
    // mid-animation) - scrolling the row itself by the exact distance to
    // the target card's center doesn't have that problem.
    const rowRect = row.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const delta = targetRect.left + targetRect.width / 2 - (rowRect.left + rowRect.width / 2)
    row.scrollBy({ left: delta, behavior: 'smooth' })
  }

  function handleCardClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // On the mobile carousel the arrow sits near the card edges, and a tap
    // meant for it (or for scrubbing past a half-visible neighbor) can land
    // on a card underneath. Only the centered card is a real navigation
    // target there - desktop, where every card is fully its own target,
    // is untouched.
    if (!window.matchMedia?.('(pointer: coarse)').matches) return
    if (!event.currentTarget.classList.contains('kb-project-card--active')) {
      event.preventDefault()
    }
  }

  return (
    <div className="kb-page kb-page--home">
      <AuroraBackground />

      <div className="kb-home-main">
        <div className="kb-home-cards">
          <button
            type="button"
            className="kb-cards-hint kb-cards-hint--prev"
            aria-label="Previous project"
            style={{ display: 'none' }}
            onClick={() => handleShiftCarousel(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="kb-home-cards__row" ref={rowRef}>
            {homeProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="kb-project-card"
                viewTransition
                aria-label={project.title}
                onClick={handleCardClick}
                style={{ '--card-rot': project.rotation } as React.CSSProperties}
              >
                <div className="kb-project-card__tilt">
                  <img
                    className="kb-project-card__img"
                    src={project.image}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    style={{ viewTransitionName: projectImageTransitionName(project.slug) }}
                  />
                  <span className="kb-project-card__scrim" aria-hidden="true" />
                  <span className="kb-project-card__glare" aria-hidden="true" />
                  <span className="kb-project-card__glare-ring" aria-hidden="true" />
                  <p className="kb-project-card__desc">
                    <span data-lang="en">{project.descEn}</span>
                    <span data-lang="pt">{project.descPt}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="kb-cards-hint kb-cards-hint--next"
            aria-label="Next project"
            onClick={() => handleShiftCarousel(1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="kb-hero-lockup">
          <LogoWordmark />
        </div>
      </div>
      <div className="kb-who-section">
        <WhoSection lang={lang} />
      </div>
      <div className="kb-lang-dock">
        <div role="group" aria-label="Language" className="kb-lang-switch">
          <span className="kb-lang-switch__knob" aria-hidden="true" />
          <button type="button" data-lang-btn="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" data-lang-btn="pt" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')}>
            PT
          </button>
        </div>
      </div>
    </div>
  )
}

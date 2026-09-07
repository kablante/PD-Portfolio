import { useRef } from 'react'
import { Link } from 'react-router-dom'
import AuroraBackground from '@/components/shared/AuroraBackground'
import '@/styles/kb-tokens.css'
import '@/styles/kb-components.css'
import '@/styles/kb-site.css'
import BentoGrid from './BentoGrid'
import { homeProjects, projectImageTransitionName } from './projects'
import { useCardSpreadEffects, useCursorSpotlight, useLang } from './useHomeEffects'

export default function Home() {
  const rowRef = useRef<HTMLDivElement>(null)
  const { lang, setLang } = useLang()

  useCardSpreadEffects(rowRef)
  useCursorSpotlight()

  return (
    <div className="kb-page kb-page--home">
      <AuroraBackground />

      <div className="kb-home-main">
        <div className="kb-home-cards">
          <div className="kb-home-cards__row" ref={rowRef}>
            {homeProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="kb-project-card"
                viewTransition
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
                  <span className="kb-project-card__title">
                    <span data-lang="en">{project.title}</span>
                    <span data-lang="pt">{project.title}</span>
                  </span>
                  <p className="kb-project-card__desc">
                    <span data-lang="en">{project.descEn}</span>
                    <span data-lang="pt">{project.descPt}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="kb-hero-lockup">
          <span data-lang="en">
            <img
              className="kb-hero-lockup__logo"
              src="/assets/logo-wordmark.svg"
              alt="Katarina Blante — product designer"
            />
          </span>
          <span data-lang="pt">
            <img
              className="kb-hero-lockup__logo"
              src="/assets/logo-wordmark-pt.svg"
              alt="Katarina Blante — designer de produto"
            />
          </span>
        </div>
      </div>
      <div className="kb-home-blank">
        <BentoGrid lang={lang} />
      </div>
      <div className="kb-lang-dock">
        <div role="group" aria-label="Language" className="kb-lang-switch">
          <span className="kb-lang-switch__knob" aria-hidden="true" />
          <button type="button" data-lang-btn="en" onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" data-lang-btn="pt" onClick={() => setLang('pt')}>
            PT
          </button>
        </div>
      </div>
    </div>
  )
}

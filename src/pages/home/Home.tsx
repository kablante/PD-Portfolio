import { Download } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import '@/styles/kb-tokens.css'
import '@/styles/kb-components.css'
import '@/styles/kb-site.css'
import { homeProjects } from './projects'
import { starsBackgroundImage } from './starsBackground'
import {
  downloadCvPlaceholder,
  useAuroraParallax,
  useCardSpreadEffects,
  useCursorSpotlight,
  useFooterbarStuck,
  useLang,
} from './useHomeEffects'

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const { lang, setLang } = useLang()
  const isStuck = useFooterbarStuck()

  useCardSpreadEffects(rowRef)
  useCursorSpotlight()
  useAuroraParallax(bgRef)

  return (
    <div className="kb-page kb-page--home">
      <div className="kb-bg" aria-hidden="true" ref={bgRef}>
        <div className="kb-aurora">
          <span className="kb-aurora__mesh" />
          <span className="kb-aurora__stars" style={{ backgroundImage: starsBackgroundImage }} />
          <span className="kb-aurora__grain" />
        </div>
      </div>

      <div className="kb-home-main">
        <div className="kb-home-cards">
          <div className="kb-home-cards__row" ref={rowRef}>
            {homeProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="kb-project-card"
                style={{ '--card-rot': project.rotation } as React.CSSProperties}
              >
                <div className="kb-project-card__tilt">
                  <img
                    className="kb-project-card__img"
                    src={project.image}
                    alt=""
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="kb-project-card__grain" aria-hidden="true" />
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
      <div className="kb-home-blank" aria-hidden="true" />
      <div className={`kb-footerbar kb-footerbar--float-left${isStuck ? ' is-stuck' : ''}`}>
        <Link to="/" className="kb-footerbar__logo" aria-label="Katarina Blante — home">
          <img src="/assets/logo-kb-mark.svg" alt="k·B" />
        </Link>

        <div className="kb-footerbar__actions">
          <button
            type="button"
            className="kb-icon-btn kb-icon-btn--outline"
            aria-label="LinkedIn"
            onClick={() => window.open('https://www.linkedin.com/in/katarinablante/', '_blank')}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
            </svg>
          </button>
          <button
            type="button"
            className="kb-icon-btn kb-icon-btn--outline"
            aria-label="Download CV"
            onClick={() => downloadCvPlaceholder(lang)}
          >
            <Download size={20} aria-hidden="true" />
          </button>
        </div>

        <div role="group" aria-label="Language" className="kb-lang-switch">
          <span className="kb-lang-switch__knob" aria-hidden="true" />
          <button type="button" data-lang-btn="en" onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" data-lang-btn="pt" onClick={() => setLang('pt')}>
            PT
          </button>
        </div>

        <span className="kb-footerbar__copy">© 2026 Katarina Blante · product designer</span>
      </div>
    </div>
  )
}

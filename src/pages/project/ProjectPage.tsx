import { Download } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AuroraBackground from '@/components/shared/AuroraBackground'
import '@/styles/kb-tokens.css'
import '@/styles/kb-components.css'
import '@/styles/kb-site.css'
import { homeProjects, projectImageTransitionName } from '../home/projects'
import { downloadCvPlaceholder, useCursorSpotlight, useLang } from '../home/useHomeEffects'
import { asset } from '@/lib/asset'
import ForShe from './case-studies/ForShe'
import Boavista from './case-studies/Boavista'
import SideProjects from './case-studies/SideProjects'
import VNTHelp from './case-studies/VNTHelp'

/** Registry of the actual case-study content, keyed by slug. Most project
 * cards don't have a written case study yet - this is deliberately just the
 * site chrome (aurora background, top nav bar, back link, header image) for
 * those, so each card has somewhere real to land instead of a dead link. */
const caseStudies: Partial<Record<string, React.ComponentType>> = {
  'for-she': ForShe,
  'boavista': Boavista,
  'side-projects': SideProjects,
  'VNT-Help': VNTHelp,
}

/** Renders the "Name" / "Subtitle" title pair and sizes the subtitle so it
 * spans the same width as the name in one line, never larger than the
 * name's own font size. A hidden span (same font, same nowrap) measures how
 * wide the subtitle text would be at the name's font size; scaling down by
 * container-width/measured-width gives the largest size that still fits on
 * one line - capped at the name's size for text short enough to not need
 * shrinking. Recomputed on resize and whenever the title text changes. */
function FittedProjectTitle({ name, subtitle }: { name: string; subtitle: string | null }) {
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [subtitleFontSize, setSubtitleFontSize] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!subtitle) return
    const nameEl = nameRef.current
    const subtitleEl = subtitleRef.current
    const measureEl = measureRef.current
    if (!nameEl || !subtitleEl || !measureEl) return

    function recalc() {
      const nameFontSize = parseFloat(getComputedStyle(nameEl!).fontSize)
      const containerWidth = subtitleEl!.clientWidth
      measureEl!.style.fontSize = `${nameFontSize}px`
      const naturalWidth = measureEl!.getBoundingClientRect().width
      // Slight safety margin so a sub-pixel measurement/rounding difference
      // between the hidden measurer and the real element never clips a
      // trailing character.
      const fitSize = naturalWidth > 0 ? (nameFontSize * containerWidth) / naturalWidth / 1.01 : nameFontSize
      setSubtitleFontSize(Math.min(nameFontSize, fitSize))
    }

    recalc()
    window.addEventListener('resize', recalc)
    // The display font may still be loading at first paint - the fallback
    // font's metrics can differ enough from the real one to throw the fit
    // off, so measure again once every font is actually ready.
    document.fonts?.ready.then(recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [name, subtitle])

  return (
    <>
      <h1 ref={nameRef} className="kb-project-title">
        {name}
      </h1>
      {subtitle && (
        <p
          ref={subtitleRef}
          className="kb-project-subtitle"
          style={subtitleFontSize ? { fontSize: `${subtitleFontSize}px` } : undefined}
        >
          {subtitle}
        </p>
      )}
      {subtitle && (
        <span ref={measureRef} className="kb-project-subtitle-measure" aria-hidden="true">
          {subtitle}
        </span>
      )}
    </>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = homeProjects.find((p) => p.slug === slug)
  const { lang, setLang } = useLang()

  useCursorSpotlight()

  if (!project) return <Navigate to="/" replace />

  const CaseStudy = caseStudies[project.slug]
  const activeTitle = lang === 'pt' && project.titlePt ? project.titlePt : project.title
  const colonIndex = activeTitle.indexOf(':')
  const titleName = colonIndex === -1 ? activeTitle : activeTitle.slice(0, colonIndex)
  const titleSubtitle = colonIndex === -1 ? null : activeTitle.slice(colonIndex + 1).trim()

  return (
    <div className="kb-page">
      <AuroraBackground grainOverlay={false} />

      <div className="kb-footerbar kb-footerbar--top">
        <Link to="/" className="kb-footerbar__logo" aria-label="Katarina Blante — home">
          <img src={asset("/assets/logo-kb-mark.svg")} alt="k·B" />
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
          <button type="button" data-lang-btn="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" data-lang-btn="pt" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')}>
            PT
          </button>
        </div>

        <span className="kb-footerbar__copy">© 2026 Katarina Blante · product designer</span>
      </div>

      <div className="kb-content">
        {!project.hideHeaderImage && (
          <div className="kb-project-header">
            <img
              className="kb-project-header__img"
              src={project.headerImage ?? project.image}
              alt=""
              style={{ viewTransitionName: projectImageTransitionName(project.slug) }}
            />
          </div>
        )}

        <article className="kb-project-body">
          <FittedProjectTitle name={titleName} subtitle={titleSubtitle} />
          {CaseStudy && <CaseStudy />}
        </article>
      </div>
    </div>
  )
}

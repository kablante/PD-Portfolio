import { Navigate, useParams } from 'react-router-dom'
import { useLayoutEffect, useRef, useState } from 'react'
import AuroraBackground from '@/components/shared/AuroraBackground'
import '@/styles/kb-tokens.css'
import '@/styles/kb-components.css'
import '@/styles/kb-site.css'
import { homeProjects, projectImageTransitionName } from '../home/projects'
import { useCursorSpotlight, useLang } from '../home/useHomeEffects'
import ProjectSidebar from './ProjectSidebar'
import ForShe from './case-studies/ForShe'
import Boavista from './case-studies/Boavista'
import SideProjects from './case-studies/SideProjects'
import VNTHelp from './case-studies/VNTHelp'
import VNTStationBranch from './case-studies/VNTStationBranch'

/** Registry of the actual case-study content, keyed by slug. Most project
 * cards don't have a written case study yet - this is deliberately just the
 * site chrome (aurora background, top nav bar, back link, header image) for
 * those, so each card has somewhere real to land instead of a dead link. */
const caseStudies: Partial<Record<string, React.ComponentType>> = {
  'for-she': ForShe,
  'boavista': Boavista,
  'side-projects': SideProjects,
  'VNT-Help': VNTHelp,
  'VNT-Station-branch': VNTStationBranch,
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
  const articleRef = useRef<HTMLElement>(null)

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

      <div className="kb-project-layout">
        <ProjectSidebar project={project} lang={lang} setLang={setLang} contentRef={articleRef} />

        <div className={`kb-content${project.hideHeaderImage ? ' kb-content--no-header' : ''}`}>
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

          <article className="kb-project-body" ref={articleRef}>
            <FittedProjectTitle name={titleName} subtitle={titleSubtitle} />
            {CaseStudy && <CaseStudy />}
          </article>
        </div>
      </div>
    </div>
  )
}

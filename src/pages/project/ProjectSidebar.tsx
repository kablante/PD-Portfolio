import { BookOpen, Download, Home, LayoutGrid, Menu, X } from 'lucide-react'
import { type RefObject, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '@/lib/asset'
import { homeProjects, type HomeProject } from '../home/projects'
import type { Lang } from '../home/useHomeEffects'

interface SectionLink {
  id: string
  label: string
  level: number
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '') || 'section'
  )
}

/** Scans `containerRef` for h1/h2/h3 elements, assigns each a stable id (so
 * the nav can link to it), and tracks which one the reader has scrolled
 * past most recently. Re-scans whenever the case study's own content
 * changes language, since a heading's current-language text (read from its
 * `[data-lang]` child, or its own text when it has none - the page's own
 * h1 isn't bilingual-split, it's just re-rendered in the active language)
 * is what gets slugified into that heading's id. */
function useSectionNav(containerRef: RefObject<HTMLElement | null>, lang: Lang, resetKey: string) {
  const [sections, setSections] = useState<SectionLink[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // A plain effect, not a layout one: ProjectSidebar sits before the
  // article in the JSX tree, and React runs layout effects sibling by
  // sibling in that same order - a layout effect here would fire before
  // the article (and its ref) has even committed. Effects instead run
  // after the whole tree has committed, so containerRef.current is
  // guaranteed to be set by the time this runs.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const headingEls = Array.from(container.querySelectorAll<HTMLElement>('h1, h2, h3'))
    const used = new Set<string>()
    const next = headingEls.map((el) => {
      const langSpan = el.querySelector<HTMLElement>(`[data-lang="${lang}"]`)
      const label = (langSpan?.textContent ?? el.textContent ?? '').trim()
      const base = slugify(label)
      let id = base
      let n = 2
      while (used.has(id)) id = `${base}-${n++}`
      used.add(id)
      el.id = id
      return { id, label, level: Number(el.tagName[1]) }
    })
    setSections(next)
  }, [containerRef, lang, resetKey])

  useEffect(() => {
    if (sections.length === 0) return
    let frame = 0
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const offset = 140
        let current: string | null = sections[0]?.id ?? null
        for (const s of sections) {
          const el = document.getElementById(s.id)
          if (el && el.getBoundingClientRect().top - offset <= 0) current = s.id
        }
        setActiveId(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [sections])

  return { sections, activeId }
}

interface ProjectSidebarProps {
  project: HomeProject
  lang: Lang
  setLang: (lang: Lang) => void
  contentRef: RefObject<HTMLElement | null>
}

/** Replaces the old fixed top navbar on project pages: back-to-home, the
 * language switch, an auto-generated "on this page" outline (every
 * h1/h2/h3 the current case study renders), links to every other project,
 * and the same LinkedIn/résumé actions as the Home page's Who section.
 * Collapses into a slide-in drawer under 960px - see .kb-sidebar in
 * kb-site.css. */
export default function ProjectSidebar({ project, lang, setLang, contentRef }: ProjectSidebarProps) {
  const [open, setOpen] = useState(false)
  const { sections, activeId } = useSectionNav(contentRef, lang, project.slug)
  const otherProjects = homeProjects.filter((p) => p.slug !== project.slug)

  useEffect(() => {
    setOpen(false)
  }, [project.slug])

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  // React Router doesn't reset scroll on navigation - without this, "back
  // to home" leaves the window wherever it was on the project page, which
  // (given how tall the Who section is) usually lands there instead of the
  // Hero section at the actual top of the page.
  function goHome() {
    setOpen(false)
    window.scrollTo({ top: 0, left: 0 })
  }

  return (
    <>
      <button
        type="button"
        className="kb-sidebar-toggle"
        aria-label={lang === 'pt' ? 'Abrir menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      {open && <div className="kb-sidebar-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside className={`kb-sidebar${open ? ' kb-sidebar--open' : ''}`}>
        <Link to="/" className="kb-sidebar__item" onClick={goHome}>
          <Home size={16} aria-hidden="true" />
          <span data-lang="en">Back to home</span>
          <span data-lang="pt">Voltar ao início</span>
        </Link>

        {sections.length > 0 && (
          <nav className="kb-sidebar__section" aria-label={lang === 'pt' ? 'Este projeto' : 'This project'}>
            <span className="kb-sidebar__section-header">
              <BookOpen size={16} aria-hidden="true" />
              <span data-lang="en">This project</span>
              <span data-lang="pt">Este projeto</span>
            </span>
            <ul className="kb-sidebar__section-body">
              {sections.map((section) => (
                <li key={section.id} className={`kb-sidebar__nav-item kb-sidebar__nav-item--level-${section.level}`}>
                  <a
                    href={`#${section.id}`}
                    className={activeId === section.id ? 'is-active' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      jumpTo(section.id)
                    }}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="kb-sidebar__section" aria-label={lang === 'pt' ? 'Outros projetos' : 'Other projects'}>
          <span className="kb-sidebar__section-header">
            <LayoutGrid size={16} aria-hidden="true" />
            <span data-lang="en">Other projects</span>
            <span data-lang="pt">Outros projetos</span>
          </span>
          <ul className="kb-sidebar__section-body">
            {otherProjects.map((p) => {
              const t = lang === 'pt' && p.titlePt ? p.titlePt : p.title
              return (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`} onClick={() => setOpen(false)}>
                    {t}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div role="group" aria-label="Language" className="kb-lang-switch kb-sidebar__lang">
          <span className="kb-lang-switch__knob" aria-hidden="true" />
          <button type="button" data-lang-btn="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" data-lang-btn="pt" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')}>
            PT
          </button>
        </div>

        <div className="kb-sidebar__actions">
          <button
            type="button"
            className="kb-sidebar-btn kb-sidebar-btn--primary"
            onClick={() => window.open('https://www.linkedin.com/in/katarinablante/', '_blank')}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
            </svg>
            LinkedIn
          </button>
          <a
            className="kb-sidebar-btn kb-sidebar-btn--ghost"
            href={asset('/assets/Katarina-Blante_Resume.pdf')}
            download="Katarina-Blante_Resume.pdf"
          >
            <Download size={16} aria-hidden="true" />
            <span data-lang="en">Download Resume</span>
            <span data-lang="pt">Baixar Currículo</span>
          </a>
        </div>
      </aside>
    </>
  )
}

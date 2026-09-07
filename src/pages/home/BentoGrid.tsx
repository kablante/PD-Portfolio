import { Download } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Blob, Sparkle4, SmallDiamond } from './bentoDecor'
import { type Lang, downloadCvPlaceholder } from './useHomeEffects'
import { useScrollParallax } from './useScrollParallax'

/** Home's second section - a bento profile grid, ported from the KPop Carrd
 * Figma export and reskinned onto Katarina's own tokens/fonts/content.
 * Each card is a separate positioned element (not a single flat frame) so
 * the per-card scroll parallax below actually has something to move. */

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

const SKILLS: Array<{ label: string; hue: 'magenta' | 'violet' | 'cyan' | 'pink' }> = [
  { label: 'AI-Assisted Design Workflows', hue: 'magenta' },
  { label: 'Enterprise UX Design', hue: 'violet' },
  { label: 'Cross-functional Collaboration', hue: 'cyan' },
  { label: 'Figma', hue: 'pink' },
  { label: 'GitHub', hue: 'violet' },
  { label: 'User Research', hue: 'magenta' },
]

export default function BentoGrid({ lang }: { lang: Lang }) {
  const photoRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const tzRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  useScrollParallax(photoRef, 0.06, -1.8)
  useScrollParallax(nameRef, 0.1, 1)
  useScrollParallax(tzRef, 0.18, 2.2)
  useScrollParallax(introRef, 0.05, -0.6)
  useScrollParallax(btnsRef, 0.2, 1.5)
  useScrollParallax(skillsRef, 0.15, -1.2)

  return (
    <div className="kb-bento">
      <div className="kb-bento-card kb-bento-card--photo" ref={photoRef} style={{ gridArea: 'photo' }}>
        <div className="kb-portrait-slot kb-bento-card__slot">
          <span className="kb-slot-label">
            <span data-lang="en">PORTRAIT PLACEHOLDER · 3:4</span>
            <span data-lang="pt">FOTO · PLACEHOLDER · 3:4</span>
          </span>
        </div>
        <div className="kb-bento-card__handle">@katarinablante</div>
        <Sparkle4
          size={30}
          color="var(--kb-blush)"
          style={{ position: 'absolute', top: -14, right: -14, zIndex: 20, filter: 'drop-shadow(0 0 10px rgba(249,172,204,.7))' }}
        />
        <Blob
          color="rgba(254,106,216,.5)"
          width={76}
          height={60}
          style={{ bottom: -20, left: -16, zIndex: 20, boxShadow: '0 0 24px rgba(254,106,216,.4)' }}
        />
      </div>

      <div className="kb-bento-card kb-bento-card--name" ref={nameRef} style={{ gridArea: 'name' }}>
        <span className="kb-bento-card__eyebrow">
          <span data-lang="en">✦ Who?</span>
          <span data-lang="pt">✦ Quem?</span>
        </span>
        <h1 className="kb-bento-card__name">Katarina Blante</h1>
        <div className="kb-bento-card__meta">
          <span data-lang="en">she / her</span>
          <span data-lang="pt">ela / dela</span>
          <span className="kb-bento-card__dot" aria-hidden="true" />
          <span data-lang="en">Brazilian</span>
          <span data-lang="pt">brasileira</span>
        </div>
        <div className="kb-bento-card__rule" aria-hidden="true" />
        <SmallDiamond
          size={18}
          color="var(--kb-magenta)"
          style={{ position: 'absolute', top: 18, right: 24, filter: 'drop-shadow(0 0 8px rgba(254,106,216,.7))' }}
        />
      </div>

      <div className="kb-bento-card kb-bento-card--tz" ref={tzRef} style={{ gridArea: 'tz' }}>
        <span className="kb-bento-card__eyebrow kb-bento-card__eyebrow--cyan">
          <span data-lang="en">timezone</span>
          <span data-lang="pt">fuso horário</span>
        </span>
        <div className="kb-bento-card__clock">
          <TimezoneClock />
        </div>
        <span className="kb-bento-card__tz-label">GMT-3</span>
      </div>

      <div className="kb-bento-card kb-bento-card--intro" ref={introRef} style={{ gridArea: 'intro' }}>
        <div className="kb-bento-card__intro-text">
          <p>
            <span data-lang="en">
              <em>(Full disclosure: I vibe-coded this site.)</em> Don't worry, the rest of my work goes through more
              than vibes.
            </span>
            <span data-lang="pt">
              <em>(Aviso sincero: eu vibe-codei este site.)</em> Pode ficar tranquilo, o resto do meu trabalho passa
              por bem mais do que vibe.
            </span>
          </p>
          <p>
            <span data-lang="en">
              I design <em>(B2B products with complex requirements)</em> and business rules. My most recent project
              was for a Silicon Valley hardware manufacturer, designed to coordinate data across production lines,
              builds, and equipment for multiple concurrent user roles. In real projects, there are no easy answers.
              That's where a designer doesn't lose to AI.
            </span>
            <span data-lang="pt">
              Eu desenho <em>(produtos B2B com requisitos complexos)</em> e regras de negócio. Meu projeto mais
              recente foi para uma fabricante de hardware do Vale do Silício, pensado para coordenar dados entre
              linhas de produção, builds e equipamentos, para múltiplos perfis de usuário simultâneos. Em projetos
              reais, não existem respostas fáceis. É aí que um designer não perde para a IA.
            </span>
          </p>
          <p>
            <span data-lang="en">
              I work <em>(close to engineering)</em>: GitHub, dev teams, AI-assisted tools are part of the job, not
              someone else's. Right now I'm also building product management fundamentals: sharper problem framing,
              better trade-off calls.
            </span>
            <span data-lang="pt">
              Eu trabalho <em>(perto da engenharia)</em>: GitHub, times de dev, ferramentas com IA fazem parte do
              trabalho, não são tarefa de outra pessoa. Agora também estou construindo fundamentos de product
              management: enquadrar problemas com mais precisão, tomar decisões de trade-off melhores.
            </span>
          </p>
        </div>
        <Sparkle4
          size={20}
          color="var(--kb-lavender)"
          style={{ position: 'absolute', bottom: 20, right: 28, opacity: 0.6 }}
        />
      </div>

      <div className="kb-bento-card kb-bento-card--btns" ref={btnsRef} style={{ gridArea: 'btns' }}>
        <button
          type="button"
          className="kb-bento-btn kb-bento-btn--primary"
          onClick={() => window.open('https://www.linkedin.com/in/katarinablante/', '_blank')}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
          </svg>
          LinkedIn
        </button>
        <button type="button" className="kb-bento-btn kb-bento-btn--ghost" onClick={() => downloadCvPlaceholder(lang)}>
          <Download size={20} aria-hidden="true" />
          <span data-lang="en">Download CV</span>
          <span data-lang="pt">Baixar currículo</span>
        </button>
      </div>

      <div className="kb-bento-card kb-bento-card--skills" ref={skillsRef} style={{ gridArea: 'skills' }}>
        <span className="kb-bento-card__eyebrow">
          <span data-lang="en">✦ skills &amp; toolkit</span>
          <span data-lang="pt">✦ ferramentas</span>
        </span>
        <div className="kb-bento-card__tags">
          {SKILLS.map((skill) => (
            <span key={skill.label} className={`kb-bento-tag kb-bento-tag--${skill.hue}`}>
              {skill.label}
            </span>
          ))}
        </div>
        <SmallDiamond
          size={16}
          color="var(--kb-blush)"
          style={{ position: 'absolute', top: 22, right: 22, filter: 'drop-shadow(0 0 6px rgba(249,172,204,.7))' }}
        />
      </div>
    </div>
  )
}

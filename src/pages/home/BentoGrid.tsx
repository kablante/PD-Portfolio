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
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <>
      {new Intl.DateTimeFormat('en-GB', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now)}
    </>
  )
}

const SKILLS: Array<{ label: string; hue: 'magenta' | 'violet' | 'cyan' | 'pink' }> = [
  { label: 'Product Design', hue: 'magenta' },
  { label: 'Design Systems', hue: 'violet' },
  { label: 'Figma', hue: 'cyan' },
  { label: 'Prototyping', hue: 'pink' },
  { label: 'User Research', hue: 'violet' },
  { label: 'UX Writing', hue: 'magenta' },
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
          <span data-lang="en">✦ profile</span>
          <span data-lang="pt">✦ perfil</span>
        </span>
        <h1 className="kb-bento-card__name">Katarina Blante</h1>
        <div className="kb-bento-card__meta">
          <span data-lang="en">she / her</span>
          <span data-lang="pt">ela / dela</span>
          <span className="kb-bento-card__dot" aria-hidden="true" />
          <span data-lang="en">product designer</span>
          <span data-lang="pt">designer de produto</span>
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
        <span className="kb-bento-card__tz-label">São Paulo · GMT-3</span>
        <div className="kb-bento-card__online">
          <span className="kb-bento-card__online-dot" aria-hidden="true" />
          <span data-lang="en">online</span>
          <span data-lang="pt">online</span>
        </div>
      </div>

      <div className="kb-bento-card kb-bento-card--intro" ref={introRef} style={{ gridArea: 'intro' }}>
        <p className="kb-bento-card__intro-text">
          <span data-lang="en">
            I design the screens between "I need this" and "it's done" — signup flows, dashboards, the parts of a
            product people actually spend their day in.{' '}
            <em>Six years, mostly fintech and marketplaces.</em>
          </span>
          <span data-lang="pt">
            Desenho as telas entre "eu preciso disso" e "está feito" — fluxos de cadastro, dashboards, as partes de
            um produto em que as pessoas realmente passam o dia. <em>Seis anos, principalmente fintech e marketplaces.</em>
          </span>
        </p>
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
          <span data-lang="en">✉ get in touch</span>
          <span data-lang="pt">✉ fale comigo</span>
        </button>
        <button type="button" className="kb-bento-btn kb-bento-btn--ghost" onClick={() => downloadCvPlaceholder(lang)}>
          <span data-lang="en">⬇ download CV</span>
          <span data-lang="pt">⬇ baixar currículo</span>
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

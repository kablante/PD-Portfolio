import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type Lang, downloadCvPlaceholder } from './useHomeEffects'

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

const SKILLS: Array<{ label: string; hue: 'magenta' | 'violet' | 'cyan' | 'pink' }> = [
  { label: 'AI-Assisted Design Workflows', hue: 'magenta' },
  { label: 'Enterprise UX Design', hue: 'violet' },
  { label: 'Cross-functional Collaboration', hue: 'cyan' },
  { label: 'Figma', hue: 'pink' },
  { label: 'GitHub', hue: 'violet' },
  { label: 'User Research', hue: 'magenta' },
]

/** Four-point sparkle, sized and positioned from CSS with the rest of the
 * decor rather than through props. */
function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="currentColor" aria-hidden="true">
      <path d="M14 0 L15.8 12.2 L28 14 L15.8 15.8 L14 28 L12.2 15.8 L0 14 L12.2 12.2 Z" />
    </svg>
  )
}

export default function WhoSection({ lang }: { lang: Lang }) {
  return (
    <div className="kb-who">
      <figure className="kb-who__photo">
        <div className="kb-who__slot">
          <span>
            <span data-lang="en">
              PORTRAIT
              <br />
              PLACEHOLDER · 3:4
            </span>
            <span data-lang="pt">
              RETRATO
              <br />
              PLACEHOLDER · 3:4
            </span>
          </span>
        </div>
        <figcaption className="kb-who__handle">@katarinablante</figcaption>
      </figure>

      <div className="kb-who__clock">
        <span className="kb-who__time">
          <TimezoneClock />
        </span>
        <span className="kb-who__tz">GMT-3</span>
      </div>

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

      <div className="kb-who__rail">
        <span className="kb-who__rail-label">
          <span data-lang="en">✦ skills &amp; toolkit</span>
          <span data-lang="pt">✦ ferramentas</span>
        </span>
        {SKILLS.map((skill) => (
          <span key={skill.label} className={`kb-who-tag kb-who-tag--${skill.hue}`}>
            {skill.label}
          </span>
        ))}
      </div>

      <div className="kb-who__actions">
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
        <button type="button" className="kb-who-btn kb-who-btn--ghost" onClick={() => downloadCvPlaceholder(lang)}>
          <Download aria-hidden="true" />
          <span data-lang="en">Download CV</span>
          <span data-lang="pt">Baixar CV</span>
        </button>
      </div>

      <div className="kb-who__aside">
        <p>
          <span data-lang="en">
            <span className="kb-who__sel">
              Full disclosure: I vibe-coded this site.
              <i className="kb-who__grip kb-who__grip--start" aria-hidden="true" />
              <i className="kb-who__grip kb-who__grip--end" aria-hidden="true" />
            </span>
            <br />
            Don't worry, the rest of my work goes through more than vibes.
          </span>
          <span data-lang="pt">
            <span className="kb-who__sel">
              Aviso sincero: eu vibe-codei este site.
              <i className="kb-who__grip kb-who__grip--start" aria-hidden="true" />
              <i className="kb-who__grip kb-who__grip--end" aria-hidden="true" />
            </span>
            <br />
            Pode ficar tranquilo, o resto do meu trabalho passa por bem mais do que vibe.
          </span>
        </p>
      </div>

      <div className="kb-who__body">
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
            Eu desenho produtos B2B com requisitos complexos e regras de negócio. Meu projeto mais recente foi para
            uma fabricante de hardware do Vale do Silício, pensado para coordenar dados entre linhas de produção,
            builds e equipamentos, para múltiplos perfis de usuário simultâneos. Em projetos reais, não existem
            respostas fáceis. É aí que um designer não perde para a IA.
          </span>
        </p>
        <p>
          <span data-lang="en">
            I work close to engineering: GitHub, dev teams, AI-assisted tools are part of the job, not someone else's.
            Right now I'm also building product management fundamentals: sharper problem framing, better trade-off
            calls.
          </span>
          <span data-lang="pt">
            Eu trabalho perto da engenharia: GitHub, times de dev, ferramentas com IA fazem parte do trabalho, não são
            tarefa de outra pessoa. Agora também estou construindo fundamentos de product management: enquadrar
            problemas com mais precisão, tomar decisões de trade-off melhores.
          </span>
        </p>
      </div>

      <span className="kb-who__decor kb-who__pip kb-who__pip--a" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--b" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--c" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--d" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--e" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--f" aria-hidden="true" />
      <span className="kb-who__decor kb-who__pip kb-who__pip--g" aria-hidden="true" />
      <Sparkle className="kb-who__decor kb-who__spark kb-who__spark--a" />
      <Sparkle className="kb-who__decor kb-who__spark kb-who__spark--b" />
      <Sparkle className="kb-who__decor kb-who__spark kb-who__spark--c" />
      <svg
        className="kb-who__decor kb-who__squiggle"
        viewBox="0 0 120 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 24C14 6 30 6 40 20s26 14 36 0 26-12 36 2"
          stroke="var(--kb-blush)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="kb-who__decor kb-who__blob" aria-hidden="true" />
    </div>
  )
}

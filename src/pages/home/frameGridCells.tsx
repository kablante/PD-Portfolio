import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type Lang, downloadCvPlaceholder } from './useHomeEffects'

const CELL_BASE =
  'w-full h-full flex flex-col justify-center gap-3 p-6 rounded-lg border'
const CELL_STYLE = {
  background: 'var(--surface-glass)',
  borderColor: 'var(--border-hairline)',
  backdropFilter: 'blur(var(--blur-glass))',
  WebkitBackdropFilter: 'blur(var(--blur-glass))',
} as const

export function LongTextCell() {
  return (
    <div className={CELL_BASE} style={CELL_STYLE}>
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--kb-lavender)' }}
      >
        <span data-lang="en">About</span>
        <span data-lang="pt">Sobre</span>
      </span>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
        <span data-lang="en">
          I design the screens between "I need this" and "it's done" — signup flows, dashboards,
          the parts of a product people actually spend their day in. Six years, mostly fintech and
          marketplaces.
        </span>
        <span data-lang="pt">
          Desenho as telas entre "eu preciso disso" e "está feito" — fluxos de cadastro,
          dashboards, as partes de um produto em que as pessoas realmente passam o dia. Seis anos,
          principalmente fintech e marketplaces.
        </span>
      </p>
    </div>
  )
}

export function TagsCell() {
  const tags = ['Product Design', 'Design Systems', 'Figma', 'Prototyping', 'User Research', 'UX Writing']
  return (
    <div className={CELL_BASE} style={CELL_STYLE}>
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--kb-lavender)' }}
      >
        <span data-lang="en">Toolkit</span>
        <span data-lang="pt">Ferramentas</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="kb-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

const TIMEZONE = 'America/Sao_Paulo'

export function TimezoneCell() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now)

  return (
    <div className={CELL_BASE} style={CELL_STYLE}>
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--kb-lavender)' }}
      >
        <span data-lang="en">Local time</span>
        <span data-lang="pt">Horário local</span>
      </span>
      <span
        className="font-mono tabular-nums"
        style={{ color: 'var(--kb-butter)', fontSize: 'clamp(28px, 3vw, 40px)' }}
      >
        {time}
      </span>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
        São Paulo, BR · GMT-3
      </span>
    </div>
  )
}

export function ButtonsCell({ lang }: { lang: Lang }) {
  return (
    <div className={`${CELL_BASE} items-center`} style={CELL_STYLE}>
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--kb-lavender)' }}
      >
        <span data-lang="en">Get in touch</span>
        <span data-lang="pt">Contato</span>
      </span>
      <div className="flex items-center gap-3">
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
    </div>
  )
}

const CHAT_LOG = [
  { from: 'bot' as const, en: "Hi! I'm still learning — ask me about Katarina's work.", pt: 'Oi! Ainda estou aprendendo — pergunte sobre o trabalho da Katarina.' },
  { from: 'user' as const, en: 'What kind of projects has she led?', pt: 'Que tipo de projetos ela já liderou?' },
]

export function ChatbotCell() {
  return (
    <div className={CELL_BASE} style={CELL_STYLE}>
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--kb-lavender)' }}
      >
        <span data-lang="en">Ask about my work</span>
        <span data-lang="pt">Pergunte sobre meu trabalho</span>
      </span>
      <div className="flex flex-col gap-2 flex-1 min-h-0 justify-end">
        {CHAT_LOG.map((msg, i) => (
          <div
            key={i}
            className="text-sm px-3 py-2 rounded-lg max-w-[85%]"
            style={{
              alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
              background: msg.from === 'user' ? 'var(--kb-blush)' : 'var(--surface-card-hover)',
              color: msg.from === 'user' ? 'var(--text-on-light)' : 'var(--text-body)',
            }}
          >
            <span data-lang="en">{msg.en}</span>
            <span data-lang="pt">{msg.pt}</span>
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm"
        style={{ background: 'var(--surface-input)', color: 'var(--text-muted)' }}
      >
        <span data-lang="en">Coming soon…</span>
        <span data-lang="pt">Em breve…</span>
      </div>
    </div>
  )
}

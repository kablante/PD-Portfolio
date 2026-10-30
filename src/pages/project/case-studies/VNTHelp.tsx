import { ArrowUp, Maximize2, Minimize2, Minus, Sparkles, X } from 'lucide-react'
import { type FormEvent, type PointerEvent as ReactPointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ImageLightbox from '@/components/shared/ImageLightbox'
import { asset } from '@/lib/asset'
import { skillHue } from '../../home/skills'

const ALL_IMAGES = [
  { src: asset('/assets/projects/vnt-help/before-home.png'), alt: 'Old Help home screen, before the redesign' },
]

function Figure({
  src,
  alt,
  onZoom,
  narrow,
}: {
  src: string
  alt: string
  onZoom: (image: { src: string; alt: string }) => void
  /** Caps the figure at the source image's own (small) native width instead
   * of stretching it to the full column — avoids upscaling a low-res
   * screenshot into visible blur. */
  narrow?: boolean
}) {
  return (
    <figure className={narrow ? 'kb-project-figure kb-project-figure--narrow' : 'kb-project-figure'}>
      <button type="button" className="kb-project-zoom" onClick={() => onZoom({ src, alt })}>
        <img src={src} alt={alt} />
      </button>
    </figure>
  )
}

const PROJECT_SKILLS = [
  'AI-Assisted Design Workflows',
  'GitHub',
  'Enterprise UX Design',
  'Cross-functional Collaboration',
  'User Research',
]

// Matches a common laptop viewport, so the embedded mock always renders its
// desktop layout — scaled down to fit the card — instead of collapsing into
// its own mobile breakpoint at narrow container widths.
const LAPTOP_WIDTH = 1440
const LAPTOP_HEIGHT = 900

// Height of the fake browser chrome bar (dots + URL) sitting above the
// scaled iframe. Fixed rather than scaled, like a real browser's chrome,
// so it stays legible and the mock reads as "framed" at any card size.
const CHROME_HEIGHT = 36

/** Embeds an external page at a fixed laptop viewport size, then scales the
 * whole thing down (via CSS transform) to fit however wide the card ends up
 * being, so responsiveness here tracks the card's width, not the iframe's
 * own breakpoints. Framed with a fake browser chrome bar so it reads as a
 * simulated screen rather than a real (or ambiguous) screenshot. A
 * fullscreen toggle re-measures the same wrapper (which the browser resizes
 * to the full screen) and switches the scale formula to contain-fit both
 * screen dimensions, minus the chrome bar, instead of just filling the
 * width. */
function LaptopEmbed({ src, title, mockUrl }: { src: string; title: string; mockUrl: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isFullscreenRef = useRef(false)
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useLayoutEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(
        isFullscreenRef.current
          ? Math.min(width / LAPTOP_WIDTH, (height - CHROME_HEIGHT) / LAPTOP_HEIGHT)
          : width / LAPTOP_WIDTH,
      )
    })
    observer.observe(el)

    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === el
      isFullscreenRef.current = active
      setIsFullscreen(active)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      wrapperRef.current?.requestFullscreen().catch(() => {})
    }
  }

  return (
    <div className="kb-project-embed" ref={wrapperRef}>
      <div className="kb-project-embed__card" style={{ width: LAPTOP_WIDTH * scale }}>
        <div className="kb-project-embed__chrome">
          <span className="kb-project-embed__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="kb-project-embed__url">{mockUrl}</span>
          <button type="button" className="kb-project-embed__fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={13} aria-hidden="true" /> : <Maximize2 size={13} aria-hidden="true" />}
            {isFullscreen ? (
              <>
                <span data-lang="en">Exit fullscreen</span>
                <span data-lang="pt">Sair da tela cheia</span>
              </>
            ) : (
              <>
                <span data-lang="en">Fullscreen</span>
                <span data-lang="pt">Tela cheia</span>
              </>
            )}
          </button>
        </div>
        <div className="kb-project-embed__frame" style={{ width: LAPTOP_WIDTH * scale, height: LAPTOP_HEIGHT * scale }}>
          <iframe
            src={src}
            title={title}
            loading="lazy"
            style={{ width: LAPTOP_WIDTH, height: LAPTOP_HEIGHT, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  )
}

/** Reads `html[data-active-lang]` (see useLang in useHomeEffects.ts) and
 * stays in sync with the sidebar's EN/PT toggle, without needing its own
 * useLang() instance — ProjectPage owns the single source of truth and
 * doesn't pass it down to case-study components, so this observes the DOM
 * attribute directly instead of drifting out of sync with a stale copy. */
function useActiveLang(): 'en' | 'pt' {
  const [active, setActive] = useState<'en' | 'pt'>(
    () => (document.documentElement.getAttribute('data-active-lang') as 'en' | 'pt') || 'en',
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setActive((document.documentElement.getAttribute('data-active-lang') as 'en' | 'pt') || 'en')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-active-lang'] })
    return () => observer.disconnect()
  }, [])

  return active
}

const CHATMOCK_NOTICE = {
  en: "This is a visual mockup, not a functional chat.",
  pt: 'Isso é um mockup visual, não um chat funcional.',
}

interface ChatmockDrag {
  pointerId: number
  offsetX: number
  offsetBottom: number
  frameLeft: number
  frameBottom: number
  frameWidth: number
  frameHeight: number
  cardWidth: number
  cardHeight: number
}

/** Recreation of the real chatbot's UI as a working (if canned) chat, rather
 * than a static screenshot. Sending a message and the header's close button
 * both lead to the same honest disclaimer; minimize, expand and dragging the
 * window around its frame are real, not mocked. */
function ChatbotMock() {
  const lang = useActiveLang()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])
  const [input, setInput] = useState('')
  const [noticeVisible, setNoticeVisible] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [pos, setPos] = useState<{ left: number; bottom: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const noticeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<ChatmockDrag | null>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => () => {
    if (noticeTimeout.current) clearTimeout(noticeTimeout.current)
  }, [])

  // Starts the window docked to the frame's bottom-right corner — measured
  // once (after the CSS inset it's rendered with initially) and locked into
  // an explicit left/bottom pixel position, so dragging has a real
  // coordinate to work from instead of fighting the right/bottom inset.
  // Anchoring by `bottom` (not `top`) matters once minimize can shrink the
  // card's height: with `top` fixed, a shorter card would rise away from
  // the bottom-right dock point it started at; with `bottom` fixed, it
  // collapses straight down into that corner instead, like a real chat
  // widget's minimized bar.
  useLayoutEffect(() => {
    if (pos || expanded) return
    const frame = frameRef.current
    const card = cardRef.current
    if (!frame || !card) return
    const frameRect = frame.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    setPos({ left: cardRect.left - frameRect.left, bottom: frameRect.bottom - cardRect.bottom })
  }, [pos, expanded])

  function flashNotice() {
    setNoticeVisible(true)
    if (noticeTimeout.current) clearTimeout(noticeTimeout.current)
    noticeTimeout.current = setTimeout(() => setNoticeVisible(false), 2800)
  }

  function handleSend(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'bot', text: CHATMOCK_NOTICE[lang] }])
  }

  function handleDragPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('.kb-chatmock__action')) return
    const frame = frameRef.current
    const card = cardRef.current
    if (!frame || !card || expanded) return
    const frameRect = frame.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    dragRef.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - cardRect.left,
      offsetBottom: cardRect.bottom - e.clientY,
      frameLeft: frameRect.left,
      frameBottom: frameRect.bottom,
      frameWidth: frameRect.width,
      frameHeight: frameRect.height,
      cardWidth: cardRect.width,
      cardHeight: cardRect.height,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  function handleDragPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const maxLeft = Math.max(drag.frameWidth - drag.cardWidth, 0)
    const maxBottom = Math.max(drag.frameHeight - drag.cardHeight, 0)
    const left = Math.min(Math.max(e.clientX - drag.frameLeft - drag.offsetX, 0), maxLeft)
    const bottom = Math.min(Math.max(drag.frameBottom - e.clientY - drag.offsetBottom, 0), maxBottom)
    setPos({ left, bottom })
  }

  function handleDragPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== e.pointerId) return
    dragRef.current = null
    setDragging(false)
  }

  const cardClassName = [
    'kb-chatmock',
    minimized && 'kb-chatmock--minimized',
    expanded && 'kb-chatmock--expanded',
    dragging && 'kb-chatmock--dragging',
  ]
    .filter(Boolean)
    .join(' ')

  const cardStyle = expanded
    ? undefined
    : pos
      ? { left: pos.left, bottom: pos.bottom }
      : { right: 20, bottom: 20 }

  return (
    <div className="kb-project-figure kb-project-figure--chatmock" ref={frameRef}>
      <div className={cardClassName} ref={cardRef} style={cardStyle}>
        <div className="kb-chatmock__notice" aria-live="polite" data-visible={noticeVisible}>
          {CHATMOCK_NOTICE[lang]}
        </div>

        <div
          className="kb-chatmock__header"
          onPointerDown={handleDragPointerDown}
          onPointerMove={handleDragPointerMove}
          onPointerUp={handleDragPointerUp}
          onPointerCancel={handleDragPointerUp}
        >
          <button type="button" className="kb-chatmock__action" onClick={flashNotice} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
          <span className="kb-chatmock__icon" aria-hidden="true">
            <Sparkles size={13} />
          </span>
          <span className="kb-chatmock__title">AI Assistant</span>
          <button
            type="button"
            className="kb-chatmock__action"
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? 'Restore' : 'Minimize'}
            aria-pressed={minimized}
          >
            <Minus size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="kb-chatmock__action"
            onClick={() => setExpanded((ex) => !ex)}
            aria-label={expanded ? 'Shrink' : 'Expand'}
            aria-pressed={expanded}
          >
            {expanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
          </button>
        </div>

        <p className="kb-chatmock__note">
          <span data-lang="en">Note: AI Assistant is AI-powered and may occasionally be incorrect.</span>
          <span data-lang="pt">Nota: o AI Assistant é alimentado por IA e pode, ocasionalmente, errar.</span>
        </p>

        <div className="kb-chatmock__body" ref={bodyRef}>
          <div className="kb-chatmock__turn">
            <span className="kb-chatmock__sender">AI Assistant</span>
            <p className="kb-chatmock__bubble">
              <span data-lang="en">
                Welcome to <strong>AI Assistant</strong>. This assistant answers questions about{' '}
                <strong>Fruit Guide</strong> using the official{' '}
                <span className="kb-chatmock__link">User Guide (Help) documentation</span>. It can explain
                features, terminology, roles and workflows.
              </span>
              <span data-lang="pt">
                Bem-vindo ao <strong>AI Assistant</strong>. Este assistente responde perguntas sobre{' '}
                <strong>Fruit Guide</strong> usando a documentação oficial do{' '}
                <span className="kb-chatmock__link">Guia do Usuário (Help)</span>. Ele pode explicar
                funcionalidades, terminologia, papéis e fluxos de trabalho.
              </span>
            </p>
          </div>

          {messages.map((message, i) => (
            <div className="kb-chatmock__turn" key={i}>
              {message.role === 'bot' && <span className="kb-chatmock__sender">AI Assistant</span>}
              <p
                className={
                  message.role === 'user' ? 'kb-chatmock__bubble kb-chatmock__bubble--user' : 'kb-chatmock__bubble'
                }
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>

        <form className="kb-chatmock__inputrow" onSubmit={handleSend}>
          <input
            type="text"
            className="kb-chatmock__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === 'pt' ? 'Digite sua pergunta...' : 'Type your question...'}
            aria-label={lang === 'pt' ? 'Digite sua pergunta' : 'Type your question'}
          />
          <button type="submit" className="kb-chatmock__send" disabled={!input.trim()} aria-label="Send">
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}

/** Venturus Help Page & AI Chatbot — case study. */
export default function VNTHelp() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openLightbox = ({ src }: { src: string; alt: string }) =>
    setLightboxIndex(ALL_IMAGES.findIndex((image) => image.src === src))

  return (
    <>
      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Role</span>
            <span data-lang="pt">Função</span>
          </span>
          <span className="kb-project-meta-item__value">Product Designer</span>
        </span>

        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Timeline</span>
            <span data-lang="pt">Período</span>
          </span>
          <span className="kb-project-meta-item__value">
            <span data-lang="en">
              Rolled out gradually over the course of the project, worked in whenever the core roadmap had slack
            </span>
            <span data-lang="pt">
              Lançado gradualmente ao longo do projeto, encaixado sempre que o roadmap principal tinha folga
            </span>
          </span>
        </span>
      </div>

      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Team</span>
            <span data-lang="pt">Equipe</span>
          </span>
          <span className="kb-project-meta-item__value">
            <span data-lang="en">
              Data architecture, backend, frontend, QA, and design teams at{' '}
              <a
                href="https://www.linkedin.com/company/venturus/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                Venturus
              </a>
              ; design partner{' '}
              <a href="https://www.linkedin.com/in/kauanedemoraes/" target="_blank" rel="noopener noreferrer">
                Kauane de Moraes
              </a>
            </span>
            <span data-lang="pt">
              Equipes de arquitetura de dados, backend, frontend, QA e design da{' '}
              <a
                href="https://www.linkedin.com/company/venturus/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                Venturus
              </a>
              ; parceira de design{' '}
              <a href="https://www.linkedin.com/in/kauanedemoraes/" target="_blank" rel="noopener noreferrer">
                Kauane de Moraes
              </a>
            </span>
          </span>
        </span>
      </div>

      <div className="kb-project-skills">
        <span className="kb-project-skills__label">
          <span data-lang="en">✦ skills &amp; toolkit</span>
          <span data-lang="pt">✦ ferramentas</span>
        </span>

        {PROJECT_SKILLS.map((label) => (
          <span key={label} className={`kb-project-skill kb-project-skill--${skillHue(label)}`}>
            {label}
          </span>
        ))}
      </div>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Overview</span>
          <span data-lang="pt">Visão Geral</span>
        </span>

        <p>
          <span data-lang="en">
            At Venturus, working with a hardware manufacturing client, I rebuilt the product's User Guide (Help)
            page and added an in-product AI chatbot.
          </span>
          <span data-lang="pt">
            Na Venturus, trabalhando com um cliente fabricante de hardware, reconstruí o Guia do Usuário (Help) do
            produto e adicionei um chatbot de IA dentro do produto.
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Problem</span>
          <span data-lang="pt">Problema</span>
        </span>

        <p>
          <span data-lang="en">
            The existing Help page had very low traffic. Many users didn't even know it existed, a fact that
            surfaced during user interviews conducted for an unrelated, complex feature, and the team routinely
            deprioritized the page as a result. That stopped being a minor issue once new engineering teams joined
            as users and increasingly complex features started shipping to production, both raised the real cost of
            an outdated, hard-to-find help system.
          </span>
          <span data-lang="pt">
            A página de Help existente tinha pouquíssimo tráfego. Muitos usuários nem sabiam que ela existia, um
            fato que surgiu durante entrevistas feitas para uma feature complexa e não relacionada, e o time
            normalmente despriorizava a página por causa disso. Isso deixou de ser um problema pequeno quando novos
            times de engenharia passaram a usar o produto e features cada vez mais complexas começaram a ir para
            produção — os dois fatores aumentaram o custo real de um sistema de ajuda desatualizado e difícil de
            encontrar.
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Solution</span>
          <span data-lang="pt">Solução</span>
        </span>

        <p>
          <span data-lang="en">
            I rebuilt the Help page and added an in-product AI chatbot that answers questions directly from the Help
            content. The combination gave new team members a self-serve path that didn't exist before.
          </span>
          <span data-lang="pt">
            Reconstruí a página de Help e adicionei um chatbot de IA dentro do produto que responde perguntas
            diretamente a partir do conteúdo do Help. A combinação deu aos novos membros dos times um caminho de
            autoatendimento que não existia antes.
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Process</span>
          <span data-lang="pt">Processo</span>
        </span>

        <h2>
          <span data-lang="en">Approach</span>
          <span data-lang="pt">Abordagem</span>
        </h2>
        <p>
          <span className="kb-project-highlight">
            <span data-lang="en">
              I rebuilt the page using AI-assisted development, working in VS Code and GitHub with Claude Code.
            </span>
            <span data-lang="pt">
              Reconstruí a página usando desenvolvimento assistido por IA, trabalhando no VS Code e GitHub com o
              Claude Code.
            </span>
          </span>
        </p>

        <h3>
          <span data-lang="en">The Skill</span>
          <span data-lang="pt">A Skill</span>
        </h3>
        <p>
          <span data-lang="en">
            To keep the guide's content consistent and current, I created a Skill that converts three kinds of
            source material (technical requirements from developers and data architects, design case studies from
            the design team, and QA test cases), into Help entries written in plain, objective language. It uses the
            same terminology the product itself displays, knows which technical terms to drop entirely, and
            translates the rest into user-friendly language.
          </span>
          <span data-lang="pt">
            Para manter o conteúdo do guia consistente e atualizado, criei uma Skill que converte três tipos de
            material de origem (requisitos técnicos de desenvolvedores e arquitetos de dados, estudos de caso de
            design do time de design, e casos de teste de QA) em entradas de Help escritas em linguagem simples e
            objetiva. Ela usa a mesma terminologia que o produto exibe, sabe quais termos técnicos descartar
            completamente, e traduz o resto para uma linguagem amigável ao usuário.
          </span>
        </p>
        <p>
          <span data-lang="en">
            In practice, that meant opening Claude Code inside the Help page project in VS Code, already connected
            to the requirements plugin, and typing something as simple as{' '}
            <span className="kb-project-highlight">"make the Help page for Feature X."</span> Claude Code would
            generate the text and specify exactly which screenshots needed to be taken from the application to
            complete the page.
          </span>
          <span data-lang="pt">
            Na prática, isso significava abrir o Claude Code dentro do projeto da página de Help no VS Code, já
            conectado ao plugin de requisitos, e digitar algo tão simples quanto{' '}
            <span className="kb-project-highlight">"faz a página de Help da Feature X."</span> O Claude Code gerava
            o texto e especificava exatamente quais capturas de tela precisavam ser tiradas da aplicação para
            completar a página.
          </span>
        </p>

        <h3>
          <span data-lang="en">Information Architecture</span>
          <span data-lang="pt">Arquitetura da Informação</span>
        </h3>
        <p>
          <span data-lang="en">
            The new version added global search and per-page search, a rebuilt hierarchy for easier navigation, and
            a hyperlink system that lets pages reference a single source of information instead of repeating it. It
            also added dedicated guides for environment setup, requesting access, and the differences between user
            types.
          </span>
          <span data-lang="pt">
            A nova versão adicionou busca global e busca por página, uma hierarquia reconstruída para navegação mais
            fácil, e um sistema de hyperlinks que permite que páginas referenciem uma única fonte de informação em
            vez de repeti-la. Também foram adicionados guias dedicados para configuração de ambiente, solicitação de
            acesso, e as diferenças entre tipos de usuário.
          </span>
        </p>

        <h3>
          <span data-lang="en">The Image Problem</span>
          <span data-lang="pt">O Problema das Imagens</span>
        </h3>
        <p>
          <span data-lang="en">
            Full-page screenshots, videos, and GIFs went stale almost immediately, since the product shipped every
            sprint. There was a second constraint on top of that: fictional placeholder data confused users, but the
            company's confidentiality policy didn't allow real data to be shown. My solution was to use tightly
            cropped images focused on the single element referenced in the text, instead of full-page captures. The
            new search and hierarchy system also made it easier to see exactly where a UI change would affect the
            guide, and building with Claude Code made updating those cropped images faster.
          </span>
          <span data-lang="pt">
            Capturas de tela de página inteira, vídeos e GIFs ficavam desatualizados quase imediatamente, já que o
            produto lançava atualizações a cada sprint. Havia uma segunda restrição além dessa: dados fictícios de
            placeholder confundiam os usuários, mas a política de confidencialidade da empresa não permitia mostrar
            dados reais. Minha solução foi usar imagens recortadas de perto, focadas no único elemento referenciado
            no texto, em vez de capturas de página inteira. O novo sistema de busca e hierarquia também facilitou
            enxergar exatamente onde uma mudança de UI afetaria o guia, e construir com o Claude Code tornou a
            atualização dessas imagens recortadas mais rápida.
          </span>
        </p>

        <h3>
          <span data-lang="en">The Chatbot</span>
          <span data-lang="pt">O Chatbot</span>
        </h3>
        <p>
          <span data-lang="en">
            The chatbot lives inside the product and{' '}
            <span className="kb-project-highlight">answers questions using the Help content directly</span>. It
            draws on each user's individual token allocation within the company, consistent with the closed,
            disclosure-limited access model the project already used for other initiatives.
          </span>
          <span data-lang="pt">
            O chatbot vive dentro do produto e{' '}
            <span className="kb-project-highlight">responde perguntas usando o conteúdo do Help diretamente</span>.
            Ele consome da alocação individual de tokens de cada usuário dentro da empresa, de forma consistente com
            o modelo de acesso fechado e limitado por disclosure que o projeto já usava em outras iniciativas.
          </span>
        </p>

        <ChatbotMock />

        <h3>
          <span data-lang="en">Guidelines</span>
          <span data-lang="pt">Diretrizes</span>
        </h3>
        <p>
          <span data-lang="en">
            Beyond the Skill above, two more guideline documents governed how the Help page was maintained:
          </span>
          <span data-lang="pt">
            Além da Skill acima, mais dois documentos de diretrizes regiam como a página de Help era mantida:
          </span>
        </p>
        <ul className="kb-project-list">
          <li>
            <span data-lang="en">
              <span className="kb-project-highlight">UX writing guidelines</span>, matching the tone of voice and
              phrasing conventions of the company the software was built for.
            </span>
            <span data-lang="pt">
              <span className="kb-project-highlight">Diretrizes de UX writing</span>, alinhadas ao tom de voz e às
              convenções de linguagem da empresa para a qual o software foi construído.
            </span>
          </li>
          <li>
            <span data-lang="en">
              Standard behavior rules: when to hyperlink instead of repeating information, both for user roles and
              for technical terms, defined behavior patterns for structuring content, three rules for how
              screenshots should be cropped and used, and a standing rule to add any new term to the page's
              glossary.
            </span>
            <span data-lang="pt">
              Regras padrão de comportamento: quando usar hyperlink em vez de repetir informação, tanto para papéis
              de usuário quanto para termos técnicos, padrões de comportamento definidos para estruturar conteúdo,
              três regras de como capturas de tela devem ser recortadas e usadas, e uma regra permanente de
              adicionar qualquer termo novo ao glossário da página.
            </span>
          </li>
        </ul>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Final Design</span>
          <span data-lang="pt">Design Final</span>
        </span>

        <h2>
          <span data-lang="en">Before</span>
          <span data-lang="pt">Antes</span>
        </h2>
        <Figure src={ALL_IMAGES[0].src} alt={ALL_IMAGES[0].alt} onZoom={openLightbox} />

        <h2>
          <span data-lang="en">After</span>
          <span data-lang="pt">Depois</span>
        </h2>
        <p>
          <span data-lang="en">
            The real Help page can't be shown due to Venturus's confidentiality policy, so this is a mock built
            with the same structure (global search, rebuilt hierarchy, and hyperlinked terms) to demonstrate the
            new experience interactively.
          </span>
          <span data-lang="pt">
            A página de Help real não pode ser mostrada por causa da política de confidencialidade da Venturus,
            então este é um mock construído com a mesma estrutura (busca global, hierarquia reconstruída, e termos
            com hyperlink) para demonstrar a nova experiência de forma interativa.
          </span>
        </p>
        <LaptopEmbed
          src={`${import.meta.env.BASE_URL}mocks/vnt-help/index.html`}
          title="Venturus Help page — interactive mock"
          mockUrl="Venturus — Help Page Redesign"
        />
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={ALL_IMAGES}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

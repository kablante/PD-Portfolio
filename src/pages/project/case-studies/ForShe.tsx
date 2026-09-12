import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { type ReactNode, useRef, useState } from 'react'
import ImageLightbox from '@/components/shared/ImageLightbox'
import { asset } from '@/lib/asset'
import { useLang } from '../../home/useHomeEffects'
import { skillHue } from '../../home/skills'

/** Same wording as the tags this project actually used - matched against
 * the Who section's own toolkit tags (skills.ts) so a skill that appears in
 * both places always renders in the same color. */
const PROJECT_SKILLS = ['Figma', 'User Research', 'Cross-functional Collaboration']

/** Every image on the page, in the order it appears - so the lightbox can
 * step through all of them (figures, carousels, and gallery) regardless of
 * which section or layout an image sits in. */
const ALL_IMAGES = [
  { src: asset('/assets/projects/for-she/solution.png'), alt: 'For She platform concept overview' },
  { src: asset('/assets/projects/for-she/trello.png'), alt: 'Trello board used to manage the sprint' },
  {
    src: asset('/assets/projects/for-she/survey-numbers.png'),
    alt: 'Survey results: 56% cite unequal pay and lack of diversity, 72% prefer women-only platforms, 75% face gender-related challenges entering the job market',
  },
  {
    src: asset('/assets/projects/for-she/product-vision.png'),
    alt: 'Product vision board outlining the first feature set',
  },
  {
    src: asset('/assets/projects/for-she/persona-monica.png'),
    alt: 'Persona: Mônica Duarte, 32, psychologist switching careers into tech',
  },
  {
    src: asset('/assets/projects/for-she/persona-ana.png'),
    alt: 'Persona: Ana Maria Dias, 19, just graduated high school, builds PCs with her dad',
  },
  {
    src: asset('/assets/projects/for-she/happy-ending.png'),
    alt: 'Ana and Mônica meet on For She and exchange mentorship for PC-building help',
  },
  { src: asset('/assets/projects/for-she/lean-canvas.png'), alt: 'Lean Canvas mapping the For She business model' },
  { src: asset('/assets/projects/for-she/benchmark.png'), alt: 'Benchmark against Catho and InfoJobs' },
  { src: asset('/assets/projects/for-she/sitemap.png'), alt: 'Whiteboard site map of the For She platform' },
  { src: asset('/assets/projects/for-she/visual-id.png'), alt: 'For She logo lockups and color palette' },
  { src: asset('/assets/projects/for-she/wireframe-flows.png'), alt: 'Core flow wireframes' },
  { src: asset('/assets/projects/for-she/wireframe-dashboard.png'), alt: 'Dashboard wireframe' },
  { src: asset('/assets/projects/for-she/wireframe-home.png'), alt: 'Home screen wireframe' },
  {
    src: asset('/assets/projects/for-she/award.png'),
    alt: 'Hackathon das Manas 1st place award graphic for Team Marias Bonitas',
  },
]

interface ZoomableProps {
  src: string
  alt: string
  onZoom: (image: { src: string; alt: string }) => void
}

/** A figure whose image opens full-size on click - the standalone version,
 * with its own bordered nebula mat (see .kb-project-figure). */
function Figure({ src, alt, onZoom }: ZoomableProps) {
  return (
    <figure className="kb-project-figure">
      <button type="button" className="kb-project-zoom" onClick={() => onZoom({ src, alt })}>
        <img src={src} alt={alt} />
      </button>
    </figure>
  )
}

/** Same click-to-zoom behavior, without its own border/mat - used inside
 * the carousel and gallery, which frame the whole block instead. */
function ZoomableImage({ src, alt, onZoom }: ZoomableProps) {
  return (
    <button type="button" className="kb-project-zoom" onClick={() => onZoom({ src, alt })}>
      <img src={src} alt={alt} />
    </button>
  )
}

/** Scrolls the nearest-to-center slide's neighbor into view - shared by
 * every carousel on the page (there's more than one now: Personas and
 * Business Plan). */
function shiftCarousel(track: HTMLDivElement, direction: 1 | -1) {
  const slides = Array.from(track.querySelectorAll<HTMLElement>('.kb-project-carousel__slide'))
  const trackRect = track.getBoundingClientRect()
  const center = trackRect.left + trackRect.width / 2
  const currentIndex = slides.reduce((closest, slide, i) => {
    const rect = slide.getBoundingClientRect()
    const dist = Math.abs(rect.left + rect.width / 2 - center)
    const closestRect = slides[closest].getBoundingClientRect()
    const closestDist = Math.abs(closestRect.left + closestRect.width / 2 - center)
    return dist < closestDist ? i : closest
  }, 0)
  const target = slides[currentIndex + direction]
  if (!target) return
  const targetRect = target.getBoundingClientRect()
  const delta = targetRect.left + targetRect.width / 2 - center
  track.scrollBy({ left: delta, behavior: 'smooth' })
}

/** Manual scroll-snap carousel: no autoplay - nothing to pause, the arrow
 * buttons double as the keyboard-reachable controls. Each `children` slide
 * should be a `.kb-project-carousel__slide` div. */
function Carousel({ children, prevLabel, nextLabel }: { children: ReactNode; prevLabel: string; nextLabel: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  return (
    <div className="kb-project-carousel">
      <div className="kb-project-carousel__track" ref={trackRef}>
        {children}
      </div>
      <div className="kb-project-carousel__nav">
        <button
          type="button"
          className="kb-icon-btn kb-icon-btn--outline"
          aria-label={prevLabel}
          onClick={() => trackRef.current && shiftCarousel(trackRef.current, -1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="kb-icon-btn kb-icon-btn--outline"
          aria-label={nextLabel}
          onClick={() => trackRef.current && shiftCarousel(trackRef.current, 1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/** For She — Hackathon das Manas case study, March 25-28 2022.
 * The first fully-built project page; its section building blocks
 * (kb-project-section/figure/figure-row/gallery/quote/list/carousel/video,
 * in kb-site.css) are the reusable template for every case study after it. */
export default function ForShe() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openLightbox = ({ src }: { src: string; alt: string }) =>
    setLightboxIndex(ALL_IMAGES.findIndex((image) => image.src === src))
  const { lang } = useLang()

  return (
    <>
      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Role</span>
            <span data-lang="pt">Função</span>
          </span>
          <span className="kb-project-meta-item__value">Product Designer, Project Manager</span>
        </span>
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Timeline</span>
            <span data-lang="pt">Período</span>
          </span>
          <span className="kb-project-meta-item__value">
            <span data-lang="en">March 25–28, 2022</span>
            <span data-lang="pt">25–28 de março de 2022</span>
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
            Marias Bonitas (Katarina Blante,{' '}
            <a href="https://www.linkedin.com/in/rayane-nunes/" target="_blank" rel="noopener noreferrer">
              Rayane Nunes
            </a>
            ,{' '}
            <a href="https://www.linkedin.com/in/virna-oliveira/" target="_blank" rel="noopener noreferrer">
              Virna Oliveira
            </a>
            ,{' '}
            <a href="https://www.linkedin.com/in/rafaelafccorrea/" target="_blank" rel="noopener noreferrer">
              Rafaela Corrêa
            </a>
            )
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
            For She is a recruiting and training concept for women moving into tech, built over four days for{' '}
            <a href="https://www.linkedin.com/company/hackathon-das-manas/" target="_blank" rel="noopener noreferrer">
              Hackathon das Manas
            </a>
            , a non-profit hackathon run by and for women organized around United Nations Sustainable Development
            Goal 5: Gender Equality.
          </span>
          <span data-lang="pt">
            For She é um conceito de recrutamento e capacitação para mulheres migrando para tech, construído em
            quatro dias para o{' '}
            <a href="https://www.linkedin.com/company/hackathon-das-manas/" target="_blank" rel="noopener noreferrer">
              Hackathon das Manas
            </a>
            , um hackathon sem fins lucrativos organizado por e para mulheres, em torno do Objetivo de
            Desenvolvimento Sustentável 5 da ONU: Igualdade de Gênero.
          </span>
        </p>
        <p>
          <span data-lang="en">
            I worked as designer and project manager on Marias Bonitas, a four-person team. A week after we
            submitted, the results came in:{' '}
            <span className="kb-project-highlight">1st place, plus an honorable mention for global impact.</span>
          </span>
          <span data-lang="pt">
            Atuei como designer e gerente de projeto no Marias Bonitas, um time de quatro pessoas. Uma semana depois
            de enviarmos, o resultado saiu:{' '}
            <span className="kb-project-highlight">1º lugar, além de uma menção honrosa por impacto global.</span>
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Problem</span>
          <span data-lang="pt">Problema</span>
        </span>
        <blockquote className="kb-project-quote">
          <p>
            <span data-lang="en">
              What solutions can be developed to increase the use of core technologies, in particular information
              and communication technologies, to promote women's empowerment?
            </span>
            <span data-lang="pt">
              Que soluções podem ser desenvolvidas para ampliar o uso de tecnologias essenciais, em particular
              tecnologias de informação e comunicação, para promover o empoderamento das mulheres?
            </span>
          </p>
        </blockquote>
        <p>
          <span data-lang="en">
            Women are a minority in tech, and the gap starts before the job search: less encouragement to consider
            IT as a career, and workplaces that don't make it easy to stay once they're in.
          </span>
          <span data-lang="pt">
            Mulheres são minoria em tech, e a lacuna começa antes da busca por emprego: menos incentivo para
            considerar TI como carreira, e ambientes de trabalho que não facilitam a permanência de quem já entrou.
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
            Our answer was <span className="kb-project-highlight">a platform for recruiting and training women</span>.
            It combines internships, specialization programs, and mentoring, built specifically for women entering
            tech. The goal was to pair skill-building with an actual support system, so it doesn't stop once someone
            lands a role.
          </span>
          <span data-lang="pt">
            Nossa resposta foi{' '}
            <span className="kb-project-highlight">uma plataforma de recrutamento e capacitação para mulheres</span>.
            Ela combina estágios, programas de especialização e mentoria, construída especificamente para mulheres
            entrando em tech. O objetivo era unir o desenvolvimento de habilidades a um sistema de apoio de verdade,
            que não termina quando a pessoa consegue uma vaga.
          </span>
        </p>
        <Figure
          src={asset('/assets/projects/for-she/solution.png')}
          alt="For She platform concept overview"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Process</span>
          <span data-lang="pt">Processo</span>
        </span>
        <h2>
          <span data-lang="en">User Research</span>
          <span data-lang="pt">Pesquisa com Usuárias</span>
        </h2>
        <p>
          <span data-lang="en">
            The team was split between two competing ideas: a recruiting platform or a training platform. I
            mediated between them and made the call to merge the two: recruiting alone wouldn't fix the pipeline if
            candidates arrived unprepared, and training alone wouldn't get them hired faster.
          </span>
          <span data-lang="pt">
            O time estava dividido entre duas ideias concorrentes: uma plataforma de recrutamento ou uma plataforma
            de capacitação. Mediei a discussão e decidi unir as duas: recrutamento sozinho não resolveria o funil se
            as candidatas chegassem despreparadas, e capacitação sozinha não as contrataria mais rápido.
          </span>
        </p>
        <p>
          <span data-lang="en">
            I ran project management for the sprint, using Trello for tasks and deadlines so a four-person team
            could move fast without losing track of scope.
          </span>
          <span data-lang="pt">
            Conduzi a gestão de projeto do sprint, usando o Trello para tarefas e prazos, para que um time de quatro
            pessoas conseguisse avançar rápido sem perder o escopo de vista.
          </span>
        </p>
        <Figure
          src={asset('/assets/projects/for-she/trello.png')}
          alt="Trello board used to manage the sprint"
          onZoom={openLightbox}
        />
        <p>
          <span data-lang="en">
            To test the idea, <span className="kb-project-highlight">we surveyed 40 women</span>. Most said they'd
            feel more comfortable applying to roles marked specifically for women, and preferred women as leaders or
            mentors.
          </span>
          <span data-lang="pt">
            Para testar a ideia, <span className="kb-project-highlight">pesquisamos 40 mulheres</span>. A maioria
            disse que se sentiria mais confortável se candidatando a vagas marcadas especificamente para mulheres, e
            preferia mulheres como líderes ou mentoras.
          </span>
        </p>
        <Figure
          src={asset('/assets/projects/for-she/survey-numbers.png')}
          alt="Survey results: 56% cite unequal pay and lack of diversity, 72% prefer women-only platforms, 75% face gender-related challenges entering the job market"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Product Vision</span>
          <span data-lang="pt">Visão de Produto</span>
        </h2>
        <p>
          <span data-lang="en">
            The vision: a support system that's usually missing for women switching into tech, something close to a
            sorority for the industry. The first feature set:
          </span>
          <span data-lang="pt">
            A visão: um sistema de apoio que costuma faltar para mulheres migrando para tech, algo próximo de uma
            irmandade para a indústria. O primeiro conjunto de funcionalidades:
          </span>
        </p>
        <ul className="kb-project-list">
          <li>
            <span data-lang="en">A brand and community presence, in the spirit of Ladies that UX</span>
            <span data-lang="pt">Uma marca e presença de comunidade, no espírito do Ladies that UX</span>
          </li>
          <li>
            <span data-lang="en">An individual development plan (IDP)</span>
            <span data-lang="pt">Um plano de desenvolvimento individual (PDI)</span>
          </li>
          <li>
            <span data-lang="en">A dashboard for skills, background, and career goals</span>
            <span data-lang="pt">Um painel de habilidades, histórico e metas de carreira</span>
          </li>
          <li>
            <span data-lang="en">Courses from community members and IT companies</span>
            <span data-lang="pt">Cursos de membros da comunidade e empresas de TI</span>
          </li>
          <li>
            <span data-lang="en">Mentorship, in both directions</span>
            <span data-lang="pt">Mentoria, nas duas direções</span>
          </li>
          <li>
            <span data-lang="en">Job and internship listings reserved for women</span>
            <span data-lang="pt">Vagas de emprego e estágio reservadas para mulheres</span>
          </li>
          <li>
            <span data-lang="en">Space for freelancers and entrepreneurs to advertise</span>
            <span data-lang="pt">Espaço para freelancers e empreendedoras divulgarem seus serviços</span>
          </li>
        </ul>
        <Figure
          src={asset('/assets/projects/for-she/product-vision.png')}
          alt="Product vision board outlining the first feature set"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <h2>Personas</h2>
        <p>
          <span data-lang="en">
            Two entry points into the platform: Mônica, a psychologist switching careers into UX at 32, and Ana, 19
            and just out of high school, already building PCs with her dad.
          </span>
          <span data-lang="pt">
            Duas portas de entrada na plataforma: Mônica, psicóloga migrando de carreira para UX aos 32 anos, e Ana,
            19 anos, recém-formada no ensino médio, já montando PCs com o pai.
          </span>
        </p>
        <Carousel
          prevLabel={lang === 'pt' ? 'Persona anterior' : 'Previous persona'}
          nextLabel={lang === 'pt' ? 'Próxima persona' : 'Next persona'}
        >
          <div className="kb-project-carousel__slide">
            <ZoomableImage
              src={asset('/assets/projects/for-she/persona-monica.png')}
              alt="Persona: Mônica Duarte, 32, psychologist switching careers into tech"
              onZoom={openLightbox}
            />
          </div>
          <div className="kb-project-carousel__slide">
            <ZoomableImage
              src={asset('/assets/projects/for-she/persona-ana.png')}
              alt="Persona: Ana Maria Dias, 19, just graduated high school, builds PCs with her dad"
              onZoom={openLightbox}
            />
          </div>
          <div className="kb-project-carousel__slide">
            <ZoomableImage
              src={asset('/assets/projects/for-she/happy-ending.png')}
              alt="Ana and Mônica meet on For She and exchange mentorship for PC-building help"
              onZoom={openLightbox}
            />
          </div>
        </Carousel>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Business Plan</span>
          <span data-lang="pt">Plano de Negócio</span>
        </h2>
        <p>
          <span data-lang="en">
            We mapped the model with a Lean Canvas, then benchmarked it against Catho and InfoJobs, the two
            platforms women already default to for job hunting in Brazil, to check that For She wasn't just a job
            board with a filter.
          </span>
          <span data-lang="pt">
            Mapeamos o modelo com um Lean Canvas, e depois comparamos com o Catho e o InfoJobs, as duas plataformas
            que as mulheres já usam por padrão para buscar emprego no Brasil, para confirmar que o For She não era
            só um quadro de vagas com um filtro.
          </span>
        </p>
        <Carousel
          prevLabel={lang === 'pt' ? 'Slide anterior do plano de negócio' : 'Previous business plan slide'}
          nextLabel={lang === 'pt' ? 'Próximo slide do plano de negócio' : 'Next business plan slide'}
        >
          <div className="kb-project-carousel__slide">
            <ZoomableImage
              src={asset('/assets/projects/for-she/lean-canvas.png')}
              alt="Lean Canvas mapping the For She business model"
              onZoom={openLightbox}
            />
          </div>
          <div className="kb-project-carousel__slide">
            <ZoomableImage
              src={asset('/assets/projects/for-she/benchmark.png')}
              alt="Benchmark against Catho and InfoJobs"
              onZoom={openLightbox}
            />
          </div>
        </Carousel>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Site Map</span>
          <span data-lang="pt">Mapa do Site</span>
        </h2>
        <Figure
          src={asset('/assets/projects/for-she/sitemap.png')}
          alt="Whiteboard site map of the For She platform"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Final Design</span>
          <span data-lang="pt">Design Final</span>
        </span>
        <h2>
          <span data-lang="en">Visual ID &amp; Logo</span>
          <span data-lang="pt">Identidade Visual e Logo</span>
        </h2>
        <Figure
          src={asset('/assets/projects/for-she/visual-id.png')}
          alt="For She logo lockups and color palette"
          onZoom={openLightbox}
        />
        <p>
          <span data-lang="en">
            Navy blue, aqua, and purple were deliberate: navy for trust and professionalism, aqua for energy, purple
            for creativity. I made the call to skip pure pink, and the team agreed: a softer purple-magenta keeps a
            feminine tone without leaning on the cliché.
          </span>
          <span data-lang="pt">
            Azul-marinho, água e roxo foram escolhas deliberadas: azul-marinho para confiança e profissionalismo,
            água para energia, roxo para criatividade. Decidi deixar o rosa puro de fora, e o time concordou: um
            magenta-roxo mais suave mantém um tom feminino sem cair no clichê.
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Prototypes and Wireframes</span>
          <span data-lang="pt">Protótipos e Wireframes</span>
        </h2>
        <p>
          <span data-lang="en">Wireframes came first, to lock structure before the visual identity went on.</span>
          <span data-lang="pt">
            Os wireframes vieram primeiro, para travar a estrutura antes de aplicar a identidade visual.
          </span>
        </p>
        <div className="kb-project-gallery">
          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset('/assets/projects/for-she/wireframe-flows.png')}
              alt="Core flow wireframes"
              onZoom={openLightbox}
            />
          </div>
          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset('/assets/projects/for-she/wireframe-dashboard.png')}
              alt="Dashboard wireframe"
              onZoom={openLightbox}
            />
          </div>
          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset('/assets/projects/for-she/wireframe-home.png')}
              alt="Home screen wireframe"
              onZoom={openLightbox}
            />
          </div>
        </div>
      </section>

      <section className="kb-project-section">
        <h2>Pitch (PT-BR)</h2>
        <p>
          <span data-lang="en">
            The pitch video was written and narrated by{' '}
            <a href="https://www.linkedin.com/in/virna-oliveira/" target="_blank" rel="noopener noreferrer">
              Virna Oliveira
            </a>
            .
          </span>
          <span data-lang="pt">
            O vídeo de pitch foi escrito e narrado pela{' '}
            <a href="https://www.linkedin.com/in/virna-oliveira/" target="_blank" rel="noopener noreferrer">
              Virna Oliveira
            </a>
            .
          </span>
        </p>
        <div className="kb-project-video">
          <iframe
            src="https://www.youtube.com/embed/w4sqEJHd8Is"
            title="For She — pitch video (PT-BR)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="kb-project-actions">
          <a
            className="kb-btn kb-btn--secondary"
            href="https://www.canva.com/design/DAE8GXrjnNQ/3gNiNoD7Ua3XZcFTh7hqsA/view#1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span data-lang="en">View pitch deck</span>
            <span data-lang="pt">Ver deck do pitch</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Closing</span>
          <span data-lang="pt">Encerramento</span>
        </span>
        <div className="kb-project-stats">
          <div>
            <span className="kb-project-stats__value">1st</span>
            <span className="kb-project-stats__label">
              <span data-lang="en">Place, Hackathon das Manas</span>
              <span data-lang="pt">Colocação, Hackathon das Manas</span>
            </span>
          </div>
          <div>
            <span className="kb-project-stats__value">+1</span>
            <span className="kb-project-stats__label">
              <span data-lang="en">Honorable mention, global impact</span>
              <span data-lang="pt">Menção honrosa, impacto global</span>
            </span>
          </div>
        </div>
        <p>
          <span className="kb-project-highlight">
            <span data-lang="en">
              For She won 1st place at Hackathon das Manas, with an honorable mention for global impact.
            </span>
            <span data-lang="pt">
              O For She ganhou o 1º lugar no Hackathon das Manas, com uma menção honrosa por impacto global.
            </span>
          </span>
        </p>
        <Figure
          src={asset('/assets/projects/for-she/award.png')}
          alt="Hackathon das Manas 1st place award graphic for Team Marias Bonitas"
          onZoom={openLightbox}
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

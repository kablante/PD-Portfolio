import { useState } from 'react'
import ImageLightbox from '@/components/shared/ImageLightbox'
import { asset } from '@/lib/asset'
import { skillHue } from '../../home/skills'

const PROJECT_SKILLS = [
  'Marketing',
  'Conversion Rate Optimization (CRO)',
  'Cross-functional Collaboration',
  'User Research',
]

/** Every image on the page, in the order it appears - so the lightbox can
 * step through all of them (figures, gallery, and any future carousel)
 * regardless of which section or layout an image sits in. */
const ALL_IMAGES = [
  { src: asset('/assets/projects/boavista/Boavista_LP_-_Drafts.png'), alt: 'Boavista landing page redesign drafts' },
  {
    src: asset('/assets/projects/boavista/Boavista_LP_-_Old_Version.png'),
    alt: 'Previous version of the Boavista e-Extrato Card landing page',
  },
  { src: asset('/assets/projects/boavista/Benchmark_Equals.png'), alt: 'Benchmark of Equals landing page' },
  {
    src: asset('/assets/projects/boavista/Benchmark_NexxeraHubly.png'),
    alt: 'Benchmark of Nexxera Hubly landing page',
  },
  { src: asset('/assets/projects/boavista/Benchmark_Even.png'), alt: 'Benchmark of Even landing page' },
  {
    src: asset('/assets/projects/boavista/Boavista_LP_-_Photoshop_Wireframe.png'),
    alt: 'Photoshop wireframe for the Boavista landing page',
  },
  {
    src: asset('/assets/projects/boavista/Boavista_LP_-_Final_Design.png'),
    alt: 'Final Boavista e-Extrato Card landing page design',
  },
  { src: asset('/assets/projects/boavista/Boavista_LP_-_Results.png'), alt: 'Boavista landing page results' },
]

interface ZoomableProps {
  src: string
  alt: string
  onZoom: (image: { src: string; alt: string }) => void
}

function Figure({ src, alt, onZoom }: ZoomableProps) {
  return (
    <figure className="kb-project-figure">
      <button type="button" className="kb-project-zoom" onClick={() => onZoom({ src, alt })}>
        <img src={src} alt={alt} />
      </button>
    </figure>
  )
}

function ZoomableImage({ src, alt, onZoom }: ZoomableProps) {
  return (
    <button type="button" className="kb-project-zoom" onClick={() => onZoom({ src, alt })}>
      <img src={src} alt={alt} />
    </button>
  )
}

/** Boavista Tecnologia — e-Extrato Card landing-page redesign case study. */
export default function Boavista() {
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
          <span className="kb-project-meta-item__value">Product Designer, Visual Designer</span>
        </span>

        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Timeline</span>
            <span data-lang="pt">Período</span>
          </span>
          <span className="kb-project-meta-item__value">
            <span data-lang="en">June 3–5, 2021</span>
            <span data-lang="pt">3–5 de junho de 2021</span>
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
              Katarina Blante and{' '}
              <a href="https://www.linkedin.com/in/rayane-nunes/" target="_blank" rel="noopener noreferrer">
                Rayane Nunes
              </a>
            </span>
            <span data-lang="pt">
              Katarina Blante e{' '}
              <a href="https://www.linkedin.com/in/rayane-nunes/" target="_blank" rel="noopener noreferrer">
                Rayane Nunes
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
            Boavista Tecnologia&apos;s e-Extrato Card is a card-sales reconciliation product for retailers running
            multiple stores. During the company&apos;s rebranding, I redesigned its main landing page as the sole
            designer, working with Rayane Nunes on copy. The redesign doubled the page&apos;s conversion rate, from
            3% to 6%, on organic traffic alone.
          </span>
          <span data-lang="pt">
            O e-Extrato Card, da Boavista Tecnologia, é um produto de conciliação de vendas em cartão para
            varejistas com múltiplas lojas. Durante o rebranding da empresa, redesenhei a landing page principal
            como única designer, trabalhando com a Rayane Nunes no copy. O redesign dobrou a taxa de conversão da
            página, de 3% para 6%, só com tráfego orgânico.
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
            Boavista was going through a rebranding with a three-person marketing team and was shifting from
            outbound to inbound acquisition. That meant updating the company&apos;s main customer-facing touchpoints,
            with the e-Extrato Card landing page as the primary lead-generation surface.
          </span>
          <span data-lang="pt">
            A Boavista estava passando por um rebranding com uma equipe de marketing de três pessoas e migrando de
            aquisição outbound para inbound. Isso significava atualizar os principais pontos de contato com o
            cliente, com a landing page do e-Extrato Card como a principal superfície de geração de leads.
          </span>
        </p>

        <p>
          <span data-lang="en">
            RD Station showed a <span className="kb-project-highlight">3% conversion rate</span>. I proposed a
            redesign, brought in Rayane Nunes for copy, and we ran the project using a Double Diamond structure. We
            had three days.
          </span>
          <span data-lang="pt">
            O RD Station mostrava uma <span className="kb-project-highlight">taxa de conversão de 3%</span>. Propus
            um redesign, trouxe a Rayane Nunes para o copy, e conduzimos o projeto usando uma estrutura Double
            Diamond. Tínhamos três dias.
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
            The redesigned page converts at{' '}
            <span className="kb-project-highlight">6% on organic traffic alone</span>, with no paid acquisition
            behind the improvement.
          </span>
          <span data-lang="pt">
            A página redesenhada converte a{' '}
            <span className="kb-project-highlight">6% só com tráfego orgânico</span>, sem nenhuma aquisição paga por
            trás da melhoria.
          </span>
        </p>

        <Figure
          src={asset('/assets/projects/boavista/Boavista_LP_-_Drafts.png')}
          alt="Boavista landing page redesign drafts"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Process</span>
          <span data-lang="pt">Processo</span>
        </span>

        <h2>
          <span data-lang="en">Research</span>
          <span data-lang="pt">Pesquisa</span>
        </h2>

        <div className="kb-project-figure-row">
          <Figure
            src={asset('/assets/projects/boavista/Boavista_LP_-_Old_Version.png')}
            alt="Previous version of the Boavista e-Extrato Card landing page"
            onZoom={openLightbox}
          />

          <div>
            <p>
              <span data-lang="en">Hotjar findings and sales conversations surfaced a set of practical problems:</span>
              <span data-lang="pt">
                Descobertas do Hotjar e conversas com o time de vendas revelaram um conjunto de problemas práticos:
              </span>
            </p>

            <ul className="kb-project-list">
              <li>
                <span data-lang="en">
                  The form was outdated, the page was long, and most visitors never scrolled past the fold.
                </span>
                <span data-lang="pt">
                  O formulário estava desatualizado, a página era longa, e a maioria dos visitantes nunca rolava além
                  da primeira dobra.
                </span>
              </li>
              <li>
                <span data-lang="en">
                  Leads did not understand the product before speaking to sales, so calls often started at zero.
                </span>
                <span data-lang="pt">
                  Os leads não entendiam o produto antes de falar com o time de vendas, então as ligações costumavam
                  começar do zero.
                </span>
              </li>
              <li>
                <span data-lang="en">
                  Mobile traffic was low enough that a non-responsive redesign would not cost meaningful traffic.
                </span>
                <span data-lang="pt">
                  O tráfego mobile era baixo o suficiente para que um redesign não responsivo não custasse tráfego
                  relevante.
                </span>
              </li>
              <li>
                <span data-lang="en">
                  Screenshots were too small, while dense copy made the page difficult to follow.
                </span>
                <span data-lang="pt">
                  As capturas de tela eram pequenas demais, e o texto denso dificultava o acompanhamento da página.
                </span>
              </li>
              <li>
                <span data-lang="en">Social proof was old and thin.</span>
                <span data-lang="pt">A prova social era antiga e escassa.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Benchmarking</span>
          <span data-lang="pt">Benchmarking</span>
        </h2>

        <p>
          <span data-lang="en">
            Competitors split into two broad patterns: pages that educate before asking for a lead, and pages that
            push visitors directly toward a form or salesperson. Neither approach solved the core issue of helping
            prospects understand the product without a conversation.
          </span>
          <span data-lang="pt">
            Os concorrentes se dividiam em dois padrões amplos: páginas que educam antes de pedir um lead, e páginas
            que empurram o visitante direto para um formulário ou vendedor. Nenhuma das duas abordagens resolvia o
            problema central de ajudar o prospect a entender o produto sem precisar de uma conversa.
          </span>
        </p>

        <div className="kb-project-gallery">
          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset('/assets/projects/boavista/Benchmark_Equals.png')}
              alt="Benchmark of Equals landing page"
              onZoom={openLightbox}
            />
          </div>

          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset('/assets/projects/boavista/Benchmark_NexxeraHubly.png')}
              alt="Benchmark of Nexxera Hubly landing page"
              onZoom={openLightbox}
            />
          </div>

          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset('/assets/projects/boavista/Benchmark_Even.png')}
              alt="Benchmark of Even landing page"
              onZoom={openLightbox}
            />
          </div>
        </div>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Goals and Hypotheses</span>
          <span data-lang="pt">Metas e Hipóteses</span>
        </h2>

        <ul className="kb-project-list">
          <li>
            <span data-lang="en">Raise conversion and get leads to sales faster.</span>
            <span data-lang="pt">Aumentar a conversão e levar os leads até as vendas mais rápido.</span>
          </li>
          <li>
            <span data-lang="en">Restructure hierarchy and tighten the copy.</span>
            <span data-lang="pt">Reestruturar a hierarquia e enxugar o copy.</span>
          </li>
          <li>
            <span data-lang="en">Add a short educational video, capped at two minutes.</span>
            <span data-lang="pt">Adicionar um vídeo educativo curto, com no máximo dois minutos.</span>
          </li>
          <li>
            <span data-lang="en">
              Show the software in a simulated environment because the CEO did not want the live product public.
            </span>
            <span data-lang="pt">
              Mostrar o software em um ambiente simulado, já que o CEO não queria o produto real exposto
              publicamente.
            </span>
          </li>
          <li>
            <span data-lang="en">Keep social proof, while refreshing testimonials and webinar video clips.</span>
            <span data-lang="pt">Manter a prova social, atualizando depoimentos e clipes de vídeo de webinars.</span>
          </li>
        </ul>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Limitations</span>
          <span data-lang="pt">Limitações</span>
        </h2>

        <ul className="kb-project-list">
          <li>
            <span data-lang="en">
              The page had to be built inside RD Station, which constrained form placement and field count.
            </span>
            <span data-lang="pt">
              A página precisava ser construída dentro do RD Station, o que limitava o posicionamento do formulário
              e a quantidade de campos.
            </span>
          </li>
          <li>
            <span data-lang="en">
              The form had to remain above the fold with the full field count, per the supervisor&apos;s direction.
            </span>
            <span data-lang="pt">
              O formulário precisava permanecer acima da dobra com todos os campos, por orientação da supervisão.
            </span>
          </li>
          <li>
            <span data-lang="en">The page had to inform and sell without overwhelming the visitor.</span>
            <span data-lang="pt">A página precisava informar e vender sem sobrecarregar o visitante.</span>
          </li>
          <li>
            <span data-lang="en">
              There was no time to produce the planned video, so the educational piece became text plus illustration.
            </span>
            <span data-lang="pt">
              Não houve tempo para produzir o vídeo planejado, então a parte educativa virou texto mais ilustração.
            </span>
          </li>
        </ul>
      </section>

      <section className="kb-project-section">
        <h2>
          <span data-lang="en">Wireframes and Prototypes</span>
          <span data-lang="pt">Wireframes e Protótipos</span>
        </h2>

        <p>
          <span data-lang="en">
            I created a Photoshop wireframe and got leadership approval before moving into RD Station. The first
            draft was smaller: it had no statistics, six client logos instead of more, and less detail around
            differentiation. Leadership asked for more, so the final page grew beyond my preference. The early files
            were later lost during a server cleanup.
          </span>
          <span data-lang="pt">
            Criei um wireframe no Photoshop e consegui a aprovação da liderança antes de migrar para o RD Station. O
            primeiro rascunho era menor: sem estatísticas, seis logos de clientes em vez de mais, e menos detalhe
            sobre diferenciação. A liderança pediu mais, então a página final cresceu além do que eu preferia. Os
            arquivos originais foram perdidos depois em uma limpeza de servidor.
          </span>
        </p>

        <Figure
          src={asset('/assets/projects/boavista/Boavista_LP_-_Photoshop_Wireframe.png')}
          alt="Photoshop wireframe for the Boavista landing page"
          onZoom={openLightbox}
        />

        <p>
          <span data-lang="en">
            Once the structure was signed off, Rayane wrote the copy and I built the final page in RD Station.
          </span>
          <span data-lang="pt">
            Depois que a estrutura foi aprovada, a Rayane escreveu o copy e eu construí a página final no RD Station.
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Final Design</span>
          <span data-lang="pt">Design Final</span>
        </span>

        <div className="kb-project-figure-row">
          <Figure
            src={asset('/assets/projects/boavista/Boavista_LP_-_Final_Design.png')}
            alt="Final Boavista e-Extrato Card landing page design"
            onZoom={openLightbox}
          />

          <ul className="kb-project-list">
            <li>
              <span data-lang="en">
                The form was reworked to leave more visible content below the fold, while educational copy moved
                down so the CTA could lead.
              </span>
              <span data-lang="pt">
                O formulário foi reformulado para deixar mais conteúdo visível abaixo da dobra, enquanto o copy
                educativo foi movido para baixo para que o CTA liderasse.
              </span>
            </li>
            <li>
              <span data-lang="en">
                The product was reframed around the problems it solves rather than its features.
              </span>
              <span data-lang="pt">
                O produto foi reenquadrado em torno dos problemas que resolve, em vez das suas funcionalidades.
              </span>
            </li>
            <li>
              <span data-lang="en">A four-step method explains what sits behind the results.</span>
              <span data-lang="pt">Um método de quatro passos explica o que está por trás dos resultados.</span>
            </li>
            <li>
              <span data-lang="en">The strongest differences versus competitors are made explicit.</span>
              <span data-lang="pt">
                As maiores diferenças em relação aos concorrentes são deixadas explícitas.
              </span>
            </li>
            <li>
              <span data-lang="en">
                Statistics were added for credibility. I did not expect them to move conversion alone, but
                leadership wanted them.
              </span>
              <span data-lang="pt">
                Estatísticas foram adicionadas para dar credibilidade. Eu não esperava que elas movessem a conversão
                sozinhas, mas a liderança queria incluí-las.
              </span>
            </li>
            <li>
              <span data-lang="en">
                Client logos provide authority rather than being treated as a conversion lever.
              </span>
              <span data-lang="pt">
                Os logos de clientes trazem autoridade, em vez de serem tratados como uma alavanca de conversão.
              </span>
            </li>
            <li>
              <span data-lang="en">
                Testimonials link to a second page with video testimonials, mirroring the form and CTA from the top.
              </span>
              <span data-lang="pt">
                Os depoimentos linkam para uma segunda página com vídeos de depoimentos, espelhando o formulário e o
                CTA do topo.
              </span>
            </li>
            <li>
              <span data-lang="en">The final CTA returns visitors to the form.</span>
              <span data-lang="pt">O CTA final leva o visitante de volta ao formulário.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Product Successes</span>
          <span data-lang="pt">Resultados do Produto</span>
        </span>

        <div className="kb-project-stats">
          <div>
            <span className="kb-project-stats__value">2x</span>
            <span className="kb-project-stats__label">
              <span data-lang="en">Conversion rate, from 3% to 6%</span>
              <span data-lang="pt">Taxa de conversão, de 3% para 6%</span>
            </span>
          </div>
          <div>
            <span className="kb-project-stats__value">6%</span>
            <span className="kb-project-stats__label">
              <span data-lang="en">Organic-only conversion, held since launch</span>
              <span data-lang="pt">Conversão só com tráfego orgânico, mantida desde o lançamento</span>
            </span>
          </div>
        </div>

        <p>
          <span data-lang="en">
            The page has held at <span className="kb-project-highlight">6% organic-only conversion since launch</span>.
          </span>
          <span data-lang="pt">
            A página se mantém em <span className="kb-project-highlight">6% de conversão orgânica desde o lançamento</span>.
          </span>
        </p>

        <Figure
          src={asset('/assets/projects/boavista/Boavista_LP_-_Results.png')}
          alt="Boavista landing page results"
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

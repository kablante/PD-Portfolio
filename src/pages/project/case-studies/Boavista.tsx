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
          <span className="kb-project-meta-item__label">Role</span>
          <span className="kb-project-meta-item__value">Product Designer, Visual Designer</span>
        </span>

        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">Timeline</span>
          <span className="kb-project-meta-item__value">June 3–5, 2021</span>
        </span>
      </div>

      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">Team</span>
          <span className="kb-project-meta-item__value">
            Katarina Blante and{' '}
            <a
              href="https://www.linkedin.com/in/rayane-nunes/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rayane Nunes
            </a>
          </span>
        </span>
      </div>

      <div className="kb-project-skills">
        <span className="kb-project-skills__label">✦ skills &amp; toolkit</span>

        {PROJECT_SKILLS.map((label) => (
          <span
            key={label}
            className={`kb-project-skill kb-project-skill--${skillHue(label)}`}
          >
            {label}
          </span>
        ))}
      </div>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Overview</span>

        <p>
          Boavista Tecnologia&apos;s e-Extrato Card is a card-sales reconciliation
          product for retailers running multiple stores. During the company&apos;s
          rebranding, I redesigned its main landing page as the sole designer,
          working with Rayane Nunes on copy. The redesign doubled the page&apos;s
          conversion rate, from 3% to 6%, on organic traffic alone.
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Problem</span>

        <p>
          Boavista was going through a rebranding with a three-person marketing
          team and was shifting from outbound to inbound acquisition. That meant
          updating the company&apos;s main customer-facing touchpoints, with the
          e-Extrato Card landing page as the primary lead-generation surface.
        </p>

        <p>
          RD Station showed a{' '}
          <span className="kb-project-highlight">3% conversion rate</span>. I
          proposed a redesign, brought in Rayane Nunes for copy, and we ran the
          project using a Double Diamond structure. We had three days.
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Solution</span>

        <p>
          The redesigned page converts at{' '}
          <span className="kb-project-highlight">
            6% on organic traffic alone
          </span>
          , with no paid acquisition behind the improvement.
        </p>

        <Figure
          src={asset('/assets/projects/boavista/Boavista_LP_-_Drafts.png')}
          alt="Boavista landing page redesign drafts"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Process</span>

        <h2>Research</h2>

        <div className="kb-project-figure-row">
          <Figure
            src={asset('/assets/projects/boavista/Boavista_LP_-_Old_Version.png')}
            alt="Previous version of the Boavista e-Extrato Card landing page"
            onZoom={openLightbox}
          />

          <div>
            <p>
              Hotjar findings and sales conversations surfaced a set of practical
              problems:
            </p>

            <ul className="kb-project-list">
              <li>
                The form was outdated, the page was long, and most visitors never
                scrolled past the fold.
              </li>
              <li>
                Leads did not understand the product before speaking to sales, so
                calls often started at zero.
              </li>
              <li>
                Mobile traffic was low enough that a non-responsive redesign would
                not cost meaningful traffic.
              </li>
              <li>
                Screenshots were too small, while dense copy made the page
                difficult to follow.
              </li>
              <li>Social proof was old and thin.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="kb-project-section">
        <h2>Benchmarking</h2>

        <p>
          Competitors split into two broad patterns: pages that educate before
          asking for a lead, and pages that push visitors directly toward a form
          or salesperson. Neither approach solved the core issue of helping
          prospects understand the product without a conversation.
        </p>

        <div className="kb-project-gallery">
          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset(
                '/assets/projects/boavista/Benchmark_Equals.png',
              )}
              alt="Benchmark of Equals landing page"
              onZoom={openLightbox}
            />
          </div>

          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset(
                '/assets/projects/boavista/Benchmark_NexxeraHubly.png',
              )}
              alt="Benchmark of Nexxera Hubly landing page"
              onZoom={openLightbox}
            />
          </div>

          <div className="kb-project-gallery__item">
            <ZoomableImage
              src={asset(
                '/assets/projects/boavista/Benchmark_Even.png',
              )}
              alt="Benchmark of Even landing page"
              onZoom={openLightbox}
            />
          </div>
        </div>
      </section>

      <section className="kb-project-section">
        <h2>Goals and Hypotheses</h2>

        <ul className="kb-project-list">
          <li>Raise conversion and get leads to sales faster.</li>
          <li>Restructure hierarchy and tighten the copy.</li>
          <li>Add a short educational video, capped at two minutes.</li>
          <li>
            Show the software in a simulated environment because the CEO did not
            want the live product public.
          </li>
          <li>
            Keep social proof, while refreshing testimonials and webinar video
            clips.
          </li>
        </ul>
      </section>

      <section className="kb-project-section">
        <h2>Limitations</h2>

        <ul className="kb-project-list">
          <li>
            The page had to be built inside RD Station, which constrained form
            placement and field count.
          </li>
          <li>
            The form had to remain above the fold with the full field count, per
            the supervisor&apos;s direction.
          </li>
          <li>
            The page had to inform and sell without overwhelming the visitor.
          </li>
          <li>
            There was no time to produce the planned video, so the educational
            piece became text plus illustration.
          </li>
        </ul>
      </section>

      <section className="kb-project-section">
        <h2>Wireframes and Prototypes</h2>

        <p>
          I created a Photoshop wireframe and got leadership approval before
          moving into RD Station. The first draft was smaller: it had no
          statistics, six client logos instead of more, and less detail around
          differentiation. Leadership asked for more, so the final page grew
          beyond my preference. The early files were later lost during a server
          cleanup.
        </p>

        <Figure
          src={asset(
            '/assets/projects/boavista/Boavista_LP_-_Photoshop_Wireframe.png',
          )}
          alt="Photoshop wireframe for the Boavista landing page"
          onZoom={openLightbox}
        />

        <p>
          Once the structure was signed off, Rayane wrote the copy and I built the
          final page in RD Station.
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Final Design</span>

        <div className="kb-project-figure-row">
          <Figure
            src={asset(
              '/assets/projects/boavista/Boavista_LP_-_Final_Design.png',
            )}
            alt="Final Boavista e-Extrato Card landing page design"
            onZoom={openLightbox}
          />

          <ul className="kb-project-list">
            <li>
              The form was reworked to leave more visible content below the fold,
              while educational copy moved down so the CTA could lead.
            </li>
            <li>
              The product was reframed around the problems it solves rather than
              its features.
            </li>
            <li>
              A four-step method explains what sits behind the results.
            </li>
            <li>
              The strongest differences versus competitors are made explicit.
            </li>
            <li>
              Statistics were added for credibility. I did not expect them to
              move conversion alone, but leadership wanted them.
            </li>
            <li>
              Client logos provide authority rather than being treated as a
              conversion lever.
            </li>
            <li>
              Testimonials link to a second page with video testimonials,
              mirroring the form and CTA from the top.
            </li>
            <li>The final CTA returns visitors to the form.</li>
          </ul>
        </div>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          Product Successes
        </span>

        <div className="kb-project-stats">
          <div>
            <span className="kb-project-stats__value">2x</span>
            <span className="kb-project-stats__label">Conversion rate, from 3% to 6%</span>
          </div>
          <div>
            <span className="kb-project-stats__value">6%</span>
            <span className="kb-project-stats__label">Organic-only conversion, held since launch</span>
          </div>
        </div>

        <p>
          The page has held at{' '}
          <span className="kb-project-highlight">
            6% organic-only conversion since launch
          </span>
          .
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

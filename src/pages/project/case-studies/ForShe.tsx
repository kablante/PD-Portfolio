import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { type ReactNode, useRef, useState } from 'react'
import ImageLightbox from '@/components/shared/ImageLightbox'
import { asset } from '@/lib/asset'
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

  return (
    <>
      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">Role</span>
          <span className="kb-project-meta-item__value">Product Designer, Project Manager</span>
        </span>
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">Timeline</span>
          <span className="kb-project-meta-item__value">March 25–28, 2022</span>
        </span>
      </div>
      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">Team</span>
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
        <span className="kb-project-skills__label">✦ skills &amp; toolkit</span>
        {PROJECT_SKILLS.map((label) => (
          <span key={label} className={`kb-project-skill kb-project-skill--${skillHue(label)}`}>
            {label}
          </span>
        ))}
      </div>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Overview</span>
        <p>
          For She is a recruiting and training concept for women moving into tech, built over four days for{' '}
          <a
            href="https://www.linkedin.com/company/hackathon-das-manas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hackathon das Manas
          </a>
          , a non-profit hackathon run by and for women organized around United Nations Sustainable Development Goal 5: Gender
          Equality.
        </p>
        <p>
          I worked as designer and project manager on Marias Bonitas, a four-person team. A week after we submitted, the results came in:{' '}
          <span className="kb-project-highlight">1st place, plus an honorable mention for global impact.</span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Problem</span>
        <blockquote className="kb-project-quote">
          <p>
            What solutions can be developed to increase the use of core technologies, in particular information and
            communication technologies, to promote women's empowerment?
          </p>
        </blockquote>
        <p>
          Women are a minority in tech, and the gap starts before the job search: less encouragement to consider IT
          as a career, and workplaces that don't make it easy to stay once they're in.
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Solution</span>
        <p>
          Our answer was <span className="kb-project-highlight">a platform for recruiting and training women</span>. It combines
          internships, specialization programs, and mentoring, built specifically for women entering tech. The goal
          was to pair skill-building with an actual support system, so it doesn't stop once someone lands a role.
        </p>
        <Figure src={asset('/assets/projects/for-she/solution.png')} alt="For She platform concept overview" onZoom={openLightbox} />
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Process</span>
        <h2>User Research</h2>
        <p>
          The team was split between two competing ideas: a recruiting platform or a training platform. I mediated
          between them and made the call to merge the two: recruiting alone wouldn't fix the pipeline if candidates
          arrived unprepared, and training alone wouldn't get them hired faster.
        </p>
        <p>
          I ran project management for the sprint, using Trello for tasks and deadlines so a four-person team could
          move fast without losing track of scope.
        </p>
        <Figure src={asset('/assets/projects/for-she/trello.png')} alt="Trello board used to manage the sprint" onZoom={openLightbox} />
        <p>
          To test the idea, <span className="kb-project-highlight">we surveyed 40 women</span>. Most said they'd feel more comfortable applying to roles marked
          specifically for women, and preferred women as leaders or mentors.
        </p>
        <Figure
          src={asset('/assets/projects/for-she/survey-numbers.png')}
          alt="Survey results: 56% cite unequal pay and lack of diversity, 72% prefer women-only platforms, 75% face gender-related challenges entering the job market"
          onZoom={openLightbox}
        />
      </section>

      <section className="kb-project-section">
        <h2>Product Vision</h2>
        <p>
          The vision: a support system that's usually missing for women switching into tech, something close to a
          sorority for the industry. The first feature set:
        </p>
        <ul className="kb-project-list">
          <li>A brand and community presence, in the spirit of Ladies that UX</li>
          <li>An individual development plan (IDP)</li>
          <li>A dashboard for skills, background, and career goals</li>
          <li>Courses from community members and IT companies</li>
          <li>Mentorship, in both directions</li>
          <li>Job and internship listings reserved for women</li>
          <li>Space for freelancers and entrepreneurs to advertise</li>
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
          Two entry points into the platform: Mônica, a psychologist switching careers into UX at 32, and Ana, 19
          and just out of high school, already building PCs with her dad.
        </p>
        <Carousel prevLabel="Previous persona" nextLabel="Next persona">
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
        <h2>Business Plan</h2>
        <p>
          We mapped the model with a Lean Canvas, then benchmarked it against Catho and InfoJobs, the two platforms
          women already default to for job hunting in Brazil, to check that For She wasn't just a job board with a
          filter.
        </p>
        <Carousel prevLabel="Previous business plan slide" nextLabel="Next business plan slide">
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
        <h2>Site Map</h2>
        <Figure src={asset('/assets/projects/for-she/sitemap.png')} alt="Whiteboard site map of the For She platform" onZoom={openLightbox} />
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Final Design</span>
        <h2>Visual ID & Logo</h2>
        <Figure src={asset('/assets/projects/for-she/visual-id.png')} alt="For She logo lockups and color palette" onZoom={openLightbox} />
        <p>
          Navy blue, aqua, and purple were deliberate: navy for trust and professionalism, aqua for energy, purple
          for creativity. I made the call to skip pure pink, and the team agreed: a softer purple-magenta keeps a
          feminine tone without leaning on the cliché.
        </p>
      </section>

      <section className="kb-project-section">
        <h2>Prototypes and Wireframes</h2>
        <p>Wireframes came first, to lock structure before the visual identity went on.</p>
        <div className="kb-project-gallery">
          <div className="kb-project-gallery__item">
            <ZoomableImage src={asset('/assets/projects/for-she/wireframe-flows.png')} alt="Core flow wireframes" onZoom={openLightbox} />
          </div>
          <div className="kb-project-gallery__item">
            <ZoomableImage src={asset('/assets/projects/for-she/wireframe-dashboard.png')} alt="Dashboard wireframe" onZoom={openLightbox} />
          </div>
          <div className="kb-project-gallery__item">
            <ZoomableImage src={asset('/assets/projects/for-she/wireframe-home.png')} alt="Home screen wireframe" onZoom={openLightbox} />
          </div>
        </div>
      </section>

      <section className="kb-project-section">
        <h2>Pitch (PT-BR)</h2>
        <p>
          The pitch video was written and narrated by{' '}
          <a href="https://www.linkedin.com/in/virna-oliveira/" target="_blank" rel="noopener noreferrer">
            Virna Oliveira
          </a>
          .
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
            View pitch deck
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">Closing</span>
        <div className="kb-project-stats">
          <div>
            <span className="kb-project-stats__value">1st</span>
            <span className="kb-project-stats__label">Place, Hackathon das Manas</span>
          </div>
          <div>
            <span className="kb-project-stats__value">+1</span>
            <span className="kb-project-stats__label">Honorable mention, global impact</span>
          </div>
        </div>
        <p><span className="kb-project-highlight">For She won 1st place at Hackathon das Manas, with an honorable mention for global impact.</span></p>
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

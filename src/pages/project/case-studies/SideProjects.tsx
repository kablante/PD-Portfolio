import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode, useRef, useState } from 'react'
import ImageLightbox from '@/components/shared/ImageLightbox'
import { asset } from '@/lib/asset'

interface SideProjectImage {
  src: string
  alt: string
}

interface SideProjectEntry {
  name: string
  images: SideProjectImage[]
  /** One to three sentences: what it is, who it was with, and the outcome, if there is one. */
  description: ReactNode
  tools: string
  timeline: string
}

/** Each small project gets a name, a gallery, a short description, and a
 * closing line of tools + timeline - no extended case-study breakdown like
 * the other project pages. Add entries here as each one is written up. */
const PROJECTS: SideProjectEntry[] = [
  {
    name: 'Fortal City',
    images: [
      {
        src: asset('/assets/projects/side-projects/Fortal_City_-_Screen_1.png'),
        alt: 'Fortal City title screen over a stylized Fortaleza skyline',
      },
      {
        src: asset('/assets/projects/side-projects/Fortal_City_-_Screen_2.png'),
        alt: 'Fortal City gameplay: a rider dodging obstacles while collecting coins',
      },
      {
        src: asset('/assets/projects/side-projects/Fortal_City_-_Screen_3.png'),
        alt: 'Fortal City store screen where coins are exchanged for real discount coupons',
      },
      {
        src: asset('/assets/projects/side-projects/Fortal_City_-_Screen_4.png'),
        alt: 'Vaporwave-styled Fortaleza skyline art direction for Fortal City',
      },
      {
        src: asset('/assets/projects/side-projects/Fortal_City_-_Screen_Iracema.jpeg'),
        alt: 'The Iracema statue on Fortaleza’s waterfront, one of the landmarks featured in Fortal City',
      },
    ],
    description: (
      <>
        A <span className="kb-project-highlight">mobile advergame</span> prototype that rewards players with real discount coupons at local stores, built with{' '}
        <a href="https://www.linkedin.com/in/adelaide-brito/" target="_blank" rel="noopener noreferrer">
          Adelaide Brito
        </a>{' '}
        for Sebrae's game development program in Ceará. The game highlighted Fortaleza's tourist attractions beyond
        its beaches. It drew interest from several companies, but partnership deals never closed, so the project is
        on hold.
      </>
    ),
    tools: 'Adobe Photoshop',
    timeline: 'December 2020',
  },
  {
    name: 'Mobills',
    images: [
      {
        src: asset('/assets/projects/side-projects/Mobills_Study_-Selling_1.png'),
        alt: 'Mobills marketing screen: "Revolutionize your financial world with a sleek, intuitive interface"',
      },
      {
        src: asset('/assets/projects/side-projects/Mobills_Study-Screen_1.png'),
        alt: 'Mobills dashboard: assets and rates, reminders, goals, and investment overview',
      },
      {
        src: asset('/assets/projects/side-projects/Mobills_Study-_Screen_2.png'),
        alt: 'Mobills projection screen with a 6-month growth forecast graph',
      },
      {
        src: asset('/assets/projects/side-projects/Mobills_Study_-_Cover.png'),
        alt: 'Mobills app screens showing total assets, projections, and goals',
      },
    ],
    description:
      'A design challenge for the fintech Mobills: a mobile app to track and forecast investments across multiple institutions in one place, built for millennial investors.',
    tools: 'Adobe XD',
    timeline: 'October 2021',
  },
]

function ZoomableImage({ src, alt, onZoom }: SideProjectImage & { onZoom: (image: SideProjectImage) => void }) {
  return (
    <button type="button" className="kb-project-zoom" onClick={() => onZoom({ src, alt })}>
      <img src={src} alt={alt} />
    </button>
  )
}

/** Scrolls the nearest-to-center slide's neighbor into view - same behavior
 * as the carousels on For She. */
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

/** Every image on the page, in the order it appears - so the lightbox can
 * step through every project's carousel in one continuous sequence. */
const ALL_IMAGES = PROJECTS.flatMap((project) => project.images)

/** Side Projects — a running collection of small work, each entry standing
 * on its own instead of one long case study. */
export default function SideProjects() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openLightbox = ({ src }: SideProjectImage) =>
    setLightboxIndex(ALL_IMAGES.findIndex((image) => image.src === src))

  return (
    <>
      {PROJECTS.map((project) => (
        <section key={project.name} className="kb-project-section">
          <h2>{project.name}</h2>

          <Carousel prevLabel={`Previous ${project.name} image`} nextLabel={`Next ${project.name} image`}>
            {project.images.map((image) => (
              <div className="kb-project-carousel__slide" key={image.src}>
                <ZoomableImage src={image.src} alt={image.alt} onZoom={openLightbox} />
              </div>
            ))}
          </Carousel>

          <p>{project.description}</p>

          <span className="kb-project-meta">
            {project.tools} · {project.timeline}
          </span>
        </section>
      ))}

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

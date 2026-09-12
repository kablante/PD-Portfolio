import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'

interface LightboxImage {
  src: string
  alt: string
}

interface Props {
  images: LightboxImage[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
}

/** Full-size preview for any project image - click the backdrop, the close
 * button, or Escape to dismiss. Shared across figures/carousels/galleries so
 * every image (besides the page header) opens the same way, and - since
 * `images` is the full ordered list of images on the page - side arrows and
 * arrow keys step through every one of them regardless of which section or
 * layout (figure, gallery, carousel) it came from. */
export default function ImageLightbox({ images, index, onNavigate, onClose }: Props) {
  const image = images[index]
  const hasMultiple = images.length > 1

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (hasMultiple && e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length)
      if (hasMultiple && e.key === 'ArrowRight') onNavigate((index + 1) % images.length)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, onNavigate, index, images.length, hasMultiple])

  if (!image) return null

  return (
    <div className="kb-lightbox" role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose}>
      <button type="button" className="kb-icon-btn kb-icon-btn--outline kb-lightbox__close" aria-label="Close" onClick={onClose}>
        <X size={20} aria-hidden="true" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="kb-icon-btn kb-icon-btn--outline kb-lightbox__nav kb-lightbox__nav--prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index - 1 + images.length) % images.length)
            }}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="kb-icon-btn kb-icon-btn--outline kb-lightbox__nav kb-lightbox__nav--next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index + 1) % images.length)
            }}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </>
      )}

      <img className="kb-lightbox__img" src={image.src} alt={image.alt} onClick={(e) => e.stopPropagation()} />

      {hasMultiple && (
        <span className="kb-lightbox__counter" onClick={(e) => e.stopPropagation()}>
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  )
}

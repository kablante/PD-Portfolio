import { X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  src: string
  alt: string
  onClose: () => void
}

/** Full-size preview for any project image - click the backdrop, the close
 * button, or Escape to dismiss. Shared across figures/carousels/galleries so
 * every image (besides the page header) opens the same way. */
export default function ImageLightbox({ src, alt, onClose }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="kb-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button type="button" className="kb-icon-btn kb-icon-btn--outline kb-lightbox__close" aria-label="Close" onClick={onClose}>
        <X size={20} aria-hidden="true" />
      </button>
      <img className="kb-lightbox__img" src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  )
}

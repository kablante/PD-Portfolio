import { asset } from '@/lib/asset'
export interface HomeProject {
  slug: string
  image: string
  /** Project-page header image, if it differs from the home card's own
   * (cropped-for-the-card) `image` - falls back to `image` when unset. */
  headerImage?: string
  rotation: string
  title: string
  descEn?: string
  descPt?: string
}

/** Shared `view-transition-name` so the card image on Home and the header
 * image on its ProjectPage are treated as the same element by the View
 * Transitions API - that's what produces the container-transform morph
 * instead of a plain cross-fade. Must stay unique per project. */
export function projectImageTransitionName(slug: string) {
  return `project-image-${slug}`
}

export const homeProjects: HomeProject[] = [
  {
    slug: 'VNT-Station-branch',
    image: asset('/assets/projects/VNT-Station-branch.jpg'),
    headerImage: asset('/assets/projects/VNT/VNT-Station-branch'),
    rotation: '-3.859deg',
    title: 'Venturus',
  },
  {
    slug: 'VNT-Help.jpg',
    image: asset('/assets/projects/VNT-Help.jpg'),
    headerImage: asset('/assets/projects/VNT/VNT-Help'),
    rotation: '1.891deg',
    title: 'Venturus',
  },
  {
    slug: 'boavista',
    image: asset('/assets/projects/boavista.png'),
    headerImage: asset('/assets/projects/boavista/Boavista_LP_-_Cover.png'),
    rotation: '-0.207deg',
    title: 'Boavista',
  },
  {
    slug: 'for-she',
    image: asset('/assets/projects/for-she.png'),
    headerImage: asset('/assets/projects/for-she/for-she.png'),
    rotation: '2.596deg',
    title: 'For She',
  },
  {
    slug: 'side-projects',
    image: asset('/assets/projects/side-projects.png'),
    headerImage: asset('/assets/projects/side-projects/side-projects-header.jpg'),
    rotation: '-3.466deg',
    title: 'Side Projects',
  },
]

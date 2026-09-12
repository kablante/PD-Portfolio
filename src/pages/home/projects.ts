import { asset } from '@/lib/asset'
export interface HomeProject {
  slug: string
  image: string
  /** Project-page header image, if it differs from the home card's own
   * (cropped-for-the-card) `image` - falls back to `image` when unset. */
  headerImage?: string
  /** Skips the header image on the project page entirely - for case studies
   * (like Side Projects) that open straight into their own content instead
   * of a single hero shot. */
  hideHeaderImage?: boolean
  rotation: string
  title: string
  /** Portuguese version of `title` - falls back to `title` when unset. */
  titlePt?: string
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
    image: asset('/assets/projects/VNT-Station-branch.png'),
    // Placeholder header - Venturus's own screenshots are pending disclosure/NDA clearance.
    headerImage: asset('/assets/projects/VNT/VNT.jpg'),
    rotation: '-3.859deg',
    title: 'Venturus',
  },
  {
    slug: 'VNT-Help',
    image: asset('/assets/projects/VNT-Help.png'),
    // Placeholder header - Venturus's own screenshots are pending disclosure/NDA clearance.
    headerImage: asset('/assets/projects/VNT/VNT.jpg'),
    rotation: '1.891deg',
    title: 'Venturus: Help Page Redesign & AI Chatbot',
    titlePt: 'Venturus: Redesign da Página de Help e Chatbot de IA',
  },
  {
    slug: 'boavista',
    image: asset('/assets/projects/boavista.png'),
    headerImage: asset('/assets/projects/boavista/Boavista_LP_-_Cover.png'),
    rotation: '-0.207deg',
    title: 'Boavista: Landing Page Redesign',
    titlePt: 'Boavista: Redesign da Landing Page',
  },
  {
    slug: 'for-she',
    image: asset('/assets/projects/for-she.png'),
    headerImage: asset('/assets/projects/for-she/for-she.png'),
    rotation: '2.596deg',
    title: 'For She: Recruiting & Training Platform',
    titlePt: 'For She: Plataforma de Recrutamento e Capacitação',
  },
  {
    slug: 'side-projects',
    image: asset('/assets/projects/side-projects.png'),
    hideHeaderImage: true,
    rotation: '-3.466deg',
    title: 'Side Projects',
    titlePt: 'Projetos Paralelos',
  },
]

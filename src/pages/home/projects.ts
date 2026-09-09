import { asset } from '@/lib/asset'
export interface HomeProject {
  slug: string
  image: string
  /** Project-page header image, if it differs from the home card's own
   * (cropped-for-the-card) `image` - falls back to `image` when unset. */
  headerImage?: string
  rotation: string
  title: string
  descEn: string
  descPt: string
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
    slug: 'aurora-bank',
    image: asset('/assets/projects/aurora-bank.png'),
    rotation: '-3.859deg',
    title: 'Venturus',
    descEn:
      'Aurora asked for a faster signup. What people actually needed was to know where they were in the process, and what would happen next.',
    descPt:
      'A Aurora pediu um cadastro mais rápido. O que as pessoas precisavam, na verdade, era saber onde estavam no processo e o que viria depois.',
  },
  {
    slug: 'petal',
    image: asset('/assets/projects/petal.jpg'),
    rotation: '1.891deg',
    title: 'Venturus',
    descEn:
      'Every plant app I found sent guilt. Petal reframes care as a weekly rhythm you can miss without failing.',
    descPt:
      'Todo app de plantas que encontrei mandava culpa. O Petal transforma o cuidado num ritmo semanal que você pode furar sem fracassar.',
  },
  {
    slug: 'cosmos-learn',
    image: asset('/assets/projects/cosmos-learn.png'),
    rotation: '-0.207deg',
    title: 'Boavista',
    descEn:
      "Boavista's landing page wasn't converting. Marketing had three days and no budget for a redo. I proposed one anyway, and it doubled the conversion rate.",
    descPt:
      'A landing page da Boavista não estava convertendo. O marketing tinha três dias e nenhum orçamento para refazer. Propus uma mesmo assim, e ela dobrou a taxa de conversão.',
  },
  {
    slug: 'for-she',
    image: asset('/assets/projects/for-she.png'),
    headerImage: asset('/assets/projects/for-she/for-she.png'),
    rotation: '2.596deg',
    title: 'For She',
    descEn:
      'Hackathon das Manas gave us a weekend to design a platform for women entering tech. We placed 1st, with an honorable mention for global impact.',
    descPt:
      'O Hackathon das Manas nos deu um fim de semana para desenhar uma plataforma para mulheres entrando em tech. Ficamos em 1º lugar, com menção honrosa por impacto global.',
  },
  {
    slug: 'nebula-studio',
    image: asset('/assets/projects/nebula-studio.png'),
    rotation: '-3.466deg',
    title: 'Fortal City Game',
    descEn:
      'A mobile advergame for local Fortaleza businesses, built in three days for the Sebrae Dev Program. Sunny-beach-city tourism, minus the beach cliché.',
    descPt:
      'Um advergame mobile para negócios locais de Fortaleza, construído em três dias para o Sebrae Dev Program. Turismo de cidade praiana e ensolarada, sem o clichê de praia.',
  },
]

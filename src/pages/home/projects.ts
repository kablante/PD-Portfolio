export interface HomeProject {
  slug: string
  image: string
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
    image: '/assets/projects/aurora-bank.png',
    rotation: '-3.859deg',
    title: 'Aurora Bank',
    descEn:
      'Aurora asked for a faster signup. What people actually needed was to know where they were in the process, and what would happen next.',
    descPt:
      'A Aurora pediu um cadastro mais rápido. O que as pessoas precisavam, na verdade, era saber onde estavam no processo e o que viria depois.',
  },
  {
    slug: 'petal',
    image: '/assets/projects/petal.jpg',
    rotation: '1.891deg',
    title: 'Petal',
    descEn:
      'Every plant app I found sent guilt. Petal reframes care as a weekly rhythm you can miss without failing.',
    descPt:
      'Todo app de plantas que encontrei mandava culpa. O Petal transforma o cuidado num ritmo semanal que você pode furar sem fracassar.',
  },
  {
    slug: 'cosmos-learn',
    image: '/assets/projects/cosmos-learn.png',
    rotation: '-0.207deg',
    title: 'Cosmos Learn',
    descEn:
      'Most of these students study between 11pm and 2am, on a phone, with one hand. The desktop-first platform they had ignored all of that.',
    descPt:
      'A maioria desses alunos estuda entre 23h e 2h, no celular, com uma mão só. A plataforma que eles tinham era feita para desktop e ignorava tudo isso.',
  },
  {
    slug: 'verao',
    image: '/assets/projects/verao.png',
    rotation: '2.596deg',
    title: 'Verão',
    descEn: 'Six properties, one booking flow, and a guest who is usually deciding on a bus with bad signal.',
    descPt: 'Seis unidades, um fluxo de reserva e um hóspede que normalmente decide dentro do ônibus, com sinal ruim.',
  },
  {
    slug: 'nebula-studio',
    image: '/assets/projects/nebula-studio.png',
    rotation: '-3.466deg',
    title: 'Nébula Studio',
    descEn:
      'A three-person motion studio with beautiful work and a portfolio nobody could scan. The fix was editing, not decoration.',
    descPt:
      'Um estúdio de motion de três pessoas, com trabalhos bonitos e um portfólio que ninguém conseguia percorrer. A solução foi edição, não decoração.',
  },
]

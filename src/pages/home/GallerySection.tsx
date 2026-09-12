import StackSpread, { type StackSpreadCard } from '@/components/ui/stack-spread'
import { asset } from '@/lib/asset'
import { homeProjects } from './projects'

const vnt = (slug: string) => homeProjects.find((p) => p.slug === slug)!
const boavista = homeProjects.find((p) => p.slug === 'boavista')!
const forShe = homeProjects.find((p) => p.slug === 'for-she')!

/** Every source image here is a 16:9 screenshot (unlike the original demo's
 * portrait stock photos), so every card shares that same `aspect` instead
 * of each getting its own w/h box - see the `aspect` field on
 * StackSpreadTarget in stack-spread.tsx. */
const ASPECT_16_9 = 16 / 9

/** Six cards, in a symmetric 3-row scatter (three left/right pairs), same
 * position system as the original eight-card layout with two of its slots
 * dropped. Side Projects has no header image of its own (see
 * hideHeaderImage in projects.ts), so it contributes two of its case
 * study's own screenshots instead of one: Fortal City's next-to-last shot
 * and Mobills' last one. `z` (not array order) sets stacking order - the
 * two Venturus cards sit on top of the pile (highest z), the rest fill in
 * behind them. */
const CARDS: StackSpreadCard[] = [
  {
    item: {
      src: vnt('VNT-Station-branch').headerImage!,
      alt: vnt('VNT-Station-branch').title,
      href: '/projects/VNT-Station-branch',
    },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -18,
    target: { x: -20, y: -34, rotate: 0, scale: 0.9, w: 22, aspect: ASPECT_16_9 },
    targetSm: { x: -22, y: -30 },
    z: 6,
  },
  {
    item: {
      src: vnt('VNT-Help').headerImage!,
      alt: vnt('VNT-Help').title,
      href: '/projects/VNT-Help',
    },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 20,
    target: { x: 32, y: -30, rotate: 0, scale: 0.9, w: 24, aspect: ASPECT_16_9 },
    targetSm: { x: 22, y: -30 },
    z: 7,
  },
  {
    item: {
      src: boavista.headerImage!,
      alt: boavista.title,
      href: '/projects/boavista',
    },
    stackOffset: { x: -16, y: 0 },
    stackRotate: -4,
    target: { x: -36, y: -2, rotate: 0, scale: 0.9, w: 22, aspect: ASPECT_16_9 },
    targetSm: { x: -22, y: 0 },
    z: 2,
  },
  {
    item: {
      src: forShe.headerImage!,
      alt: forShe.title,
      href: '/projects/for-she',
    },
    stackOffset: { x: 18, y: 1 },
    stackRotate: 6,
    target: { x: 37, y: 6, rotate: 0, scale: 0.8, w: 24, aspect: ASPECT_16_9 },
    targetSm: { x: 22, y: 0 },
    z: 3,
  },
  {
    item: {
      src: asset('/assets/projects/side-projects/Fortal_City_-_Screen_4.png'),
      alt: 'Fortal City',
      href: '/projects/side-projects',
    },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 6,
    target: { x: -24, y: 34, rotate: 0, scale: 0.9, w: 26, aspect: ASPECT_16_9 },
    targetSm: { x: -22, y: 30 },
    z: 4,
  },
  {
    item: {
      src: asset('/assets/projects/side-projects/Mobills_Study_-_Cover.png'),
      alt: 'Mobills',
      href: '/projects/side-projects',
    },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -7,
    target: { x: 30, y: 34, rotate: 0, scale: 0.9, w: 20, aspect: ASPECT_16_9 },
    targetSm: { x: 22, y: 30 },
    z: 5,
  },
]

/** Gallery — a scroll-driven scatter of every project's own cover shot
 * (Side Projects, which has none of its own, contributes two case-study
 * screenshots instead), each one a link straight to that project page. */
export default function GallerySection() {
  return (
    <StackSpread
      cards={CARDS}
      textColor="var(--kb-white)"
      cardRadius={20}
      scrollLength={175}
      showScrollHint={false}
      title={
        <>
          <span data-lang="en">
            The
            <br />
            Work.
          </span>
          <span data-lang="pt">
            O
            <br />
            Trabalho.
          </span>
        </>
      }
      subtitle={
        <>
          <span data-lang="en">Six projects, one scroll - click through to see how each one came together.</span>
          <span data-lang="pt">Seis projetos, um scroll só - clique para ver como cada um foi construído.</span>
        </>
      }
    />
  )
}

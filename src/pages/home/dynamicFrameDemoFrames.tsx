import type { Lang } from './useHomeEffects'
import { ButtonsCell, ChatbotCell, LongTextCell, TagsCell, TimezoneCell } from './frameGridCells'

/** Frame grid content for the home page's second section. Mixes plain image
 * tiles (real project photos) with arbitrary React content per cell -
 * DynamicFrameLayout doesn't require media, see its `content` field. */
export function getDynamicFrameItems(lang: Lang) {
  return [
    { id: 1, image: '/assets/projects/aurora-bank.png', defaultPos: { x: 0, y: 0, w: 4, h: 4 }, mediaSize: 1 },
    { id: 2, content: <LongTextCell />, defaultPos: { x: 4, y: 0, w: 4, h: 4 }, mediaSize: 1 },
    { id: 3, content: <TagsCell />, defaultPos: { x: 8, y: 0, w: 4, h: 4 }, mediaSize: 1 },
    { id: 4, content: <TimezoneCell />, defaultPos: { x: 0, y: 4, w: 4, h: 4 }, mediaSize: 1 },
    { id: 5, content: <ButtonsCell lang={lang} />, defaultPos: { x: 4, y: 4, w: 4, h: 4 }, mediaSize: 1 },
    { id: 6, content: <ChatbotCell />, defaultPos: { x: 8, y: 4, w: 4, h: 4 }, mediaSize: 1 },
    { id: 7, image: '/assets/projects/petal.jpg', defaultPos: { x: 0, y: 8, w: 4, h: 4 }, mediaSize: 1 },
    { id: 8, image: '/assets/projects/verao.png', defaultPos: { x: 4, y: 8, w: 4, h: 4 }, mediaSize: 1 },
    { id: 9, image: '/assets/projects/nebula-studio.png', defaultPos: { x: 8, y: 8, w: 4, h: 4 }, mediaSize: 1 },
  ]
}

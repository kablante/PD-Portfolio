import type { CSSProperties } from 'react'
import Sparkle from './Sparkle'

interface ConfettiBase {
  /** Position within the nearest positioned ancestor, as CSS percentages. */
  left: string
  top: string
  color?: string
  opacity?: number
  /** How far this piece drifts (px) at the pointer's full range - see
   * .kb-confetti's translate rule in kb-site.css. Defaults per type below. */
  depth?: number
}
interface ConfettiPip extends ConfettiBase {
  type: 'pip'
  size: number
}
interface ConfettiSpark extends ConfettiBase {
  type: 'spark'
  size: string
}
interface ConfettiBlob extends ConfettiBase {
  type: 'blob'
  size: string
}
export type ConfettiItem = ConfettiPip | ConfettiSpark | ConfettiBlob

const DEFAULT_DEPTH: Record<ConfettiItem['type'], number> = { pip: 20, spark: 26, blob: 10 }

/** A small cluster of decorative dots/sparkles/blobs, the same look as the
 * Who section's original hand-placed confetti (see .kb-who__pip/-spark/-blob
 * in kb-site.css) but reusable in any section: each item carries its own
 * position, size and parallax depth instead of a lettered CSS class per
 * spot. Every piece reads the same --kb-px/--kb-py cursor-parallax values
 * as the aurora background's orbs (see useAuroraParallax), just at its own
 * `depth`, so the whole page's confetti drifts together under one cursor
 * signal. Renders into an inset:0 layer, so the caller's own element must
 * be positioned (relative/absolute) for the percentages to land correctly. */
export default function Confetti({ items, className }: { items: ConfettiItem[]; className?: string }) {
  let sparkIndex = 0
  return (
    <div className={`kb-confetti-layer${className ? ` ${className}` : ''}`} aria-hidden="true">
      {items.map((item, i) => {
        const depth = item.depth ?? DEFAULT_DEPTH[item.type]
        const style = {
          left: item.left,
          top: item.top,
          opacity: item.opacity,
          '--confetti-depth': `${depth}px`,
        } as CSSProperties

        if (item.type === 'pip') {
          return (
            <span
              key={i}
              className="kb-confetti kb-confetti--pip"
              style={{ ...style, width: item.size, height: item.size, background: item.color }}
            />
          )
        }
        if (item.type === 'spark') {
          // Twinkle (see .kb-sparkle in kb-site.css) reads its own resting
          // brightness from --confetti-opacity rather than a plain `opacity`
          // - the keyframe animates opacity itself, which would otherwise
          // just override a directly-set inline value outright. Staggering
          // animation-delay by spark order keeps a handful of sparks from
          // all pulsing in exact unison.
          const { opacity, ...rest } = style
          return (
            <Sparkle
              key={i}
              className="kb-confetti kb-confetti--spark"
              style={{
                ...rest,
                width: item.size,
                color: item.color,
                '--confetti-opacity': opacity ?? 1,
                animationDelay: `${(sparkIndex++ * 0.9).toFixed(1)}s`,
              }}
            />
          )
        }
        return <span key={i} className="kb-confetti kb-confetti--blob" style={{ ...style, width: item.size }} />
      })}
    </div>
  )
}

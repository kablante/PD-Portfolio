import type { CSSProperties } from 'react'

/** Small decorative shapes for the bento grid, ported from the KPop Carrd
 * Figma export's Sparkle4/SmallDiamond/Blob helpers - generic shapes, just
 * recolored onto the site's own accent tokens by the caller. */

export function Sparkle4({ size = 28, color = 'var(--kb-blush)', style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill={color} style={style} aria-hidden="true">
      <path d="M14 0 L15.8 12.2 L28 14 L15.8 15.8 L14 28 L12.2 15.8 L0 14 L12.2 12.2 Z" />
    </svg>
  )
}

export function SmallDiamond({
  size = 14,
  color = 'var(--kb-lavender)',
  style,
}: {
  size?: number
  color?: string
  style?: CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill={color} style={style} aria-hidden="true">
      <path d="M7 0 L9 5 L14 7 L9 9 L7 14 L5 9 L0 7 L5 5 Z" />
    </svg>
  )
}

export function Blob({ color, width, height, style }: { color: string; width: number; height: number; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width,
        height,
        background: color,
        borderRadius: '62% 38% 46% 54% / 60% 44% 56% 40%',
        filter: 'blur(1px)',
        pointerEvents: 'none',
        zIndex: 10,
        ...style,
      }}
    />
  )
}

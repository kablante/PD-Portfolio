import { useRef } from 'react'
import { useAuroraParallax, useSiteGrain } from '@/pages/home/useHomeEffects'

/** Site-wide fixed background - previously a drifting gradient mesh + star
 * field, now a set of soft pulsing glow orbs (ported from the KPop Carrd
 * Figma bento layout, recolored onto the site's own accent tokens). Keeps
 * the same dark-void base and grain texture, and the same cursor-parallax
 * wiring (--kb-px/--kb-py) as before. Shared by Home and ProjectPage so
 * both stay in sync.
 *
 * `grainOverlay` (default true) controls the animated full-page grain
 * canvas from useSiteGrain, on top of everything including page content -
 * project pages turn it off since it fought the reading content's
 * legibility, keeping only the static texture baked into .kb-aurora__grain
 * below (part of the fixed background itself, unaffected by this prop). */
export default function AuroraBackground({ grainOverlay = true }: { grainOverlay?: boolean } = {}) {
  const bgRef = useRef<HTMLDivElement>(null)
  useAuroraParallax(bgRef)
  useSiteGrain(grainOverlay)

  return (
    <div className="kb-bg" aria-hidden="true" ref={bgRef}>
      <div className="kb-aurora">
        <span className="kb-aurora__orb kb-aurora__orb--1" />
        <span className="kb-aurora__orb kb-aurora__orb--2" />
        <span className="kb-aurora__orb kb-aurora__orb--3" />
        <span className="kb-aurora__orb kb-aurora__orb--4" />
        <span className="kb-aurora__orb kb-aurora__orb--5" />
        <span className="kb-aurora__grain" />
      </div>
    </div>
  )
}

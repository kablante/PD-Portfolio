import { useRef } from 'react'
import { useAuroraParallax, useSiteGrain } from '@/pages/home/useHomeEffects'

/** Site-wide fixed background - previously a drifting gradient mesh + star
 * field, now a set of soft pulsing glow orbs (ported from the KPop Carrd
 * Figma bento layout, recolored onto the site's own accent tokens). Keeps
 * the same dark-void base and grain texture, and the same cursor-parallax
 * wiring (--kb-px/--kb-py) as before. Shared by Home and ProjectPage so
 * both stay in sync. */
export default function AuroraBackground() {
  const bgRef = useRef<HTMLDivElement>(null)
  useAuroraParallax(bgRef)
  useSiteGrain()

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

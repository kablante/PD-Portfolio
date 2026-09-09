import LogoArtBlanteLine from './LogoArtBlanteLine'
import LogoArtEn from './LogoArtEn'
import LogoArtKatarinaLine from './LogoArtKatarinaLine'
import LogoArtPt from './LogoArtPt'
import LogoArtTaglineEn from './LogoArtTaglineEn'
import LogoArtTaglinePt from './LogoArtTaglinePt'

/** Renders the design system's own traced vector paths instead of live
 * text - no installed font reproduces the K's swash, the sparkle shapes or
 * the dot placements closely enough (see LogoArtEn.tsx's comment). Two
 * layouts render at once, one per breakpoint (kb-site.css shows exactly
 * one, via display:none on the other): kb-logo-art--desktop is the one-line
 * "Katarina Blante" + tagline lockup (LogoArtEn/LogoArtPt); kb-logo-art
 * --mobile reflows the same artwork as three stacked pieces - "Katarina",
 * "Blante", tagline - reproducing the two-line layout the old live-text
 * build got from a real line-break.
 *
 * Both are decorative (aria-hidden, since raw <path> elements carry no
 * text semantics of their own) - kb-logo__sr-text below is the one real,
 * always-present heading that assistive tech and search engines see. */
export default function LogoWordmark() {
  return (
    <div className="kb-logo">
      <div className="kb-logo-art kb-logo-art--desktop">
        <span data-lang="en">
          <LogoArtEn className="kb-logo-art__svg" />
        </span>
        <span data-lang="pt">
          <LogoArtPt className="kb-logo-art__svg" />
        </span>
      </div>
      <div className="kb-logo-art kb-logo-art--mobile">
        <LogoArtKatarinaLine className="kb-logo-art__line kb-logo-art__line--katarina" />
        <LogoArtBlanteLine className="kb-logo-art__line kb-logo-art__line--blante" />
        <span data-lang="en">
          <LogoArtTaglineEn className="kb-logo-art__line kb-logo-art__line--tagline" />
        </span>
        <span data-lang="pt">
          <LogoArtTaglinePt className="kb-logo-art__line kb-logo-art__line--tagline" />
        </span>
      </div>
      <h1 className="kb-logo__sr-text">Katarina Blante</h1>
      <p className="kb-logo__sr-text">
        <span data-lang="en">product designer</span>
        <span data-lang="pt">designer de produto</span>
      </p>
    </div>
  )
}

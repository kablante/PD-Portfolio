import Dot from '@/components/shared/Dot'
import Sparkle from '@/components/shared/Sparkle'

/** Live-text rebuild of the old logo-wordmark.svg (vectorized letter
 * outlines, one static asset per language, plus a second one-line/two-line
 * pair - Logo.svg and "2 lines.svg" - defining how the design system wants
 * the name to reflow on narrow screens). Same three flourishes as the
 * original - a dot inside the K, the dot of the "i" in Katarina swapped for
 * a sparkle, and a sparkle+dot pair closing out the name, using the actual
 * traced shapes (Sparkle/Dot) rather than approximations - but built from
 * the actual --font-display/--font-hand faces so size, spacing and the
 * flourishes themselves scale and animate with CSS instead of being baked
 * into fixed SVG coordinates. Bilingual only in the tagline; the name
 * itself doesn't change between languages, so it isn't duplicated.
 *
 * The line break between "Katarina" and "Blante" is a real <br>, shown only
 * below the DS's mobile breakpoint (kb-logo__linebreak in kb-site.css) -
 * deliberate two-line/one-line layouts as the two reference SVGs show it,
 * not just "whatever happens to fit". */
export default function LogoWordmark() {
  return (
    <div className="kb-logo">
      <h1 className="kb-logo__name">
        <span className="kb-logo__word">
          <span className="kb-logo__k">
            K<Dot className="kb-logo__k-dot" />
          </span>
          atar
          <span className="kb-logo__i">
            {'ı'}
            <Sparkle className="kb-logo__i-spark" />
          </span>
          na
        </span>{' '}
        <br className="kb-logo__linebreak" />
        <span className="kb-logo__word">
          Blante
          <span className="kb-logo__flourish" aria-hidden="true">
            <Sparkle className="kb-logo__flourish-spark" />
            <Dot className="kb-logo__flourish-dot" />
          </span>
        </span>
      </h1>
      <p className="kb-logo__tagline">
        <span data-lang="en">product designer</span>
        <span data-lang="pt">designer de produto</span>
      </p>
    </div>
  )
}

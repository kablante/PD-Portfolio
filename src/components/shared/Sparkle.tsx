/** The site's actual sparkle/twinkle mark, traced from the design system's
 * logo asset (Logo.svg / "2 lines.svg") rather than a generic 4-point star -
 * a soft concave-sided twinkle, not a sharp diamond. Sized and positioned
 * from CSS by the caller. */
export default function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="333 15 19 31" fill="currentColor" aria-hidden="true">
      <path d="M351.136 28.448C351.081 28.4443 345.827 27.9841 343.745 16.2928C343.668 15.8595 343.296 15.541 342.856 15.541H342.838C342.405 15.541 342.028 15.8437 341.937 16.2676C341.911 16.3814 339.396 27.6817 333.9 29.5246C333.581 29.631 333.345 29.9035 333.285 30.2351C333.226 30.5671 333.352 30.906 333.613 31.1171C333.691 31.1802 341.314 37.4218 341.709 44.693C341.734 45.1548 342.099 45.5283 342.56 45.5642C342.584 45.5659 342.607 45.5659 342.631 45.5659C343.065 45.5659 343.444 45.2632 343.534 44.8319C343.554 44.7363 345.622 35.164 351.686 30.0767C351.976 29.8351 352.08 29.4397 351.961 29.0813C351.844 28.7218 351.512 28.4714 351.136 28.448Z" />
    </svg>
  )
}

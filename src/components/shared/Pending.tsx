import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'

/** Block-level stand-in for a screenshot/figure the client hasn't cleared
 * for disclosure yet - keeps the section's shape without faking content. */
export function PendingImage({ children }: { children: ReactNode }) {
  return (
    <div className="kb-project-pending">
      <Lock size={18} aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}

/** Inline stand-in for a metric missing mid-sentence, for the same reason. */
export function PendingMetric({ children }: { children: ReactNode }) {
  return (
    <span className="kb-project-pending-inline">
      <Lock size={12} aria-hidden="true" />
      {children}
    </span>
  )
}

import { PendingImage } from '@/components/shared/Pending'

/** Venturus — Station/Branch project. Case study content is still pending
 * Venturus's disclosure/NDA clearance, same as VNTHelp - this page exists
 * so the card has somewhere real to land while that clearance is pending,
 * instead of just the site chrome with no explanation. */
export default function VNTStationBranch() {
  return (
    <section className="kb-project-section">
      <span className="kb-project-section__eyebrow">
        <span data-lang="en">Overview</span>
        <span data-lang="pt">Visão Geral</span>
      </span>

      <PendingImage>
        <span data-lang="en">Full case study pending Venturus disclosure/NDA clearance.</span>
        <span data-lang="pt">Estudo de caso completo pendente de liberação de disclosure/NDA da Venturus.</span>
      </PendingImage>
    </section>
  )
}

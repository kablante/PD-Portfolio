/** The small hand-drawn accent dot from the design system's logo asset -
 * a slightly wobbly blob rather than a perfect circle. Used for the dot
 * inside the K and the dot that closes the wordmark's flourish. */
export default function Dot({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="964 57 7 7" fill="currentColor" aria-hidden="true">
      <path d="M964.879 61.2677C965.072 62.2175 965.819 62.9911 966.765 63.2086C967.854 63.4589 968.982 62.8726 969.57 61.9601C970.145 61.0673 970.142 59.8769 969.571 58.9818C969.393 58.7029 969.153 58.4498 968.88 58.239C968.719 58.0585 968.533 57.8994 968.31 57.7853C967.264 57.2517 965.809 57.3476 965.295 58.5686C964.928 59.4399 964.686 60.3175 964.879 61.2677Z" />
    </svg>
  )
}

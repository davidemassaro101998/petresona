/** ResonaPet's signature mark: the double-crest signal line that appears
 * lit up behind Giorgia in her portrait. Reused here as a small vector motif
 * (not a photo crop) so it can recur across the site — section dividers,
 * diagram connectors — as the one recognizably "biorisonanza" visual, the
 * thing no generic wellness template has. Kept to the --color-signal accent
 * only, never as a fill/background, so it stays a mark rather than a theme. */
export function FrequencyWave({
  className,
  strokeWidth = 3,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 400 80"
      fill="none"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 60 C 40 60, 55 8, 95 8 S 150 60, 190 60 S 245 8, 285 8 S 360 60, 400 60"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

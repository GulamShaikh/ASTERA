type Tone = 'dark' | 'light'

const TONE_CLASSES: Record<Tone, string> = {
  dark: 'bg-white/[0.07]',
  light: 'bg-slate-200',
}

type SkeletonProps = {
  className?: string
  tone?: Tone
}

/** Neutral loading placeholder. `tone` matches the section's background, not the content. */
export function Skeleton({ className = '', tone = 'dark' }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg ${TONE_CLASSES[tone]} ${className}`} />
}

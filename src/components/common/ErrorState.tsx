import { Button } from './Button'
import { IconInfo } from './icons'

type Tone = 'dark' | 'light'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  tone?: Tone
  className?: string
}

/**
 * Shown when a catalogue request fails. Deliberately generic: the underlying
 * error is logged to the console (see useAsyncData), not surfaced to visitors.
 */
export function ErrorState({
  title = "We couldn't load this right now",
  description = 'Something went wrong reaching the ASTERA catalogue. Please try again in a moment.',
  onRetry,
  tone = 'dark',
  className = '',
}: ErrorStateProps) {
  const isDark = tone === 'dark'

  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-4 rounded-2xl border px-6 py-16 text-center ${
        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'
      } ${className}`}
    >
      <IconInfo className={`h-10 w-10 ${isDark ? 'text-starlight/30' : 'text-slate-300'}`} />
      <div className="flex flex-col gap-1.5">
        <h2 className={`font-heading text-lg font-semibold ${isDark ? 'text-white' : 'text-space-black'}`}>{title}</h2>
        <p className={`max-w-sm text-sm ${isDark ? 'text-starlight/60' : 'text-slate-600'}`}>{description}</p>
      </div>
      {onRetry && (
        <Button variant={isDark ? 'secondary-dark' : 'secondary-light'} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}

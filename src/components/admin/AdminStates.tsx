import type { ComponentType, ReactNode, SVGProps } from 'react'
import { IconInfo, IconPackageSearch } from '../common/icons'

export function AdminLoadingState({ label = 'Loading…', rows = 5 }: { label?: string; rows?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-2">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-lg bg-white/[0.05]" />
      ))}
    </div>
  )
}

export function AdminErrorState({
  title = "Couldn't load this",
  description = 'Something went wrong talking to the catalogue. Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-6 py-12 text-center"
    >
      <IconInfo className="h-8 w-8 text-red-300/70" />
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-base font-semibold text-white">{title}</h2>
        <p className="max-w-md text-sm text-starlight/65">{description}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon = IconPackageSearch,
  action,
}: {
  title: string
  description: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <Icon className="h-8 w-8 text-starlight/30" />
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-base font-semibold text-white">{title}</h2>
        <p className="max-w-md text-sm text-starlight/60">{description}</p>
      </div>
      {action}
    </div>
  )
}

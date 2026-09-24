import type { ComponentType, ReactNode, SVGProps } from 'react'
import { IconPackageSearch } from './icons'

type Tone = 'dark' | 'light'

type EmptyStateProps = {
  title: string
  description: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  action?: ReactNode
  tone?: Tone
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = IconPackageSearch,
  action,
  tone = 'dark',
  className = '',
}: EmptyStateProps) {
  const isDark = tone === 'dark'

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl border px-6 py-20 text-center ${
        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'
      } ${className}`}
    >
      <Icon className={`h-10 w-10 ${isDark ? 'text-starlight/30' : 'text-slate-300'}`} />
      <div className="flex flex-col gap-1.5">
        <h2 className={`font-heading text-lg font-semibold ${isDark ? 'text-white' : 'text-space-black'}`}>{title}</h2>
        <p className={`max-w-sm text-sm ${isDark ? 'text-starlight/60' : 'text-slate-600'}`}>{description}</p>
      </div>
      {action}
    </div>
  )
}

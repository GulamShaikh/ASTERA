import type { ContentStatus } from '../../types/catalogue'

const STATUS_STYLES: Record<ContentStatus, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  draft: { label: 'Draft', className: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
  archived: { label: 'Archived', className: 'bg-white/[0.06] text-starlight/55 border-white/15' },
}

export function AdminStatusBadge({ status }: { status: ContentStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${style.className}`}>
      {style.label}
    </span>
  )
}

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type AdminCrumb = { label: string; href?: string }

type AdminPageHeaderProps = {
  title: string
  description?: string
  breadcrumbs?: AdminCrumb[]
  actions?: ReactNode
}

export function AdminPageHeader({ title, description, breadcrumbs, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-starlight/50">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {crumb.href && !isLast ? (
                    <Link to={crumb.href} className="hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-starlight/75' : ''}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span aria-hidden="true">/</span>}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">{title}</h1>
          {description && <p className="max-w-2xl text-sm text-starlight/60">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}

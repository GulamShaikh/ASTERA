import { Link } from 'react-router-dom'
import type { Brand } from '../../types/catalogue'
import { IconArrowRight } from '../common/icons'

type BrandCardProps = {
  brand: Brand
}

/** Initials stand in until a brand supplies a real logo (brands.logo_url). */
export function BrandMonogram({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] font-heading font-semibold text-starlight ${className}`}
    >
      {initials}
    </span>
  )
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      to={`/brands/${brand.id}`}
      className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-surface p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] transition-[translate,border-color,box-shadow] duration-300 hover:border-champagne/40 hover:shadow-[0_28px_60px_-28px_rgba(37,99,235,0.35)] motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <div className="flex items-center gap-3">
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={`${brand.name} logo`}
            loading="lazy"
            className="h-11 w-11 rounded-xl border border-white/15 bg-white/[0.06] object-contain p-1.5"
          />
        ) : (
          <BrandMonogram name={brand.name} className="h-11 w-11 text-sm" />
        )}
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-lg font-semibold text-white transition-colors group-hover:text-cosmic-blue-light">
            {brand.name}
          </h3>
          <span className="w-fit rounded-full bg-cosmic-blue/10 px-2.5 py-0.5 text-xs font-medium text-cosmic-blue-light">
            {brand.category}
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-starlight/70">{brand.description}</p>

      {(brand.featured || brand.local) && (
        <div className="flex flex-wrap gap-2">
          {brand.featured && (
            <span className="rounded-full bg-champagne/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-champagne">
              Featured
            </span>
          )}
          {brand.local && (
            <span className="rounded-full bg-cosmic-blue/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-starlight">
              Local Brand
            </span>
          )}
        </div>
      )}

      <div className="-mx-6 -mb-6 mt-auto flex items-center justify-between border-t border-white/10 bg-black/20 px-6 py-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-champagne">Brand Showcase</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cosmic-blue-light">
          Explore Brand
          <IconArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

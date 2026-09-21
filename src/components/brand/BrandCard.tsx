import type { Brand } from '../../data/brands'

type BrandCardProps = {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-heading text-lg font-semibold text-white">{brand.name}</h3>
        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-medium text-starlight/70">
          {brand.category}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-starlight/70">{brand.description}</p>
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-champagne">Brand Showcase</span>
        <button type="button" className="text-sm font-semibold text-white hover:text-starlight">
          Explore Brand →
        </button>
      </div>
    </div>
  )
}

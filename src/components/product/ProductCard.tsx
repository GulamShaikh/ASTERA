import type { Product } from '../../data/products'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const Icon = product.icon

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:border-cosmic-blue/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/[0.06] to-transparent">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-12 w-12 text-white/25" />
          </div>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-champagne/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-champagne">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-starlight/60">{product.brand}</span>
        <h3 className="font-heading text-base font-semibold text-white">{product.name}</h3>
        <p className="text-sm leading-relaxed text-starlight/70">{product.description}</p>
        <button
          type="button"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-cosmic-blue/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cosmic-blue/25"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

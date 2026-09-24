import { Link } from 'react-router-dom'
import type { Product } from '../../types/catalogue'
import { formatPrice } from '../../lib/format'
import { IconArrowRight } from '../common/icons'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const Icon = product.icon

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-4 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] transition-[translate,border-color,box-shadow] duration-300 hover:border-cosmic-blue/50 hover:shadow-[0_28px_60px_-28px_rgba(37,99,235,0.45)] motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-space-black">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-12 w-12 text-white/25" />
          </div>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-md border border-champagne/40 bg-space-black/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-champagne">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-starlight/60">{product.brand}</span>
        <h3 className="font-heading mt-1 text-lg font-semibold text-white transition-colors group-hover:text-cosmic-blue-light">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-starlight/65">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {product.price !== undefined ? (
            <span className="font-heading text-xl font-semibold text-white">{formatPrice(product.price)}</span>
          ) : (
            <span className="text-sm text-starlight/60">Price on enquiry</span>
          )}
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cosmic-blue px-3.5 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-[#2f6df0]">
            View Details
            <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

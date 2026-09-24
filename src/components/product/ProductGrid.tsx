import type { ReactNode } from 'react'
import type { Product } from '../../types/catalogue'
import { ProductCard } from './ProductCard'
import { Skeleton } from '../common/Skeleton'
import { ErrorState } from '../common/ErrorState'
import { EmptyState } from '../common/EmptyState'

type ProductGridProps = {
  products: Product[] | null
  loading: boolean
  error: Error | null
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  columns?: 3 | 4
  skeletonCount?: number
}

const COLUMN_CLASSES: Record<3 | 4, string> = {
  3: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4',
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-3 h-9 w-full rounded-full" />
      </div>
    </div>
  )
}

/** Product listing with its loading / error / empty states — shared by Shop, category, brand and related-product sections. */
export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  emptyTitle = 'No products found',
  emptyDescription = "Try a different search term or category — ASTERA's catalogue is still growing.",
  emptyAction,
  columns = 4,
  skeletonCount = 4,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={COLUMN_CLASSES[columns]} aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState onRetry={onRetry} description="Something went wrong loading these products. Please try again." />
  }

  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
  }

  return (
    <div className={COLUMN_CLASSES[columns]}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

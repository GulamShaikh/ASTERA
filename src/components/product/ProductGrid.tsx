import type { ReactNode } from 'react'
import type { Product } from '../../types/catalogue'
import { ProductCard } from './ProductCard'
import { Skeleton } from '../common/Skeleton'
import { ErrorState } from '../common/ErrorState'
import { EmptyState } from '../common/EmptyState'
import { RAIL_CONTAINER, RAIL_ITEM } from '../common/scrollRail'

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
  /** 'rail' swipes horizontally on phones and becomes the normal grid from `sm` up; 'grid' (default) stacks vertically at every width — see Shop.tsx for why the full catalogue keeps 'grid'. */
  layout?: 'grid' | 'rail'
}

const COLUMN_SUFFIX: Record<3 | 4, string> = {
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

function containerClasses(columns: 3 | 4, layout: 'grid' | 'rail') {
  const cols = COLUMN_SUFFIX[columns]
  return layout === 'rail' ? `${RAIL_CONTAINER} ${cols}` : `grid gap-5 ${cols}`
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
  layout = 'grid',
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={containerClasses(columns, layout)} aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }, (_, index) =>
          layout === 'rail' ? (
            <div key={index} className={RAIL_ITEM}>
              <ProductCardSkeleton />
            </div>
          ) : (
            <ProductCardSkeleton key={index} />
          ),
        )}
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
    <div className={containerClasses(columns, layout)}>
      {products.map((product) =>
        layout === 'rail' ? (
          <div key={product.id} className={RAIL_ITEM}>
            <ProductCard product={product} />
          </div>
        ) : (
          <ProductCard key={product.id} product={product} />
        ),
      )}
    </div>
  )
}

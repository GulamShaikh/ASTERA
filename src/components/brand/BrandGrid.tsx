import type { Brand } from '../../types/catalogue'
import { BrandCard } from './BrandCard'
import { Skeleton } from '../common/Skeleton'
import { ErrorState } from '../common/ErrorState'
import { EmptyState } from '../common/EmptyState'
import { IconStar } from '../common/icons'
import { RAIL_CONTAINER, RAIL_ITEM } from '../common/scrollRail'

type BrandGridProps = {
  brands: Brand[] | null
  loading: boolean
  error: Error | null
  onRetry?: () => void
  skeletonCount?: number
  /** 'rail' swipes horizontally on phones and becomes the normal grid from `md` up; 'grid' (default) stacks vertically at every width. */
  layout?: 'grid' | 'rail'
}

const COLS = 'grid-cols-1 md:grid-cols-3'

function containerClasses(layout: 'grid' | 'rail') {
  return layout === 'rail' ? `${RAIL_CONTAINER} ${COLS}` : `grid gap-5 ${COLS}`
}

function BrandCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="mt-2 h-4 w-full" />
    </div>
  )
}

export function BrandGrid({ brands, loading, error, onRetry, skeletonCount = 3, layout = 'grid' }: BrandGridProps) {
  if (loading) {
    return (
      <div className={containerClasses(layout)} aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }, (_, index) =>
          layout === 'rail' ? (
            <div key={index} className={RAIL_ITEM}>
              <BrandCardSkeleton />
            </div>
          ) : (
            <BrandCardSkeleton key={index} />
          ),
        )}
      </div>
    )
  }

  if (error) {
    return <ErrorState onRetry={onRetry} description="Something went wrong loading brands. Please try again." />
  }

  if (!brands || brands.length === 0) {
    return (
      <EmptyState
        icon={IconStar}
        title="No brands published yet"
        description="Partner brands will appear here as ASTERA onboards them."
      />
    )
  }

  return (
    <div className={containerClasses(layout)}>
      {brands.map((brand) =>
        layout === 'rail' ? (
          <div key={brand.id} className={RAIL_ITEM}>
            <BrandCard brand={brand} />
          </div>
        ) : (
          <BrandCard key={brand.id} brand={brand} />
        ),
      )}
    </div>
  )
}

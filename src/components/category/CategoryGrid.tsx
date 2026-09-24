import type { Category } from '../../types/catalogue'
import { CategoryCard } from './CategoryCard'
import { Skeleton } from '../common/Skeleton'
import { ErrorState } from '../common/ErrorState'
import { EmptyState } from '../common/EmptyState'

type CategoryGridProps = {
  categories: Category[] | null
  loading: boolean
  error: Error | null
  onRetry?: () => void
  skeletonCount?: number
}

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
      <Skeleton tone="light" className="h-11 w-11 rounded-xl" />
      <Skeleton tone="light" className="h-5 w-2/3" />
      <Skeleton tone="light" className="h-3 w-full" />
      <Skeleton tone="light" className="h-3 w-32" />
    </div>
  )
}

/** CategoryCard is styled for light sections, so this grid and its states are light-toned. */
export function CategoryGrid({ categories, loading, error, onRetry, skeletonCount = 4 }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState tone="light" onRetry={onRetry} description="Something went wrong loading categories. Please try again." />
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        tone="light"
        title="No categories published yet"
        description="Categories will appear here once they're published from the ASTERA admin."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}

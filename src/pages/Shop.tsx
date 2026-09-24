import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchPublishedCategories, fetchPublishedProducts } from '../lib/api'
import { ALL_CATEGORIES, SORT_OPTIONS, filterProducts, sortProducts, isSortOption } from '../lib/products'
import { Container } from '../components/common/Container'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { ProductGrid } from '../components/product/ProductGrid'
import { Skeleton } from '../components/common/Skeleton'
import { IconSearch, IconChevronDown } from '../components/common/icons'

export function Shop() {
  usePageTitle('Shop — ASTERA')
  const [searchParams, setSearchParams] = useSearchParams()

  const productsState = useAsyncData(() => fetchPublishedProducts(), [])
  const categoriesState = useAsyncData(() => fetchPublishedCategories(), [])

  const products = productsState.data
  const categoryFilters = useMemo(
    () => [ALL_CATEGORIES, ...(categoriesState.data ?? []).map((category) => category.name)],
    [categoriesState.data],
  )

  const requestedCategory = searchParams.get('category') ?? ALL_CATEGORIES
  // Keep an unknown/unpublished ?category= value from silently filtering everything out.
  const activeCategory =
    categoriesState.data && !categoryFilters.includes(requestedCategory) ? ALL_CATEGORIES : requestedCategory
  const query = searchParams.get('q') ?? ''
  const sortParam = searchParams.get('sort')
  const sortValue = isSortOption(sortParam) ? sortParam : 'featured'

  const results = useMemo(() => {
    if (!products) return null
    return sortProducts(filterProducts(products, activeCategory, query), sortValue)
  }, [products, activeCategory, query, sortValue])

  function updateParam(key: 'category' | 'q' | 'sort', value: string) {
    const next = new URLSearchParams(searchParams)
    const isDefault =
      value === '' || (key === 'category' && value === ALL_CATEGORIES) || (key === 'sort' && value === 'featured')
    if (isDefault) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const hasActiveFilters = activeCategory !== ALL_CATEGORIES || query.length > 0 || sortValue !== 'featured'
  const total = products?.length ?? 0

  return (
    <main className="bg-space-black">
      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            level="h1"
            eyebrow="Full Catalogue"
            heading="Shop ASTERA"
            description="Search, filter, and sort every accessory ASTERA has discovered so far."
            tone="dark"
            accent="champagne"
          />

          <div className="flex flex-col gap-4">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-starlight/40" />
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <input
                id="shop-search"
                type="search"
                value={query}
                onChange={(event) => updateParam('q', event.target.value)}
                placeholder="Search products, brands, or categories…"
                className="w-full rounded-full border border-white/15 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-starlight/40 focus:border-cosmic-blue focus:outline-none focus:ring-2 focus:ring-cosmic-blue/30"
              />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {categoriesState.loading ? (
                <div className="flex gap-2 overflow-hidden pb-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
                  {categoryFilters.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => updateParam('category', name)}
                      aria-pressed={activeCategory === name}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        activeCategory === name
                          ? 'bg-cosmic-blue text-white'
                          : 'border border-white/15 text-starlight/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative shrink-0">
                <label htmlFor="shop-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="shop-sort"
                  value={sortValue}
                  onChange={(event) => updateParam('sort', event.target.value)}
                  className="w-full appearance-none rounded-full border border-white/15 bg-white/[0.03] py-2.5 pl-4 pr-10 text-sm text-white focus:border-cosmic-blue focus:outline-none focus:ring-2 focus:ring-cosmic-blue/30 lg:w-48"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-space-black text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-starlight/50" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-starlight/60">
              {productsState.loading
                ? 'Loading products…'
                : results === null
                  ? ''
                  : results.length === total
                    ? `Showing all ${total} ${total === 1 ? 'product' : 'products'}`
                    : `Showing ${results.length} of ${total} products`}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-white hover:text-starlight"
              >
                Clear filters
              </button>
            )}
          </div>

          <ProductGrid
            products={results}
            loading={productsState.loading}
            error={productsState.error}
            onRetry={productsState.refetch}
            emptyTitle="No products found"
            emptyDescription={
              hasActiveFilters
                ? "Try a different search term or category — ASTERA's catalogue is still growing."
                : "ASTERA's catalogue is still growing. Published products will appear here."
            }
            emptyAction={
              hasActiveFilters ? (
                <Button variant="secondary-dark" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        </Container>
      </section>
    </main>
  )
}

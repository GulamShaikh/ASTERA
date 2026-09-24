import { useMemo, useState } from 'react'
import type { Product } from '../../types/catalogue'
import type { AsyncResult } from '../../hooks/useAsyncData'
import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { Button } from '../common/Button'
import { ProductGrid } from '../product/ProductGrid'

const ALL = 'All Products'
const MAX_VISIBLE = 8

type NewArrivalsProps = {
  state: AsyncResult<Product[]>
}

export function NewArrivals({ state }: NewArrivalsProps) {
  const { data: products, loading, error, refetch } = state
  const [activeFilter, setActiveFilter] = useState(ALL)

  const filters = useMemo(
    () => [ALL, ...new Set((products ?? []).map((product) => product.category))],
    [products],
  )

  const visibleProducts = useMemo(() => {
    if (!products) return null
    const filtered = activeFilter === ALL ? products : products.filter((product) => product.category === activeFilter)
    return filtered.slice(0, MAX_VISIBLE)
  }, [products, activeFilter])

  return (
    <section id="new-arrivals" className="bg-space-black py-20 lg:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="New Arrivals & Daily Picks"
            heading="Curated Online Catalog"
            description="Freshly discovered essentials from emerging and independent accessory makers."
            tone="dark"
            accent="champagne"
          />

          {filters.length > 1 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-cosmic-blue text-white'
                      : 'border border-white/15 text-starlight/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        <ProductGrid
          products={visibleProducts}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyTitle="No products published yet"
          emptyDescription="New arrivals will appear here as ASTERA's catalogue grows."
          layout="rail"
        />

        {products && products.length > 0 && (
          <div className="flex justify-center">
            <Button href="/shop" variant="secondary-dark" withArrow>
              View All Products
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}

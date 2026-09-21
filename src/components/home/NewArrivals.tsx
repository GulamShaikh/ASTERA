import { useMemo, useState } from 'react'
import { products } from '../../data/products'
import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { ProductCard } from '../product/ProductCard'

const ALL = 'All Products'

export function NewArrivals() {
  const filters = useMemo(() => [ALL, ...new Set(products.map((product) => product.category))], [])
  const [activeFilter, setActiveFilter] = useState(ALL)

  const visibleProducts =
    activeFilter === ALL ? products : products.filter((product) => product.category === activeFilter)

  return (
    <section id="new-arrivals" className="bg-space-black py-20 lg:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="New Arrivals & Daily Picks"
            heading="New Arrivals & Daily Picks"
            description="Freshly discovered essentials from emerging and independent accessory makers."
            tone="dark"
            accent="champagne"
          />

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
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}

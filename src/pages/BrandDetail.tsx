import { useParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchBrandBySlug, fetchProductsByBrandSlug } from '../lib/api'
import { Container } from '../components/common/Container'
import { Button } from '../components/common/Button'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Skeleton } from '../components/common/Skeleton'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { ProductGrid } from '../components/product/ProductGrid'
import { BrandMonogram } from '../components/brand/BrandCard'
import { IconStar } from '../components/common/icons'

export function BrandDetail() {
  const { slug = '' } = useParams<{ slug: string }>()

  const brandState = useAsyncData(() => fetchBrandBySlug(slug), [slug])
  const productsState = useAsyncData(() => fetchProductsByBrandSlug(slug), [slug])

  const brand = brandState.data
  usePageTitle(brand ? `${brand.name} — ASTERA` : 'Brand — ASTERA')

  const notFound = !brandState.loading && !brandState.error && !brand

  return (
    <main className="bg-space-black">
      <section className="border-b border-white/10 bg-midnight py-12 lg:py-16">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Brands', href: '/brands' },
              { label: brand?.name ?? 'Brand' },
            ]}
          />

          {brandState.loading ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <Skeleton className="h-10 w-80 max-w-full" />
              <Skeleton className="h-4 w-full max-w-xl" />
            </div>
          ) : brandState.error ? (
            <ErrorState
              onRetry={brandState.refetch}
              description="Something went wrong loading this brand. Please try again."
            />
          ) : notFound ? (
            <EmptyState
              icon={IconStar}
              title="Brand not found"
              description="This brand may have been unpublished, archived, or the link may be incorrect."
              action={
                <Button href="/brands" variant="secondary-dark" withArrow>
                  View All Brands
                </Button>
              }
            />
          ) : (
            brand && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="h-14 w-14 rounded-xl border border-white/15 bg-white/[0.06] object-contain p-2"
                    />
                  ) : (
                    <BrandMonogram name={brand.name} className="h-14 w-14 text-lg" />
                  )}
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {brand.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-medium text-starlight/70">
                        {brand.category}
                      </span>
                      {brand.featured && (
                        <span className="rounded-full bg-champagne/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-champagne">
                          Featured
                        </span>
                      )}
                      {brand.local && (
                        <span className="rounded-full bg-cosmic-blue/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-starlight">
                          Local Brand
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-starlight/75">{brand.description}</p>
              </div>
            )
          )}
        </Container>
      </section>

      {!notFound && !brandState.error && (
        <section className="py-12 lg:py-16">
          <Container className="flex flex-col gap-6">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
              Products from {brand?.name ?? 'this brand'}
            </h2>

            <ProductGrid
              products={productsState.data}
              loading={productsState.loading}
              error={productsState.error}
              onRetry={productsState.refetch}
              emptyTitle="No products from this brand yet"
              emptyDescription="ASTERA hasn't published products for this brand yet — check back soon."
              emptyAction={
                <Button href="/shop" variant="secondary-dark" withArrow>
                  Browse the Full Catalogue
                </Button>
              }
            />
          </Container>
        </section>
      )}
    </main>
  )
}

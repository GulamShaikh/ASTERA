import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchProductDetailBySlug, fetchRelatedProducts } from '../lib/api'
import { formatPrice, stockStatusLabel } from '../lib/format'
import { productEnquiryMessage } from '../lib/whatsapp'
import type { ProductDetail as ProductDetailType, StockStatus } from '../types/catalogue'
import { Container } from '../components/common/Container'
import { Button } from '../components/common/Button'
import { WhatsAppButton } from '../components/common/WhatsAppButton'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Skeleton } from '../components/common/Skeleton'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { ProductGrid } from '../components/product/ProductGrid'
import { IconPackageSearch } from '../components/common/icons'

const STOCK_CLASSES: Record<StockStatus, string> = {
  in_stock: 'bg-cosmic-blue/15 text-white',
  out_of_stock: 'bg-white/10 text-starlight/70',
  preorder: 'bg-champagne/15 text-champagne',
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2" aria-busy="true" aria-live="polite">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-52 rounded-full" />
      </div>
    </div>
  )
}

function ProductGallery({ product }: { product: ProductDetailType }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const Icon = product.icon
  const images = product.images
  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent">
        {activeImage ? (
          <img src={activeImage.url} alt={activeImage.alt} className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center">
            <Icon className="h-16 w-16 text-white/25" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              className={`h-20 w-20 overflow-hidden rounded-xl border transition-colors ${
                index === activeIndex ? 'border-cosmic-blue' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductInfo({ product }: { product: ProductDetailType }) {
  const hasDiscount =
    product.price !== undefined && product.compareAtPrice !== undefined && product.compareAtPrice > product.price

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.categorySlug && (
            <Link
              to={`/categories/${product.categorySlug}`}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-starlight/75 transition-colors hover:border-white/30 hover:text-white"
            >
              {product.category}
            </Link>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STOCK_CLASSES[product.stockStatus]}`}>
            {stockStatusLabel(product.stockStatus)}
          </span>
          {product.featured && (
            <span className="rounded-full bg-champagne/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-champagne">
              Featured
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">{product.name}</h1>

        {product.brandSlug ? (
          <Link to={`/brands/${product.brandSlug}`} className="w-fit text-sm font-semibold text-white hover:text-starlight">
            by {product.brand}
          </Link>
        ) : (
          <span className="text-sm font-semibold text-starlight/75">by {product.brand}</span>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        {product.price !== undefined ? (
          <>
            <span className="font-heading text-2xl font-semibold text-white">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-starlight/50 line-through">{formatPrice(product.compareAtPrice!)}</span>
            )}
          </>
        ) : (
          <span className="text-sm text-starlight/70">Price on enquiry</span>
        )}
      </div>

      <p className="max-w-xl text-base leading-relaxed text-starlight/75">{product.description}</p>

      <div className="flex flex-wrap gap-3">
        <WhatsAppButton message={productEnquiryMessage({ name: product.name, sku: product.sku })}>
          Enquire on WhatsApp
        </WhatsAppButton>
        <Button href="/shop" variant="secondary-dark">
          Back to Shop
        </Button>
      </div>

      {product.specifications.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
          <h2 className="font-heading text-lg font-semibold text-white">Specifications</h2>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-0.5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-starlight/55">{spec.label}</dt>
                <dd className="text-sm text-white">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {product.compatibility && (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
          <h2 className="font-heading text-lg font-semibold text-white">Compatibility</h2>
          <p className="text-sm leading-relaxed text-starlight/75">{product.compatibility}</p>
        </div>
      )}

      {product.sku && (
        <p className="border-t border-white/10 pt-6 text-xs text-starlight/50">
          SKU: <span className="text-starlight/75">{product.sku}</span>
        </p>
      )}
    </div>
  )
}

function RelatedProducts({ product }: { product: ProductDetailType }) {
  const categorySlug = product.categorySlug
  const related = useAsyncData(
    () => (categorySlug ? fetchRelatedProducts(categorySlug, product.id) : Promise.resolve([])),
    [categorySlug, product.id],
  )

  if (!categorySlug) return null
  if (!related.loading && !related.error && (related.data?.length ?? 0) === 0) return null

  return (
    <section className="border-t border-white/10 py-16 lg:py-20">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-champagne">More Like This</span>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            More in {product.category}
          </h2>
        </div>

        <ProductGrid
          products={related.data}
          loading={related.loading}
          error={related.error}
          onRetry={related.refetch}
          skeletonCount={4}
        />
      </Container>
    </section>
  )
}

export function ProductDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: product, loading, error, refetch } = useAsyncData(() => fetchProductDetailBySlug(slug), [slug])

  usePageTitle(product ? `${product.name} — ASTERA` : 'Product — ASTERA')

  return (
    <main className="bg-space-black">
      <section className="py-10 lg:py-14">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              ...(product?.categorySlug
                ? [{ label: product.category, href: `/categories/${product.categorySlug}` }]
                : []),
              { label: product?.name ?? 'Product' },
            ]}
          />

          {loading ? (
            <ProductDetailSkeleton />
          ) : error ? (
            <ErrorState
              onRetry={refetch}
              description="Something went wrong loading this product. Please try again."
            />
          ) : !product ? (
            <EmptyState
              icon={IconPackageSearch}
              title="Product not found"
              description="This product may have been unpublished, archived, or the link may be incorrect."
              action={
                <Button href="/shop" variant="secondary-dark" withArrow>
                  Browse the Catalogue
                </Button>
              }
            />
          ) : (
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <ProductGallery product={product} />
              <ProductInfo product={product} />
            </div>
          )}
        </Container>
      </section>

      {product && <RelatedProducts product={product} />}
    </main>
  )
}

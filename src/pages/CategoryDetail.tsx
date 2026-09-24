import { useParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchCategoryBySlug, fetchProductsByCategorySlug } from '../lib/api'
import { Container } from '../components/common/Container'
import { Button } from '../components/common/Button'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { IconTile } from '../components/common/IconTile'
import { Skeleton } from '../components/common/Skeleton'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { ProductGrid } from '../components/product/ProductGrid'

export function CategoryDetail() {
  const { slug = '' } = useParams<{ slug: string }>()

  const categoryState = useAsyncData(() => fetchCategoryBySlug(slug), [slug])
  const productsState = useAsyncData(() => fetchProductsByCategorySlug(slug), [slug])

  const category = categoryState.data
  usePageTitle(category ? `${category.name} — ASTERA` : 'Category — ASTERA')

  const notFound = !categoryState.loading && !categoryState.error && !category

  return (
    <main className="bg-space-black">
      <section className="border-b border-white/10 py-12 lg:py-16">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Categories', href: '/categories' },
              { label: category?.name ?? 'Category' },
            ]}
          />

          {categoryState.loading ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          ) : categoryState.error ? (
            <ErrorState
              onRetry={categoryState.refetch}
              description="Something went wrong loading this category. Please try again."
            />
          ) : notFound ? (
            <EmptyState
              title="Category not found"
              description="This category may have been unpublished, archived, or the link may be incorrect."
              action={
                <Button href="/categories" variant="secondary-dark" withArrow>
                  View All Categories
                </Button>
              }
            />
          ) : (
            category && (
              <div className="flex flex-col gap-4">
                <IconTile icon={category.icon} tone="dark" />
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {category.name}
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-starlight/75">{category.description}</p>
              </div>
            )
          )}
        </Container>
      </section>

      {!notFound && !categoryState.error && (
        <section className="py-12 lg:py-16">
          <Container className="flex flex-col gap-6">
            {!productsState.loading && productsState.data && (
              <p className="text-sm text-starlight/60">
                {productsState.data.length} {productsState.data.length === 1 ? 'product' : 'products'} in this category
              </p>
            )}

            <ProductGrid
              products={productsState.data}
              loading={productsState.loading}
              error={productsState.error}
              onRetry={productsState.refetch}
              emptyTitle="No products in this category yet"
              emptyDescription="ASTERA hasn't published anything here yet — check back as the catalogue grows."
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

import type { Category } from '../../types/catalogue'
import type { AsyncResult } from '../../hooks/useAsyncData'
import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { CategoryGrid } from '../category/CategoryGrid'

const MAX_VISIBLE = 8

type CategoryShowcaseProps = {
  state: AsyncResult<Category[]>
}

export function CategoryShowcase({ state }: CategoryShowcaseProps) {
  const { data: categories, loading, error, refetch } = state

  return (
    <section id="categories" className="bg-slate-50 py-20 lg:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Discovery Grid"
          heading="Curated for Your Daily Essentials"
          description="Browse accessories across fast charging, acoustics, everyday protection, and workspace connectivity."
          tone="light"
          accent="blue"
        />

        <CategoryGrid
          categories={categories?.slice(0, MAX_VISIBLE) ?? null}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </Container>
    </section>
  )
}

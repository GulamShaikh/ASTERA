import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchPublishedCategories } from '../lib/api'
import { Container } from '../components/common/Container'
import { SectionHeading } from '../components/common/SectionHeading'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { CategoryGrid } from '../components/category/CategoryGrid'

export function Categories() {
  usePageTitle('Categories — ASTERA')
  const { data: categories, loading, error, refetch } = useAsyncData(() => fetchPublishedCategories(), [])

  return (
    <main>
      <section className="bg-space-black py-12 lg:py-16">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />
          <SectionHeading
            level="h1"
            eyebrow="Browse by Category"
            heading="Every Category ASTERA Curates"
            description="Find what you need by the job it does — charging, audio, protection, or workspace connectivity."
            tone="dark"
            accent="champagne"
          />
        </Container>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <Container>
          <CategoryGrid
            categories={categories}
            loading={loading}
            error={error}
            onRetry={refetch}
            skeletonCount={8}
          />
        </Container>
      </section>
    </main>
  )
}

import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchPublishedBrands } from '../lib/api'
import { Container } from '../components/common/Container'
import { SectionHeading } from '../components/common/SectionHeading'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { BrandGrid } from '../components/brand/BrandGrid'

export function Brands() {
  usePageTitle('Brands — ASTERA')
  const { data: brands, loading, error, refetch } = useAsyncData(() => fetchPublishedBrands(), [])

  return (
    <main className="bg-midnight">
      <section className="py-12 lg:py-16">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Brands' }]} />
          <SectionHeading
            level="h1"
            eyebrow="Brand Discovery"
            heading="Where New Brands Get Discovered."
            description="Explore the emerging and independent accessory brands ASTERA curates, and the products each one makes."
            tone="dark"
            accent="champagne"
          />
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <BrandGrid brands={brands} loading={loading} error={error} onRetry={refetch} skeletonCount={6} />
        </Container>
      </section>
    </main>
  )
}

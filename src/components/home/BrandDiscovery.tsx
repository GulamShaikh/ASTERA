import type { Brand } from '../../types/catalogue'
import type { AsyncResult } from '../../hooks/useAsyncData'
import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { Button } from '../common/Button'
import { Starfield } from '../common/Starfield'
import { BrandGrid } from '../brand/BrandGrid'

const MAX_VISIBLE = 3

type BrandDiscoveryProps = {
  state: AsyncResult<Brand[]>
}

export function BrandDiscovery({ state }: BrandDiscoveryProps) {
  const { data: brands, loading, error, refetch } = state

  return (
    <section id="brand-discovery" className="relative isolate overflow-hidden bg-midnight py-20 lg:py-24">
      <Starfield count={32} glints={4} seed={23} className="-z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_70%)]"
      />

      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Brand Discovery"
          heading="Where New Brands Get Discovered."
          description="Explore emerging and independent accessory brands bringing new ideas to everyday technology."
          tone="dark"
          accent="champagne"
        />

        <BrandGrid
          brands={brands?.slice(0, MAX_VISIBLE) ?? null}
          loading={loading}
          error={error}
          onRetry={refetch}
        />

        {brands && brands.length > 0 && (
          <div className="flex justify-center">
            <Button href="/brands" variant="secondary-dark" withArrow>
              View All Brands
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}

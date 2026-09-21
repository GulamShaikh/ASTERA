import { brands } from '../../data/brands'
import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { BrandCard } from '../brand/BrandCard'

export function BrandDiscovery() {
  return (
    <section id="brand-discovery" className="bg-midnight py-20 lg:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Brand Discovery"
          heading="Where New Brands Get Discovered."
          description="Explore emerging and independent accessory brands bringing new ideas to everyday technology."
          tone="dark"
          accent="champagne"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </Container>
    </section>
  )
}

import { usePageTitle } from '../hooks/usePageTitle'
import { CURATION_PRINCIPLES } from '../content/site'
import { Container } from '../components/common/Container'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { WhyAstera } from '../components/home/WhyAstera'
import { FinalCta } from '../components/home/FinalCta'
import { IconStar } from '../components/common/icons'

export function About() {
  usePageTitle('About — ASTERA')

  return (
    <main>
      <section className="bg-space-black py-12 lg:py-16">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-champagne">
              <IconStar className="h-3.5 w-3.5" />
              About ASTERA
            </span>

            <h1 className="font-heading max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Exploring New Brands. Delivering Quality.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-starlight/75">
              ASTERA is a curator of mobile and tech accessories. Rather than stocking whatever sells fastest, ASTERA
              looks for emerging, independent, and local brands making things worth using every day — then presents
              them clearly, with the details that actually help you choose.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-midnight py-20 lg:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Small Brands. Big Possibilities."
            heading="What ASTERA Actually Does"
            description="A curator, not simply a reseller — here's what that means in practice."
            tone="dark"
            accent="champagne"
          />

          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CURATION_PRINCIPLES.map((principle, index) => (
              <li
                key={principle.title}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="font-heading text-sm font-semibold text-champagne">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-lg font-semibold text-white">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-starlight/70">{principle.description}</p>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <Button href="/brands" variant="primary" withArrow>
              Meet the Brands
            </Button>
            <Button href="/shop" variant="secondary-dark">
              Browse the Catalogue
            </Button>
          </div>
        </Container>
      </section>

      <WhyAstera />
      <FinalCta />
    </main>
  )
}

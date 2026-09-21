import { products } from '../../data/products'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { IconStar, IconBadgeCheck } from '../common/icons'

const TRUST_POINTS = ['Curated Drops', 'Quality-Focused', 'Emerging & Local Brands', 'Everyday Usefulness']

const spotlight = products.find((product) => product.featured) ?? products[0]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-space-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-20%] h-[560px] w-[560px] rounded-full border border-white/[0.06]" />
        <div className="absolute right-[5%] top-[5%] h-[380px] w-[380px] rounded-full border border-white/[0.08]" />
        <div className="absolute right-[18%] top-[22%] h-[180px] w-[180px] rounded-full border border-cosmic-blue/20" />
      </div>

      <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-champagne">
            <IconStar className="h-3.5 w-3.5" />
            Exploring New Brands · Delivering Quality
          </span>

          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover What&apos;s New.
            </h1>
            <p className="font-heading text-xl font-medium text-starlight/90 sm:text-2xl">
              Exploring New Brands. Delivering Quality.
            </p>
          </div>

          <p className="max-w-lg text-base leading-relaxed text-starlight/70">
            Discover mobile and tech accessories from new and emerging brands, selected for everyday use.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href="/shop" variant="primary" withArrow>
              Explore Products
            </Button>
            <Button href="/shop" variant="secondary-dark">
              Shop Categories
            </Button>
          </div>

          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-starlight/70">
                <IconBadgeCheck className="h-4 w-4 text-cosmic-blue" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-champagne">
              <IconStar className="h-3.5 w-3.5" />
              ASTERA Spotlight
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-starlight/70">
              Featured Drop
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl bg-white/[0.03]">
            <img
              src="/images/hero/astera-spotlight-kit.png"
              alt="Featured ASTERA accessory kit: charging cable, wall charger, and wireless earbuds"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-starlight/60">Featured Suite</span>
              <p className="font-heading text-lg font-semibold text-white">{spotlight.name}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-starlight/65">
            <span>Curated for Daily Use</span>
            <span>Online Discovery</span>
          </div>
        </div>
      </Container>
    </section>
  )
}

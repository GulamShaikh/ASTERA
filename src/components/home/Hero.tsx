import { Link } from 'react-router-dom'
import type { Product } from '../../types/catalogue'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { Skeleton } from '../common/Skeleton'
import { Starfield } from '../common/Starfield'
import { IconSparkle, IconBadgeCheck } from '../common/icons'
import { formatPrice } from '../../lib/format'

const TRUST_POINTS = ['Curated Drops', 'Quality-Focused', 'Emerging & Local Brands', 'Everyday Usefulness']

type HeroProps = {
  products: Product[] | null
}

export function Hero({ products }: HeroProps) {
  const spotlight = products?.find((product) => product.featured) ?? products?.[0] ?? null

  return (
    // `isolate` keeps the -z-10 decorative layers inside this section; `overflow-hidden` clips the orbit rings so they never cause horizontal scroll.
    <section className="relative isolate overflow-hidden bg-space-black">
      {/* Atmosphere: a Midnight wash behind the spotlight, a faint Cosmic Blue haze on the left edge, and the twinkling starfield + comet. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_75%_at_80%_40%,rgba(11,19,43,0.95),transparent_72%)]" />
        <div className="absolute -left-56 top-1/4 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.13),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
        <Starfield count={50} glints={6} seed={11} comet />
      </div>

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-24 xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)] xl:gap-24 xl:px-16 xl:py-28 2xl:px-20">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-champagne">
            <IconSparkle className="h-3.5 w-3.5" />
            Exploring New Brands · Delivering Quality
          </span>

          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl 2xl:text-7xl">
              Discover What&apos;s New.
            </h1>
            <p className="font-heading text-xl font-medium text-starlight/90 sm:text-2xl">
              Exploring New Brands. Delivering Quality.
            </p>
          </div>

          <p className="max-w-lg text-base leading-relaxed text-starlight/70 sm:text-lg">
            Discover mobile and tech accessories from new and emerging brands, selected for everyday use.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href="/shop" variant="primary" withArrow>
              Explore Products
            </Button>
            <Button href="/categories" variant="secondary-dark">
              Shop Categories
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-starlight/70">
                <IconBadgeCheck className="h-4 w-4 text-cosmic-blue" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
          {/* Orbit system, centred on the spotlight card. Only the inner SVGs rotate (CSS classes in global.css). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[128%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),rgba(11,19,43,0.55)_45%,transparent_70%)] blur-2xl" />

            <svg viewBox="0 0 640 640" className="orbit-ring absolute inset-0 h-full w-full">
              <circle cx="320" cy="320" r="316" fill="none" stroke="rgba(229,231,235,0.18)" strokeWidth="1.25" strokeDasharray="2 10" />
              <circle cx="320" cy="4" r="9" fill="rgba(142,197,255,0.15)" />
              <circle cx="320" cy="4" r="3.5" fill="#8ec5ff" />
            </svg>

            <svg viewBox="0 0 640 640" className="orbit-ring-reverse absolute left-[8%] top-[8%] h-[84%] w-[84%]">
              <ellipse cx="320" cy="320" rx="314" ry="206" fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1.25" />
              <circle cx="634" cy="320" r="3" fill="#e2c08d" />
            </svg>
          </div>

          <IconSparkle className="sparkle pointer-events-none absolute -right-3 top-[12%] z-10 h-6 w-6 text-champagne drop-shadow-[0_0_6px_rgba(226,192,141,0.35)] sm:-right-9 sm:h-7 sm:w-7 lg:-right-12" />
          <IconSparkle className="sparkle sparkle-delayed pointer-events-none absolute -left-6 bottom-[16%] z-10 hidden h-3.5 w-3.5 text-champagne/70 sm:block lg:-left-9" />

          <div className="group/card relative rounded-2xl border border-white/10 bg-midnight bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] transition-[translate,border-color,box-shadow] duration-500 ease-out hover:border-white/20 hover:shadow-[0_36px_80px_-30px_rgba(37,99,235,0.45)] motion-safe:hover:-translate-y-1.5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-champagne">
                <IconSparkle className="h-3.5 w-3.5" />
                ASTERA Spotlight
              </span>
              <span className="rounded-full border border-champagne/30 px-3 py-1 text-[11px] font-medium text-champagne">
                Featured Drop
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl bg-white/[0.03]">
              <img
                src="/images/hero/astera-spotlight-kit.png"
                alt="Featured ASTERA accessory kit: charging cable, wall charger, and wireless earbuds"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover/card:scale-[1.03]"
              />
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-starlight/60">Featured Suite</span>
                {spotlight ? (
                  <Link
                    to={`/product/${spotlight.id}`}
                    className="font-heading text-lg font-semibold text-white transition-colors hover:text-starlight"
                  >
                    {spotlight.name}
                  </Link>
                ) : (
                  <Skeleton className="h-6 w-44" />
                )}
              </div>
              {spotlight?.price !== undefined && (
                <span className="font-heading shrink-0 text-xl font-semibold text-cosmic-blue-light">
                  {formatPrice(spotlight.price)}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-starlight/65">
              <span>Curated for Daily Use</span>
              <span className="text-champagne/90">Online Discovery</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

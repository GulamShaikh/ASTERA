import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { Starfield } from '../common/Starfield'
import { IconSparkle } from '../common/icons'

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-midnight py-20 lg:py-24">
      <Starfield count={40} glints={5} seed={5} comet className="-z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] max-w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.16),transparent_70%)]"
      />

      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/30 bg-cosmic-blue/10 text-champagne">
          <IconSparkle className="sparkle h-6 w-6" />
        </span>

        <h2 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Find Your Next Everyday Essential.
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-starlight/70">
          Explore mobile accessories and discover new brands built for everyday use.
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button href="/shop" variant="primary" withArrow>
            Explore Products
          </Button>
          <Button href="/categories" variant="secondary-dark">
            Browse Categories
          </Button>
        </div>
      </Container>
    </section>
  )
}

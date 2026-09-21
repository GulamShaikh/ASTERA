import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { IconStar } from '../common/icons'

export function FinalCta() {
  return (
    <section className="bg-midnight py-20 lg:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/30 text-champagne">
          <IconStar className="h-5 w-5" />
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
          <Button href="/shop" variant="secondary-dark">
            Browse Categories
          </Button>
        </div>
      </Container>
    </section>
  )
}

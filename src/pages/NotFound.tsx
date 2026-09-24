import { usePageTitle } from '../hooks/usePageTitle'
import { Container } from '../components/common/Container'
import { Button } from '../components/common/Button'
import { IconPackageSearch } from '../components/common/icons'

export function NotFound() {
  usePageTitle('Page Not Found — ASTERA')

  return (
    <main className="flex flex-1 items-center bg-space-black py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-starlight/50">
          <IconPackageSearch className="h-6 w-6" />
        </span>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-champagne">Error 404</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            This Page Doesn&apos;t Exist
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-starlight/70">
            The link may be out of date, or the page may have moved. The catalogue is still right where you left it.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/shop" variant="primary" withArrow>
            Browse Products
          </Button>
          <Button href="/" variant="secondary-dark">
            Back to Home
          </Button>
        </div>
      </Container>
    </main>
  )
}

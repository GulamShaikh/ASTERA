import { useState } from 'react'
import { Logo } from '../brand/Logo'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { IconMenu, IconClose } from '../common/icons'

const NAV_LINKS = [
  { label: 'Categories', href: '#categories' },
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Brands', href: '#brand-discovery' },
  { label: 'Why ASTERA', href: '#why-astera' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-space-black/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <a href="/" aria-label="ASTERA home" className="inline-flex shrink-0 items-center">
          <Logo variant="dark-bg" className="h-9 w-auto" />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-starlight/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#new-arrivals" variant="primary" withArrow>
            Explore Products
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-white/15 p-2 text-white lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </Container>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-white/10 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-starlight/85 hover:bg-white/5 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 px-3">
              <Button href="#new-arrivals" variant="primary" withArrow className="w-full" onClick={() => setMenuOpen(false)}>
                Explore Products
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

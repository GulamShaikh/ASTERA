import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { IconMenu, IconClose } from '../common/icons'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Brands', href: '/#brand-discovery' },
  { label: 'Why ASTERA', href: '/#why-astera' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-space-black/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link to="/" aria-label="ASTERA home" className="inline-flex shrink-0 items-center">
          <Logo variant="dark-bg" className="h-9 w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-starlight/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/shop" variant="primary" withArrow>
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
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-starlight/85 hover:bg-white/5 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 px-3">
              <Button href="/shop" variant="primary" withArrow className="w-full" onClick={() => setMenuOpen(false)}>
                Explore Products
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

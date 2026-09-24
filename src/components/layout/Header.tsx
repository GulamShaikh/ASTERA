import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LogoLockup } from '../brand/LogoLockup'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { IconMenu, IconClose } from '../common/icons'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Each link already closes the menu on click; this covers Back/Forward
  // navigation, which changes the route without any click on the menu.
  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-space-black/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <LogoLockup />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `group/nav text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-starlight/80 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1.5 h-0.5 w-full origin-center rounded-full bg-champagne transition-[opacity,scale] duration-300 ease-out ${
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover/nav:scale-x-100 group-hover/nav:opacity-50 group-focus-visible/nav:scale-x-100 group-focus-visible/nav:opacity-50'
                    }`}
                  />
                </span>
              )}
            </NavLink>
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
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-white/5 text-white' : 'text-starlight/85 hover:bg-white/5 hover:text-white'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
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

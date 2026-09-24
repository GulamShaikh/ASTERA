import { Link } from 'react-router-dom'
import { LogoLockup } from '../brand/LogoLockup'
import { IconLock, IconSparkle } from '../common/icons'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { Skeleton } from '../common/Skeleton'
import { useAsyncData } from '../../hooks/useAsyncData'
import { fetchPublishedCategories } from '../../lib/api'

const MAX_FOOTER_CATEGORIES = 4

const STATIC_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'Categories', href: '/categories' },
      { label: 'Brand Discovery', href: '/brands' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About ASTERA', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partner Brands', href: '/brands' },
    ],
  },
]

export function Footer() {
  // The footer mounts once for the whole SPA session, so this is a single query.
  const { data: categories, loading } = useAsyncData(() => fetchPublishedCategories(), [])
  const footerCategories = categories?.slice(0, MAX_FOOTER_CATEGORIES) ?? []

  return (
    <footer className="border-t border-white/10 bg-space-black">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-4">
          <LogoLockup />
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne">
            <IconSparkle className="h-3.5 w-3.5" />
            Small Brands. Big Possibilities.
          </span>
          <p className="max-w-sm text-sm leading-relaxed text-starlight/65">
            Exploring New Brands. Delivering Quality. Curated mobile and tech accessories from emerging and local
            brands, selected for everyday usefulness.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATIC_COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-starlight/60">{column.heading}</h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-starlight/75 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-starlight/60">Categories</h3>
            {loading ? (
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: MAX_FOOTER_CATEGORIES }, (_, index) => (
                  <Skeleton key={index} className="h-4 w-24" />
                ))}
              </div>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {footerCategories.map((category) => (
                  <li key={category.id}>
                    <Link to={`/categories/${category.id}`} className="text-sm text-starlight/75 hover:text-white">
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/categories" className="text-sm text-starlight/75 hover:text-white">
                    View all
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-starlight/60">Support</h3>
            <p className="text-sm leading-relaxed text-starlight/75">
              Questions about a product or a brand we feature? We&apos;re happy to help you find the right fit.
            </p>
            <Button href="/contact" variant="secondary-dark" className="w-fit px-4 py-2 text-xs">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-starlight/50">
          <p>
            ASTERA curates and sells accessories from independent and emerging brands. Product names, logos, and
            trademarks belong to their respective owners.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} ASTERA. All rights reserved.</p>
            {/* Deliberately discreet: the owner's entry point to the CMS, not something shoppers need to notice. */}
            <Link
              to="/admin"
              aria-label="Admin sign in"
              title="Admin sign in"
              className="rounded-md p-1 text-starlight/25 transition-colors hover:text-starlight/70"
            >
              <IconLock className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}

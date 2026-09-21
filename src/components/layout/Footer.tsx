import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Container } from '../common/Container'
import { Button } from '../common/Button'
import { categories } from '../../data/categories'

const FEATURED_CATEGORY_IDS = ['chargers', 'cables', 'earphones', 'screen-protectors']

function categoryHref(name: string) {
  return `/shop?category=${encodeURIComponent(name)}`
}

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'New Arrivals', href: '/shop' },
      { label: 'Brand Discovery', href: '/#brand-discovery' },
    ],
  },
  {
    heading: 'Categories',
    links: categories
      .filter((category) => FEATURED_CATEGORY_IDS.includes(category.id))
      .map((category) => ({ label: category.name, href: categoryHref(category.name) })),
  },
  {
    heading: 'Company',
    links: [
      { label: 'About ASTERA', href: '/#why-astera' },
      { label: 'Partner Brands', href: '/#brand-discovery' },
      { label: 'Brand Criteria', href: '/#why-astera' },
    ],
  },
]

const LEGAL_LINKS = ['Shipping & Delivery', 'Return Policy', 'Privacy Policy', 'Terms of Service']

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-space-black">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-4">
          <Logo variant="dark-bg" className="h-9 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-starlight/65">
            Exploring New Brands. Delivering Quality. Curated mobile and tech accessories from emerging and local
            brands, selected for everyday usefulness.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
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

          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-starlight/60">Support</h3>
            <p className="text-sm leading-relaxed text-starlight/75">
              Questions about a product or a brand we feature? We&apos;re happy to help you find the right fit.
            </p>
            <Button variant="secondary-dark" className="w-fit px-4 py-2 text-xs">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-starlight/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ASTERA. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((label) => (
              <li key={label}>
                <a href="#" className="text-starlight/60 hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../brand/Logo'
import {
  IconClose,
  IconDevice,
  IconHub,
  IconMenu,
  IconShoppingBag,
  IconStar,
  IconBadgeCheck,
} from '../common/icons'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: IconDevice, end: true },
  { label: 'Products', href: '/admin/products', icon: IconShoppingBag, end: false },
  { label: 'Categories', href: '/admin/categories', icon: IconHub, end: false },
  { label: 'Brands', href: '/admin/brands', icon: IconStar, end: false },
  { label: 'Media', href: '/admin/media', icon: IconBadgeCheck, end: false },
]

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-cosmic-blue/15 text-white' : 'text-starlight/70 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function SessionPanel({ compact = false }: { compact?: boolean }) {
  const { email, fullName, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${compact ? '' : 'border-t border-white/10 pt-4'}`}>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-starlight/45">Signed in as</span>
        <span className="truncate text-sm font-medium text-white">{fullName ?? email ?? 'Administrator'}</span>
        {fullName && email && <span className="truncate text-xs text-starlight/50">{email}</span>}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
      >
        {signingOut ? 'Signing out…' : 'Log out'}
      </button>
    </div>
  )
}

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-space-black text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between border-r border-white/10 bg-midnight p-5 lg:flex">
        <div className="flex flex-col gap-7">
          <Link to="/admin" className="inline-flex items-center gap-2">
            <Logo variant="dark-bg" className="h-8 w-auto" />
            <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-starlight/60">
              Admin
            </span>
          </Link>
          <AdminNav />
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xs text-starlight/50 hover:text-white">
            ← View public site
          </Link>
          <SessionPanel />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-space-black/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/admin" className="inline-flex items-center gap-2">
          <Logo variant="dark-bg" className="h-7 w-auto" />
          <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-starlight/60">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-nav"
          aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'}
          className="rounded-lg border border-white/15 p-2 text-white"
        >
          {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </header>

      {menuOpen && (
        <div id="admin-mobile-nav" className="border-b border-white/10 bg-midnight px-4 py-4 lg:hidden">
          <AdminNav onNavigate={() => setMenuOpen(false)} />
          <div className="mt-4 border-t border-white/10 pt-4">
            <Link to="/" className="mb-3 block text-xs text-starlight/50 hover:text-white">
              ← View public site
            </Link>
            <SessionPanel compact />
          </div>
        </div>
      )}

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

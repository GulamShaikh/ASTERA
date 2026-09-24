import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Logo } from '../../components/brand/Logo'
import { AdminFormField, adminInputClasses } from '../../components/admin/AdminFormField'

export function AdminLogin() {
  usePageTitle('Admin Sign In — ASTERA')
  const { status, signIn } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (status === 'admin') return <Navigate to={redirectTo} replace />
  if (status === 'not-admin') return <Navigate to="/admin/access-denied" replace />

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn(email.trim(), password)
      // The auth listener flips `status`, which redirects above.
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-space-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo variant="dark-bg" className="h-9 w-auto" />
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-xl font-semibold text-white">Catalogue Admin</h1>
            <p className="text-sm text-starlight/60">Sign in to manage products, categories, and brands.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-6"
        >
          <AdminFormField label="Email" htmlFor="admin-email" required>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              className={adminInputClasses}
            />
          </AdminFormField>

          <AdminFormField label="Password" htmlFor="admin-password" required>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
                className={`${adminInputClasses} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-starlight/60 hover:text-white"
                aria-pressed={showPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </AdminFormField>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-cosmic-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cosmic-blue/90 disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-starlight/45">
            Admin accounts are created by ASTERA directly. There is no public sign-up.
          </p>
        </form>
      </div>
    </main>
  )
}

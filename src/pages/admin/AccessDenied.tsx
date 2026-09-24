import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AccessDenied() {
  usePageTitle('Access Denied — ASTERA')
  const { email, signOut } = useAuth()
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
    <main className="flex min-h-screen items-center justify-center bg-space-black px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <h1 className="font-heading text-xl font-semibold text-white">Access Denied</h1>
        <p className="mt-3 text-sm leading-relaxed text-starlight/65">
          {email ? (
            <>
              <span className="text-white">{email}</span> is signed in, but doesn&apos;t have catalogue admin access.
            </>
          ) : (
            'This account does not have catalogue admin access.'
          )}
        </p>
        <p className="mt-2 text-xs text-starlight/45">
          Admin access is granted by ASTERA directly. If this is unexpected, contact whoever set up the account.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-lg bg-cosmic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cosmic-blue/90 disabled:opacity-60"
          >
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </button>
          <Link
            to="/"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            Back to Site
          </Link>
        </div>
      </div>
    </main>
  )
}

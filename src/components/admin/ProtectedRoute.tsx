import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * UX-level gate for /admin/*. The real boundary is RLS — a non-admin who
 * bypassed this still can't read drafts or write anything.
 */
export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black" aria-busy="true">
        <span className="text-sm text-starlight/60">Checking your session…</span>
      </div>
    )
  }

  if (status === 'signed-out') {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />
  }

  if (status === 'not-admin') {
    return <Navigate to="/admin/access-denied" replace />
  }

  return <Outlet />
}

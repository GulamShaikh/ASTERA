import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../components/admin/AuthProvider'

/** Scopes the Supabase session to /admin/* — the public site never loads it. */
export function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
